# Tanmay Patil — Portfolio (Next.js)

A Pages Router portfolio built with Next.js, React, Tailwind CSS, Framer Motion,
Swiper, and tsParticles, with a hardened contact endpoint, automated tests, and
security gates.

Every valid contact request is stored as a new `.txt` file in a GitHub
repository through the GitHub Contents API. No email provider or mailbox
credentials are used.

## Requirements

- Node.js 24 (see `.nvmrc`); `package.json` enforces `>=24 <25`.
- npm 11 or newer.
- For real uploads: a GitHub repository (preferably private) and a PAT with
  `contents:write` on that repository.

## Setup

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

The checked-out local configuration uses `CONTACT_STORE=json`, so the contact
form works without a GitHub token and **does not write anywhere**.

To test a real GitHub upload, set these in `.env.local`:

```env
CONTACT_STORE=github
repo_name=owner/private-contacts
git_pat_token=your_token
```

Then run:

```bash
npm run contact:check -- --send
```

or submit the contact form. The command prints the created file path and URL.

### What gets stored

Each valid request creates one file:

```text
contacts/YYYY-MM-DD/<request-uuid>.txt
```

The file contains the request ID, timestamp, validated name, email, subject,
service, and message. The filename never contains visitor PII. The commit
message contains only the request ID.

### Local env precedence

Next.js loads `.env` first and then `.env.local`; `.env.local` wins for duplicate
keys. `.env.example` is the committed template. The local `.env` is a template,
and `.env.local` selects the test store by default.

On Vercel, neither file is uploaded. Dashboard variables are injected as
`process.env` for the selected environment.

## Scripts

| Script                        | Purpose                                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`                 | Start the development server.                                             |
| `npm run build`               | Production build.                                                         |
| `npm run build:clean`         | Delete `.next` and run a fresh production build.                          |
| `npm run clean`               | Delete the `.next` build output.                                          |
| `npm run start`               | Start the production server (requires a build).                           |
| `npm run lint`                | ESLint 9 flat config via the direct CLI.                                  |
| `npm run lint:fix`            | Apply ESLint fixes.                                                       |
| `npm test`                    | Vitest unit and component tests (mocked GitHub transport).                |
| `npm run test:watch`          | Vitest in watch mode.                                                     |
| `npm run test:e2e:install`    | Install Playwright browsers and system dependencies.                      |
| `npm run test:e2e`            | Chromium, Firefox, and WebKit E2E, accessibility, and visual tests.       |
| `npm run test:e2e:update`     | Regenerate reviewed visual snapshots.                                     |
| `npm run test:bundle`         | Enforce the 10% per-route bundle budget.                                  |
| `npm run test:bundle:update`  | Approve a reviewed bundle baseline change.                                |
| `npm run perf:measure`        | Compare production Web Vitals against `scripts/web-vitals-baseline.json`. |
| `npm run perf:measure:update` | Record a reviewed Web Vitals baseline against a running server.           |
| `npm run contact:check`       | Validate contact storage; add `-- --send` to create a test file.          |
| `npm run audit:a11y`          | Axe audit against a running server on port 3100.                          |
| `npm run audit:check`         | Fail on unresolved critical/high npm advisories (full and production).    |
| `npm run verify`              | Lint, unit tests, build, bundle budget, and audit gate.                   |

`contact:check` loads `.env` then `.env.local` (the local file wins) and falls
back to process environment variables, matching how Next.js and Vercel provide
configuration.

End-to-end, performance, and accessibility audits expect a production server.
Playwright starts one automatically on port 3100. For the standalone audit
scripts:

```bash
npm run build
npm run start -- --port 3100
# in another terminal
npm run audit:a11y
npm run perf:measure
```

## Deployment

All variables below are server-only. There are no `NEXT_PUBLIC_*` values.

### Required variables

| Variable        | Example                  | Notes                                                          |
| --------------- | ------------------------ | -------------------------------------------------------------- |
| `repo_name`     | `owner/private-contacts` | `owner/repository`. Use a private repository for contact data. |
| `git_pat_token` | `github_pat_...`         | PAT with `contents:write` on that repository only.             |

`CONTACT_STORE` defaults to `github`. Do not set it to `json` in production.

### Recommended and optional variables

| Variable                              | Example / default         | Notes                                          |
| ------------------------------------- | ------------------------- | ---------------------------------------------- |
| `CONTACT_ALLOWED_ORIGINS`             | `https://your-domain.com` | Comma-separated; defaults to the request host. |
| `CSP_REPORT_ONLY`                     | `true` then unset         | Use report-only in staging, then enforce.      |
| `CONTACT_RATE_LIMIT_MAX`              | `5`                       | Requests per IP per window.                    |
| `CONTACT_RATE_LIMIT_WINDOW_MS`        | `60000`                   | Per-IP window in milliseconds.                 |
| `CONTACT_GLOBAL_RATE_LIMIT_MAX`       | `60`                      | Instance-wide requests per window.             |
| `CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS` | `60000`                   | Instance-wide window in milliseconds.          |
| `CONTACT_BODY_LIMIT_BYTES`            | `16384`                   | Maximum request body; capped at 64 KiB.        |

### Vercel setup

1. Project → Settings → General → Node.js Version → **24.x**.
2. Project → Settings → Environment Variables:
   - Add `repo_name` and `git_pat_token` for the environment you are deploying.
   - Mark `git_pat_token` as **Sensitive**.
3. Redeploy after adding or changing variables.
4. Submit the contact form and confirm a new file appears in the repository.

Sensitive variables are injected as ordinary `process.env` values at runtime, so
no code change is needed. Preview deployments need their own variables if you
want uploads to work there too.

### GitHub token setup

Prefer a **fine-grained personal access token** restricted to the contact
repository:

- Repository access: only the contact repository.
- Permissions: **Contents: Read and write**.
- No administration, issues, pull requests, or other repository permissions.
- Set an expiry and rotate it if exposed.

### Privacy

Contact files contain visitor names, email addresses, subjects, and messages.
Use a **private repository**, restrict collaborators, and define a retention or
deletion process. The application does not log file contents or the PAT.

## Documentation

- [Architecture, upgrade decisions, and performance roadmap](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/architecture-upgrade-and-roadmap.md)
- [Upgrade and operations runbook](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/upgrade-runbook.md)
- [Baseline and verification evidence](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/evidence/baseline.md)
- [Implementation status and manual follow-ups](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/implementation-status.md)

## Troubleshooting

- **`/api/send` or a page returns 404 after a build:** the incremental `.next`
  output can be stale. Run `npm run build:clean` and start the server again.
- **Contact form returns a generic unavailable error:** check `repo_name` and
  `git_pat_token` are set and valid, then run `npm run contact:check -- --send`.
- **Deployed contact form returns 503:** confirm the Vercel deployment is the
  environment you configured (Production vs Preview), that every variable is
  scoped to that environment, and that you redeployed after adding them.
  Function logs show safe fields (`provider`, `code`, `command`, `responseCode`)
  without the PAT or message content.
- **GitHub returns `EAUTH` / 401 or 403:** the token is invalid, expired, or
  lacks `contents:write` on the repository. Create a fine-grained token with only
  that permission on the contact repository.
- **GitHub returns 404:** the repository name is wrong or the token cannot see
  the repository. Use `owner/repository` exactly.
- **Values behave as if they are wrong:** remove surrounding quotes and trailing
  whitespace in the Vercel dashboard.
- **Build fails while fetching Sora:** allow `fonts.googleapis.com` and
  `fonts.gstatic.com`, or self-host the font later.

## Security

Do not open public issues for vulnerabilities. Follow [`SECURITY.md`](SECURITY.md).
