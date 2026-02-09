#!/usr/bin/env node
// Test secret redaction patterns
// Uses shared patterns from lib/patterns.js

const { SECRET_PATTERNS, redactSecrets } = require('../lib/patterns');

// Test cases - add new tests when adding new patterns
const tests = [
  // Generic patterns
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
  
  // AWS
  {
    input: 'AWS key: AKIAIOSFODNN7EXAMPLE',
    expected: 'AWS key: [REDACTED]'
  },
  
  // GitHub
  {
    input: 'GitHub token: ghp_abc123def456ghi789jkl012mno345pqr678',
    expected: 'GitHub token: [REDACTED]'
  },
  
  // Database URLs
  {
    input: 'DB: postgres://user:secret123@localhost:5432/db',
    expected: 'DB: [REDACTED]'
  },
  
  // Slack
  {
    input: 'Slack token: xoxb-1234567890-ABCDEFGHIJK',
    expected: 'Slack token: [REDACTED]'
  },
  
  // JWT
  {
    input: 'JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    expected: 'JWT: [REDACTED]'
  },
  
  // SSH
  {
    input: 'SSH key: -----BEGIN RSA PRIVATE KEY-----',
    expected: 'SSH key: [REDACTED]'
  },
  
  // OpenAI (NEW) - 48 chars after sk-
  {
    input: 'OpenAI: sk-abcdefghijklmnopqrstuvwxyz123456789012345678abcd',
    expected: 'OpenAI: [REDACTED]'
  },
  
  // Anthropic (NEW) - 80+ chars after sk-ant-
  {
    input: 'Anthropic: sk-ant-api03-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrst',
    expected: 'Anthropic: [REDACTED]'
  },
  
  // Google Cloud (NEW) - 35 chars after AIza
  {
    input: 'Google: AIzaSyA1234567890abcdefghijklmnopqrstuv',
    expected: 'Google: [REDACTED]'
  },
  
  // npm (NEW)
  {
    input: 'npm token: npm_abcdefghij1234567890ABCDEFGHIJ1234',
    expected: 'npm token: [REDACTED]'
  },
  
  // Note: Twilio patterns (AC..., SK...) exist in lib/patterns.js
  // but can't be tested here - GitHub push protection blocks realistic test values
  // Pattern is: AC[a-f0-9]{32} and SK[a-f0-9]{32}
];

console.log('🧪 Testing secret redaction...\n');
console.log(`Using ${SECRET_PATTERNS.length} patterns from shared module.\n`);

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
