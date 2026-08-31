---
title: "Practical RAG Guide, Part 3: Chunking — How You Split Documents Decides Retrieval Quality"
description: Fixed-size, recursive, semantic, and parent-child chunking strategies, plus a chunk size experiment at 200/500/1000.
category: engineering
tags: [RAG, Chunking, Retrieval]
pubDate: 2026-07-26
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

Part 3 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). [Last time](/en/writing/rag-series-2-embedding-vector-search) covered embeddings and vector search. This time we focus on the stage just before them: chunking. It looks mundane, but a large share of RAG retrieval quality is decided here.

## Why chunking is necessary — and hard

You can't embed a whole document, for two reasons: embedding models have input limits, and there's the problem of **retrieval granularity**. Turn a 100-page manual into one vector and it becomes averaged into mush — slightly similar to everything, strongly similar to nothing — useless for finding one specific paragraph.

But finer isn't automatically better. There's a fundamental trade-off:

- **Chunks too small** → context doesn't fit in one chunk; references like "it" or "this setting" get severed and meaning is lost. Even if retrieval hits, the chunk is insufficient as context for the LLM
- **Chunks too large** → multiple topics blur into one vector, retrieval granularity drops; even a hit carries mostly irrelevant text that crowds the context

In other words, **the size that's best for retrieval and the size that's best for generation are not the same size**. That mismatch is why so many chunking strategies exist.

## The main strategies

- **Fixed-size chunking**: cut mechanically at a fixed length (plus overlap). Mandatory as a baseline
- **Sentence chunking**: cut at sentence boundaries so no sentence is severed mid-way
- **Recursive chunking**: split by paragraph, then sentence, then characters — largest separator first. Respects structure while keeping sizes even; the de facto standard in practice
- **Semantic chunking**: split where adjacent sentences' embedding similarity drops sharply (topic boundaries). Costs compute, buys semantic coherence
- **Parent-child retrieval**: **search over small child chunks, but hand the LLM the larger parent chunk containing the hit**. A direct answer to the trade-off above — retrieval granularity and generation context at the same time

**Chunk overlap** duplicates the tail of one chunk into the head of the next, softening context loss at boundaries. But more overlap makes the index redundant, and fragments of the same document start crowding the top-k.

One more constraint: the **context window**. All top-k chunks go into the LLM's prompt. Chunk size × k has to fit the prompt budget — with cost and latency included in the calculation.

## Experiment: chunk size 200 vs. 500 vs. 1000

Same corpus, same question set, vary only the chunk size.

1. Build three indexes at chunk sizes 200 / 500 / 1000 (overlap 10–20% each)
2. Measure Recall@5 and Precision@5 with the question set from Part 2
3. Beyond the numbers, **actually read the chunks that were retrieved**

Reading them makes the trade-off tangible: at 200, the fragment with the answer hits, but its premises are cut off. At 1000, the chunk containing the answer hits, but most of it is unrelated text. Having verified this on real data is precisely what lets you answer a client who asks "so how did you choose your chunk size?"

If you have spare time, run recursive chunking and parent-child retrieval under the same conditions and note which question types improve over fixed-size.

## This week's explain-it-yourself prompts

- Why can making chunks too large degrade RAG quality?
- What does overlap fix, and what does it make worse?
- Which trade-off does parent-child retrieval resolve, and how?

Next, Part 4 takes retrieval seriously: deliberately reproducing the cases where dense retrieval fails, and fixing them with BM25 and hybrid search. This is where you leave "I've built a RAG once" territory.
