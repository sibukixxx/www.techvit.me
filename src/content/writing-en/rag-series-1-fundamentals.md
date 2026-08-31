---
title: "Practical RAG Guide, Part 1: RAG Fundamentals — Why Retrieval Reduces Hallucination"
description: From knowledge cutoffs and in-context learning to why RAG works at all. Build a minimal RAG pipeline without relying on frameworks.
category: engineering
tags: [RAG, LLM, Embedding]
pubDate: 2026-08-31
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

Part 1 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). First, we make sure we can explain *why* RAG works from first principles.

## What LLMs cannot answer

LLMs have two kinds of knowledge limits.

**Knowledge cutoff.** A model only knows what existed in its training data. No matter how capable the model, it has never seen the internal API you shipped yesterday.

**The limits of parametric knowledge.** What a model learned in training is stored *compressed* into its parameters. Frequent facts reproduce accurately; long-tail facts (internal documents, niche product specs) are held only vaguely — and the model fails plausibly. This is one source of hallucination.

At the same time, LLMs have a powerful property: **in-context learning** — the ability to read and use information given in the prompt, on the spot. Even with no knowledge in the parameters, the model can answer correctly if the correct information is in the context.

RAG exploits exactly this. **Instead of relying on parametric knowledge (what's inside the model), it fetches non-parametric knowledge (an external corpus) at query time and injects it into the context.** That is the entire reason RAG works.

## RAG vs. fine-tuning

You should be able to answer "why not fine-tune on our internal data?" without hesitation.

| Aspect | RAG | Fine-tuning |
| --- | --- | --- |
| Updating knowledge | Swap the documents | Retrain the model |
| Citing sources | Quote retrieval results directly | Fundamentally difficult |
| Strengths | Factual reference, fresh information | Style, format, task adaptation |
| Cost | Building and operating retrieval | Training cost plus data curation |

The basic rule: inject facts with RAG, adjust behavior with fine-tuning. A requirement like "answer from frequently-updated facts, with citations" is hard to satisfy any other way.

## Build a minimal RAG

The Part 1 implementation is a minimal pipeline with FastAPI and React.

```
PDF
 ↓ Parse
 ↓ Chunk
 ↓ Embedding
 ↓ Vector DB
 ↓ Similarity Search
 ↓ Prompt
 ↓ LLM
 ↓ Answer + Citation
```

The key discipline: **don't hide the steps behind LangChain.** Write each stage in plain Python and understand what it does.

- **Parse**: extract text from PDFs. In practice, this is the dirtiest part of the job
- **Chunk**: split long text into retrieval units (Part 3 covers this in depth)
- **Embedding**: convert text into vectors of hundreds to thousands of dimensions; semantically similar text lands close together in the space
- **Similarity search**: compute cosine similarity between the query vector and chunk vectors, take the top-k
- **Prompt**: pass the retrieved chunks as context, together with the question, to the LLM
- **Citation**: return which chunks grounded the answer. Being able to show sources is one of RAG's biggest values

Cosine similarity is a few lines of numpy. Writing it yourself once makes it obvious, later, what vector databases and ANN indexes exist to *avoid* computing.

## Know the failure modes from day one

RAG is not magic; it breaks in patterns. The series covers each in depth, but keep the map in mind from the start.

1. **Retrieval misses**: the needed document never makes the top-k (retrieval failure)
2. **Bad chunking**: the needed information got split across chunk boundaries
3. **Correct context, wrong answer**: the LLM ignores or misreads the context (generation failure)
4. **The answer isn't in the data**: no retrieval strategy can help

The ability to pinpoint *which stage broke* is what separates a RAG engineer from someone who has run a tutorial. Part 6 turns that triage into a system.

## This week's explain-it-yourself prompts

- Why does putting information in the context reduce hallucination?
- When do you choose RAG versus fine-tuning?
- What exactly does cosine similarity measure?

Next, Part 2 digs into embeddings and vector search — up to being able to explain *why changing the embedding model changes the search results*.
