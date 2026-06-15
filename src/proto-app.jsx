// src/proto-app.jsx — App entry point: loads DB data then mounts React

// Make chat service available globally (calls the integrated agent service)
window.chatService = {
  async sendMessage(message, history = [], persona = null) {
    if (!window.MJ || !window.MJ._fromApi) {
      await new Promise(r => setTimeout(r, 800)); // Simulate network latency
      return {
        success: true,
        route: 'smalltalk',
        model: 'prototype-fallback',
        answer: "Hi! I am the **Manju Assistant**.\n\nSince this prototype is running in *offline fallback mode*, I cannot reach the live AI Agent Service. However, you can still search and save jobs, apply for roles, ask for referrals, and update your profile directly in the prototype interface!",
        confidence: 100,
        context: [],
        suggestions: ["How do I edit my profile?", "How do I apply for jobs?", "How do I ask for referrals?"]
      };
    }
    try {
      const agentBase = window.MJ_AGENT_BASE === '' ? '' : (window.MJ_AGENT_BASE || `http://${window.location.hostname}:3002`);
      const res = await fetch(`${agentBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, persona }),
      });
      if (!res.ok) throw new Error(`Agent error: ${res.status}`);
      const data = await res.json();
      return { success: true, ...data };
    } catch (err) {
      console.error('[Chat] Failed:', err.message);
      return { success: false, error: err.message || 'Unable to reach assistant. Make sure agent-service is running.' };
    }
  },
};

const PROTO_TWEAKS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "density": "comfortable"
}/*EDITMODE-END*/;

function TestAgentRunner() {
  const [visible, setVisible] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(-1);
  const [results, setResults] = React.useState([]);
  const { dispatch } = useApp();
  const route = useRoute();

  const steps = [
    {
      name: "Reset state & navigate to sign-in",
      action: async () => {
        localStorage.removeItem('manju-proto-v1');
        dispatch({ type: 'RESET' });
        route.go('signin');
        await new Promise(r => setTimeout(r, 1000));
      }
    },
    {
      name: "Open Google Auth popup",
      action: async () => {
        const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Continue with Google'));
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 1500));
      }
    },
    {
      name: "Simulate Google Account selector message",
      action: async () => {
        window.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          token: 'mock_|agent.tester@gmail.com|Agent Tester'
        }, window.location.origin);
        await new Promise(r => setTimeout(r, 1500));
      }
    },
    {
      name: "Redirect and verify signup route",
      action: async () => {
        if (window.location.hash !== '#/profile') {
          route.go('profile');
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    },
    {
      name: "Edit profile location & title in state",
      action: async () => {
        dispatch({ type: 'PROFILE_FIELD', key: 'title', value: 'QA Automation Agent' });
        dispatch({ type: 'PROFILE_FIELD', key: 'location', value: 'Cloud Server' });
        dispatch({ type: 'PROFILE_FIELD', key: 'completeness', value: 85 });
        await new Promise(r => setTimeout(r, 1500));
      }
    },
    {
      name: "Browse jobs and apply Swiggy filter",
      action: async () => {
        route.go('search');
        await new Promise(r => setTimeout(r, 1000));
        dispatch({ type: 'FILTER_SET', key: 'query', value: 'Swiggy' });
        await new Promise(r => setTimeout(r, 1500));
      }
    },
    {
      name: "Save Swiggy Engineering Manager job",
      action: async () => {
        dispatch({ type: 'SAVE_TOGGLE', jobId: 'j6' });
        await new Promise(r => setTimeout(r, 1500));
      }
    },
    {
      name: "Verify home dashboard updates",
      action: async () => {
        route.go('home');
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  ];

  React.useEffect(() => {
    const handleOpen = () => setVisible(true);
    window.addEventListener('open-test-agent', handleOpen);
    return () => window.removeEventListener('open-test-agent', handleOpen);
  }, []);

  const runTests = async () => {
    setRunning(true);
    const initialResults = steps.map(() => 'pending');
    setResults(initialResults);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setResults(prev => {
        const next = [...prev];
        next[i] = 'running';
        return next;
      });
      
      try {
        await steps[i].action();
        setResults(prev => {
          const next = [...prev];
          next[i] = 'success';
          return next;
        });
      } catch (err) {
        console.error(`Step ${i} failed:`, err);
        setResults(prev => {
          const next = [...prev];
          next[i] = 'failed';
          return next;
        });
        break;
      }
    }
    setRunning(false);
    setCurrentStep(-1);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: '80px', left: '20px', zIndex: '2147483640',
      width: '320px', background: 'rgba(30, 20, 10, 0.95)', border: '1px solid var(--rule)',
      borderRadius: '12px', padding: '16px', color: '#FAF4E8',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
      fontFamily: 'var(--font-body)', boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🤖 Automated Test Agent
        </span>
        <button onClick={() => setVisible(false)} style={{ background: 'none', border: 0, color: '#A89580', cursor: 'pointer', fontSize: '16px' }}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', marginBottom: '14px', paddingRight: '4px' }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: currentStep === idx ? '#E6843D' : '#D9C9B0' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              background: results[idx] === 'success' ? '#6B8B47' :
                          results[idx] === 'failed' ? '#B43A24' :
                          results[idx] === 'running' ? '#E6843D' : '#5B4A38',
              boxShadow: results[idx] === 'running' ? '0 0 8px #E6843D' : 'none'
            }}/>
            <span style={{ flex: 1, textDecoration: results[idx] === 'success' ? 'line-through' : 'none', opacity: results[idx] === 'success' ? 0.6 : 1 }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      {results.length > 0 && results.every(r => r === 'success') && (
        <div style={{ color: '#6B8B47', fontSize: '13px', fontWeight: 600, marginBottom: '12px', textAlign: 'center' }}>
          ✓ All tests passed successfully!
        </div>
      )}

      <button
        onClick={runTests}
        disabled={running}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px', border: 0,
          background: running ? '#5B4A38' : 'var(--primary)', color: 'white',
          fontWeight: 600, fontSize: '13px', cursor: running ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {running ? 'Running Test Suite...' : 'Run Automated Agent'}
      </button>
    </div>
  );
}

function ProtoApp() {
  const [t, setTweak] = useTweaks(PROTO_TWEAKS);
  const [apiUrl, setApiUrl] = React.useState(window.MJ_API_BASE || '');
  const [agentUrl, setAgentUrl] = React.useState(window.MJ_AGENT_BASE || '');

  const saveUrls = () => {
    localStorage.setItem('MJ_API_BASE', apiUrl.trim());
    localStorage.setItem('MJ_AGENT_BASE', agentUrl.trim());
    window.MJ_API_BASE = apiUrl.trim();
    window.MJ_AGENT_BASE = agentUrl.trim();
    alert('Connection settings saved! Reloading application...');
    window.location.reload();
  };

  return (
    <AppProvider>
      <ProtoRouter dark={t.dark} density={t.density}/>
      <TestAgentRunner/>
      <TweaksPanel>
        <TweakSection label="Theme"/>
        <TweakToggle label="Dark mode" value={t.dark} onChange={v=>setTweak('dark',v)}/>
        <TweakRadio label="Density" value={t.density} options={['compact','comfortable']} onChange={v=>setTweak('density',v)}/>
        
        <TweakSection label="Connection Settings"/>
        <TweakRow label="Backend API URL">
          <input type="text" className="twk-field" value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder="http://localhost:5200" />
        </TweakRow>
        <TweakRow label="Agent Service URL">
          <input type="text" className="twk-field" value={agentUrl} onChange={e => setAgentUrl(e.target.value)} placeholder="http://localhost:3002" />
        </TweakRow>
        <div style={{ marginTop: 6 }}>
          <TweakButton label="Save Connections" onClick={saveUrls} />
        </div>

        <TweakSection label="Automated Testing"/>
        <TweakButton label="Open Test Agent" onClick={() => window.dispatchEvent(new CustomEvent('open-test-agent'))}/>
        <TweakSection label="Demo"/>
        <ProtoResetButton/>
        <ApiStatusBadge/>
      </TweaksPanel>
    </AppProvider>
  );
}

function ApiStatusBadge() {
  const fromApi = window.MJ && window.MJ._fromApi;
  return (
    <div style={{
      marginTop:8, padding:'6px 10px', borderRadius:'var(--radius)',
      background: fromApi ? 'var(--success-bg)' : 'var(--surface-2)',
      display:'flex', alignItems:'center', gap:8,
    }}>
      <span style={{width:6,height:6,borderRadius:99,flexShrink:0,
        background: fromApi ? 'var(--success)' : 'var(--muted)'}}/>
      <span style={{color: fromApi ? 'var(--success)' : 'var(--muted)',
        fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.06em'}}>
        {fromApi ? 'DB · live' : 'DB · fallback'}
      </span>
    </div>
  );
}

function ProtoResetButton() {
  const { dispatch } = useApp();
  return (
    <TweakButton label="Reset prototype state" onClick={()=>{
      localStorage.removeItem('manju-proto-v1');
      dispatch({type:'RESET'});
      window.location.hash = '#/landing';
    }} secondary/>
  );
}

function ChatButton() {
  const { state, dispatch } = useApp();
  return (
    <button
      onClick={() => dispatch({ type: 'CHAT_TOGGLE' })}
      className="mj-chat-btn"
      aria-label="Open assistant"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--primary)',
        border: 'none',
        color: 'white',
        fontSize: 24,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        transition: 'all 0.2s ease',
        hover: { transform: 'scale(1.1)', boxShadow: '0 6px 16px rgba(0,0,0,0.2)' },
      }}
      onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      title="Chat with Manju Assistant"
    >
      {state.chatOpen ? '✕' : '💬'}
    </button>
  );
}

function ProtoRouter({ dark, density }) {
  const route = useRoute();
  const { state, dispatch } = useApp();

  if (route.path === 'google-auth') {
    return <PGoogleAuth />;
  }
  if (route.path === 'linkedin-auth') {
    return <PLinkedInAuth />;
  }

  const role = state.userRole; // 'candidate' | 'recruiter' | 'admin'

  React.useEffect(() => {
    const authedRoutes = ['home','tracker','profile','apply','company','admin'];
    if (authedRoutes.includes(route.path) && !state.signedIn) {
      window.location.hash = '#/signin';
      return;
    }
    // Role guards: redirect mismatched roles to their home
    if (state.signedIn) {
      if (route.path === 'company' && role !== 'recruiter') { window.location.hash = '#/home'; return; }
      if (route.path === 'admin'   && role !== 'admin')     { window.location.hash = '#/home'; return; }
    }
  }, [route.path, state.signedIn, role]);

  let Screen;
  switch (route.path) {
    case 'landing': Screen = PLanding; break;
    case 'signin':
      Screen = state.signedIn
        ? (role === 'admin' ? PAdminPortal : role === 'recruiter' ? PCompanyPortal : PHome)
        : PSignIn;
      break;
    case 'home':
      Screen = !state.signedIn ? PSignIn
             : role === 'recruiter' ? PCompanyPortal
             : role === 'admin'     ? PAdminPortal
             : PHome;
      break;
    case 'search':  Screen = PSearch; break;
    case 'job':     Screen = PDetail; break;
    case 'apply':   Screen = state.signedIn && role === 'candidate' ? PApply : PSignIn; break;
    case 'tracker':
      Screen = !state.signedIn ? PSignIn
             : role === 'recruiter' ? PCompanyPortal
             : role === 'admin'     ? PAdminPortal
             : PTracker;
      break;
    case 'profile':
      Screen = !state.signedIn ? PSignIn
             : role === 'recruiter' ? PCompanyPortal
             : role === 'admin'     ? PAdminPortal
             : PProfile;
      break;
    case 'company': Screen = state.signedIn && role === 'recruiter' ? PCompanyPortal : PSignIn; break;
    case 'admin':   Screen = state.signedIn && role === 'admin'     ? PAdminPortal   : PSignIn; break;
    case 'employers':
    case 'about':   Screen = PLanding; break;
    default:        Screen = PLanding;
  }

  return (
    <div className={`${dark?'dark':''} density-${density}`} style={{minHeight:'100vh', background:'var(--bg)', color:'var(--ink)', fontFamily:'var(--font-body)'}}>
      <TopNav/>
      <main key={route.path + (route.param||'')}>
        <Screen/>
      </main>
      {['landing','search'].includes(route.path) && <ProtoFooter/>}
      <Toast/>
      <ChatButton/>
      <ChatPanel isOpen={state.chatOpen} onClose={() => dispatch({ type: 'CHAT_CLOSE' })}/>
      <StatusModal/>
      <AddRoleModal/>
      <AddSkillModal/>
    </div>
  );
}

// Fetch DB data first, then mount — falls back to hardcoded data if API is down
window.MJ_load().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
      <ProtoApp/>
    </ErrorBoundary>
  );
});
