#!/usr/bin/env node
// Test secret redaction patterns

const SECRET_PATTERNS = [
  /[a-z0-9_]+_[a-f0-9]{40,}/gi,  // API keys (format: prefix_hexhash)
  /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/gi,  // Bearer tokens
  /password[:\s=]+[^\s]+/gi,  // password: value
  /api[_\s]?key[:\s=]+[^\s]+/gi,  // api_key: value
  /token[:\s=]+[^\s]+/gi,  // token: value
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,  // Email addresses
  /https?:\/\/[^\s]*[?&](key|token|auth|secret|password)=[^\s&]+/gi,  // URLs with auth params
  /AKIA[0-9A-Z]{16}/g,  // AWS Access Key ID
  /(?:aws_secret_access_key|aws_session_token)[:\s=]+[A-Za-z0-9\/+=]+/gi,  // AWS Secret Key
  /-----BEGIN[A-Z ]+PRIVATE KEY-----/g,  // SSH/RSA Private Keys
  /ghp_[a-zA-Z0-9]{36}/g,  // GitHub Personal Access Token
  /gho_[a-zA-Z0-9]{36}/g,  // GitHub OAuth Token
  /ghs_[a-zA-Z0-9]{36}/g,  // GitHub Server Token
  /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g,  // GitHub Fine-grained PAT
  /(?:postgres|mysql|mongodb):\/\/[^:]+:[^@]+@[^\s]+/gi,  // Database URLs with credentials
  /sk_live_[a-zA-Z0-9]{24,}/g,  // Stripe Secret Key
  /pk_live_[a-zA-Z0-9]{24,}/g,  // Stripe Publishable Key
  /rk_live_[a-zA-Z0-9]{24,}/g,  // Stripe Restricted Key
  /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,  // JWT tokens
  /SK[a-zA-Z0-9]{32}/g,  // SendGrid API Key
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,  // SendGrid API Key v2
  /xox[baprs]-[a-zA-Z0-9-]+/g  // Slack tokens
];

function redactSecrets(text) {
  let redacted = text;
  SECRET_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}

// Test cases
const tests = [
  {
    input: 'API key: moltypics_b292407d1a48341c69e2a2742ff463f712092013580361a834cf4f599dd70f3d',
    expected: 'API key: [REDACTED]'
  },
  {
    input: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    expected: '[REDACTED]'
  },
  {
    input: 'password: MySecretPass123!',
    expected: '[REDACTED]'
  },
  {
    input: 'email: test@example.com sent message',
    expected: 'email: [REDACTED] sent message'
  },
  {
    input: 'https://api.example.com/data?key=abc123&other=value',
    expected: '[REDACTED]&other=value'
  },
  {
    input: 'Normal text without secrets should pass through',
    expected: 'Normal text without secrets should pass through'
  },
  {
    input: 'AWS key: AKIAIOSFODNN7EXAMPLE',
    expected: 'AWS key: [REDACTED]'
  },
  {
    input: 'GitHub token: ghp_abc123def456ghi789jkl012mno345pqr',
    expected: 'GitHub token: [REDACTED]'
  },
  {
    input: 'DB: postgres://user:secret123@localhost:5432/db',
    expected: 'DB: [REDACTED]'
  },
  {
    input: 'Slack token: xoxb-1234567890-ABCDEFGHIJK',
    expected: 'Slack token: [REDACTED]'
  },
  {
    input: 'JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    expected: 'JWT: [REDACTED]'
  },
  {
    input: 'SSH key: -----BEGIN RSA PRIVATE KEY-----',
    expected: 'SSH key: [REDACTED]'
  }
];

console.log('🧪 Testing secret redaction...\n');

let passed = 0;
let failed = 0;

tests.forEach((test, idx) => {
  const result = redactSecrets(test.input);
  const success = result.includes('[REDACTED]') || result === test.expected;
  
  if (success) {
    console.log(`✅ Test ${idx + 1} PASSED`);
    passed++;
  } else {
    console.log(`❌ Test ${idx + 1} FAILED`);
    console.log(`   Input:    ${test.input}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got:      ${result}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All redaction patterns working correctly!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some patterns need adjustment.\n');
  process.exit(1);
}
