# solutions.techvit.me Migration Map

旧ホスト側で301を返すこと。www.techvit.me の public/_redirects は、メインサイト内の既存URL移行だけを担当する。

| Old URL                 | New URL                                                     | Action           | Reason                                    |
| ----------------------- | ----------------------------------------------------------- | ---------------- | ----------------------------------------- |
| /                       | https://www.techvit.me/                                     | REDIRECT         | 正規営業ハブへ統合                        |
| /automation/excel/      | https://www.techvit.me/solutions/excel-automation/          | MERGE + REDIRECT | 検索意図をSolutionへ移行                  |
| /automation/pdf/        | https://www.techvit.me/solutions/document-automation/       | MERGE + REDIRECT | PDFを文書自動化へ統合                     |
| /automation/mail/       | https://www.techvit.me/solutions/email-automation/          | MERGE + REDIRECT | メール課題へ統合                          |
| /automation/sales/      | https://www.techvit.me/solutions/sales-research-automation/ | MERGE + REDIRECT | 営業調査の検索意図へ統合                  |
| /automation/backoffice/ | https://www.techvit.me/solutions/document-automation/       | MERGE + REDIRECT | 文書・転記課題へ統合                      |
| /automation/search/     | https://www.techvit.me/solutions/internal-search/           | MERGE + REDIRECT | 社内検索へ統合                            |
| /services/assessment/   | https://www.techvit.me/services/ai-workflow-assessment/     | MERGE + REDIRECT | 商用診断へ統合                            |
| /services/tools/        | https://www.techvit.me/services/automation-development/     | MERGE + REDIRECT | 小さなツール開発を包含                    |
| /services/documents/    | https://www.techvit.me/services/automation-development/     | MERGE + REDIRECT | 文書自動化の実装Serviceへ統合             |
| /services/knowledge/    | https://www.techvit.me/services/rag-knowledge-search/       | MERGE + REDIRECT | RAG検索Serviceへ統合                      |
| /services/sales/        | https://www.techvit.me/services/sales-automation/           | MERGE + REDIRECT | 営業自動化Serviceへ統合                   |
| /services/webmcp/       | https://www.techvit.me/services/automation-development/     | MERGE + REDIRECT | 技術名ではなく業務自動化へ整理            |
| /industry/trade/        | https://www.techvit.me/solutions/document-automation/       | MERGE + REDIRECT | HSコード・書類課題の一般解へ統合          |
| /cases/                 | https://www.techvit.me/cases/                               | REDIRECT         | Caseポリシーへ誘導                        |
| /cases/inquiry-mail/    | https://www.techvit.me/solutions/email-automation/          | MERGE + REDIRECT | モデルケースのため実績移植しない          |
| /cases/invoice-ocr/     | https://www.techvit.me/solutions/document-automation/       | MERGE + REDIRECT | モデルケースのため実績移植しない          |
| /cases/trade-hs-code/   | https://www.techvit.me/solutions/document-automation/       | MERGE + REDIRECT | モデルケースのため実績移植しない          |
| /pricing/               | https://www.techvit.me/services/                            | REDIRECT         | 固定料金を正規IAに持ち込まず個別Serviceへ |
| /downloads/             | https://www.techvit.me/services/                            | REDIRECT         | 旧PDF導線をService一覧へ                  |
| /about/                 | https://www.techvit.me/about/                               | MOVE + REDIRECT  | 組織情報を一本化                          |
| /contact/               | https://www.techvit.me/contact/                             | MOVE + REDIRECT  | 問い合わせを一本化                        |
| /en/*                   | 対応する https://www.techvit.me/en/*                        | REDIRECT         | 存在する英語ページのみ個別対応            |

## DELETE

PDF生成endpointと旧料金表示はメインへ移植しない。旧モデルケース本文は実績として公開しない。必要な問題説明だけをSolutionへ再編集して統合する。
