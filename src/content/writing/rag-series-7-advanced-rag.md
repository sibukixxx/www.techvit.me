---
title: RAG実践ガイド 第7回：Advanced RAG — 検索を一発で終わらせない設計
description: Query Rewriting、HyDE、Context Compression、Self-RAG、Corrective RAG、Agentic RAG。ループを持つRAGの設計。
category: engineering
tags: [RAG, Agent, LLM]
pubDate: 2026-10-12
draft: true
relatedServices:
  - "ai-development"
  - "llm-evaluation"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第7回。[前回](/writing/rag-series-6-evaluation)で評価基盤ができた。ここからは実務のRAGに近づく。改善が数値で測れるようになった今、より複雑な手法を「効いたかどうか」を確かめながら導入できる。

## クエリ側を強化する

ユーザーの質問文は、検索クエリとして最適とは限らない。まずクエリ側に手を入れる。

- **Query Rewriting**：曖昧な質問、会話の文脈に依存した質問（「それの設定方法は？」）を、LLMで自己完結した検索クエリに書き換える
- **Query Expansion / Multi-query Retrieval**：第4回の再掲。1つの質問を複数の観点に展開して検索し、統合する
- **HyDE（Hypothetical Document Embeddings）**：質問文で検索する代わりに、**LLMに仮の回答文書を生成させ、その文書のEmbeddingで検索する**。「質問と文書は埋め込み空間上で形が違う」という非対称検索の問題を、質問を文書の形に変換することで回避する発想だ。仮回答の内容が間違っていても、「正解が書いてありそうな文書」に空間上で近づくことが多い

## コンテキスト側を強化する

- **Context Compression**：検索でヒットしたChunkから、質問に関係する部分だけをLLMや軽量モデルで抽出・要約してからコンテキストに詰める。ノイズ削減とトークン削減を同時に狙う
- **Parent Document Retrieval**：第3回で扱ったParent-childの発展形。小さい単位で検索し、大きい単位で渡す

## ループを持つRAG — Self-RAG / Corrective RAG

ここが今回の核心だ。これまでのパイプラインは「検索→生成」の一方通行だった。しかし人間が調べ物をするとき、一発の検索で終えることはない。検索し、結果を見て、クエリを変えてまた検索する。

```
Question
 ↓
Query analysis
 ↓
Search
 ↓
Enough evidence?
 ├ YES → Answer
 └ NO
    ↓
 Query rewrite
    ↓
 Search again
```

- **Corrective RAG**：検索結果の関連度を評価器で判定し、不十分ならクエリを修正して再検索（またはWeb検索等の代替ソースへフォールバック）する
- **Self-RAG**：モデル自身が「今検索すべきか」「この検索結果は使えるか」「この生成はコンテキストに忠実か」を自己評価しながら生成を進める
- **Agentic RAG**：検索をLLMエージェントの「ツール」として位置づけ、質問の分解、複数ソースの使い分け、検索の繰り返しをエージェントの判断に委ねる

一方通行のパイプラインなら素のPythonで書けるが、**状態を持ち、条件分岐し、ループする**設計になると、グラフとしてフローを定義できるLangGraphのようなフレームワークを使う意味が出てくる。「まずフレームワークなしで理解し、必要になってから導入する」という連載の方針は、ここで回収される。

## 必ず評価とセットで導入する

Advanced RAGの手法は「入れれば良くなる」ものではない。Latencyは確実に悪化するし、Query Rewritingが質問の意図を歪めて逆に精度を落とすこともある。

だから導入は必ず第6回の評価パイプラインとセットで行う。

1. ベースライン（第5回構成）の指標を記録
2. 手法を1つ追加し、Golden Datasetで再評価
3. 指標の差分と、Latency・コストの増分を並べて採否を判断する

「HyDEを入れたらRecall@5が0.79→0.85に上がったが、Latencyが1.4倍になった」という形で語れることが、この連載が目指す実力だ。

## 今週の「自分の言葉で説明する」課題

- HyDEはなぜ効くのか？どんなケースで効かないか？
- Self-RAGとCorrective RAGの違いは？
- Agentic RAGを導入すべき要件と、やりすぎになる要件の境界はどこか？

次回（第8回・最終回）はProduction RAG。TerraformでのIaC化、Observability、Cost/Latency監視まで入れて、「デモ」を「システム」にする。
