---
title: 'リリース後の性能劣化を検出したい'
summary: '負荷試験結果をリクエスト単位で保存し、baselineと比較してendpoint別の回帰を調べます。'
problem: '事前集計されたダッシュボードだけでは、後から別の軸で切り直したり、特定リクエストの遅延を掘り下げたりできません。'
symptoms:
  [
    '平均値は同じでもtail latencyが悪化する',
    'リリース間の比較条件が揃わない',
    '複数workerの結果をまとめにくい',
  ]
outcomes: ['同じシナリオで比較できる', 'endpoint・status・podで再分析できる', '回帰のEvidenceを共有できる']
relatedServices: ['performance-testing']
relatedOpenSource: ['duckdb-load-testing-toolkit']
order: 9
---

SLOと比較条件を先に決め、対象システムの許可を確認したうえで負荷試験を行います。
