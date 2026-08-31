---
title: "Practical RAG Guide, Part 8: Production RAG — Turning a Demo into a System"
description: Infrastructure as code with Terraform, observability, prompt versioning, evaluation in CI, and cost/latency monitoring. The series finale.
category: engineering
tags: [RAG, Terraform, Observability]
pubDate: 2026-10-19
draft: true
relatedServices:
  - "aws-infrastructure"
  - "ai-development"
  - "llm-evaluation"
---

The final part of the [Practical RAG Guide](/en/writing/rag-series-0-overview). The retrieval–evaluation–improvement loop now works. The last step is turning the demo into a system. When RAG projects fail, the cause is rarely model performance — it's the absence of operational design.

## The overall architecture

```
                    ┌→ Vector DB
React → FastAPI ────┤
                    ├→ PostgreSQL
                    ├→ Object Storage
                    └→ LLM API
                         ↓
                    Observability
```

- **Vector DB**: the search index (with pgvector, folding it into PostgreSQL is a legitimate choice)
- **PostgreSQL**: conversation history, document metadata, evaluation results
- **Object storage**: the source documents (PDFs etc.) — the index must always be rebuildable from the originals
- **Observability**: covered below; unusually important for RAG

## Infrastructure as code with Terraform

Codify the platform with Terraform, module by module:

- **Network**: VPC, subnets, egress paths to external APIs
- **IAM**: least-privilege roles, including access control around LLM API keys
- **Compute**: the API server (a container runtime)
- **Database**: PostgreSQL (+ pgvector)
- **Storage**: object storage for source documents
- **Secrets**: API keys and database credentials — never hard-coded
- **Monitoring**: logs, metrics, alerts

The value of IaC here isn't just reproducibility. Standing up an identical staging environment, running evaluation there, then promoting to production — IaC is what carries the RAG improvement cycle itself.

## What operations require

**Docker / CI/CD.** Containerize the app and the evaluation pipeline; automate deployment.

**Structured logging / tracing.** One RAG request is a multi-stage process: retrieve → (rerank) → generate. For incident debugging and accuracy debugging alike, you must be able to reconstruct **which query ran, what was retrieved, what entered the context, and what was generated**. Thread one trace ID through the request and log each stage's inputs, outputs, scores, and durations.

**Prompt versioning.** Prompts get change management, exactly like code. If you can't answer "who changed which prompt, when," quality regressions become undebuggable.

**Evaluation pipeline in CI.** Wire Part 6's pipeline into CI: on every prompt change, model update, or index rebuild, run the golden dataset regression — and block the deploy when metrics fall below threshold.

**Cost / latency monitoring.** RAG cost is the sum of embedding, (reranking,) and generation, and it scales with request volume. Dashboard the tokens and cost per request and per-stage latency (p50/p95). The levers are this series in reverse: smaller top-k, context compression, model tiering, caching.

## The final deliverable: a Technical Support RAG Platform

The series closes by integrating every part into one system.

```
Manual / Design Doc / GitHub Issues
FAQ / Incident Report / API Documentation
        ↓
       RAG
        ↓
Technical Support Assistant
```

For "Cloud Run deployment fails with a health check error. What should I investigate?", it returns the answer, the sources, the retrieval scores, and the evaluation metrics:

```
Answer
Sources
  - runbook.md
  - incident-042.md
  - cloud-run-guide.md
Retrieval Debug
  Top1 0.91 / Top2 0.84 / Top3 0.77
Evaluation
  Faithfulness: 0.94
  Context Recall: 0.90
```

Showing Retrieval Debug and Evaluation in the UI isn't decoration. It's proof that **the system was built to be diagnosable** — everything accumulated through Part 6 surfaces right there.

## Closing the series

Across eight parts, the goal was never "someone who can build a RAG." It was **someone who can diagnose why a RAG is failing, design the experiment, and explain the improvement in numbers**:

- Explain why RAG, why this chunk size, why hybrid
- Decompose quality degradation into retrieval vs. generation
- Prove improvements as metric deltas on a golden dataset
- Operate all of it on IaC-managed infrastructure, with monitoring

From here the path continues into deeper Agentic RAG, systematic LLM evaluation, AI observability, and production AI platforms. The evaluation side of this work is also offered as a service: [LLM Evaluation](/services/llm-evaluation).

The full series map is [here](/en/writing/rag-series-0-overview).
