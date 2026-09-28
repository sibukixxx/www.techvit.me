import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Audits the built site for canonical / sitemap / hreflang / JSON-LD consistency.
// See docs/llmo-technical-audit-2026-09-28.md for the rationale behind each check.

const dist = 'dist';
const site = 'https://www.techvit.me';
const urlBearingTypes = new Set(['BlogPosting', 'Service', 'CreativeWork']);

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(path);
      return entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return files.flat();
}

const sitemapUrls = new Set();
for (const file of (await readdir(dist)).filter((name) => /^sitemap-\d+\.xml$/.test(name))) {
  const xml = await readFile(join(dist, file), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(match[1]);
}

const errors = [];
const jsonLdTypes = {};
const htmlFiles = await listHtmlFiles(dist);

for (const file of htmlFiles) {
  // 404.html is served for any path, so its canonical cannot match a single route.
  if (file === join(dist, '404.html')) continue;

  const html = await readFile(file, 'utf8');
  const path = `/${file.slice(dist.length + 1).replace(/index\.html$/, '')}`;
  const url = `${site}${path}`;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const noindex = /name="robots" content="noindex/.test(html);

  if (!canonical) errors.push(`Missing canonical: ${path}`);
  else if (canonical !== url) errors.push(`Canonical mismatch: ${path} -> ${canonical}`);

  if (noindex && sitemapUrls.has(url)) errors.push(`noindex page listed in sitemap: ${path}`);
  if (!noindex && !sitemapUrls.has(url)) errors.push(`Indexable page missing from sitemap: ${path}`);

  for (const match of html.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)) {
    const target = new URL(match[2]).pathname;
    if (!existsSync(join(dist, target, 'index.html')))
      errors.push(`hreflang ${match[1]} points to missing page: ${path} -> ${target}`);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch {
      errors.push(`Invalid JSON-LD: ${path}`);
      continue;
    }
    jsonLdTypes[data['@type']] = (jsonLdTypes[data['@type']] ?? 0) + 1;
    if (urlBearingTypes.has(data['@type']) && data.url !== canonical)
      errors.push(`JSON-LD ${data['@type']} url differs from canonical: ${path} -> ${data.url}`);
  }
}

for (const url of sitemapUrls) {
  if (!existsSync(join(dist, new URL(url).pathname, 'index.html')))
    errors.push(`Sitemap URL has no built page: ${url}`);
}

if (errors.length > 0) {
  console.error('SEO check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const typeSummary = Object.entries(jsonLdTypes)
  .map(([type, count]) => `${type}=${count}`)
  .join(', ');
console.log(
  `SEO check passed (${htmlFiles.length} HTML files, ${sitemapUrls.size} sitemap URLs; ${typeSummary}).`,
);
