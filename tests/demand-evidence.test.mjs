import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  buildDemandEvidencePackage,
  findPersonalDataStrings,
  observationSchema,
} from '../src/lib/demand-evidence.ts';

const observation = (overrides = {}) => ({
  observation_id: 'obs-test-001',
  experiment_id: 'exp-001',
  question_id: 'q-001',
  content_version: 'how-to-choose-ai-workflow-improvement-partner:2026-09-16',
  metric: 'decision_cta_sessions',
  value: 3,
  value_status: 'observed',
  period: { start: '2026-10-01', end: '2026-10-14' },
  denominator: { metric: 'question_landing_sessions', value: 40 },
  source: 'ga4',
  recorded_at: '2026-10-15',
  limitations: ['low traffic'],
  ...overrides,
});

const build = (observations) =>
  buildDemandEvidencePackage({ observations, generatedAt: new Date('2026-10-15T00:00:00Z') });

describe('observationSchema', () => {
  it('accepts an observed numeric value', () => {
    assert.equal(observationSchema.safeParse(observation()).success, true);
  });

  it('rejects an observed status without a numeric value', () => {
    assert.equal(observationSchema.safeParse(observation({ value: null })).success, false);
  });

  it('requires zero status to carry the value 0', () => {
    assert.equal(observationSchema.safeParse(observation({ value_status: 'zero', value: 0 })).success, true);
    assert.equal(observationSchema.safeParse(observation({ value_status: 'zero', value: 2 })).success, false);
  });

  it('keeps unknown and missing distinct from zero by requiring a null value', () => {
    assert.equal(
      observationSchema.safeParse(observation({ value_status: 'unknown', value: null })).success,
      true,
    );
    assert.equal(
      observationSchema.safeParse(observation({ value_status: 'missing', value: null })).success,
      true,
    );
    assert.equal(
      observationSchema.safeParse(observation({ value_status: 'unknown', value: 0 })).success,
      false,
    );
  });

  it('rejects metrics outside the metric definitions', () => {
    assert.equal(observationSchema.safeParse(observation({ metric: 'page_views' })).success, false);
  });

  it('rejects a period that ends before it starts', () => {
    const result = observationSchema.safeParse(
      observation({ period: { start: '2026-10-14', end: '2026-10-01' } }),
    );
    assert.equal(result.success, false);
  });
});

describe('buildDemandEvidencePackage', () => {
  it('produces a versioned package with questions, experiments, metric definitions and observations', () => {
    const pkg = build([observation()]);
    assert.equal(pkg.schema, 'techvit.demand-evidence-package');
    assert.equal(pkg.schema_version, '1.0.0');
    assert.equal(pkg.questions.length, 5);
    assert.ok(pkg.experiments.some((experiment) => experiment.experiment_id === 'exp-001'));
    assert.ok(pkg.metric_definitions.some((metric) => metric.metric === 'verified_revenue'));
    assert.equal(pkg.observations[0].value, 3);
  });

  it('marks verified revenue as the only verified business outcome indicator', () => {
    const pkg = build([]);
    const outcomes = pkg.metric_definitions.filter(
      (metric) => metric.indicator_type === 'verified_business_outcome',
    );
    assert.deepEqual(
      outcomes.map((metric) => metric.metric),
      ['verified_revenue'],
    );
  });

  it('preserves content_version and question_id on every observation', () => {
    const pkg = build([observation()]);
    assert.equal(pkg.observations[0].question_id, 'q-001');
    assert.equal(
      pkg.observations[0].content_version,
      'how-to-choose-ai-workflow-improvement-partner:2026-09-16',
    );
  });

  it('reports verified revenue as unknown when no revenue observation exists', () => {
    const pkg = build([observation()]);
    const experiment = pkg.outcome_status.find((status) => status.experiment_id === 'exp-001');
    const revenue = experiment.metrics.find((status) => status.metric === 'verified_revenue');
    assert.equal(revenue.value_status, 'unknown');
    assert.equal(revenue.value, null);
  });

  it('reports the latest observed status for a measured metric of the experiment', () => {
    const pkg = build([observation()]);
    const experiment = pkg.outcome_status.find((status) => status.experiment_id === 'exp-001');
    const cta = experiment.metrics.find((status) => status.metric === 'decision_cta_sessions');
    assert.equal(cta.value, 3);
    assert.equal(cta.observation_id, 'obs-test-001');
  });

  it('rejects observations for unregistered questions', () => {
    assert.throws(() => build([observation({ question_id: 'q-999' })]), /q-999/);
  });

  it('rejects observations whose experiment does not match the question', () => {
    assert.throws(() => build([observation({ question_id: 'q-002' })]), /exp-001/);
  });

  it('rejects duplicate observation ids', () => {
    assert.throws(() => build([observation(), observation()]), /obs-test-001/);
  });

  it('refuses to export personal data', () => {
    assert.throws(
      () => build([observation({ limitations: ['reply sent to taro@example.com'] })]),
      /personal data/i,
    );
  });

  it('states what the site does not conclude', () => {
    const pkg = build([]);
    assert.ok(pkg.what_we_cannot_conclude.some((line) => /revenue/i.test(line)));
  });

  it('keeps the fingerprint stable across generation times and changes it when evidence changes', () => {
    const a = buildDemandEvidencePackage({
      observations: [observation()],
      generatedAt: new Date('2026-10-15T00:00:00Z'),
    });
    const b = buildDemandEvidencePackage({
      observations: [observation()],
      generatedAt: new Date('2026-11-01T00:00:00Z'),
    });
    const c = buildDemandEvidencePackage({
      observations: [observation({ value: 4 })],
      generatedAt: new Date('2026-10-15T00:00:00Z'),
    });
    assert.equal(a.provenance.fingerprint.value, b.provenance.fingerprint.value);
    assert.notEqual(a.provenance.fingerprint.value, c.provenance.fingerprint.value);
    assert.equal(a.package_id, `demand-evidence:${a.provenance.fingerprint.value.slice(0, 12)}`);
  });
});

describe('findPersonalDataStrings', () => {
  it('finds email addresses and phone numbers anywhere in a nested value', () => {
    const found = findPersonalDataStrings({
      a: ['ok', { b: 'mail me at x@example.com' }],
      c: '03-1234-5678',
    });
    assert.equal(found.length, 2);
  });

  it('does not flag dates, ids or content versions', () => {
    const found = findPersonalDataStrings({
      date: '2026-09-16',
      id: 'q-001',
      version: 'how-to-choose-ai-workflow-improvement-partner:2026-09-16',
    });
    assert.deepEqual(found, []);
  });
});

describe('recorded observations', () => {
  it('build into a valid package', () => {
    const directory = 'data/demand-observations';
    const observations = readdirSync(directory)
      .filter((file) => file.endsWith('.json'))
      .flatMap((file) => JSON.parse(readFileSync(`${directory}/${file}`, 'utf8')));
    assert.doesNotThrow(() => build(observations));
  });
});
