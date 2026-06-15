// src/data.jsx — Data layer: fetches from ManjuApi (localhost:5200) with hardcoded fallback

window.MJ_API_BASE = localStorage.getItem('MJ_API_BASE') || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:5200`
    : ''
);

window.MJ_AGENT_BASE = localStorage.getItem('MJ_AGENT_BASE') || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:3002`
    : ''
);

const MJ_API = {
  toString() {
    if (window.MJ_API_BASE === '') return '/api';
    return (window.MJ_API_BASE || `http://${window.location.hostname}:5200`) + '/api';
  }
};

// Auth token management
let _accessToken = localStorage.getItem('manju-access-token');
let _refreshToken = localStorage.getItem('manju-refresh-token');

const getAuthHeader = () => _accessToken ? { 'Authorization': `Bearer ${_accessToken}` } : {};
const getUserId = () => localStorage.getItem('manju-user-id') || '1';

// ─── Hardcoded fallback (used when API is unreachable) ────────────────────────

const FALLBACK_USER = {
  id: 1,
  name: 'Arjun Sharma', first: 'Arjun', last: 'Sharma',
  title: 'Senior Software Engineer', current: 'Flipkart',
  institute: 'IIT Bombay', instituteShort: 'IIT B', batch: "'18",
  location: 'Bengaluru', avatarColor: '#2970FF', completeness: 72,
  experience: [
    { role: 'Senior Software Engineer', company: 'Flipkart', loc: 'Bengaluru', dates: '2021 – present',
      desc: 'Tech lead on the relevance and ranking team. Own search personalisation for 200M+ catalogue items across 50M MAU.' },
    { role: 'SDE-2', company: 'Ola', loc: 'Bengaluru', dates: '2019 – 2021',
      desc: 'Backend services for the driver allocation and surge pricing systems. Reduced allocation latency by 38%.' },
    { role: 'SDE-1', company: 'Freshworks', loc: 'Chennai', dates: '2018 – 2019',
      desc: 'Full-stack feature development on Freshdesk ticket management.' },
  ],
  education: [
    { school: 'IIT Bombay', degree: 'B.Tech Computer Science', dates: '2014 – 2018',
      detail: 'CGPA 8.7 · Core team, E-Cell · TA for Algorithms' },
    { school: 'Kendriya Vidyalaya No. 1', degree: 'Class XII · PCM', dates: '2012 – 2014',
      detail: '96.4% · City rank 3 in JEE Advanced' },
  ],
  skills: ['Product Thinking','System Design','Python','Go','Distributed Systems','SQL','Kafka','Redis','gRPC','ML Basics'],
  preferences: {
    roles: ['Head of Engineering','Staff Engineer','Engineering Manager'],
    locations: ['Bengaluru','Remote','Mumbai'],
    comp: '₹70–100 LPA',
  },
};

const FALLBACK_JOBS = [
  { id:'j1', role:'Head of Product', company:'Razorpay', logoColor:'#2D6BE4',
    location:'Bengaluru', mode:'Hybrid', exp:'5–8 years', comp:'₹52–68 LPA',
    match:94, alumni:12, alumniInRole:4, posted:'2d ago',
    description:"Own the entire product surface for Razorpay's merchant-facing checkout and payments stack.",
    responsibilities:['Define and own the product roadmap for checkout','Manage a team of 6 PMs'],
    skills:['Product Strategy','Payments Domain','Team Leadership'],
    tags:['Product','Fintech'], team:'Reports to CPO · team of 6 PMs' },
  { id:'j2', role:'Staff Engineer – Infra', company:'Flipkart', logoColor:'#F7941D',
    location:'Bengaluru', mode:'Hybrid', exp:'5–8 years', comp:'₹70–90 LPA',
    match:88, alumni:9, alumniInRole:2, posted:'4d ago',
    description:"Lead the platform infrastructure work underpinning Flipkart's sale traffic.",
    responsibilities:['Architect distributed systems work','Drive reliability engineering'],
    skills:['Distributed Systems','Kubernetes','Go'],
    tags:['Engineering','Infrastructure'], team:'Reports to VP Eng' },
  { id:'j3', role:'VP – Strategy & Operations', company:'Goldman Sachs', logoColor:'#0A3B6B',
    location:'Mumbai', mode:'On-site', exp:'8+ years', comp:'₹90 LPA–1.2 Cr',
    match:81, alumni:7, alumniInRole:1, posted:'1w ago',
    description:'Drive strategic initiatives across GS India technology and operations division.',
    responsibilities:['Own strategic planning cycle for India technology division'],
    skills:['Strategy','Financial Modelling','Executive Communication'],
    tags:['Strategy','Finance'], team:'Reports to MD Operations India' },
  { id:'j4', role:'Engagement Manager', company:'McKinsey', logoColor:'#1C1C4E',
    location:'Pan-India', mode:'Hybrid', exp:'3–5 years', comp:'₹48–60 LPA',
    match:76, alumni:21, alumniInRole:8, posted:'3d ago',
    description:"Lead client-facing project teams on strategy and digital transformation engagements.",
    responsibilities:['Lead day-to-day client delivery on 2–3 concurrent engagements'],
    skills:['Problem Solving','Client Management','Team Leadership'],
    tags:['Strategy','Consulting'], team:'Reports to Associate Partner' },
  { id:'j5', role:'Senior Product Manager', company:'Zerodha', logoColor:'#387ED1',
    location:'Bengaluru', mode:'Remote', exp:'3–5 years', comp:'₹42–55 LPA',
    match:72, alumni:4, alumniInRole:2, posted:'5d ago',
    description:"Own the trader experience on Kite — India's most-used trading platform.",
    responsibilities:['Own and evolve the Kite web and mobile trading experience'],
    skills:['Product Management','Financial Markets','UX Thinking'],
    tags:['Product','Fintech'], team:'Reports to Founder' },
  { id:'j6', role:'Engineering Manager', company:'Swiggy', logoColor:'#FC8019',
    location:'Bengaluru', mode:'Hybrid', exp:'5–8 years', comp:'₹65–85 LPA',
    match:69, alumni:6, alumniInRole:1, posted:'1w ago',
    description:"Lead Swiggy's consumer app engineering team — 50M MAU.",
    responsibilities:['Manage a team of 12 engineers across Android, iOS and backend'],
    skills:['Engineering Management','Android/iOS','System Design'],
    tags:['Engineering','Consumer'], team:'Reports to Director of Engineering' },
  { id:'j7', role:'Head of Growth', company:'CRED', logoColor:'#1A1A2E',
    location:'Bengaluru', mode:'Hybrid', exp:'5–8 years', comp:'₹58–78 LPA',
    match:65, alumni:5, alumniInRole:1, posted:'6d ago',
    description:"Own CRED's member growth and engagement funnel end-to-end.",
    responsibilities:['Own member acquisition — paid, organic, referral channels'],
    skills:['Growth Hacking','Performance Marketing','Product Analytics'],
    tags:['Product','Marketing'], team:'Reports to Co-founder' },
  { id:'j8', role:'Product Lead – Commerce', company:'Tata Digital', logoColor:'#0032A0',
    location:'Mumbai', mode:'On-site', exp:'3–5 years', comp:'₹44–58 LPA',
    match:62, alumni:3, alumniInRole:1, posted:'2w ago',
    description:"Define the next chapter for Tata Neu's commerce experience.",
    responsibilities:['Own product vision and roadmap for Tata Neu commerce verticals'],
    skills:['Product Management','E-commerce','Retail Domain'],
    tags:['Product','E-commerce'], team:'Reports to VP Product' },
];

const FALLBACK_ALUMNI = [
  { name:'Rohan Mehta', initials:'RM', color:'#4A90D9', institute:'IIT Bombay',  batch:"'14", role:'Senior PM @ Razorpay',             mutual:8 },
  { name:'Priya Iyer',  initials:'PI', color:'#E67E22', institute:'IIM Bangalore', batch:"'16", role:'Engagement Manager @ McKinsey', mutual:5 },
  { name:'Aditya Rao',  initials:'AR', color:'#27AE60', institute:'IIT Delhi',   batch:"'15", role:'Staff SWE @ Flipkart',             mutual:3 },
];

const FALLBACK_COMPANIES = [
  { name:'Razorpay', open:8,  color:'#2D6BE4' }, { name:'Flipkart',      open:14, color:'#F7941D' },
  { name:'Goldman Sachs', open:5,  color:'#0A3B6B' }, { name:'McKinsey',  open:11, color:'#1C1C4E' },
  { name:'Zerodha',  open:3,  color:'#387ED1' }, { name:'Swiggy',        open:9,  color:'#FC8019' },
  { name:'CRED',     open:6,  color:'#1A1A2E' }, { name:'Tata Digital',  open:7,  color:'#0032A0' },
  { name:'Ola',      open:4,  color:'#25B847' }, { name:'Groww',         open:6,  color:'#5367FF' },
  { name:'PhonePe',  open:9,  color:'#5F259F' }, { name:'Meesho',        open:5,  color:'#F43397' },
];

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchJSON(path) {
  const res = await fetch(MJ_API + path, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

// Called by proto-app.jsx before React mounts.
// On success: populates window.MJ from the live database.
// On failure: window.MJ keeps the fallback values.
window.MJ_load = async function() {
  try {
    const [jobs, companies, alumni] = await Promise.all([
      fetchJSON('/jobs'),
      fetchJSON('/companies'),
      fetchJSON('/alumni'),
    ]);

    let profile = FALLBACK_USER;
    if (_accessToken) {
      try {
        const user = await fetchJSON('/users/' + getUserId());
        profile = {
          ...user,
          first: user.first,
          instituteShort: user.instituteShort,
        };
      } catch (err) {
        console.warn('[Manju] Auth token invalid or expired. Using fallback user profile.', err.message);
      }
    }

    window.MJ = {
      MJ_USER:     profile,
      MJ_JOBS:     jobs,
      MJ_ALUMNI:   alumni,
      MJ_COMPANIES: companies,
      MJ_PROFILE:  profile,
      _fromApi: true,
    };

    console.info('[Manju] Data loaded from API ✓', { jobs: jobs.length, companies: companies.length });
  } catch (err) {
    console.warn('[Manju] API unavailable — using fallback data.', err.message);
    // window.MJ was already set to fallback below; nothing to do.
  }
};

// ─── Write helpers — called by proto-core.jsx on state changes ────────────────
window.MJ_api = {
  login: async (email, password) => {
    if (!window.MJ || !window.MJ._fromApi) {
      if (email === 'admin@manju.in') {
        _accessToken = 'mock_admin_token';
        localStorage.setItem('manju-access-token', _accessToken);
        localStorage.setItem('manju-user-id', '2');
        const adminUser = { id: 2, email: 'admin@manju.in', name: 'Admin', role: 'admin', completeness: 100, experience: [], education: [], skills: [] };
        window.MJ.MJ_USER = adminUser;
        window.MJ.MJ_PROFILE = adminUser;
        return adminUser;
      }
      if (email === 'recruiter@swiggy.com') {
        _accessToken = 'mock_recruiter_token';
        localStorage.setItem('manju-access-token', _accessToken);
        localStorage.setItem('manju-user-id', '3');
        const recruiterUser = { id: 3, email: 'recruiter@swiggy.com', name: 'Swiggy Recruiter', role: 'recruiter', recruiterCompany: 'Swiggy', completeness: 100, experience: [], education: [], skills: [] };
        window.MJ.MJ_USER = recruiterUser;
        window.MJ.MJ_PROFILE = recruiterUser;
        return recruiterUser;
      }
      _accessToken = 'mock_user_token';
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-user-id', '1');
      window.MJ.MJ_USER = FALLBACK_USER;
      window.MJ.MJ_PROFILE = FALLBACK_USER;
      return FALLBACK_USER;
    }
    try {
      const res = await fetch(`${MJ_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({error:'Login failed'}));
        throw new Error(err.error || `Login failed: ${res.status}`);
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      _refreshToken = data.refreshToken;
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-refresh-token', _refreshToken);
      localStorage.setItem('manju-user-id', String(data.user.id));
      return data.user;
    } catch (err) {
      console.error('[Auth] Login failed:', err.message);
      throw err;
    }
  },
  
  signup: async (email, password, name, institute, batch, location) => {
    if (!window.MJ || !window.MJ._fromApi) {
      const mockUser = {
        id: 999,
        email,
        name,
        first: name.split(' ')[0] || '',
        last: name.split(' ')[1] || '',
        title: 'Alumnus / Member',
        current: '',
        institute: institute || 'IIT Bombay',
        instituteShort: institute ? institute.substring(0, 5) : 'IIT B',
        batch: batch || '2018',
        location: location || 'Bengaluru',
        avatarColor: '#2D6BE4',
        completeness: 30,
        experience: [],
        education: [],
        skills: [],
        preferences: { roles: [], locations: [], comp: "" },
        role: 'candidate',
      };
      _accessToken = 'mock_signup_token';
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-user-id', '999');
      window.MJ.MJ_USER = mockUser;
      window.MJ.MJ_PROFILE = mockUser;
      return { accessToken: 'mock_signup_token', refreshToken: 'mock_refresh', user: mockUser };
    }
    try {
      const res = await fetch(`${MJ_API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, institute, batch, location }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({error:'Registration failed'}));
        throw new Error(err.error || `Registration failed: ${res.status}`);
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      _refreshToken = data.refreshToken;
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-refresh-token', _refreshToken);
      localStorage.setItem('manju-user-id', String(data.user.id));
      return data;
    } catch (err) {
      console.error('[Auth] Signup failed:', err.message);
      throw err;
    }
  },

  googleLogin: async (idToken) => {
    if (!window.MJ || !window.MJ._fromApi) {
      const parts = idToken.split('|');
      const email = parts[1] || 'google.user@gmail.com';
      const name = parts[2] || 'Google User';
      const mockUser = {
        id: 888,
        email,
        name,
        first: name.split(' ')[0] || '',
        last: name.split(' ')[1] || '',
        title: 'Alumnus / Member',
        current: '',
        institute: 'IIT Bombay',
        instituteShort: 'IIT B',
        batch: '2018',
        location: 'Bengaluru',
        avatarColor: '#2D6BE4',
        completeness: 30,
        experience: [],
        education: [],
        skills: [],
        preferences: { roles: [], locations: [], comp: "" },
        role: 'candidate',
      };
      _accessToken = 'mock_google_token';
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-user-id', '888');
      window.MJ.MJ_USER = mockUser;
      window.MJ.MJ_PROFILE = mockUser;
      return { accessToken: 'mock_google_token', refreshToken: 'mock_refresh', user: mockUser, isNewUser: true };
    }
    try {
      const res = await fetch(`${MJ_API}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({error:'Google login failed'}));
        throw new Error(err.error || `Google login failed: ${res.status}`);
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      _refreshToken = data.refreshToken;
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-refresh-token', _refreshToken);
      localStorage.setItem('manju-user-id', String(data.user.id));
      return data;
    } catch (err) {
      console.error('[Auth] Google login failed:', err.message);
      throw err;
    }
  },

  linkedinLogin: async (idToken) => {
    if (!window.MJ || !window.MJ._fromApi) {
      const parts = idToken.split('|');
      const email = parts[1] || 'linkedin.user@linkedin.com';
      const name = parts[2] || 'LinkedIn User';
      const mockUser = {
        id: 777,
        email,
        name,
        first: name.split(' ')[0] || '',
        last: name.split(' ')[1] || '',
        title: 'Alumnus / Member',
        current: '',
        institute: 'IIT Bombay',
        instituteShort: 'IIT B',
        batch: '2018',
        location: 'Bengaluru',
        avatarColor: '#0A66C2',
        completeness: 30,
        experience: [],
        education: [],
        skills: [],
        preferences: { roles: [], locations: [], comp: "" },
        role: 'candidate',
      };
      _accessToken = 'mock_linkedin_token';
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-user-id', '777');
      window.MJ.MJ_USER = mockUser;
      window.MJ.MJ_PROFILE = mockUser;
      return { accessToken: 'mock_linkedin_token', refreshToken: 'mock_refresh', user: mockUser, isNewUser: true };
    }
    try {
      const res = await fetch(`${MJ_API}/auth/linkedin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({error:'LinkedIn login failed'}));
        throw new Error(err.error || `LinkedIn login failed: ${res.status}`);
      }
      const data = await res.json();
      _accessToken = data.accessToken;
      _refreshToken = data.refreshToken;
      localStorage.setItem('manju-access-token', _accessToken);
      localStorage.setItem('manju-refresh-token', _refreshToken);
      localStorage.setItem('manju-user-id', String(data.user.id));
      return data;
    } catch (err) {
      console.error('[Auth] LinkedIn login failed:', err.message);
      throw err;
    }
  },

  logout: () => {
    _accessToken = null;
    _refreshToken = null;
    localStorage.removeItem('manju-access-token');
    localStorage.removeItem('manju-refresh-token');
  },

  saveJob:   (jobId) => {
    if (!window.MJ || !window.MJ._fromApi) return Promise.resolve();
    return fetch(`${MJ_API}/users/${getUserId()}/saved/${jobId}`,
      { method: 'POST', headers: getAuthHeader() }
    ).catch(e => { console.warn('[API] Save failed:', e); });
  },

  unsaveJob: (jobId) => {
    if (!window.MJ || !window.MJ._fromApi) return Promise.resolve();
    return fetch(`${MJ_API}/users/${getUserId()}/saved/${jobId}`,
      { method: 'DELETE', headers: getAuthHeader() }
    ).catch(e => { console.warn('[API] Unsave failed:', e); });
  },

  apply: (jobId, coverNote, referrals) => {
    if (!window.MJ || !window.MJ._fromApi) return Promise.resolve();
    return fetch(`${MJ_API}/users/${getUserId()}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ jobId, coverNote, referrals }),
    }).catch(e => { console.warn('[API] Apply failed:', e); });
  },

  moveStage: (jobId, stage) => {
    if (!window.MJ || !window.MJ._fromApi) return Promise.resolve();
    return fetch(`${MJ_API}/users/${getUserId()}/applications/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ stage }),
    }).catch(e => { console.warn('[API] Move stage failed:', e); });
  },

  postJob: async (jobData) => {
    if (!window.MJ || !window.MJ._fromApi) {
      const mockNewJob = { id: 'j_mock_' + Date.now(), ...jobData, match: 0, alumni: 0, alumniInRole: 0, posted: 'just now' };
      window.MJ.MJ_JOBS = [mockNewJob, ...(window.MJ.MJ_JOBS || [])];
      return mockNewJob;
    }
    try {
      const res = await fetch(`${MJ_API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(jobData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({error:'Failed to post job'}));
        throw new Error(err.error || `Post job failed: ${res.status}`);
      }
      return res.json();
    } catch (err) {
      console.error('[API] Post job failed:', err.message);
      throw err;
    }
  },

  loadUserData: async (userId) => {
    if (!window.MJ || !window.MJ._fromApi) {
      return { saved: ['j2', 'j4', 'j7'], applications: {}, referralRequests: {}, profile: window.MJ?.MJ_USER || FALLBACK_USER };
    }
    const headers = { ...getAuthHeader() };
    try {
      const [savedIds, apps, referrals, user] = await Promise.all([
        fetch(`${MJ_API}/users/${userId}/saved`,        { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${MJ_API}/users/${userId}/applications`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${MJ_API}/users/${userId}/referrals`,    { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${MJ_API}/users/${userId}`,              { headers }).then(r => r.ok ? r.json() : null),
      ]);

      if (user) {
        window.MJ.MJ_USER    = user;
        window.MJ.MJ_PROFILE = user;
      }

      // Map API referrals → frontend referralRequests dict
      const referralRequests = {};
      referrals.forEach(r => {
        referralRequests[`${r.alumniName}@${r.company}`] = {
          state: r.state, jobId: r.jobId, at: r.createdAt,
        };
      });

      // Map API applications → frontend applications dict
      const applications = {};
      apps.forEach(a => {
        applications[a.jobId] = {
          stage: a.stage, appliedAt: a.appliedAt,
          coverNote: a.coverNote, referrals: a.referrals || [],
        };
      });

      return { saved: savedIds || [], applications, referralRequests, profile: user };
    } catch (err) {
      console.warn('[API] loadUserData failed:', err.message);
      return null;
    }
  },
};

// ─── Initial fallback values (overwritten by MJ_load if API is reachable) ─────
window.MJ = {
  MJ_USER:      FALLBACK_USER,
  MJ_JOBS:      FALLBACK_JOBS,
  MJ_ALUMNI:    FALLBACK_ALUMNI,
  MJ_COMPANIES: FALLBACK_COMPANIES,
  MJ_PROFILE:   FALLBACK_USER,
  _fromApi: false,
};
