---
title: RAG実践ガイド 第1回：RAGの原理 — なぜ検索で幻覚が減るのか
description: Knowledge CutoffとIn-context Learningから、RAGが成立する理由を説明する。フレームワークに頼らず最小構成のRAGを実装する。
category: engineering
tags: [RAG, LLM, Embedding]
pubDate: 2026-07-12
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第1回。まず「なぜRAGが成立するのか」を、仕組みから説明できるようにする。

## LLMが答えられないもの

LLMには2種類の知識の限界がある。

**Knowledge Cutoff。** モデルは学習データが収集された時点までの情報しか持っていない。昨日リリースした社内APIの仕様は、どんなに賢いモデルでも知らない。

**Parametric Knowledgeの限界。** 学習で得た知識はモデルのパラメータの中に「圧縮」されて格納されている。頻出の事実は正確に再現できるが、ロングテールの事実（社内文書、ニッチな製品仕様）は曖昧にしか保持されず、それらしく間違える。これがHallucinationの一因になる。

一方でLLMには強力な性質がある。**In-context Learning** — プロンプトに与えられた情報を、その場で読み取って利用する能力だ。パラメータに知識がなくても、コンテキストに正しい情報があれば、それに基づいて答えられる。

RAGはこの性質を利用する。**Parametric Knowledge（モデル内部の知識）に頼らず、Non-parametric Knowledge（外部の検索対象データ）をその都度取り出してコンテキストに注入する**。これがRAGが成立する理由のすべてだ。

## RAG vs Fine-tuning

「社内データを扱うならFine-tuningでは？」という質問には即答できるようにしたい。

| 観点 | RAG | Fine-tuning |
| --- | --- | --- |
| 知識の更新 | ドキュメントを差し替えるだけ | 再学習が必要 |
| 出典の提示 | 検索結果をそのまま引用できる | 原理的に困難 |
| 得意分野 | 事実の参照・最新情報 | 文体・形式・タスクへの適応 |
| コスト | 検索基盤の構築・運用 | 学習コスト＋データ整備 |

事実知識の注入はRAG、振る舞いの調整はFine-tuning、というのが基本の整理だ。「頻繁に更新される事実を、出典つきで答えたい」という要件はRAG以外で満たしにくい。

## 最小構成のRAGを作る

第1回の実装は、FastAPI + Reactで最小のRAGパイプラインを組む。

```
PDF
 ↓ Parse
 ↓ Chunk
 ↓ Embedding
 ↓ Vector DB
 ↓ Similarity Search
 ↓ Prompt
 ↓ LLM
 ↓ Answer + Citation
```

ここで重要なのは、**LangChainなどに隠しすぎないこと**。各工程をPythonで素朴に書き、何をしているかを把握する。

- **Parse**：PDFからテキストを抽出する。実務ではここが一番汚れ仕事になる
- **Chunk**：長いテキストを検索単位に分割する（第3回で徹底的に扱う）
- **Embedding**：テキストを数百〜数千次元のベクトルに変換する。意味が近いテキストはベクトル空間上で近くに配置される
- **Similarity Search**：質問のベクトルとChunkのベクトルのCosine Similarityを計算し、近い順にTop-kを取り出す
- **Prompt**：取り出したChunkをコンテキストとして質問と一緒にLLMに渡す
- **Citation**：どのChunkを根拠に答えたかを返す。出典を出せることがRAGの大きな価値になる

Cosine Similarityの計算自体はnumpyで数行だ。ここを一度自分で書いておくと、後でVector DBやANNインデックスが「何をサボるための仕組みか」が理解できる。

## RAGのFailure Modeを最初から意識する

RAGは魔法ではなく、壊れ方にパターンがある。連載を通して扱うが、最初に全体像だけ持っておく。

1. **検索が外れる**：必要な文書がTop-kに入らない（Retrieval失敗）
2. **Chunkが不適切**：必要な情報が分割で分断されている
3. **コンテキストは正しいのに生成が間違う**：LLMがコンテキストを無視・誤読する（Generation失敗）
4. **そもそもデータにない**：どう検索しても答えは出ない

回答がおかしいとき「どの段階で壊れたのか」を切り分けられることが、RAGエンジニアの実力になる。この切り分けを体系化するのが第6回のEvaluationだ。

## 今週の「自分の言葉で説明する」課題

- なぜコンテキストに情報を入れると幻覚が減るのか？
- RAGとFine-tuningをどう使い分けるか？
- Cosine Similarityは何を測っているのか？

次回（第2回）は、EmbeddingとVector Searchを掘り下げる。「Embeddingモデルを変えると、なぜ検索結果が変わるのか」まで説明できるようにする。
