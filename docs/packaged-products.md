# パッケージ商品の統合方針

## 背景

TechVitには2つの系統がある。

| 系統           | 実体                          | 性質                                |
| -------------- | ----------------------------- | ----------------------------------- |
| 受託サービス   | `src/content/services/` の9件 | 要件次第で見積もる。CTAは`/contact` |
| パッケージ商品 | 専用LPを持つ定額商品          | 範囲と価格が固定。CTAはLP           |

パッケージ商品は`src/lib/products.ts`に定義され、`/en/`のProducts / Toolsからのみ参照されていた。
このため日本語サイトからは一切到達できない状態が続いていた。

## 役割分担

techvit.meを唯一の営業・SEOハブとし、LPを着地点に置く。

|      | techvit.me `/services/<id>/`          | 専用LP                             |
| ---- | ------------------------------------- | ---------------------------------- |
| 役割 | サービス定義（範囲・進め方・価格）    | コンバージョン（多言語・地域特化） |
| 読者 | 日本語圏のB2B、他サービスと比較検討中 | 対象地域の言語で今すぐ依頼したい   |
| CTA  | LPへ送客（`landingPage`）             | 申し込みフォーム                   |

ターゲット地域と言語が異なるため実質的に競合しない。canonicalは互いに自分自身のままでよい。

## 掲載ポリシー（重要）

`docs/information-architecture.md`のCaseポリシーがそのまま適用される。

> 架空の顧客事例や効果数値は掲載しません。顧客名、導入効果、Benchmarkは測定条件と根拠が存在するものだけを追加する。

LPには集客用の実績数値・証言・認定表記が含まれていることがある。
**LPからtechvit.meへ移してよいのは、価格・納期・提供範囲・FAQといった事実ベースの情報だけ。**
実績数値と証言は、測定条件と根拠を提示できるようになるまで持ち込まない。

## LP → services スキーマの対応

LPが`@lp/core`の`registerTranslations`形式（`LP/packages/<id>/src/i18n/ja.ts`）を使っている場合、
frontmatterへほぼ1対1で移せる。

| LP `ja.ts`                             | services frontmatter                                              |
| -------------------------------------- | ----------------------------------------------------------------- |
| `solution.description`                 | `summary`                                                         |
| `hero.subtitle` + READMEのターゲット   | `target`                                                          |
| `pain.points`                          | `problems`                                                        |
| `service.included`                     | `deliverables`                                                    |
| `flow.steps`                           | `approach`                                                        |
| `pricing.localized.ja`（`lp.init.ts`） | `priceRange`                                                      |
| `whyUs.points`の納期                   | `deliveryTime` / `deliveryTimeEn`                                 |
| `faq.items`                            | `faq`                                                             |
| `hero.cta`                             | `landingPage.label`                                               |
| `en.ts`の同項目                        | `titleEn` / `summaryEn` / `descriptionEn` / `landingPage.labelEn` |

`service.excluded`は本文に書き、範囲外を明示する。

## 移行状況

| 商品                         | LPのURL                                         | ソース                                         | 状態                                     |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| LINE公式アカウント初期設定   | https://line-setup.quick-check.net/             | `~/workspace/sibukixxx/LP/packages/line-setup` | 移行済み → `/services/line-setup/`       |
| LINEフォロー導線セットアップ | https://lp-customer-followup-setup.pages.dev/   | 未確認（LP monorepoに無い）                    | 未移行                                   |
| 記事集客スプリント           | https://lp-content-growth-sprint.pages.dev/     | 未確認（LP monorepoに無い）                    | 未移行                                   |
| AGING LAB                    | https://aging-lab.quick-check.net/              | —                                              | 対象外。メディアでありServiceではない    |
| Small Manufacturer Hub       | https://small-manufacturer-hub.quick-check.net/ | —                                              | 対象外。無料ツール。`/projects/`側で扱う |
| TechVit Solutions            | `/solutions/`                                   | 本リポジトリ                                   | 対象外。サイト内導線                     |

未移行の2件はpages.devの暫定ドメインのままで、独自ドメインが未設定。
移行時にドメインを確定させてから`landingPage.url`に入れる。

## 追加手順

1. `src/content/services/<id>.md`を作る。上表に従ってLPのコピーを移す
2. `landingPage`にLPのURLとCTA文言（日英）を入れる
3. `order`を決める。トップページのSERVICESは`order`昇順の先頭6件しか出ない（`src/pages/index.astro`）。
   `docs/information-architecture.md`はProductsをトップの主役から外す方針なので、既定では10以降に置く
4. `pnpm build`を通す。`check:locales`が英語欄の日本語混入を検出し、英語未対応のサービス一覧を警告する
5. LP側の`lp.init.ts`の`links.company`に`https://www.techvit.me`を設定し、相互リンクにする

## 残課題

- LP側`links.company`が空のTODOのまま。LP monorepo側の変更が必要
- `buildServiceJsonLd`の`areaServed`が`'JP'`固定。line-setupは台湾・タイ・韓国も対象なので、
  地域を持つサービスが増えたらフィールド化する
- `/en/`には`/services/<id>`に相当する詳細ページが無く、`/en/services`のdigestのみ。
  `products.ts`はEN側の商品レジストリとして当面残す
