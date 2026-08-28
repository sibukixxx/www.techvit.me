interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
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

async function sendEmail(env: Env, name: string, email: string, message: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    // Email delivery isn't configured yet; caller still gets a success response
    // once Turnstile + validation pass, so the form works end-to-end once these
    // env vars are set in the Cloudflare Pages dashboard.
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'techvit contact form <contact@techvit.me>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[techvit.me] New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { name, email, message, turnstileToken } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return new Response(JSON.stringify({ error: 'name, email, and message are required' }), { status: 400 });
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

  await sendEmail(env, name, email, message);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
