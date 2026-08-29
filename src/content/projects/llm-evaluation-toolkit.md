---
title: LLM Evaluation Toolkit
description: LLMアプリケーションの品質評価に関する研究・実装。
status: in-development
role: Research & implementation
stack: [LLM, Evaluation, RAG]
featured: true
order: 3
pubDate: 2026-04-15
challenge: "LLMアプリケーションは動くところまでは早く到達できるが、回答が正しいかどうかを継続的に確認する仕組みがないまま運用されがちである"
constraints:
  - "人手による毎回の目視確認は、プロンプトやモデルを変更するたびに発生するコストとして持続可能ではない"
  - "RAGの場合、検索精度の問題なのか回答生成の問題なのかを切り分けられないと、改善の優先順位が決められない"
outcome:
  - "実際の問い合わせ・想定質問からGolden Dataset（正解付きの評価用データ）を構築する仕組みを実装"
  - "LLM-as-a-Judgeによる自動評価、RAGの検索/生成の切り分け評価、回帰テストへの組み込みを研究・実装中"
relatedServices:
  - "llm-evaluation"
---

## アーキテクチャ

```
実際の問い合わせ・想定質問
  ↓
Golden Dataset（正解付き評価データ）の構築
  ↓
LLM-as-a-Judgeによる自動評価
  ↓
RAGの場合: Retrieval Evaluation と Generation Evaluation を分離
  ↓
回帰テストとして仕組み化（変更のたびに実行）
  ↓
評価レポート
```

## 対応領域

- Golden Dataset の設計・構築
- LLM-as-a-Judge による自動評価
- RAG Evaluation（検索精度・回答精度の評価）
- Hallucination Detection
- Regression Testing（変更による品質劣化の検知）
- Agent Evaluation

Golden Datasetの考え方については[Writing](/writing/what-is-a-golden-dataset)で詳しく解説している。

## 現在の状況

評価手法の研究と実装を継続的に行っている段階。[HS Code Assistant](/projects/hs-code-assistant)など、実際のLLMアプリケーション開発の中で評価の仕組みを検証しながら磨き込んでいる。LLMアプリケーションが増えるほど「作った後にどう品質を担保するか」が課題になるため、今後さらに重要になる領域だと考えている。
