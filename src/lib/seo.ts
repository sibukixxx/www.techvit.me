const SITE_NAME = 'techvit';
const SITE_URL = 'https://www.techvit.me';
const AUTHOR_NAME = 'techvit';
const AUTHOR_ID = `${SITE_URL}/about/#person`;

export interface WebsiteJsonLdOptions {
  description: string;
}

export function buildWebsiteJsonLd({ description }: WebsiteJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description,
    publisher: { '@id': AUTHOR_ID },
  };
}

const KNOWS_ABOUT = [
  'Next.js',
  'Cloudflare',
  'AWS',
  'Generative AI',
  'LLM Evaluation',
  'RAG (Retrieval-Augmented Generation)',
  'Business Automation',
];

export function buildPersonJsonLd({ description, path = '/about/' }: { description: string; path?: string }) {
  const pageUrl = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profile`,
    url: pageUrl,
    mainEntity: {
      '@type': 'Person',
      '@id': AUTHOR_ID,
      name: AUTHOR_NAME,
      url: SITE_URL,
      description,
      jobTitle: 'Independent Software Engineer & Product Builder',
      knowsAbout: KNOWS_ABOUT,
      sameAs: ['https://github.com/sibukixxx', 'https://solutions.techvit.me/'],
    },
  };
}

export interface ServiceJsonLdOptions {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
}

export function buildServiceJsonLd({ name, description, url, priceRange }: ServiceJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: { '@id': AUTHOR_ID },
    areaServed: 'JP',
    ...(priceRange ? { offers: { '@type': 'Offer', priceSpecification: { '@type': 'PriceSpecification', description: priceRange } } } : {}),
  };
}

export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export interface ArticleJsonLdOptions {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  updatedDate?: Date;
}

export function buildArticleJsonLd({ title, description, url, pubDate, updatedDate }: ArticleJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    mainEntityOfPage: url,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': AUTHOR_ID },
  };
}

export interface CreativeWorkJsonLdOptions {
  title: string;
  description: string;
  url: string;
}

export function buildCreativeWorkJsonLd({ title, description, url }: CreativeWorkJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url,
    creator: { '@id': AUTHOR_ID },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export { SITE_NAME, SITE_URL, AUTHOR_NAME };
