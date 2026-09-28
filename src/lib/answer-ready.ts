import { z } from 'zod';

// Answer-ready (LLMO/GEO) frontmatter for writing entries. Every field is optional so
// existing articles stay valid. Service references reuse the existing `relatedServices`.

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  accessedAt: z.coerce.date().optional(),
});

export const comparisonTableSchema = z
  .object({
    caption: z.string().optional(),
    columns: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
  })
  .refine((table) => table.rows.every((row) => row.length === table.columns.length), {
    message: 'Every comparisonTable row must have one cell per column',
  });

// First-party evidence must say how and when it was measured; third-party evidence must
// point to its source. This keeps unverifiable proof out of published content.
export const evidenceSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('first_party'),
    claim: z.string().min(1),
    methodology: z.string().min(1),
    measuredAt: z.coerce.date(),
    limitations: z.array(z.string()).default([]),
    reproducibility: z.string().optional(),
  }),
  z.object({
    kind: z.literal('third_party'),
    claim: z.string().min(1),
    source: sourceSchema,
    limitations: z.array(z.string()).default([]),
  }),
]);

export const answerReadyFields = {
  question: z.string().optional(),
  shortAnswer: z.string().optional(),
  audience: z.string().optional(),
  intentStage: z.enum(['informational', 'commercial_investigation', 'transaction_ready']).optional(),
  decisionCriteria: z.array(z.string()).default([]),
  comparisonTable: comparisonTableSchema.optional(),
  evidence: z.array(evidenceSchema).default([]),
  primaryData: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  sources: z.array(sourceSchema).default([]),
  reviewedAt: z.coerce.date().optional(),
};

export type FaqItem = z.infer<typeof faqItemSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Source = z.infer<typeof sourceSchema>;
