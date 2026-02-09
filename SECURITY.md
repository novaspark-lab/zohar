# Security & Privacy

Zohar includes tools that read your memory files. Here's how we protect your data.

## Threat Model

### What We Protect Against

✅ **Accidental Secret Exposure**
- User runs archaeology, shares output, doesn't notice API key in text
- **Mitigation:** Automatic redaction of 20+ secret patterns

✅ **Path Traversal**
- Malicious actor tries to scan files outside workspace
- **Mitigation:** Workspace validation before scanning

✅ **Unintended Data Processing**
- Script runs from wrong directory, scans random files
- **Mitigation:** Checks for `AGENTS.md`, `SOUL.md`, `memory/` before proceeding

✅ **Resource Exhaustion**
- Very large files cause memory issues or crashes
- **Mitigation:** 10MB file size limit, graceful skipping

### What We DON'T Protect Against

❌ **Sophisticated Encoding Attacks**
- Base64-encoded secrets may not be caught
- Unicode tricks, obfuscation techniques
- Hex-encoded values
- **Why:** Regex-based detection has fundamental limits

❌ **Context-Based Secret Inference**
- Even with key redacted, surrounding text might reveal what it's for
- Example: "Set OpenAI key to [REDACTED]" still reveals it's OpenAI
- **Mitigation:** User review before sharing

❌ **Malicious Fork Attacks**
- Anyone can fork repo, inject malicious code, distribute
- **Why:** Public domain license, no code signing
- **Mitigation:** Verify using official repo URL

❌ **Zero-Day Vulnerabilities**
- Unknown attack vectors we haven't considered
- **Why:** No formal security audit or penetration testing
- **Status:** Alpha software, use at own risk

❌ **Less Common Secret Formats**
- Private cloud API keys with unusual formats
- Custom authentication schemes
- Secrets in non-English text
- **Mitigation:** Review output before sharing

❌ **Timezone Edge Cases**
- Morning teaching rotates at UTC midnight, not local midnight
- Agent in UTC+8 gets new teaching at 8am local time
- **Status:** Known quirk, may fix in future version

### Trust Boundaries

**Trusted:**
- Your local filesystem
- Node.js built-in modules (`fs`, `path`)
- Your own memory files

**Untrusted:**
- User input (file paths validated)
- File contents (treated as potentially malicious)
- External forks of this repository

## Memory Archaeology Security

The `memory-archaeology.js` script scans your memory files and displays their content. We've implemented automatic protections:

### Automatic Secret Redaction

The following patterns are automatically redacted as `[REDACTED]`:

**Common Patterns:**
- **API keys** - Format: `prefix_hexhash` (e.g., `moltypics_abc123...`)
- **Bearer tokens** - `Bearer xyz...`
- **Passwords** - `password: value` or `password=value`
- **API key declarations** - `api_key: value`, `apiKey: value`
- **Generic tokens** - `token: value` or `token=value`
- **Email addresses** - `user@domain.com`
- **URLs with auth params** - `https://api.com/data?key=secret&...`

**Cloud Provider Secrets:**
- **AWS Access Keys** - `AKIA...`
- **AWS Secret Keys** - `aws_secret_access_key: ...`

**Version Control:**
- **GitHub Personal Access Tokens** - `ghp_...`
- **GitHub OAuth Tokens** - `gho_...`
- **GitHub Server Tokens** - `ghs_...`
- **GitHub Fine-grained PATs** - `github_pat_...`

**Databases:**
- **PostgreSQL URLs** - `postgres://user:pass@host/db`
- **MySQL URLs** - `mysql://user:pass@host/db`
- **MongoDB URLs** - `mongodb://user:pass@host/db`

**Payment Providers:**
- **Stripe Secret Keys** - `sk_live_...`
- **Stripe Publishable Keys** - `pk_live_...`
- **Stripe Restricted Keys** - `rk_live_...`

**Authentication:**
- **JWT Tokens** - `eyJ...` (JSON Web Tokens)
- **SSH Private Keys** - `-----BEGIN RSA PRIVATE KEY-----`

**Communication:**
- **SendGrid API Keys** - `SG....`
- **Slack Tokens** - `xoxb-...`, `xoxp-...`, etc.

**AI Providers:**
- **OpenAI API Keys** - `sk-...` (legacy), `sk-proj-...` (project-scoped)
- **Anthropic API Keys** - `sk-ant-...`

**Package Managers:**
- **npm Tokens** - `npm_...`

**Other Cloud Services:**
- **Google Cloud API Keys** - `AIza...`
- **Twilio Account SID** - `AC...`
- **Twilio API Key** - `SK...`
- **Redis URLs** - `redis://user:pass@host`

### File Size Limits

The archaeology tool will skip files larger than **10MB** to prevent:
- Memory exhaustion
- Long processing times
- Accidental processing of non-text files

Large files will show a warning and be skipped.

### Security Warnings

The archaeology tool displays a security notice before running, reminding you to:
- Review output carefully before sharing publicly
- Check that secrets are properly redacted
- Be aware that personal information may still be visible

### Workspace Validation

The script validates it's running in an OpenClaw workspace before scanning files. It will exit with an error if:
- No `memory/` directory found
- No `AGENTS.md` or `SOUL.md` present
- Running from an unexpected location

This prevents accidentally scanning unintended directories.

## Best Practices

### When Sharing Output

1. **Run the tool first, review output**
2. **Check for personal info** beyond secrets (names, locations, private details)
3. **Consider context** - redacted secrets may still be identifiable from surrounding text
4. **Use discretion** - not all archaeology reports need to be public

### Memory File Hygiene

**Do:**
- Log work, decisions, insights, patterns
- Document transformations and learnings
- Track artifacts and creations

**Don't:**
- Log raw API keys or passwords
- Include sensitive personal information you wouldn't share
- Store credentials in memory files (use `~/.openclaw/credentials/` instead)

### Vulnerability Disclosure Policy

### If You Find a Security Issue

The archaeology tool's redaction patterns are tested, but not exhaustive. If you discover a secret that should be redacted but isn't:

1. **Don't share the example publicly** (it contains the secret!)
2. Open an issue at https://github.com/novaspark-lab/zohar with a *pattern* description
3. Or submit a PR adding the pattern to `SECRET_PATTERNS` array

### Reporting Critical Vulnerabilities

For critical issues (RCE, data exfiltration, etc.):

1. **Do NOT open a public issue**
2. Contact via GitHub Security Advisories (preferred): https://github.com/novaspark-lab/zohar/security/advisories
3. Or open an issue titled "Security: [vague description]" and ask for private disclosure method
4. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### Response Timeline

This is an open-source project maintained by one developer. Response times:
- **Acknowledgment:** Within 7 days
- **Fix (if possible):** Within 30 days for critical, 90 days for non-critical
- **Disclosure:** After fix is deployed, or 90 days (whichever comes first)

### What Qualifies as a Security Issue?

**Yes:**
- Secret pattern bypass (secrets not being redacted)
- Path traversal allowing arbitrary file access
- Code execution vulnerabilities
- Memory/resource exhaustion attacks
- Authentication/authorization bypass

**No (by design or known limitations):**
- Public domain license allows malicious forks
- Best-effort redaction not catching all edge cases
- Manual code review showing "could be better"
- Missing features (not vulnerabilities)

## Testing Redaction

Run the test suite to verify redaction patterns work:

```bash
node scripts/test-redaction.js
```

All tests should pass. If they don't, something's broken.

---

**Remember:** Security tools reduce risk but don't eliminate it. Always review output before sharing, and treat your memory files as private unless you explicitly choose to make them public.
