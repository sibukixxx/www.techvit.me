---
title: 'RAG・社内ナレッジ検索開発'
summary: '社内文書を根拠付きで検索し、回答案と参照箇所を返すナレッジ検索を設計・実装します。'
target: 'PDF、手順書、議事録、FAQ、提案書を探す時間を減らしたい組織。'
problems:
  [
    '必要な資料が共有フォルダに埋もれている',
    '同じ問い合わせに何度も回答している',
    '生成AIの回答に根拠がなく確認できない',
    'RAGをPoCで作ったが精度が上がらない',
  ]
deliverables:
  [
    'PDF・FAQ・マニュアル等の取り込み',
    '検索・AI回答・引用元表示',
    'Golden Datasetによる基本評価',
    '評価結果と次の改善提案',
  ]
approach:
  [
    '対象資料と質問例を確認',
    '検索・引用のPoC構築',
    '評価データ作成',
    '検索・回答品質を評価',
    '改善と本番導入設計',
  ]
techStack:
  [
    'Python',
    'FastAPI',
    'React / Next.js',
    'PostgreSQL / pgvector',
    'OpenAI / Anthropic',
    'AWS / GCP',
    'Docker',
    'Terraform',
  ]
priceRange: '要件に応じてお見積り（資料量・形式、連携先、権限管理、評価範囲、インフラ要件で変動）'
deliveryTime: 'RAG PoCは2〜4週間程度'
faq:
  - question: 'どのような資料を検索対象にできますか？'
    answer: 'PDF、FAQ、マニュアル、提案書、議事録、社内ドキュメントなどを想定しています。形式と品質を確認して取り込み方法を決めます。'
  - question: '既に作ったRAGの精度改善だけでも相談できますか？'
    answer: '可能です。質問例と期待する根拠を評価データにし、検索と回答生成を分けて問題箇所を確認します。'
  - question: 'PoCの後に本番導入も依頼できますか？'
    answer: '可能です。認証・権限、データ更新、監視、インフラなど、本番運用に必要な要件をPoC結果から設計します。'
relatedSolutions: ['internal-search', 'rag-accuracy']
relatedOpenSource: ['forgeai']
order: 3
---

回答を生成するだけでなく、どの文書のどの箇所を根拠にしたかを確認できることを重視します。
