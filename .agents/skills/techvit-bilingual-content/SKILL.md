---
name: techvit-bilingual-content
description: Keep Japanese and English content synchronized in the techvit Astro site. Use when adding, editing, renaming, or removing Projects, Writing, Lab, or other localized site content.
---

# Techvit bilingual content

Maintain Japanese as the source content and publish an equivalent English version under `/en/` in the same change.

## Content collections

For every file in a Japanese collection, maintain a matching relative path and extension in its English collection:

- `src/content/projects/` → `src/content/projects-en/`
- `src/content/writing/` → `src/content/writing-en/`
- `src/content/lab/` → `src/content/lab-en/`

Translate the title, description, role, headings, and prose naturally for an English-speaking prospective client. Preserve meaning and concrete facts; do not add unsupported claims. Keep dates, status, order, stack, external URLs, repository URLs, draft state, and other non-localized metadata aligned with Japanese. Keep the same filename so both languages resolve to the same slug.

When Japanese content is renamed or removed, mirror that operation in the English collection. When only wording changes, update both versions without changing the slug unless requested.

## Static pages and shared data

When Japanese UI content or a static page changes, update its equivalent under `src/pages/en/` and any English fields in shared data such as `src/lib/services.ts` or `src/lib/products.ts`. Keep internal links inside the English site under `/en/`; external product links remain unchanged.

## Verification

Run `pnpm run check:locales`, then `pnpm run build` and `pnpm run lint`. Treat a missing counterpart, a mismatched file extension, or Japanese text left in an English collection as incomplete work. Confirm that language switching and `hreflang` still connect the equivalent routes.
