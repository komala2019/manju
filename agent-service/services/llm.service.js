import { formatAnswer, extractFollowupsFromAnswer } from './response-formatter.js';

async function fetchWithRetry(url, options, maxRetries = 3, initialDelay = 1500) {
  let delay = initialDelay;
  const REQUEST_TIMEOUT_MS = 15000; // 15 second total timeout per request

  for (let i = 0; i < maxRetries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) return res;
      if (res.status === 429 || res.status === 503 || res.status >= 500) {
        console.warn(`[LLM Service] Gemini returned ${res.status}. Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      return res;
    } catch (err) {
      clearTimeout(timeout);

      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
        timeoutErr.code = 'ECONNABORTED';
        if (i === maxRetries - 1) throw timeoutErr;
        console.warn(`[LLM Service] Request timeout. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      if (i === maxRetries - 1) throw err;
      console.warn(`[LLM Service] Network error. Retrying in ${delay}ms...`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are Manju Assistant — the in-app helper for Manju, a members-only job platform for IIT & IIM alumni in India (senior roles, ₹40 LPA+, alumni referrals).

Rules:
- Answer ONLY using the retrieved KB context. If the context doesn't cover the question, say so briefly and suggest what you CAN help with — never invent platform features.
- Be warm, concise and practical. Prefer **bullet lists over paragraphs**. Use **bold** for key terms. Light emoji use is fine (max 1-2 per answer).
- If the user's persona is provided, address them by first name and tailor advice to their title, experience and institute (e.g. a senior engineer gets engineering-leaning examples).
- Reference concrete UI elements when relevant ("click Apply with Manju", "open the Tracker", "Edit profile").
- **Formatting rules:**
  - Use short paragraphs (1-2 sentences max).
  - Use • bullet points for lists, NOT * or numbers.
  - Use **bold** for platform features, buttons, filters.
  - Use \`backticks\` for specific values (e.g. \`₹40 LPA+\`).
  - Avoid markdown nested lists; keep it flat.
- End your reply with EXACTLY one line in this format (it is parsed and removed, the user never sees the raw line):
FOLLOWUPS: <question 1> | <question 2> | <question 3>
The follow-ups must be short, natural next questions the user might tap, directly related to your answer.`;

function escapePromptText(s) {
  if (!s) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ');
}

function buildPersonaBlock(persona) {
  if (!persona) return '';
  const bits = [];

  // Safe name extraction with fallbacks
  const firstName = persona.first || persona.name;
  if (firstName && typeof firstName === 'string' && firstName.trim()) {
    bits.push(`Name: ${escapePromptText(firstName)}`);
  }

  if (persona.title && typeof persona.title === 'string') {
    bits.push(`Title: ${escapePromptText(persona.title)}`);
  }
  if (persona.current && typeof persona.current === 'string') {
    bits.push(`Company: ${escapePromptText(persona.current)}`);
  }
  if (persona.institute && typeof persona.institute === 'string') {
    const institute = escapePromptText(persona.institute);
    const batch = persona.batch && typeof persona.batch === 'string'
      ? ` (batch ${escapePromptText(persona.batch)})`
      : '';
    bits.push(`Institute: ${institute}${batch}`);
  }
  if (persona.location && typeof persona.location === 'string') {
    bits.push(`Location: ${escapePromptText(persona.location)}`);
  }
  if (persona.completeness != null && typeof persona.completeness === 'number') {
    bits.push(`Profile completeness: ${persona.completeness}%`);
  }
  if (Array.isArray(persona.skills) && persona.skills.length > 0) {
    const skills = persona.skills
      .filter(s => typeof s === 'string' && s.trim())
      .slice(0, 5)
      .map(escapePromptText)
      .join(', ');
    if (skills) bits.push(`Top skills: ${skills}`);
  }

  if (!bits.length) return '';
  return `User persona (tailor your reply to them):\n${bits.join('\n')}\n`;
}


// Unified confidence scoring across all routes
function scoreConfidence(kbScore, route) {
  if (!kbScore || typeof kbScore !== 'number') {
    return 60; // default
  }

  // Clamp score to [0, 1]
  const normalized = Math.max(0, Math.min(1, kbScore));

  switch (route) {
    case 'kb-match':
      // KB direct match: 40 base + (kbScore * 60) = 40-100 range
      return Math.min(97, Math.round(40 + normalized * 60));

    case 'gemini-llm':
      // LLM with context: 50 base + (kbScore * 50) = 50-100 range
      return Math.min(96, Math.round(50 + normalized * 50));

    case 'fallback':
      // Fallback: 35 base when low KB score
      return 35;

    default:
      return 60;
  }
}

function fallbackAnswer(message, context) {
  const top = context[0];
  const KB_CONFIDENCE_THRESHOLD = 0.5; // 50% minimum similarity

  // Require 50%+ similarity to return KB directly; below that use fallback
  if (top && top.score >= KB_CONFIDENCE_THRESHOLD) {
    return {
      route: 'kb-match',
      model: 'kb-fallback',
      answer: `Here's what I found in **${top.title}**:\n\n${top.content}`,
      confidence: scoreConfidence(top.score, 'kb-match'),
      followups: [],
    };
  }
  return {
    route: 'fallback',
    model: 'kb-fallback',
    answer: `I couldn't find a confident answer for that. I can help with job search, applications, referrals, the tracker, and your profile — try one of the suggestions below, or rephrase your question.`,
    confidence: scoreConfidence(0, 'fallback'),
    followups: [],
  };
}

async function generateGeminiAnswer(message, context, apiKey, history = [], persona = null) {
  const kbContext = context.map(item => `- ${item.id}: ${item.title}\n  ${item.content}`).join('\n\n');

  // Prior turns: support both {role,text} and {role,content} shapes from the frontend
  // Deduplicate consecutive identical messages (e.g., resends)
  const seen = new Set();
  const deduped = [];

  for (const turn of history) {
    const text = turn.text ?? turn.content ?? '';
    if (!text) continue;

    const key = `${turn.role}:${text.substring(0, 50)}`;
    if (seen.has(key)) {
      continue; // Skip duplicate
    }
    seen.add(key);
    deduped.push(turn);
  }

  const priorContents = deduped
    .map(turn => {
      const text = turn.text ?? turn.content ?? '';
      if (!text) return null;
      return {
        role: (turn.role === 'ai' || turn.role === 'assistant' || turn.role === 'model') ? 'model' : 'user',
        parts: [{ text }],
      };
    })
    .filter(Boolean)
    .slice(-8); // keep the last 8 turns

  const currentPrompt = [
    buildPersonaBlock(persona),
    'User question:',
    message,
    '',
    'Retrieved KB context:',
    kbContext || '(no relevant articles found)',
  ].join('\n');

  const contents = [
    ...priorContents,
    { role: 'user', parts: [{ text: currentPrompt }] },
  ];

  // Each model has its own free-tier quota — walk the list on 429s
  const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
  let lastErr = null;

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { temperature: 0.3 },
        }),
      }, 2, 1000);

      if (!res.ok) {
        lastErr = new Error(`Gemini ${model} failed: ${res.status} ${res.statusText}`);
        console.warn(`[LLM Service] ${lastErr.message} — trying next model`);
        continue;
      }
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply returned.';
      const { answer, followups } = extractFollowupsFromAnswer(raw);

      return {
        route: 'gemini-llm',
        model,
        answer,
        followups,
        confidence: scoreConfidence(context[0]?.score ?? 0, 'gemini-llm'),
      };
    } catch (err) {
      lastErr = err;
      console.warn(`[LLM Service] Gemini ${model} error: ${err.message} — trying next model`);
    }
  }
  throw lastErr || new Error('All Gemini models failed');
}

async function generateOpenaiAnswer(message, context, apiKey, persona = null) {
  const prompt = [
    buildPersonaBlock(persona),
    'User question:',
    message,
    '',
    'Retrieved KB context:',
    context.map(item => `- ${item.id}: ${item.title}\n  ${item.content}`).join('\n\n'),
  ].join('\n');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    let errText = '';
    try { errText = await res.text(); } catch (_) {}
    throw new Error(`OpenAI request failed with status ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || 'No reply returned.';
  const { answer, followups } = extractFollowupsFromAnswer(raw);

  return { route: 'openai-llm', model: OPENAI_MODEL, answer, followups, confidence: 88 };
}

export async function generateAnswer(message, context, history = [], persona = null) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      return await generateGeminiAnswer(message, context, geminiKey, history, persona);
    } catch (error) {
      console.warn('[LLM Service] Gemini failed, trying OpenAI backup...', error.message);
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      return await generateOpenaiAnswer(message, context, openaiKey, persona);
    } catch (error) {
      console.error('[LLM Service] OpenAI failed:', error.message);
    }
  }

  return fallbackAnswer(message, context);
}
