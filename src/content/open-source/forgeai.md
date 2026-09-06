---
title: 'ForgeAI（rag-poc）'
summary: '文書投入、ハイブリッド検索、引用付きRAG、Golden Dataset評価、traceを一つのローカル環境で検証するGoアプリ。'
status: in-development
repoUrl: 'https://github.com/sibukixxx/rag-poc'
capabilities:
  [
    'PDF・TXT・Markdown・HTML・CSV・JSONの抽出',
    'semantic検索とBM25のhybrid search',
    '引用付きRAG回答',
    'Golden Datasetによる検索・生成評価',
    'prompt version、trace、token・cost記録',
  ]
limitations:
  [
    'READMEの完成条件とROADMAPを含む開発中のPoC',
    '顧客固有のアクセス制御・運用は別設計が必要',
    '検索品質を無条件に保証するものではない',
  ]
relatedServices: ['rag-knowledge-search', 'rag-quality-improvement']
relatedSolutions: ['internal-search', 'rag-accuracy']
order: 2
---

検索、RAG context構築、chat、ingestをusecaseとして分け、extractor、tokenizer、vector store、LLM adapterにテストがあります。
