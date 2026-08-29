---
title: 個人開発でNext.jsではなくAstroを選ぶ理由
description: 常時SSRが必要ないサイトでは、Astro + Content Collections + Cloudflare Pagesの構成が保守コストと速度の両面で有利という話。
category: engineering
tags: [Astro, Cloudflare, Next.js]
pubDate: 2026-06-01
relatedServices:
  - "cloudflare-development"
  - "web-saas-development"
---

個人サイトや小規模なプロダクトサイトでは、複雑なバックエンドを持たない静的生成中心の構成の方が、保守コストと表示速度の両面で有利になることが多い。

Astro + Content Collections + Cloudflare Pagesの組み合わせであれば、動的処理が必要な部分だけをCloudflare Pages Functionsに切り出せるため、常時SSRを前提とするNext.jsのような構成にしなくても十分に要件を満たせる。
