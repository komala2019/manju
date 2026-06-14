// src/parts.jsx — Shared building blocks (Logo, JobCard, Header, Filters…)

const Icon = ({ name, size = 16, stroke = 1.6, style }) => {
  const paths = {
    search:  <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    filter:  <><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></>,
    bell:    <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    bookmark:<path d="M6 4h12v17l-6-4-6 4z"/>,
    arrow:   <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    arrowSm: <><path d="M4 10h12"/><path d="m11 5 5 5-5 5"/></>,
    check:   <path d="m4 12 5 5L20 6"/>,
    plus:    <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    location:<><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></>,
    briefcase:<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="m6 6 3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></>,
    cal:     <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></>,
    user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    edu:     <><path d="m12 4 10 5-10 5L2 9z"/><path d="M6 11v5c0 2 3 3 6 3s6-1 6-3v-5"/></>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    chevronR:<path d="m9 6 6 6-6 6"/>,
    chevronL:<path d="m15 6-6 6 6 6"/>,
    close:   <><path d="M5 5l14 14"/><path d="M19 5 5 19"/></>,
    inbox:   <><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 13 7 4h10l2 9"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list:    <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    split:   <><rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/></>,
    sun:     <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon:    <path d="M21 13a8 8 0 1 1-9.8-9.8 6 6 0 0 0 9.8 9.8z"/>,
    spark:   <path d="m12 2-2 6-6 2 6 2 2 6 2-6 6-2-6-2z"/>,
    handshake:<><path d="m12 11-2 2-3-3 5-5 4 4-2 2-2-2"/><path d="m11 9-7 7 3 3 7-7"/></>,
    link:    <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    download:<><path d="M12 3v12"/><path d="m6 11 6 6 6-6"/><path d="M4 21h16"/></>,
    badge:   <><circle cx="12" cy="9" r="6"/><path d="m9 13-2 8 5-3 5 3-2-8"/></>,
    eye:     <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:  <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={style} aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

function ManjuMark({ size = 22, sub = true }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:9}}>
      <div style={{
        width: size+10, height: size+10, borderRadius: 9,
        background:'var(--primary)', color:'var(--on-primary)',
        display:'flex',alignItems:'center',justifyContent:'center',
        fontFamily:'var(--font-display)', fontSize:size, fontWeight:800,
        letterSpacing:'-.05em',
      }}>M</div>
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:size, fontWeight:700, lineHeight:1, color:'var(--ink)', letterSpacing:'-.03em'}}>Manju</div>
        {sub && <div className="mj-mini" style={{fontSize:8,letterSpacing:'.1em'}}>IIT · IIM ONLY</div>}
      </div>
    </div>
  );
}

function CoLogo({ company, color, size }) {
  const s = size === 'sm' ? 'mj-logo--sm' : size === 'lg' ? 'mj-logo--lg' : '';
  const initial = (company || '?').charAt(0).toUpperCase();
  return (
    <div className={`mj-logo ${s}`} style={{background: color || 'var(--primary)'}}>{initial}</div>
  );
}

function Avatar({ name, initials, color, size, badge }) {
  const s = size === 'sm' ? 'mj-av--sm' : size === 'lg' ? 'mj-av--lg' : size === 'xl' ? 'mj-av--xl' : '';
  const ini = initials || (name || '?').split(' ').map(n=>n[0]).slice(0,2).join('');
  return (
    <div style={{position:'relative',display:'inline-flex'}}>
      <div className={`mj-av ${s}`} style={color ? {background: color} : null}>{ini}</div>
      {badge && (
        <div style={{
          position:'absolute', bottom:-2, right:-2, width:14, height:14, borderRadius:'50%',
          background:'var(--accent)', color:'#fff', fontSize:8, display:'flex',
          alignItems:'center', justifyContent:'center', border:'2px solid var(--surface)',
          fontFamily:'var(--font-mono)'
        }}>✓</div>
      )}
    </div>
  );
}

function VerifiedPill({ institute, solid }) {
  return (
    <span className={`mj-verified ${solid ? 'mj-verified--solid' : ''}`}>
      Verified {institute || 'alumni'}
    </span>
  );
}

function MatchScore({ value }) {
  return <span className="mj-match"><strong>{value}</strong>%&nbsp;match</span>;
}

function ReferralStrip({ count, inRole, dense }) {
  if (!count) return null;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding: dense ? '8px 10px' : '10px 12px',
      background:'var(--surface-2)', borderRadius:'var(--radius)',
      fontSize:12, color:'var(--ink-soft)'
    }}>
      <div className="mj-avs">
        {(window.MJ.MJ_ALUMNI || []).slice(0,3).map((a,i)=>(
          <span key={i} className="mj-av mj-av--sm" style={{background:a.color, fontSize:10}}>{a.initials}</span>
        ))}
      </div>
      <div style={{lineHeight:1.35}}>
        <b style={{fontWeight:600,color:'var(--ink)'}}>{count} alumni</b> inside
        {inRole > 0 && <span style={{color:'var(--muted)'}}> · {inRole} in same role</span>}
      </div>
      <button className="mj-btn mj-btn--text mj-btn--sm" style={{marginLeft:'auto', padding:'5px 8px'}}>
        Ask <Icon name="arrowSm" size={12}/>
      </button>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle, action, level=2 }) {
  const Tag = level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2';
  const cls = level === 1 ? 'mj-h1' : level === 3 ? 'mj-h3' : 'mj-h2';
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,marginBottom:18}}>
      <div>
        {eyebrow && <div className="mj-eyebrow" style={{marginBottom:8}}>{eyebrow}</div>}
        <Tag className={cls}>{title}</Tag>
        {subtitle && <div className="mj-body" style={{marginTop:6,maxWidth:560}}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{paddingBottom:18,marginBottom:18,borderBottom:'1px solid var(--rule-soft)'}}>
      <div className="mj-eyebrow" style={{marginBottom:12,fontSize:10}}>{label}</div>
      {children}
    </div>
  );
}

function FilterCheck({ label, count, checked, onClick }) {
  return (
    <label onClick={onClick} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',cursor:'pointer',userSelect:'none'}}>
      <span style={{
        width:16,height:16,borderRadius:3,border:'1px solid var(--rule)',
        background:checked?'var(--primary)':'var(--surface)',
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--on-primary)'
      }}>{checked && <Icon name="check" size={10} stroke={2.5}/>}</span>
      <span style={{flex:1,fontSize:13,color:'var(--ink-soft)'}}>{label}</span>
      <span className="mj-small" style={{fontVariantNumeric:'tabular-nums'}}>{count}</span>
    </label>
  );
}

function FilterChips({ options, value, onChange }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
      {options.map(o => {
        const on = value === o;
        return (
          <button key={o} onClick={()=>onChange(o)} className={`mj-chip ${on?'mj-chip--solid':''} mj-chip--lg`}
            style={{cursor:'pointer',border:'1px solid', borderColor: on ? 'var(--primary)':'var(--rule)'}}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function StatTile({ label, value, sub, accent }) {
  return (
    <div className="mj-card" style={{padding:'18px 20px'}}>
      <div className="mj-eyebrow" style={{marginBottom:10,fontSize:10}}>{label}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:8}}>
        <div className="mj-num" style={{fontSize:38, lineHeight:1, color: accent ? 'var(--primary)':'var(--ink)'}}>{value}</div>
        {sub && <div className="mj-small">{sub}</div>}
      </div>
    </div>
  );
}

function MiniFooter() {
  return (
    <footer style={{padding:'24px 40px',borderTop:'1px solid var(--rule)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <ManjuMark size={16} sub={false}/>
        <span className="mj-mini">© 2026 · Open only to verified IIT &amp; IIM alumni</span>
      </div>
      <div style={{display:'flex',gap:18}}>
        {['Privacy','Terms','Code of conduct','Contact'].map(x=>
          <a key={x} href="#" className="mj-mini" style={{textDecoration:'none'}}>{x}</a>)}
      </div>
    </footer>
  );
}

Object.assign(window, {
  Icon, ManjuMark, CoLogo, Avatar, VerifiedPill, MatchScore,
  ReferralStrip, SectionHead, FilterGroup,
  FilterCheck, FilterChips, StatTile, MiniFooter,
});
