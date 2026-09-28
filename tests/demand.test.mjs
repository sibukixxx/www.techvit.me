import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  ctaIdFromHref,
  demandQuestions,
  findQuestionByLandingPath,
  formatDemandRefs,
  landingPageId,
  readStoredDemandContext,
  sanitizeDemandContext,
  sourceFromReferrer,
  writeStoredDemandContext,
} from '../src/lib/demand.ts';

describe('demandQuestions registry', () => {
  it('registers the five P0 priority questions with unique ids', () => {
    assert.equal(demandQuestions.length, 5);
    assert.equal(new Set(demandQuestions.map((q) => q.questionId)).size, 5);
  });

  it('references only existing services', () => {
    for (const question of demandQuestions) {
      assert.ok(
        existsSync(`src/content/services/${question.serviceRef}.md`),
        `${question.questionId} references missing service ${question.serviceRef}`,
      );
    }
  });

  it('requires experiment, CTA and content version whenever a landing page is published', () => {
    for (const question of demandQuestions.filter((q) => q.landingPage)) {
      assert.ok(question.experimentId, question.questionId);
      assert.ok(question.primaryCtaId, question.questionId);
      assert.ok(question.contentVersion, question.questionId);
    }
  });

  it('has at least one question ready for an end-to-end experiment', () => {
    assert.ok(demandQuestions.some((q) => q.landingPage && q.experimentId));
  });
});

describe('findQuestionByLandingPath', () => {
  it('returns the question for its landing page with or without trailing slash', () => {
    const path = '/blog/how-to-choose-ai-workflow-improvement-partner';
    assert.equal(findQuestionByLandingPath(path)?.questionId, 'q-001');
    assert.equal(findQuestionByLandingPath(`${path}/`)?.questionId, 'q-001');
  });

  it('returns undefined for pages without a registered question', () => {
    assert.equal(findQuestionByLandingPath('/about/'), undefined);
  });
});

describe('landingPageId', () => {
  it('converts a path into a colon-separated id', () => {
    assert.equal(landingPageId('/blog/some-post/'), 'blog:some-post');
    assert.equal(landingPageId('/'), 'home');
  });
});

describe('ctaIdFromHref', () => {
  it('derives service CTA ids from service links', () => {
    assert.equal(ctaIdFromHref('/services/ai-workflow-assessment/'), 'service:ai-workflow-assessment');
    assert.equal(
      ctaIdFromHref('https://www.techvit.me/en/services/rag-knowledge-search'),
      'service:rag-knowledge-search',
    );
  });

  it('derives the contact CTA id and ignores query strings', () => {
    assert.equal(ctaIdFromHref('/contact/?topic=rag-accuracy'), 'contact');
  });

  it('returns undefined for non-decision links', () => {
    assert.equal(ctaIdFromHref('/blog/'), undefined);
    assert.equal(ctaIdFromHref('/services/'), undefined);
  });
});

describe('sanitizeDemandContext', () => {
  it('keeps allowlisted identifier values', () => {
    const context = sanitizeDemandContext({
      question_id: 'q-001',
      experiment_id: 'exp-001',
      content_version: 'how-to-choose-ai-workflow-improvement-partner:2026-09-16',
      cta_id: 'service:ai-workflow-assessment',
      occurred_at: '2026-09-28T01:02:03.456Z',
    });
    assert.equal(context.question_id, 'q-001');
    assert.equal(context.content_version, 'how-to-choose-ai-workflow-improvement-partner:2026-09-16');
    assert.equal(context.occurred_at, '2026-09-28T01:02:03.456Z');
  });

  it('drops keys outside the event contract', () => {
    const context = sanitizeDemandContext({ question_id: 'q-001', email: 'a@example.com', name: 'Taro' });
    assert.deepEqual(Object.keys(context), ['question_id']);
  });

  it('drops values that look like personal data', () => {
    const context = sanitizeDemandContext({
      source: 'taro@example.com',
      campaign: '山田 太郎',
      question_id: '090-1234-5678',
      service_ref: 'free text with spaces',
    });
    assert.deepEqual(context, {});
  });

  it('drops values longer than the 100 characters GA4 stores per event parameter', () => {
    assert.deepEqual(sanitizeDemandContext({ question_id: 'q'.repeat(101) }), {});
    assert.equal(sanitizeDemandContext({ question_id: 'q'.repeat(100) }).question_id?.length, 100);
  });

  it('drops malformed timestamps and non-object input', () => {
    assert.deepEqual(sanitizeDemandContext({ occurred_at: 'yesterday' }), {});
    assert.deepEqual(sanitizeDemandContext('q-001'), {});
    assert.deepEqual(sanitizeDemandContext(null), {});
  });
});

describe('sourceFromReferrer', () => {
  it('reduces an external referrer to its host', () => {
    assert.equal(
      sourceFromReferrer('https://www.google.com/search?q=secret', 'www.techvit.me'),
      'www.google.com',
    );
  });

  it('distinguishes direct and internal navigation', () => {
    assert.equal(sourceFromReferrer('', 'www.techvit.me'), 'direct');
    assert.equal(sourceFromReferrer('https://www.techvit.me/blog/', 'www.techvit.me'), 'internal');
  });
});

describe('formatDemandRefs', () => {
  it('lists present refs for the inquiry notification', () => {
    assert.deepEqual(formatDemandRefs({ question_id: 'q-001', cta_id: 'contact' }), [
      'Demand refs:',
      '  question_id: q-001',
      '  cta_id: contact',
    ]);
  });

  it('states explicitly when an inquiry is not linked to a question', () => {
    assert.match(formatDemandRefs({})[0], /not linked/);
  });
});

describe('stored demand context', () => {
  const memoryStorage = () => {
    const items = new Map();
    return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, value) };
  };

  it('round-trips a sanitized context through storage', () => {
    const storage = memoryStorage();
    writeStoredDemandContext(storage, { question_id: 'q-001', source: 'a@example.com' });
    assert.deepEqual(readStoredDemandContext(storage), { question_id: 'q-001' });
  });

  it('returns an empty context for missing or corrupt storage values', () => {
    const storage = memoryStorage();
    assert.deepEqual(readStoredDemandContext(storage), {});
    storage.setItem('techvit:demand', '{broken');
    assert.deepEqual(readStoredDemandContext(storage), {});
  });

  it('does not throw when storage is unavailable', () => {
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    assert.deepEqual(readStoredDemandContext(throwing), {});
    assert.doesNotThrow(() => writeStoredDemandContext(throwing, { question_id: 'q-001' }));
  });
});
