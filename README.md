# www.techvit.me

<!-- ecosystem-expansion:v1 -->
## Expansion contract

This repository is one capability owner in the TechVit ecosystem. New ideas should extend the existing graph before creating another silo.

**Canonical responsibility:** TechVitのpublic acquisition / service discovery surface

When new work appears:

1. **Extend here** when the new behavior belongs to this repository's canonical responsibility.
2. **Integrate, don't copy** when another repository owns the concept. Exchange versioned API/artifact/event references; do not share databases or import another product's internals.
3. **Promote reusable capability only after real reuse appears.** Keep the first vertical slice close to its product; extract a common core when there are at least two real consumers or a deliberate public/private boundary.
4. **Create a new repository only** for a distinct product/vertical with its own lifecycle, deployment/security boundary, or OSS/commercial boundary. Its README must declare upstream/downstream owners from day one.
5. **Experiments may end without losing the asset.** Move validated rules, contracts, fixtures, and learnings into the canonical owner, then freeze/archive the duplicate implementation.

**Route new work:** 新しいサービスはまず既存サイトのservice/LP/case-study routeとして露出し、product backendやinternal operationsを公開サイトへ持ち込まない。

Cross-cutting owners: TechVit Admin = company operations; TechVit Platform = shared cloud/bootstrap/identity; Insight = research semantics; techvit-insight = managed research; Relayboard = work execution; AI Allowance Guard = privileged-action authority; EC Hub = commerce; AffiliateMediaOS/VideoForge = content production; ja-company-* = company-data/outreach producers; public/product sites = acquisition surfaces.

If ownership is unclear, implement the smallest vertical slice in the nearest existing owner first. Extract only when actual reuse proves the boundary.
<!-- /ecosystem-expansion:v1 -->

<!-- role-boundary:v1 -->
## Role and boundaries

**Role:** TechVitの公開Webサイト / acquisition surface。サービス、公開事例、技術・Research成果への入口を提供し、問い合わせや次の行動へつなぐ。

### Owns

- public navigation / landing pages
- public service and case-study presentation
- public SEO / structured content
- inquiry / conversion surface

### Does not own

- Client / Lead / Projectのcompany-wide SSOT
- private customer data
- Research engine semantics
- operational task execution
- product/domain business logic

### Integration

```text
Public report / product / service
        ↓
   www.techvit.me
        ↓ inquiry / conversion
business operations system
```

公開サイトを内部業務DBや各productのbackendへ肥大化させない。公開可能なartifactだけを受け取り、private operational stateは別systemに保持する。
