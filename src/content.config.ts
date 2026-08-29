import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projectSchema = ({ image }: { image: () => z.ZodType }) =>
  z.object({
    title: z.string(),
    description: z.string(),
    heroImage: image().optional(),
    status: z.enum(['live', 'in-development', 'archived']),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    externalUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: projectSchema,
});

const projectsEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects-en' }),
  schema: projectSchema,
});

const writingSchema = ({ image }: { image: () => z.ZodType }) =>
  z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['engineering', 'ai-business', 'experiments']),
    tags: z.array(z.string()).default([]),
    heroImage: image().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  });

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: writingSchema,
});

const writingEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing-en' }),
  schema: writingSchema,
});

const labSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['active', 'paused', 'sunset']),
  startDate: z.coerce.date(),
  externalUrl: z.url().optional(),
  draft: z.boolean().default(false),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: labSchema,
});

const labEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab-en' }),
  schema: labSchema,
});

export const collections = { projects, projectsEn, writing, writingEn, lab, labEn };
