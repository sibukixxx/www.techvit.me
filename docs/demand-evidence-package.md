# Demand Evidence Package

Implements #26 (parent #24, depends on #25). Exports Demand Learning observations as a versioned, PII-free package that a downstream research engine can analyze without calling or changing the public site.

## Boundary

- The site records observations and publishes content. It does not run research, rank hypotheses or decide business actions.
- The package is produced offline by a script. The public website has no runtime call to Insight or any other engine, and keeps working when they are unavailable.
- The earlier Insight #58-specific handoff is superseded. The package is a producer-neutral evidence artifact intended for the generic Public Engine Contract (sibukixxx/insight#59) as inline evidence with a research question, observations, limitations, what we cannot conclude, and provenance with a fingerprint. No Insight internals or TechVit business actions are encoded.

## Producing a package

```sh
pnpm export:evidence                 # writes exports/demand-evidence-package.json
node scripts/export-demand-evidence.mjs path/to/out.json
```

`exports/` is git-ignored. The package is reproducible from the committed inputs; only `generated_at` differs between runs.

## Inputs

- Question and experiment registry: `src/lib/demand.ts` (#25).
- Observations: `data/demand-observations/*.json`, one array of observations per file. Record aggregated numbers from GA4, prompt-panel runs, contact notifications and Admin refs. Never copy contact details.

Observation fields:

| Field                                             | Meaning                                                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `observation_id`                                  | `obs-<date>-<slug>`, unique                                                                           |
| `experiment_id`, `question_id`, `content_version` | Registry references, or `null` for site-wide observations. An experiment must belong to the question. |
| `metric`                                          | One of the metric definitions below                                                                   |
| `value`, `value_status`                           | See value semantics                                                                                   |
| `period`                                          | `start` / `end` (YYYY-MM-DD)                                                                          |
| `denominator`                                     | `{ metric, value }` for rates and samples, `value: null` when unknown                                 |
| `source`                                          | Where the number came from                                                                            |
| `recorded_at`                                     | When it was recorded                                                                                  |
| `limitations[]`, `notes`                          | Confounders and context                                                                               |

Validation (`src/lib/demand-evidence.ts`, `tests/demand-evidence.test.mjs`) rejects unknown metrics, inconsistent value/status pairs, unregistered questions or experiments, duplicate IDs, and any string that looks like an email address or phone number. `pnpm test` also builds the committed observations.

## Value semantics

| value_status | value  | Meaning                                                                          |
| ------------ | ------ | -------------------------------------------------------------------------------- |
| `observed`   | number | Measured                                                                         |
| `zero`       | `0`    | Measured and the result was 0                                                    |
| `unknown`    | `null` | Not measured or not measurable. Never read as 0.                                 |
| `missing`    | `null` | Should have been measured but data is absent (e.g. instrumentation not deployed) |

`outcome_status` lists the latest status of every non-leading metric per experiment. A metric with no observation is reported as `unknown`, so unmeasured revenue or conversions stay unknown.

## Metric layers

| Metric                                       | Layer            | Indicator type            |
| -------------------------------------------- | ---------------- | ------------------------- |
| `public_search_presence`                     | visibility       | leading                   |
| `ai_answer_brand_mention`                    | visibility       | leading                   |
| `ai_answer_url_citation`                     | visibility       | leading                   |
| `question_landing_sessions`                  | landing          | leading                   |
| `decision_cta_sessions`, `decision_cta_rate` | decision_cta     | intent                    |
| `linked_inquiries`                           | inquiry          | intent                    |
| `booked_calls`                               | booked_call      | sales_pipeline            |
| `opportunities`                              | opportunity      | sales_pipeline            |
| `verified_revenue`                           | verified_revenue | verified_business_outcome |

Only `verified_revenue` is a verified business outcome. Full definitions and sources are embedded in each package (`metric_definitions`).

## Package shape

```text
schema, schema_version            techvit.demand-evidence-package / 1.0.0
package_id                        demand-evidence:<first 12 hex chars of the fingerprint>
generated_at
producer, subject_ref             www.techvit.me / opaque subject ref
research_question
questions[], experiments[]        from the registry, content versions included
metric_definitions[], value_semantics
observations[]
outcome_status[]                  per experiment, unknown when unobserved
limitations[], what_we_cannot_conclude[]
provenance                        first_party, sources[], sha256 fingerprint
```

The fingerprint covers everything except `package_id`, `generated_at` and `provenance`, so the same evidence yields the same ID and any change to registry, definitions or observations yields a new one.

## What the package does not conclude

- AI citation or search visibility caused an inquiry or revenue.
- A traffic increase proves demand.
- A CTA increase proves product-market fit.

These are hypotheses for downstream analysis.
