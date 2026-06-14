// response-formatter.js — Clean up and standardize Gemini responses

export function formatAnswer(rawAnswer) {
  if (!rawAnswer) return rawAnswer;

  let text = rawAnswer
    // Fix common markdown mistakes
    .replace(/\*\*([^*]+)\*\*/g, '**$1**')  // normalize bold
    .replace(/\n\s*\*\s+/g, '\n• ')         // convert * to • bullets
    .replace(/\n\s*-\s+/g, '\n• ')          // convert - to • bullets
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Fix spacing around punctuation
    .replace(/\s+\.\s+/g, '. ')
    // Remove orphaned ** at line start (markdown parser errors)
    .replace(/^\s*\*\*\s+/gm, '')
    .trim();

  return text;
}

export function extractFollowupsFromAnswer(text) {
  const match = text.match(/\n?FOLLOWUPS:\s*(.+)\s*$/i);
  if (!match) return { answer: text.trim(), followups: [] };

  const answer = text.slice(0, match.index).trim();
  const followups = match[1]
    .split('|')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return { answer: formatAnswer(answer), followups };
}
