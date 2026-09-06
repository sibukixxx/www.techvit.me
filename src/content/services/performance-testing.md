---
title: '性能試験・回帰分析'
summary: 'リクエスト単位の負荷試験データを保存・比較し、性能劣化を再現可能なEvidenceとして残します。'
target: 'リリース前後の性能差や、特定API・Pod・時間帯の遅延を分析したいチーム。'
problems: ['集計済みグラフだけで原因を掘れない', '基準値との比較が手作業', '分散負荷試験の結果が散らばる']
deliverables: ['負荷試験シナリオ', 'リクエスト単位データの収集', 'baseline比較と回帰レポート']
approach: ['対象とSLOを確認', '再現可能なシナリオを作成', '結果を保存・比較して改善']
techStack: ['k6', 'DuckDB', 'Go', 'Kubernetes', 'S3']
relatedSolutions: ['performance-regression']
relatedOpenSource: ['duckdb-load-testing-toolkit']
order: 8
---

許可を得た対象だけに負荷試験を行い、平均値だけでなくpercentile、endpoint、status、podなどで再分析できるデータを残します。
