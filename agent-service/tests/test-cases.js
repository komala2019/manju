// test-cases.js — Golden set and test cases for Manju Agent

export const GOLDEN_SET = {
  intents: [
    // GREETING tests
    { msg: 'hi', expected: 'greeting', reason: 'simple greeting' },
    { msg: 'Hi there!', expected: 'greeting', reason: 'greeting with context' },
    { msg: 'Hello, how are you?', expected: 'greeting', reason: 'greeting with question' },
    { msg: 'good morning!', expected: 'greeting', reason: 'time-specific greeting' },
    { msg: 'Hey, can you help?', expected: 'greeting', reason: 'greeting in multi-part message' },

    // THANKS tests
    { msg: 'thanks', expected: 'thanks', reason: 'simple thanks' },
    { msg: 'Thank you so much!', expected: 'thanks', reason: 'thanks with emphasis' },
    { msg: 'Great, that helps a lot', expected: 'thanks', reason: 'thanks variant' },
    { msg: 'Perfect! Got it.', expected: 'thanks', reason: 'thanks via confirmation' },

    // BYE tests
    { msg: 'bye', expected: 'bye', reason: 'simple goodbye' },
    { msg: 'See you later!', expected: 'bye', reason: 'goodbye variant' },
    { msg: 'Goodbye, thanks!', expected: 'bye', reason: 'goodbye with thanks' },

    // CAPABILITY tests
    { msg: 'what can you do?', expected: 'capability', reason: 'capability question' },
    { msg: 'How can you help with jobs?', expected: 'capability', reason: 'capability question' },
    { msg: 'Who are you?', expected: 'capability', reason: 'identity question' },

    // QUESTION tests (should NOT match intents)
    { msg: 'How do I apply for a job?', expected: 'question', reason: 'real question' },
    { msg: 'Tell me about referrals', expected: 'question', reason: 'info request' },
    { msg: 'What is the match score?', expected: 'question', reason: 'definition request' },
  ],

  followups: [
    {
      input: { id: 'how-to-apply', title: 'How to Apply for a Job' },
      shouldInclude: ['Can I edit my application', 'How do I write a good cover note'],
      reason: 'apply article should map to relevant follow-ups'
    },
    {
      input: { id: 'profile-completeness', title: 'Completing Your Profile' },
      shouldInclude: ['How do I add work experience', 'What boosts my match score'],
      reason: 'profile article should map to relevant follow-ups'
    },
  ],

  confidence: [
    { score: 0.9, expectedConfidence: 'high', min: 80, reason: 'excellent KB match' },
    { score: 0.7, expectedConfidence: 'high', min: 80, reason: 'good KB match' },
    { score: 0.5, expectedConfidence: 'medium', min: 60, reason: 'acceptable KB match' },
    { score: 0.3, expectedConfidence: 'low', min: 30, reason: 'weak match uses fallback' },
    { score: 0.1, expectedConfidence: 'low', min: 30, reason: 'very weak match uses fallback' },
  ],

  markdown: [
    { input: 'Text with **bold** here', expected: 'bold tags rendered', reason: 'bold formatting' },
    { input: 'Code: `₹40 LPA+` is minimum', expected: 'backticks styled', reason: 'code/value styling' },
    { input: '• Item 1\n• Item 2\n• Item 3', expected: 'bullets indented', reason: 'bullet list' },
    { input: 'Intro text\n\n• **Bold item** with `code`', expected: 'mixed formatting', reason: 'complex markdown' },
  ],

  personaEdgeCases: [
    { persona: null, expected: 'Generic greeting', reason: 'no persona' },
    { persona: { first: 'Arjun' }, expected: 'Use "Arjun"', reason: 'first name only' },
    { persona: { first: undefined, name: 'John Doe' }, expected: 'Use "John"', reason: 'fallback to full name' },
    { persona: { first: '', name: 'Jane' }, expected: 'Use "Jane"', reason: 'empty first name fallback' },
    { persona: { name: null }, expected: 'Generic', reason: 'null name' },
  ],

  errorCases: [
    { input: '', expected: 'message is required error', reason: 'empty message' },
    { input: '   ', expected: 'message is required error', reason: 'whitespace only' },
    { input: null, expected: 'handled gracefully', reason: 'null input' },
  ],

  historyEdgeCases: [
    { history: [], expected: 'no priorContents', reason: 'empty history' },
    { history: [{role: 'user', text: 'hi'}], expected: 'included in context', reason: 'single turn' },
    { history: Array.from({length: 20}, (_, i) => ({role: i % 2 ? 'user' : 'assistant', text: `msg ${i}`})),
      expected: 'only last 8 turns included', reason: 'large history truncation' },
  ],
};

export function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    errors: [],
  };

  // Test intent detection
  console.log('Testing intent detection...');
  for (const test of GOLDEN_SET.intents) {
    try {
      // This would be called by actual test runner
      // detectIntent(test.msg) should return { route, kind: test.expected }
      // results.passed++;
    } catch (err) {
      results.failed++;
      results.errors.push(`Intent: ${test.msg} - ${err.message}`);
    }
  }

  console.log(`\n✓ Passed: ${results.passed}`);
  console.log(`✗ Failed: ${results.failed}`);
  if (results.errors.length) {
    console.error('Errors:', results.errors);
  }

  return results;
}
