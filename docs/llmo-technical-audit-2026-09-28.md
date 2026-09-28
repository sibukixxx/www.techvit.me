# LLMO Technical Audit — 2026-09-28

## Scope

Issue #21 "Machine-readable foundation": JSON-LD, sitemap, canonical, robots.txt, llms.txt and hreflang for the built static site (`dist/`). The audit is reproducible with `pnpm check:seo` (`scripts/check-seo.mjs`), which now runs as part of `pnpm build`.

## Findings and actions

| Area       | Finding                                                                                                                                                                                                                                                        | Action                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Build      | `main` failed `check:locales` and `check:links`: the first LLMO article had no English counterpart, and its `hreflang="en"` pointed to a 404.                                                                                                                  | Added `writing-en/how-to-choose-ai-workflow-improvement-partner.md`.                                         |
| Sitemap    | The Japanese `/writing/*` pages were built, self-canonical and listed in the sitemap (13 `/writing/` URLs in the live sitemap at audit time), while Cloudflare `_redirects` 301s `/writing/*` to `/blog/`. Search engines received sitemap URLs that redirect. | Removed `src/pages/writing/`; `/blog/` is the only Japanese writing route. The 301 rule stays for old links. |
| JSON-LD    | 64 `BlogPosting` / `CreativeWork` entries used a `url` without the trailing slash, so it differed from the canonical URL.                                                                                                                                      | `WritingLayout`, `ProjectLayout`, `LabLayout` now emit the canonical form.                                   |
| llms.txt   | Linked to `/writing/`, which redirects.                                                                                                                                                                                                                        | Links to `/blog/` and `/en/writing/`.                                                                        |
| Canonical  | Every indexable page has a self-referencing canonical.                                                                                                                                                                                                         | No change.                                                                                                   |
| noindex    | `/grave-care/payment-complete/` (ja/en) and `404.html` are noindex and absent from the sitemap.                                                                                                                                                                | No change.                                                                                                   |
| robots.txt | `User-agent: * / Allow: /` with the sitemap index. No AI-crawler-specific rules.                                                                                                                                                                               | No change. Per `llmo-prompt-panel.md`, named AI crawler rules change only by deliberate decision.            |

## Accepted exceptions

- `404.html` canonical resolves to `/404/`. It is served for arbitrary paths, so no single canonical is correct; it is noindex and excluded from `check:seo`.
- 32 pages have no hreflang alternates because they have no English counterpart (`/services/*` without an English page, `/solutions/*`, `/expertise/*`, `/open-source/*`, `/cases/`). Missing alternates are preferable to alternates pointing at non-existent pages; `check:seo` fails if an emitted hreflang target does not exist.

## JSON-LD inventory after fixes

Organization 101, BreadcrumbList 81, BlogPosting 34, CreativeWork 23, Service 15, FAQPage 9, WebSite 2, ProfilePage 2.

`FAQPage` is emitted only where the FAQ is visible on the page. For writing entries it is driven by the `faq` frontmatter field.

## Answer-ready content schema

Defined in `src/lib/answer-ready.ts` and spread into the `writing` / `writingEn` collections. All fields are optional so existing articles remain valid.

| Issue #21 field                                                                         | Implementation                                                                                                                        |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| question, shortAnswer, audience, intentStage, decisionCriteria, primaryData, reviewedAt | Same names.                                                                                                                           |
| comparisonTable[]                                                                       | `comparisonTable` `{ caption?, columns[], rows[][] }`; each row must match the column count. Markdown tables in the body remain fine. |
| evidence[]                                                                              | `kind: first_party` requires `methodology` and `measuredAt`; `kind: third_party` requires `source.url`. Both allow `limitations[]`.   |
| serviceRefs[]                                                                           | Existing `relatedServices` field (rendered as related service cards).                                                                 |
| faq[]                                                                                   | `{ question, answer }`, rendered visibly and as `FAQPage` JSON-LD.                                                                    |
| sources[]                                                                               | `{ title, url, accessedAt? }`, rendered as a source list.                                                                             |

## Related #21 deliverables

- Buyer-intent query map (30), high-intent top 5, content rules, measurement fields: `docs/llmo-prompt-panel.md`.
- Baseline and first intervention: `docs/llmo-baseline-2026-09-16.md`.
- Answer-ready article template: `src/content/writing/how-to-choose-ai-workflow-improvement-partner.md`.
- Guardrails against fabricated proof: `docs/llmo-prompt-panel.md` (Content rules §8), `docs/llmo-baseline-2026-09-16.md` (Evidence policy), `AGENTS.md` (Shared rules), and the `evidence` schema validation above.
