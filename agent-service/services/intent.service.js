// intent.service.js — lightweight intent router so greetings/smalltalk
// never hit the KB, plus starter cards and contextual follow-up prompts.

export const STARTER_CARDS = [
  {
    icon: '🔍',
    title: 'Find the right role',
    prompt: 'How do I search and filter jobs that match my profile?',
  },
  {
    icon: '📝',
    title: 'Apply with referrals',
    prompt: 'Walk me through applying for a job with an alumni referral.',
  },
  {
    icon: '📊',
    title: 'Track my applications',
    prompt: 'How does the application tracker work?',
  },
  {
    icon: '👤',
    title: 'Boost my profile',
    prompt: 'How can I improve my profile completeness and match score?',
  },
];

const GREETING_RE = /\b(hi+|hii+|hello+|hey|yo|hola|namaste|good\s+(morning|afternoon|evening)|greetings)\b/i;
const THANKS_RE = /\b(thanks|thank\s+you|thx|ty|great|awesome|cool|nice|ok(ay)?|got\s+it|perfect)\b/i;
const BYE_RE = /\b(bye+|goodbye|see\s+(ya|you)|cya|later|farewell)\b/i;
const CAPABILITY_RE = /\b(what\s+can\s+you\s+(do|help\s+with)|who\s+are\s+you|what\s+is\s+this|how\s+can\s+you\s+help|can\s+you\s+help)\b/i;

export function detectIntent(message) {
  const m = message.trim();
  if (GREETING_RE.test(m)) return { route: 'smalltalk', kind: 'greeting' };
  // Check BYE before THANKS because "goodbye, thanks" should be bye
  if (BYE_RE.test(m)) return { route: 'smalltalk', kind: 'bye' };
  if (THANKS_RE.test(m)) return { route: 'smalltalk', kind: 'thanks' };
  if (CAPABILITY_RE.test(m)) return { route: 'smalltalk', kind: 'capability' };
  return { route: 'question', kind: 'question' };
}

function getFirstName(persona) {
  if (!persona) return null;
  const rawName = persona.first || persona.name;
  if (!rawName || typeof rawName !== 'string') return null;
  const trimmed = rawName.trim();
  if (!trimmed) return null;
  const firstName = trimmed.split(/\s+/)[0];
  return firstName || null;
}

export function smalltalkReply(kind, persona) {
  const name = getFirstName(persona);
  const hello = name ? `Hi ${name}! 👋` : 'Hi there! 👋';

  switch (kind) {
    case 'greeting':
      return `${hello} I'm Manju Assistant. I can help you find roles, apply with alumni referrals, track applications, and polish your profile. Pick a card below or just ask me anything.`;
    case 'thanks':
      return `You're welcome${name ? `, ${name}` : ''}! 🙌 Anything else — finding roles, referrals, or your tracker?`;
    case 'bye':
      return `All the best${name ? `, ${name}` : ''}! 🚀 Come back anytime you need help with your job search.`;
    case 'capability':
      return `${hello} Here's what I can help with:\n\n• 🔍 **Job search** — filters, match scores, saved jobs\n• 📝 **Applications** — the 4-step apply flow, AI cover-note drafts\n• 🤝 **Referrals** — asking alumni, tracking responses\n• 📊 **Tracker** — moving applications across stages\n• 👤 **Profile** — completeness, skills, experience, résumé render\n\nWhat would you like to start with?`;
    default:
      return `${hello} How can I help with your job search today?`;
  }
}

// Contextual follow-up prompts derived from which KB articles matched
const FOLLOWUP_MAP = {
  'how-to-apply': ['Can I edit my application after sending?', 'How do I write a good cover note?'],
  'referral-requests': ['How long do alumni take to respond?', 'Can I pick more than one referrer?'],
  'job-search-filters': ['How does the match score work?', 'How do I see only roles with alumni inside?'],
  'application-tracker': ['Can I export my tracker?', 'When do recruiters see my status?'],
  'profile-completeness': ['How do I add work experience?', 'What boosts my match score the most?'],
  'cover-note-tips': ['How does "Draft for me" work?', 'What length should my cover note be?'],
  'alumni-network': ['How do I find alumni from my batch?', 'How do I ask for a referral?'],
  'matching-algorithm': ['Why is my match score low?', 'How do I improve my match score?'],
  'saved-jobs': ['Where do saved jobs appear?', 'Do saved jobs expire?'],
  'set-your-status': ['Who can see my status?', 'What status should I pick?'],
  'interview-rounds': ['How do I reschedule an interview?', 'How many rounds are typical?'],
  'compensation-expectations': ['When should I negotiate?', 'What salary range should I set?'],
  'experience-entry': ['What makes a good role description?', 'How do I add a skill?'],
  'skills-management': ['Which skills do recruiters search for?', 'How many skills should I list?'],
  'getting-started': ['How do I apply for my first job?', 'How does verification work?'],
  'troubleshooting': ['My application is not sending', 'My referrals are not responding'],
};

function normalizeFollowup(text) {
  return text.toLowerCase().replace(/[?!.]/g, '').substring(0, 30);
}

function dedupeFollowups(followups) {
  const seen = new Set();
  return followups.filter(f => {
    const normalized = normalizeFollowup(f);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function followupsFor(context = []) {
  const out = [];
  for (const item of context) {
    const f = FOLLOWUP_MAP[item.id];
    if (f) out.push(...f);
  }

  if (out.length === 0) {
    return ['How do I apply for a job?', 'How do referrals work?', 'How do I improve my profile?'];
  }

  // Deduplicate then return top 3
  const deduped = dedupeFollowups(out);
  return deduped.slice(0, 3);
}
