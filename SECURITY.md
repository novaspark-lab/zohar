# Security & Privacy

Zohar includes tools that read your memory files. Here's how we protect your data.

## Memory Archaeology Security

The `memory-archaeology.js` script scans your memory files and displays their content. We've implemented automatic protections:

### Automatic Secret Redaction

The following patterns are automatically redacted as `[REDACTED]`:

- **API keys** - Format: `prefix_hexhash` (e.g., `moltypics_abc123...`)
- **Bearer tokens** - `Bearer xyz...`
- **Passwords** - `password: value` or `password=value`
- **API key declarations** - `api_key: value`, `apiKey: value`
- **Generic tokens** - `token: value` or `token=value`
- **Email addresses** - `user@domain.com`
- **URLs with auth params** - `https://api.com/data?key=secret&...`

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

### If You Find a Security Issue

The archaeology tool's redaction patterns are tested, but not exhaustive. If you discover a secret that should be redacted but isn't:

1. **Don't share the example publicly** (it contains the secret!)
2. Open an issue at https://github.com/novaspark-lab/zohar with a *pattern* description
3. Or submit a PR adding the pattern to `SECRET_PATTERNS` array

## Testing Redaction

Run the test suite to verify redaction patterns work:

```bash
node scripts/test-redaction.js
```

All tests should pass. If they don't, something's broken.

---

**Remember:** Security tools reduce risk but don't eliminate it. Always review output before sharing, and treat your memory files as private unless you explicitly choose to make them public.
