// test-new-endpoints.js - Test script for newly implemented endpoints
const API_BASE = 'http://localhost:5200/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}🤖 RUNNING NEW ENDPOINTS TEST SUITE${colors.reset}\n`);

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

  let testUserToken = '';
  let testUserId = null;
  const testEmail = `signup.test.${Date.now()}@iitb.ac.in`;

  // 1. Test Signup
  await assertTest('Custom Sign-Up Endpoint', async () => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!',
        name: 'Manju Candidate',
        institute: 'IIT Bombay',
        batch: '2020',
        location: 'Mumbai'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.accessToken || !data.user) throw new Error('Missing signup response tokens or user object');
    if (data.user.email !== testEmail) throw new Error(`Email mismatch: expected ${testEmail}, got ${data.user.email}`);
    testUserToken = data.accessToken;
    testUserId = data.user.id;
  });

  // 2. Test Admin Stats
  await assertTest('Admin Stats Endpoint', async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (typeof data.users !== 'number' || typeof data.applications !== 'number') {
      throw new Error(`Invalid stats format: ${JSON.stringify(data)}`);
    }
  });

  // 3. Test Admin Lists
  await assertTest('Admin Lists Endpoints', async () => {
    const [uRes, aRes, rRes] = await Promise.all([
      fetch(`${API_BASE}/admin/users`, { headers: { 'Authorization': `Bearer ${testUserToken}` } }).then(r => r.json()),
      fetch(`${API_BASE}/admin/applications`, { headers: { 'Authorization': `Bearer ${testUserToken}` } }).then(r => r.json()),
      fetch(`${API_BASE}/admin/referrals`, { headers: { 'Authorization': `Bearer ${testUserToken}` } }).then(r => r.json())
    ]);

    if (!Array.isArray(uRes) || uRes.length === 0) throw new Error('Failed to fetch admin users list');
    if (!Array.isArray(aRes)) throw new Error('Failed to fetch admin applications list');
    if (!Array.isArray(rRes)) throw new Error('Failed to fetch admin referrals list');
  });

  // 4. Test Company Applications
  await assertTest('Company Incoming Applications Endpoint', async () => {
    const res = await fetch(`${API_BASE}/companies/Swiggy/applications`, {
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Returned invalid company applications list');
  });

  // 5. Test Resume Upload
  await assertTest('Resume Upload Endpoint', async () => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="test_resume.pdf"\r\n` +
      `Content-Type: application/pdf\r\n\r\n` +
      `%PDF-1.4 mock content\r\n` +
      `--${boundary}--\r\n`;

    const res = await fetch(`${API_BASE}/users/${testUserId}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${testUserToken}`
      },
      body: body
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Status ${res.status}: ${text}`);
    }
    const data = await res.json();
    if (data.fileName !== 'test_resume.pdf') throw new Error(`Expected test_resume.pdf, got ${data.fileName}`);
  });

  // 6. Test Resume Download
  await assertTest('Resume Download Endpoint', async () => {
    const res = await fetch(`${API_BASE}/users/${testUserId}/resume`, {
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const blob = await res.blob();
    if (blob.type !== 'application/pdf') throw new Error(`Expected PDF file, got ${blob.type}`);
  });

  console.log(`\n${colors.bold}${colors.cyan}--- TEST SUITE SUMMARY ---${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(`${colors.bold}${colors.green}🎉 All new endpoints successfully validated!${colors.reset}\n`);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
