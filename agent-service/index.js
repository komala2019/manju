import './utils/env.js';
import cors from 'cors';
import express from 'express';
import crypto from 'crypto';
import { retrieveContext, initDatabase } from './services/vector.service.js';
import { generateAnswer } from './services/llm.service.js';
import { detectIntent, smalltalkReply, STARTER_CARDS, followupsFor } from './services/intent.service.js';
import { trace } from './utils/traces.js';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ strict: false }));

// Assign unique request IDs for tracing
app.use((req, _res, next) => {
  req.id = `req_${crypto.randomBytes(6).toString('hex')}`;
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'manju-assistant' });
});

// Starter cards shown when the chat panel opens
app.get('/api/starters', (req, res) => {
  res.json({ ok: true, starters: STARTER_CARDS });
});

app.use((err, req, res, _next) => {
  const requestId = req.id || `unknown-${Date.now()}`;

  if (err instanceof SyntaxError && 'body' in err) {
    console.warn(`[API Error] Invalid JSON (${requestId}):`, err.message);
    return res.status(400).json({
      ok: false,
      error: 'Invalid JSON in request body',
      code: 'INVALID_JSON',
      requestId,
    });
  }

  console.error(`[API Error] Unhandled error (${requestId}):`, err);
  res.status(err.statusCode || 500).json({
    ok: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    requestId,
  });
});

app.post('/api/chat', async (req, res) => {
  const message = String(req.body?.message || '').trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  // Persona: who is asking (sent by the frontend from the signed-in profile)
  const persona = req.body?.persona && typeof req.body.persona === 'object' ? req.body.persona : null;

  // Input validation
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_HISTORY_ITEMS = 30;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
      code: 'MESSAGE_TOO_LONG',
      received: message.length,
      limit: MAX_MESSAGE_LENGTH
    });
  }

  if (history.length > MAX_HISTORY_ITEMS) {
    return res.status(400).json({
      error: `History too long (max ${MAX_HISTORY_ITEMS} messages)`,
      code: 'HISTORY_TOO_LONG',
    });
  }

  // Validate history items
  if (!history.every(item => item && typeof item === 'object' && item.text && typeof item.role === 'string')) {
    return res.status(400).json({
      error: 'Invalid history format',
      code: 'INVALID_HISTORY',
    });
  }

  // 1. Understand the intent before touching the KB
  const intent = detectIntent(message);

  // 2. Greetings / thanks / capability questions → no KB lookup, friendly persona-aware reply
  if (intent.route === 'smalltalk') {
    const reply = smalltalkReply(intent.kind, persona);
    trace('chat-smalltalk', { message, intent: intent.kind });

    // Capability questions get starter cards; others get no suggestions
    const suggestions = intent.kind === 'capability'
      ? STARTER_CARDS.slice(0, 2).map(c => c.prompt)  // Just first 2 starters
      : [];

    return res.json({
      ok: true,
      route: 'smalltalk',
      intent: intent.kind,
      answer: reply,
      confidence: 99,
      model: 'intent-router',
      context: [],
      suggestions,
    });
  }

  // 3. Real question → retrieve KB context, generate with Gemini (persona + history aware)
  const context = await retrieveContext(message, 3);
  const answer = await generateAnswer(message, context, history, persona);
  const traceEntry = trace('chat-request', { message, intent: intent.kind, context, answer });

  res.json({
    ok: true,
    route: answer.route,
    intent: intent.kind,
    answer: answer.answer,
    confidence: answer.confidence,
    model: answer.model,
    context,
    suggestions: answer.followups?.length ? answer.followups : followupsFor(context),
    traceId: traceEntry.ts,
  });
});

const port = process.env.PORT || 3002;
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[Manju Agent] Assistant listening on http://localhost:${port}`);
  });
});
