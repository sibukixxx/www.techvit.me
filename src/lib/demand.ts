// Demand Learning instrumentation (#24 / #25).
// Tracks buyer question -> landing -> decision CTA -> inquiry with one ID family.
// Analytics events and inquiry refs carry identifiers only, never personal data.

export type IntentStage = 'informational' | 'commercial_investigation' | 'transaction_ready';

export interface DemandQuestion {
  questionId: string;
  question: string;
  audience: string;
  job: string;
  intentStage: IntentStage;
  serviceRef: string;
  evidenceRefs: string[];
  // null until an answer-ready page for this question is published
  landingPage: string | null;
  primaryCtaId: string | null;
  experimentId: string | null;
  contentVersion: string | null;
}

// Priority order follows docs/llmo-prompt-panel.md "P0 priority questions".
export const demandQuestions: DemandQuestion[] = [
  {
    questionId: 'q-001',
    question: 'AI業務改善を外注する会社の選び方は？',
    audience: '生成AIや業務自動化を検討しているが、外注範囲が決まっていない中小企業・部門責任者',
    job: 'AI業務改善の外注先を比較し、最初に相談する相手を決める',
    intentStage: 'commercial_investigation',
    serviceRef: 'ai-workflow-assessment',
    evidenceRefs: ['docs/llmo-baseline-2026-09-16.md'],
    landingPage: '/blog/how-to-choose-ai-workflow-improvement-partner/',
    primaryCtaId: 'service:ai-workflow-assessment',
    experimentId: 'exp-001',
    contentVersion: 'how-to-choose-ai-workflow-improvement-partner:2026-09-16',
  },
  {
    questionId: 'q-002',
    question: '小規模PoCから対応してくれるAI開発会社は？',
    audience: '大きな契約の前に小さく検証したい中小企業',
    job: '小規模PoCを引き受ける開発先を探す',
    intentStage: 'transaction_ready',
    serviceRef: 'automation-development',
    evidenceRefs: ['docs/llmo-baseline-2026-09-16.md'],
    landingPage: null,
    primaryCtaId: null,
    experimentId: null,
    contentVersion: null,
  },
  {
    questionId: 'q-003',
    question: 'RAG導入支援会社を比較するポイントは？',
    audience: '社内文書検索やFAQのAI化を検討している担当者',
    job: 'RAG導入支援の依頼先を比較する',
    intentStage: 'commercial_investigation',
    serviceRef: 'rag-knowledge-search',
    evidenceRefs: ['docs/llmo-baseline-2026-09-16.md'],
    landingPage: null,
    primaryCtaId: null,
    experimentId: null,
    contentVersion: null,
  },
  {
    questionId: 'q-004',
    question: 'AI導入コンサルとAI開発会社の違いは？',
    audience: 'AI導入の相談先の種類を決めかねている担当者',
    job: 'コンサルと開発会社のどちらに相談するかを決める',
    intentStage: 'commercial_investigation',
    serviceRef: 'ai-workflow-assessment',
    evidenceRefs: ['docs/llmo-baseline-2026-09-16.md'],
    landingPage: null,
    primaryCtaId: null,
    experimentId: null,
    contentVersion: null,
  },
  {
    questionId: 'q-005',
    question: 'AI業務診断だけ依頼できる会社は？',
    audience: '開発を決める前に業務診断だけを依頼したい担当者',
    job: '実装を前提としない業務診断の依頼先を探す',
    intentStage: 'transaction_ready',
    serviceRef: 'ai-workflow-assessment',
    evidenceRefs: ['docs/llmo-baseline-2026-09-16.md'],
    landingPage: null,
    primaryCtaId: null,
    experimentId: null,
    contentVersion: null,
  },
];

export function findQuestionByLandingPath(path: string): DemandQuestion | undefined {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return demandQuestions.find((question) => question.landingPage === normalized);
}

export function landingPageId(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed === '' ? 'home' : trimmed.replaceAll('/', ':');
}

// Derives a stable CTA id from a link target, so CTAs inside Markdown need no markup.
export function ctaIdFromHref(href: string): string | undefined {
  const path = href.replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0] ?? '';
  const service = path.match(/^\/(?:en\/)?services\/([a-z0-9-]+)\/?$/);
  if (service) return `service:${service[1]}`;
  if (/^\/(?:en\/)?contact\/?$/.test(path)) return 'contact';
  return undefined;
}

export const demandStorageKey = 'techvit:demand';

export const demandContextKeys = [
  'question_id',
  'experiment_id',
  'content_version',
  'landing_page_id',
  'service_ref',
  'cta_id',
  'source',
  'campaign',
  'occurred_at',
] as const;

export type DemandContextKey = (typeof demandContextKeys)[number];
export type DemandContext = Partial<Record<DemandContextKey, string>>;

// Identifier-shaped values only (max 100 chars, the GA4 parameter limit): no spaces or "@", so names, emails, phone numbers
// with spaces and free text cannot pass through into analytics or inquiry refs.
const identifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,99}$/;
const digitsOnlyPattern = /^[0-9+-]{7,}$/;
const isoTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function sanitizeDemandContext(input: unknown): DemandContext {
  if (typeof input !== 'object' || input === null) return {};
  const record = input as Record<string, unknown>;
  const context: DemandContext = {};

  for (const key of demandContextKeys) {
    const value = record[key];
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    const valid =
      key === 'occurred_at'
        ? isoTimestampPattern.test(trimmed)
        : identifierPattern.test(trimmed) && !digitsOnlyPattern.test(trimmed);
    if (valid) context[key] = trimmed;
  }

  return context;
}

type DemandStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function readStoredDemandContext(storage: DemandStorage): DemandContext {
  try {
    return sanitizeDemandContext(JSON.parse(storage.getItem(demandStorageKey) ?? 'null'));
  } catch {
    return {};
  }
}

export function writeStoredDemandContext(storage: DemandStorage, context: DemandContext): void {
  try {
    storage.setItem(demandStorageKey, JSON.stringify(sanitizeDemandContext(context)));
  } catch {
    // Storage can be unavailable (private mode); tracking degrades to page-level events.
  }
}

// Referrer is reduced to its host: full URLs can carry query strings with personal data.
export function sourceFromReferrer(referrer: string, currentHost: string): string {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname;
    return host === currentHost ? 'internal' : host;
  } catch {
    return 'unknown';
  }
}

export function formatDemandRefs(context: DemandContext): string[] {
  const keys = demandContextKeys.filter((key) => context[key]);
  if (keys.length === 0) return ['Demand refs: (none — inquiry not linked to a tracked question)'];
  return ['Demand refs:', ...keys.map((key) => `  ${key}: ${context[key]}`)];
}
