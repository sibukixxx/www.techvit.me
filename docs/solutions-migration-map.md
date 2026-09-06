# solutions.techvit.me Migration Map

旧ホスト側で301を返すこと。www.techvit.me の `public/_redirects` は、メインサイト内の既存URL移行だけを担当する。

| Old URL                                                        | New URL                                                     | Status | Reason                                            |
| -------------------------------------------------------------- | ----------------------------------------------------------- | ------ | ------------------------------------------------- |
| https://solutions.techvit.me/                                  | https://www.techvit.me/                                     | 301    | 正規営業ハブへ統合                                |
| https://solutions.techvit.me/about/                            | https://www.techvit.me/about/                               | 301    | 組織情報を一本化                                  |
| https://solutions.techvit.me/contact/                          | https://www.techvit.me/contact/                             | 301    | 問い合わせを一本化                                |
| https://solutions.techvit.me/pricing/                          | https://www.techvit.me/services/                            | 301    | 固定料金ページは廃止し、Service一覧へ集約         |
| https://solutions.techvit.me/downloads/                        | https://www.techvit.me/services/                            | 301    | 旧PDF導線をService一覧へ集約                      |
| https://solutions.techvit.me/downloads/techvit-services.pdf    | https://www.techvit.me/services/                            | 301    | 旧PDFは移植せず、最新Service一覧へ誘導            |
| https://solutions.techvit.me/downloads/webmcp.pdf              | https://www.techvit.me/services/automation-development/     | 301    | WebMCP単独資料は廃止し、業務自動化Serviceへ集約   |
| https://solutions.techvit.me/downloads/services/assessment.pdf | https://www.techvit.me/services/ai-workflow-assessment/     | 301    | 商用診断へ統合                                    |
| https://solutions.techvit.me/downloads/services/tools.pdf      | https://www.techvit.me/services/automation-development/     | 301    | 小さなツール開発を包含                            |
| https://solutions.techvit.me/downloads/services/documents.pdf  | https://www.techvit.me/services/automation-development/     | 301    | 文書自動化の実装Serviceへ統合                     |
| https://solutions.techvit.me/downloads/services/knowledge.pdf  | https://www.techvit.me/services/rag-knowledge-search/       | 301    | RAG検索Serviceへ統合                              |
| https://solutions.techvit.me/downloads/services/sales.pdf      | https://www.techvit.me/services/sales-automation/           | 301    | 営業自動化Serviceへ統合                           |
| https://solutions.techvit.me/services/                         | https://www.techvit.me/services/                            | 301    | Service一覧へ統合                                 |
| https://solutions.techvit.me/services/assessment/              | https://www.techvit.me/services/ai-workflow-assessment/     | 301    | 商用診断へ統合                                    |
| https://solutions.techvit.me/services/tools/                   | https://www.techvit.me/services/automation-development/     | 301    | 小さなツール開発を包含                            |
| https://solutions.techvit.me/services/documents/               | https://www.techvit.me/services/automation-development/     | 301    | 文書自動化の実装Serviceへ統合                     |
| https://solutions.techvit.me/services/knowledge/               | https://www.techvit.me/services/rag-knowledge-search/       | 301    | RAG検索Serviceへ統合                              |
| https://solutions.techvit.me/services/sales/                   | https://www.techvit.me/services/sales-automation/           | 301    | 営業自動化Serviceへ統合                           |
| https://solutions.techvit.me/services/webmcp/                  | https://www.techvit.me/services/automation-development/     | 301    | 技術名ではなく業務自動化へ整理                    |
| https://solutions.techvit.me/automation/                       | https://www.techvit.me/solutions/                           | 301    | 課題起点のSolution一覧へ統合                      |
| https://solutions.techvit.me/automation/excel/                 | https://www.techvit.me/solutions/excel-automation/          | 301    | 検索意図をSolutionへ移行                          |
| https://solutions.techvit.me/automation/pdf/                   | https://www.techvit.me/solutions/document-automation/       | 301    | PDFを文書自動化へ統合                             |
| https://solutions.techvit.me/automation/mail/                  | https://www.techvit.me/solutions/email-automation/          | 301    | メール課題へ統合                                  |
| https://solutions.techvit.me/automation/sales/                 | https://www.techvit.me/solutions/sales-research-automation/ | 301    | 営業調査の検索意図へ統合                          |
| https://solutions.techvit.me/automation/backoffice/            | https://www.techvit.me/solutions/document-automation/       | 301    | 文書・転記課題へ統合                              |
| https://solutions.techvit.me/automation/search/                | https://www.techvit.me/solutions/internal-search/           | 301    | 社内検索へ統合                                    |
| https://solutions.techvit.me/industry/trade/                   | https://www.techvit.me/solutions/document-automation/       | 301    | HSコード・書類課題の一般解へ統合                  |
| https://solutions.techvit.me/cases/                            | https://www.techvit.me/cases/                               | 301    | Caseポリシーへ誘導                                |
| https://solutions.techvit.me/cases/inquiry-mail/               | https://www.techvit.me/solutions/email-automation/          | 301    | モデルケースのため実績移植しない                  |
| https://solutions.techvit.me/cases/invoice-ocr/                | https://www.techvit.me/solutions/document-automation/       | 301    | モデルケースのため実績移植しない                  |
| https://solutions.techvit.me/cases/trade-hs-code/              | https://www.techvit.me/solutions/document-automation/       | 301    | モデルケースのため実績移植しない                  |
| https://solutions.techvit.me/en/                               | https://www.techvit.me/en/                                  | 301    | 英語トップへ移行                                  |
| https://solutions.techvit.me/en/about/                         | https://www.techvit.me/en/about/                            | 301    | 英語Aboutへ移行                                   |
| https://solutions.techvit.me/en/contact/                       | https://www.techvit.me/en/contact/                          | 301    | 英語Contactへ移行                                 |
| https://solutions.techvit.me/en/services/                      | https://www.techvit.me/en/services/                         | 301    | 英語Service一覧へ移行                             |
| https://solutions.techvit.me/en/pricing/                       | https://www.techvit.me/en/services/                         | 301    | 英語固定料金ページは廃止し、英語Service一覧へ集約 |
| https://solutions.techvit.me/en/cases/                         | https://www.techvit.me/en/projects/                         | 301    | 英語ケース導線はProjectsへ集約                    |
| https://solutions.techvit.me/en/cases/inquiry-mail/            | https://www.techvit.me/en/services/                         | 301    | モデルケース本文は移植せず、英語Service一覧へ誘導 |
| https://solutions.techvit.me/en/cases/invoice-ocr/             | https://www.techvit.me/en/services/                         | 301    | モデルケース本文は移植せず、英語Service一覧へ誘導 |
| https://solutions.techvit.me/en/cases/trade-hs-code/           | https://www.techvit.me/en/services/                         | 301    | モデルケース本文は移植せず、英語Service一覧へ誘導 |
| https://solutions.techvit.me/robots.txt                        | https://www.techvit.me/robots.txt                           | 301    | robotsは正規サイトへ集約                          |
| https://solutions.techvit.me/sitemap-index.xml                 | https://www.techvit.me/sitemap-index.xml                    | 301    | sitemapは正規サイトへ集約                         |
| https://solutions.techvit.me/sitemap-0.xml                     | https://www.techvit.me/sitemap-0.xml                        | 301    | sitemapは正規サイトへ集約                         |

## DELETE

PDF生成endpointと旧料金表示はメインへ移植しない。旧モデルケース本文は実績として公開しない。必要な問題説明だけをSolutionへ再編集して統合する。

## Redirect Host

`solutions.techvit.me` のDNSは削除しない。旧URL互換のため、当面は Cloudflare で `solutions.techvit.me` へのHTTPSアクセスを受け、上表の301を返す。

旧アプリケーションの静的配信を止める場合も、redirect rule / Worker static assets / Bulk Redirects など301を返すresourceは残す。
