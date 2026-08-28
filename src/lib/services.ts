export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
}

export const services: Service[] = [
  {
    slug: 'ai-product-development',
    title: 'AI Product Development',
    summary: 'LLM・AI APIを利用したWebサービス、社内システム、業務ツールの開発。',
    description:
      '要件整理からプロトタイピング、実装、評価まで一貫して対応します。AIを組み込んだ機能を「動くもの」として素早く形にし、実際の業務で使えるレベルまで磨き込みます。',
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    summary: '手作業になっている業務をAPI・AI・クラウドを使って自動化します。',
    description:
      '請求書処理、営業リスト作成、問い合わせ対応、コンテンツ生成、データ処理など、繰り返し発生する業務をAIとAPI連携で自動化し、人が判断すべき部分だけを残します。',
  },
  {
    slug: 'web-saas-development',
    title: 'Web / SaaS Development',
    summary: 'Next.js / Rails / Hono / PostgreSQLなどを使ったWebサービス開発。',
    description:
      '認証、課金、管理画面、APIなど、SaaSに必要な基盤を含めた開発に対応します。小さく作って検証し、必要な機能から広げていく進め方を基本にしています。',
  },
  {
    slug: 'cloud-debugging',
    title: 'Cloud / Debugging',
    summary: 'AWS / Cloudflare / Google Cloudを使ったインフラ構築と障害調査。',
    description:
      'クラウドインフラの設計・構築から、既存システムの障害調査、パフォーマンス改善まで対応します。原因を特定し、再発しない形で直すことを重視しています。',
  },
];
