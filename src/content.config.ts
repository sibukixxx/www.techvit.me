import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
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
      // ケーススタディ構造（課題→制約→アーキテクチャ→結果）。アーキテクチャは本文で扱う
      challenge: z.string().optional(),
      constraints: z.array(z.string()).default([]),
      outcome: z.array(z.string()).default([]),
      relatedServices: z.array(z.string()).default([]),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['engineering', 'ai-business', 'experiments']),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      relatedServices: z.array(z.string()).default([]),
    }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'paused', 'sunset']),
    startDate: z.coerce.date(),
    externalUrl: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    target: z.string(),
    problems: z.array(z.string()),
    deliverables: z.array(z.string()),
    approach: z.array(z.string()),
    techStack: z.array(z.string()),
    priceRange: z.string().optional(),
    relatedProjects: z.array(z.string()).default([]),
    relatedExpertise: z.array(z.string()).default([]),
    faq: z.array(faqSchema).default([]),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

const expertise = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/expertise' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    relatedServices: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, lab, services, expertise };
