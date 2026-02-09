/**
 * Shared secret patterns for Zohar skill
 * Used by both memory-archaeology.js and test-redaction.js
 * 
 * IMPORTANT: When adding new patterns, also add tests in test-redaction.js
 */

const SECRET_PATTERNS = [
  // Generic API keys (format: prefix_hexhash)
  /[a-z0-9_]+_[a-f0-9]{40,}/gi,
  
  // Bearer tokens
  /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/gi,
  
  // Password declarations
  /password[:\s=]+[^\s]+/gi,
  
  // API key declarations
  /api[_\s]?key[:\s=]+[^\s]+/gi,
  
  // Generic token declarations
  /token[:\s=]+[^\s]+/gi,
  
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // URLs with auth params
  /https?:\/\/[^\s]*[?&](key|token|auth|secret|password)=[^\s&]+/gi,
  
  // AWS
  /AKIA[0-9A-Z]{16}/g,  // AWS Access Key ID
  /(?:aws_secret_access_key|aws_session_token)[:\s=]+[A-Za-z0-9\/+=]+/gi,
  
  // SSH/RSA Private Keys
  /-----BEGIN[A-Z ]+PRIVATE KEY-----/g,
  
  // GitHub tokens
  /ghp_[a-zA-Z0-9]{36}/g,  // Personal Access Token
  /gho_[a-zA-Z0-9]{36}/g,  // OAuth Token
  /ghs_[a-zA-Z0-9]{36}/g,  // Server Token
  /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g,  // Fine-grained PAT
  
  // Database URLs with credentials
  /(?:postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@[^\s]+/gi,
  
  // Stripe
  /sk_live_[a-zA-Z0-9]{24,}/g,  // Secret Key
  /pk_live_[a-zA-Z0-9]{24,}/g,  // Publishable Key
  /rk_live_[a-zA-Z0-9]{24,}/g,  // Restricted Key
  
  // JWT tokens (simplified to reduce ReDoS risk)
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
  
  // SendGrid
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
  
  // Slack tokens
  /xox[baprs]-[a-zA-Z0-9-]+/g,
  
  // OpenAI API keys
  /sk-[a-zA-Z0-9]{48}/g,  // Legacy format
  /sk-proj-[a-zA-Z0-9-_]{80,}/gi,  // Project-scoped
  
  // Anthropic API keys
  /sk-ant-[a-zA-Z0-9-_]{80,}/gi,
  
  // Discord tokens
  /[MN][a-zA-Z0-9_-]{23,}\.[a-zA-Z0-9_-]{6}\.[a-zA-Z0-9_-]{27,}/g,
  
  // npm tokens
  /npm_[a-zA-Z0-9]{36}/g,
  
  // Google Cloud API keys
  /AIza[a-zA-Z0-9_-]{35}/g,
  
  // Twilio
  /AC[a-f0-9]{32}/g,  // Account SID
  /SK[a-f0-9]{32}/g,  // API Key SID
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

function redactSecrets(text) {
  let redacted = text;
  SECRET_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}

module.exports = {
  SECRET_PATTERNS,
  MAX_FILE_SIZE,
  redactSecrets
};
