# www.techvit.me

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
