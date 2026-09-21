# www.techvit.me

TechVit public Astro site and first-party business/technical content.

## Commands
- `pnpm dev`
- `pnpm build` — locale check + Astro check/build + internal-link check
- `pnpm lint`
- `pnpm test`
- `pnpm check:locales`
- `pnpm check:links`

## Shared rules
- Public case studies, metrics, results, and capability claims must be backed by actual repository/business evidence; do not manufacture proof for marketing copy.
- Keep locale variants and internal links consistent when public routes/content change.
- Prefer static Astro content/components unless a requested feature needs runtime behavior.
- Do not publish secrets, private client data, or internal-only operational details.

## Change-dependent checks
- Site/component/content: `pnpm build && pnpm lint && pnpm test`.
- Locale content: also verify locale parity/check output.
- Navigation/routes: internal-link check must pass.

## Done
- Build/lint/tests pass for affected site changes.
- Public claims are supportable and locale/link checks stay green.
- Private evidence is summarized safely rather than exposed.
