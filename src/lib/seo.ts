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

export function buildPersonJsonLd({ description }: { description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about/#profile`,
    url: `${SITE_URL}/about/`,
    mainEntity: {
      '@type': 'Person',
      '@id': AUTHOR_ID,
      name: AUTHOR_NAME,
      url: SITE_URL,
      description,
      jobTitle: 'Independent Software Engineer & Product Builder',
      sameAs: ['https://github.com/sibukixxx'],
    },
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
