export interface Product {
  title: string;
  url: string;
  category: string;
  descriptionJa: string;
  descriptionEn: string;
}

export const products: Product[] = [
  {
    title: 'TechVit Solutions',
    url: 'https://solutions.techvit.me/',
    category: 'AI / Business Automation',
    descriptionJa: 'PDF検索、Excel転記、メール処理など、毎月繰り返す手作業をAIで自動化する開発サービス。',
    descriptionEn: 'AI automation services for recurring work such as PDF search, spreadsheet entry, and email processing.',
  },
  {
    title: 'LINE Setup',
    url: 'https://line-setup.quick-check.net/',
    category: 'LINE / Business Support',
    descriptionJa: 'LINE公式アカウントの導入・初期設定をスムーズに進めるための支援サービス。',
    descriptionEn: 'A support service for launching and configuring an official LINE account.',
  },
  {
    title: 'AGING LAB',
    url: 'https://aging-lab.quick-check.net/',
    category: 'Media / Research',
    descriptionJa: '30歳からのアンチエイジングをテーマに、成分やケア方法を調べられる情報メディア。',
    descriptionEn: 'A research-driven media site about ingredients and anti-aging care from your thirties onward.',
  },
  {
    title: 'Small Manufacturer Hub',
    url: 'https://small-manufacturer-hub.quick-check.net/',
    category: 'Manufacturing / Free Tools',
    descriptionJa: '小規模製造業向けに、在庫・発注判断を支援する無料業務ツールを提供するプラットフォーム。',
    descriptionEn: 'Free inventory and ordering decision tools built for small manufacturers.',
  },
];
