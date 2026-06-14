// src/proto-screens.jsx — Connected, interactive screens for the prototype

// =========================================================================
// LANDING (logged out)
// =========================================================================
function PLanding() {
  return (
    <div className="proto-route">
      <section className="mj-hero-section" style={{padding:'88px 80px 56px', position:'relative', maxWidth:1400, margin:'0 auto'}}>
        <div className="mj-eyebrow" style={{marginBottom:22, display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:6,height:6,borderRadius:99,background:'var(--primary)'}}/>
          For IIT &amp; IIM alumni only · est. 2026
        </div>
        <h1 className="mj-display" style={{maxWidth:1000, fontSize:88}}>
          The job network<br/>
          opened by the badge<br/>
          you already earned.
        </h1>
        <p className="mj-body-lg" style={{maxWidth:620, marginTop:30, fontSize:18}}>
          A members-only board for senior roles at India's best companies — verified by your institute roll,
          surfaced with the alumni who can refer you, priced in lakhs not bands.
        </p>
        <div style={{display:'flex',gap:12,marginTop:36, alignItems:'center'}}>
          <a href="#/signin" className="mj-btn mj-btn--lg">Join with institute ID <Icon name="arrow" size={15}/></a>
          <a href="#/search" className="mj-btn mj-btn--ghost mj-btn--lg">Browse roles</a>
          <div style={{marginLeft:14, fontSize:12, color:'var(--muted)', lineHeight:1.4}}>
            <div><b style={{color:'var(--ink)',fontWeight:600}}>18,400</b> alumni verified</div>
            <div>across 23 IITs &amp; IIMs</div>
          </div>
        </div>

        <div className="proto-mobile-hide" style={{
          position:'absolute', right:80, top:88, width:220, height:220,
          border:'1px solid var(--rule)', borderRadius:'50%',
          display:'flex',alignItems:'center',justifyContent:'center',
          background:'var(--surface)', boxShadow:'var(--shadow-card)',
          padding:14, textAlign:'center', transform:'rotate(-6deg)',
        }}>
          <div>
            <div className="mj-mini" style={{fontSize:9}}>VERIFIED BY</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:32, lineHeight:1, color:'var(--primary)', margin:'8px 0 6px', letterSpacing:'-.02em', fontStyle:'italic'}}>Institute</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:32, lineHeight:1, color:'var(--ink)', letterSpacing:'-.02em'}}>roll, only</div>
            <div className="mj-mini" style={{fontSize:9, marginTop:8}}>NO LINKEDIN GUESSING</div>
          </div>
        </div>
      </section>

      <hr className="mj-rule"/>

      <section className="mj-content-section" style={{padding:'56px 80px', maxWidth:1400, margin:'0 auto'}}>
        <div className="mj-eyebrow" style={{marginBottom:18}}>How Manju works</div>
        <div className="mj-grid-3" style={{gap:32}}>
          {[
            { n:'01', t:'Verified, not crowded', d:"Sign-in through your institute's alumni office. Every member's badge is checked.", icon:'badge' },
            { n:'02', t:'Referral, not resume-blast', d:"Every role surfaces the alumni already inside. One tap to ask Rohan from your batch.", icon:'handshake' },
            { n:'03', t:'Senior, not entry', d:"Curated to ₹40 LPA and above. PM, EM, founding eng, IB, MBB, VP roles only.", icon:'spark' },
          ].map(p => (
            <div key={p.n}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                <div style={{width:42,height:42,borderRadius:'var(--radius)', border:'1px solid var(--rule)', background:'var(--surface)', display:'flex',alignItems:'center',justifyContent:'center', color:'var(--primary)'}}>
                  <Icon name={p.icon} size={20}/>
                </div>
                <div className="mj-mini" style={{fontSize:10}}>{p.n}</div>
              </div>
              <h3 className="mj-h3" style={{marginBottom:10}}>{p.t}</h3>
              <p className="mj-body">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="mj-rule"/>

      <section className="mj-content-section" style={{padding:'56px 80px', background:'var(--surface-2)'}}>
        <div style={{maxWidth:1400, margin:'0 auto'}}>
          <SectionHead
            eyebrow="Companies hiring alumni · live"
            title="Where your batch already works."
            subtitle="Curated employers with verified alumni inside. 312 hiring this week."
            action={<a href="#/search" className="mj-btn mj-btn--ghost">All employers <Icon name="arrow" size={13}/></a>}
          />
          <div className="mj-grid-4" style={{marginTop:20}}>
            {window.MJ.MJ_COMPANIES.map(c => (
              <a key={c.name} href="#/search" className="mj-card mj-card--btn" style={{display:'flex',alignItems:'center',gap:14, padding:'16px 18px', textDecoration:'none'}}>
                <CoLogo company={c.name} color={c.color}/>
                <div style={{flex:1, minWidth:0}}>
                  <div className="mj-h4">{c.name}</div>
                  <div className="mj-small" style={{marginTop:2}}>
                    <span style={{fontVariantNumeric:'tabular-nums', color:'var(--ink-soft)', fontWeight:500}}>{c.open}</span> open · alumni inside
                  </div>
                </div>
                <Icon name="chevronR" size={14} style={{color:'var(--muted)'}}/>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mj-grid-4 mj-content-section" style={{padding:'56px 80px', gap:48, alignItems:'baseline', maxWidth:1400, margin:'0 auto'}}>
        {[
          ['18,400','verified alumni'],['312','companies hiring'],
          ['1,847','referrals last week'],['₹74 LPA','median offer'],
        ].map(([n,l],i)=>(
          <div key={i} style={{borderLeft: i ? '1px solid var(--rule)' : 'none', paddingLeft: i ? 40 : 0}}>
            <div className="mj-num" style={{fontSize:56, lineHeight:1}}>{n}</div>
            <div className="mj-mini" style={{marginTop:8, fontSize:11}}>{l}</div>
          </div>
        ))}
      </section>

      <section className="mj-content-section" style={{padding:'72px 80px', background:'var(--primary)', color:'var(--on-primary)'}}>
        <div className="mj-split-cta" style={{maxWidth:1400, margin:'0 auto'}}>
          <div>
            <div className="mj-eyebrow" style={{color:'color-mix(in srgb, var(--on-primary) 65%, transparent)',marginBottom:18}}>Join Manju</div>
            <h2 style={{color:'var(--on-primary)', fontSize:34, fontWeight:600, lineHeight:1.15, letterSpacing:'-.01em'}}>
              Two clicks. Your institute email. You're in.
            </h2>
            <p style={{color:'color-mix(in srgb, var(--on-primary) 80%, transparent)',marginTop:18, fontSize:16, maxWidth:520}}>
              Verification takes under 30 seconds against your institute's official alumni roster. No résumé required to browse.
            </p>
          </div>
          <a href="#/signin" className="mj-card" style={{background:'color-mix(in srgb, var(--on-primary) 8%, transparent)', borderColor:'color-mix(in srgb, var(--on-primary) 14%, transparent)', textDecoration:'none', display:'block'}}>
            <div className="mj-label" style={{color:'color-mix(in srgb, var(--on-primary) 70%, transparent)'}}>Institute email</div>
            <div className="mj-input" style={{background:'transparent', borderColor:'color-mix(in srgb, var(--on-primary) 25%, transparent)', color:'var(--on-primary)'}}>
              you@iitb.ac.in
            </div>
            <div className="mj-btn mj-btn--lg" style={{marginTop:14, width:'100%', background:'var(--on-primary)', color:'var(--primary)', borderColor:'var(--on-primary)'}}>
              Verify &amp; continue <Icon name="arrow" size={14}/>
            </div>
            <div className="mj-mini" style={{color:'color-mix(in srgb, var(--on-primary) 60%, transparent)', marginTop:12, fontSize:9, textAlign:'center'}}>
              IIT · IIM · ISB · IISc · NID accepted
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// SIGN IN — 3-step wizard
// =========================================================================
function PSignIn() {
  const { state, dispatch } = useApp();
  const { authStep, authInstitute, authRoll, authOtp, authLoading, authError } = state;
  const route = useRoute();

  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [inst, setInst] = React.useState('IIT Bombay');
  const [yr, setYr] = React.useState('2018');
  const [loc, setLoc] = React.useState('Bengaluru');
  const [signUpStep, setSignUpStep] = React.useState(1);
  const [confirmPw, setConfirmPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState('');
  const [loginMode, setLoginMode] = React.useState('candidate'); // 'candidate' | 'recruiter' | 'admin'
  const [roleEmail, setRoleEmail] = React.useState('');
  const [rolePassword, setRolePassword] = React.useState('');

  const pwStrength = pw => {
    if (!pw) return null;
    if (pw.length < 8) return 'weak';
    if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 12) return 'strong';
    if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) return 'medium';
    return 'weak';
  };

  const next = () => dispatch({type:'AUTH_STEP', step: authStep + 1});

  const goToStep2 = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      dispatch({type:'AUTH_ERROR', error:'Name, Email, and Password are required.'});
      return;
    }
    if (password !== confirmPw) {
      dispatch({type:'AUTH_ERROR', error:'Passwords do not match.'});
      return;
    }
    if (password.length < 8) {
      dispatch({type:'AUTH_ERROR', error:'Password must be at least 8 characters.'});
      return;
    }
    dispatch({type:'AUTH_ERROR', error:null});
    setSignUpStep(2);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      dispatch({type:'AUTH_ERROR', error:'Name, Email, and Password are required.'});
      return;
    }
    dispatch({type:'AUTH_ERROR', error:null});
    dispatch({type:'AUTH_LOADING', value:true});
    try {
      const res = await window.MJ_api?.signup(email, password, name, inst, yr, loc);
      if (res && res.user) {
        dispatch({type:'SIGN_IN_USER', user: res.user});
        if (window.MJ_load) {
          await window.MJ_load();
        }
        dispatch({
          type: 'TOAST',
          toast: { msg: `Account created! Welcome ${res.user.first}`, icon: 'badge' }
        });
        setTimeout(() => route.go('profile'), 600);
      } else {
        dispatch({type:'AUTH_LOADING', value:false});
        dispatch({type:'AUTH_ERROR', error:'Registration failed'});
      }
    } catch (err) {
      dispatch({type:'AUTH_LOADING', value:false});
      dispatch({type:'AUTH_ERROR', error: err.message || 'Registration failed'});
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch({type:'AUTH_ERROR', error:'Email and Password are required.'});
      return;
    }
    dispatch({type:'AUTH_ERROR', error:null});
    dispatch({type:'AUTH_LOADING', value:true});
    try {
      const user = await window.MJ_api?.login(email, password);
      if (user) {
        if (user.role === 'admin') {
          dispatch({type:'SIGN_IN_ADMIN'});
          dispatch({type:'TOAST', toast:{msg:'Welcome, Admin', icon:'badge'}});
          setTimeout(() => route.go('admin'), 600);
        } else if (user.role === 'recruiter') {
          dispatch({type:'SIGN_IN_RECRUITER', company: user.recruiterCompany});
          dispatch({type:'TOAST', toast:{msg:`Signed in as ${user.recruiterCompany} recruiter`, icon:'briefcase'}});
          setTimeout(() => route.go('company'), 600);
        } else {
          dispatch({type:'SIGN_IN_USER', user});
          if (window.MJ_load) await window.MJ_load();
          dispatch({type:'TOAST', toast:{msg:`Welcome back, ${user.first}`, icon:'check'}});
          setTimeout(() => route.go('home'), 600);
        }
      } else {
        dispatch({type:'AUTH_LOADING', value:false});
        dispatch({type:'AUTH_ERROR', error:'Invalid email or password.'});
      }
    } catch (err) {
      dispatch({type:'AUTH_LOADING', value:false});
      dispatch({type:'AUTH_ERROR', error: err.message || 'Login failed.'});
    }
  };
  const handleRoleLogin = async (e) => {
    e.preventDefault();
    if (!roleEmail || !rolePassword) {
      dispatch({type:'AUTH_ERROR', error:'Email and Password are required.'});
      return;
    }
    dispatch({type:'AUTH_ERROR', error:null});
    dispatch({type:'AUTH_LOADING', value:true});
    try {
      const user = await window.MJ_api?.login(roleEmail, rolePassword);
      if (user) {
        if (user.role === 'admin') {
          dispatch({type:'SIGN_IN_ADMIN'});
          dispatch({type:'TOAST', toast:{msg:'Welcome, Admin', icon:'badge'}});
          setTimeout(() => route.go('admin'), 400);
        } else if (user.role === 'recruiter') {
          dispatch({type:'SIGN_IN_RECRUITER', company: user.recruiterCompany});
          dispatch({type:'TOAST', toast:{msg:`Signed in as ${user.recruiterCompany} recruiter`, icon:'briefcase'}});
          setTimeout(() => route.go('company'), 400);
        } else {
          dispatch({type:'AUTH_LOADING', value:false});
          dispatch({type:'AUTH_ERROR', error:'This account does not have recruiter or admin access.'});
        }
      } else {
        dispatch({type:'AUTH_LOADING', value:false});
        dispatch({type:'AUTH_ERROR', error:'Invalid email or password.'});
      }
    } catch (err) {
      dispatch({type:'AUTH_LOADING', value:false});
      dispatch({type:'AUTH_ERROR', error: err.message || 'Login failed.'});
    }
  };

  const finalize = () => {
    dispatch({type:'SIGN_IN'});
    route.go('home');
  };

  const openGoogleAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const onMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', onMessage);
        const token = event.data.token;

        dispatch({type:'AUTH_ERROR',error:null});
        dispatch({type:'AUTH_LOADING',value:true});
        try {
          const res = await window.MJ_api?.googleLogin(token);
          if (res && res.user) {
            dispatch({type:'SIGN_IN_USER', user: res.user});
            if (window.MJ_load) {
              await window.MJ_load();
            }
            dispatch({
              type: 'TOAST',
              toast: {
                msg: res.isNewUser ? `Google signup successful! Welcome ${res.user.first}` : `Logged in as ${res.user.first}`,
                icon: 'badge'
              }
            });
            setTimeout(() => {
              route.go(res.isNewUser ? 'profile' : 'home');
            }, 600);
          } else {
            dispatch({type:'AUTH_LOADING',value:false});
            dispatch({type:'AUTH_ERROR',error:'Google Sign In failed'});
          }
        } catch (err) {
          dispatch({type:'AUTH_LOADING',value:false});
          dispatch({type:'AUTH_ERROR',error: err.message || 'Google Sign In failed'});
        }
      }
    };

    window.addEventListener('message', onMessage);
    window.open('#/google-auth', 'Google Sign In', `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`);
  };

  const openLinkedInAuth = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const onMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
        window.removeEventListener('message', onMessage);
        const token = event.data.token;

        dispatch({type:'AUTH_ERROR',error:null});
        dispatch({type:'AUTH_LOADING',value:true});
        try {
          const res = await window.MJ_api?.linkedinLogin(token);
          if (res && res.user) {
            dispatch({type:'SIGN_IN_USER', user: res.user});
            if (window.MJ_load) {
              await window.MJ_load();
            }
            dispatch({
              type: 'TOAST',
              toast: {
                msg: res.isNewUser ? `LinkedIn signup successful! Welcome ${res.user.first}` : `Logged in as ${res.user.first}`,
                icon: 'badge'
              }
            });
            setTimeout(() => {
              route.go(res.isNewUser ? 'profile' : 'home');
            }, 600);
          } else {
            dispatch({type:'AUTH_LOADING',value:false});
            dispatch({type:'AUTH_ERROR',error:'LinkedIn Sign In failed'});
          }
        } catch (err) {
          dispatch({type:'AUTH_LOADING',value:false});
          dispatch({type:'AUTH_ERROR',error: err.message || 'LinkedIn Sign In failed'});
        }
      }
    };

    window.addEventListener('message', onMessage);
    window.open('#/linkedin-auth', 'LinkedIn Sign In', `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no`);
  };

  return (
    <div className="proto-route" style={{display:'flex', minHeight:'calc(100vh - 60px)'}}>
      <div className="mj-signin-left" style={{flex:'1 1 56%', padding:'56px 60px', display:'flex', flexDirection:'column', background:'var(--surface-2)', borderRight:'1px solid var(--rule)'}}>
        <div style={{flex:1, display:'flex',flexDirection:'column', justifyContent:'center', maxWidth:520}}>
          {loginMode === 'recruiter' ? (
            <>
              <h1 className="mj-display" style={{fontSize:52, marginBottom:16, letterSpacing:'-.02em'}}>
                Recruiter Portal.
              </h1>
              <p className="mj-body-lg" style={{maxWidth:420, fontSize:15, color:'var(--ink-soft)', lineHeight:1.6}}>
                Post jobs and hire from India's top alumni network. Verified IIT &amp; IIM talent only.
              </p>
              <div style={{marginTop:32}}>
                <div className="mj-mini" style={{fontSize:10, marginBottom:12, color:'var(--muted)'}}>HIRING COMPANIES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {['Swiggy','Flipkart','Razorpay','Goldman Sachs','Zerodha','McKinsey'].map(n=>
                    <span key={n} className="mj-chip">{n}</span>)}
                </div>
              </div>
            </>
          ) : loginMode === 'admin' ? (
            <>
              <h1 className="mj-display" style={{fontSize:52, marginBottom:16, letterSpacing:'-.02em'}}>
                Admin Access.
              </h1>
              <p className="mj-body-lg" style={{maxWidth:420, fontSize:15, color:'var(--ink-soft)', lineHeight:1.6}}>
                Platform management, member oversight, and job listings.
              </p>
            </>
          ) : isSignUp ? (
            <>
              <h1 className="mj-display" style={{fontSize:52, marginBottom:16, letterSpacing:'-.02em'}}>
                Join Manju.
              </h1>
              <p className="mj-body-lg" style={{maxWidth:420, fontSize:15, color:'var(--ink-soft)', lineHeight:1.6}}>
                Verified by your institute roll. Access senior roles referred by your own batchmates.
              </p>
              <div style={{marginTop:32}}>
                <div className="mj-mini" style={{fontSize:10, marginBottom:12, color:'var(--muted)'}}>23 INSTITUTES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {['IIT Bombay','IIT Delhi','IIT Madras','IIT Kanpur','IIT Kharagpur','IIT Roorkee','IIM Ahmedabad','IIM Bangalore','IIM Calcutta','ISB Hyderabad','IISc Bangalore','+ 12 more'].map(n=>
                    <span key={n} className="mj-chip">{n}</span>)}
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="mj-display" style={{fontSize:52, marginBottom:16, letterSpacing:'-.02em'}}>
                Welcome back.
              </h1>
              <p className="mj-body-lg" style={{maxWidth:420, fontSize:15, color:'var(--ink-soft)', lineHeight:1.6}}>
                Sign in with your institute alumni address.
              </p>
              <div style={{marginTop:32}}>
                <div className="mj-mini" style={{fontSize:10, marginBottom:12, color:'var(--muted)'}}>23 INSTITUTES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {['IIT Bombay','IIT Delhi','IIT Madras','IIT Kanpur','IIT Kharagpur','IIT Roorkee','IIM Ahmedabad','IIM Bangalore','IIM Calcutta','ISB Hyderabad','IISc Bangalore','+ 12 more'].map(n=>
                    <span key={n} className="mj-chip">{n}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{flex:'1 1 44%', padding:'60px', display:'flex', flexDirection:'column', justifyContent:'center', background:'var(--surface)'}}>
        <div style={{maxWidth:400, width:'100%', margin:'0 auto'}}>

          {authStep === 0 && (
            <>
              {authError && (
                <div style={{marginBottom:18, padding:'12px 14px', borderRadius:'var(--radius)', background:'#fef3f2', border:'1px solid #f4504c', color:'#991b1b', fontSize:13}}>
                  ❌ {authError}
                </div>
              )}

              {/* Role tab switcher - ALWAYS VISIBLE */}
              <div style={{display:'flex', gap:3, marginBottom:20, background:'var(--surface-2)', borderRadius:'var(--radius)', padding:3}}>
                {['candidate','recruiter','admin'].map(mode => (
                  <button key={mode} type="button"
                    onClick={() => { setLoginMode(mode); setIsSignUp(false); setSignUpStep(1); dispatch({type:'AUTH_ERROR',error:null}); }}
                    style={{
                      flex:1, padding:'6px 0', borderRadius:'calc(var(--radius) - 2px)',
                      border:'none', cursor:'pointer', fontSize:12.5, fontWeight:500,
                      background: loginMode === mode ? 'var(--surface)' : 'transparent',
                      color: loginMode === mode ? 'var(--ink)' : 'var(--muted)',
                      boxShadow: loginMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition:'all .15s',
                    }}>
                    {mode === 'candidate' ? 'Candidate' : mode === 'recruiter' ? 'Recruiter' : 'Admin'}
                  </button>
                ))}
              </div>

              {/* Quick OAuth Sign-in/Signup Options - Candidate Only */}
              {loginMode === 'candidate' && (
                <div style={{marginBottom:24, display:'flex', flexDirection:'column', gap:10}}>
                  <button type="button" onClick={openGoogleAuth} className="mj-btn" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px 16px', fontSize:14, fontWeight:600, width:'100%', background:'var(--surface-2)', color:'var(--ink)', border:'1px solid var(--rule)', cursor:'pointer'}}>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" alt="Google" style={{width:18, height:18}}/>
                    {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
                  </button>
                  <button type="button" onClick={openLinkedInAuth} className="mj-btn" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px 16px', fontSize:14, fontWeight:600, width:'100%', background:'var(--surface-2)', color:'var(--ink)', border:'1px solid var(--rule)', cursor:'pointer'}}>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'%3E%3Cpath fill='%230A66C2' d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'/%3E%3C/svg%3E" alt="LinkedIn" style={{width:18, height:18}}/>
                    {isSignUp ? 'Sign up with LinkedIn' : 'Continue with LinkedIn'}
                  </button>
                  <div style={{display:'flex', alignItems:'center', gap:10, margin:'16px 0', opacity:0.6}}>
                    <div style={{flex:1, height:1, background:'var(--rule)'}}/>
                    <div style={{fontSize:12, color:'var(--muted)'}}>or continue with email</div>
                    <div style={{flex:1, height:1, background:'var(--rule)'}}/>
                  </div>
                </div>
              )}

              {loginMode !== 'candidate' ? (
                <form onSubmit={handleRoleLogin} style={{display:'flex', flexDirection:'column', gap:12}}>
                  <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:4, letterSpacing:'-.01em'}}>
                    {loginMode === 'admin' ? 'Admin sign in' : 'Recruiter sign in'}
                  </h2>
                  <div>
                    <label className="mj-label">Email</label>
                    <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="email" value={roleEmail} onChange={e=>setRoleEmail(e.target.value)} required placeholder={loginMode === 'admin' ? 'admin@manju.in' : 'recruiter@company.com'}/>
                  </div>
                  <div>
                    <label className="mj-label">Password</label>
                    <div style={{position:'relative'}}>
                      <input className="mj-input" style={{height:36, padding:'6px 36px 6px 12px', fontSize:13.5, width:'100%', boxSizing:'border-box'}} type={showPw ? 'text' : 'password'} value={rolePassword} onChange={e=>setRolePassword(e.target.value)} required placeholder="••••••••"/>
                      <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:0,color:'var(--muted)',display:'flex',alignItems:'center'}}>
                        <Icon name={showPw ? 'eyeOff' : 'eye'} size={14}/>
                      </button>
                    </div>
                  </div>
                  <button className="mj-btn mj-btn--lg" type="submit" disabled={authLoading} style={{width:'100%', marginTop:4, justifyContent:'center'}}>
                    {authLoading ? 'Signing in…' : 'Sign In'}
                  </button>
                  <div style={{padding:'10px 12px', borderRadius:'var(--radius)', background:'var(--surface-2)', fontSize:11.5, color:'var(--muted)', lineHeight:1.5}}>
                    {loginMode === 'recruiter' ? 'Demo: recruiter@swiggy.com / recruiter123' : 'Demo: admin@manju.in / admin123'}
                  </div>
                </form>
              ) : isSignUp ? (
                <>
                  {signUpStep === 1 && (
                    <form onSubmit={goToStep2} style={{display:'flex', flexDirection:'column', gap:12}}>
                      <div style={{height:2, borderRadius:99, background:'var(--rule)', overflow:'hidden', marginBottom:18}}>
                        <div style={{width:'50%', height:'100%', background:'var(--primary)', borderRadius:99}}/>
                      </div>
                      <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:4, letterSpacing:'-.01em'}}>Create account</h2>

                      <div>
                        <label className="mj-label">Full Name</label>
                        <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="e.g. Arjun Sharma"/>
                      </div>
                      <div>
                        <label className="mj-label">Email Address</label>
                        <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="arjun@iitb.alumni.in"/>
                      </div>
                      <div>
                        <label className="mj-label">Password</label>
                        <div style={{position:'relative'}}>
                          <input className="mj-input" style={{height:36, padding:'6px 36px 6px 12px', fontSize:13.5, width:'100%', boxSizing:'border-box'}} type={showPw ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min. 8 characters"/>
                          <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:0,color:'var(--muted)',display:'flex',alignItems:'center'}}>
                            <Icon name={showPw ? 'eyeOff' : 'eye'} size={14}/>
                          </button>
                        </div>
                        {password && (
                          <div style={{marginTop:5, display:'flex', alignItems:'center', gap:8}}>
                            <div style={{flex:1, height:3, borderRadius:99, background:'var(--rule)', overflow:'hidden'}}>
                              <div style={{
                                width: pwStrength(password)==='strong' ? '100%' : pwStrength(password)==='medium' ? '60%' : '25%',
                                height:'100%', borderRadius:99, transition:'.3s',
                                background: pwStrength(password)==='strong' ? '#12b76a' : pwStrength(password)==='medium' ? '#f79009' : '#f04438'
                              }}/>
                            </div>
                            <span style={{fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', minWidth:34,
                              color: pwStrength(password)==='strong' ? '#12b76a' : pwStrength(password)==='medium' ? '#f79009' : '#f04438'}}>
                              {pwStrength(password)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mj-label">Confirm Password</label>
                        <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5, borderColor: confirmPw && confirmPw !== password ? '#f04438' : undefined}} type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} required placeholder="Re-enter password"/>
                        {confirmPw && confirmPw !== password && (
                          <div style={{fontSize:11, color:'#f04438', marginTop:4}}>Passwords don't match</div>
                        )}
                      </div>

                      <button className="mj-btn mj-btn--lg" type="submit" style={{width:'100%', marginTop:4, justifyContent:'center'}}>
                        Continue <Icon name="arrow" size={14}/>
                      </button>

                      <div style={{display:'flex',alignItems:'center',gap:12,margin:'2px 0'}}>
                        <div style={{flex:1, height:1, background:'var(--rule-soft)'}}/>
                        <span className="mj-mini" style={{fontSize:9, color:'var(--muted)'}}>OR SIGN UP WITH</span>
                        <div style={{flex:1, height:1, background:'var(--rule-soft)'}}/>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                        <button type="button" onClick={openGoogleAuth} className="mj-btn mj-btn--ghost" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 10px', fontSize:12.5, color:'var(--ink)'}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                          Google
                        </button>
                        <button type="button" onClick={openLinkedInAuth} className="mj-btn mj-btn--ghost" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px 10px', fontSize:12.5, color:'var(--ink)'}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          LinkedIn
                        </button>
                      </div>

                      <div style={{textAlign:'center', marginTop:2}}>
                        <button type="button" onClick={()=>{setIsSignUp(false); setSignUpStep(1); dispatch({type:'AUTH_ERROR',error:null});}} className="mj-btn mj-btn--text mj-btn--sm" style={{color:'var(--primary)', margin:'0 auto'}}>
                          Already have an account? Sign in
                        </button>
                      </div>
                    </form>
                  )}

                  {signUpStep === 2 && (
                    <form onSubmit={handleSignUp} style={{display:'flex', flexDirection:'column', gap:12}}>
                      <div style={{height:2, borderRadius:99, background:'var(--primary)', marginBottom:18}}/>
                      <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:4, letterSpacing:'-.01em'}}>Alumni profile</h2>

                      <div>
                        <label className="mj-label">Institute</label>
                        <select className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={inst} onChange={e=>setInst(e.target.value)}>
                          {['IIT Bombay','IIT Delhi','IIT Madras','IIT Kanpur','IIT Kharagpur','IIT Roorkee','IIT Guwahati','IIT Hyderabad','IIT BHU','IIT Indore','IIM Ahmedabad','IIM Bangalore','IIM Calcutta','IIM Lucknow','IIM Kozhikode','IIM Indore','ISB Hyderabad','IISc Bangalore','NID Ahmedabad','XLRI Jamshedpur','TISS Mumbai','MDI Gurgaon','FMS Delhi'].map(opt=>(
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                        <div>
                          <label className="mj-label">Graduation Year</label>
                          <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="number" min="1990" max="2030" value={yr} onChange={e=>setYr(e.target.value)} placeholder="e.g. 2018"/>
                        </div>
                        <div>
                          <label className="mj-label">Location</label>
                          <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="text" value={loc} onChange={e=>setLoc(e.target.value)} placeholder="e.g. Bengaluru"/>
                        </div>
                      </div>
                      <div>
                        <label className="mj-label">Current Role <span style={{color:'var(--muted)', fontWeight:400}}>(optional)</span></label>
                        <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="text" value={currentRole} onChange={e=>setCurrentRole(e.target.value)} placeholder="e.g. Senior PM at Flipkart"/>
                      </div>

                      <button className="mj-btn mj-btn--lg" type="submit" disabled={authLoading} style={{width:'100%', marginTop:4, justifyContent:'center'}}>
                        {authLoading ? 'Creating account…' : 'Create Account'}
                      </button>
                      <button type="button" onClick={()=>{setSignUpStep(1); dispatch({type:'AUTH_ERROR',error:null});}} className="mj-btn mj-btn--ghost" style={{width:'100%', justifyContent:'center'}}>
                        Back
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  <form onSubmit={handleSignIn} style={{display:'flex', flexDirection:'column', gap:10}}>
                    <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:6, letterSpacing:'-.01em'}}>Sign in</h2>
                    <div>
                      <label className="mj-label">Email</label>
                      <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="arjun@iitb.alumni.in"/>
                    </div>
                    <div>
                      <label className="mj-label">Password</label>
                      <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/>
                    </div>
                    <button className="mj-btn mj-btn--lg" type="submit" disabled={authLoading} style={{width:'100%', marginTop:4, justifyContent:'center'}}>
                      {authLoading ? 'Signing in…' : 'Sign In'}
                    </button>
                    <div style={{textAlign:'center'}}>
                      <button type="button" onClick={()=>{setIsSignUp(true); setSignUpStep(1); dispatch({type:'AUTH_ERROR',error:null});}} className="mj-btn mj-btn--text mj-btn--sm" style={{color:'var(--primary)', margin:'0 auto'}}>
                        New to Manju? Create an account
                      </button>
                    </div>
                  </form>

                  <div style={{display:'flex',alignItems:'center',gap:12,margin:'2px 0'}}>
                    <div style={{flex:1, height:1, background:'var(--rule)'}}/>
                    <span style={{fontSize:10, color:'var(--muted)', letterSpacing:'.06em', textTransform:'uppercase'}}>or</span>
                    <div style={{flex:1, height:1, background:'var(--rule)'}}/>
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6}}>
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={async () => {
                        dispatch({type:'AUTH_ERROR',error:null});
                        dispatch({type:'AUTH_LOADING',value:true});
                        try {
                          const user = await window.MJ_api?.login('arjun@iitbombay.ac.in', 'demo123');
                          if (user) {
                            dispatch({type:'SIGN_IN_USER', user});
                            if (window.MJ_load) { await window.MJ_load(); }
                            dispatch({type:'TOAST', toast:{msg:'Logged in (Arjun Sharma)', icon:'check'}});
                            setTimeout(()=>route.go('home'), 400);
                          } else {
                            dispatch({type:'AUTH_LOADING',value:false});
                            dispatch({type:'AUTH_ERROR',error:'Invalid credentials or server error'});
                          }
                        } catch(err) {
                          dispatch({type:'AUTH_LOADING',value:false});
                          dispatch({type:'AUTH_ERROR',error: err.message || 'Login failed.'});
                        }
                      }}
                      className="mj-btn mj-btn--ghost"
                      style={{justifyContent:'center', fontSize:12, padding:'7px 8px'}}
                    >
                      Demo
                    </button>
                    <button type="button" onClick={openGoogleAuth} className="mj-btn mj-btn--ghost" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:12,padding:'7px 8px'}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                    <button type="button" onClick={openLinkedInAuth} className="mj-btn mj-btn--ghost" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:5,fontSize:12,padding:'7px 8px'}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </button>
                  </div>

                  <div style={{textAlign:'center', paddingTop:4}}>
                    <button type="button" onClick={()=>dispatch({type:'AUTH_STEP',step:1})} className="mj-btn mj-btn--text mj-btn--sm" style={{color:'var(--muted)', fontSize:11}}>
                      Verify with Institute ID instead
                    </button>
                  </div>
                </div>
              )}
            </>
          )}


          {authStep > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:30}}>
              {[1,2,3].map((n,i)=>(
                <React.Fragment key={n}>
                  <div style={{
                    width:28,height:28,borderRadius:99,
                    background: authStep>=n ? 'var(--primary)' : 'var(--surface-2)',
                    color: authStep>=n ? 'var(--on-primary)' : 'var(--muted)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600,
                    border: authStep===n ? '2px solid var(--primary)' : '0',
                    transition:'.2s',
                  }}>{authStep>n ? <Icon name="check" size={12} stroke={3}/> : n}</div>
                  {i<2 && <div style={{flex:1, height:1, background: authStep>i+1 ? 'var(--primary)':'var(--rule)', transition:'.3s'}}/>}
                </React.Fragment>
              ))}
            </div>
          )}

          {authStep === 1 && (
            <>
              <div className="mj-eyebrow" style={{marginBottom:12}}>Step 1 of 3</div>
              <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:10}}>Pick your institute</h2>
              <p className="mj-body" style={{marginBottom:24}}>We'll verify your roll against their official alumni roster.</p>
              <div style={{display:'flex',flexDirection:'column',gap:8, marginBottom:18}}>
                {['IIT Bombay','IIT Delhi','IIT Madras','IIM Ahmedabad','IIM Bangalore'].map(i=>(
                  <button key={i} onClick={()=>dispatch({type:'AUTH_FIELD',key:'authInstitute',value:i})}
                    className="mj-card mj-card--btn" style={{padding:'14px 18px', display:'flex',alignItems:'center',gap:12, border:'1px solid', borderColor: authInstitute===i ? 'var(--primary)':'var(--rule)', background: authInstitute===i ? 'var(--primary-tint)':'var(--surface)', cursor:'pointer', textAlign:'left'}}>
                    <span className={`mj-dot ${authInstitute===i?'on':''}`}/>
                    <span style={{flex:1, fontSize:14, fontWeight:500, color:'var(--ink)'}}>{i}</span>
                  </button>
                ))}
              </div>
              <button className="mj-btn mj-btn--lg" style={{width:'100%'}} onClick={next}>Continue <Icon name="arrow" size={14}/></button>
            </>
          )}

          {authStep === 2 && (
            <>
              <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:6}}>Your roll number</h2>
              <p className="mj-body" style={{marginBottom:20, color:'var(--ink-soft)'}}>Checked against <b style={{color:'var(--ink)'}}>{authInstitute}</b>'s alumni roster.</p>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div>
                  <label className="mj-label">Roll number</label>
                  <input className="mj-input mj-input--lg" value={authRoll}
                    onChange={e=>dispatch({type:'AUTH_FIELD',key:'authRoll',value:e.target.value})}/>
                </div>
                <div>
                  <label className="mj-label">Graduation year</label>
                  <input className="mj-input mj-input--lg" defaultValue="2018"/>
                </div>
                <div className="mj-card mj-card--inset" style={{padding:'12px 14px', display:'flex', gap:12, alignItems:'center'}}>
                  <Icon name="badge" size={18} style={{color:'var(--accent)'}}/>
                  <div className="mj-small" style={{lineHeight:1.4}}>
                    <b style={{color:'var(--ink)',fontWeight:600}}>Match found.</b> Arjun Sharma · B.Tech CSE, '18.<br/>
                    OTP to <b style={{color:'var(--ink)'}}>arjun.s****@iitb.alumni.in</b>?
                  </div>
                </div>
                <button className="mj-btn mj-btn--lg" style={{width:'100%', marginTop:6}} onClick={next}>Send code <Icon name="arrow" size={14}/></button>
                <button className="mj-btn mj-btn--text mj-btn--sm" style={{justifyContent:'center'}} onClick={()=>dispatch({type:'AUTH_STEP',step:1})}>Back</button>
              </div>
            </>
          )}

          {authStep === 3 && (
            <>
              <h2 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:6}}>One-time code</h2>
              <p className="mj-body" style={{marginBottom:20, color:'var(--ink-soft)'}}>Sent to your institute email. Use <b style={{color:'var(--ink)'}}>1234</b> for this demo.</p>
              <div style={{display:'flex',gap:10, marginBottom:18, justifyContent:'center'}}>
                {[0,1,2,3].map(i=>(
                  <input key={i} maxLength={1} className="mj-input"
                    value={authOtp[i]||''}
                    onChange={e=>{
                      const v = (authOtp.slice(0,i) + e.target.value + authOtp.slice(i+1)).slice(0,4);
                      dispatch({type:'AUTH_FIELD',key:'authOtp',value:v});
                      const el = document.getElementById(`otp-${i+1}`); if (e.target.value && el) el.focus();
                    }}
                    id={`otp-${i}`}
                    style={{width:60, height:64, fontSize:24, textAlign:'center', fontFamily:'var(--font-display)', fontWeight:500, color:'var(--ink)'}}/>
                ))}
              </div>
              <button className="mj-btn mj-btn--lg" style={{width:'100%'}} disabled={authOtp.length!==4}
                onClick={()=>{
                  if (authOtp === '1234') finalize();
                  else dispatch({type:'TOAST',toast:{msg:'Try code 1234 for this demo', icon:'badge'}});
                }}>
                Verify &amp; sign in <Icon name="arrow" size={14}/>
              </button>
              <button className="mj-btn mj-btn--text mj-btn--sm" style={{justifyContent:'center', marginTop:8, width:'100%'}}
                onClick={()=>{ dispatch({type:'AUTH_FIELD',key:'authOtp',value:''}); dispatch({type:'AUTH_STEP',step:2}); }}>
                Resend code
              </button>
              <button className="mj-btn mj-btn--text mj-btn--sm" style={{justifyContent:'center', marginTop:4, width:'100%', color:'var(--muted)'}}
                onClick={()=>{ dispatch({type:'AUTH_FIELD',key:'authOtp',value:''}); dispatch({type:'AUTH_STEP',step:0}); }}>
                ← Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// HOME — logged-in dashboard
// =========================================================================
function PHome() {
  const { state, dispatch } = useApp();
  const route = useRoute();
  const appliedCount = Object.keys(state.applications).length;
  const inReview = Object.values(state.applications).filter(a=>a.stage==='In review' || a.stage==='Interviewing').length;
  const referralsOpen = Object.values(state.referralRequests).filter(r=>r.state!=='replied').length;
  const recommended = window.MJ.MJ_JOBS.slice(0,3);

  return (
    <div className="proto-route" style={{maxWidth:1400, margin:'0 auto'}}>
      <section style={{padding:'48px 40px 32px'}}>
        <div className="mj-home-greet" style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24}}>
          <div>
            <div style={{fontSize:11, color:'var(--muted)', marginBottom:10, letterSpacing:'.04em', textTransform:'uppercase'}}>Saturday · 23 May · Bengaluru</div>
            <h1 style={{fontSize:28, fontWeight:600, color:'var(--ink)', letterSpacing:'-.01em', marginBottom:6}}>
              Good morning, {state.profile.first}.
            </h1>
            <p className="mj-body" style={{marginTop:6, color:'var(--ink-soft)'}}>
              3 new roles match your profile · 2 alumni opened your referral request.
            </p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="mj-btn mj-btn--ghost" onClick={()=>dispatch({type:'STATUS_TOGGLE'})}><Icon name="cal" size={14}/> Set status</button>
            <a href="#/search" className="mj-btn">See matches <Icon name="arrow" size={14}/></a>
          </div>
        </div>
      </section>

      <section className="mj-grid-4" style={{padding:'0 40px 32px', gap:14}}>
        <StatTile label="Applied" value={appliedCount} sub="+2 this week"/>
        <StatTile label="In review" value={inReview} sub="2 employers viewing"/>
        <StatTile label="Referrals open" value={referralsOpen} sub="2 accepted" accent/>
        <StatTile label="Saved" value={state.saved.length} sub="3 new for you"/>
      </section>

      <section style={{padding:'12px 40px 32px'}}>
        <SectionHead
          title="Recommended for you"
          subtitle="Curated using your profile, batch movement, and alumni already inside."
          action={<a href="#/search" className="mj-btn mj-btn--text">See all <Icon name="arrow" size={12}/></a>}
        />
        <div className="mj-grid-3" style={{gap:14}}>
          {recommended.map(j => (
            <div key={j.id} className="mj-card mj-card--btn" onClick={()=>route.go('job', j.id)}
              style={{display:'flex',flexDirection:'column', gap:14, cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between', alignItems:'flex-start'}}>
                <CoLogo company={j.company} color={j.logoColor}/>
                <MatchScore value={j.match}/>
              </div>
              <div>
                <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:500, lineHeight:1.15, marginBottom:6, letterSpacing:'-.01em', color:'var(--ink)'}}>{j.role}</div>
                <div className="mj-small">{j.company} · {j.location} · {j.comp}</div>
              </div>
              <ReferralStrip count={j.alumni} inRole={j.alumniInRole} dense/>
              <div style={{display:'flex',gap:8, marginTop:'auto'}}>
                <button className="mj-btn mj-btn--ghost mj-btn--sm" style={{flex:1}}
                  onClick={(e)=>{e.stopPropagation(); dispatch({type:'SAVE_TOGGLE',jobId:j.id});}}>
                  {state.saved.includes(j.id) ? '★ Saved' : '☆ Save'}
                </button>
                <button className="mj-btn mj-btn--sm" style={{flex:1}}
                  onClick={(e)=>{e.stopPropagation(); dispatch({type:'APPLY_BEGIN',jobId:j.id}); route.go('apply', j.id);}}>
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mj-main-side" style={{padding:'12px 40px 60px', gap:24}}>
        <div>
          <SectionHead eyebrow="Referral activity" title="In motion" level={3}/>
          <div className="mj-card" style={{padding:0, overflow:'hidden'}}>
            {Object.entries(state.referralRequests).map(([key,r],i,arr)=>{
              const [name,co] = key.split('@');
              const alum = window.MJ.MJ_ALUMNI.find(a=>a.name===name);
              return (
                <div key={key} style={{display:'flex',alignItems:'center',gap:14, padding:'16px 20px', borderBottom: i<arr.length-1 ? '1px solid var(--rule-soft)' : 'none'}}>
                  <Avatar name={name} initials={alum?.initials} color={alum?.color}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13.5, color:'var(--ink)'}}>
                      <b style={{fontWeight:600}}>{name}</b>
                      <span className="mj-small" style={{marginLeft:6, color:'var(--muted)'}}>· {co}</span>
                    </div>
                    <div className="mj-small" style={{marginTop:2, color:'var(--ink-soft)'}}>
                      {r.state==='accepted' && 'accepted your referral request'}
                      {r.state==='viewed' && 'opened your profile · viewed twice'}
                      {r.state==='replied' && 'replied · "happy to refer, send CV"'}
                    </div>
                  </div>
                  <span className="mj-mini">{r.at}</span>
                  <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={()=>route.go('job', r.jobId)}>View role</button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="mj-card">
            <div className="mj-eyebrow" style={{marginBottom:10}}>Profile completeness</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:14}}>
              <div className="mj-num" style={{fontSize:48,lineHeight:1}}>{state.profile.completeness}<span style={{fontSize:24, color:'var(--muted)'}}>%</span></div>
              <div className="mj-small" style={{paddingBottom:6}}>+8% from last week</div>
            </div>
            <div style={{height:6, background:'var(--surface-2)', borderRadius:99, marginBottom:14}}>
              <div style={{width:`${state.profile.completeness}%`, height:'100%', background:'var(--primary)', borderRadius:99, transition:'.5s'}}/>
            </div>
            <a href="#/profile" className="mj-btn mj-btn--ghost mj-btn--sm" style={{width:'100%'}}>Edit profile <Icon name="arrowSm" size={12}/></a>
          </div>

          <div className="mj-card">
            <div className="mj-eyebrow" style={{marginBottom:12}}>Employers viewing you</div>
            <div className="mj-avs">
              {window.MJ.MJ_COMPANIES.slice(0,5).map(c=>
                <span key={c.name} className="mj-av mj-av--sm" style={{background:c.color, fontSize:11, border:'2px solid var(--surface)'}}>{c.name[0]}</span>
              )}
            </div>
            <div className="mj-small" style={{marginTop:8}}>5 viewed this week</div>
            <a href="#/tracker" className="mj-btn mj-btn--text mj-btn--sm" style={{marginTop:12, padding:'6px 0'}}>See viewers <Icon name="arrowSm" size={12}/></a>
          </div>
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// SEARCH — live filters, click → job detail
// =========================================================================
function PSearch() {
  const { state, dispatch } = useApp();
  const route = useRoute();
  const f = state.filters;
  const filtered = React.useMemo(()=>filterJobs(window.MJ.MJ_JOBS, f), [f]);
  const [selected, setSelected] = React.useState(filtered[0] || window.MJ.MJ_JOBS[0]);

  const [visibleCount, setVisibleCount] = React.useState(5);
  React.useEffect(() => {
    setVisibleCount(5);
  }, [f]);

  const paginatedFiltered = React.useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  React.useEffect(() => {
    if (!filtered.find(j=>j.id===selected?.id)) setSelected(filtered[0] || null);
  }, [filtered]);

  const isSplit = f.layout === 'split';
  const isDigest = f.layout === 'digest';

  const grouped = isDigest ? [
    ['Today', paginatedFiltered.slice(0,2)],
    ['This week', paginatedFiltered.slice(2,5)],
    ['Earlier', paginatedFiltered.slice(5)],
  ].filter(([,arr])=>arr.length>0) : null;

  // Autocomplete state & logic
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const suggestions = React.useMemo(() => {
    if (!f.query || f.query.trim().length < 2) return [];
    const q = f.query.toLowerCase().trim();
    const items = new Set();
    
    const allTags = ['Product', 'Engineering', 'Strategy', 'Finance', 'Marketing', 'Founding', 'Design', 'Data Science'];
    allTags.forEach(t => {
      if (t.toLowerCase().includes(q)) items.add(t);
    });

    (window.MJ.MJ_JOBS || []).forEach(j => {
      if (j.company.toLowerCase().includes(q)) items.add(j.company);
      if (j.role.toLowerCase().includes(q)) items.add(j.role);
    });

    return Array.from(items).slice(0, 5);
  }, [f.query]);

  // Sort dropdown state
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);

  return (
    <div className="proto-route" style={{display:'flex',flexDirection:'column', minHeight:'calc(100vh - 60px)'}}>
      <div className="mj-search-topbar" style={{padding:'18px 40px', borderBottom:'1px solid var(--rule)', background:'var(--surface)', display:'flex',gap:12, alignItems:'center'}}>
        <div style={{position:'relative', flex:1}} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
          <Icon name="search" size={16} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}/>
          <input className="mj-input" value={f.query} onChange={e=>dispatch({type:'FILTER_SET',key:'query',value:e.target.value})}
            placeholder="Search roles, companies…" style={{paddingLeft:38}}/>
          
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
              background: 'var(--surface)', border: '1px solid var(--rule)',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)',
              zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    dispatch({type:'FILTER_SET', key:'query', value: sug});
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: '10px 14px', border: 'none', background: 'none',
                    textAlign: 'left', cursor: 'pointer', fontSize: 13,
                    color: 'var(--ink)', borderBottom: idx < suggestions.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'background .12s',
                    width: '100%'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <Icon name="search" size={13} style={{color: 'var(--muted)'}}/>
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mj-search-loc" style={{position:'relative', width:220}}>
          <Icon name="location" size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--muted)'}}/>
          <input className="mj-input" value={f.location} onChange={e=>dispatch({type:'FILTER_SET',key:'location',value:e.target.value})} style={{paddingLeft:38}}/>
        </div>
        <button className="mj-btn">Search</button>
        <div className="mj-search-divider" style={{flex:'0 0 1px', height:24, background:'var(--rule)'}}/>
        <div className="mj-search-layouts" style={{display:'flex',gap:2, border:'1px solid var(--rule)', borderRadius:'var(--radius)', padding:2}}>
          {[['list','list'],['split','split'],['grid','digest']].map(([icon,key])=>(
            <button key={key} className="mj-btn mj-btn--text"
              onClick={()=>dispatch({type:'FILTER_SET',key:'layout',value:key})}
              style={{padding:'6px 10px', background: f.layout===key ? 'var(--surface-2)':'transparent', color:f.layout===key?'var(--ink)':'var(--muted)', borderRadius:3}}>
              <Icon name={icon} size={14}/>
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1, display:'flex', minHeight:0, background:'var(--bg)'}}>
        <aside className="mj-filter-rail mj-scroll">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', marginBottom:18}}>
            <div className="mj-h4" style={{display:'flex',alignItems:'center',gap:8}}><Icon name="filter" size={15}/> Filters</div>
            <a href="#" onClick={(e)=>{e.preventDefault();dispatch({type:'FILTER_RESET'})}} className="mj-mini" style={{textDecoration:'none', color:'var(--primary)'}}>Clear</a>
          </div>

          <FilterGroup label="Experience">
            {!f.showAll && (
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:10}}>
                Locked to your profile experience ({getUserExpBand(state.profile).join(', ')}). Switch to "All roles" to customize.
              </div>
            )}
            <div style={{opacity: !f.showAll ? 0.6 : 1, pointerEvents: !f.showAll ? 'none' : 'auto'}}>
              {['0–3 years','3–5 years','5–8 years','8+ years'].map((lbl,i)=>(
                <FilterCheck key={lbl} label={lbl} count={[142,284,419,167][i]}
                  checked={f.showAll ? f.exp.includes(lbl) : getUserExpBand(state.profile).includes(lbl)}
                  onClick={()=>dispatch({type:'FILTER_TOGGLE',key:'exp',value:lbl})}/>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Function">
            {['Product','Engineering','Strategy','Finance','Marketing','Founding'].map((fn,i)=>(
              <FilterCheck key={fn} label={fn} count={[218,612,184,142,98,34][i]}
                checked={f.function.includes(fn)}
                onClick={()=>dispatch({type:'FILTER_TOGGLE',key:'function',value:fn})}/>
            ))}
          </FilterGroup>

          <FilterGroup label="Mode">
            <FilterChips options={['On-site','Hybrid','Remote']} value={f.mode}
              onChange={v=>dispatch({type:'FILTER_SET',key:'mode',value:v})}/>
          </FilterGroup>

          <FilterGroup label="Compensation">
            <div style={{padding:'8px 0'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13}}>
                <span className="mj-num" style={{color:'var(--primary)', fontWeight:600}}>₹{f.minComp || 40} LPA</span>
                <span style={{color:'var(--muted)'}}>₹150 LPA</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                step="5"
                value={f.minComp || 40}
                onChange={e => dispatch({type:'FILTER_SET', key:'minComp', value: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  height: 4,
                  background: 'var(--surface-3)',
                  borderRadius: 2,
                  outline: 'none'
                }}
              />
              <div style={{marginTop:8, fontSize:10.5, color:'var(--muted)', lineHeight:1.4}}>
                Showing roles above ₹{f.minComp || 40} LPA maximum compensation.
              </div>
            </div>
          </FilterGroup>

          <FilterGroup label="Has alumni inside">
            <FilterCheck label="At least 1 alumni" count={894}
              checked={f.hasAlumni}
              onClick={()=>dispatch({type:'FILTER_SET',key:'hasAlumni',value:!f.hasAlumni})}/>
          </FilterGroup>
        </aside>

        <div className="mj-scroll" style={{flex:1, padding:'24px 28px 40px', minWidth:0, alignSelf:'stretch'}}>
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:16,marginBottom:18}}>
            <div>
              <div style={{display:'flex', gap:16, marginBottom:10, borderBottom:'1px solid var(--rule)', paddingBottom:4}}>
                <button
                  onClick={() => dispatch({type:'FILTER_SET', key:'showAll', value: false})}
                  style={{
                    background: 'none', border: 'none', padding: '6px 4px',
                    fontSize: 14, fontWeight: !f.showAll ? 600 : 500,
                    color: !f.showAll ? 'var(--primary)' : 'var(--muted)',
                    borderBottom: !f.showAll ? '2px solid var(--primary)' : '2px solid transparent',
                    cursor: 'pointer', transition: '.15s', outline: 'none'
                  }}
                >
                  Matches for you
                </button>
                <button
                  onClick={() => dispatch({type:'FILTER_SET', key:'showAll', value: true})}
                  style={{
                    background: 'none', border: 'none', padding: '6px 4px',
                    fontSize: 14, fontWeight: f.showAll ? 600 : 500,
                    color: f.showAll ? 'var(--primary)' : 'var(--muted)',
                    borderBottom: f.showAll ? '2px solid var(--primary)' : '2px solid transparent',
                    cursor: 'pointer', transition: '.15s', outline: 'none'
                  }}
                >
                  All roles
                </button>
              </div>
              <h2 className="mj-h2">
                <span style={{fontSize:22, fontWeight:600, color:'var(--ink)'}}>{filtered.length}</span> <span style={{color:'var(--ink-soft)', fontSize:13}}>{f.showAll ? 'roles' : 'roles for you'}</span>
              </h2>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center', position:'relative'}}>
              <span className="mj-mini">Sort by</span>
              <button
                className="mj-btn mj-btn--ghost mj-btn--sm"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{display:'flex', alignItems:'center', gap:6}}
              >
                {f.sort === 'comp' ? 'Compensation' : f.sort === 'posted' ? 'Newest first' : 'Match score'}
                <Icon name="chevron" size={12}/>
              </button>
              
              {showSortDropdown && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                    background: 'var(--surface)', border: '1px solid var(--rule)',
                    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)',
                    zIndex: 100, display: 'flex', flexDirection: 'column',
                    minWidth: 160, overflow: 'hidden'
                  }}
                  onMouseLeave={() => setShowSortDropdown(false)}
                >
                  {[
                    { value: 'match', label: 'Match score' },
                    { value: 'comp', label: 'Compensation' },
                    { value: 'posted', label: 'Newest first' }
                  ].map((opt, idx) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        dispatch({type:'FILTER_SET', key:'sort', value: opt.value});
                        setShowSortDropdown(false);
                      }}
                      style={{
                        padding: '10px 14px', border: 'none', background: f.sort === opt.value ? 'var(--primary-tint)' : 'none',
                        textAlign: 'left', cursor: 'pointer', fontSize: 13,
                        color: f.sort === opt.value ? 'var(--primary)' : 'var(--ink)',
                        fontWeight: f.sort === opt.value ? 600 : 500,
                        borderBottom: idx < 2 ? '1px solid var(--rule-soft)' : 'none',
                        transition: 'background .12s',
                        width: '100%'
                      }}
                      onMouseOver={e => {
                        if (f.sort !== opt.value) e.currentTarget.style.background = 'var(--surface-2)';
                      }}
                      onMouseOut={e => {
                        if (f.sort !== opt.value) e.currentTarget.style.background = 'none';
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mj-card" style={{padding:'80px 40px', textAlign:'center'}}>
              <div className="mj-mini" style={{marginBottom:14}}>NO MATCHES</div>
              <h3 className="mj-h3" style={{marginBottom:10}}>No roles match these filters.</h3>
              <p className="mj-body" style={{marginBottom:18}}>Try clearing function or experience filters.</p>
              <button className="mj-btn" onClick={()=>dispatch({type:'FILTER_RESET'})}>Clear filters</button>
            </div>
          ) : isDigest ? (
            <div style={{display:'flex',flexDirection:'column',gap:32}}>
              {grouped.map(([label, list]) => (
                <div key={label}>
                  <div className="mj-eyebrow" style={{marginBottom:12}}>{label} · {list.length}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {list.map(j => <ProtoJobCard key={j.id} job={j} onSelect={()=>route.go('job',j.id)}/>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {paginatedFiltered.map(j => (
                <ProtoJobCard key={j.id} job={j}
                  selected={isSplit && selected?.id===j.id}
                  onSelect={()=>isSplit ? setSelected(j) : route.go('job',j.id)}
                  onOpen={()=>route.go('job',j.id)}/>
              ))}
            </div>
          )}

          {filtered.length > visibleCount && (
            <div style={{display:'flex', justifyContent:'center', marginTop:24}}>
              <button
                className="mj-btn mj-btn--ghost"
                onClick={() => setVisibleCount(prev => prev + 5)}
                style={{
                  padding: '12px 24px', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8,
                  borderColor: 'var(--primary)', color: 'var(--primary)', background: 'var(--primary-tint)'
                }}
              >
                Show more matches <Icon name="chevron" size={14}/>
              </button>
            </div>
          )}
        </div>
        {isSplit && selected && (
          <aside className="mj-split-preview mj-scroll">
            <ProtoPreviewPane job={selected}/>
          </aside>
        )}
      </div>
    </div>
  );
}

function ProtoJobCard({ job, selected, onSelect, onOpen }) {
  const { state, dispatch } = useApp();
  const isSaved = state.saved.includes(job.id);
  const isApplied = !!state.applications[job.id];
  return (
    <div onClick={onSelect} className="mj-job-row"
      style={{
        background:'var(--surface)',
        border:'1px solid', borderColor: selected ? 'var(--primary)' : 'var(--rule)',
        borderRadius:'var(--radius-lg)', padding:'18px 22px', cursor:'pointer',
        transition:'.15s',
        boxShadow: selected ? '0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)' : 'none',
      }}>
      <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <CoLogo company={job.company} color={job.logoColor}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
            <div style={{minWidth:0}}>
              <div className="mj-job-title" style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:20, color:'var(--ink)', lineHeight:1.15, letterSpacing:'-.01em', marginBottom:3}}>{job.role}</div>
              <div className="mj-job-meta" style={{fontSize:13, color:'var(--ink-soft)', marginTop:4, display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{fontWeight:500}}>{job.company}</span>
                <span style={{color:'var(--rule)'}}>·</span>
                <span>{job.location}</span>
                <span style={{color:'var(--rule)'}}>·</span>
                <span style={{fontVariantNumeric:'tabular-nums'}}>{job.comp}</span>
              </div>
            </div>
            <MatchScore value={job.match}/>
          </div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:12}}>
            <span className="mj-chip">{job.exp}</span>
            <span className="mj-chip">{job.mode}</span>
            {job.tags && job.tags.slice(0,2).map(t=><span key={t} className="mj-chip">{t}</span>)}
            {isApplied && <span className="mj-chip mj-chip--tint">Applied · {state.applications[job.id].stage}</span>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14,marginTop:14,paddingTop:12,borderTop:'1px dashed var(--rule)'}}>
            {job.alumni > 0 ? (
              <>
                <div className="mj-avs">
                  {window.MJ.MJ_ALUMNI.slice(0,Math.min(3,job.alumni)).map((a,i)=>
                    <span key={i} className="mj-av mj-av--sm" style={{background:a.color, fontSize:10, border:'2px solid var(--surface)'}}>{a.initials}</span>
                  )}
                </div>
                <span className="mj-small" style={{color:'var(--ink-soft)'}}>
                  <b style={{fontWeight:600,color:'var(--ink)'}}>{job.alumni} alumni</b> at {job.company}
                </span>
              </>
            ) : <span className="mj-small">No alumni at {job.company} yet</span>}
            <div style={{flex:1}}/>
            <span className="mj-meta">{job.posted}</span>
            <button className="mj-btn mj-btn--ghost mj-btn--sm"
              onClick={(e)=>{e.stopPropagation(); dispatch({type:'SAVE_TOGGLE',jobId:job.id});}}>
              {isSaved ? '★ Saved' : '☆ Save'}
            </button>
            {onOpen && (
              <button className="mj-btn mj-btn--sm" onClick={(e)=>{e.stopPropagation(); onOpen();}}>
                View <Icon name="arrowSm" size={11}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtoPreviewPane({ job }) {
  const { state, dispatch } = useApp();
  const route = useRoute();
  const isSaved = state.saved.includes(job.id);
  return (
    <div>
      <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:16}}>
        <CoLogo company={job.company} color={job.logoColor} size="lg"/>
        <div style={{flex:1}}>
          <h3 className="mj-h3" style={{fontSize:22, marginBottom:4}}>{job.role}</h3>
          <div style={{fontSize:13, color:'var(--ink-soft)'}}>
            <span style={{fontWeight:500}}>{job.company}</span> · {job.location}
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap', marginBottom:18}}>
        <MatchScore value={job.match}/>
        <span className="mj-chip">{job.exp}</span>
        <span className="mj-chip">{job.mode}</span>
      </div>
      <div style={{display:'flex',gap:8, marginBottom:20}}>
        <button className="mj-btn" style={{flex:1}}
          onClick={()=>{ dispatch({type:'APPLY_BEGIN',jobId:job.id}); route.go('apply',job.id); }}>
          Apply <Icon name="arrowSm" size={12}/>
        </button>
        <button className="mj-btn mj-btn--ghost" onClick={()=>dispatch({type:'SAVE_TOGGLE',jobId:job.id})}>
          {isSaved ? '★' : '☆'}
        </button>
      </div>
      <div style={{padding:'14px 0', borderTop:'1px solid var(--rule-soft)', borderBottom:'1px solid var(--rule-soft)', display:'grid',gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20}}>
        <div>
          <div className="mj-mini" style={{marginBottom:4}}>Compensation</div>
          <div className="mj-num" style={{fontSize:18}}>{job.comp}</div>
        </div>
        <div>
          <div className="mj-mini" style={{marginBottom:4}}>Experience</div>
          <div className="mj-num" style={{fontSize:18}}>{job.exp}</div>
        </div>
      </div>
      <div className="mj-eyebrow" style={{marginBottom:10}}>Role</div>
      <p className="mj-body" style={{marginBottom:18}}>{job.description}</p>
      <a href={`#/job/${job.id}`} className="mj-btn mj-btn--text mj-btn--sm">Full detail <Icon name="arrowSm" size={11}/></a>

      <div className="mj-eyebrow" style={{margin:'18px 0 10px'}}>Who could refer you</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {window.MJ.MJ_ALUMNI.map((a,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12, padding:'10px 0', borderBottom: i<2 ? '1px solid var(--rule-soft)' : 'none'}}>
            <Avatar name={a.name} initials={a.initials} color={a.color}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13, fontWeight:600, color:'var(--ink)'}}>{a.name}</div>
              <div className="mj-small" style={{marginTop:1}}>{a.institute} · {a.batch} · {a.role}</div>
            </div>
            <button className="mj-btn mj-btn--ghost mj-btn--sm"
              onClick={()=>dispatch({type:'TOAST',toast:{msg:`Referral request sent to ${a.name}`, icon:'handshake'}})}>
              Ask
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PGoogleAuth() {
  const [customMode, setCustomMode] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const accounts = [
    { name: 'Arjun Sharma', email: 'arjun@iitbombay.ac.in', initial: 'A', color: '#C84B31' },
    { name: 'Priya Iyer', email: 'priya@iimbangalore.ac.in', initial: 'P', color: '#E6843D' },
    { name: 'Rohan Mehta', email: 'rohan@iitbombay.ac.in', initial: 'R', color: '#4A90D9' },
  ];

  const handleSelect = (userEmail, userName) => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'GOOGLE_AUTH_SUCCESS', token: `mock_|${userEmail}|${userName}` },
        window.location.origin
      );
      window.close();
    } else {
      setError('Window opener not found. Run this inside the popup flow.');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email || !name) {
      setError('Please fill in both name and email.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    handleSelect(email, name);
  };

  return (
    <div style={{
      background: '#FFFFFF', color: '#1F1F1F', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif', padding: 24, boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%', maxWidth: 400, border: '1px solid #DADCE0', borderRadius: 8,
        padding: '40px 36px', boxSizing: 'border-box', background: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        {/* Google Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="74" height="24" viewBox="0 0 74 24" fill="none">
            <path d="M7.7 15.6c-2.4 0-4.4-1.8-4.4-4.4s2-4.4 4.4-4.4c1.2 0 2.2.5 3 1.2l2.3-2.3c-1.4-1.3-3.3-2.1-5.3-2.1-4.2 0-7.7 3.4-7.7 7.6s3.5 7.6 7.7 7.6c2 0 3.9-.8 5.3-2.1l-2.3-2.3c-.8.7-1.8 1.2-3 1.2z" fill="#EA4335" />
            <path d="M22.5 6.8h-3v8.8h3V6.8z" fill="#4285F4" />
            <path d="M14.5 6.8h3v8.8h-3V6.8z" fill="#FBBC05" />
            <path d="M29.5 6.8h-3v8.8h3V6.8z" fill="#34A853" />
          </svg>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 400, textAlign: 'center', margin: '0 0 8px', color: '#202124' }}>
          {customMode ? 'Create account' : 'Sign in'}
        </h1>
        <p style={{ fontSize: 16, textAlign: 'center', margin: '0 0 28px', color: '#202124' }}>
          to continue to <strong style={{color:'var(--primary)'}}>Manju</strong>
        </p>

        {error && (
          <div style={{ background: '#FCE8E6', color: '#C5221F', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {!customMode ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #DADCE0', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
              {accounts.map((acc, idx) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelect(acc.email, acc.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '16px 20px',
                    border: '0', borderBottom: idx < accounts.length - 1 ? '1px solid #DADCE0' : '0',
                    background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: acc.color, color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600
                  }}>
                    {acc.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#3C4043' }}>{acc.name}</div>
                    <div style={{ fontSize: 12, color: '#70757A', textOverflow: 'ellipsis', overflow: 'hidden' }}>{acc.email}</div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setCustomMode(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '16px 20px',
                  border: '0', borderTop: '1px solid #DADCE0', background: '#FFFFFF', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#F8F9FA'}
                onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#F1F3F4', color: '#5F6368',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  👤
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1A73E8' }}>Use another account</div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5F6368', display: 'block', marginBottom: 6 }}>Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nisha Patel"
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #DADCE0', borderRadius: 4,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5F6368', display: 'block', marginBottom: 6 }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nisha@iitd.ac.in"
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #DADCE0', borderRadius: 4,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button" onClick={() => setCustomMode(false)}
                style={{
                  background: 'none', border: '0', color: '#1A73E8', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500, padding: 0
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  background: '#1A73E8', color: '#FFF', border: '0', borderRadius: 4,
                  padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: '#757575' }}>
        <span>English (United States)</span>
        <div style={{ display: 'flex', gap: 14 }}>
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
}

function PLinkedInAuth() {
  const [customMode, setCustomMode] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const accounts = [
    { name: 'Arjun Sharma', email: 'arjun.sharma@linkedin-member.com', initial: 'A', color: '#0A66C2' },
    { name: 'Priya Iyer', email: 'priya.iyer@linkedin-member.com', initial: 'P', color: '#0A66C2' },
    { name: 'Rohan Mehta', email: 'rohan.mehta@linkedin-member.com', initial: 'R', color: '#0A66C2' },
  ];

  const handleSelect = (userEmail, userName) => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'LINKEDIN_AUTH_SUCCESS', token: `mock_linkedin_|${userEmail}|${userName}` },
        window.location.origin
      );
      window.close();
    } else {
      setError('Window opener not found. Run this inside the popup flow.');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email || !name) {
      setError('Please fill in both name and email.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    handleSelect(email, name);
  };

  return (
    <div style={{
      background: '#F3F2F0', color: '#1F1F1F', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: 24, boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%', maxWidth: 400, border: '1px solid #E0E0E0', borderRadius: 8,
        padding: '32px 28px', boxSizing: 'border-box', background: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        {/* LinkedIn Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, textAlign: 'center', margin: '0 0 6px', color: '#000000' }}>
          {customMode ? 'Sign up with LinkedIn' : 'Sign in with LinkedIn'}
        </h1>
        <p style={{ fontSize: 14, textAlign: 'center', margin: '0 0 24px', color: '#5E5E5E' }}>
          to continue to <strong style={{color:'var(--primary)'}}>Manju</strong>
        </p>

        {error && (
          <div style={{ background: '#FCE8E6', color: '#C5221F', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {!customMode ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E0E0E0', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              {accounts.map((acc, idx) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelect(acc.email, acc.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 18px',
                    border: '0', borderBottom: idx < accounts.length - 1 ? '1px solid #E0E0E0' : '0',
                    background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F3F2F0'}
                  onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: acc.color, color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600
                  }}>
                    {acc.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>{acc.name}</div>
                    <div style={{ fontSize: 12, color: '#5E5E5E', textOverflow: 'ellipsis', overflow: 'hidden' }}>{acc.email}</div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setCustomMode(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 18px',
                  border: '0', borderTop: '1px solid #E0E0E0', background: '#FFFFFF', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#F3F2F0'}
                onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#E0E0E0', color: '#5E5E5E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  👤
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0A66C2' }}>Use another account</div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5E5E5E', display: 'block', marginBottom: 6 }}>Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nisha Patel"
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #B2B2B2', borderRadius: 4,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5E5E5E', display: 'block', marginBottom: 6 }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nisha.patel@linkedin.com"
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid #B2B2B2', borderRadius: 4,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button" onClick={() => setCustomMode(false)}
                style={{
                  background: 'none', border: '0', color: '#0A66C2', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, padding: 0
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  background: '#0A66C2', color: '#FFF', border: '0', borderRadius: 24,
                  padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Join Now
              </button>
            </div>
          </form>
        )}
      </div>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: '#5E5E5E' }}>
        <span>LinkedIn Corporation © 2026</span>
        <div style={{ display: 'flex', gap: 14 }}>
          <span>User Agreement</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PLanding, PSignIn, PHome, PSearch, ProtoJobCard, ProtoPreviewPane, PGoogleAuth, PLinkedInAuth,
});
