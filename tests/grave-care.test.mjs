import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  findGraveCarePlan,
  formatGraveCarePrice,
  graveCarePlans,
  graveCareSchedule,
  normalizeGraveCarePlanSelection,
  normalizeVisitPeriods,
  resolveSquarePaymentLink,
} from '../src/lib/grave-care.ts';

describe('graveCarePlans', () => {
  it('defines LIGHT_2 as 17,800 yen for two visits a year', () => {
    const plan = findGraveCarePlan('LIGHT_2');
    assert.equal(plan?.price, 17_800);
    assert.equal(plan?.visitsPerYear, 2);
  });

  it('defines STANDARD_4 as 29,800 yen for four visits a year', () => {
    const plan = findGraveCarePlan('STANDARD_4');
    assert.equal(plan?.price, 29_800);
    assert.equal(plan?.visitsPerYear, 4);
  });

  it('marks only STANDARD_4 as the recommended plan', () => {
    const recommended = graveCarePlans.filter((plan) => plan.recommended).map((plan) => plan.id);
    assert.deepEqual(recommended, ['STANDARD_4']);
  });

  it('returns undefined for an unknown plan id', () => {
    assert.equal(findGraveCarePlan('PREMIUM_12'), undefined);
  });
});

describe('normalizeGraveCarePlanSelection', () => {
  it('keeps canonical plan ids', () => {
    assert.equal(normalizeGraveCarePlanSelection('LIGHT_2'), 'LIGHT_2');
    assert.equal(normalizeGraveCarePlanSelection('STANDARD_4'), 'STANDARD_4');
  });

  it('falls back to UNDECIDED for empty, unknown or non-string values', () => {
    assert.equal(normalizeGraveCarePlanSelection(''), 'UNDECIDED');
    assert.equal(normalizeGraveCarePlanSelection(undefined), 'UNDECIDED');
    assert.equal(normalizeGraveCarePlanSelection('PREMIUM'), 'UNDECIDED');
    assert.equal(normalizeGraveCarePlanSelection(42), 'UNDECIDED');
  });
});

describe('formatGraveCarePrice', () => {
  it('formats a yen amount with thousands separators for Japanese', () => {
    assert.match(formatGraveCarePrice(17_800, 'ja'), /17,800/);
  });

  it('formats a yen amount with a yen sign for English', () => {
    assert.match(formatGraveCarePrice(29_800, 'en'), /¥29,800/);
  });
});

describe('graveCareSchedule', () => {
  it('has four visit windows with unique ids', () => {
    const ids = graveCareSchedule.map((visit) => visit.id);
    assert.equal(ids.length, 4);
    assert.equal(new Set(ids).size, 4);
  });
});

describe('normalizeVisitPeriods', () => {
  it('keeps known ids, removes duplicates and orders them by schedule', () => {
    assert.deepEqual(normalizeVisitPeriods(['OBON', 'SPRING_EQUINOX', 'OBON', 'bogus']), [
      'SPRING_EQUINOX',
      'OBON',
    ]);
  });

  it('accepts a single string value', () => {
    assert.deepEqual(normalizeVisitPeriods('YEAR_END'), ['YEAR_END']);
  });

  it('returns an empty list for missing or malformed input', () => {
    assert.deepEqual(normalizeVisitPeriods(undefined), []);
    assert.deepEqual(normalizeVisitPeriods({ OBON: true }), []);
  });
});

describe('resolveSquarePaymentLink', () => {
  const links = { LIGHT_2: 'https://square.link/u/light', STANDARD_4: 'https://square.link/u/standard' };

  it('returns the configured link for a concrete plan', () => {
    assert.equal(resolveSquarePaymentLink('LIGHT_2', links), 'https://square.link/u/light');
    assert.equal(resolveSquarePaymentLink('STANDARD_4', links), 'https://square.link/u/standard');
  });

  it('returns null when the plan is undecided', () => {
    assert.equal(resolveSquarePaymentLink('UNDECIDED', links), null);
  });

  it('returns null when no link is configured for the plan', () => {
    assert.equal(resolveSquarePaymentLink('LIGHT_2', {}), null);
  });
});
