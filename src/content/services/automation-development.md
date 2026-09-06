---
title: '業務自動化開発'
summary: 'Excel・文書・メールなどの反復作業を、既存業務に合わせた小さなツールや連携で省力化します。'
target: '同じ転記・集計・確認・下書きを繰り返している企業・部門。'
problems:
  [
    '表計算への転記や集計が属人化している',
    '文書作成やメール処理に時間がかかる',
    '既製品が自社の書式や承認手順に合わない',
  ]
deliverables: ['対象業務に絞ったWebツール', '既存API・スプレッドシート連携', '確認画面、ログ、運用手順']
approach: ['現行フローと例外を確認', '1業務でPoCを実装', '結果を測定して対象を拡張']
techStack: ['Python', 'Go', 'TypeScript', 'API Integration']
relatedSolutions: ['excel-automation', 'document-automation', 'email-automation']
order: 2
---

最初から全工程を自動化せず、入力と出力が明確な一工程から始めます。AIの出力は必要に応じて人が確認できる設計にします。
