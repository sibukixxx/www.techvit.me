import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const files = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (extname(path) === '.html') files.push(path);
  }
}

walk(root.pathname);
const broken = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href=["'](\/[^"]*?)["']/g)) {
    const href = match[1].split(/[?#]/)[0];
    if (!href || href.startsWith('/api/')) continue;
    const decoded = decodeURI(href);
    const candidates = decoded.endsWith('/')
      ? [join(root.pathname, decoded, 'index.html')]
      : [
          join(root.pathname, decoded),
          join(root.pathname, decoded, 'index.html'),
          join(root.pathname, `${decoded}.html`),
        ];
    if (!candidates.some(existsSync)) broken.push(`${file.replace(root.pathname, '')}: ${href}`);
  }
}

if (broken.length) {
  console.error(`Broken internal links:\n${[...new Set(broken)].join('\n')}`);
  process.exit(1);
}

console.log(`Internal link check passed (${files.length} HTML files).`);
