---
title: RAG実践ガイド 第4回：Retrievalの本格化 — Dense、BM25、そしてHybrid Search
description: Dense検索が固有名詞・型番・エラーコードで失敗する理由を再現し、BM25とのHybrid Search＋RRFで補う。
category: engineering
tags: [RAG, Retrieval, Hybrid Search]
pubDate: 2026-09-21
draft: true
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第4回。[前回](/writing/rag-series-3-chunking)まででEmbedding検索の基礎とChunkingを固めた。今回はRetrievalそのものを本格化する。ここから「RAG作ったことあります」のレベルを抜け出す。

## Dense Retrievalの弱点を自分で再現する

**Dense Retrieval**（Embeddingによる意味検索）は言い換えに強い。しかし明確な弱点がある。**「製品番号」「エラーコード」「固有名詞」だ。**

今週最初にやるべき実験は、この失敗の再現だ。コーパスに型番やエラーコード（`ERR-4032`、`XR-500B` のような文字列）を含む文書を入れ、それをそのまま検索してみる。Embedding空間では `ERR-4032` と `ERR-4023` はほぼ同じ場所に置かれる。意味的にはどちらも「エラーコードらしきもの」でしかないからだ。結果、完全一致すべき検索が平然と外れる。

これを自分の手で再現しておくと、Hybrid Searchが「なぜ効くのか」が腹落ちする。

## Sparse Retrieval — BM25

**Sparse Retrieval**は古典的なキーワード検索で、代表が**BM25**だ。単語の出現頻度（TF）と希少性（IDF）に基づいてスコアリングする。

- 希少な語（型番、エラーコード、固有名詞）の完全一致に非常に強い
- 語が一致しなければゼロ。言い換え・類義語には無力

つまりDenseとSparseは弱点が正確に補完関係にある。だから組み合わせる。

## Hybrid Search と RRF

```
Dense Search ─┐
              ├→ Fusion → Candidates
BM25 ─────────┘
```

両方で検索して候補を統合（Fusion）する。問題は、Cosine SimilarityのスコアとBM25のスコアはスケールが全く違い、素朴に足せないことだ。

そこで使われるのが**RRF（Reciprocal Rank Fusion）**。スコアを捨てて順位だけを使う。

```
RRF score(d) = Σ 1 / (k + rank_i(d))    （kは60程度の定数）
```

各検索結果で上位にいる文書ほど高いスコアになり、スコアのスケール差を正規化なしで吸収できる。単純だが頑健で、Hybrid Searchのデファクトになっている。実装して、前回までの質問セット＋型番系の質問でDense単体・BM25単体・Hybridの3構成をRecall@5で比較する。

## 検索の前後を強化する

**Metadata Filtering。** Chunkに文書種別・日付・製品名などのメタデータを付与し、ベクトル検索の前に絞り込む。「2024年以降のリリースノートから探す」のような要件はベクトル空間では表現できない。実務のRAGではほぼ必須になる。

**Query Expansion。** クエリを同義語や関連語で拡張して検索の網を広げる。

**Multi-query Retrieval。** LLMに元の質問を複数の異なる観点の質問に書き換えさせ、それぞれで検索して結果を統合する。1つの質問文のEmbeddingが空間上の「一点」でしかないという制約を、複数の点を打つことで緩和する。

## 今週の実験まとめ

1. 型番・エラーコード検索でDense Retrievalの失敗を再現する
2. BM25を実装（またはライブラリ導入）し、同じケースで成功することを確認する
3. RRFでHybrid Searchを組み、3構成をRecall@5で比較する
4. Metadata FilteringとMulti-query Retrievalを追加し、効果があった質問タイプを記録する

## 今週の「自分の言葉で説明する」課題

- Vector SearchとBM25をどう使い分けるか？
- Hybrid Searchはなぜ効くのか？RRFは何を解決しているか？
- Metadata Filteringが必要になるのはどんな要件のときか？

次回（第5回）はReranking。候補を広く取って（Recall重視）、精密に並べ直す（Precision重視）という2段構成に進む。RAG案件で武器になる部分だ。
