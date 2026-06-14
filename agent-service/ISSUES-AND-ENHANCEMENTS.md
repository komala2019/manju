# Manju Agent - Issues & Enhancements Audit

## 🐛 CRITICAL ISSUES (Must Fix)

### 1. **Input Validation Missing**
**File:** `index.js` line 30-37  
**Issue:** No max length check on message; user could send 100KB+ strings  
**Impact:** Memory exhaustion, API timeout, token overflow  
**Fix:**
```javascript
const MAX_MESSAGE_LENGTH = 2000;
if (message.length > MAX_MESSAGE_LENGTH) {
  return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
}
```

---

### 2. **Tag Extraction Too Simplistic**
**File:** `data/kb.js` line 42-45  
**Issue:** `text.toLowerCase().includes(k)` matches partial words ("referral" in "refer me back")  
**Impact:** Wrong tags, affects semantic search quality  
**Fix:** Use word-boundary regex
```javascript
function extractTags(text) {
  const keywords = ['apply','referral','profile','job','tracker']; // ...
  return keywords.filter(k => 
    new RegExp(`\\b${k}\\b`, 'i').test(text)  // Word boundary match
  );
}
```

---

### 3. **Persona Name Parsing Unsafe**
**File:** `llm.service.js` line 45-57  
**Issue:** `persona.name?.split(' ')[0]` fails if name contains special chars  
**Impact:** Could break persona block in prompt  
**Fix:**
```javascript
const getFirstName = (persona) => {
  if (!persona) return null;
  const name = persona.first || persona.name;
  if (!name) return null;
  return String(name).trim().split(/\s+/)[0] || null;
};
```

---

### 4. **History Encoding Not Escaped**
**File:** `llm.service.js` line 96-103  
**Issue:** `buildPersonaBlock` and message don't escape JSON special chars  
**Impact:** Newlines in persona.title could break JSON in Gemini request  
**Fix:**
```javascript
const escapeNewlines = (s) => String(s || '').replace(/\n/g, ' ').replace(/"/g, '\\"');
// Use escapeNewlines on all user-provided strings in prompts
```

---

### 5. **No Message Deduplication in History**
**File:** `llm.service.js` line 84-94  
**Issue:** Frontend could send duplicate messages; they all get included  
**Impact:** Inflates context, confuses conversation flow  
**Fix:**
```javascript
const seen = new Set();
const priorContents = history
  .filter(turn => {
    const key = `${turn.role}:${turn.text.substring(0, 50)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
```

---

## ⚠️ MAJOR ENHANCEMENTS NEEDED

### 6. **No Rate Limiting / Abuse Protection**
**File:** `index.js`  
**Issue:** Anyone can spam API with 1000s of chat requests  
**Fix:** Add rate limiter by IP/user
```javascript
import rateLimit from 'express-rate-limit';
const chatLimiter = rateLimit({
  windowMs: 60000,      // 1 minute
  max: 30,              // 30 requests per minute
  message: 'Too many chat requests, try again later'
});
app.post('/api/chat', chatLimiter, ...)
```

---

### 7. **Confidence Scoring Inconsistent**
**File:** `llm.service.js` lines 62-77, 139-140  
**Issue:** Two different confidence calculation methods:
  - KB fallback: `Math.min(97, Math.round(top.score * 100))`  
  - Gemini: `Math.min(96, Math.round(60 + context[0].score * 40))`  
**Impact:** Same KB article scores differently depending on path  
**Fix:** Unified function
```javascript
function scoreConfidence(kbScore, route) {
  if (route === 'kb-only') {
    return Math.min(95, Math.round(40 + kbScore * 60));
  }
  if (route === 'gemini-llm') {
    return Math.min(90, Math.round(50 + kbScore * 50));
  }
  return 60;  // fallback
}
```

---

### 8. **Follow-up Deduplication Weak**
**File:** `intent.service.js` line 89  
**Issue:** Set dedup happens AFTER collecting all, but duplicates can still exist as similar phrasings
**Fix:** Smarter dedup
```javascript
function dedupeFollowups(followups) {
  const seen = new Set();
  return followups.filter(f => {
    const normalized = f.toLowerCase().replace(/[?!.]/g, '').substring(0, 30);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
```

---

### 9. **Error Responses Too Generic**
**File:** `index.js` line 22-27  
**Issue:** "Internal server error" gives no debugging info to frontend  
**Fix:**
```javascript
app.use((err, _req, res, _next) => {
  console.error('[API Error]', err);
  res.status(err.statusCode || 500).json({
    ok: false,
    error: err.message || 'Internal server error',
    code: err.code || 'UNKNOWN_ERROR',
    requestId: req.id  // trace back
  });
});
```

---

### 10. **No Timeout on API Calls**
**File:** `llm.service.js` line 7  
**Issue:** `fetchWithRetry` has no overall timeout, could hang for minutes  
**Fix:**
```javascript
async function fetchWithRetry(url, options, maxRetries = 3, initialDelay = 1500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);  // 15s max
  try {
    // ... existing code but add signal: controller.signal
    const res = await fetch(url, { ...options, signal: controller.signal });
    // ...
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## 🎯 NICE-TO-HAVE IMPROVEMENTS

### 11. **Add Conversation Pause Detection**
**File:** `intent.service.js`  
**Enhancement:** Detect when user changes topics abruptly  
```javascript
export function detectTopicShift(message, previousMessages) {
  if (previousMessages.length < 2) return false;
  const prev = previousMessages[previousMessages.length - 1];
  // If topics don't overlap, user shifted topics
  return !hasTopicOverlap(message, prev.text);
}
```

---

### 12. **Add Confidence Threshold Config**
**File:** `llm.service.js`  
**Enhancement:** Make 0.5 threshold configurable via env
```javascript
const KB_CONFIDENCE_THRESHOLD = parseFloat(process.env.KB_CONFIDENCE_THRESHOLD || '0.5');
if (top && top.score >= KB_CONFIDENCE_THRESHOLD) { ... }
```

---

### 13. **Add Message Logging**
**File:** `index.js`  
**Enhancement:** Log all messages for audit trail and improvement
```javascript
async function logMessage(req, res, result) {
  const log = {
    timestamp: new Date().toISOString(),
    message: req.body.message.substring(0, 100),
    intent: result.intent,
    route: result.route,
    confidence: result.confidence,
    userId: req.headers['x-user-id'],  // if available
    persona: result.persona ? 'yes' : 'no',
    kbMatch: result.context?.[0]?.id,
  };
  // Write to file or DB
  await appendLog(log);
}
```

---

### 14. **Add Response Caching**
**File:** `index.js`  
**Enhancement:** Cache common questions (30-min TTL)
```javascript
const ResponseCache = new Map();
const cacheKey = crypto.sha256(message + JSON.stringify(persona || {}));
if (ResponseCache.has(cacheKey)) {
  return res.json(ResponseCache.get(cacheKey));
}
// ... generate response ...
ResponseCache.set(cacheKey, result);  // with TTL cleanup
```

---

### 15. **Keyboard/Paste Escape Handling**
**File:** `chat-component.jsx`  
**Enhancement:** Handle paste events, escape HTML/markdown injection
```javascript
const handlePaste = (e) => {
  const text = e.clipboardData.getData('text/plain');
  // Don't allow users to paste markdown
  if (/[*`_~\\]/.test(text)) {
    e.preventDefault();
    dispatch({ type: 'TOAST', toast: { msg: 'Rich formatting not allowed', icon: 'alert' } });
  }
};
```

---

### 16. **Add User Feedback Loop**
**File:** `chat-component.jsx`  
**Enhancement:** Let users rate answer quality
```javascript
<div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
  <button onClick={() => rateResponse('helpful')}>👍 Helpful</button>
  <button onClick={() => rateResponse('notHelpful')}>👎 Unclear</button>
</div>
```

---

### 17. **Sentiment Detection on Frustration**
**File:** `intent.service.js`  
**Enhancement:** Detect frustrated users and escalate
```javascript
const FRUSTRATION_RE = /\b(not working|broken|confused|stupid|useless|terrible)\b/i;
export function detectFrustration(message) {
  return FRUSTRATION_RE.test(message);
}
// In index.js: if (detectFrustration(message)) { offer human support }
```

---

### 18. **Add Follow-up Diversity**
**File:** `intent.service.js` line 89  
**Enhancement:** Return diverse follow-ups, not all similar
```javascript
function diversifyFollowups(followups) {
  // Group by topic, pick one from each group
  const byTopic = {};
  followups.forEach(f => {
    const topic = extractTopic(f);  // 'apply' vs 'profile' vs 'referral'
    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(f);
  });
  return Object.values(byTopic).map(group => group[0]);
}
```

---

### 19. **Context Quality Scoring**
**File:** `llm.service.js`  
**Enhancement:** Score each KB article in context for relevance
```javascript
context.forEach(c => {
  c.qualityScore = (
    (c.score >= 0.7 ? 0.5 : 0) +
    (c.content.length > 200 ? 0.25 : 0) +
    (c.tags?.length > 0 ? 0.25 : 0)
  );
});
// Use top by qualityScore, not just score
```

---

### 20. **Session Management**
**File:** `chat-component.jsx`  
**Enhancement:** Track conversation sessions, allow fresh start
```javascript
<button onClick={() => {
  setMessages([initialWelcome]);
  setSuggestions([]);
  sessionStorage.setItem('chatSessionId', generateId());
}}>
  New conversation
</button>
```

---

## 📋 SUMMARY TABLE

| Issue | Severity | Category | Est. Effort |
|-------|----------|----------|------------|
| Input validation | **CRITICAL** | Security | 30 min |
| Tag extraction | **CRITICAL** | Quality | 20 min |
| Persona parsing | **CRITICAL** | Stability | 15 min |
| History encoding | **CRITICAL** | Stability | 20 min |
| Message dedup | **HIGH** | Quality | 15 min |
| Rate limiting | **HIGH** | Security | 45 min |
| Confidence scoring | **HIGH** | Quality | 30 min |
| Follow-up dedup | **MEDIUM** | UX | 20 min |
| Error responses | **MEDIUM** | DX | 25 min |
| API timeouts | **MEDIUM** | Stability | 20 min |

**Total estimated effort:** ~3.5 hours for all critical + high fixes

---

## 🔄 IMPLEMENTATION ORDER

1. **Phase 1 (Critical, 2 hours):**
   - Input validation
   - Tag extraction fix
   - Persona parsing
   - History encoding
   - API timeouts

2. **Phase 2 (High, 1.5 hours):**
   - Message deduplication
   - Rate limiting
   - Confidence scoring unification
   - Error response improvement

3. **Phase 3 (Enhancements, as time permits):**
   - Follow-up diversity
   - Response caching
   - Feedback loop
   - Session management
