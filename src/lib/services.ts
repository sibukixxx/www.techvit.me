export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  summaryEn: string;
  descriptionEn: string;
}

export const services: Service[] = [
  {
    slug: 'ai-product-development',
    title: 'AI Product Development',
    summary: 'LLM・AI APIを利用したWebサービス、社内システム、業務ツールの開発。',
    description:
      '要件整理からプロトタイピング、実装、評価まで一貫して対応します。AIを組み込んだ機能を「動くもの」として素早く形にし、実際の業務で使えるレベルまで磨き込みます。',
    summaryEn: 'Web services, internal systems, and business tools powered by LLMs and AI APIs.',
    descriptionEn:
      'From requirements and prototyping through implementation and evaluation, I turn AI-enabled ideas into working software and refine them for practical use in real operations.',
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    summary: '手作業になっている業務をAPI・AI・クラウドを使って自動化します。',
    description:
      '請求書処理、営業リスト作成、問い合わせ対応、コンテンツ生成、データ処理など、繰り返し発生する業務をAIとAPI連携で自動化し、人が判断すべき部分だけを残します。',
    summaryEn: 'Automating manual workflows with APIs, AI, and cloud services.',
    descriptionEn:
      'I automate recurring work such as invoice processing, lead research, customer inquiries, content generation, and data handling while keeping human judgment where it matters.',
  },
  {
    slug: 'web-saas-development',
    title: 'Web / SaaS Development',
    summary: 'Next.js / Rails / Hono / PostgreSQLなどを使ったWebサービス開発。',
    description:
      '認証、課金、管理画面、APIなど、SaaSに必要な基盤を含めた開発に対応します。小さく作って検証し、必要な機能から広げていく進め方を基本にしています。',
    summaryEn: 'Lean web and SaaS products built with modern application frameworks.',
    descriptionEn:
      'I build the foundations a SaaS product needs, including authentication, billing, admin interfaces, and APIs, starting small and expanding from validated requirements.',
  },
  {
    slug: 'cloud-debugging',
    title: 'Cloud / Debugging',
    summary: 'AWS / Cloudflare / Google Cloudを使ったインフラ構築と障害調査。',
    description:
      'クラウドインフラの設計・構築から、既存システムの障害調査、パフォーマンス改善まで対応します。原因を特定し、再発しない形で直すことを重視しています。',
    summaryEn: 'Cloud infrastructure, incident investigation, and performance improvement.',
    descriptionEn:
      'I design and build cloud infrastructure, investigate failures in existing systems, and improve performance with an emphasis on identifying root causes and preventing recurrence.',
  },
];
