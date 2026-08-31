---
title: RAG実践ガイド 第3回：Chunkingを徹底する — 分割の仕方が検索品質を決める
description: Fixed-size / Recursive / Semantic / Parent-child などのChunking戦略と、Chunk size 200/500/1000の比較実験。
category: engineering
tags: [RAG, Chunking, Retrieval]
pubDate: 2026-07-26
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第3回。[前回](/writing/rag-series-2-embedding-vector-search)はEmbeddingとVector Searchを扱った。今回はその手前の工程、Chunkingに集中する。地味に見えるが、RAGの検索品質はここで大きく決まる。

## なぜChunkingが必要で、なぜ難しいのか

ドキュメントを丸ごとEmbeddingできない理由は2つある。Embeddingモデルの入力長に上限があること、そして**検索の粒度**の問題だ。100ページのマニュアルを1本のベクトルにすると、その中の特定の1段落を探す用途では「平均化されすぎて」何にでも少し似た、何にも強く似ないベクトルになる。

かといって細かくすればいいわけでもない。ここに根本的なトレードオフがある。

- **Chunkが小さすぎる** → 1つのChunkに文脈が入りきらず、「それ」「この設定」のような参照が切れて意味が失われる。検索でヒットしても、LLMに渡すコンテキストとして不十分
- **Chunkが大きすぎる** → 1つのChunkに複数の話題が混ざり、ベクトルがぼやけて検索粒度が下がる。ヒットしても不要情報が多く、コンテキストを圧迫する

つまり**検索に最適なサイズと、生成に最適なサイズは一致しない**。これがChunking戦略が多数存在する理由だ。

## 主要なChunking戦略

- **Fixed-size Chunking**：固定文字数（＋overlap）で機械的に切る。ベースラインとして必須
- **Sentence Chunking**：文境界で切る。文の途中で分断されない
- **Recursive Chunking**：段落→文→文字と、大きい区切りから順に再帰的に分割する。構造をある程度尊重しつつサイズを揃えられる実務のデファクト
- **Semantic Chunking**：隣接文のEmbedding類似度が大きく変わる箇所（話題の切れ目）で分割する。計算コストと引き換えに意味的なまとまりを得る
- **Parent-child Retrieval**：**検索は小さいchild chunkで行い、LLMにはそれを含む大きいparent chunkを渡す**。検索粒度と生成文脈の両立という、上のトレードオフへの直接の解になる

**Chunk overlap**は隣接Chunk間で末尾と先頭を重複させる仕組みで、境界で文脈が切れる問題を緩和する。ただし増やすほどインデックスは冗長になり、同じ文書の断片がTop-kを占有しやすくもなる。

もう1つの制約が**Context Window**だ。Top-k件のChunkはすべてLLMのコンテキストに入る。Chunk size × k がプロンプト予算に収まるか、コストとLatencyも含めて設計する必要がある。

## 実験：Chunk size 200 / 500 / 1000 を比較する

同じコーパス・同じ質問セットで、Chunk sizeだけを変えて比較する。

1. Chunk size 200 / 500 / 1000（overlapは各10〜20%）で3本のインデックスを作る
2. 前回作った質問セットでRecall@5とPrecision@5を測る
3. 数字だけでなく、**ヒットしたChunkの中身を実際に読む**

読んでみると関係が体感できるはずだ。200では正解の断片はヒットするが前提が切れている。1000では正解を含むChunkがヒットしても、その大半が無関係な記述で埋まっている。この「実データで確認した」経験が、後で顧客に「Chunk sizeはどう決めたんですか」と聞かれたときの答えになる。

余裕があればRecursive ChunkingとParent-child Retrievalも同じ条件で比較し、Fixed-sizeに対してどの質問タイプで改善するかを見ておきたい。

## 今週の「自分の言葉で説明する」課題

- なぜChunkを大きくしすぎるとRAG品質が落ちる可能性があるのか？
- Overlapは何を解決し、何を悪化させるか？
- Parent-child Retrievalはどのトレードオフをどう解消しているか？

次回（第4回）はRetrievalを本格化する。Dense検索が苦手なケースをあえて再現し、BM25とのHybrid Searchで補う。ここから「RAG作ったことあります」のレベルを抜け出していく。
