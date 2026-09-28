import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { buildDemandEvidencePackage } from '../src/lib/demand-evidence.ts';

// Builds the Demand Evidence Package (#26) from recorded observations.
// Usage: node scripts/export-demand-evidence.mjs [output-path]

const observationsDirectory = 'data/demand-observations';
const outputPath = process.argv[2] ?? 'exports/demand-evidence-package.json';

const files = (await readdir(observationsDirectory)).filter((file) => file.endsWith('.json')).sort();
const observations = (
  await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(join(observationsDirectory, file), 'utf8'))),
  )
).flat();

const evidencePackage = buildDemandEvidencePackage({ observations, generatedAt: new Date() });

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(evidencePackage, null, 2)}\n`);
console.log(
  `Wrote ${outputPath} (${evidencePackage.package_id}, ${evidencePackage.observations.length} observations).`,
);
