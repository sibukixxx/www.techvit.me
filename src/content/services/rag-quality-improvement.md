---
title: 'RAG品質改善'
summary: 'Golden Datasetと検索・生成の評価を用い、RAGの失敗原因を測定して改善します。'
target: 'RAGを導入済みだが、回答精度や改善判断が担当者の感覚に依存しているチーム。'
problems:
  [
    '検索で必要な文書が上位に出ない',
    'モデル変更後の品質低下を検知できない',
    'chunking・検索・promptのどこが原因か分からない',
  ]
deliverables: ['評価質問セットと指標', '検索・生成の分離評価', '比較レポートと改善実装']
approach: ['失敗例を分類', 'ベースラインを測定', '変更ごとに再評価']
techStack: ['Golden Dataset', 'Retrieval Evaluation', 'Reranking', 'Tracing']
relatedSolutions: ['rag-accuracy']
relatedOpenSource: ['forgeai']
titleEn: 'RAG Quality Improvement'
summaryEn: 'Use a Golden Dataset and separate retrieval and generation evaluation to diagnose and improve RAG failures.'
descriptionEn: 'Baseline measurement, failure analysis, before-and-after comparison, and implementation changes across chunking, retrieval, reranking, and answer generation.'
order: 4
---

RAGの品質を「それらしい回答」ではなく、検索の再現率、根拠の適合、回答の正確さに分けて確認します。
