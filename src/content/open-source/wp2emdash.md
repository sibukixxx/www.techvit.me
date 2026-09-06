---
title: 'wp2emdash'
summary: 'WordPress移行を小さな工程に分け、監査、SEO URL差分、メディア、本文整合性を検証するGo CLI。'
status: available
repoUrl: 'https://github.com/sibukixxx/wp2emdash'
capabilities:
  [
    '14種の移行シグナルを使う読み取り監査',
    'SEOメタ・redirect抽出とURL map差分',
    'メディアmanifestと同期・検証',
    '本文fingerprintと構造差分によるcutover gate',
    'JSON・Markdownの再現可能なEvidence出力',
  ]
limitations:
  [
    'minimal以外のpresetには未実装の後続stepがある',
    '移行先への公式importそのものは担当しない',
    '公開risk bandは例であり、顧客別見積りではない',
  ]
relatedServices: ['wordpress-migration']
relatedSolutions: ['wordpress-modernization']
order: 1
---

実装コードではCLI、usecase、domain、infraを分離し、dry-runを既定にしています。テストにはSEO URL正規化、コンテンツ比較、メディア検証、preset実行が含まれます。
