---
title: 'Insight Lab'
summary: 'インタビューやレビューから、根拠、反証、推論経路、confidenceを伴う顧客インサイト候補を作るlocal-firstツール。'
status: available
repoUrl: 'https://github.com/sibukixxx/insight'
capabilities:
  [
    'テキスト貼付とCSV import',
    'observation・pattern・insightの分析pipeline',
    'source quoteとcounter-evidenceのlineage',
    'application-calculated confidenceとquality warning',
    'Markdown reportとevaluation画面',
  ]
limitations:
  [
    '分析品質は入力データと利用モデルに依存する',
    '生成結果は人による根拠レビューを前提とする',
    '機密データは設定したAI providerの取扱い確認が必要',
  ]
relatedServices: ['customer-insight-analysis']
relatedSolutions: ['customer-feedback-analysis']
order: 3
---

SQLite repositoryと分析pipelineを実装し、grounding、confidence、quality、report、CSV importにテストがあります。既定buildに架空demoデータは含まれません。
