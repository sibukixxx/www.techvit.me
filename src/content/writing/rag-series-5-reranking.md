---
title: RAG実践ガイド 第5回：Reranking — RetrieverはRecall、RerankerはPrecision
description: Bi-encoderとCross Encoderの違いから、Top 50→Top 5に絞り込む2段構成の設計とLatencyトレードオフまで。
category: engineering
tags: [RAG, Reranking, Retrieval]
pubDate: 2026-09-28
draft: true
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第5回。[前回](/writing/rag-series-4-hybrid-retrieval)でHybrid Searchまで組んだ。今回はRerankingを入れて検索を2段構成にする。ここはRAG案件で明確に武器になる部分だ。

## なぜ1段では足りないのか

Embedding検索（およびBM25）は高速だが、精度には構造的な上限がある。理由は**Bi-encoder**という構造にある。

- **Bi-encoder**：クエリと文書を**別々に**ベクトル化し、あとから類似度を計算する。文書側は事前計算できるので数百万件でも高速。ただし、クエリと文書を突き合わせた上での判断（「この文書はこの質問に本当に答えているか」）はできない
- **Cross Encoder**：クエリと文書を**ペアで1つのモデルに入力**し、関連度スコアを直接出力する。両者のトークンが相互に参照し合うため精度は圧倒的に高い。ただし事前計算が効かず、1ペアごとに推論が必要で遅い

Cross Encoderを全文書に適用するのは計算量的に不可能。そこで役割を分ける。

## 2段構成のパイプライン

```
Query
 ↓
Retriever（Hybrid Search）
 ↓
Top 50        ← Candidate Generation：広く拾う
 ↓
Reranker（Cross Encoder）
 ↓
Top 5         ← Ranking：精密に並べ直す
 ↓
LLM
```

この構成の設計思想は一言で表せる。

**RetrieverはRecall重視。RerankerはPrecision重視。**

- Retrieverの仕事は「正解をTop 50のどこかに入れること」。順位は問わない。取りこぼしたら後段では二度と復活できないので、Recallに全振りする
- Rerankerの仕事は「Top 50の中から本当に関連する5件を先頭に並べること」。LLMに渡るのはこの5件なので、Precisionに全振りする

この役割分担を説明できると、「Top-kをいくつにすべきか」という質問にも段階ごとに答えられるようになる。第1段のkと第2段のkは、まったく別の理屈で決まるパラメータだ。

## 実装と実験

1. 既存のHybrid SearchをTop 50を返すように変更する
2. Cross Encoder系のRerankerモデル（オープンモデルまたはAPI型のRerankerサービス）を挟み、Top 5に絞る
3. Rerankerあり／なしで比較する。指標は**Precision@5**と、正解文書の順位を測る**MRR**（第6回で正式に扱う）
4. **Latencyも必ず測る。** Rerankerは検索段で最も遅いコンポーネントになりやすい。候補数50を30や20にしたときの精度とLatencyの変化も見る

体感として、Retrievalの失敗のうち「正解はTop 50に入っているのに上位に来ない」タイプはRerankerで劇的に改善する。一方「そもそもTop 50に入っていない」失敗にはRerankerは無力だ。この切り分けができると、精度問題への打ち手を間違えなくなる。

## 今週の「自分の言葉で説明する」課題

- Cross EncoderはなぜBi-encoderより精度が高く、なぜ遅いのか？
- RecallとPrecisionのトレードオフを、2段構成はどう解消しているか？
- Rerankerを入れても改善しないのは、どんな失敗のときか？

次回（第6回）はRAG Evaluation。ここまで感覚と簡易な指標でやってきた評価を、Golden Datasetに基づく体系的な評価に引き上げる。この連載で最も重要な回になる。
