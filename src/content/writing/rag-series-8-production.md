---
title: RAG実践ガイド 第8回：Production RAG — 「デモ」を「システム」にする
description: Terraformによる基盤のIaC化、Observability、Prompt Versioning、評価パイプラインのCI組み込み、Cost/Latency監視。連載の最終回。
category: engineering
tags: [RAG, Terraform, Observability]
pubDate: 2026-10-19
draft: true
relatedServices:
  - "aws-infrastructure"
  - "ai-development"
  - "llm-evaluation"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の最終回。ここまでで検索・評価・改善のループは回るようになった。最後に「デモ」を「システム」にする。RAGの案件が失敗するのは、たいていモデルの性能ではなく運用設計の欠如が原因だ。

## 全体アーキテクチャ

```
                    ┌→ Vector DB
React → FastAPI ────┤
                    ├→ PostgreSQL
                    ├→ Object Storage
                    └→ LLM API
                         ↓
                    Observability
```

- **Vector DB**：検索インデックス。pgvectorを使うならPostgreSQLに統合する選択もある
- **PostgreSQL**：会話履歴、ドキュメントのメタデータ、評価結果
- **Object Storage**：原本ドキュメント（PDF等）の保管。インデックスは常に原本から再構築できるようにする
- **Observability**：後述。RAGでは特に重要になる

## TerraformでIaC化する

この基盤をTerraformでコード化する。対象は次のモジュール群だ。

- **Network**：VPC、サブネット、外部APIへの経路
- **IAM**：最小権限のロール設計。LLM APIキーへのアクセス制御を含む
- **Compute**：APIサーバー（コンテナ実行基盤）
- **Database**：PostgreSQL（＋pgvector）
- **Storage**：ドキュメント原本用のオブジェクトストレージ
- **Secrets**：APIキー・DB認証情報。コードに直書きしない
- **Monitoring**：ログ・メトリクス・アラート

IaC化の価値は再現性だけではない。検証環境を同一構成で立ち上げて評価を回し、本番に反映する、というRAG改善のサイクルそのものを支える。

## 運用に必要なもの

**Docker / CI/CD。** アプリと評価パイプラインをコンテナ化し、デプロイを自動化する。

**Structured Logging / Tracing。** RAGのリクエスト1件は「検索→（Rerank）→生成」の多段処理だ。障害調査でも精度調査でも、**どのクエリで・何がヒットし・何がコンテキストに入り・何が生成されたか**を後から追えなければ話にならない。1リクエストをトレースIDで貫き、各段の入出力・スコア・所要時間を構造化ログで残す。

**Prompt Versioning。** プロンプトはコードと同じく変更管理する。「いつ、誰が、どのプロンプトに変えたか」が追えないと、品質劣化の原因調査が不可能になる。

**Evaluation Pipeline。** 第6回の評価パイプラインをCIに組み込む。プロンプト変更・モデル更新・インデックス再構築のたびにGolden Datasetで回帰テストを実行し、指標が閾値を下回ったらデプロイを止める。

**Cost / Latency Monitoring。** RAGのコストはEmbedding・（Reranker）・LLM生成の合算で、リクエスト数に比例して増える。1リクエストあたりのトークン数とコスト、各段のLatency（p50/p95）をダッシュボード化する。打ち手は連載でやってきたことの裏返しだ — Top-kの削減、Context Compression、モデルの使い分け、キャッシュ。

## 最終成果物：Technical Support RAG Platform

連載の締めくくりとして、全回の内容を統合した一本を完成させる。

```
Manual / Design Doc / GitHub Issues
FAQ / Incident Report / API Documentation
        ↓
       RAG
        ↓
Technical Support Assistant
```

「Cloud Run deployment fails with a health check error. What should I investigate?」という質問に、回答・出典・検索スコア・評価指標まで返す。

```
Answer
Sources
  - runbook.md
  - incident-042.md
  - cloud-run-guide.md
Retrieval Debug
  Top1 0.91 / Top2 0.84 / Top3 0.77
Evaluation
  Faithfulness: 0.94
  Context Recall: 0.90
```

Retrieval DebugとEvaluationまでUIに出すのは、見栄えのためではない。**このシステムは診断可能に作られている**ことの証明であり、第6回までに積んだものが全部ここに現れる。

## 連載を終えて

8回を通して目指したのは「RAGを作れる人」ではなく、**RAGがなぜ悪いのかを診断して、実験を設計し、改善結果を数字で説明できる人**だ。

- なぜRAGか、なぜこのChunk sizeか、なぜHybridかを説明できる
- 精度劣化をRetrieval / Generationに分解して切り分けられる
- 改善をGolden Dataset上の指標の差分で証明できる
- それをIaC化された基盤の上で、監視つきで運用できる

この先は、Agentic RAGの深掘り、LLM Evaluationの体系化、AI Observability、そしてProduction AI Platformへと続いていく。評価まわりの取り組みは[LLM Evaluation](/services/llm-evaluation)としてサービス提供もしている。

連載の全体マップは[こちら](/writing/rag-series-0-overview)。
