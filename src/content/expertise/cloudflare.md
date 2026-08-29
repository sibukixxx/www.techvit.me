---
title: "Cloudflare"
summary: "Cloudflare Pages / Workers / D1 / R2を使い、高速で運用コストの低いサイト・APIを構築します。"
highlights:
  - "Cloudflare Pages + Workersによる静的サイト＋API構成の設計"
  - "既存サイトからCloudflareへの移行（DNS・リダイレクト設計を含む）"
  - "Wranglerを使ったデプロイ・環境管理"
  - "本サイト（www.techvit.me）自体もAstro + Cloudflare Pagesで構築・運用"
relatedServices:
  - "cloudflare-development"
  - "web-saas-development"
relatedProjects:
  - "small-manufacturer-hub"
relatedWriting:
  - "nextjs-vs-astro-for-solo-builder"
order: 2
---

## 実務での使い方

本サイトを含め、常時SSRが不要なサイトはAstro + Cloudflare Pagesで構築し、フォーム送信などの動的処理だけをCloudflare Pages Functions（Workers）に切り出す構成を基本にしています。運営中の[Small Manufacturer Hub](/projects/small-manufacturer-hub)でも同様の構成を採用しています。
