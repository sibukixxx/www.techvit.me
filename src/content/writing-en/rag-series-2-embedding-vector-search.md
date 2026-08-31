---
title: "Practical RAG Guide, Part 2: Embeddings and Vector Search — Replacing \"Seems Better\" with Recall@5"
description: The theory of embedding spaces, distance metrics, ANN, and HNSW — plus an experiment comparing three embedding models with Recall@K.
category: engineering
tags: [RAG, Embedding, Vector Search]
pubDate: 2026-07-19
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

Part 2 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). [Last time](/en/writing/rag-series-1-fundamentals) we built a minimal RAG pipeline. Now we dig into its heart: embeddings and vector search. Theoretically, this is the part that most determines whether RAG succeeds.

## From text to vector

**Tokenization.** Text is first split into tokens. Embedding models have input token limits, which becomes a constraint on chunk design (Part 3).

**Dense vectors.** An embedding model maps a token sequence to a single dense vector of hundreds to thousands of dimensions. Unlike sparse one-hot representations, every dimension carries a share of the meaning.

**The embedding space.** Models are trained so that semantically similar text lands close together. That property is why "I want to cancel" matches "how to terminate a contract" with zero keyword overlap — this is semantic search.

Crucially, **the shape of this space is determined by the model's training data and objective**. Change the embedding model and you change the very definition of "close," so search results change. Multilingual quality, domain fit, and support for asymmetric retrieval (matching short questions against long documents) vary enormously between models.

## How distance is measured

- **Cosine similarity**: closeness of direction, ignoring magnitude. The de facto standard for text
- **Dot product**: direction plus magnitude; identical to cosine on normalized vectors
- **Euclidean distance**: straight-line distance in the space

Using your vector database's default metric without checking which metric your embedding model was trained for is a quiet way to lose accuracy.

## From brute force to ANN

Naive top-k search compares the query against every chunk. At a few thousand chunks, brute force is plenty fast. At millions, it isn't.

Enter **ANN (approximate nearest neighbor)**: give up exact top-k in exchange for indexes that return "almost right" neighbors fast. The flagship is **HNSW** (Hierarchical Navigable Small World), a multi-layer graph you descend from coarse to fine. It's what sits inside most vector databases (pgvector, Qdrant, Weaviate, and so on).

Because ANN is approximate, **the true nearest neighbor can simply fail to come back, depending on index parameters**. The measure of this is Recall@K — the fraction of the exact top-K that the ANN index actually returned — and it trades off against speed. The instinct to build here: a vector database is *not* a box that always returns the right answer.

## Experiment: compare three embedding models with Recall@5

This week's experiment. Take the same corpus of ~100 documents and swap in three embedding models (e.g., an OpenAI model, a multilingual open model, a Japanese-specialized model).

1. Create 20–30 pairs of questions and their genuinely relevant documents (this becomes the seed of Part 6's golden dataset)
2. Embed the corpus with each model; run each question's top-5 search
3. Compute **Recall@5** — how often the relevant document appears in the top 5 — per model

The point is to never stop at "B felt better":

```
Embedding A: Recall@5 = 0.72
Embedding B: Recall@5 = 0.86
Embedding C: Recall@5 = 0.79
```

Then **read the individual questions where A lost to B**. Did it miss on proper nouns? Weak on paraphrases? A language-quality issue? This habit of failure analysis is exactly what builds diagnostic skill later.

## This week's explain-it-yourself prompts

- Why does changing the embedding model change the search results?
- What do you gain and lose by using an ANN index?
- What does Recall@5 = 0.7 mean for the RAG system as a whole?

Next, Part 3 goes deep on chunking — and shows with real data how much this seemingly mundane parameter controls retrieval quality.
