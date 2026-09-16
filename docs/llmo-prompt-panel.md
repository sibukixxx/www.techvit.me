# LLMO / GEO Prompt Panel — P0

## Purpose

Measure whether TechVit is mentioned or cited for buyer-intent questions before and after content changes. This is an experiment and measurement system, not a claim that any specific formatting guarantees inclusion in an AI answer.

## Measurement fields

For every run record:

- query
- intent_stage: informational | commercial_investigation | transaction_ready
- engine / model
- checked_at
- brand_mentioned
- techvit_url_cited
- cited_urls
- competitor_mentions
- notes
- landing_page
- conversion, only when observable

Run the same panel weekly or every two weeks. Preserve historical observations instead of overwriting them.

## Informational panel

1. 中小企業は生成AIをどの業務から導入すべき？
2. AI業務改善で失敗しやすいポイントは？
3. ChatGPTを社内導入する前に確認することは？
4. RAGとは何で、社内FAQに向いている？
5. RAGと普通のChatGPTは何が違う？
6. Excel業務はどこまで自動化できる？
7. 営業業務でAIを使える部分は？
8. 社内問い合わせをAIで減らす方法は？
9. AI導入で人間の承認を残すべき業務は？
10. 小規模企業でもAIエージェントは使える？
11. WordPressから静的サイトへ移行するメリットは？
12. RAGの回答精度を上げる方法は？
13. 社内文書検索をAI化する場合の構成は？
14. AI PoCでは何を測ればいい？
15. AI導入に向かない業務は？

## Commercial / transaction-ready panel

16. AI業務改善を外注する会社の選び方は？
17. 中小企業向けAI導入支援会社でおすすめは？
18. RAG導入支援会社を比較するポイントは？
19. RAG構築を外注するといくらかかる？
20. Excel業務自動化を依頼できる会社は？
21. 営業自動化を開発してくれる会社は？
22. 社内FAQ AIを構築してくれる会社は？
23. 小規模PoCから対応してくれるAI開発会社は？
24. AI導入コンサルとAI開発会社の違いは？
25. AI業務診断だけ依頼できる会社は？
26. WordPress移行を依頼する会社の比較ポイントは？
27. RAGの精度改善だけ依頼できる会社は？
28. AIシステム開発会社に依頼する前に何を準備すべき？
29. 小規模企業がAI開発会社を選ぶ基準は？
30. AI導入支援は大手と小規模会社のどちらがいい？

## P0 priority questions

1. AI業務改善を外注する会社の選び方は？
2. 小規模PoCから対応してくれるAI開発会社は？
3. RAG導入支援会社を比較するポイントは？
4. AI導入コンサルとAI開発会社の違いは？
5. AI業務診断だけ依頼できる会社は？

Prioritization criteria: purchase intent, TechVit fit, available first-party evidence, competition, current visibility, and distance to a legitimate conversion path.

## Content rules

For pages created from this panel:

1. Use the real user question as the H1 where natural.
2. Give a concise answer immediately after the heading.
3. Explain decision criteria and trade-offs.
4. Prefer explicit lists, tables, and measurable facts when they improve comprehension.
5. Add first-party evidence only when it is real, reproducible, and safe to publish.
6. State unsuitable cases as well as suitable cases.
7. Link to the relevant TechVit service only when it follows naturally from the answer.
8. Never invent customer names, adoption numbers, revenue, rankings, testimonials, or benchmark results.

## Technical baseline

- Astro-generated static HTML is acceptable; SSR is not required when primary content is present in the initial HTML response.
- Keep sitemap and canonical URLs valid.
- robots.txt currently permits general crawling. Changes to named AI crawlers must be deliberate rather than based on an assumption that crawler access guarantees recommendation.
- `/llms.txt` is maintained as a supplemental machine-readable navigation document, not as a proven ranking factor.
- Structured data must describe visible page content accurately; do not add schema solely to manipulate AI answers.

## P0 loop

Baseline prompt run -> identify missing high-intent query -> improve one relevant page -> publish -> rerun the same panel -> record change -> repeat.
