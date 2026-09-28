# Demand Learning Instrumentation v1

Implements #25 under the #24 design. Tracks one ID family through

```text
buyer question -> answer-ready content -> landing -> decision CTA -> inquiry -> Admin opportunity ref -> learning
```

This site produces observations only. It does not store leads, score them, or conclude that content caused revenue. Admin is the system of record for leads, opportunities and revenue. Downstream analysis (Insight) interprets the evidence, via the export described in `docs/demand-evidence-package.md` (#26).

## Question registry

Source: `src/lib/demand.ts` (`demandQuestions`), tested by `tests/demand.test.mjs`.

The five entries are the P0 priority questions from `docs/llmo-prompt-panel.md`, in the same order. Each entry has `questionId`, `question`, `audience`, `job`, `intentStage`, `serviceRef`, `evidenceRefs`, `landingPage`, `primaryCtaId`, `experimentId`, `contentVersion`.

| question_id | Question                                  | Service                | Landing page                                           | Experiment |
| ----------- | ----------------------------------------- | ---------------------- | ------------------------------------------------------ | ---------- |
| q-001       | AI業務改善を外注する会社の選び方は？      | ai-workflow-assessment | `/blog/how-to-choose-ai-workflow-improvement-partner/` | exp-001    |
| q-002       | 小規模PoCから対応してくれるAI開発会社は？ | automation-development | not published                                          | —          |
| q-003       | RAG導入支援会社を比較するポイントは？     | rag-knowledge-search   | not published                                          | —          |
| q-004       | AI導入コンサルとAI開発会社の違いは？      | ai-workflow-assessment | not published                                          | —          |
| q-005       | AI業務診断だけ依頼できる会社は？          | ai-workflow-assessment | not published                                          | —          |

`landingPage` stays `null` until an answer-ready page for that question actually exists. A published landing page must have `experimentId`, `primaryCtaId` and `contentVersion` (enforced by test). When content changes materially, bump `contentVersion` (`<slug>:<YYYY-MM-DD>`) so observations before and after the change stay separable.

## Event contract

All events go to GA4 through the existing `gtag` / `dataLayer` path in `BaseLayout.astro`.

| Event              | Fired when                                                                                            | Parameters                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `demand_landing`   | A registered landing page loads                                                                       | `question_id`, `experiment_id`, `content_version`, `landing_page_id`, `service_ref`, `source`, `campaign`, `occurred_at` |
| `demand_cta_click` | A link to `/services/<id>/` or `/contact/` is clicked in a session that started on a question landing | landing params + `cta_id`, `source_path`                                                                                 |
| `contact_submit`   | The general contact form is delivered successfully                                                    | landing params + last `cta_id` (when present)                                                                            |

The existing `contact_click` event is unchanged.

- `cta_id` is derived from the link target (`service:<id>` or `contact`), so CTAs inside Markdown need no extra markup.
- `landing_page_id` is the path with `/` replaced by `:` (`blog:how-to-choose-ai-workflow-improvement-partner`).
- `source` is the referrer **host** only (`www.google.com`, `direct`, `internal`), never the full URL.
- `campaign` is `utm_campaign` when present.
- The landing context is kept in `sessionStorage` (`techvit:demand`) for the session, so the contact form can attach it. The latest question landing in the session wins.

### No personal data

`sanitizeDemandContext` is the only path into events, storage and inquiry refs. It keeps allowlisted keys only and accepts identifier-shaped values only (no spaces, no `@`, not a bare phone number). Names, emails, company names and message text are never sent to analytics. Tests: `tests/demand.test.mjs`, `tests/contact-api.test.mjs`.

### Inquiry handoff

`/api/contact` appends the sanitized refs to the operator notification:

```text
Demand refs:
  question_id: q-001
  experiment_id: exp-001
  content_version: how-to-choose-ai-workflow-improvement-partner:2026-09-16
  landing_page_id: blog:how-to-choose-ai-workflow-improvement-partner
  service_ref: ai-workflow-assessment
  cta_id: service:ai-workflow-assessment
  source: www.google.com
```

An inquiry without refs says `Demand refs: (none — inquiry not linked to a tracked question)`. Do not assign such an inquiry to a question by guesswork.

### GA4 setup (manual)

Register `question_id`, `experiment_id`, `content_version`, `landing_page_id`, `cta_id`, `service_ref` as event-scoped custom dimensions in the GA4 property. Until they are registered, the parameters are collected but not reportable. Registration is not retroactive.

## Measurement layers

Keep each layer as a separate metric. A higher layer never substitutes for a lower one.

| Layer                       | Observation                                           | Source                                                          | Status           |
| --------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- | ---------------- |
| AI/search visibility        | brand mention, TechVit URL cited, competitor mentions | prompt panel runs (`docs/llmo-prompt-panel.md`), Search Console | manual, periodic |
| Landing behavior            | `demand_landing`                                      | GA4                                                             | instrumented     |
| Decision CTA                | `demand_cta_click`                                    | GA4                                                             | instrumented     |
| Inquiry                     | `contact_submit` + Demand refs in notification        | GA4 + operator mail                                             | instrumented     |
| Booked call                 | call booked for a linked inquiry                      | Admin                                                           | Admin SoR        |
| Opportunity                 | opportunity ref                                       | Admin                                                           | Admin SoR        |
| Verified contract / revenue | only when verified                                    | Admin                                                           | Admin SoR        |

Unmeasured is `unknown`, not `0`. Periods before instrumentation was deployed have no CTA/inquiry data.

## First experiment: exp-001

| Field                                     | Value                                                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| question_id                               | q-001                                                                                                                  |
| Baseline                                  | `docs/llmo-baseline-2026-09-16.md` (pre-publication public-search sample; TechVit not observed for the five P0 themes) |
| Change                                    | Published answer-ready article, `content_version` `how-to-choose-ai-workflow-improvement-partner:2026-09-16`           |
| Primary metric (fixed before observation) | Decision CTA rate = sessions with `demand_cta_click` for q-001 ÷ sessions with `demand_landing` for q-001              |
| Secondary                                 | `contact_submit` with `question_id=q-001`; prompt panel visibility for q-001                                           |
| Instrumentation start                     | Deployment date of this change (CTA/inquiry data before it is unknown)                                                 |
| Review cadence                            | Every two weeks                                                                                                        |
| Observation                               | Not yet available                                                                                                      |

Limitations to carry into every review: low traffic makes rates unstable; the article publication and instrumentation happened at different times; search and AI engine behavior changes outside TechVit's control; a CTA click is intent, not demand.

## Learning record template

Create one record per review in `docs/demand-learning/records/<YYYY-MM-DD>-<experiment_id>.md`:

```markdown
# <experiment_id> review — <YYYY-MM-DD>

- question_id / content_version:
- Period (start–end) and denominator:
- Visibility: <observed values or unknown>
- Landing sessions: <n or unknown>
- Decision CTA sessions / rate: <n / rate or unknown>
- Inquiries with refs: <n or unknown>
- Admin refs (booked call / opportunity): <refs or none>
- Changes during the period: <list; if more than one, do not attribute cause>
- Limitations:
- Learning:
- Next change:
```

## Admin handoff

Send Admin a summary per review, referencing records rather than copying analytics data:

```json
{
  "project_ref": "techvit-www-demand-learning",
  "experiment_id": "exp-001",
  "question_id": "q-001",
  "content_version": "how-to-choose-ai-workflow-improvement-partner:2026-09-16",
  "primary_metric": "decision_cta_rate",
  "primary_metric_value": null,
  "cta_refs": ["service:ai-workflow-assessment"],
  "inquiry_refs": [],
  "opportunity_refs": [],
  "latest_learning_ref": "docs/demand-learning/records/<file>.md"
}
```

`null` means unknown. Inquiry and opportunity refs are Admin identifiers, never contact details.

## Guardrails

- Do not publish fabricated case studies, customer quotes, customer logos, adoption numbers or revenue.
- Do not treat AI citation, traffic or CTA clicks as business outcomes.
- Do not claim causation from correlation, or from a period with several simultaneous changes.
- Mark self-reported attribution as self-reported.
- Keep personal data out of analytics events, exports and records.
- Keep unpublished or private project details out of the site.
- Record search/AI platform changes as limitations.
- Do not optimize for vanity metrics alone; the primary metric is fixed per experiment before observation.
