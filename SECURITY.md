# Security Policy

## Reporting a vulnerability

Please do **not** open a public issue. Use GitHub's private vulnerability
reporting ("Security" → "Advisories" → "Report a vulnerability") for this
repository. Include affected versions, reproduction steps, and impact. Do not
include real credentials, visitor messages, or personal data in reports.

## Secrets policy

- Never commit SMTP credentials, tokens, or `.env*` files other than
  `.env.example`.
- `.env`, `.env.local`, and other environment files are ignored by Git.
- Secrets belong in deployment-managed environment variables and must be
  rotated immediately if exposure is suspected.
- Client bundles must never receive server-only values. Mail configuration is
  read only inside `pages/api/send.js` and `lib/mailer.js`.

### Known incident requiring maintainer action

A previous revision of `pages/api/send.js` contained a plaintext SMTP
credential, and that value remains in Git history. The working tree no longer
contains it, but **removing the string is not remediation**. The maintainer must:

1. Revoke and rotate the credential at the mail provider.
2. Update the secret in every deployment environment.
3. Verify the old credential is rejected.
4. Review mailbox/SMTP activity for misuse.
5. Decide on coordinated history cleanup after rotation and collaborator
   coordination.

See the runbook for the full procedure and evidence requirements.

## Supported versions

This repository tracks the latest patched stable Next.js and React releases.
Node.js 24 (active LTS) is pinned in `.nvmrc` and `package.json`.

## Dependency and vulnerability management

- Dependabot is configured for npm and GitHub Actions (`.github/dependabot.yml`).
- CI runs `npm run audit:check`; unresolved critical/high advisories block the
  gate.
- Exceptions must be recorded in `security/audit-exceptions.json` with an
  owner, justification, reachability assessment, and an expiry date. Expired or
  incomplete exceptions fail the gate.
- Review dependency advisories at least monthly and on any framework advisory.
