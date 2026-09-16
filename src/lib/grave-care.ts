export type GraveCarePlanId = 'LIGHT_2' | 'STANDARD_4';
export type GraveCarePlanSelection = GraveCarePlanId | 'UNDECIDED';

export interface GraveCarePlan {
  id: GraveCarePlanId;
  name: string;
  nameEn: string;
  price: number;
  visitsPerYear: number;
  recommended: boolean;
  priceStatus: 'confirmed';
}

// Prices are annual, tax included, paid up front by card via a Square-hosted
// payment link. No automatic renewal in P0.
export const graveCarePlans: readonly GraveCarePlan[] = [
  {
    id: 'LIGHT_2',
    name: '年2回 ライトプラン',
    nameEn: 'Light plan (2 visits a year)',
    price: 17_800,
    visitsPerYear: 2,
    recommended: false,
    priceStatus: 'confirmed',
  },
  {
    id: 'STANDARD_4',
    name: '年4回 定期見守りプラン',
    nameEn: 'Standard plan (4 visits a year)',
    price: 29_800,
    visitsPerYear: 4,
    recommended: true,
    priceStatus: 'confirmed',
  },
];

export const findGraveCarePlan = (id: string): GraveCarePlan | undefined =>
  graveCarePlans.find((plan) => plan.id === id);

export const normalizeGraveCarePlanSelection = (value: unknown): GraveCarePlanSelection =>
  typeof value === 'string' && findGraveCarePlan(value) ? (value as GraveCarePlanId) : 'UNDECIDED';

export const graveCarePlanSelectionLabel = (selection: GraveCarePlanSelection, locale: 'ja' | 'en') => {
  if (selection === 'UNDECIDED') return locale === 'ja' ? 'まだ決めていない' : 'Not decided yet';
  const plan = findGraveCarePlan(selection);
  if (!plan) return selection;
  return `${locale === 'ja' ? plan.name : plan.nameEn} — ${formatGraveCarePrice(plan.price, locale)}`;
};

export const formatGraveCarePrice = (amount: number, locale: 'ja' | 'en') =>
  new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);

export const graveCarePayment = {
  provider: 'Square',
  method: 'クレジットカードによる年間一括前払い',
  methodEn: 'Annual up-front payment by credit card',
  autoRenewal: false,
};

export const graveCareServiceArea = {
  base: '東京都西東京市周辺',
  baseEn: 'Around Nishitokyo, Tokyo',
  publicMessage: '西東京市・多摩地域を中心に対応。飯能方面もご相談ください。',
  publicMessageEn: 'Serving Nishitokyo and the Tama area. Please also ask us about Hanno.',
  municipalities: ['西東京市', '小平市', '東久留米市', '東村山市', '周辺の多摩地域', '埼玉県飯能市の一部'],
  municipalitiesEn: [
    'Nishitokyo',
    'Kodaira',
    'Higashikurume',
    'Higashimurayama',
    'surrounding Tama areas',
    'parts of Hanno, Saitama',
  ],
};

export type GraveCareVisitPeriodId = 'SPRING_EQUINOX' | 'OBON' | 'AUTUMN_EQUINOX' | 'YEAR_END';

export interface GraveCareVisitPeriod {
  id: GraveCareVisitPeriodId;
  season: string;
  seasonEn: string;
  months: string;
  monthsEn: string;
}

export const graveCareSchedule: readonly GraveCareVisitPeriod[] = [
  {
    id: 'SPRING_EQUINOX',
    season: '春彼岸',
    seasonEn: 'Spring equinox period',
    months: '3月',
    monthsEn: 'March',
  },
  { id: 'OBON', season: 'お盆', seasonEn: 'Obon', months: '7〜8月', monthsEn: 'July–August' },
  {
    id: 'AUTUMN_EQUINOX',
    season: '秋彼岸',
    seasonEn: 'Autumn equinox period',
    months: '9月',
    monthsEn: 'September',
  },
  { id: 'YEAR_END', season: '年末', seasonEn: 'Year-end', months: '12月', monthsEn: 'December' },
];

// Accepts a single value or a list (form checkboxes) and returns known visit
// window ids, de-duplicated and in schedule order.
export const normalizeVisitPeriods = (value: unknown): GraveCareVisitPeriodId[] => {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  const requested = new Set(raw.filter((item): item is string => typeof item === 'string'));
  return graveCareSchedule.filter((visit) => requested.has(visit.id)).map((visit) => visit.id);
};

export type SquarePaymentLinks = Partial<Record<GraveCarePlanId, string>>;

// Square-hosted payment links are operator-only in P0: they are sent manually
// after availability is confirmed and must never be rendered on the public LP.
export const resolveSquarePaymentLink = (
  selection: GraveCarePlanSelection,
  links: SquarePaymentLinks,
): string | null => {
  if (selection === 'UNDECIDED') return null;
  const link = links[selection];
  return typeof link === 'string' && link.trim().length > 0 ? link : null;
};

export interface GraveCareCemetery {
  slug: string;
  name: string;
  nameEn: string;
  municipality: string;
  published: boolean;
  status: 'candidate' | 'confirmed';
}

// Publish only cemeteries where service delivery has been operationally confirmed.
// P0 intentionally starts with no assumed or fictional cemetery pages.
export const graveCareCemeteries: GraveCareCemetery[] = [];

// Internal candidates only. Do not publish until cemetery rules and permission
// for third-party cleaning work have been confirmed by the operator.
export const graveCareCemeteryCandidates: GraveCareCemetery[] = [
  {
    slug: 'kodaira',
    name: '小平霊園',
    nameEn: 'Kodaira Cemetery',
    municipality: '東京都東村山市・小平市・東久留米市',
    published: false,
    status: 'candidate',
  },
  {
    slug: 'hanno',
    name: '飯能霊園',
    nameEn: 'Hanno Cemetery',
    municipality: '埼玉県飯能市',
    published: false,
    status: 'candidate',
  },
];
