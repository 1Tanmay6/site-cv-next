# Security Policy

## Reporting a vulnerability

Please do **not** open a public issue. Use GitHub's private vulnerability
reporting ("Security" → "Advisories" → "Report a vulnerability") for this
repository. Include affected versions, reproduction steps, and impact. Do not
include real credentials, visitor messages, or personal data in reports.

## Secrets policy

- Never commit SMTP credentials, provider API keys, tokens, or `.env*` files
  other than `.env.example`.
- `.env`, `.env.local`, and other environment files are ignored by Git.
- Secrets belong in deployment-managed environment variables and must be
  rotated immediately if exposure is suspected.
- Client bundles must never receive server-only values. Mail configuration is
  read only inside `pages/api/send.js` and `lib/contact-store.js`.

## Contact storage

Every valid contact request is stored as a new `.txt` file in a GitHub
repository. No mailbox password or provider API key is used.

- `repo_name` must be `owner/repository`; use a **private repository** because
  the files contain visitor names, email addresses, subjects, and messages.
- `git_pat_token` should be a fine-grained PAT with only **Contents: Read and
  write** on that repository, with an expiry. Mark it Sensitive in Vercel.
- The API logs only safe fields such as provider, error code, command, and
  response code. It never logs the PAT, visitor addresses, or message content.
- Define a retention/deletion process for contact files and repository history.
- Rotate the PAT on operator changes or suspected exposure.

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
