import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { answerReadyFields, comparisonTableSchema, evidenceSchema } from '../src/lib/answer-ready.ts';

describe('evidenceSchema', () => {
  it('accepts first-party evidence with methodology and measured date', () => {
    const result = evidenceSchema.safeParse({
      kind: 'first_party',
      claim: 'p95 latency dropped from 820ms to 310ms',
      methodology: 'k6 load test, 50 VUs, 10 minutes',
      measuredAt: '2026-09-01',
    });
    assert.equal(result.success, true);
  });

  it('rejects first-party evidence without methodology', () => {
    const result = evidenceSchema.safeParse({
      kind: 'first_party',
      claim: 'Faster',
      measuredAt: '2026-09-01',
    });
    assert.equal(result.success, false);
  });

  it('rejects first-party evidence without measured date', () => {
    const result = evidenceSchema.safeParse({ kind: 'first_party', claim: 'Faster', methodology: 'k6' });
    assert.equal(result.success, false);
  });

  it('rejects third-party evidence without a source URL', () => {
    const result = evidenceSchema.safeParse({ kind: 'third_party', claim: 'Revenue +700%' });
    assert.equal(result.success, false);
  });

  it('accepts third-party evidence with a source URL', () => {
    const result = evidenceSchema.safeParse({
      kind: 'third_party',
      claim: 'Reported AI search revenue growth',
      source: { title: 'Case study', url: 'https://example.com/case' },
    });
    assert.equal(result.success, true);
  });
});

describe('comparisonTableSchema', () => {
  it('rejects rows whose cell count differs from the columns', () => {
    const result = comparisonTableSchema.safeParse({ columns: ['A', 'B'], rows: [['1']] });
    assert.equal(result.success, false);
  });
});

describe('answerReadyFields', () => {
  it('keeps existing writing frontmatter valid when no answer-ready fields are set', () => {
    const result = z.object(answerReadyFields).parse({});
    assert.deepEqual(result.faq, []);
    assert.deepEqual(result.evidence, []);
    assert.deepEqual(result.sources, []);
  });
});
