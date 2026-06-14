// src/proto-core.jsx — State, routing, persistence, layout shell

const LS_KEY = 'manju-proto-v1';
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch (e) { return {}; }
};
const saveState = (s) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch(e){}
};

const DEFAULT_FILTERS = {
  query:'', location:'Bengaluru',
  exp:['3–5 years','5–8 years'], function:['Product','Engineering'],
  mode:'Hybrid', minComp:40, maxComp:120,
  hasAlumni:true, layout:'split', sort:'match', showAll: false,
};

const INITIAL = (() => {
  const persisted = loadState();
  return {
    signedIn:        persisted.signedIn  ?? false,
    userRole:        persisted.userRole  ?? 'candidate',
    recruiterCompany:persisted.recruiterCompany ?? null,
    authStep:        0,  // Always reset to 0 on page load (don't persist OTP step)
    authLoading:     false,
    authError:       null,
    authInstitute:   persisted.authInstitute ?? 'IIT Bombay',
    authRoll:        persisted.authRoll      ?? '14CS30015',
    authOtp:         '',
    // API-owned: always start empty; loaded from API after sign-in
    saved:           [],
    applications:    {},
    referralRequests:{},
    draft:           { jobId:null, step:1, coverNote:'', extraNote:'', referralPicks:[] },
    filters:         persisted.filters ?? DEFAULT_FILTERS,
    profile:         window.MJ.MJ_PROFILE,
    profileEditing:  false,
    toast:           null,
    chatOpen:        false,
    statusOpen:      false,
    addRoleOpen:     false,
    addSkillOpen:    false,
    newRoleForm:     { role: '', company: '', loc: '', dates: '', desc: '' },
    newSkill:        '',
  };
})();

function reducer(s, a) {
  switch(a.type) {
    case 'SIGN_IN': {
      return { ...s, signedIn:true, authStep:3, userRole: 'candidate', recruiterCompany: null };
    }
    case 'SIGN_IN_USER': {
      return { ...s, signedIn:true, profile: a.user, authStep:3, userRole: 'candidate', recruiterCompany: null };
    }
    case 'SIGN_IN_RECRUITER': {
      return { ...s, signedIn:true, userRole: 'recruiter', recruiterCompany: a.company, authStep: 0 };
    }
    case 'SIGN_IN_ADMIN': {
      return { ...s, signedIn:true, userRole: 'admin', recruiterCompany: null, authStep: 0 };
    }
    case 'SIGN_OUT': {
      window.MJ_api?.logout();
      localStorage.removeItem('manju-user-id');
      return { ...s, signedIn:false, authStep:0, authOtp:'', userRole: 'candidate', recruiterCompany: null,
               saved:[], applications:{}, referralRequests:{} };
    }
    case 'USER_DATA_LOADED': {
      const d = a.data;
      return {
        ...s,
        saved:            d.saved            ?? s.saved,
        applications:     d.applications     ?? s.applications,
        referralRequests: d.referralRequests ?? s.referralRequests,
        profile:          d.profile          ?? s.profile,
      };
    }
    case 'AUTH_LOADING': return { ...s, authLoading: a.value };
    case 'AUTH_ERROR':    return { ...s, authError: a.error };
    case 'AUTH_STEP':     return { ...s, authStep:a.step };
    case 'AUTH_FIELD':    return { ...s, [a.key]:a.value };

    case 'SAVE_TOGGLE': {
      const has = s.saved.includes(a.jobId);
      // API call is handled by the dispatch wrapper in AppProvider (with rollback on failure)
      return { ...s,
        saved: has ? s.saved.filter(j=>j!==a.jobId) : [a.jobId, ...s.saved],
        toast: has ? null : { msg:'Saved to your list', icon:'bookmark' },
      };
    }
    case 'SAVE_ROLLBACK': {
      // Revert optimistic save toggle; called when the API call fails
      const { jobId, wasPresent } = a;
      return { ...s,
        saved: wasPresent ? [...s.saved, jobId] : s.saved.filter(j => j !== jobId),
        toast: { msg: 'Save failed — check connection', icon: 'close' },
      };
    }

    case 'APPLY_BEGIN':   return { ...s, draft:{ jobId:a.jobId, step:1, coverNote:'', extraNote:'', referralPicks:[] } };
    case 'APPLY_STEP':    return { ...s, draft:{ ...s.draft, step:a.step } };
    case 'APPLY_FIELD':   return { ...s, draft:{ ...s.draft, [a.key]:a.value } };
    case 'APPLY_PICK_REFERRAL': {
      const has = s.draft.referralPicks.includes(a.name);
      return { ...s, draft: { ...s.draft,
        referralPicks: has ? s.draft.referralPicks.filter(n=>n!==a.name)
                           : [...s.draft.referralPicks, a.name] }};
    }
    case 'APPLY_FINALIZE': {
      const jobId = s.draft.jobId;
      // API call happens before this dispatch (in finalize() in PApply), so state only updates on success
      return { ...s,
        applications: { ...s.applications, [jobId]: {
          stage: 'Applied', appliedAt:'just now',
          coverNote: s.draft.coverNote, referrals: s.draft.referralPicks,
        }},
        saved: s.saved.filter(j=>j!==jobId),
        draft: { jobId:null, step:1, coverNote:'', extraNote:'', referralPicks:[] },
        toast: { msg:`Application sent · ${s.draft.referralPicks.length} referral${s.draft.referralPicks.length===1?'':'s'} requested`, icon:'check' },
      };
    }

    case 'PIPE_MOVE': {
      const next = { ...s.applications };
      if (next[a.jobId]) next[a.jobId] = { ...next[a.jobId], stage: a.stage };
      // Persist stage change to DB (best-effort)
      window.MJ_api?.moveStage(a.jobId, a.stage);
      return { ...s, applications: next, toast:{ msg:`Moved to "${a.stage}"`, icon:'arrow' } };
    }

    case 'FILTER_SET':    return { ...s, filters: { ...s.filters, [a.key]:a.value } };
    case 'FILTER_TOGGLE': {
      const arr = s.filters[a.key];
      const has = arr.includes(a.value);
      return { ...s, filters: { ...s.filters,
        [a.key]: has ? arr.filter(x=>x!==a.value) : [...arr, a.value] }};
    }
    case 'FILTER_RESET':  return { ...s, filters: { ...INITIAL.filters, query:s.filters.query } };

    case 'PROFILE_EDIT':  return { ...s, profileEditing: a.value };
    case 'PROFILE_FIELD': return { ...s, profile: { ...s.profile, [a.key]: a.value } };

    case 'TOAST':         return { ...s, toast: a.toast };
    case 'TOAST_CLEAR':   return { ...s, toast: null };

    case 'CHAT_TOGGLE':   return { ...s, chatOpen: !s.chatOpen };
    case 'CHAT_CLOSE':    return { ...s, chatOpen: false };

    case 'STATUS_TOGGLE': return { ...s, statusOpen: !s.statusOpen };
    case 'STATUS_CLOSE':  return { ...s, statusOpen: false };

    case 'ADD_ROLE_OPEN':  return { ...s, addRoleOpen: true, newRoleForm: { role: '', company: '', loc: '', dates: '', desc: '' } };
    case 'ADD_ROLE_CLOSE': return { ...s, addRoleOpen: false };
    case 'ADD_ROLE_FIELD': return { ...s, newRoleForm: { ...s.newRoleForm, [a.key]: a.value } };
    case 'ADD_ROLE_SAVE': {
      const { role, company, loc, dates, desc } = s.newRoleForm;
      if (!role.trim() || !company.trim()) return s;
      return {
        ...s,
        profile: {
          ...s.profile,
          experience: [...(s.profile?.experience ?? []), { role, company, loc, dates, desc }]
        },
        addRoleOpen: false,
        newRoleForm: { role: '', company: '', loc: '', dates: '', desc: '' },
        toast: { msg: 'Experience added', icon: 'check' }
      };
    }

    case 'ADD_SKILL_OPEN':  return { ...s, addSkillOpen: true, newSkill: '' };
    case 'ADD_SKILL_CLOSE': return { ...s, addSkillOpen: false };
    case 'ADD_SKILL_INPUT': return { ...s, newSkill: a.value };
    case 'ADD_SKILL_SAVE': {
      if (!s.newSkill.trim()) return s;
      return {
        ...s,
        profile: {
          ...s.profile,
          skills: [...s.profile.skills, s.newSkill]
        },
        addSkillOpen: false,
        newSkill: '',
        toast: { msg: `"${s.newSkill}" added to skills`, icon: 'check' }
      };
    }

    case 'RESET':         return { ...INITIAL, signedIn: false, authStep: 0, authOtp: '',
                                   saved:[], applications:{}, referralRequests:{} };
    default: return s;
  }
}

const AppCtx = React.createContext(null);

function AppProvider({ children }) {
  const [state, rawDispatch] = React.useReducer(reducer, INITIAL);
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const dispatch = React.useCallback((action) => {
    if (action.type === 'SAVE_TOGGLE') {
      const has = stateRef.current.saved.includes(action.jobId);
      rawDispatch(action); // optimistic flip
      const apiCall = has
        ? window.MJ_api?.unsaveJob(action.jobId)
        : window.MJ_api?.saveJob(action.jobId);
      apiCall?.catch?.(() =>
        rawDispatch({type:'SAVE_ROLLBACK', jobId: action.jobId, wasPresent: has})
      );
    } else {
      rawDispatch(action);
    }
  }, []); // rawDispatch is stable, stateRef reads fresh via ref

  // Persist session state but NOT API-owned fields (saved/apps/referrals come from API)
  React.useEffect(() => {
    const { toast, draft, saved, applications, referralRequests, ...rest } = state;
    saveState(rest);
  }, [state]);

  // Load real user data from API whenever the user is signed in (login or page refresh)
  React.useEffect(() => {
    if (!state.signedIn) return;
    const userId = parseInt(localStorage.getItem('manju-user-id') || '1');
    window.MJ_api?.loadUserData(userId).then(data => {
      if (data) dispatch({ type:'USER_DATA_LOADED', data });
    });
  }, [state.signedIn]);

  React.useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({type:'TOAST_CLEAR'}), 2400);
    return () => clearTimeout(t);
  }, [state.toast]);

  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>;
}

const useApp = () => React.useContext(AppCtx);

const parseHash = () => {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, ...rest] = raw.split('/');
  return { path: path || 'landing', param: rest[0] || null, sub: rest[1] || null };
};

function useRoute() {
  const [route, setRoute] = React.useState(parseHash());
  React.useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top:0, behavior:'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (path, param, sub) => {
    const seg = ['', path, param, sub].filter(x=>x!=null && x!=='').join('/');
    window.location.hash = seg;
  };
  return { ...route, go };
}
function TopNav() {
  const { state, dispatch } = useApp();
  const route = useRoute();
  const isAuthed = state.signedIn;
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  React.useEffect(() => {
    if (!showUserDropdown) return;
    const handleOutsideClick = (e) => {
      const container = document.getElementById('mj-user-menu-container');
      if (container && !container.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    const timeout = setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    }, 50);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [showUserDropdown]);

  const isRecruiter = state.userRole === 'recruiter';
  const isAdmin    = state.userRole === 'admin';

  const items = isAuthed
    ? (isAdmin
        ? [['admin','Dashboard']]
        : isRecruiter
          ? [['company','Company Portal']]
          : [['home','Home'],['search','Jobs'],['tracker','Tracker'],['profile','Profile']])
    : [['search','Browse jobs'],['employers','Employers'],['about','About']];

  const notifCount = (isRecruiter || isAdmin) ? 0 : Object.values(state.referralRequests || {}).filter(r=>r.state==='accepted').length;

  const profileName  = isAdmin    ? 'Admin'
                     : isRecruiter? `${state.recruiterCompany} Recruiter`
                     : (state.profile?.name || 'Alumna');
  const profileEmail = isAdmin    ? 'admin@manju.in'
                     : isRecruiter? `recruiter@${state.recruiterCompany.toLowerCase().replace(/[^a-z0-9]/g,'')}.com`
                     : (state.profile?.email || (state.profile?.first ? `${state.profile.first.toLowerCase()}@iitbombay.ac.in` : 'member@iitb.alumni.in'));
  const avatarName  = isAdmin ? 'Admin' : isRecruiter ? state.recruiterCompany : (state.profile?.name || '?');
  const avatarColor = isAdmin ? '#101828' : isRecruiter ? '#0A66C2' : (state.profile?.avatarColor || '#2970FF');

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out Manju — the IIT & IIM alumni job network for senior roles.\nJoin at: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <header className="mj-top-nav" style={{
      position:'sticky', top:0, zIndex:50,
      display:'flex',alignItems:'center',gap:32,
      padding:'14px 40px', background:'color-mix(in srgb, var(--surface) 88%, transparent)',
      borderBottom:'1px solid var(--rule)',
      backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
    }}>
      <a href="#/home" style={{textDecoration:'none', display:'flex'}}><ManjuMark size={22}/></a>
      <nav className="mj-nav-links">
        {items.map(([k,label])=> {
          const active = route.path === k || (k==='search' && route.path==='job');
          return (
            <a key={k} href={`#/${k}`} style={{
              fontSize:13, fontWeight: active ? 600 : 500,
              color: active ? 'var(--ink)' : 'var(--muted)',
              textDecoration:'none', padding:'8px 14px', borderRadius:'var(--radius)',
              background: active ? 'var(--surface-2)' : 'transparent',
            }}>{label}</a>
          );
        })}
      </nav>
      <div style={{flex:1}}/>

      {isAuthed ? (
        <>
          {!isRecruiter && route.path !== 'search' && (
            <div className="mj-nav-search">
              <ProtoSearch onSubmit={(q)=>{ dispatch({type:'FILTER_SET',key:'query',value:q}); window.location.hash='#/search'; }}/>
            </div>
          )}
          {!isRecruiter && !isAdmin && (
            <button className="mj-btn mj-btn--ghost mj-btn--icon" style={{position:'relative'}} aria-label="Notifications" onClick={()=>dispatch({type:'TOAST',toast:{msg:`${notifCount} unread referral updates`, icon:'bell'}})}>
              <Icon name="bell" size={16}/>
              {notifCount>0 && <span style={{position:'absolute',top:5,right:5,width:8,height:8,borderRadius:99,background:'var(--primary)', border:'2px solid var(--surface)'}}/>}
            </button>
          )}
          <button
            className="mj-btn mj-btn--ghost mj-btn--icon"
            aria-label="Share via WhatsApp"
            title="Share via WhatsApp"
            onClick={shareViaWhatsApp}
            style={{color:'#25D366'}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </button>
          
          <div id="mj-user-menu-container" style={{position:'relative', display:'flex', alignItems:'center'}}>
            <button
               onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'center', outline:'none'}}
              aria-label="User Menu"
            >
              <Avatar name={avatarName} color={avatarColor}/>
            </button>
            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--surface)', border: '1px solid var(--rule)',
                  borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)',
                  zIndex: 100, display: 'flex', flexDirection: 'column',
                  minWidth: 180, overflow: 'hidden'
                }}
              >
                <div style={{padding: '12px 14px', borderBottom: '1px solid var(--rule-soft)'}}>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{profileName}</div>
                  <div style={{fontSize:11, color:'var(--muted)', marginTop:2, whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>{profileEmail}</div>
                </div>
                {!isRecruiter && (
                  <a
                    href="#/profile"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      padding: '10px 14px', textDecoration:'none', fontSize: 13,
                      color: 'var(--ink)', display: 'block', transition: 'background .12s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    View Profile
                  </a>
                )}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    dispatch({type: 'SIGN_OUT'});
                    window.location.hash = '#/signin';
                  }}
                  style={{
                    padding: '10px 14px', border: 'none', background: 'none',
                    textAlign: 'left', cursor: 'pointer', fontSize: 13,
                    color: 'var(--danger)', display: 'block', transition: 'background .12s',
                    width: '100%', borderTop: '1px solid var(--rule-soft)'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <a href="#/signin" className="mj-btn mj-btn--text">Sign in</a>
          <a href="#/signin" className="mj-btn">Join with institute ID</a>
        </>
      )}
    </header>
  );
}

function ProtoSearch({ onSubmit }) {
  const { state } = useApp();
  const [val, setVal] = React.useState(state?.filters?.query || '');
  React.useEffect(() => {
    setVal(state?.filters?.query || '');
  }, [state?.filters?.query]);

  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(val);}} style={{position:'relative', flex:'0 1 320px', maxWidth:340}}>
      <Icon name="search" size={15} style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',pointerEvents:'none'}}/>
      <input className="mj-input" value={val} onChange={e=>setVal(e.target.value)} placeholder="Search roles, companies…" style={{paddingLeft:36, fontSize:13, padding:'9px 14px 9px 36px'}}/>
    </form>
  );
}

function ProtoFooter() {
  return (
    <footer style={{padding:'30px 40px',borderTop:'1px solid var(--rule)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--surface)'}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <ManjuMark size={16} sub={false}/>
        <span className="mj-mini">© 2026 · Members only · Verified IIT &amp; IIM</span>
      </div>
      <div style={{display:'flex',gap:18}}>
        {['Privacy','Terms','Code of conduct','Contact'].map(x=>
          <a key={x} href="#" className="mj-mini" style={{textDecoration:'none'}}>{x}</a>)}
      </div>
    </footer>
  );
}

function Toast() {
  const { state } = useApp();
  if (!state.toast) return null;
  return (
    <div className="mj-toast">
      <Icon name={state.toast.icon || 'check'} size={14}/>
      <span>{state.toast.msg}</span>
    </div>
  );
}

const getJob = (id) => (window.MJ.MJ_JOBS || []).find(j => j.id === id);

function parseComp(compStr) {
  const clean = compStr.replace(/₹/g, '').replace(/,/g, '');
  const nums = clean.match(/\d+(\.\d+)?/g);
  if (!nums) return [40, 100];
  let vals = nums.map(Number);
  
  if (clean.includes('Cr')) {
    if (vals[0] < 10) vals[0] = Math.round(vals[0] * 100);
    if (vals[1] && vals[1] < 10) vals[1] = Math.round(vals[1] * 100);
  }
  
  return [vals[0] || 40, vals[1] || vals[0] || 100];
}

function getUserExpBand(user) {
  if (!user) return ['3–5 years', '5–8 years'];
  let batchYear = 2018;
  if (user.batch) {
    const clean = user.batch.replace(/[^0-9]/g, '');
    const num = parseInt(clean);
    if (!isNaN(num)) {
      batchYear = num < 100 ? 2000 + num : num;
    }
  }
  const years = Math.max(0, 2026 - batchYear);
  if (years <= 3) return ['0–3 years'];
  if (years <= 5) return ['3–5 years'];
  if (years <= 8) return ['5–8 years'];
  return ['8+ years'];
}

function filterJobs(jobs, f) {
  const user = window.MJ && window.MJ.MJ_USER;
  const userBands = getUserExpBand(user);

  let filtered = jobs.filter(j => {
    if (f.query) {
      const q = f.query.toLowerCase();
      if (!j.role.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
    }
    if (f.function && f.function.length) {
      const hasMatch = j.tags.some(t => f.function.includes(t));
      if (!hasMatch) return false;
    }
    if (f.hasAlumni && j.alumni === 0) return false;

    if (f.mode && f.mode !== 'All' && j.mode !== f.mode) return false;

    if (f.showAll) {
      if (f.exp && f.exp.length && !f.exp.includes(j.exp)) return false;
    } else {
      if (!userBands.includes(j.exp)) return false;
    }

    const [minJobComp, maxJobComp] = parseComp(j.comp);
    if (f.minComp && maxJobComp < f.minComp) return false;
    if (f.maxComp && minJobComp > f.maxComp) return false;

    return true;
  });

  if (f.sort === 'comp') {
    filtered.sort((a, b) => parseComp(b.comp)[0] - parseComp(a.comp)[0]);
  } else if (f.sort === 'posted') {
    const score = (str) => {
      if (str.includes('h')) return 1;
      if (str.includes('d')) return parseInt(str) * 24;
      if (str.includes('w')) return parseInt(str) * 24 * 7;
      return 9999;
    };
    filtered.sort((a, b) => score(a.posted) - score(b.posted));
  } else {
    filtered.sort((a, b) => b.match - a.match);
  }

  return filtered;
}

// ─── MODALS ───────────────────────────────────────────────────────────
function StatusModal() {
  const { state, dispatch } = useApp();
  if (!state.statusOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 150, backdropFilter: 'blur(4px)'
    }} onClick={() => dispatch({ type: 'STATUS_CLOSE' })}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        padding: '32px 28px', maxWidth: 380, boxShadow: 'var(--shadow-pop)',
      }} onClick={e => e.stopPropagation()}>
        <div className="mj-h3" style={{ marginBottom: 20, fontSize: 22 }}>Set your status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {['Open to conversations', 'Actively interviewing', 'In talks with an offer', 'Not looking'].map(status => (
            <label key={status} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 'var(--radius)', cursor: 'pointer', background: 'var(--surface-2)',
              transition: 'background 0.2s'
            }}>
              <input type="radio" name="status" value={status} defaultChecked={status === 'Open to conversations'}
                style={{ width: 16, height: 16, cursor: 'pointer' }}/>
              <span style={{ fontSize: 13.5 }}>{status}</span>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mj-btn" style={{ flex: 1 }}
            onClick={() => {
              dispatch({ type: 'STATUS_CLOSE' });
              dispatch({ type: 'TOAST', toast: { msg: 'Status updated', icon: 'check' } });
            }}>
            Save
          </button>
          <button className="mj-btn mj-btn--ghost" style={{ flex: 1 }}
            onClick={() => dispatch({ type: 'STATUS_CLOSE' })}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRoleModal() {
  const { state, dispatch } = useApp();
  if (!state.addRoleOpen) return null;

  const form = state.newRoleForm;
  const isValid = form.role.trim() && form.company.trim();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 150, backdropFilter: 'blur(4px)'
    }} onClick={() => dispatch({ type: 'ADD_ROLE_CLOSE' })}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        padding: '32px 28px', maxWidth: 420, boxShadow: 'var(--shadow-pop)',
      }} onClick={e => e.stopPropagation()}>
        <div className="mj-h3" style={{ marginBottom: 24, fontSize: 22 }}>Add a role</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          <div>
            <label className="mj-small" style={{ marginBottom: 6, display: 'block' }}>Role</label>
            <input className="mj-input" placeholder="e.g. Senior Product Manager"
              value={form.role}
              onChange={e => dispatch({ type: 'ADD_ROLE_FIELD', key: 'role', value: e.target.value })}
              style={{ width: '100%', padding: '10px 12px' }}/>
          </div>
          <div>
            <label className="mj-small" style={{ marginBottom: 6, display: 'block' }}>Company</label>
            <input className="mj-input" placeholder="e.g. Stripe"
              value={form.company}
              onChange={e => dispatch({ type: 'ADD_ROLE_FIELD', key: 'company', value: e.target.value })}
              style={{ width: '100%', padding: '10px 12px' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="mj-small" style={{ marginBottom: 6, display: 'block' }}>Location</label>
              <input className="mj-input" placeholder="e.g. San Francisco"
                value={form.loc}
                onChange={e => dispatch({ type: 'ADD_ROLE_FIELD', key: 'loc', value: e.target.value })}
                style={{ width: '100%', padding: '10px 12px' }}/>
            </div>
            <div>
              <label className="mj-small" style={{ marginBottom: 6, display: 'block' }}>Dates</label>
              <input className="mj-input" placeholder="e.g. 2020 – 2024"
                value={form.dates}
                onChange={e => dispatch({ type: 'ADD_ROLE_FIELD', key: 'dates', value: e.target.value })}
                style={{ width: '100%', padding: '10px 12px' }}/>
            </div>
          </div>
          <div>
            <label className="mj-small" style={{ marginBottom: 6, display: 'block' }}>Description</label>
            <textarea className="mj-input" placeholder="Brief description of your role..."
              value={form.desc}
              onChange={e => dispatch({ type: 'ADD_ROLE_FIELD', key: 'desc', value: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', minHeight: 80, fontFamily: 'var(--font-body)' }}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mj-btn" style={{ flex: 1 }} disabled={!isValid}
            onClick={() => dispatch({ type: 'ADD_ROLE_SAVE' })}>
            Add role
          </button>
          <button className="mj-btn mj-btn--ghost" style={{ flex: 1 }}
            onClick={() => dispatch({ type: 'ADD_ROLE_CLOSE' })}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AddSkillModal() {
  const { state, dispatch } = useApp();
  if (!state.addSkillOpen) return null;

  const isValid = state.newSkill.trim();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 150, backdropFilter: 'blur(4px)'
    }} onClick={() => dispatch({ type: 'ADD_SKILL_CLOSE' })}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        padding: '32px 28px', maxWidth: 360, boxShadow: 'var(--shadow-pop)',
      }} onClick={e => e.stopPropagation()}>
        <div className="mj-h3" style={{ marginBottom: 24, fontSize: 22 }}>Add a skill</div>
        <div style={{ marginBottom: 24 }}>
          <input className="mj-input" placeholder="e.g. System Design, Python, Team Leadership"
            value={state.newSkill}
            onChange={e => dispatch({ type: 'ADD_SKILL_INPUT', value: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter' && isValid) dispatch({ type: 'ADD_SKILL_SAVE' });
            }}
            style={{ width: '100%', padding: '10px 12px' }}
            autoFocus/>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="mj-btn" style={{ flex: 1 }} disabled={!isValid}
            onClick={() => dispatch({ type: 'ADD_SKILL_SAVE' })}>
            Add skill
          </button>
          <button className="mj-btn mj-btn--ghost" style={{ flex: 1 }}
            onClick={() => dispatch({ type: 'ADD_SKILL_CLOSE' })}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AppProvider, AppCtx, useApp, useRoute,
  TopNav, ProtoFooter, Toast, getJob, filterJobs, getUserExpBand,
  StatusModal, AddRoleModal, AddSkillModal,
});
