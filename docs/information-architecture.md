# TechVit Information Architecture

## 目的

https://www.techvit.me をTechVit唯一の営業・SEOハブとし、顧客の課題からSolution、商用Service、技術的Proof、問い合わせまでを同一サイトで接続する。

## 正規構造

- / — 課題、サービス、進め方、OSS、検証方針、問い合わせへの入口
- /services/ — 顧客がお金を払って依頼する商用支援
- /solutions/ — 問題・検索意図から入る解説
- /open-source/ — 測定・検出・検証の公開実装
- /cases/ — 実在する実績、Benchmark、検証結果のみ。現時点では掲載方針と既存Proofへの導線
- /blog/ — 技術解説と検索流入
- /about/ — TechVitの立場と対応範囲
- /contact/ — 既存フォームを再利用した問い合わせ

## ページ分類

| 種類        | 役割                       | 主なCTA              |
| ----------- | -------------------------- | -------------------- |
| Solution    | 課題の理解、解決の考え方   | 関連Serviceを見る    |
| Service     | 契約対象、提供内容、進め方 | 内容を相談する       |
| Open Source | 実装力と検証可能性のProof  | 関連Serviceを見る    |
| Case        | 実績・検証条件・結果       | 同種の課題を相談する |
| Blog        | 技術解説、検索流入         | 関連Serviceを見る    |

## 既存カテゴリの扱い

| 既存カテゴリ | 判断                       | 理由                                                           |
| ------------ | -------------------------- | -------------------------------------------------------------- |
| Projects     | KEEP（ナビから除外）       | 現在開発・運営している成果物。CaseまたはOSSへの誤分類を避ける  |
| Expertise    | KEEP（ナビから除外）       | 技術解説資産として既存URLを保全。新規営業導線ではServiceに統合 |
| Lab          | KEEP（ナビから除外）       | 実験記録としてURL保全。商用Serviceと混同しない                 |
| Products     | MOVE（トップ主役から除外） | 営業IAの主分類にはせず、既存Projects/Labから参照               |
| Writing      | MOVE                       | 日本語URLを/blog/へ301移行。英語/en/writing/は現状維持         |

## i18n

日本語の新規Service/Solution/Open Sourceには未作成の英語hreflangを出さない。既存の英語トップ、About、Services digest、Writing、Projects、Labは保全する。英語ページの追加は翻訳品質を確認する別Issueとする。

## Caseポリシー

統合元の3件はすべてモデルケースであり、実績として移行しない。顧客名、導入効果、Benchmarkは測定条件と根拠が存在するものだけを追加する。
