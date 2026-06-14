// src/chat-component.jsx — Manju Chat UI with AI Agent (starter cards + follow-ups + persona)

// Simple markdown renderer for chat messages with XSS protection
function renderMarkdown(text) {
  if (!text) return text;

  // Sanitize to prevent XSS attacks
  if (window.DOMPurify) {
    text = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).toString();
  }

  // Split by lines first to preserve structure
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} style={{ height: '0.5em' }} />;
        }

        // Check if this line is a bullet point
        if (line.trim().startsWith('•')) {
          const content = line.replace(/^\s*•\s*/, '');

          // Now handle bold, backticks in the bullet content
          const bulletParts = content.split(/(\*\*[^*]+\*\*)/);

          return (
            <div key={lineIdx} style={{ marginLeft: 16, marginTop: 6, display: 'flex', gap: 8 }}>
              <span style={{ flexShrink: 0 }}>•</span>
              <span>
                {bulletParts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
                  }
                  // Handle backticks
                  const codeParts = part.split(/(`[^`]+`)/);
                  return codeParts.map((cp, j) => {
                    if (cp.startsWith('`') && cp.endsWith('`')) {
                      return <code key={j} style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{cp.slice(1, -1)}</code>;
                    }
                    return cp;
                  });
                })}
              </span>
            </div>
          );
        }

        // Regular paragraph line — handle bold & backticks
        const parts = line.split(/(\*\*[^*]+\*\*)/);

        return (
          <div key={lineIdx} style={{ marginTop: lineIdx > 0 ? 6 : 0 }}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
              }
              // Handle backticks
              const codeParts = part.split(/(`[^`]+`)/);
              return codeParts.map((cp, j) => {
                if (cp.startsWith('`') && cp.endsWith('`')) {
                  return <code key={j} style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{cp.slice(1, -1)}</code>;
                }
                return cp;
              });
            })}
          </div>
        );
      })}
    </>
  );
}

const CHAT_STARTERS = [
  { icon: '🔍', title: 'Find the right role', prompt: 'How do I search and filter jobs that match my profile?' },
  { icon: '📝', title: 'Apply with referrals', prompt: 'Walk me through applying for a job with an alumni referral.' },
  { icon: '📊', title: 'Track my applications', prompt: 'How does the application tracker work?' },
  { icon: '👤', title: 'Boost my profile', prompt: 'How can I improve my profile completeness and match score?' },
];

function ChatPanel({ isOpen, onClose }) {
  const { state } = useApp();
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: 'Hi! 👋 I\'m Manju Assistant. I can help you with job searches, applications, referrals, and more. Pick a topic below or ask me anything.', ts: 0, isWelcome: true }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Persona sent to the agent so replies are tailored to the signed-in user
  const persona = state.signedIn ? {
    name: state.profile?.name,
    first: state.profile?.first,
    title: state.profile?.title,
    current: state.profile?.current,
    institute: state.profile?.institute,
    batch: state.profile?.batch,
    location: state.profile?.location,
    completeness: state.profile?.completeness,
    skills: state.profile?.skills,
  } : null;

  const send = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;

    setInput('');
    setSuggestions([]);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, ts: Date.now() }]);
    setLoading(true);

    const history = messages
      .filter(m => !m.isWelcome) // skip the canned welcome message
      .map(m => ({ role: m.role, text: m.text }));

    const result = await window.chatService.sendMessage(userMsg, history, persona);
    setLoading(false);

    if (result.success) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: result.answer,
        ts: Date.now(),
        context: result.context,
        confidence: result.confidence,
      }]);
      setSuggestions(result.suggestions || []);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ ${result.error}`,
        ts: Date.now(),
        isError: true,
      }]);
    }
  };

  if (!isOpen) return null;

  const showStarters = messages.length === 1 && !loading;

  return (
    <div className="mj-chat-panel" style={{
      position: 'fixed', right: 0, top: 0,
      width: 'min(100%, 420px)', height: '100vh',
      background: 'var(--surface)', borderLeft: '1px solid var(--rule)',
      display: 'flex', flexDirection: 'column', zIndex: 200,
      boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
      animation: 'mjSlideInRight 0.3s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--rule)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manju Assistant</span>
          <span style={{ fontSize: 11, color: 'var(--success)', background: 'var(--success-bg)', padding: '2px 8px', borderRadius: 4 }}>Online</span>
        </div>
        <button onClick={onClose} aria-label="Close chat"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)', padding: 0 }}>
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '12px 14px', borderRadius: 12,
              fontSize: 13, lineHeight: 1.55,
              background: msg.role === 'user' ? 'var(--primary)'
                : msg.isError ? '#FEF3F2' : 'var(--surface-2)',
              color: msg.role === 'user' ? '#fff'
                : msg.isError ? 'var(--danger)' : 'var(--ink)',
              wordWrap: 'break-word', whiteSpace: 'pre-wrap',
            }}>
              {msg.role === 'assistant' ? renderMarkdown(msg.text) : msg.text}
              {msg.role === 'assistant' && msg.context && msg.context.length > 0 && (
                <div style={{
                  marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--rule)',
                  fontSize: 11, color: 'var(--muted)', fontStyle: 'italic',
                }}>
                  📚 {msg.context[0].title}{msg.confidence ? ` · ${msg.confidence}% confident` : ''}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Starter cards — shown until the first user message */}
        {showStarters && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
            {CHAT_STARTERS.map(card => (
              <button key={card.title} onClick={() => send(card.prompt)}
                style={{
                  textAlign: 'left', padding: '12px 12px', borderRadius: 10,
                  border: '1px solid var(--rule)', background: 'var(--surface)',
                  cursor: 'pointer', transition: 'border-color .15s, background .15s',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-tint)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'var(--surface)'; }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{card.icon}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{card.prompt}</div>
              </button>
            ))}
          </div>
        )}

        {/* Follow-up suggestion chips after each answer */}
        {!loading && !showStarters && suggestions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{
                  padding: '7px 12px', borderRadius: 99, fontSize: 12,
                  border: '1px solid var(--primary)', background: 'transparent',
                  color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{
            display: 'flex', gap: 4, padding: '12px 14px',
            background: 'var(--surface-2)', borderRadius: 12, width: 'fit-content',
          }}>
            {[0, 0.2, 0.4].map(d => (
              <span key={d} style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)',
                animation: 'mjBounce 1.4s infinite', animationDelay: `${d}s`,
              }}/>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ padding: '14px 20px', borderTop: '1px solid var(--rule)', display: 'flex', gap: 8, background: 'var(--surface)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything…"
          disabled={loading}
          style={{
            flex: 1, padding: '10px 14px', border: '1px solid var(--rule)', borderRadius: 8,
            fontSize: 13, background: 'var(--surface-2)', color: 'var(--ink)', outline: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button type="submit" disabled={!input.trim() || loading}
          style={{
            padding: '10px 14px',
            background: input.trim() && !loading ? 'var(--primary)' : 'var(--rule)',
            color: 'white', border: 'none', borderRadius: 8,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            fontWeight: 600, fontSize: 12,
          }}>
          Send
        </button>
      </form>

      <style>{`
        @keyframes mjSlideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes mjBounce {
          0%, 80%, 100% { opacity: 0.4; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { ChatPanel });
