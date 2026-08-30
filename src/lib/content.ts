import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

export async function getPublished<C extends CollectionKey>(collection: C): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, ({ data }) => (import.meta.env.PROD ? !data.draft : true));
}

export async function getEntryStaticPaths<C extends CollectionKey>(collection: C) {
  const entries = await getPublished(collection);
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const writingCategoryLabels: Record<'engineering' | 'ai-business' | 'experiments', string> = {
  engineering: 'Engineering',
  'ai-business': 'AI & Business',
  experiments: 'Experiments',
};

export const projectStatusLabels: Record<'live' | 'in-development' | 'archived', string> = {
  live: 'Live',
  'in-development': 'In Development',
  archived: 'Archived',
};

export const labStatusLabels: Record<'active' | 'paused' | 'sunset', string> = {
  active: 'Active',
  paused: 'Paused',
  sunset: 'Sunset',
};
