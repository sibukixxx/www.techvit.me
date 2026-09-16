import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/contact.ts';

const env = {
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  RESEND_API_KEY: 'test-resend-key',
  CONTACT_TO_EMAIL: 'owner@example.com',
  GRAVE_CARE_SQUARE_LIGHT_URL: 'https://square.link/u/light',
  GRAVE_CARE_SQUARE_STANDARD_URL: 'https://square.link/u/standard',
};

const basePayload = {
  kind: 'grave-care',
  name: '山田 太郎',
  email: 'taro@example.com',
  cemetery: '小平霊園',
  location: '東京都東村山市',
  plan: 'STANDARD_4',
  preferredVisitPeriods: ['SPRING_EQUINOX', 'YEAR_END'],
  privacyConsent: true,
  turnstileToken: 'token',
};

let sentEmails;
const originalFetch = globalThis.fetch;

beforeEach(() => {
  sentEmails = [];
  globalThis.fetch = async (url, init) => {
    if (String(url).includes('challenges.cloudflare.com')) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    if (String(url).includes('api.resend.com')) {
      sentEmails.push(JSON.parse(init.body));
      return new Response('{}', { status: 200 });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const post = (payload) =>
  onRequestPost({
    request: new Request('https://www.techvit.me/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    env,
  });

describe('POST /api/contact (grave-care)', () => {
  it('accepts a valid inquiry and notifies the operator with plan, periods and the matching Square link', async () => {
    const response = await post(basePayload);

    assert.equal(response.status, 200);
    assert.equal(sentEmails.length, 1);
    const text = sentEmails[0].text;
    assert.match(text, /Plan: STANDARD_4/);
    assert.match(text, /SPRING_EQUINOX, YEAR_END/);
    assert.match(text, /https:\/\/square\.link\/u\/standard/);
    assert.doesNotMatch(text, /https:\/\/square\.link\/u\/light/);
  });

  it('rejects an inquiry without privacy consent', async () => {
    const response = await post({ ...basePayload, privacyConsent: false });
    assert.equal(response.status, 400);
    assert.equal(sentEmails.length, 0);
  });

  it('treats an unknown plan as UNDECIDED and omits any payment link', async () => {
    const response = await post({ ...basePayload, plan: 'PREMIUM_12' });

    assert.equal(response.status, 200);
    assert.match(sentEmails[0].text, /Plan: UNDECIDED/);
    assert.doesNotMatch(sentEmails[0].text, /square\.link/);
  });

  it('still requires cemetery name and location', async () => {
    const response = await post({ ...basePayload, location: '' });
    assert.equal(response.status, 400);
  });
});
