---
title: What Is a Golden Dataset?
description: Why continuously evaluating LLM and RAG quality requires a "golden dataset" of correct answers.
category: engineering
tags: [LLM, Evaluation, RAG]
pubDate: 2026-08-10
relatedServices:
  - "llm-evaluation"
---

Discussions of generative AI and RAG quality often stop at "it seems good enough." Many teams change a prompt or swap a model without any way to tell whether quality actually went up or down.

## What a golden dataset is

A golden dataset pairs inputs (questions or requests) with their correct outputs — the expected answer, or the source it should be grounded in. It isn't just a pile of test cases; it needs to represent how the system is actually used.

## Why it matters

- Manually checking every response after every prompt or model change isn't realistic
- "It feels better/worse" is not a basis for a real decision
- For RAG, you can't tell whether a problem is in retrieval or generation without one

With a golden dataset in place, you can run LLM-as-a-Judge evaluation and regression tests on every change, turning quality checks into something repeatable.

## How to build one

Pull representative cases — normal cases, edge cases, and cases that tend to fail — from real inquiry logs or anticipated questions, and assign correct answers by hand. Rather than aiming for a complete dataset from day one, it's more realistic to start small and expand it as the system runs.

For help building an evaluation pipeline like this, see [LLM Evaluation](/services/llm-evaluation).
