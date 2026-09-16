export const graveCarePlan = {
  name: '年間お墓見守りプラン',
  nameEn: 'Annual Grave Care Plan',
  price: 29_800,
  visitsPerYear: 4,
  priceStatus: 'confirmed' as const,
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

export const graveCareSchedule = [
  { season: '春彼岸', seasonEn: 'Spring equinox period', months: '3月', monthsEn: 'March' },
  { season: 'お盆', seasonEn: 'Obon', months: '7〜8月', monthsEn: 'July–August' },
  { season: '秋彼岸', seasonEn: 'Autumn equinox period', months: '9月', monthsEn: 'September' },
  { season: '年末', seasonEn: 'Year-end', months: '12月', monthsEn: 'December' },
];

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

export const formatGraveCarePrice = (locale: 'ja' | 'en') =>
  new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(graveCarePlan.price);
