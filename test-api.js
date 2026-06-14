// test-api.js - Command line testing agent for Manju API
// Run this script using: node test-api.js

const API_BASE = 'http://localhost:5200/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

async function runTestAgent() {
  console.log(`\n${colors.bold}${colors.cyan}🤖 MANJU BACKEND TESTING AGENT STARTED${colors.reset}\n`);
  console.log(`Targeting API Base: ${colors.bold}${API_BASE}${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  async function assertTest(name, fn) {
    console.log(`${colors.yellow}Running test: ${name}...${colors.reset}`);
    try {
      await fn();
      console.log(`${colors.green}✓ PASS: ${name}${colors.reset}\n`);
      passed++;
    } catch (err) {
      console.log(`${colors.red}✗ FAIL: ${name}${colors.reset}`);
      console.log(`  Reason: ${colors.red}${err.message}${colors.reset}\n`);
      failed++;
    }
  }

  // 1. Test database loads
  await assertTest('Fetch Jobs List', async () => {
    const res = await fetch(`${API_BASE}/jobs`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Returned empty or invalid jobs list');
  });

  await assertTest('Fetch Companies List', async () => {
    const res = await fetch(`${API_BASE}/companies`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Returned invalid companies list');
  });

  // 2. Test Auth validation fails with incorrect password
  await assertTest('Auth Login Fails for Invalid Credentials', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'arjun@iitbombay.ac.in', password: 'wrongpassword' })
    });
    if (res.ok) throw new Error('Login succeeded when it should have failed');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 3. Test Auth login succeeds with correct password
  let sessionToken = '';
  await assertTest('Auth Login Succeeds for Demo User', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'arjun@iitbombay.ac.in', password: 'demo123' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.accessToken || !data.user) throw new Error('Missing session details');
    sessionToken = data.accessToken;
  });

  // 4. Test Google Sign-in / Sign-up endpoint registration
  let googleSessionToken = '';
  let googleUserId = null;
  const testEmail = `agent.test.${Date.now()}@iitd.ac.in`;
  const testName = 'Agent Test User';

  await assertTest('Google Auth Registers New User (Sign-Up)', async () => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: `mock_|${testEmail}|${testName}` })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.accessToken || !data.user || data.isNewUser !== true) {
      throw new Error(`Expected isNewUser=true. Data: ${JSON.stringify(data)}`);
    }
    googleSessionToken = data.accessToken;
    googleUserId = data.user.id;
  });

  // 5. Test LinkedIn Sign-in / Sign-up endpoint registration
  let linkedinSessionToken = '';
  let linkedinUserId = null;
  const testLinkedinEmail = `linkedin.test.${Date.now()}@linkedin-member.com`;
  const testLinkedinName = 'LinkedIn Test User';

  await assertTest('LinkedIn Auth Registers New User (Sign-Up)', async () => {
    const res = await fetch(`${API_BASE}/auth/linkedin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: `mock_linkedin_|${testLinkedinEmail}|${testLinkedinName}` })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.accessToken || !data.user || data.isNewUser !== true) {
      throw new Error(`Expected isNewUser=true. Data: ${JSON.stringify(data)}`);
    }
    linkedinSessionToken = data.accessToken;
    linkedinUserId = data.user.id;
  });

  // 6. Test accessing authenticated endpoint
  await assertTest('Access User Profile with JWT Authorization', async () => {
    if (!googleSessionToken || !googleUserId) throw new Error('Google auth token missing');
    const res = await fetch(`${API_BASE}/users/${googleUserId}`, {
      headers: { 'Authorization': `Bearer ${googleSessionToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.name !== testName) {
      throw new Error(`User profile mismatch. Found: ${data.name}`);
    }
  });

  // 6. Test saved jobs API for the new user
  await assertTest('Save Job for Google Registered User', async () => {
    if (!googleSessionToken) throw new Error('Google token missing');
    // Save job j1
    const res = await fetch(`${API_BASE}/users/${googleUserId}/saved/j1`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${googleSessionToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}--- TEST SUITE SUMMARY ---${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(`${colors.bold}${colors.green}🎉 All test agent validations passed!${colors.reset}\n`);
  }
}

runTestAgent().catch(err => {
  console.error('Test Agent failed fatally:', err);
  process.exit(1);
});
