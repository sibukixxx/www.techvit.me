---
title: 'RAGの回答精度を改善したい'
summary: '失敗例と正解データを用意し、検索・reranking・生成のどこで品質が落ちているかを測定します。'
problem: 'RAGはモデルを変えるだけでは安定しません。文書抽出、chunking、検索、並べ替え、prompt、生成を分離評価する必要があります。'
symptoms: ['正しい文書が検索されない', '根拠はあるが回答がずれる', '変更前後の良し悪しを比較できない']
outcomes: ['品質のベースラインができる', '失敗原因を工程別に分類できる', '回帰を継続的に検知できる']
relatedServices: ['rag-quality-improvement', 'rag-knowledge-search']
relatedOpenSource: ['forgeai']
order: 7
---

実際の質問と期待する根拠・回答をGolden Datasetにし、変更前後を同じ条件で比較します。
