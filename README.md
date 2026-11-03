# Tanmay Patil — Portfolio (Next.js)

A Pages Router portfolio built with Next.js, React, Tailwind CSS, Framer Motion,
Swiper, and tsParticles, with a hardened contact endpoint, automated tests, and
security gates.

## Requirements

- Node.js 24 (see `.nvmrc`); `package.json` enforces `>=24 <25`.
- npm 11 or newer.

## Setup

```bash
npm ci
npm run mail:test-account   # local test mailbox, or create .env.local with your provider values
npm run dev
```

Open <http://localhost:3000>.

The contact form is disabled until `SMTP_*`, `MAIL_FROM`, and `MAIL_TO` are
configured. These variables are read only by `pages/api/send.js` and are never
exposed to the browser.

### Local email testing

To exercise the real contact-form delivery path without your production
credentials:

```bash
npm run mail:test-account
npm run dev
```

The command creates an ephemeral [Ethereal](https://ethereal.email) mailbox,
writes its credentials to `.env.local`, sends a connectivity test, and prints a
preview URL plus the inbox login. Submit the contact form, then open the
Ethereal inbox to read the message.

- If `.env.local` already exists, re-run with
  `npm run mail:test-account -- --force` to replace it.
- Ethereal mailboxes are temporary and for local testing only.
- If you only need to test the UI/API contract, set
  `CONTACT_MAIL_TRANSPORT=json` in `.env.local` instead. That returns success
  without sending mail and must never be used in production.

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
| `npm test`                    | Vitest unit and component tests (credential-free, mocked mail).           |
| `npm run test:watch`          | Vitest in watch mode.                                                     |
| `npm run test:e2e:install`    | Install Playwright browsers and system dependencies.                      |
| `npm run test:e2e`            | Chromium, Firefox, and WebKit E2E, accessibility, and visual tests.       |
| `npm run test:e2e:update`     | Regenerate reviewed visual snapshots.                                     |
| `npm run test:bundle`         | Enforce the 10% per-route bundle budget.                                  |
| `npm run test:bundle:update`  | Approve a reviewed bundle baseline change.                                |
| `npm run perf:measure`        | Compare production Web Vitals against `scripts/web-vitals-baseline.json`. |
| `npm run perf:measure:update` | Record a reviewed Web Vitals baseline against a running server.           |
| `npm run mail:test-account`   | Create `.env.local` with an ephemeral Ethereal test mailbox.              |
| `npm run audit:a11y`          | Axe audit against a running server on port 3100.                          |
| `npm run audit:check`         | Fail on unresolved critical/high npm advisories (full and production).    |
| `npm run verify`              | Lint, unit tests, build, bundle budget, and audit gate.                   |

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

### Required environment variables

Set these in the hosting platform's secret store for every environment
(local, preview, staging, production):

| Variable        | Example                 | Notes                              |
| --------------- | ----------------------- | ---------------------------------- |
| `SMTP_HOST`     | `smtp.example.com`      | Provider SMTP host.                |
| `SMTP_PORT`     | `587`                   | Use `465` for implicit TLS.        |
| `SMTP_USER`     | `portfolio@example.com` | Provider username.                 |
| `SMTP_PASSWORD` | `********`              | Provider password or app password. |
| `MAIL_FROM`     | `portfolio@example.com` | Must be allowed by the provider.   |
| `MAIL_TO`       | `owner@example.com`     | Where enquiries are delivered.     |

### Recommended environment variables

| Variable                  | Example                   | Notes                                                    |
| ------------------------- | ------------------------- | -------------------------------------------------------- |
| `SMTP_SECURE`             | `false`                   | Defaults to true only when the port is 465.              |
| `CONTACT_ALLOWED_ORIGINS` | `https://your-domain.com` | Comma-separated allowlist; defaults to the request host. |
| `CSP_REPORT_ONLY`         | `true` then unset         | Use report-only in staging, then enforce.                |

### Optional tuning

| Variable                              | Default | Notes                                   |
| ------------------------------------- | ------- | --------------------------------------- |
| `CONTACT_RATE_LIMIT_MAX`              | `5`     | Requests per IP per window.             |
| `CONTACT_RATE_LIMIT_WINDOW_MS`        | `60000` | Per-IP window in milliseconds.          |
| `CONTACT_GLOBAL_RATE_LIMIT_MAX`       | `60`    | Instance-wide requests per window.      |
| `CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS` | `60000` | Instance-wide window in milliseconds.   |
| `CONTACT_BODY_LIMIT_BYTES`            | `16384` | Maximum request body; capped at 64 KiB. |

**Never set `CONTACT_MAIL_TRANSPORT=json` in production.** There are no
`NEXT_PUBLIC_*` variables; every value above is server-only.

### Deployment checklist

- Use a Node.js 24 runtime, not an Edge runtime, because Nodemailer requires
  Node APIs.
- Set `CONTACT_ALLOWED_ORIGINS` to your real HTTPS origin(s) and ensure the
  proxy overwrites `x-forwarded-for`.
- Store secrets in the platform's secret manager; never in the repository.
- Keep `.env.local` out of version control (it is ignored).
- Verify one real submission in staging before release.

Serve over HTTPS. `Strict-Transport-Security` and other hardening headers are
configured in `next.config.js`. The in-memory rate limiter protects a single
instance; add the hosting platform's edge rate limiting for multi-instance or
serverless deployments.

See the
[upgrade and operations runbook](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/upgrade-runbook.md)
for rollback, incident, and release steps.

## Documentation

- [Architecture, upgrade decisions, and performance roadmap](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/architecture-upgrade-and-roadmap.md)
- [Upgrade and operations runbook](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/upgrade-runbook.md)
- [Baseline and verification evidence](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/evidence/baseline.md)
- [Implementation status and manual follow-ups](docs/ways-of-work/plan/platform-modernization/nextjs-security-upgrade/implementation-status.md)

## Troubleshooting

- **`/api/send` or a page returns 404 after a build:** the incremental `.next`
  output can be stale. Run `npm run build:clean` and start the server again.
- **Contact form returns a generic unavailable error:** check that `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, and `MAIL_TO` are set
  and that the provider accepts the credentials. Re-run
  `npm run mail:test-account -- --force` for a known-good local mailbox.
- **Build fails while fetching Sora:** the build host cannot reach Google
  Fonts. Allow `fonts.googleapis.com` and `fonts.gstatic.com`, or self-host the
  font later.

## Security

Do not open public issues for vulnerabilities. Follow [`SECURITY.md`](SECURITY.md).
