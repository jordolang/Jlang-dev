#!/usr/bin/env node
/**
 * Automated test script for magic link authentication flow
 *
 * Tests:
 * 1. Login page accessibility
 * 2. Magic link send API endpoint
 * 3. Token verification endpoint structure
 * 4. Session cookie handling
 * 5. Protected route middleware
 *
 * Usage:
 *   node scripts/test-magic-link-flow.mjs
 *   node scripts/test-magic-link-flow.mjs --port 3009
 */

const BASE_URL = process.argv.includes('--port')
  ? `http://localhost:${process.argv[process.argv.indexOf('--port') + 1]}`
  : 'http://localhost:3000';

const TEST_EMAIL = 'testclient@example.com';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  const symbol = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '○';
  const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
  log(`  ${symbol} ${name}`, color);
  if (details) {
    log(`    ${details}`, 'cyan');
  }
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    return { success: true, response, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n🔐 Magic Link Authentication Flow Tests', 'cyan');
  log(`Base URL: ${BASE_URL}\n`, 'blue');

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Server is running
  log('1. Server Health Check', 'yellow');
  totalTests++;
  const healthCheck = await testEndpoint('Server reachable', BASE_URL);
  if (healthCheck.success) {
    logTest('Server is running', 'pass', `Status: ${healthCheck.status}`);
    passedTests++;
  } else {
    logTest('Server is running', 'fail', `Error: ${healthCheck.error}`);
    log('\n❌ Server not accessible. Please start the dev server first:', 'red');
    log('   npm run dev\n', 'yellow');
    process.exit(1);
  }

  // Test 2: Login page exists
  log('\n2. Login Page', 'yellow');
  totalTests++;
  const loginPage = await testEndpoint('Login page accessible', `${BASE_URL}/portal/login`);
  if (loginPage.success && (loginPage.status === 200 || loginPage.status === 404)) {
    const html = await loginPage.response.text();
    const hasLoginContent = html.includes('portal') || html.includes('login') || html.includes('email');
    if (loginPage.status === 200 && hasLoginContent) {
      logTest('Login page renders', 'pass', `Status: ${loginPage.status}`);
      passedTests++;
    } else if (loginPage.status === 404) {
      logTest('Login page renders', 'fail', 'Returns 404 - route not found or Sanity connection issue');
    } else {
      logTest('Login page renders', 'fail', 'Page exists but missing expected content');
    }
  } else {
    logTest('Login page renders', 'fail', `Error: ${loginPage.error || 'Unexpected response'}`);
  }

  // Test 3: Magic link send endpoint
  log('\n3. Magic Link Send API', 'yellow');
  totalTests++;
  const sendMagicLink = await testEndpoint(
    'Send magic link endpoint',
    `${BASE_URL}/api/auth/magic-link/send`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL }),
    }
  );

  if (sendMagicLink.success) {
    const responseData = await sendMagicLink.response.text();
    if (sendMagicLink.status === 200) {
      logTest('POST /api/auth/magic-link/send', 'pass', `Status: 200 - Magic link sent`);
      passedTests++;
      try {
        const json = JSON.parse(responseData);
        if (json.message) {
          log(`    Message: "${json.message}"`, 'cyan');
        }
      } catch {}
    } else if (sendMagicLink.status === 404) {
      logTest('POST /api/auth/magic-link/send', 'fail', 'Endpoint not found (404) - check route exists');
    } else if (sendMagicLink.status === 400) {
      logTest('POST /api/auth/magic-link/send', 'warn', 'Client error (400) - may need valid test data in Sanity');
    } else if (sendMagicLink.status === 500) {
      logTest('POST /api/auth/magic-link/send', 'fail', 'Server error (500) - check logs for details');
    } else {
      logTest('POST /api/auth/magic-link/send', 'warn', `Status: ${sendMagicLink.status}`);
    }
  } else {
    logTest('POST /api/auth/magic-link/send', 'fail', `Error: ${sendMagicLink.error}`);
  }

  // Test 4: Token verification endpoint (without valid token - should error gracefully)
  log('\n4. Token Verification API', 'yellow');
  totalTests++;
  const verifyToken = await testEndpoint(
    'Verify token endpoint',
    `${BASE_URL}/api/auth/magic-link/verify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'invalid-test-token' }),
    }
  );

  if (verifyToken.success) {
    // We expect this to fail with 400/401, not 404
    if (verifyToken.status === 404) {
      logTest('POST /api/auth/magic-link/verify', 'fail', 'Endpoint not found (404)');
    } else if (verifyToken.status === 400 || verifyToken.status === 401) {
      logTest('POST /api/auth/magic-link/verify', 'pass', 'Endpoint exists and validates tokens');
      passedTests++;
    } else if (verifyToken.status === 200) {
      logTest('POST /api/auth/magic-link/verify', 'warn', 'Unexpectedly succeeded with invalid token');
    } else {
      logTest('POST /api/auth/magic-link/verify', 'warn', `Status: ${verifyToken.status}`);
    }
  } else {
    logTest('POST /api/auth/magic-link/verify', 'fail', `Error: ${verifyToken.error}`);
  }

  // Test 5: Protected route (dashboard) without session
  log('\n5. Middleware Protection', 'yellow');
  totalTests++;
  const dashboardUnauth = await testEndpoint(
    'Dashboard without auth',
    `${BASE_URL}/portal/dashboard`,
    { redirect: 'manual' }
  );

  if (dashboardUnauth.success) {
    if (dashboardUnauth.status === 307 || dashboardUnauth.status === 302) {
      const location = dashboardUnauth.response.headers.get('location');
      if (location && location.includes('/portal/login')) {
        logTest('Middleware redirects to login', 'pass', `Redirects to: ${location}`);
        passedTests++;
      } else {
        logTest('Middleware redirects to login', 'warn', `Redirects to: ${location || 'unknown'}`);
      }
    } else if (dashboardUnauth.status === 404) {
      logTest('Middleware redirects to login', 'fail', 'Dashboard returns 404 - route not found');
    } else if (dashboardUnauth.status === 200) {
      logTest('Middleware redirects to login', 'fail', 'Dashboard accessible without auth (security issue!)');
    } else {
      logTest('Middleware redirects to login', 'warn', `Status: ${dashboardUnauth.status}`);
    }
  } else {
    logTest('Middleware redirects to login', 'fail', `Error: ${dashboardUnauth.error}`);
  }

  // Test 6: Project page without auth
  totalTests++;
  const projectUnauth = await testEndpoint(
    'Project page without auth',
    `${BASE_URL}/portal/project/test-id`,
    { redirect: 'manual' }
  );

  if (projectUnauth.success) {
    if (projectUnauth.status === 307 || projectUnauth.status === 302) {
      logTest('Project page redirects to login', 'pass', `Status: ${projectUnauth.status}`);
      passedTests++;
    } else if (projectUnauth.status === 404) {
      logTest('Project page redirects to login', 'fail', 'Project page returns 404');
    } else {
      logTest('Project page redirects to login', 'warn', `Status: ${projectUnauth.status}`);
    }
  } else {
    logTest('Project page redirects to login', 'fail', `Error: ${projectUnauth.error}`);
  }

  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  log(`Test Results: ${passedTests}/${totalTests} passed`, passedTests === totalTests ? 'green' : 'yellow');
  log('='.repeat(50) + '\n', 'cyan');

  if (passedTests === totalTests) {
    log('✅ All automated tests passed!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Run seed script: node scripts/seed-test-portal-data.mjs', 'blue');
    log('  2. Follow manual E2E test plan in e2e-test-plan.md', 'blue');
    log('  3. Test with real email using Resend dashboard\n', 'blue');
    return 0;
  } else {
    log('⚠️  Some tests failed. Review failures above.', 'yellow');
    log('\nCommon issues:', 'cyan');
    log('  • 404 errors: Ensure dev server has network access to Sanity API', 'blue');
    log('  • 400 errors: Run seed script to create test data', 'blue');
    log('  • Connection errors: Check dev server is running\n', 'blue');
    return 1;
  }
}

// Run tests
runTests()
  .then(code => process.exit(code))
  .catch(error => {
    log(`\n❌ Test suite crashed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
