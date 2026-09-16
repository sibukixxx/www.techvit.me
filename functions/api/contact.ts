import {
  graveCarePlanSelectionLabel,
  normalizeGraveCarePlanSelection,
  normalizeVisitPeriods,
  resolveSquarePaymentLink,
  type GraveCarePlanSelection,
  type GraveCareVisitPeriodId,
} from '../../src/lib/grave-care.ts';

interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  // Square-hosted payment links (not secrets, but operator-only in P0). They are
  // included in the internal notification so the operator can send the right
  // link after confirming availability. Never expose them on the public site.
  GRAVE_CARE_SQUARE_LIGHT_URL?: string;
  GRAVE_CARE_SQUARE_STANDARD_URL?: string;
}

interface ContactPayload {
  kind?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  topic?: unknown;
  demoRequested?: unknown;
  turnstileToken?: unknown;
  phone?: unknown;
  cemetery?: unknown;
  location?: unknown;
  plot?: unknown;
  plan?: unknown;
  preferredVisitPeriods?: unknown;
  privacyConsent?: unknown;
  requestType?: unknown;
  timing?: unknown;
  notes?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  landingPage?: unknown;
}

interface PagesContext {
  request: Request;
  env: Env;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      response: token,
      ...(remoteIp ? { remoteip: remoteIp } : {}),
    }),
  });

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

async function sendEmail(
  env: Env,
  payload: {
    name: string;
    email: string;
    company: string;
    message: string;
    topic: string;
    demoRequested: boolean;
  },
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    // Email delivery isn't configured yet; caller still gets a success response
    // once Turnstile + validation pass, so the form works end-to-end once these
    // env vars are set in the Cloudflare Pages dashboard.
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'techvit contact form <contact@techvit.me>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `${payload.demoRequested ? '[ForgeAI demo] ' : ''}[techvit.me] New contact from ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Work email: ${payload.email}`,
        `Company / organization: ${payload.company}`,
        `Topic: ${payload.topic || '(not specified)'}`,
        `ForgeAI demo requested: ${payload.demoRequested ? 'yes' : 'no'}`,
        '',
        payload.message,
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API returned ${response.status}`);
  }
}

function optionalText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function sendGraveCareEmail(
  env: Env,
  payload: {
    name: string;
    email: string;
    phone: string;
    cemetery: string;
    location: string;
    plot: string;
    plan: GraveCarePlanSelection;
    preferredVisitPeriods: GraveCareVisitPeriodId[];
    requestType: string;
    timing: string;
    notes: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    landingPage: string;
  },
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return;
  const paymentLink = resolveSquarePaymentLink(payload.plan, {
    LIGHT_2: env.GRAVE_CARE_SQUARE_LIGHT_URL,
    STANDARD_4: env.GRAVE_CARE_SQUARE_STANDARD_URL,
  });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'techvit contact form <contact@techvit.me>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `[Grave Care inquiry] ${payload.cemetery} — ${payload.name} (${payload.plan})`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone || '(not provided)'}`,
        `Cemetery: ${payload.cemetery}`,
        `Location: ${payload.location}`,
        `Plot: ${payload.plot || '(not provided)'}`,
        `Plan: ${payload.plan} (${graveCarePlanSelectionLabel(payload.plan, 'ja')})`,
        `Preferred visit periods: ${payload.preferredVisitPeriods.join(', ') || '(not specified)'}`,
        `Request: ${payload.requestType || '(legacy field not sent)'}`,
        `Preferred timing (free text): ${payload.timing || '(not provided)'}`,
        `Landing page: ${payload.landingPage}`,
        `UTM source: ${payload.utmSource || '(none)'}`,
        `UTM medium: ${payload.utmMedium || '(none)'}`,
        `UTM campaign: ${payload.utmCampaign || '(none)'}`,
        '',
        payload.notes || '(no notes)',
        '',
        '--- Operator only ---',
        'Next step: confirm cemetery rules and availability BEFORE sending any payment link.',
        paymentLink
          ? `Square payment link for ${payload.plan} (send only after approval): ${paymentLink}`
          : 'Square payment link: not applicable (plan undecided or link not configured).',
      ].join('\n'),
    }),
  });
  if (!response.ok) throw new Error(`Resend API returned ${response.status}`);
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { name, email, company, message, topic, demoRequested, turnstileToken } = body;

  if (body.kind === 'grave-care') {
    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(body.cemetery) ||
      !isNonEmptyString(body.location)
    ) {
      return new Response(JSON.stringify({ error: 'Required grave care fields are missing' }), {
        status: 400,
      });
    }
    if (body.privacyConsent !== true) {
      return new Response(JSON.stringify({ error: 'Privacy consent is required' }), { status: 400 });
    }
    if (name.length > 120 || email.length > 254 || body.cemetery.length > 160 || body.location.length > 200) {
      return new Response(JSON.stringify({ error: 'One or more fields are too long' }), { status: 400 });
    }
    if (!isValidEmail(email))
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
    if (!isNonEmptyString(turnstileToken))
      return new Response(JSON.stringify({ error: 'Turnstile verification is required' }), { status: 400 });
    const verified = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('CF-Connecting-IP'),
    );
    if (!verified)
      return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 400 });
    await sendGraveCareEmail(env, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: optionalText(body.phone, 40),
      cemetery: body.cemetery.trim(),
      location: body.location.trim(),
      plot: optionalText(body.plot, 300),
      plan: normalizeGraveCarePlanSelection(body.plan),
      preferredVisitPeriods: normalizeVisitPeriods(body.preferredVisitPeriods),
      requestType: optionalText(body.requestType, 120),
      timing: optionalText(body.timing, 120),
      notes: optionalText(body.notes, 5_000),
      utmSource: optionalText(body.utmSource, 200),
      utmMedium: optionalText(body.utmMedium, 200),
      utmCampaign: optionalText(body.utmCampaign, 200),
      landingPage: optionalText(body.landingPage, 300),
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(company) ||
    !isNonEmptyString(message)
  ) {
    return new Response(JSON.stringify({ error: 'name, email, company, and message are required' }), {
      status: 400,
    });
  }

  if (name.length > 120 || email.length > 254 || company.length > 120 || message.length > 10_000) {
    return new Response(JSON.stringify({ error: 'One or more fields are too long' }), { status: 400 });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
  }

  if (!isNonEmptyString(turnstileToken)) {
    return new Response(JSON.stringify({ error: 'Turnstile verification is required' }), { status: 400 });
  }

  const remoteIp = request.headers.get('CF-Connecting-IP');
  const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);

  if (!verified) {
    return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 400 });
  }

  await sendEmail(env, {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company.trim(),
    message: message.trim(),
    topic: isNonEmptyString(topic) ? topic.trim().slice(0, 120) : '',
    demoRequested: demoRequested === true,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
