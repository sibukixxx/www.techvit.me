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
    if (japaneseText.test(englishContent))
      errors.push(`Japanese text remains in English content: ${join(englishDirectory, file)}`);
  }
}

// services は対訳ディレクトリを持たず、frontmatter の *En フィールドで /en/services を賄う。
// 英語欄に日本語が残っているとフォールバックに気付けないため、ここで落とす。
const englishFields = ['titleEn', 'summaryEn', 'descriptionEn', 'deliveryTimeEn', 'labelEn'];
const servicesDirectory = 'src/content/services';
const untranslatedServices = [];

for (const file of await listContentFiles(servicesDirectory)) {
  const source = await readFile(join(servicesDirectory, file), 'utf8');
  const frontmatter = source.split(/^---$/m)[1] ?? '';

  for (const line of frontmatter.split('\n')) {
    const match = line.match(/^\s*(\w+):\s*(\S.*)$/);
    if (!match || !englishFields.includes(match[1])) continue;
    if (japaneseText.test(match[2]))
      errors.push(`Japanese text in English field ${match[1]}: ${join(servicesDirectory, file)}`);
  }

  if (!/^\s*titleEn:/m.test(frontmatter)) untranslatedServices.push(file);
}

if (errors.length > 0) {
  console.error(`Locale content check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

if (untranslatedServices.length > 0) {
  // /en/services は日本語へフォールバックする。翻訳を足すたびにこの一覧が縮む。
  console.warn(
    `Services without English digest (${untranslatedServices.length}):\n- ${untranslatedServices.join('\n- ')}`,
  );
}

console.log('Locale content check passed.');
