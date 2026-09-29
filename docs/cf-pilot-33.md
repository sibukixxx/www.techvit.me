# Issue #33: Cloudflare cf staging gate

Standard: https://github.com/sibukixxx/techvit-platform/issues/21 . Initial evaluation version: `cf@1.0.0-beta.5` (pin, not proof of staging support). Keep the existing Wrangler commands as fallback.

Run `pnpm cf:pilot:verify` (read-only source invariant preflight). It **does not** deploy, run integration tests, authenticate with Cloudflare or prove parity. Inspect pinned `cf --help`, `cf cli search`, and `cf migrate --help` before running the beta migration in a separate test environment. Review the full generated config diff; never commit secrets or assume unsupported features are retained.

Block deployment until the actual Pages/Workers/Git integration, account/project ownership, DNS routing and previous release ID are established through read-only inspection. No tracked deployment config exists. Run pnpm build (locale/link/SEO checks) and inspect 404, sitemap, noindex on payment-complete, canonical/hreflang, PDF assets and solutions.techvit.me 301 separately. Preview cannot become a duplicate canonical site.

Gate: record baseline main SHA, local checks, staging identity, cf/old Wrangler command matrix, route/binding/secret parity, HTTP responses, rollback release ID, and production approval. Do not mutate production from a feature branch or automate remote D1/route/DNS changes. No remote cf deployment executed by this PR.
