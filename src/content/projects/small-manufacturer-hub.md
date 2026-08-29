---
title: Small Manufacturer Hub
description: 小規模製造業向けの無料業務ツール・SaaS比較プラットフォーム。
status: live
role: Solo builder / Operator
stack: [Astro, Cloudflare, SEO, Affiliate]
featured: true
order: 1
pubDate: 2026-03-01
challenge: "小規模製造業では発注量・在庫水準の計算を勘や経験で行っていることが多く、また業務改善に使えるSaaSの比較情報も少ない"
constraints:
  - "受託開発ではなく自社運営のプロダクトとして、開発だけでなく集客・収益化まで一人で成立させる必要がある"
  - "小規模事業者が気軽に使えるよう、会員登録なしで無料利用できる形にする"
outcome:
  - "Reorder Point / Safety Stock / EOQの計算ツールとSaaS比較コンテンツを無料公開"
  - "エンジニアリング・SEO・アフィリエイトを組み合わせた収益化の実証実験として継続運用中"
relatedServices:
  - "cloudflare-development"
  - "web-saas-development"
---

## アーキテクチャ

Astro + Cloudflare Pagesによる静的サイトを基本とし、計算ツール部分はブラウザ内で完結するクライアントサイドの処理として実装した。サーバー側の常時稼働コストをかけずに、無料ツールを提供し続けられる構成にしている。

## 実装

以下の機能を実装・公開している。

- Reorder Point Calculator（発注点計算）
- Safety Stock Calculator（安全在庫計算）
- EOQ Calculator（経済的発注量計算）
- SaaS比較コンテンツ
- アフィリエイトによるマネタイズ

技術的な構成は[Cloudflare](/expertise/cloudflare)で使っている考え方と同じで、常時SSRを前提にせず静的化できる部分を最大化している。立ち上げの記録は[Writing](/writing/small-manufacturer-hub-launch-log)にまとめている。
