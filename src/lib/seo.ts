const SITE_NAME = 'techvit';
const SITE_URL = 'https://www.techvit.me';
const AUTHOR_NAME = 'techvit';

export interface WebsiteJsonLdOptions {
  description: string;
}

export function buildWebsiteJsonLd({ description }: WebsiteJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description,
  };
}

export function buildPersonJsonLd({ description }: { description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: SITE_URL,
    description,
    jobTitle: 'Independent Software Engineer & Product Builder',
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
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
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
    creator: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
  };
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export { SITE_NAME, SITE_URL, AUTHOR_NAME };
