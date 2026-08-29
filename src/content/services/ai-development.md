---
title: "AI Development"
summary: "LLM・生成AIをプロダクトや社内システムに組み込み、プロトタイプから本番運用まで一貫して実装します。"
target: "生成AIを製品や業務システムに組み込みたい事業者・スタートアップ"
problems:
  - "ChatGPTやAPIを試してはみたが、実運用に耐える精度・コスト・UXまで落とし込めていない"
  - "プロトタイプは動くが、エラー処理・監視・評価の仕組みがなく本番投入できない"
  - "何ができて何ができないかを技術的に切り分けて相談できる相手がいない"
deliverables:
  - "要件整理・技術選定を含むプロトタイプ実装"
  - "LLM API連携を含むプロダクション実装（エラー処理・ログ・レート制御込み）"
  - "リリース後の精度評価・コスト最適化を含む改善サイクル"
approach:
  - "ヒアリングで課題とゴールを整理し、実現可能な範囲を技術的に切り分ける"
  - "1〜2週間で動くプロトタイプを実装し、実データで検証する"
  - "本番運用に必要なエラー処理・ログ・評価の仕組みを組み込みながら実装を進める"
  - "リリース後も精度とコストをモニタリングし、継続的に改善する"
techStack:
  - "Claude / OpenAI API"
  - "TypeScript"
  - "Next.js"
  - "Vercel AI SDK"
  - "Cloudflare Workers"
priceRange: "要件により見積もり（プロトタイプ開発は30万円〜）"
relatedProjects:
  - "ai-business-automation"
  - "llm-evaluation-toolkit"
relatedExpertise:
  - "llm-evaluation"
  - "rag"
faq:
  - question: "生成AIを使った開発の経験はどれくらいありますか？"
    answer: "問い合わせ対応の自動化やHSコード分類支援など、LLM APIを組み込んだ業務システムの設計・実装を継続して行っています。詳細はProjectsをご覧ください。"
  - question: "何から作ればいいか決まっていなくても相談できますか？"
    answer: "はい。要件が固まっていない段階からのご相談を前提にしています。まずは課題と実現したいことを整理するところから一緒に進めます。"
  - question: "小さく試してから本格的な開発に進むことはできますか？"
    answer: "むしろ推奨しています。1〜2週間程度のプロトタイプで実データを使って検証し、手応えを確認してから本番実装に進む進め方を基本にしています。"
order: 1
titleEn: "AI Development"
summaryEn: "Web services, internal systems, and business tools powered by LLMs and AI APIs."
descriptionEn: "From requirements and prototyping through implementation and evaluation, I turn AI-enabled ideas into working software and refine them for practical use in real operations."
---

## どんな仕組みを作るか

LLM APIを使ったチャット・分類・要約・検索などの機能を、業務データや既存システムと接続して実装します。モデルを呼び出すだけでなく、入力の前処理、出力の検証、失敗時のフォールバック、コストの監視まで含めて「動き続ける仕組み」として設計します。

## 進め方の特徴

生成AIの実装は「試作は簡単だが本番運用が難しい」領域です。プロトタイプ段階での精度検証と、本番運用に必要な非機能要件（エラー処理・監視・評価）を分けて考え、両方を無理なく積み上げていく進め方を取っています。
