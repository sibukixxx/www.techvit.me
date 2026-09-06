---
title: 'DuckDB Load Testing Toolkit'
summary: 'k6のリクエスト単位メトリクスをDuckDBへ保存し、分散結果の統合とbaseline比較を行う負荷試験ツールキット。'
status: in-development
repoUrl: 'https://github.com/sibukixxx/duckdb-load-testing-toolkit'
capabilities:
  [
    'k6からGo sidecarへの単発・batch ingest',
    'DNS・TCP・TLS・TTFB・total timingの保存',
    'DuckDB fileのflush・download・S3 upload',
    'run比較・baseline・trend API',
    'DuckDB-Wasmによるbrowser viewer',
  ]
limitations:
  [
    'first stable release前のactive development',
    'Kubernetes manifestは環境別reviewが必要',
    '認可された対象だけに負荷試験を行う必要がある',
  ]
relatedServices: ['performance-testing']
relatedSolutions: ['performance-regression']
order: 4
---

Sidecar APIとmetrics schemaを互換性境界として定義し、storage、handler、comparison、realtime、orchestratorにunit testとE2E testがあります。
