import { createHash } from 'node:crypto';
import { z } from 'zod';
import { demandExperiments, demandQuestions } from './demand.ts';

// Demand Evidence Package (#26): a versioned, PII-free export of Demand Learning
// observations for downstream research engines. The site produces evidence only;
// interpretation (causes, competing explanations) belongs downstream.

export const SCHEMA = 'techvit.demand-evidence-package';
export const SCHEMA_VERSION = '1.0.0';

type IndicatorType = 'leading' | 'intent' | 'sales_pipeline' | 'verified_business_outcome';
type Layer =
  'visibility' | 'landing' | 'decision_cta' | 'inquiry' | 'booked_call' | 'opportunity' | 'verified_revenue';

interface MetricDefinition {
  metric: string;
  layer: Layer;
  indicator_type: IndicatorType;
  unit: string;
  definition: string;
  source: string;
}

export const metricDefinitions = [
  {
    metric: 'public_search_presence',
    layer: 'visibility',
    indicator_type: 'leading',
    unit: 'themes',
    definition:
      'Number of tracked buyer-intent themes whose public web-search sample included a TechVit page.',
    source: 'manual public web search',
  },
  {
    metric: 'ai_answer_brand_mention',
    layer: 'visibility',
    indicator_type: 'leading',
    unit: 'prompts',
    definition: 'Number of prompt-panel prompts whose AI answer mentioned TechVit.',
    source: 'prompt panel (docs/llmo-prompt-panel.md)',
  },
  {
    metric: 'ai_answer_url_citation',
    layer: 'visibility',
    indicator_type: 'leading',
    unit: 'prompts',
    definition: 'Number of prompt-panel prompts whose AI answer cited a www.techvit.me URL.',
    source: 'prompt panel (docs/llmo-prompt-panel.md)',
  },
  {
    metric: 'question_landing_sessions',
    layer: 'landing',
    indicator_type: 'leading',
    unit: 'sessions',
    definition: 'Sessions with a demand_landing event for the question.',
    source: 'ga4',
  },
  {
    metric: 'decision_cta_sessions',
    layer: 'decision_cta',
    indicator_type: 'intent',
    unit: 'sessions',
    definition: 'Sessions with a demand_cta_click event for the question.',
    source: 'ga4',
  },
  {
    metric: 'decision_cta_rate',
    layer: 'decision_cta',
    indicator_type: 'intent',
    unit: 'ratio',
    definition: 'decision_cta_sessions divided by question_landing_sessions over the same period.',
    source: 'ga4',
  },
  {
    metric: 'linked_inquiries',
    layer: 'inquiry',
    indicator_type: 'intent',
    unit: 'inquiries',
    definition: 'Delivered contact inquiries whose Demand refs include the question_id.',
    source: 'contact notification Demand refs',
  },
  {
    metric: 'booked_calls',
    layer: 'booked_call',
    indicator_type: 'sales_pipeline',
    unit: 'calls',
    definition: 'Calls booked for linked inquiries, as recorded in Admin.',
    source: 'techvit-admin',
  },
  {
    metric: 'opportunities',
    layer: 'opportunity',
    indicator_type: 'sales_pipeline',
    unit: 'opportunities',
    definition: 'Opportunities created from linked inquiries, as recorded in Admin.',
    source: 'techvit-admin',
  },
  {
    metric: 'verified_revenue',
    layer: 'verified_revenue',
    indicator_type: 'verified_business_outcome',
    unit: 'JPY',
    definition: 'Invoiced or paid revenue from linked opportunities, verified in Admin.',
    source: 'techvit-admin',
  },
] as const satisfies readonly MetricDefinition[];

const metricNames = metricDefinitions.map((definition) => definition.metric) as [string, ...string[]];

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const observationSchema = z
  .object({
    observation_id: z.string().regex(/^obs-[a-z0-9-]+$/),
    experiment_id: z.string().nullable(),
    question_id: z.string().nullable(),
    content_version: z.string().nullable(),
    metric: z.enum(metricNames),
    value: z.number().nullable(),
    value_status: z.enum(['observed', 'zero', 'unknown', 'missing']),
    period: z.object({ start: dateString, end: dateString }),
    denominator: z.object({ metric: z.string(), value: z.number().nullable() }).nullable(),
    source: z.string().min(1),
    recorded_at: dateString,
    limitations: z.array(z.string()).default([]),
    notes: z.string().optional(),
  })
  .refine((o) => o.value_status !== 'observed' || typeof o.value === 'number', {
    message: 'observed requires a numeric value',
  })
  .refine((o) => o.value_status !== 'zero' || o.value === 0, { message: 'zero requires value 0' })
  .refine((o) => !['unknown', 'missing'].includes(o.value_status) || o.value === null, {
    message: 'unknown and missing require value null (never 0)',
  })
  .refine((o) => o.period.start <= o.period.end, { message: 'period.end must not precede period.start' });

export type Observation = z.infer<typeof observationSchema>;

const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phonePatterns = [
  /(?<![\d-])(?:\+81[-\s]?|0)\d{1,4}[-\s]\d{1,4}[-\s]\d{3,4}(?![\d-])/,
  /(?<!\d)0\d{9,10}(?!\d)/,
];

export function findPersonalDataStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return emailPattern.test(value) || phonePatterns.some((pattern) => pattern.test(value)) ? [value] : [];
  }
  if (Array.isArray(value)) return value.flatMap(findPersonalDataStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(findPersonalDataStrings);
  return [];
}

const valueSemantics = {
  observed: 'Measured; value is the measured number.',
  zero: 'Measured and the result was 0.',
  unknown: 'Not measured or not measurable for the period; value is null. Never read as 0.',
  missing: 'Should have been measured but data is absent (e.g. instrumentation not deployed); value is null.',
};

const limitations = [
  'Low traffic makes rates unstable; report denominators with every rate.',
  'Public web-search results are not AI-engine citations, and AI mentions are not leads.',
  'Search and AI engine behavior changes outside TechVit control.',
  'Periods with several simultaneous content or site changes cannot attribute an effect to one change.',
  'Inquiries without Demand refs are not assigned to a question.',
  'Booked calls, opportunities and revenue come from Admin and may lag site observations by months.',
];

const whatWeCannotConclude = [
  'That AI citation or search visibility caused an inquiry or revenue.',
  'That a traffic increase proves demand.',
  'That a CTA increase proves product-market fit.',
];

function validateReferences(observations: Observation[]): void {
  const seen = new Set<string>();
  for (const observation of observations) {
    if (seen.has(observation.observation_id))
      throw new Error(`Duplicate observation_id: ${observation.observation_id}`);
    seen.add(observation.observation_id);

    const question = observation.question_id
      ? demandQuestions.find((q) => q.questionId === observation.question_id)
      : undefined;
    if (observation.question_id && !question)
      throw new Error(`${observation.observation_id}: unregistered question_id ${observation.question_id}`);

    if (observation.experiment_id) {
      const experiment = demandExperiments.find((e) => e.experimentId === observation.experiment_id);
      if (!experiment)
        throw new Error(
          `${observation.observation_id}: unregistered experiment_id ${observation.experiment_id}`,
        );
      if (observation.question_id && experiment.questionId !== observation.question_id)
        throw new Error(
          `${observation.observation_id}: ${experiment.experimentId} belongs to ${experiment.questionId}, not ${observation.question_id}`,
        );
    }
  }
}

// Latest status of each non-leading metric per experiment. No observation means unknown, never 0.
function outcomeStatus(observations: Observation[]) {
  return demandExperiments.map((experiment) => ({
    experiment_id: experiment.experimentId,
    metrics: metricDefinitions
      .filter((definition) => definition.indicator_type !== 'leading')
      .map((definition) => {
        const latest = observations
          .filter((o) => o.experiment_id === experiment.experimentId && o.metric === definition.metric)
          .sort((a, b) => a.period.end.localeCompare(b.period.end))
          .at(-1);
        return latest
          ? {
              metric: definition.metric,
              value: latest.value,
              value_status: latest.value_status,
              observation_id: latest.observation_id,
            }
          : {
              metric: definition.metric,
              value: null,
              value_status: 'unknown' as const,
              observation_id: null,
            };
      }),
  }));
}

export function buildDemandEvidencePackage({
  observations: rawObservations,
  generatedAt,
}: {
  observations: unknown[];
  generatedAt: Date;
}) {
  const observations = rawObservations
    .map((raw) => observationSchema.parse(raw))
    .sort((a, b) => a.observation_id.localeCompare(b.observation_id));
  validateReferences(observations);

  const evidence = {
    schema: SCHEMA,
    schema_version: SCHEMA_VERSION,
    producer: { name: 'www.techvit.me', role: 'site measurement and public content' },
    subject_ref: 'techvit:www-demand-learning',
    research_question:
      'Which buyer questions and content versions lead to decision CTAs and verified inquiries, rather than only AI visibility or visits? Is the sample large enough to evaluate this?',
    questions: demandQuestions.map((q) => ({
      question_id: q.questionId,
      question: q.question,
      intent_stage: q.intentStage,
      service_ref: q.serviceRef,
      landing_page: q.landingPage,
      primary_cta_id: q.primaryCtaId,
      experiment_id: q.experimentId,
      content_version: q.contentVersion,
      evidence_refs: q.evidenceRefs,
    })),
    experiments: demandExperiments.map((e) => ({
      experiment_id: e.experimentId,
      question_id: e.questionId,
      content_version: e.contentVersion,
      primary_metric: e.primaryMetric,
      baseline_ref: e.baselineRef,
      started_at: e.startedAt,
    })),
    metric_definitions: metricDefinitions,
    value_semantics: valueSemantics,
    observations,
    outcome_status: outcomeStatus(observations),
    limitations,
    what_we_cannot_conclude: whatWeCannotConclude,
  };

  const personalData = findPersonalDataStrings(evidence);
  if (personalData.length > 0)
    throw new Error(`Refusing to export personal data (${personalData.length} value(s) matched)`);

  const fingerprint = createHash('sha256').update(JSON.stringify(evidence)).digest('hex');

  return {
    ...evidence,
    package_id: `demand-evidence:${fingerprint.slice(0, 12)}`,
    generated_at: generatedAt.toISOString(),
    provenance: {
      evidence_origin: 'first_party',
      sources: [...new Set(observations.map((o) => o.source))].sort(),
      fingerprint: { algorithm: 'sha256', value: fingerprint },
    },
  };
}
