---
title: Are DDD and Clean Architecture Costing You the Strengths of Your RDB?
description: When strict aggregate boundaries and repository abstractions turn a problem one JOIN could solve into a CQRS project. On the order in which design techniques should be applied.
category: engineering
tags: [Architecture, DDD, CQRS, PostgreSQL]
pubDate: 2026-08-31
relatedServices:
  - "technical-consulting"
  - "web-saas-development"
---

There is a question I keep coming back to when thinking about web system architecture:

**Are we restricting what the RDB is good at for design reasons, and then solving the resulting problems with even more sophisticated architecture?**

DDD, Clean Architecture, and CQRS are all valid techniques. But applied in the wrong order, or to the wrong problems, designs meant to improve a system end up making it more complex.

## An RDB is not just a place to store data

PostgreSQL and MySQL carry decades of refinement: JOINs, indexes, transactions, constraints, a query optimizer, aggregation, locking and isolation. For a typical web system,

```
HTTP Request → Application → PostgreSQL
```

scales remarkably far.

Apply Clean Architecture strictly, though, and you get:

```
Controller → UseCase → Repository Interface
  → Repository Implementation → ORM → Database
```

Nothing wrong with this structure in itself — separation of concerns and testability are real benefits. The trouble starts when principles like "one repository per aggregate," "avoid crossing aggregate boundaries," and "the database is an infrastructure detail" get applied uniformly, including to the read side, without considering the nature of the system.

## Are we creating our own performance problems?

Consider an order list screen showing orders plus customer info, product info, payment status, and shipping status. With an RDB, one query with the right JOINs fetches all of it. Enforce aggregate boundaries strictly, and instead you get:

```
Fetch order list
  → OrderRepository
  → CustomerRepository
  → ProductRepository
  → ShippingRepository
```

which leads to N+1 problems and a flood of queries. Then someone says "reads are slow, let's build a read model," and:

```
Build a read model → Adopt CQRS → Split off a read DB
  → Sync data via events → Now you need an event bus
  → Now you must reason about eventual consistency
```

Complexity climbs fast. If the scale and requirements justify it, this is a rational choice. But first, ask:

**Wasn't this a problem the right JOIN would have solved from the start?**

It's worth noting that the DDD literature itself allows query services that bypass repositories for the read side. Building list screens through aggregates is usually an over-application of DDD, not a requirement of it.

## CQRS is not the villain

This is not an argument against CQRS. Some systems have a genuinely complex write side — order → reserve inventory → charge payment → arrange shipping — while the read side serves dashboards, analytics, search, and reports with entirely different demands. Separating write and read models makes sense there, as it does when read and write volumes differ wildly, or when you want Elasticsearch handling search alone.

Also, CQRS at its core means separating read and write models — a split read DB and an event bus are not mandatory. A lightweight CQRS, with dedicated read queries against the same database, is often enough.

What matters is not whether you *can* use CQRS, but **whether this problem actually needs it.**

## Use the RDB properly first

For a CRUD-centric web service, check what the RDB can do before changing the architecture:

1. Look at the SQL actually being issued
2. Read the plan with EXPLAIN ANALYZE
3. Revisit indexes and JOINs
4. Eliminate N+1 queries
5. Check the connection pool
6. Add a cache if needed
7. Only then, reconsider the architecture

Considering CQRS after that is not too late. A DBMS is an enormous piece of software backed by decades of research into query optimization, concurrency control, and consistency. Leaving that capability unused and solving everything in the application layer is not necessarily good design.

## "Not depending on the DB" is not "not using the DB"

Clean Architecture treats the database as an infrastructure detail in order to decouple business logic from a specific ORM or database product — not to make you avoid database features. If you've chosen PostgreSQL but delegate neither JOINs nor constraints to it, reimplementing the same machinery in the application layer, that isn't loose coupling; it's leaving a powerful tool on the table. Abstraction that discards the capabilities of the layer beneath it defeats its own purpose.

## Architecture is a means, not a goal

Adopting a sophisticated architecture and doing sophisticated design are not the same thing. The genuinely hard judgment in design is often "this system doesn't need machinery that complex." Knowing how to introduce it when needed, while keeping things simple until then — that too is a design skill.

AI-assisted coding has made this more important, not less. Repositories, use cases, DTOs, mappers, domain events, read models — AI generates all of it in minutes. The implementation effort that used to act as a natural brake is disappearing.

But **the cost of writing code has dropped; the cost of maintaining complexity has not.** Someone still has to understand the spec, test it, debug it during incidents, and change it years later. Precisely because code is cheap to generate, "does this code need to exist at all?" matters more than before.

Understanding complex architectures well enough to deliberately not use them. Letting the RDB solve what the RDB solves, and the application solve what belongs in the application. Judging where that boundary lies is part of what engineering design skill means.
