import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const pairs = [
  ['src/content/projects', 'src/content/projects-en'],
  ['src/content/writing', 'src/content/writing-en'],
  ['src/content/lab', 'src/content/lab-en'],
];

const contentExtensions = new Set(['.md', '.mdx']);
const japaneseText = /[ぁ-んァ-ヶ一-龠々〆〤]/u;

async function listContentFiles(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return listContentFiles(path, root);
      return contentExtensions.has(extname(entry.name)) ? [relative(root, path)] : [];
    }),
  );
  return files.flat().sort();
}

const errors = [];

for (const [japaneseDirectory, englishDirectory] of pairs) {
  const japaneseFiles = await listContentFiles(japaneseDirectory);
  const englishFiles = await listContentFiles(englishDirectory);
  const japaneseSet = new Set(japaneseFiles);
  const englishSet = new Set(englishFiles);

  for (const file of japaneseFiles) {
    if (!englishSet.has(file)) errors.push(`Missing English counterpart: ${join(englishDirectory, file)}`);
  }

  for (const file of englishFiles) {
    if (!japaneseSet.has(file)) errors.push(`Missing Japanese source: ${join(japaneseDirectory, file)}`);

    const englishContent = await readFile(join(englishDirectory, file), 'utf8');
    if (japaneseText.test(englishContent)) errors.push(`Japanese text remains in English content: ${join(englishDirectory, file)}`);
  }
}

if (errors.length > 0) {
  console.error(`Locale content check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Locale content check passed.');
