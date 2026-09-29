// Issue #33: read-only migration boundary preflight. No network or deploy.
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const checks = [
  [
    "astro.config.mjs",
    [
      "output: 'static'",
      "https://www.techvit.me",
      "payment-complete"
    ]
  ],
  [
    "package.json",
    [
      "check:locales",
      "check:links",
      "check:seo"
    ]
  ]
];
for (const [path, tokens] of checks) {
  const content = read(path);
  for (const token of tokens) assert.ok(content.includes(token), path + ' missing: ' + token);
}
console.log("www.techvit.me migration boundary preflight PASS; cloud deployment/parity NOT tested");
