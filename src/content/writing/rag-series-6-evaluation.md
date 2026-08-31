---
title: RAG実践ガイド 第6回：RAG Evaluation — 品質をRetrievalとGenerationに分解する
description: Golden Datasetを50〜100問構築し、Precision@K / Recall@K / MRR / NDCGとFaithfulness等で、RAGの品質を診断可能にする。
category: engineering
tags: [RAG, Evaluation, LLM]
pubDate: 2026-08-16
relatedServices:
  - "llm-evaluation"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第6回。この連載で最も重要な回だ。ここまで各回で個別に測ってきた指標を、体系的な評価基盤にまとめる。

RAGの改善は評価なしには成立しない。「なんとなく良くなった」では、プロンプトを1行変えるたびに全件を人手で確認することになる。

## Golden Datasetを作る

まず評価の基準となる[Golden Dataset](/writing/what-is-a-golden-dataset)を50〜100問構築する。各レコードは次の形にする。

```
Question           質問
Expected Answer    期待する回答
Relevant Documents この質問の根拠となる文書（Chunk ID）
Metadata           質問タイプ、難易度、対象文書種別など
```

作り方の要点：

- 実際の問い合わせログや想定質問から、**正常系・エッジケース・失敗しやすいケース**をバランスよく含める
- 第4回で再現した「型番・固有名詞系の質問」のような、構成ごとに得意不得意が分かれる質問タイプをMetadataでタグ付けしておく。後で「どのタイプで劣化したか」を切り分けられる
- 最初から完璧を目指さない。50問で運用を始めて、本番で失敗した質問を随時追加していく

## Retrieval Evaluation

検索段の指標。Relevant Documentsが付与されていれば機械的に計算できる。

- **Precision@K**：Top-Kのうち正解だった割合。コンテキストのノイズの少なさ
- **Recall@K**：正解文書のうちTop-Kに入った割合。取りこぼしの少なさ
- **Hit Rate**：正解が1件でもTop-Kに入った質問の割合
- **MRR**：最初の正解が何位に出たか（順位の逆数の平均）。Rerankerの効果測定に向く
- **NDCG**：順位と関連度の段階評価を加味した総合指標

第5回の構成に対応させると、Retriever（Top 50）はRecall@50で、Reranker（Top 5）はPrecision@5とMRRで評価する、という整理になる。

## Generation Evaluation

生成段の指標。こちらは自動計算できないものが多く、LLM-as-a-Judgeを併用する。

- **Correctness**：Expected Answerと比べて回答が正しいか
- **Faithfulness / Groundedness**：回答が渡されたコンテキストに根拠を持つか。**Hallucinationの測定はここ**。コンテキストにない内容を語った回答は、たとえ事実として正しくてもFaithfulness違反として扱う
- **Answer Relevance**：質問に正面から答えているか
- **Citation correctness**：引用した出典は実際にその記述を含むか

## 品質を分解して診断する

この回の核心はここだ。

```
RAG Quality
   ↓
Retrieval quality
   +
Generation quality
```

回答がおかしいとき、必ずこの順で切り分ける。

1. **Retrievalは正解していたか？** → Relevant DocumentsがTop-Kに入っていなければRetrieverの問題。Chunking（第3回）、Hybrid化（第4回）、Reranker（第5回）に戻る
2. **Contextは正しいのにLLMが間違えたか？** → Generationの問題。プロンプト、モデル、コンテキストの並び順や量を疑う

この切り分けができると、「精度が悪い」という曖昧な報告が「型番系の質問でRecall@50が0.6に落ちている。Retrieverの問題なので、BM25の重みとトークナイズを見直す」という具体的なアクションに変わる。

## 実装：評価をパイプラインにする

評価は1回きりのスクリプトではなく、**変更のたびに実行できる回帰テスト**として実装する。

1. Golden Datasetを読み込み、全質問に対してRetrieval＋Generationを実行
2. Retrieval指標を機械計算、Generation指標をLLM-as-a-Judgeで採点
3. 結果を構成のバージョン（Embeddingモデル、Chunk size、Reranker有無…）とともに保存
4. 前回実行との差分をレポートする

これで第2〜5回でやってきた実験がすべて「再実行可能な比較」になる。改善を数値で証明できる状態、がこの連載のゴールだった。その基盤がこれだ。

## 今週の「自分の言葉で説明する」課題

- Hallucinationをどう測るか？FaithfulnessとCorrectnessはどう違うか？
- 回答が間違っていたとき、RetrievalとGenerationのどちらの問題かをどう切り分けるか？
- RAGの品質改善を顧客にどう証明するか？

次回（第7回）はAdvanced RAG。検索を一発で終わらせない設計 — Query Rewriting、HyDE、Self-RAG、Corrective RAGへ進む。
