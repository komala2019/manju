// src/proto-screens-2.jsx — Detail, Apply, Tracker, Profile

// =========================================================================
// JOB DETAIL
// =========================================================================
function PDetail() {
  const route = useRoute();
  const { state, dispatch } = useApp();
  const job = getJob(route.param) || window.MJ.MJ_JOBS[0];
  const isSaved = state.saved.includes(job.id);
  const isApplied = !!state.applications[job.id];

  return (
    <div className="proto-route">
      <div style={{padding:'14px 40px', borderBottom:'1px solid var(--rule)', display:'flex',alignItems:'center',gap:8, fontSize:12, color:'var(--muted)', background:'var(--surface)'}}>
        <a href="#/search" style={{textDecoration:'none', color:'inherit', display:'flex',alignItems:'center',gap:6}}><Icon name="chevronL" size={12}/> Back to results</a>
        <span>·</span><span>{job.tags && job.tags[0]}</span><span>·</span><span>{job.location}</span><span>·</span>
        <span style={{color:'var(--ink-soft)'}}>{job.company}</span>
      </div>

      <header style={{padding:'40px 40px 28px', background:'var(--surface)', maxWidth:1400, margin:'0 auto'}}>
        <div className="mj-detail-header" style={{display:'flex',gap:24,alignItems:'flex-start'}}>
          <CoLogo company={job.company} color={job.logoColor} size="lg"/>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,flexWrap:'wrap'}}>
              <span style={{fontSize:14, fontWeight:600, color:'var(--ink-soft)'}}>{job.company}</span>
              <span className="mj-verified mj-verified--solid">Hiring this week</span>
              <span className="mj-meta">Posted {job.posted}</span>
              {isApplied && <span className="mj-chip mj-chip--tint">Applied · {state.applications[job.id].stage}</span>}
            </div>
            <h1 className="mj-h1" style={{fontSize:44, marginBottom:14, maxWidth:760}}>{job.role}</h1>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <span className="mj-chip mj-chip--lg"><Icon name="location" size={11}/> {job.location} · {job.mode}</span>
              <span className="mj-chip mj-chip--lg"><Icon name="briefcase" size={11}/> {job.exp}</span>
              <span className="mj-chip mj-chip--lg" style={{background:'var(--success-bg)', color:'var(--success)', borderColor:'transparent'}}>{job.comp}</span>
              <MatchScore value={job.match}/>
            </div>
          </div>
          <div className="mj-detail-actions" style={{display:'flex',gap:8,flexShrink:0}}>
            <button className="mj-btn mj-btn--ghost" onClick={()=>dispatch({type:'SAVE_TOGGLE',jobId:job.id})}>
              <Icon name="bookmark" size={13}/> {isSaved ? 'Saved' : 'Save'}
            </button>
            {isApplied ? (
              <a href="#/tracker" className="mj-btn mj-btn--lg">See in tracker <Icon name="arrow" size={14}/></a>
            ) : (
              <button className="mj-btn mj-btn--lg" onClick={()=>{dispatch({type:'APPLY_BEGIN',jobId:job.id}); route.go('apply',job.id);}}>
                Apply with Manju <Icon name="arrow" size={14}/>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mj-main-side-lg" style={{padding:'40px 40px 60px', maxWidth:1400, margin:'0 auto'}}>
        <div>
          <h2 className="mj-h3" style={{marginBottom:14}}>About the role</h2>
          <p className="mj-body-lg" style={{marginBottom:24, color:'var(--ink-soft)'}}>{job.description}</p>

          {job.responsibilities && (
            <>
              <h3 style={{marginBottom:14, fontSize:13, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--muted)', fontFamily:'var(--font-mono)'}}>What you'll do</h3>
              <ul style={{padding:0, listStyle:'none', margin:'0 0 28px'}}>
                {job.responsibilities.map((r,i)=>(
                  <li key={i} style={{display:'flex',gap:14, padding:'12px 0', borderTop: i===0 ? '1px solid var(--rule-soft)' : 'none', borderBottom:'1px solid var(--rule-soft)'}}>
                    <span className="mj-num" style={{fontSize:14, color:'var(--muted)', minWidth:24}}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{color:'var(--ink)', fontSize:15, lineHeight:1.5}}>{r}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 style={{marginBottom:12, fontSize:13, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--muted)', fontFamily:'var(--font-mono)'}}>What you'll need</h3>
          <div style={{display:'flex',gap:6,flexWrap:'wrap', marginBottom:28}}>
            {job.skills && job.skills.map(s=>
              <span key={s} className="mj-chip mj-chip--lg" style={{background:'var(--surface)'}}>{s}</span>
            )}
          </div>

          {job.team && (
            <div className="mj-card mj-card--inset" style={{display:'flex',gap:14,alignItems:'flex-start', padding:'18px 20px'}}>
              <Icon name="user" size={20} style={{color:'var(--primary)', marginTop:2}}/>
              <div>
                <div className="mj-h4" style={{marginBottom:4}}>Team &amp; reporting</div>
                <div className="mj-body" style={{color:'var(--ink-soft)'}}>{job.team}</div>
              </div>
            </div>
          )}
        </div>

        <aside style={{display:'flex', flexDirection:'column', gap:20}}>
          <div className="mj-card mj-card--pop" style={{padding:0, overflow:'hidden'}}>
            <div style={{padding:'18px 22px 14px', borderBottom:'1px solid var(--rule-soft)'}}>
              <div className="mj-eyebrow" style={{marginBottom:6}}>Who could refer you</div>
              <div className="mj-h3" style={{fontSize:22}}>
                <span className="mj-num" style={{fontSize:32}}>{job.alumni}</span> alumni
                <span style={{fontSize:18, color:'var(--muted)'}}> at {job.company}</span>
              </div>
              <div className="mj-small" style={{marginTop:6, color:'var(--ink-soft)'}}>
                {job.alumniInRole} in {job.tags && job.tags[0]} · all reachable in one tap
              </div>
            </div>
            <div style={{padding:'8px 16px 16px'}}>
              {window.MJ.MJ_ALUMNI.map((a,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12, padding:'12px 6px', borderBottom: i<2 ? '1px solid var(--rule-soft)' : 'none'}}>
                  <Avatar name={a.name} initials={a.initials} color={a.color}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--ink)'}}>{a.name}</div>
                    <div className="mj-small" style={{marginTop:1}}>{a.institute} · {a.batch}</div>
                    <div className="mj-small" style={{color:'var(--ink-soft)', marginTop:2}}>{a.role} · {a.mutual} mutual</div>
                  </div>
                  <button className="mj-btn mj-btn--ghost mj-btn--sm"
                    onClick={()=>dispatch({type:'TOAST',toast:{msg:`Referral request sent to ${a.name}`, icon:'handshake'}})}>
                    Ask
                  </button>
                </div>
              ))}
            </div>
          </div>

          {!isApplied && (
            <div className="mj-card" style={{background:'var(--primary-tint)', borderColor:'transparent'}}>
              <div className="mj-eyebrow" style={{marginBottom:8, color:'var(--primary)'}}>Quick apply</div>
              <div className="mj-h4" style={{marginBottom:10, fontSize:15}}>Your Manju profile is {state.profile.completeness}% complete — enough to apply.</div>
              <button className="mj-btn" style={{width:'100%'}}
                onClick={()=>{dispatch({type:'APPLY_BEGIN',jobId:job.id}); route.go('apply',job.id);}}>
                Apply with Manju <Icon name="arrow" size={14}/>
              </button>
              <div className="mj-small" style={{marginTop:10, color:'var(--ink-soft)'}}>Most alumni hear back in 3 days · faster with a referral.</div>
            </div>
          )}

          <div>
            <div className="mj-eyebrow" style={{marginBottom:12}}>Similar at {job.company}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {window.MJ.MJ_JOBS.filter(j=>j.id!==job.id).slice(0,2).map(j=>(
                <a key={j.id} href={`#/job/${j.id}`} className="mj-card mj-card--btn" style={{padding:14, textDecoration:'none', display:'block'}}>
                  <div className="mj-h4" style={{fontSize:14, marginBottom:4}}>{j.role}</div>
                  <div className="mj-small">{j.location} · {j.comp}</div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// =========================================================================
// APPLY — 4-step wizard
// =========================================================================
function PApply() {
  const route = useRoute();
  const { state, dispatch } = useApp();
  const jobId = route.param || state.draft.jobId;
  const job = getJob(jobId);
  const draft = state.draft;
  const steps = ['Review profile','Cover note','Referral','Confirm'];

  React.useEffect(() => {
    if (!draft.jobId || draft.jobId !== jobId) {
      dispatch({type:'APPLY_BEGIN', jobId});
    }
  }, []);

  if (!job) return <div style={{padding:40}}>Job not found.</div>;

  const goTo = (n) => dispatch({type:'APPLY_STEP', step:n});
  const finalize = async () => {
    try {
      await window.MJ_api?.apply(draft.jobId, draft.coverNote, draft.referralPicks);
      dispatch({type:'APPLY_FINALIZE'});
      setTimeout(() => route.go('tracker'), 300);
    } catch (err) {
      dispatch({type:'TOAST', toast:{msg:'Submission failed — please try again', icon:'close'}});
    }
  };

  return (
    <div className="proto-route">
      <div style={{padding:'14px 40px', background:'var(--surface)', borderBottom:'1px solid var(--rule)', display:'flex',gap:14,alignItems:'center'}}>
        <CoLogo company={job.company} color={job.logoColor} size="sm"/>
        <div style={{flex:1}}>
          <div style={{fontSize:14, fontWeight:600}}>{job.role}</div>
          <div className="mj-small">{job.company} · {job.location} · {job.comp}</div>
        </div>
        <a href={`#/job/${job.id}`} className="mj-btn mj-btn--text mj-btn--sm"><Icon name="close" size={13}/> Save &amp; close</a>
      </div>

      <div className="mj-apply-layout">
        <aside className="mj-apply-aside-left" style={{padding:'40px 28px', borderRight:'1px solid var(--rule)', background:'var(--surface)'}}>
          <div className="mj-eyebrow" style={{marginBottom:22}}>Application</div>
          {steps.map((s,i)=>{
            const stepN = i+1;
            const done = stepN<draft.step, active = stepN===draft.step;
            return (
              <button key={s} disabled={!done && !active}
                onClick={()=>(done || active) && goTo(stepN)}
                style={{
                  display:'flex',gap:14, padding:'10px 0', alignItems:'flex-start',
                  width:'100%', textAlign:'left', background:'transparent', border:0,
                  cursor:(done||active)?'pointer':'default'
                }}>
                <div style={{
                  width:24,height:24,borderRadius:99,
                  background: done ? 'var(--primary)' : active ? 'var(--primary-tint)' : 'transparent',
                  border: active ? '1.5px solid var(--primary)' : done ? 'none' : '1.5px solid var(--rule)',
                  color: done ? 'var(--on-primary)' : active ? 'var(--primary)' : 'var(--muted)',
                  fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                  display:'flex',alignItems:'center',justifyContent:'center', flexShrink:0
                }}>{done ? <Icon name="check" size={12} stroke={3}/> : stepN}</div>
                <div>
                  <div style={{fontSize:13, color: active||done ? 'var(--ink)' : 'var(--muted)', fontWeight: active?600:500}}>{s}</div>
                  {active && <div className="mj-small" style={{marginTop:2}}>You are here</div>}
                </div>
              </button>
            );
          })}
          <div className="mj-card mj-card--inset" style={{marginTop:28, padding:'14px 16px'}}>
            <div className="mj-mini" style={{marginBottom:6}}>TIME ESTIMATE</div>
            <div className="mj-num" style={{fontSize:24}}>~3 min</div>
          </div>
        </aside>

        <main style={{padding:'40px 56px', minWidth:0}}>
          {draft.step === 1 && (
            <>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Step 1 of 4</div>
              <h1 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:8}}>Confirm your snapshot</h1>
              <p className="mj-body-lg" style={{marginBottom:30, maxWidth:560}}>This is what the {job.company} team sees first. Edit anything that's stale.</p>

              <div className="mj-card" style={{padding:24}}>
                <div style={{display:'flex',alignItems:'center',gap:14, marginBottom:18}}>
                  <Avatar name={state.profile.name} color={state.profile.avatarColor} size="lg"/>
                  <div style={{flex:1}}>
                    <div className="mj-h4" style={{fontSize:18}}>{state.profile.name}</div>
                    <div className="mj-small">{state.profile.title} · {state.profile.current}</div>
                  </div>
                  <VerifiedPill institute="IIT B" solid/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:14, padding:'14px 0', borderTop:'1px solid var(--rule-soft)', borderBottom:'1px solid var(--rule-soft)'}}>
                  <div><div className="mj-mini">INSTITUTE</div><div style={{fontSize:14,marginTop:3}}>IIT Bombay · '18</div></div>
                  <div><div className="mj-mini">EXPERIENCE</div><div style={{fontSize:14,marginTop:3}}>6 yrs</div></div>
                  <div><div className="mj-mini">CURRENT</div><div style={{fontSize:14,marginTop:3}}>SSE, Flipkart</div></div>
                  <div><div className="mj-mini">RÉSUMÉ</div><div style={{fontSize:14,marginTop:3}}>arjun-2026.pdf</div></div>
                </div>
                <a href="#/profile" className="mj-btn mj-btn--text mj-btn--sm" style={{padding:'8px 0', marginTop:8}}>Edit profile <Icon name="arrowSm" size={12}/></a>
              </div>

              <div style={{display:'flex',justifyContent:'space-between', marginTop:24, paddingTop:18, borderTop:'1px solid var(--rule)'}}>
                <a href={`#/job/${job.id}`} className="mj-btn mj-btn--ghost"><Icon name="chevronL" size={13}/> Back to role</a>
                <button className="mj-btn" onClick={()=>goTo(2)}>Continue <Icon name="arrow" size={14}/></button>
              </div>
            </>
          )}

          {draft.step === 2 && (
            <>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Step 2 of 4</div>
              <h1 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:8}}>Note to the hiring manager</h1>
              <p className="mj-body-lg" style={{marginBottom:30, maxWidth:560}}>Two paragraphs is plenty. What you want to be doing, why this team in particular.</p>

              <div style={{marginBottom:20}}>
                <label className="mj-label">Cover note · 280 words max</label>
                <div style={{position:'relative'}}>
                  <textarea className="mj-input" rows={9}
                    value={draft.coverNote}
                    onChange={e=>dispatch({type:'APPLY_FIELD',key:'coverNote',value:e.target.value})}
                    placeholder={`Hi ${job.company} team,\n\nI've been following…`}
                    style={{resize:'vertical', fontFamily:'var(--font-body)', lineHeight:1.55}}/>
                  <div className="mj-mini" style={{position:'absolute',bottom:10,right:14, color:'var(--muted)'}}>{draft.coverNote.length} / 1800</div>
                </div>
              </div>

              <div className="mj-card mj-card--inset" style={{display:'flex',alignItems:'center',gap:14, padding:'14px 18px', marginBottom:30}}>
                <div style={{width:30,height:30,borderRadius:'var(--radius)', background:'var(--primary)', color:'var(--on-primary)', display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name="sparkle" size={14}/>
                </div>
                <div style={{flex:1}}>
                  <div className="mj-h4" style={{fontSize:13.5}}>Manju · draft a starter for me</div>
                  <div className="mj-small" style={{marginTop:2}}>Built from your profile + this JD. You approve before sending.</div>
                </div>
                <button className="mj-btn mj-btn--ghost mj-btn--sm"
                  onClick={()=>{
                    dispatch({type:'TOAST',toast:{msg:'Drafting…', icon:'sparkle'}});
                    setTimeout(()=>dispatch({type:'APPLY_FIELD',key:'coverNote',
                      value:`Hi ${job.company} team,\n\nI've been following the merchant-side push and would love to own the small-business merchant adoption work. My current scope at Flipkart is closest to this — ranking and personalization across SMBs and brands — and I think the pricing & packaging review you mentioned in the JD is where I'd add real value early.\n\nExcited to chat if it's a fit.\n\nArjun`
                    }), 600);
                  }}>Draft for me</button>
              </div>

              <div style={{display:'flex',justifyContent:'space-between', paddingTop:18, borderTop:'1px solid var(--rule)'}}>
                <button className="mj-btn mj-btn--ghost" onClick={()=>goTo(1)}><Icon name="chevronL" size={13}/> Back</button>
                <button className="mj-btn" onClick={()=>goTo(3)} disabled={draft.coverNote.length<40}>Continue to referrals <Icon name="arrow" size={14}/></button>
              </div>
            </>
          )}

          {draft.step === 3 && (
            <>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Step 3 of 4 · optional</div>
              <h1 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:8}}>Request a referral</h1>
              <p className="mj-body-lg" style={{marginBottom:30, maxWidth:560}}>Picked alumni get a one-tap "Refer" they can do from email. Most respond within a day.</p>

              <div style={{display:'flex',flexDirection:'column',gap:10, marginBottom:24}}>
                {window.MJ.MJ_ALUMNI.map((a,i)=>{
                  const picked = draft.referralPicks.includes(a.name);
                  return (
                    <button key={i} onClick={()=>dispatch({type:'APPLY_PICK_REFERRAL', name:a.name})}
                      className="mj-card mj-card--btn"
                      style={{display:'flex',alignItems:'center',gap:14, padding:'14px 18px', cursor:'pointer', textAlign:'left',
                        background: picked ? 'var(--primary-tint)' : 'var(--surface)',
                        border:'1px solid', borderColor: picked ? 'var(--primary)' : 'var(--rule)'}}>
                      <span className={`mj-dot ${picked?'on':''}`}/>
                      <Avatar name={a.name} initials={a.initials} color={a.color}/>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:14, fontWeight:600, color:'var(--ink)'}}>{a.name}</div>
                        <div className="mj-small" style={{marginTop:2}}>{a.institute} · {a.batch} · {a.role}</div>
                      </div>
                      <span className="mj-mini">{a.mutual} mutual</span>
                    </button>
                  );
                })}
              </div>

              <div style={{display:'flex',justifyContent:'space-between', paddingTop:18, borderTop:'1px solid var(--rule)'}}>
                <button className="mj-btn mj-btn--ghost" onClick={()=>goTo(2)}><Icon name="chevronL" size={13}/> Back</button>
                <div style={{display:'flex',gap:10}}>
                  <button className="mj-btn mj-btn--text" onClick={()=>goTo(4)}>Skip — apply without referral</button>
                  <button className="mj-btn" onClick={()=>goTo(4)}>
                    Continue {draft.referralPicks.length>0 && `· ${draft.referralPicks.length} picked`} <Icon name="arrow" size={14}/>
                  </button>
                </div>
              </div>
            </>
          )}

          {draft.step === 4 && (
            <>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Step 4 of 4</div>
              <h1 style={{fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:8}}>Send application</h1>
              <p className="mj-body-lg" style={{marginBottom:30, maxWidth:560}}>One last look.</p>

              <div className="mj-card" style={{padding:24, marginBottom:18}}>
                <div className="mj-eyebrow" style={{marginBottom:14}}>Going to {job.company}</div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <SummaryRow label="Role" value={`${job.role} · ${job.location}`}/>
                  <SummaryRow label="Profile" value={`${state.profile.name} · ${state.profile.title}`}/>
                  <SummaryRow label="Cover note" value={`${draft.coverNote.length} characters`}/>
                  <SummaryRow label="Referrals" value={
                    draft.referralPicks.length === 0
                      ? 'None requested'
                      : draft.referralPicks.join(', ') + ` · request${draft.referralPicks.length===1?'':'s'} go out on send`
                  } highlight={draft.referralPicks.length>0}/>
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'space-between', paddingTop:18, borderTop:'1px solid var(--rule)'}}>
                <button className="mj-btn mj-btn--ghost" onClick={()=>goTo(3)}><Icon name="chevronL" size={13}/> Back</button>
                <button className="mj-btn mj-btn--lg" onClick={finalize}>
                  Send application <Icon name="arrow" size={14}/>
                </button>
              </div>
            </>
          )}
        </main>

        <aside className="mj-apply-aside-right" style={{padding:'40px 28px', borderLeft:'1px solid var(--rule)', background:'var(--surface)'}}>
          <div className="mj-eyebrow" style={{marginBottom:14}}>Readiness</div>
          {[
            ['Profile complete','100%','success'],
            ['Résumé attached','Yes','success'],
            ['Cover note', draft.coverNote.length>=40 ? 'Ready' : 'In progress', draft.coverNote.length>=40 ? 'success' : 'warning'],
            ['Referral attached', draft.referralPicks.length>0 ? `${draft.referralPicks.length} picked` : 'Optional', draft.referralPicks.length>0 ? 'success' : 'muted'],
          ].map(([k,v,c],i,arr)=>(
            <div key={k} className="mj-small" style={{display:'flex',justifyContent:'space-between', padding:'10px 0', borderBottom: i<arr.length-1 ? '1px solid var(--rule-soft)' : 'none'}}>
              <span style={{color:'var(--ink-soft)'}}>{k}</span>
              <span style={{color: c==='success' ? 'var(--success)' : c==='warning' ? 'var(--warning)' : 'var(--muted)', fontWeight:500}}>{v}</span>
            </div>
          ))}

          <div className="mj-card mj-card--inset" style={{marginTop:24, padding:'14px 16px'}}>
            <div className="mj-mini" style={{marginBottom:6}}>WHAT HAPPENS NEXT</div>
            <div className="mj-small" style={{color:'var(--ink-soft)'}}>
              Your application + cover note land in {job.company}'s Manju inbox.
              {draft.referralPicks.length>0 && ` Referral requests fan out to ${draft.referralPicks.length} alumni — they're nudged once, no spam.`}
              {' '}You'll see status updates in your tracker.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',gap:18, alignItems:'flex-start'}}>
      <div className="mj-mini" style={{flex:'0 0 110px'}}>{label}</div>
      <div style={{flex:1, fontSize:14, color:highlight?'var(--primary)':'var(--ink)', fontWeight: highlight ? 500 : 400}}>{value}</div>
    </div>
  );
}

// =========================================================================
// TRACKER — pipeline kanban
// =========================================================================
function PTracker() {
  const { state, dispatch } = useApp();
  const route = useRoute();

  const STAGES = ['Saved','Applied','In review','Interviewing','Offer'];
  const byStage = STAGES.reduce((acc,s)=>({...acc,[s]:[]}), {});

  state.saved.filter(id => !state.applications[id]).forEach(id => {
    const j = getJob(id); if (j) byStage['Saved'].push(j);
  });
  Object.entries(state.applications).forEach(([id, app]) => {
    const j = getJob(id); if (j) (byStage[app.stage] || byStage['Applied']).push({...j, _app:app});
  });

  const total = Object.values(byStage).reduce((a,b)=>a+b.length, 0);

  return (
    <div className="proto-route" style={{maxWidth:1400, margin:'0 auto'}}>
      <section style={{padding:'40px 40px 28px'}}>
        <SectionHead
          eyebrow="Your tracker"
          title={`${total} conversations in progress`}
          subtitle="From saved to offer. Move cards across stages — recruiters see status only at 'Interviewing' and beyond."
          action={
            <div style={{display:'flex',gap:8}}>
              <button className="mj-btn mj-btn--ghost mj-btn--sm"><Icon name="grid" size={13}/> Kanban</button>
              <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={()=>{
                const csv = ['role,company,stage,appliedAt'].concat(
                  Object.entries(state.applications).map(([id,app])=>{
                    const j = getJob(id);
                    return `"${j.role}","${j.company}","${app.stage}","${app.appliedAt}"`;
                  })
                ).join('\n');
                const blob = new Blob([csv], {type:'text/csv'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `manju-tracker-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                dispatch({type:'TOAST',toast:{msg:'Tracker exported', icon:'download'}});
              }}><Icon name="download" size={13}/> Export</button>
            </div>
          }
        />
      </section>

      <section style={{padding:'0 40px 60px'}}>
        <div className="mj-tracker-board">
          {STAGES.map(stage => {
            const items = byStage[stage];
            return (
              <div key={stage} style={{background:'var(--surface-2)', borderRadius:'var(--radius-lg)', padding:14, minHeight:560}}>
                <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between', marginBottom:12, padding:'4px 4px 12px', borderBottom:'1px solid var(--rule)'}}>
                  <div>
                    <div className="mj-eyebrow" style={{fontSize:10}}>{stage}</div>
                    <div className="mj-num" style={{fontSize:24, lineHeight:1, marginTop:4}}>{items.length}</div>
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {items.length === 0 ? (
                    <div style={{padding:'40px 12px', textAlign:'center'}}>
                      <div className="mj-mini" style={{marginBottom:8}}>{stage==='Offer'?'EMPTY · YET':'NO ITEMS'}</div>
                      <div className="mj-small">{stage==='Offer' ? 'Move a card here when you have an offer in hand.' : `Nothing in ${stage.toLowerCase()}.`}</div>
                    </div>
                  ) : items.map(j => (
                    <TrackerCard key={j.id} job={j} stage={stage} stages={STAGES}
                      onMove={(s)=>dispatch({type:'PIPE_MOVE',jobId:j.id,stage:s})}
                      onOpen={()=>route.go('job',j.id)}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TrackerCard({ job, stage, stages, onMove, onOpen }) {
  const idx = stages.indexOf(stage);
  return (
    <div className="mj-card" style={{padding:'14px 14px', position:'relative'}}>
      <div style={{display:'flex',gap:10, alignItems:'center', marginBottom:10}}>
        <CoLogo company={job.company} color={job.logoColor} size="sm"/>
        <div style={{flex:1, minWidth:0}}>
          <div className="mj-h4" style={{fontSize:12.5, lineHeight:1.25, cursor:'pointer'}} onClick={onOpen}>{job.role}</div>
          <div className="mj-mini" style={{marginTop:2, fontSize:9}}>{job.company} · {job.location}</div>
        </div>
      </div>
      <div className="mj-small" style={{fontVariantNumeric:'tabular-nums', marginBottom:10}}>{job.comp}</div>

      {stage === 'Interviewing' && (
        <div style={{padding:'8px 10px',background:'var(--primary-tint)', borderRadius:'var(--radius)', display:'flex',alignItems:'center',gap:8, marginBottom:8}}>
          <Icon name="cal" size={12} style={{color:'var(--primary)'}}/>
          <div className="mj-small" style={{color:'var(--primary)', fontWeight:500, fontSize:11}}>Round 3 · Thu 26 May</div>
        </div>
      )}
      {stage === 'In review' && (
        <div className="mj-small" style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:6,height:6,borderRadius:99,background:'var(--warning)'}}/>
          Recruiter viewed 2d ago
        </div>
      )}
      {stage === 'Applied' && (
        <div className="mj-small">Applied {job._app?.appliedAt || 'recently'}</div>
      )}
      {stage === 'Saved' && (
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <MatchScore value={job.match}/>
        </div>
      )}

      <div style={{display:'flex',gap:5, marginTop:10, paddingTop:10, borderTop:'1px solid var(--rule-soft)'}}>
        {idx > 0 && (
          <button className="mj-btn mj-btn--ghost mj-btn--sm" style={{padding:'5px 8px', fontSize:10}}
            onClick={()=>onMove(stages[idx-1])}><Icon name="chevronL" size={10}/></button>
        )}
        {idx < stages.length-1 && (
          <button className="mj-btn mj-btn--ghost mj-btn--sm" style={{padding:'5px 8px', fontSize:10, marginLeft:'auto'}}
            onClick={()=>onMove(stages[idx+1])}>
            Move <Icon name="chevronR" size={10}/>
          </button>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// PROFILE — editable
// =========================================================================
function PProfile() {
  const { state, dispatch } = useApp();
  const P = state.profile;
  const editing = state.profileEditing;
  const fileInputRef = React.useRef(null);
  const [renderResumeOpen, setRenderResumeOpen] = React.useState(false);

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${window.MJ_API_BASE || 'http://localhost:5200'}/api/users/${P.id}/resume`, {
        method: 'POST',
        headers: window.MJ_api?.getAuthHeader ? window.MJ_api.getAuthHeader() : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        dispatch({ type: 'PROFILE_FIELD', key: 'completeness', value: data.completeness });
        dispatch({ type: 'PROFILE_FIELD', key: 'resumeFileName', value: data.fileName });
        dispatch({
          type: 'TOAST',
          toast: { msg: 'Résumé uploaded successfully!', icon: 'check' }
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      dispatch({
        type: 'TOAST',
        toast: { msg: err.message || 'Upload failed', icon: 'x' }
      });
    }
  };

  return (
    <div className="proto-route">
      <header style={{padding:'40px 40px 28px', background:'var(--surface)', borderBottom:'1px solid var(--rule)', maxWidth:1400, margin:'0 auto'}}>
        <div className="mj-profile-hdr" style={{display:'flex',gap:24,alignItems:'flex-start'}}>
          <Avatar name={P.name} color={P.avatarColor} size="xl"/>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
              <VerifiedPill institute={P.instituteShort} solid/>
              <span className="mj-meta">Last edited · just now</span>
            </div>
            {editing ? (
              <input className="mj-input mj-input--lg" value={P.name}
                onChange={e=>dispatch({type:'PROFILE_FIELD',key:'name',value:e.target.value})}
                style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:36, padding:'4px 10px', maxWidth:500}}/>
            ) : (
              <h1 className="mj-h1" style={{marginBottom:8, fontSize:44}}>{P.name}</h1>
            )}
            <div className="mj-body-lg" style={{color:'var(--ink-soft)', fontSize:17, marginTop:editing?12:0}}>
              {editing ? (
                <>
                  <input className="mj-input" value={P.title}
                    onChange={e=>dispatch({type:'PROFILE_FIELD',key:'title',value:e.target.value})}
                    style={{display:'inline', width:280, padding:'5px 10px', marginRight:8}}/>
                  at
                  <input className="mj-input" value={P.current}
                    onChange={e=>dispatch({type:'PROFILE_FIELD',key:'current',value:e.target.value})}
                    style={{display:'inline', width:160, padding:'5px 10px', marginLeft:8}}/>
                </>
              ) : (
                <>{P.title} at <b style={{color:'var(--ink)', fontWeight:600}}>{P.current}</b></>
              )}
            </div>
            <div style={{display:'flex',gap:14,marginTop:14,flexWrap:'wrap'}}>
              <span className="mj-chip mj-chip--lg"><Icon name="edu" size={12}/> {P.institute} · {P.batch}</span>
              <span className="mj-chip mj-chip--lg"><Icon name="briefcase" size={12}/> 6 yrs experience</span>
              <span className="mj-chip mj-chip--lg"><Icon name="location" size={12}/> {P.location}</span>
            </div>
          </div>
          <div className="mj-profile-hdr-actions" style={{display:'flex',flexDirection:'column',gap:8}}>
            {editing ? (
              <>
                <button className="mj-btn"
                  onClick={()=>{dispatch({type:'PROFILE_EDIT',value:false}); dispatch({type:'TOAST',toast:{msg:'Profile saved', icon:'check'}});}}>
                  <Icon name="check" size={13}/> Save changes
                </button>
                <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={()=>dispatch({type:'PROFILE_EDIT',value:false})}>Cancel</button>
              </>
            ) : (
              <>
                <button className="mj-btn" onClick={()=>dispatch({type:'PROFILE_EDIT',value:true})}>Edit profile</button>
                <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={() => window.open(`${window.MJ_API_BASE || 'http://localhost:5200'}/api/users/${P.id}/resume`)}><Icon name="download" size={12}/> Download résumé</button>
                <button className="mj-btn mj-btn--text mj-btn--sm" style={{color: 'var(--danger)', marginTop: 4}} onClick={() => { dispatch({type: 'SIGN_OUT'}); window.location.hash = '#/signin'; }}>Sign out</button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mj-main-side" style={{padding:'40px 40px 60px', maxWidth:1400, margin:'0 auto'}}>
        <div style={{display:'flex',flexDirection:'column',gap:36}}>
          <section>
            <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:18}}>
              <div>
                <div className="mj-eyebrow" style={{marginBottom:6}}>Experience</div>
                <h2 style={{fontSize:18, fontWeight:600, color:'var(--ink)'}}>Work history</h2>
              </div>
              {editing && <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={()=>dispatch({type:'ADD_ROLE_OPEN'})}><Icon name="plus" size={12}/> Add role</button>}
            </div>
            <div className="mj-card" style={{padding:0}}>
              {P.experience.map((e,i,arr)=>(
                <div key={i} style={{display:'flex',gap:18,padding:'20px 22px', borderBottom: i<arr.length-1 ? '1px solid var(--rule-soft)' : 'none'}}>
                  <div style={{width:40,height:40,borderRadius:'var(--radius)', background:'var(--surface-2)', display:'flex',alignItems:'center',justifyContent:'center', flexShrink:0, fontFamily:'var(--font-display)', fontSize:18, color:'var(--ink-soft)'}}>{e.company[0]}</div>
                  <div style={{flex:1}}>
                    <div className="mj-h4" style={{fontSize:16, fontFamily:'var(--font-display)', fontWeight:500, letterSpacing:'-.01em', lineHeight:1.2}}>{e.role}</div>
                    <div style={{display:'flex',gap:8,alignItems:'center', fontSize:13, color:'var(--ink-soft)', marginTop:4,flexWrap:'wrap'}}>
                      <b style={{fontWeight:600, color:'var(--ink)'}}>{e.company}</b>
                      {e.loc && <><span style={{color:'var(--rule)'}}>·</span><span>{e.loc}</span></>}
                      <span style={{color:'var(--rule)'}}>·</span>
                      <span className="mj-mini">{e.dates}</span>
                    </div>
                    {e.desc && <p className="mj-body" style={{marginTop:8, fontSize:13.5}}>{e.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mj-eyebrow" style={{marginBottom:18}}>Education · institute-verified</div>
            <div className="mj-card" style={{padding:0}}>
              {P.education.map((e,i,arr)=>(
                <div key={i} style={{display:'flex',gap:18,padding:'18px 22px', borderBottom: i<arr.length-1 ? '1px solid var(--rule-soft)' : 'none'}}>
                  <Icon name="edu" size={20} style={{color:'var(--accent)', marginTop:3, flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div className="mj-h4" style={{fontSize:15, fontFamily:'var(--font-display)', fontWeight:500, letterSpacing:'-.01em'}}>{e.school}</div>
                    <div style={{fontSize:13, color:'var(--ink-soft)', marginTop:3}}>{e.degree}</div>
                    {e.detail && <div className="mj-small" style={{marginTop:4}}>{e.detail}</div>}
                  </div>
                  <div className="mj-mini" style={{flexShrink:0}}>{e.dates}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mj-eyebrow" style={{marginBottom:14}}>Skills</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {P.skills.map(s=>
                <span key={s} className="mj-chip mj-chip--lg">{s}</span>
              )}
              {editing && <button className="mj-btn mj-btn--ghost mj-btn--sm" style={{padding:'5px 10px'}} onClick={()=>dispatch({type:'ADD_SKILL_OPEN'})}><Icon name="plus" size={11}/> Add</button>}
            </div>
          </section>
        </div>

        <aside style={{display:'flex',flexDirection:'column', gap:18}}>
          <div className="mj-card">
            <div className="mj-eyebrow" style={{marginBottom:10}}>Profile completeness</div>
            <div className="mj-num" style={{fontSize:42,lineHeight:1, marginBottom:10}}>{P.completeness}<span style={{fontSize:20,color:'var(--muted)'}}>%</span></div>
            <div style={{height:6, background:'var(--surface-2)', borderRadius:99, marginBottom:18}}>
              <div style={{width:`${P.completeness}%`, height:'100%', background:'var(--primary)', borderRadius:99, transition:'.6s'}}/>
            </div>
            <div className="mj-small" style={{marginBottom:8, color:'var(--ink-soft)'}}>Quick wins</div>
            {[['Add 2 batchmate references','+8%'],['Latest résumé PDF','+5%'],['Salary expectations','+3%']].map(([k,v])=>{
              if (k === 'Latest résumé PDF') {
                return (
                  <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--rule-soft)'}}>
                    <span style={{fontSize:13, color:'var(--ink-soft)', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden', maxWidth:180}} title={P.resumeFileName || ''}>
                      {P.resumeFileName ? `📄 ${P.resumeFileName}` : k}
                    </span>
                    <button onClick={() => fileInputRef.current?.click()} className="mj-btn mj-btn--text mj-btn--sm" style={{color:'var(--primary)', padding:0, fontSize:12, minHeight:0, height:'auto'}}>
                      {P.resumeFileName ? 'Change' : 'Upload'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleUploadResume} accept=".pdf" style={{display:'none'}}/>
                  </div>
                );
              }
              return (
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--rule-soft)'}}>
                  <span style={{fontSize:13, color:'var(--ink-soft)'}}>{k}</span>
                  <span style={{fontSize:12, color:'var(--primary)', fontWeight:600}}>{v}</span>
                </div>
              );
            })}
          </div>

          <div className="mj-card">
            <div className="mj-eyebrow" style={{marginBottom:14}}>Job preferences</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div>
                <div className="mj-mini" style={{marginBottom:4}}>ROLES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {(P.preferences?.roles || []).map(r=><span key={r} className="mj-chip">{r}</span>)}
                  {(!P.preferences?.roles || P.preferences.roles.length === 0) && <span style={{fontSize:12.5, color:'var(--muted)', fontStyle:'italic'}}>No roles preferred</span>}
                </div>
              </div>
              <div>
                <div className="mj-mini" style={{marginBottom:4}}>LOCATIONS</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {(P.preferences?.locations || []).map(r=><span key={r} className="mj-chip">{r}</span>)}
                  {(!P.preferences?.locations || P.preferences.locations.length === 0) && <span style={{fontSize:12.5, color:'var(--muted)', fontStyle:'italic'}}>No locations preferred</span>}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:8,borderTop:'1px solid var(--rule-soft)'}}>
                <span className="mj-small" style={{color:'var(--muted)'}}>Comp</span>
                <span className="mj-num" style={{fontSize:14}}>{P.preferences?.comp || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="mj-card" style={{background:'var(--primary)', color:'var(--on-primary)', borderColor:'transparent'}}>
            <div className="mj-eyebrow" style={{color:'color-mix(in srgb, var(--on-primary) 65%, transparent)', marginBottom:8}}>Manju · résumé render</div>
            <div className="mj-h4" style={{color:'var(--on-primary)', fontSize:15, marginBottom:10}}>Generate a clean PDF in your house style — picked up by every Indian ATS.</div>
            <button className="mj-btn" onClick={() => setRenderResumeOpen(true)} style={{width:'100%', background:'var(--on-primary)', color:'var(--primary)', borderColor:'var(--on-primary)'}}>Render résumé <Icon name="arrow" size={13}/></button>
          </div>
          <button
            onClick={() => {
              dispatch({type: 'SIGN_OUT'});
              window.location.hash = '#/signin';
            }}
            className="mj-btn mj-btn--ghost mj-btn--sm"
            style={{color: 'var(--danger)', borderColor: 'var(--rule)', marginTop: 8, width: '100%', justifyContent: 'center'}}
          >
            Sign out
          </button>
        </aside>
      </div>

      {/* LaTeX Résumé Preview Modal */}
      {renderResumeOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: 20
        }}>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--rule)',
            borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px', borderBottom: '1px solid var(--rule)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--surface)'
            }}>
              <div>
                <div className="mj-h3" style={{fontSize:18}}>LaTeX Résumé Preview</div>
                <div className="mj-small" style={{color:'var(--ink-soft)'}}>ATS-optimized house layout</div>
              </div>
              <div style={{display:'flex', gap:10}}>
                <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={() => window.open(`${window.MJ_API_BASE || 'http://localhost:5200'}/api/users/${P.id}/resume`)}>
                  <Icon name="download" size={12}/> Download PDF
                </button>
                <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={() => setRenderResumeOpen(false)}>
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body - The Resume Document */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '40px', background: '#eef1f5',
              display: 'flex', justifyContent: 'center'
            }}>
              <div style={{
                background: '#ffffff', color: '#111111', width: '100%', maxWidth: '720px',
                minHeight: '840px', padding: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                fontFamily: 'Georgia, serif', fontSize: '13px', lineHeight: '1.45', boxSizing: 'border-box'
              }}>
                {/* Header Section */}
                <div style={{textAlign: 'center', borderBottom: '1.5px solid #111', paddingBottom: '12px', marginBottom: '16px'}}>
                  <h1 style={{fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '28px', margin: '0 0 6px', letterSpacing: '0.05em', textTransform: 'uppercase'}}>{P.name}</h1>
                  <div style={{fontSize: '12px', color: '#444'}}>
                    {P.email} &nbsp;|&nbsp; {P.location} &nbsp;|&nbsp; Verified Alumni ({P.instituteShort})
                  </div>
                </div>

                {/* Education Section */}
                <div style={{marginBottom: '20px'}}>
                  <h2 style={{fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', borderBottom: '1px solid #ddd', paddingBottom: '3px'}}>Education</h2>
                  {P.education && P.education.map((edu, idx) => (
                    <div key={idx} style={{marginBottom: '8px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <span>{edu.school}</span>
                        <span>{edu.dates}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '12px'}}>
                        <span>{edu.degree}</span>
                        <span>{edu.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience Section */}
                <div style={{marginBottom: '20px'}}>
                  <h2 style={{fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', borderBottom: '1px solid #ddd', paddingBottom: '3px'}}>Experience</h2>
                  {P.experience && P.experience.map((exp, idx) => (
                    <div key={idx} style={{marginBottom: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <span>{exp.role} — {exp.company}</span>
                        <span>{exp.dates}</span>
                      </div>
                      {exp.loc && <div style={{fontStyle: 'italic', fontSize: '11px', color: '#555', marginBottom: '4px'}}>{exp.loc}</div>}
                      <div style={{fontSize: '12px', color: '#222', paddingLeft: '10px'}}>{exp.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Skills Section */}
                <div style={{marginBottom: '20px'}}>
                  <h2 style={{fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', borderBottom: '1px solid #ddd', paddingBottom: '3px'}}>Skills &amp; Interests</h2>
                  <div style={{fontSize: '12px', lineHeight: '1.6'}}>
                    <strong>Technical Skills:</strong> {P.skills && P.skills.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ADMIN PORTAL — /#/admin
// =========================================================================
function PAdminPortal() {
  const [stats, setStats] = React.useState({ users: 0, applications: 0, savedJobs: 0, referrals: 0, jobs: 0 });
  const [users, setUsers] = React.useState([]);
  const [applications, setApplications] = React.useState([]);
  const [referrals, setReferrals] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('users'); // 'users' | 'applications' | 'referrals'
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const token = localStorage.getItem('manju-access-token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiBase = window.MJ_API_BASE || 'http://localhost:5200';
      const [sRes, uRes, aRes, rRes] = await Promise.all([
        fetch(`${apiBase}/api/admin/stats`, { headers }).then(r => r.json()),
        fetch(`${apiBase}/api/admin/users`, { headers }).then(r => r.json()),
        fetch(`${apiBase}/api/admin/applications`, { headers }).then(r => r.json()),
        fetch(`${apiBase}/api/admin/referrals`, { headers }).then(r => r.json())
      ]);
      setStats(sRes);
      setUsers(uRes);
      setApplications(aRes);
      setReferrals(rRes);
    } catch (e) {
      console.error('Failed to fetch admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.institute?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApps = applications.filter(a => 
    a.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.jobRole?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.jobCompany?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRefs = referrals.filter(r => 
    r.alumniName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="proto-route" style={{maxWidth:1400, margin:'0 auto', padding:'40px'}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:22, fontWeight:600, color:'var(--ink)', marginBottom:4, letterSpacing:'-.01em'}}>Admin Dashboard</h1>
        <p className="mj-body" style={{color:'var(--muted)'}}>Platform metrics and member management.</p>
      </div>

      {/* Metrics Row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:36}}>
        {[
          { label: 'Candidates', val: stats.users, icon: 'user' },
          { label: 'Applications', val: stats.applications, icon: 'briefcase' },
          { label: 'Referrals', val: stats.referrals, icon: 'handshake' },
          { label: 'Active Jobs', val: stats.jobs, icon: 'grid' },
        ].map(card => (
          <div key={card.label} className="mj-card" style={{padding:'16px 20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
              <span style={{fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.05em'}}>{card.label}</span>
              <Icon name={card.icon} size={14} style={{color:'var(--muted)'}}/>
            </div>
            <div style={{fontSize:28, fontWeight:600, color:'var(--ink)', lineHeight:1}}>{card.val ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* Tabs & Search Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--rule)', marginBottom:20, paddingBottom:10}}>
        <div style={{display:'flex', gap:10}}>
          {[
            { id: 'users', label: 'Candidates List' },
            { id: 'applications', label: 'Applications' },
            { id: 'referrals', label: 'Alumni Referrals' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className="mj-btn"
              style={{
                background: activeTab === tab.id ? 'var(--primary-tint)' : 'transparent',
                borderColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--ink-soft)',
                padding: '8px 16px', fontSize: 13, minHeight: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <input
            className="mj-input"
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{width:260, height:34, padding:'4px 10px', fontSize:13}}
          />
          <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={fetchData}>Reload</button>
        </div>
      </div>

      {/* Data Section */}
      {loading ? (
        <div style={{padding:'60px 0', textAlign:'center', color:'var(--muted)'}}>Loading data...</div>
      ) : (
        <div className="mj-card" style={{padding:0, overflow:'hidden'}}>
          {activeTab === 'users' && (
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13.5, textAlign:'left'}}>
              <thead>
                <tr style={{background:'var(--surface-2)', borderBottom:'1px solid var(--rule)'}}>
                  <th style={{padding:'12px 18px'}}>Name</th>
                  <th style={{padding:'12px 18px'}}>Email</th>
                  <th style={{padding:'12px 18px'}}>Institute</th>
                  <th style={{padding:'12px 18px'}}>Batch</th>
                  <th style={{padding:'12px 18px'}}>Location</th>
                  <th style={{padding:'12px 18px'}}>Profile Completeness</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{borderBottom:'1px solid var(--rule-soft)'}}>
                    <td style={{padding:'14px 18px', fontWeight:600}}>{u.name}</td>
                    <td style={{padding:'14px 18px'}}>{u.email}</td>
                    <td style={{padding:'14px 18px'}}>{u.institute}</td>
                    <td style={{padding:'14px 18px'}}>{u.batch}</td>
                    <td style={{padding:'14px 18px'}}>{u.location}</td>
                    <td style={{padding:'14px 18px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div style={{width:100, height:6, background:'var(--surface-2)', borderRadius:99}}>
                          <div style={{width:`${u.completeness}%`, height:'100%', background:'var(--primary)', borderRadius:99}}/>
                        </div>
                        <span>{u.completeness}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} style={{padding:'40px 18px', textAlign:'center', color:'var(--muted)'}}>No candidates found.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'applications' && (
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13.5, textAlign:'left'}}>
              <thead>
                <tr style={{background:'var(--surface-2)', borderBottom:'1px solid var(--rule)'}}>
                  <th style={{padding:'12px 18px'}}>Candidate</th>
                  <th style={{padding:'12px 18px'}}>Role</th>
                  <th style={{padding:'12px 18px'}}>Company</th>
                  <th style={{padding:'12px 18px'}}>Applied Date</th>
                  <th style={{padding:'12px 18px'}}>Stage</th>
                  <th style={{padding:'12px 18px'}}>Referral Nudges</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(a => (
                  <tr key={a.id} style={{borderBottom:'1px solid var(--rule-soft)'}}>
                    <td style={{padding:'14px 18px', fontWeight:600}}>{a.userName}<br/><span style={{fontSize:11, fontWeight:400, color:'var(--muted)'}}>{a.userEmail}</span></td>
                    <td style={{padding:'14px 18px'}}>{a.jobRole}</td>
                    <td style={{padding:'14px 18px'}}>{a.jobCompany}</td>
                    <td style={{padding:'14px 18px'}}>{a.appliedAt}</td>
                    <td style={{padding:'14px 18px'}}>
                      <span className="mj-chip mj-chip--tint" style={{
                        background: a.stage === 'Offer' ? 'var(--success-bg)' : a.stage === 'Interviewing' ? 'var(--primary-tint)' : 'var(--surface-2)',
                        color: a.stage === 'Offer' ? 'var(--success)' : a.stage === 'Interviewing' ? 'var(--primary)' : 'var(--ink)'
                      }}>
                        {a.stage}
                      </span>
                    </td>
                    <td style={{padding:'14px 18px'}}>
                      {a.referrals && a.referrals.length > 0 ? (
                        <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                          {a.referrals.map(ref => (
                            <span key={ref} className="mj-chip" style={{fontSize:11}}>{ref}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{color:'var(--muted)', fontSize:12}}>Direct Apply</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr><td colSpan={6} style={{padding:'40px 18px', textAlign:'center', color:'var(--muted)'}}>No applications found.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'referrals' && (
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:13.5, textAlign:'left'}}>
              <thead>
                <tr style={{background:'var(--surface-2)', borderBottom:'1px solid var(--rule)'}}>
                  <th style={{padding:'12px 18px'}}>Alumni Name</th>
                  <th style={{padding:'12px 18px'}}>Company</th>
                  <th style={{padding:'12px 18px'}}>Candidate User ID</th>
                  <th style={{padding:'12px 18px'}}>Job ID</th>
                  <th style={{padding:'12px 18px'}}>State</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefs.map(r => (
                  <tr key={r.id} style={{borderBottom:'1px solid var(--rule-soft)'}}>
                    <td style={{padding:'14px 18px', fontWeight:600}}>{r.alumniName}</td>
                    <td style={{padding:'14px 18px'}}>{r.company}</td>
                    <td style={{padding:'14px 18px'}}>User #{r.userId}</td>
                    <td style={{padding:'14px 18px'}}>{r.jobId}</td>
                    <td style={{padding:'14px 18px'}}>
                      <span className={`mj-verified ${r.state === 'pending' ? '' : 'mj-verified--solid'}`}>
                        {r.state}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRefs.length === 0 && (
                  <tr><td colSpan={5} style={{padding:'40px 18px', textAlign:'center', color:'var(--muted)'}}>No referral requests found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// COMPANY PORTAL — /#/company
// =========================================================================
function PCompanyPortal() {
  const { state, dispatch } = useApp();
  const companyName = state.recruiterCompany || 'Swiggy';
  const [apps, setApps] = React.useState([]);
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showPostJob, setShowPostJob] = React.useState(false);
  const [postJobForm, setPostJobForm] = React.useState({ role:'', location:'Bengaluru', mode:'Hybrid', exp:'3–5 years', comp:'', description:'', skills:'', tags:[] });
  const [postJobLoading, setPostJobLoading] = React.useState(false);

  const token = localStorage.getItem('manju-access-token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${window.MJ_API_BASE || 'http://localhost:5200'}/api/companies/${companyName}/applications`, { headers });
      if (res.ok) {
        const data = await res.json();
        setApps(data);
        if (data.length > 0) {
          if (selectedApp) {
            const found = data.find(x => x.id === selectedApp.id);
            setSelectedApp(found || data[0]);
          } else {
            setSelectedApp(data[0]);
          }
        } else {
          setSelectedApp(null);
        }
      }
    } catch (e) {
      console.error('Failed to fetch company applications:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, [companyName]);

  const updateStage = async (userId, jobId, nextStage) => {
    try {
      const res = await fetch(`${window.MJ_API_BASE || 'http://localhost:5200'}/api/users/${userId}/applications/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ stage: nextStage })
      });
      if (res.ok) {
        dispatch({
          type: 'TOAST',
          toast: { msg: `Candidate stage updated to ${nextStage}`, icon: 'check' }
        });
        await fetchApplications();
      }
    } catch (e) {
      console.error('Failed to update stage:', e);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostJobLoading(true);
    try {
      const skills = postJobForm.skills ? postJobForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      const tags = postJobForm.tags.length > 0 ? postJobForm.tags : ['Engineering'];
      await window.MJ_api?.postJob({
        role: postJobForm.role, company: companyName,
        location: postJobForm.location, mode: postJobForm.mode,
        exp: postJobForm.exp, comp: postJobForm.comp || 'Competitive',
        description: postJobForm.description, skills, tags,
      });
      if (window.MJ_load) await window.MJ_load();
      dispatch({type:'TOAST', toast:{msg:`Job posted: ${postJobForm.role}`, icon:'check'}});
      setShowPostJob(false);
      setPostJobForm({ role:'', location:'Bengaluru', mode:'Hybrid', exp:'3–5 years', comp:'', description:'', skills:'', tags:[] });
    } catch (err) {
      dispatch({type:'TOAST', toast:{msg: err.message || 'Failed to post job', icon:'close'}});
    } finally {
      setPostJobLoading(false);
    }
  };

  const companyJobs = window.MJ.MJ_JOBS.filter(j => j.company.toLowerCase() === companyName.toLowerCase());

  return (
    <div className="proto-route">
      {/* Recruiter Header */}
      <div style={{padding:'20px 40px', background:'var(--surface)', borderBottom:'1px solid var(--rule)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <CoLogo company={companyName} size="md"/>
          <div>
            <div style={{fontSize:15, fontWeight:600, color:'var(--ink)'}}>{companyName}</div>
            <div style={{fontSize:11, color:'var(--muted)', marginTop:1}}>Recruiter console</div>
          </div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button className="mj-btn mj-btn--sm" onClick={() => setShowPostJob(true)}>
            <Icon name="plus" size={13}/> Post a Job
          </button>
          <button className="mj-btn mj-btn--ghost mj-btn--sm" onClick={fetchApplications}>Refresh</button>
          <button className="mj-btn mj-btn--text mj-btn--sm" style={{color:'var(--danger)'}} onClick={() => { dispatch({type: 'SIGN_OUT'}); window.location.hash = '#/signin'; }}>Logout</button>
        </div>
      </div>

      <div style={{padding:'28px 40px', maxWidth:1400, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:28}}>
          {/* Left Panel: Stats and Jobs */}
          <div style={{display:'flex', flexDirection:'column', gap:20}}>
            <div className="mj-card" style={{padding:16}}>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Candidate Inbox</div>
              <div className="mj-num" style={{fontSize:32}}>{apps.length}</div>
              <div className="mj-small" style={{color:'var(--ink-soft)'}}>total applications</div>
            </div>

            <div>
              <div className="mj-eyebrow" style={{marginBottom:10}}>Our Open Roles ({companyJobs.length})</div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {companyJobs.map(job => (
                  <div key={job.id} className="mj-card" style={{padding:12}}>
                    <div style={{fontWeight:600, fontSize:13}}>{job.role}</div>
                    <div className="mj-small" style={{color:'var(--ink-soft)', marginTop:2}}>{job.location} · {job.comp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Incoming Applications split view */}
          <div style={{minHeight:600, display:'grid', gridTemplateColumns:'340px 1fr', gap:20, background:'var(--surface-2)', borderRadius:'var(--radius-lg)', border:'1px solid var(--rule)', overflow:'hidden'}}>
            {/* Candidate List */}
            <div style={{borderRight:'1px solid var(--rule)', background:'var(--surface)', display:'flex', flexDirection:'column'}}>
              <div style={{padding:'14px 18px', borderBottom:'1px solid var(--rule-soft)', fontWeight:600, fontSize:13}}>Applications Queue</div>
              <div style={{flex:1, overflowY:'auto', display:'flex', flexDirection:'column'}}>
                {loading ? (
                  <div style={{padding:20, textAlign:'center', color:'var(--muted)'}}>Loading inbox...</div>
                ) : apps.length === 0 ? (
                  <div style={{padding:40, textAlign:'center', color:'var(--muted)', fontSize:13}}>No applications received yet.</div>
                ) : (
                  apps.map(a => {
                    const active = selectedApp && selectedApp.id === a.id;
                    return (
                      <div
                        key={a.id}
                        onClick={() => setSelectedApp(a)}
                        style={{
                          padding:'16px 18px', cursor:'pointer', borderBottom:'1px solid var(--rule-soft)',
                          background: active ? 'var(--primary-tint)' : 'transparent',
                          borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent'
                        }}
                      >
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
                          <span style={{fontWeight:600, fontSize:13.5, color: active ? 'var(--primary)' : 'var(--ink)'}}>{a.user.name}</span>
                          <span className="mj-chip" style={{fontSize:9, padding:'2px 6px'}}>{a.stage}</span>
                        </div>
                        <div style={{fontSize:12, color:'var(--ink-soft)'}}>{a.job.role}</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, fontSize:11}}>
                          <span style={{color:'var(--muted)'}}>{a.user.instituteShort} · {a.user.batch}</span>
                          <span style={{color:'var(--success)', fontWeight:600}}>Match {a.job.match}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Candidate Detail Preview */}
            <div style={{background:'var(--surface)', display:'flex', flexDirection:'column'}}>
              {selectedApp ? (
                <div style={{flex:1, display:'flex', flexDirection:'column', height:'100%'}}>
                  {/* Top Bar / Actions */}
                  <div style={{padding:'16px 24px', borderBottom:'1px solid var(--rule-soft)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--surface-2)'}}>
                    <div>
                      <span className="mj-mini" style={{color:'var(--muted)'}}>APPLICATION STAGE</span>
                      <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:4}}>
                        <span style={{fontWeight:600, fontSize:15}}>{selectedApp.stage}</span>
                        <span style={{fontSize:12, color:'var(--muted)'}}>· Applied {selectedApp.appliedAt}</span>
                      </div>
                    </div>
                    {/* Stage transition controls */}
                    <div style={{display:'flex', gap:6}}>
                      <button className="mj-btn mj-btn--sm" style={{background:'var(--success-bg)', color:'var(--success)', borderColor:'transparent'}} onClick={() => updateStage(selectedApp.userId, selectedApp.jobId, 'In review')}>
                        Shortlist
                      </button>
                      <button className="mj-btn mj-btn--sm" onClick={() => updateStage(selectedApp.userId, selectedApp.jobId, 'Interviewing')}>
                        Interview
                      </button>
                      <button className="mj-btn mj-btn--sm" style={{background:'var(--primary-tint)', color:'var(--primary)', borderColor:'transparent'}} onClick={() => updateStage(selectedApp.userId, selectedApp.jobId, 'Offer')}>
                        Offer
                      </button>
                      <button className="mj-btn mj-btn--ghost mj-btn--sm" style={{color:'var(--danger)'}} onClick={() => updateStage(selectedApp.userId, selectedApp.jobId, 'Rejected')}>
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Main Details */}
                  <div style={{flex:1, overflowY:'auto', padding:24}}>
                    <div style={{display:'flex', gap:18, alignItems:'center', marginBottom:20}}>
                      <Avatar name={selectedApp.user.name} color={selectedApp.user.avatarColor} size="lg"/>
                      <div>
                        <div style={{fontSize:20, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
                          {selectedApp.user.name}
                          <VerifiedPill institute={selectedApp.user.instituteShort} solid/>
                        </div>
                        <div className="mj-body" style={{color:'var(--ink-soft)'}}>{selectedApp.user.title || 'Alumnus'} · {selectedApp.user.current || 'Unspecified'}</div>
                        <div className="mj-small" style={{marginTop:2}}>{selectedApp.user.email}</div>
                      </div>
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24, padding:'14px 0', borderTop:'1px solid var(--rule-soft)', borderBottom:'1px solid var(--rule-soft)'}}>
                      <div>
                        <div className="mj-mini">EDUCATION</div>
                        <div style={{fontSize:13, marginTop:3}}>{selectedApp.user.institute} · Class of {selectedApp.user.batch}</div>
                      </div>
                      <div>
                        <div className="mj-mini">LOCATION</div>
                        <div style={{fontSize:13, marginTop:3}}>{selectedApp.user.location}</div>
                      </div>
                      <div>
                        <div className="mj-mini">JOB APPLIED FOR</div>
                        <div style={{fontSize:13, marginTop:3, fontWeight:600}}>{selectedApp.job.role}</div>
                      </div>
                      <div>
                        <div className="mj-mini">RÉSUMÉ LINK</div>
                        <div style={{fontSize:13, marginTop:3}}>
                          <a href={`${window.MJ_API_BASE || 'http://localhost:5200'}/api/users/${selectedApp.userId}/resume`} target="_blank" style={{color:'var(--primary)', fontWeight:600, textDecoration:'none'}}>
                            📄 Download PDF
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Cover Note */}
                    <div style={{marginBottom:24}}>
                      <div className="mj-mini" style={{marginBottom:8}}>COVER NOTE</div>
                      <div className="mj-card mj-card--inset" style={{padding:'14px 16px', background:'var(--surface-2)', whiteSpace:'pre-wrap', lineHeight:1.5, fontSize:13.5}}>
                        {selectedApp.coverNote || 'No cover note submitted.'}
                      </div>
                    </div>

                    {/* Alumni Referral Paths */}
                    {selectedApp.referrals && selectedApp.referrals.length > 0 && (
                      <div style={{marginBottom:24}}>
                        <div className="mj-mini" style={{marginBottom:8}}>ALUMNI REFERRAL REQUESTS</div>
                        <div style={{display:'flex', flexDirection:'column', gap:8}}>
                          {selectedApp.referrals.map(alumniName => (
                            <div key={alumniName} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--success-bg)', borderRadius:'var(--radius)', border:'1.5px solid var(--success)'}}>
                              <span>🤝</span>
                              <div style={{fontSize:12.5, color:'var(--success)', fontWeight:600}}>
                                Referral requested from {alumniName}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Candidate Experience Details */}
                    {selectedApp.user.experience && selectedApp.user.experience.length > 0 && (
                      <div style={{marginBottom:24}}>
                        <div className="mj-mini" style={{marginBottom:8}}>CANDIDATE EXPERIENCE</div>
                        <div style={{display:'flex', flexDirection:'column', gap:10}}>
                          {selectedApp.user.experience.map((e, idx) => (
                            <div key={idx} style={{padding:'10px 12px', border:'1px solid var(--rule-soft)', borderRadius:'var(--radius)'}}>
                              <div style={{fontWeight:600, fontSize:13}}>{e.role}</div>
                              <div style={{fontSize:12, color:'var(--ink-soft)'}}>{e.company} · {e.dates}</div>
                              {e.desc && <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>{e.desc}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', flexDirection:'column', gap:12}}>
                  <span style={{fontSize:36}}>📥</span>
                  <span>Select an application to view candidate snapshot</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'var(--surface)', borderRadius:'var(--radius-lg)', padding:'28px 32px', width:'100%', maxWidth:520, boxShadow:'0 20px 60px rgba(0,0,0,0.25)', maxHeight:'90vh', overflowY:'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22}}>
              <h2 style={{fontSize:18, fontWeight:600, letterSpacing:'-.01em'}}>Post a new job at {companyName}</h2>
              <button onClick={() => setShowPostJob(false)} style={{background:'none', border:'none', cursor:'pointer', color:'var(--muted)', display:'flex', padding:4}}>
                <Icon name="close" size={16}/>
              </button>
            </div>
            <form onSubmit={handlePostJob} style={{display:'flex', flexDirection:'column', gap:14}}>
              <div>
                <label className="mj-label">Job Title <span style={{color:'var(--primary)'}}>*</span></label>
                <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.role} onChange={e=>setPostJobForm(f=>({...f, role:e.target.value}))} required placeholder="e.g. Senior Product Manager"/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                <div>
                  <label className="mj-label">Location</label>
                  <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.location} onChange={e=>setPostJobForm(f=>({...f, location:e.target.value}))} placeholder="Bengaluru"/>
                </div>
                <div>
                  <label className="mj-label">Work Mode</label>
                  <select className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.mode} onChange={e=>setPostJobForm(f=>({...f, mode:e.target.value}))}>
                    {['Hybrid','Remote','On-site'].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                <div>
                  <label className="mj-label">Experience</label>
                  <select className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.exp} onChange={e=>setPostJobForm(f=>({...f, exp:e.target.value}))}>
                    {['0–2 years','2–4 years','3–5 years','5–8 years','8+ years'].map(x=><option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mj-label">Compensation</label>
                  <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.comp} onChange={e=>setPostJobForm(f=>({...f, comp:e.target.value}))} placeholder="e.g. ₹40–60 LPA"/>
                </div>
              </div>
              <div>
                <label className="mj-label">Description</label>
                <textarea className="mj-input" style={{height:88, padding:'8px 12px', fontSize:13.5, resize:'vertical', fontFamily:'var(--font-body)'}} value={postJobForm.description} onChange={e=>setPostJobForm(f=>({...f, description:e.target.value}))} placeholder="Describe the role and what makes it compelling..."/>
              </div>
              <div>
                <label className="mj-label">Skills <span style={{color:'var(--muted)', fontWeight:400}}>(comma-separated)</span></label>
                <input className="mj-input" style={{height:36, padding:'6px 12px', fontSize:13.5}} value={postJobForm.skills} onChange={e=>setPostJobForm(f=>({...f, skills:e.target.value}))} placeholder="e.g. Product Strategy, SQL, Python"/>
              </div>
              <div>
                <label className="mj-label" style={{marginBottom:8, display:'block'}}>Function</label>
                <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
                  {['Product','Engineering','Strategy','Consulting','Finance','Marketing','Design'].map(tag => {
                    const on = postJobForm.tags.includes(tag);
                    return (
                      <button key={tag} type="button"
                        onClick={()=>setPostJobForm(f=>({...f, tags: on ? f.tags.filter(t=>t!==tag) : [...f.tags, tag]}))}
                        className={`mj-chip mj-chip--lg ${on ? 'mj-chip--solid' : ''}`}
                        style={{cursor:'pointer', border:'1px solid', borderColor: on ? 'var(--primary)':'var(--rule)'}}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{display:'flex', gap:10, paddingTop:4}}>
                <button className="mj-btn mj-btn--lg" type="submit" disabled={postJobLoading} style={{flex:1, justifyContent:'center'}}>
                  {postJobLoading ? 'Posting…' : 'Post Job'}
                </button>
                <button type="button" className="mj-btn mj-btn--ghost" onClick={() => setShowPostJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PDetail, PApply, PTracker, PProfile, PAdminPortal, PCompanyPortal });

