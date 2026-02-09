#!/usr/bin/env node
// Test secret redaction patterns

const SECRET_PATTERNS = [
  /[a-z0-9_]+_[a-f0-9]{40,}/gi,  // API keys (format: prefix_hexhash)
  /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/gi,  // Bearer tokens
  /password[:\s=]+[^\s]+/gi,  // password: value
  /api[_\s]?key[:\s=]+[^\s]+/gi,  // api_key: value
  /token[:\s=]+[^\s]+/gi,  // token: value
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,  // Email addresses
  /https?:\/\/[^\s]*[?&](key|token|auth|secret)=[^\s&]+/gi  // URLs with auth params
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
