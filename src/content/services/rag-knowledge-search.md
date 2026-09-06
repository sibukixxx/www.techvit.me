---
title: 'RAG・社内ナレッジ検索開発'
summary: '社内文書を根拠付きで検索し、回答案と参照箇所を返すナレッジ検索を設計・実装します。'
target: 'PDF、手順書、議事録、FAQ、提案書を探す時間を減らしたい組織。'
problems:
  [
    '必要な資料が共有フォルダに埋もれている',
    '担当者によって回答が変わる',
    '生成AIの回答に根拠がなく確認できない',
  ]
deliverables: ['文書取り込みと検索基盤', '引用・参照元付き回答UI/API', 'アクセス制御と更新手順']
approach: ['文書と質問例を確認', '検索・引用のPoC', '評価後に連携と運用を実装']
techStack: ['RAG', 'Hybrid Search', 'Embeddings', 'Python', 'Go']
relatedSolutions: ['internal-search', 'rag-accuracy']
relatedOpenSource: ['forgeai']
order: 3
---

回答を生成するだけでなく、どの文書のどの箇所を根拠にしたかを確認できることを重視します。
