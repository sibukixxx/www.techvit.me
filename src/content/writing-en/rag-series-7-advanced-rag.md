---
title: "Practical RAG Guide, Part 7: Advanced RAG — Designs That Don't Stop at One Search"
description: Query rewriting, HyDE, context compression, Self-RAG, Corrective RAG, and Agentic RAG — RAG architectures with loops.
category: engineering
tags: [RAG, Agent, LLM]
pubDate: 2026-10-12
draft: true
relatedServices:
  - "ai-development"
  - "llm-evaluation"
---

Part 7 of the [Practical RAG Guide](/en/writing/rag-series-0-overview). With the [evaluation pipeline](/en/writing/rag-series-6-evaluation) in place, we can now approach production-grade techniques — because every new technique can be tested for whether it actually helped.

## Strengthening the query side

The user's question is not necessarily a good search query. Start by operating on the query.

- **Query rewriting**: rewrite vague questions, or questions that depend on conversation context ("how do I configure that?"), into self-contained search queries with an LLM
- **Query expansion / multi-query retrieval**: from Part 4 — expand one question into several angles, search each, merge
- **HyDE (Hypothetical Document Embeddings)**: instead of searching with the question, **have the LLM generate a hypothetical answer document and search with *its* embedding**. Questions and documents have different shapes in embedding space (the asymmetric retrieval problem); HyDE sidesteps it by converting the question into document shape. Even when the hypothetical answer is wrong, it often lands *near documents that look like they contain the right answer*

## Strengthening the context side

- **Context compression**: extract or summarize only the question-relevant parts of retrieved chunks (with an LLM or a lightweight model) before adding them to context — cutting noise and tokens at once
- **Parent document retrieval**: the mature form of Part 3's parent-child idea — search small, deliver large

## RAG with loops — Self-RAG and Corrective RAG

This is the core of Part 7. Everything so far was a one-way pipeline: search, then generate. But no human researches that way — you search, look at what came back, change the query, and search again.

```
Question
 ↓
Query analysis
 ↓
Search
 ↓
Enough evidence?
 ├ YES → Answer
 └ NO
    ↓
 Query rewrite
    ↓
 Search again
```

- **Corrective RAG**: grade the relevance of retrieval results with an evaluator; if insufficient, correct the query and search again (or fall back to alternative sources such as web search)
- **Self-RAG**: the model itself decides, during generation, whether to search now, whether a result is usable, and whether its own output stays faithful to the context
- **Agentic RAG**: retrieval becomes a *tool* wielded by an LLM agent, which decides how to decompose the question, which sources to use, and when to search again

A one-way pipeline is comfortable to write in plain Python. But once the design **holds state, branches, and loops**, a framework that models the flow as a graph — like LangGraph — starts to earn its place. The series' rule of "understand it without frameworks first, adopt them when needed" pays off exactly here.

## Never adopt without evaluating

Advanced RAG techniques are not "add and improve." Latency always gets worse, and query rewriting can distort intent and *reduce* accuracy.

So every adoption goes through Part 6's pipeline:

1. Record baseline metrics (the Part 5 configuration)
2. Add one technique; re-evaluate on the golden dataset
3. Judge adoption on the metric delta alongside the latency and cost increase

Being able to say "HyDE moved Recall@5 from 0.79 to 0.85 at 1.4× latency" is precisely the competence this series is after.

## This week's explain-it-yourself prompts

- Why does HyDE work? In which cases does it fail?
- What distinguishes Self-RAG from Corrective RAG?
- Where is the line between requirements that justify Agentic RAG and requirements where it's overkill?

Next, the final part: Production RAG — infrastructure as code with Terraform, observability, and cost/latency monitoring. Turning the demo into a system.
