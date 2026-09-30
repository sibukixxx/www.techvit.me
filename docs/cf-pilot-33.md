# Issue #33: Cloudflare cf staging gate

Standard: https://github.com/sibukixxx/techvit-platform/issues/21 . Initial evaluation version: `cf@1.0.0-beta.5` (pin, not proof of staging support). Keep the existing Wrangler commands as fallback.

## Status (2026-09-30)

| Acceptance item | State |
|---|---|
| Existing deploy ownership known and recorded | Done (see Discovery record) |
| Isolated preview functional, SEO/redirect/noindex parity | Not done (partial checks only) |
| Production release approval and rollback | Rollback path recorded; approval flow not defined |
| `cf` commands and pinned version recorded, fallback retained | Not done (version pinned for evaluation only) |

No remote `cf` deployment has been executed. Production is untouched.

## Preflight (source level only)

Run `pnpm cf:pilot:verify` (read-only source invariant preflight). It **does not** deploy, run integration tests, authenticate with Cloudflare or prove parity.

## Discovery record (read-only Cloudflare API + public GET)

### Current deployment of `www.techvit.me`
- Cloudflare **Pages Git integration**, project `www-techvit-me-git`, repo `sibukixxx/www.techvit.me`.
- Production branch `main`, build `pnpm build`, output `dist`, custom domain `www.techvit.me` (active).
- Preview deployments are enabled for all branches/PRs on `*.pages.dev`.
- No tracked deployment config exists in this repo.

### Rollback
- Re-promote a previous production deployment in the Pages dashboard.
- Last production deployment at discovery: `dfff68da` (main `960d0ad`, 2026-09-28).

### DNS
- `techvit.me` is **not** in the Cloudflare account; nameservers are Google Cloud DNS.
- DNS and redirect checks for `solutions.techvit.me` must start from that provider.

### Related projects (do not modify for this pilot)
- Legacy `techvit-solutions` Pages project (domain `solutions.techvit.me`) and a same-named Worker still exist. Where the 301 is implemented is unconfirmed.
- Stale duplicate Pages project `www-techvit-me` (no domain, no Git source) exists. Cleanup candidate, out of scope here.

### Preview check so far
- Preview `ddbcae68` (this branch, `f7a40ca`) built successfully.
- `robots.txt` matches production and points the sitemap at the canonical host.
- `/grave-care/payment-complete/` returns the same title and body as production.
- Source sets `<meta robots noindex, nofollow>` for that page (`GraveCarePaymentComplete.astro`); built output has not been inspected.

## Still unverified

- HTTP status and headers: 404, redirects, noindex response on `/grave-care/payment-complete/`.
- Sitemap contents, locale routes, canonical/hreflang, PDF/download artifacts.
- Whether `*.pages.dev` is kept out of the index (no secondary canonical host).
- `solutions.techvit.me` 301 behavior.
- Baseline build/lint/test results on `main`.

## Next steps

1. Inspect local `dist` (meta, sitemap, PDF, `_redirects`) and collect HTTP status/headers with `curl -I` against preview and production.
2. Inspect pinned `cf --help`, `cf cli search`, `cf migrate --help`, then run the beta migration only in a separate test environment. Review the full generated config diff; never commit secrets or assume unsupported features are retained.
3. Record baseline main SHA, local checks, staging identity, cf/old Wrangler command matrix, route/binding/secret parity, HTTP responses, rollback release ID, and production approval.

## Guardrails

- Do not mutate production from a feature branch.
- Do not automate remote D1/route/DNS changes.
- Preview must not become a duplicate canonical site.
- Use least-privilege credentials; no private lead/customer data in build output.
