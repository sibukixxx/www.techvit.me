---
title: "Practical RAG Guide, Part 6: RAG Evaluation — Decomposing Quality into Retrieval and Generation"
description: Build a 50–100 question golden dataset, measure Precision@K / Recall@K / MRR / NDCG and faithfulness, and make RAG quality diagnosable.
category: engineering
tags: [RAG, Evaluation, LLM]
pubDate: 2026-10-05
draft: true
relatedServices:
  - "llm-evaluation"
---

Part 6 of the [Practical RAG Guide](/en/writing/rag-series-0-overview) — the most important part of the series. The metrics we've measured ad hoc in each part now become a systematic evaluation foundation.

RAG improvement does not exist without evaluation. "It seems better" means manually re-checking everything every time you change one line of a prompt.

## Build the golden dataset

Start by building a [golden dataset](/en/writing/what-is-a-golden-dataset) of 50–100 questions. Each record looks like:

```
Question           the question
Expected Answer    the answer you expect
Relevant Documents the documents (chunk IDs) that ground this question
Metadata           question type, difficulty, target document type, ...
```

Key points:

- Draw from real inquiry logs and anticipated questions, covering **normal cases, edge cases, and known-hard cases**
- Tag question types in metadata — like the part-number questions from Part 4, where configurations differ sharply in strength — so you can later see *which type* regressed
- Don't aim for perfection up front. Start operating with 50 questions and keep adding the ones that fail in production

## Retrieval evaluation

Retrieval-stage metrics. With relevant documents annotated, these compute mechanically.

- **Precision@K**: fraction of the top K that is relevant — how noise-free the context is
- **Recall@K**: fraction of relevant documents that made the top K — how little is dropped
- **Hit Rate**: fraction of questions with at least one relevant document in the top K
- **MRR**: where the first relevant document ranked (mean reciprocal rank) — well suited to measuring reranker impact
- **NDCG**: a composite that weights rank and graded relevance

Mapped onto Part 5's architecture: evaluate the retriever (top 50) with Recall@50, and the reranker (top 5) with Precision@5 and MRR.

## Generation evaluation

Generation-stage metrics. Many can't be computed mechanically, so LLM-as-a-judge does the scoring.

- **Correctness**: is the answer right, compared to the expected answer?
- **Faithfulness / groundedness**: is the answer grounded in the provided context? **This is where hallucination is measured.** An answer that states things absent from the context is a faithfulness violation — even if it happens to be factually true
- **Answer relevance**: does it actually address the question?
- **Citation correctness**: do the cited sources really contain the cited claims?

## Decompose to diagnose

The heart of this part:

```
RAG Quality
   ↓
Retrieval quality
   +
Generation quality
```

When an answer is wrong, always triage in this order:

1. **Did retrieval succeed?** If the relevant documents aren't in the top K, it's a retriever problem — go back to chunking (Part 3), hybrid search (Part 4), or the reranker (Part 5)
2. **Was the context right but the answer wrong?** Then it's a generation problem — look at the prompt, the model, and the ordering and volume of context

With this split, a vague report like "accuracy is bad" becomes an action: "Recall@50 dropped to 0.6 on part-number questions — a retriever problem, so we revisit BM25 weighting and tokenization."

## Implementation: make evaluation a pipeline

Evaluation is not a one-off script. Build it as a **regression test that runs on every change**:

1. Load the golden dataset and run retrieval + generation for every question
2. Compute retrieval metrics mechanically; score generation metrics with LLM-as-a-judge
3. Store results together with the configuration version (embedding model, chunk size, reranker on/off, ...)
4. Report the diff against the previous run

Every experiment from Parts 2–5 now becomes a reproducible comparison. Proving improvements with numbers was this series' goal — this is the machinery that does it.

## This week's explain-it-yourself prompts

- How do you measure hallucination? How do faithfulness and correctness differ?
- When an answer is wrong, how do you determine whether retrieval or generation is at fault?
- How do you prove a RAG quality improvement to a client?

Next, Part 7 is Advanced RAG: designs that don't stop at a single search — query rewriting, HyDE, Self-RAG, and Corrective RAG.
