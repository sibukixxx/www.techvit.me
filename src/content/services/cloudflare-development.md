---
title: "Cloudflare Development"
summary: "Cloudflare Pages / Workers / D1 / R2を使い、高速で運用コストの低いWebサイト・APIを構築します。"
target: "表示速度・運用コスト・保守性を重視してサイトやAPIを構築したい事業者"
problems:
  - "サーバー運用や常時稼働のインフラコストを抑えたいが、構成の設計に自信がない"
  - "静的サイトのつもりが、フォームやAPIが必要になり構成が複雑化している"
  - "既存サイトをCloudflareへ移行したいが、移行手順やリスクが分からない"
deliverables:
  - "Cloudflare Pages / Workers / D1 / R2を使ったアーキテクチャ設計"
  - "静的生成を基本としつつ、必要な部分だけAPI化する実装"
  - "既存サイトからCloudflareへの移行（DNS・リダイレクト設計を含む）"
approach:
  - "サイト・サービスの要件を整理し、静的化できる範囲とAPIが必要な範囲を切り分ける"
  - "Cloudflare Pages（静的部分）とWorkers（API・Functions）を組み合わせて実装する"
  - "DNS・リダイレクト・キャッシュ設定を含めて移行し、表示速度と運用コストを検証する"
techStack:
  - "Cloudflare Pages"
  - "Cloudflare Workers"
  - "Cloudflare D1 / R2"
  - "Astro"
  - "Wrangler"
priceRange: "要件により見積もり（既存サイトの移行は15万円〜）"
relatedProjects:
  - "small-manufacturer-hub"
relatedExpertise:
  - "cloudflare"
faq:
  - question: "既存のWordPressサイトから移行できますか？"
    answer: "対応可能です。コンテンツの移行方法とリダイレクト設計（既存URLのSEO評価を維持する設計）を含めて提案します。"
  - question: "サーバーレスにすることでできなくなることはありますか？"
    answer: "常時起動が前提の処理（長時間バッチなど）は工夫が必要です。要件をお聞きした上で、Workersで実現できるか、別の構成が必要かを判断します。"
order: 4
titleEn: "Cloudflare Development"
summaryEn: "Fast, low-cost websites and APIs built on Cloudflare Pages, Workers, D1, and R2."
descriptionEn: "I design static-first sites and APIs on Cloudflare, moving only the parts that truly need server logic into Workers, and migrate existing sites over with careful redirect design."
---

## どんな仕組みを作るか

本文がJavaScriptなしで取得できる静的サイトを基本にしつつ、フォーム送信や動的な処理が必要な部分だけをCloudflare Workers（Functions）で実装します。この設計思想は本サイト自体（Astro + Cloudflare Pages）でも採用しています。

## 移行のポイント

既存サイトからの移行では、URL構成の変更を最小限に抑え、リダイレクト設定でSEO評価を維持しながら、表示速度と運用コストを改善することを重視しています。
