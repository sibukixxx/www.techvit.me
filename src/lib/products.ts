export interface Product {
  title: string;
  titleEn?: string;
  url: string;
  category: string;
  icon: 'automation' | 'chat' | 'lab' | 'factory' | 'article' | 'followup';
  descriptionJa: string;
  descriptionEn: string;
}

export const products: Product[] = [
  {
    title: '記事集客スプリント',
    titleEn: 'Content Growth Sprint',
    url: 'https://lp-content-growth-sprint.pages.dev/',
    category: 'Content / SEO',
    icon: 'article',
    descriptionJa: '競合調査、テーマ選定、構成、記事執筆、公開準備までを1本からまとめて依頼できる記事制作サービス。',
    descriptionEn: 'A one-off content production service covering competitor research, topic selection, structure, writing, and publication preparation.',
  },
  {
    title: 'LINEフォロー導線セットアップ',
    titleEn: 'LINE Follow-up Setup',
    url: 'https://lp-customer-followup-setup.pages.dev/',
    category: 'LINE / Customer Follow-up',
    icon: 'followup',
    descriptionJa: 'LINE登録後7日間のシナリオ設計、配信原稿7通、配信設定とテストまでをまとめて初期構築するサービス。',
    descriptionEn: 'A setup service for a seven-day LINE follow-up flow, including scenario design, seven messages, configuration, and testing.',
  },
  {
    title: 'TechVit Solutions',
    url: 'https://solutions.techvit.me/',
    category: 'AI / Business Automation',
    icon: 'automation',
    descriptionJa: 'PDF検索、Excel転記、メール処理など、毎月繰り返す手作業をAIで自動化する開発サービス。',
    descriptionEn: 'AI automation services for recurring work such as PDF search, spreadsheet entry, and email processing.',
  },
  {
    title: 'LINE Setup',
    url: 'https://line-setup.quick-check.net/',
    category: 'LINE / Business Support',
    icon: 'chat',
    descriptionJa: 'LINE公式アカウントの導入・初期設定をスムーズに進めるための支援サービス。',
    descriptionEn: 'A support service for launching and configuring an official LINE account.',
  },
  {
    title: 'AGING LAB',
    url: 'https://aging-lab.quick-check.net/',
    category: 'Media / Research',
    icon: 'lab',
    descriptionJa: '30歳からのアンチエイジングをテーマに、成分やケア方法を調べられる情報メディア。',
    descriptionEn: 'A research-driven media site about ingredients and anti-aging care from your thirties onward.',
  },
  {
    title: 'Small Manufacturer Hub',
    url: 'https://small-manufacturer-hub.quick-check.net/',
    category: 'Manufacturing / Free Tools',
    icon: 'factory',
    descriptionJa: '小規模製造業向けに、在庫・発注判断を支援する無料業務ツールを提供するプラットフォーム。',
    descriptionEn: 'Free inventory and ordering decision tools built for small manufacturers.',
  },
];
