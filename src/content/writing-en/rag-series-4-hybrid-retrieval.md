---
title: "Practical RAG Guide, Part 4: Serious Retrieval — Dense, BM25, and Hybrid Search"
description: Reproduce dense retrieval's failures on product codes and proper nouns, then fix them with BM25 and hybrid search fused by RRF.
category: engineering
tags: [RAG, Retrieval, Hybrid Search]
pubDate: 2026-09-21
draft: true
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

Part 4 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). With embeddings and [chunking](/en/writing/rag-series-3-chunking) in place, we now take retrieval itself seriously. This is where you leave "I've built a RAG once" territory.

## Reproduce dense retrieval's weakness yourself

**Dense retrieval** (embedding-based semantic search) is strong on paraphrases. But it has a well-defined weakness: **product numbers, error codes, and proper nouns.**

The first experiment this week is to reproduce that failure. Put documents containing part numbers and error codes (strings like `ERR-4032`, `XR-500B`) into the corpus, then search for them verbatim. In embedding space, `ERR-4032` and `ERR-4023` land in nearly the same place — semantically, both are just "something error-code-shaped." The result: a search that should be an exact match calmly misses.

Reproducing this with your own hands is what makes hybrid search's "why it works" stick.

## Sparse retrieval — BM25

**Sparse retrieval** is classic keyword search; the flagship is **BM25**, which scores by term frequency (TF) and rarity (IDF).

- Extremely strong on exact matches of rare terms — part numbers, error codes, proper nouns
- Zero score when no terms match: helpless against paraphrases and synonyms

Dense and sparse have precisely complementary weaknesses. So we combine them.

## Hybrid search and RRF

```
Dense Search ─┐
              ├→ Fusion → Candidates
BM25 ─────────┘
```

Search with both and fuse the candidates. The catch: cosine similarity scores and BM25 scores live on completely different scales — you can't just add them.

The standard answer is **RRF (Reciprocal Rank Fusion)**: discard the scores, keep only the ranks.

```
RRF score(d) = Σ 1 / (k + rank_i(d))    (k is a constant, ~60)
```

Documents ranked high in either result list score high, and the scale mismatch disappears without any normalization. Simple but robust — the de facto standard for hybrid search. Implement it, then compare dense-only, BM25-only, and hybrid on your question set (now including the part-number questions) using Recall@5.

## Strengthening around the search

**Metadata filtering.** Attach document type, date, product name, and so on to each chunk, and filter *before* vector search. A requirement like "only release notes from 2024 onward" cannot be expressed in a vector space. Nearly every production RAG needs this.

**Query expansion.** Widen the net by expanding the query with synonyms and related terms.

**Multi-query retrieval.** Have an LLM rewrite the question into several differently-angled queries, search with each, and merge. A single question embedding is just one point in the space; multiple points relax that constraint.

## This week's experiments, summarized

1. Reproduce dense retrieval failing on part numbers and error codes
2. Add BM25 and confirm it succeeds on the same cases
3. Build hybrid search with RRF; compare the three configurations on Recall@5
4. Add metadata filtering and multi-query retrieval; record which question types they help

## This week's explain-it-yourself prompts

- When do you use vector search versus BM25?
- Why does hybrid search work? What problem does RRF solve?
- What kinds of requirements force metadata filtering?

Next, Part 5 adds reranking: cast a wide net (recall), then re-order precisely (precision). A genuine differentiator in RAG work.
