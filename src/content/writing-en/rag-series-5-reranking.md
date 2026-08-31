---
title: "Practical RAG Guide, Part 5: Reranking — Retriever for Recall, Reranker for Precision"
description: From the bi-encoder/cross-encoder distinction to a two-stage design that narrows Top 50 to Top 5, including the latency trade-off.
category: engineering
tags: [RAG, Reranking, Retrieval]
pubDate: 2026-08-09
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

Part 5 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). [Last time](/en/writing/rag-series-4-hybrid-retrieval) we built hybrid search. Now we make retrieval two-stage with a reranker — a genuine differentiator in RAG work.

## Why one stage isn't enough

Embedding search (and BM25) is fast, but its accuracy has a structural ceiling, rooted in the **bi-encoder** architecture.

- **Bi-encoder**: encode query and document **separately**, compute similarity afterwards. Document vectors are precomputed, so millions of documents stay fast. But it can never make the joint judgment — "does this document actually answer this question?" — because the two texts never see each other
- **Cross encoder**: feed the query and document **together as one input** and output a relevance score directly. The tokens attend to each other, so accuracy is dramatically higher — but nothing can be precomputed; every pair costs an inference, so it's slow

Running a cross encoder over the whole corpus is computationally impossible. So we split the roles.

## The two-stage pipeline

```
Query
 ↓
Retriever (hybrid search)
 ↓
Top 50        ← candidate generation: cast wide
 ↓
Reranker (cross encoder)
 ↓
Top 5         ← ranking: order precisely
 ↓
LLM
```

The design philosophy fits in one line:

**The retriever optimizes recall. The reranker optimizes precision.**

- The retriever's job is to get the right answer *somewhere* in the top 50 — rank doesn't matter. Anything it drops can never be recovered downstream, so it goes all-in on recall
- The reranker's job is to put the truly relevant 5 at the front of those 50. Those 5 are what the LLM sees, so it goes all-in on precision

Once you can articulate this split, "what should k be?" becomes answerable per stage: first-stage k and second-stage k are set by entirely different logic.

## Implementation and experiments

1. Change the hybrid search to return Top 50
2. Insert a cross-encoder reranker (an open model or an API reranking service) and cut to Top 5
3. Compare with and without the reranker — using **Precision@5** and **MRR**, which measures where the first correct document ranks (formalized in Part 6)
4. **Measure latency, always.** The reranker is usually the slowest component in the retrieval stage. Also check how accuracy and latency move when candidates drop from 50 to 30 or 20

The pattern you'll feel in the data: failures where the answer *is* in the top 50 but not near the top improve dramatically with a reranker. Failures where the answer never made the top 50 at all — the reranker is powerless. Making that distinction is what keeps you from reaching for the wrong fix.

## This week's explain-it-yourself prompts

- Why is a cross encoder more accurate than a bi-encoder, and why is it slower?
- How does the two-stage design resolve the recall/precision trade-off?
- In which failure mode does adding a reranker change nothing?

Next, Part 6 is RAG evaluation — turning the ad-hoc measurements we've done so far into a systematic evaluation pipeline built on a golden dataset. The most important part of the series.
