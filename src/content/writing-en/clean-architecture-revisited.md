---
title: Clean Architecture Revisited — Read the Principles, Not the Circles
description: Every time the debate flares up, the concentric-circle diagram takes over. Re-reading the book's actual claims — a set of principles for keeping software soft — against the development environment of 2026.
category: engineering
tags: [Architecture, Clean Architecture, SOLID]
pubDate: 2026-08-31
relatedServices:
  - 'technical-consulting'
---

The Clean Architecture debate has flared up again. It resurfaces every few years, and each time the conversation collapses into the concentric-circle diagram and arguments about how many layers to cut. A [reading log by Kuropanda](https://zenn.dev/pandanoir/articles/13042e7a39557a) (Japanese) I came across recently deliberately avoided the buzzword and organized only the book's underlying principles, which prompted me to re-read _Clean Architecture_'s claims against the environment of 2026.

## The book's thesis is not the circles

The goal the book states up front is to **minimize the number of people required to build and maintain a system**. Software should stay "soft"; a system whose cost of change keeps rising drags the business down. The concentric circles are one illustration of one means to that end. When tracing the diagram becomes the goal, you get the inversion where a design meant to make change easy makes change hard.

## The cohesion principles admit they can't all be satisfied

For grouping code into components, the book offers three principles:

- **REP (Reuse/Release Equivalence)**: the unit of reuse is the unit of release
- **CCP (Common Closure)**: group things that change for the same reason at the same time
- **CRP (Common Reuse)**: if you depend on a component, depend on all of it

Crucially, the book itself says **these three are in tension and cannot all be satisfied at once**. Early on, favor CCP — keep things that change together in one place; as the system matures, shift toward REP and carve out reusable units. This maps directly onto the modern question of how to slice packages in a monorepo. Split packages finely in REP style from day one, and every feature change starts spanning multiple packages.

## The dependency principles are now enforceable by tooling

The coupling principles — avoid cycles (ADP), depend from the volatile toward the stable (SDP), keep the stable things abstract (SAP) — hold up fine today. If anything, they're easier to follow now: ESLint's `import/no-cycle` and Go's package model catch cycles mechanically, and framework structure nudges dependencies from UI toward business logic. Plenty of teams use the tooling without knowing the principles; it's worth knowing what the tooling is protecting.

## "Replaceable details" now serve a different purpose

The book calls the UI and the database "details" that should be easy to swap out. When it was written, long-lived systems really did migrate DBMSs and frameworks. In modern web development, the day you swap PostgreSQL for another database almost never comes, so abstraction built "in case we change databases" rarely pays for itself. As I [wrote previously](/en/writing/rdb-architecture-balance), refusing to use the RDB's capabilities for the sake of abstraction defeats the purpose.

Boundaries still earn their keep — but for different reasons:

1. **Testability** — a boundary lets you inject test doubles and test business logic fast
2. **Intent visible in the structure** — when you open the directory tree, do you see the business or the framework?

The book's "Screaming Architecture" is the second point: the tree should show `accounting/` and `inventory/`, not `rails-app/` and `spring-hibernate/`. That claim lands harder today, not softer.

## Package by Component survived as the modular monolith

The book's later option — components that bundle business logic with its persistence, sliced vertically by business capability rather than horizontally by layer — is the ancestor of the frontend `features/` directory and the backend modular monolith. Under new names it became the mainstream, and as the pragmatic step before microservices it's the most useful part of the book.

## How to read it in the AI era

Now that AI generates layers and boilerplate in minutes, the cost of applying principles as _shapes_ has dropped to nearly zero. Which makes the other skill more important: understanding what each principle is **for**, and discarding the ones whose purpose doesn't apply to your system.

The book itself says to change which principles you emphasize as the project's phase changes. In other words, it's not a book of doctrine — it's a book of trade-offs. Don't transcribe the circles; decide which of the conflicting principles your product needs most right now. That, I think, is the most rewarding way to read Clean Architecture in 2026.
