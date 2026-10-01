#!/usr/bin/env node
/**
 * Automated test script for message posting and notification flow
 *
 * Tests:
 * 1. Messages API endpoint accessibility
 * 2. POST message endpoint validation
 * 3. GET messages endpoint
 * 4. Webhook endpoint structure
 * 5. Message validation rules
 * 6. Authorization checks
 *
 * Usage:
 *   node scripts/test-messaging-flow.mjs
 *   node scripts/test-messaging-flow.mjs --port 3009
 */

const BASE_URL = process.argv.includes('--port')
  ? `http://localhost:${process.argv[process.argv.indexOf('--port') + 1]}`
  : 'http://localhost:3000';

const TEST_CLIENT_PROJECT_ID = 'test-project-id'; // Replace with actual ID after seeding

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
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
  log('\n════════════════════════════════════════════════════════════', 'bold');
  log('  Message Posting & Notification Flow - Automated Tests', 'cyan');
  log('════════════════════════════════════════════════════════════\n', 'bold');

  log(`Testing against: ${BASE_URL}\n`, 'blue');

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Server Health Check
  log('Test 1: Server Health Check', 'bold');
  {
    const { success, response, error } = await testEndpoint(
      'Server running',
      BASE_URL,
    );
    totalTests++;
    if (success && response?.ok) {
      logTest('Server is running and responding', 'pass', `Status: ${response.status}`);
      passedTests++;
    } else {
      logTest('Server health check', 'fail', error || `Status: ${response?.status}`);
      log('\n⚠️  Server is not running. Start with: npm run dev\n', 'yellow');
      return;
    }
  }

  // Test 2: Messages API Endpoint - Unauthorized Access
  log('\nTest 2: Messages API - Authorization', 'bold');
  {
    const { success, response } = await testEndpoint(
      'GET without auth',
      `${BASE_URL}/api/portal/messages?clientProjectId=${TEST_CLIENT_PROJECT_ID}`,
    );
    totalTests++;
    if (success && response?.status === 401) {
      logTest('Rejects unauthenticated GET request', 'pass', 'Returns 401 Unauthorized');
      passedTests++;
    } else {
      logTest('Authorization check', 'fail', `Expected 401, got ${response?.status}`);
    }
  }

  {
    const { success, response } = await testEndpoint(
      'POST without auth',
      `${BASE_URL}/api/portal/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientProjectId: TEST_CLIENT_PROJECT_ID,
          message: 'Test message',
        }),
      }
    );
    totalTests++;
    if (success && response?.status === 401) {
      logTest('Rejects unauthenticated POST request', 'pass', 'Returns 401 Unauthorized');
      passedTests++;
    } else {
      logTest('Authorization check', 'fail', `Expected 401, got ${response?.status}`);
    }
  }

  // Test 3: Messages API Validation
  log('\nTest 3: Messages API - Input Validation', 'bold');
  {
    // Note: These tests will return 401 without auth, but we're testing the endpoint structure exists
    log('  ℹ️  Validation tests require authentication (401 expected)', 'cyan');

    const testCases = [
      {
        name: 'Missing clientProjectId',
        body: { message: 'Test' },
        expectedStatus: [400, 401], // 401 if auth checked first, 400 if validation first
      },
      {
        name: 'Empty message',
        body: { clientProjectId: TEST_CLIENT_PROJECT_ID, message: '' },
        expectedStatus: [400, 401],
      },
      {
        name: 'Message too long',
        body: {
          clientProjectId: TEST_CLIENT_PROJECT_ID,
          message: 'a'.repeat(5001) // > 5000 chars
        },
        expectedStatus: [400, 401],
      },
    ];

    for (const testCase of testCases) {
      const { success, response } = await testEndpoint(
        testCase.name,
        `${BASE_URL}/api/portal/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.body),
        }
      );
      totalTests++;
      if (success && testCase.expectedStatus.includes(response?.status)) {
        logTest(`Validation: ${testCase.name}`, 'pass', `Status: ${response.status}`);
        passedTests++;
      } else {
        logTest(`Validation: ${testCase.name}`, 'fail',
          `Expected ${testCase.expectedStatus.join(' or ')}, got ${response?.status}`);
      }
    }
  }

  // Test 4: Project Update Webhook Endpoint
  log('\nTest 4: Project Update Webhook', 'bold');
  {
    const { success, response } = await testEndpoint(
      'Webhook without secret',
      `${BASE_URL}/api/webhooks/sanity/project-update`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _type: 'clientProject',
          _id: 'test',
          client: { _ref: 'test-client' },
          project: { _ref: 'test-project' },
          status: 'active',
        }),
      }
    );
    totalTests++;
    if (success && response?.status === 401) {
      logTest('Webhook rejects unauthorized requests', 'pass', 'Returns 401 without webhook secret');
      passedTests++;
    } else {
      logTest('Webhook authorization', 'fail', `Expected 401, got ${response?.status}`);
    }
  }

  {
    const { success, response } = await testEndpoint(
      'Webhook with invalid secret',
      `${BASE_URL}/api/webhooks/sanity/project-update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-secret-12345',
        },
        body: JSON.stringify({
          _type: 'clientProject',
          _id: 'test',
        }),
      }
    );
    totalTests++;
    if (success && response?.status === 401) {
      logTest('Webhook validates secret', 'pass', 'Returns 401 with invalid secret');
      passedTests++;
    } else {
      logTest('Webhook secret validation', 'fail', `Expected 401, got ${response?.status}`);
    }
  }

  // Test 5: Route Existence Check
  log('\nTest 5: Route Existence', 'bold');
  {
    const routes = [
      { path: '/api/portal/messages', method: 'GET' },
      { path: '/api/portal/messages', method: 'POST' },
      { path: '/api/webhooks/sanity/project-update', method: 'POST' },
    ];

    for (const route of routes) {
      const { success, response } = await testEndpoint(
        `${route.method} ${route.path}`,
        `${BASE_URL}${route.path}`,
        { method: route.method }
      );
      totalTests++;
      // Routes exist if they return 401 (auth required) or 400 (validation error), not 404
      if (success && response?.status !== 404) {
        logTest(`Route exists: ${route.method} ${route.path}`, 'pass',
          `Status: ${response.status} (${response.status === 401 ? 'auth required' : 'validation'})`);
        passedTests++;
      } else {
        logTest(`Route exists: ${route.method} ${route.path}`, 'fail',
          response?.status === 404 ? 'Route not found (404)' : `Status: ${response?.status}`);
      }
    }
  }

  // Test 6: Message Thread Integration
  log('\nTest 6: Frontend Integration', 'bold');
  {
    log('  ℹ️  Testing that project pages load correctly', 'cyan');

    // This will likely return login redirect, but tests that the route exists
    const { success, response } = await testEndpoint(
      'Project page route',
      `${BASE_URL}/portal/project/test-id`,
    );
    totalTests++;
    if (success && (response?.ok || response?.status === 307 || response?.status === 302)) {
      logTest('Project page route exists', 'pass',
        response.ok ? 'Page loads' : `Redirects to auth (${response.status})`);
      passedTests++;
    } else {
      logTest('Project page route', 'fail', `Status: ${response?.status}`);
    }
  }

  // Summary
  log('\n════════════════════════════════════════════════════════════', 'bold');
  log('  Test Summary', 'cyan');
  log('════════════════════════════════════════════════════════════', 'bold');

  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  log(`\nPassed: ${passedTests}/${totalTests} (${successRate}%)\n`,
    passedTests === totalTests ? 'green' : passedTests > totalTests * 0.7 ? 'yellow' : 'red');

  if (passedTests === totalTests) {
    log('✅ All automated tests passed!\n', 'green');
    log('Next steps:', 'cyan');
    log('  1. Run manual E2E tests from e2e-test-plan-messaging.md', 'reset');
    log('  2. Test with authenticated session cookie', 'reset');
    log('  3. Verify email delivery via Resend dashboard', 'reset');
    log('  4. Test full integration flow\n', 'reset');
  } else if (passedTests > totalTests * 0.7) {
    log('⚠️  Most tests passed, but some require attention\n', 'yellow');
    log('Review failed tests and:', 'cyan');
    log('  - Ensure dev server is running with network access', 'reset');
    log('  - Check Sanity configuration', 'reset');
    log('  - Verify environment variables\n', 'reset');
  } else {
    log('❌ Multiple test failures detected\n', 'red');
    log('Troubleshooting:', 'cyan');
    log('  - Is the dev server running? (npm run dev)', 'reset');
    log('  - Are required environment variables set?', 'reset');
    log('  - Check server logs for errors\n', 'reset');
  }

  log('For complete testing, follow: e2e-test-plan-messaging.md\n', 'blue');
  if (passedTests !== totalTests) process.exitCode = 1;
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test runner error: ${error.message}\n`, 'red');
  process.exit(1);
});
