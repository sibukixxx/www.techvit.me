---
title: RAG実践ガイド 第2回：EmbeddingとVector Search — 「なんとなく良い」をRecall@5で数値化する
description: 埋め込み空間・距離尺度・ANN・HNSWの理論と、Embeddingモデル3種をRecall@Kで比較する実験。
category: engineering
tags: [RAG, Embedding, Vector Search]
pubDate: 2026-07-19
relatedServices:
  - "llm-evaluation"
  - "ai-development"
---

連載「[RAG実践ガイド](/writing/rag-series-0-overview)」の第2回。[前回](/writing/rag-series-1-fundamentals)は最小構成のRAGを組んだ。今回はその心臓部であるEmbeddingとVector Searchを掘り下げる。ここは理論面でRAGの成否を最も左右する部分だ。

## テキストがベクトルになるまで

**Tokenization。** テキストはまずトークン列に分割される。Embeddingモデルにも入力トークン数の上限があり、これが後のChunk設計（第3回）の制約条件になる。

**Dense Vector。** Embeddingモデルはトークン列を1本の密ベクトル（数百〜数千次元）に変換する。one-hotのような疎な表現と違い、すべての次元が意味を分散して担う。

**Embedding Space。** 学習によって「意味が近いテキストはベクトル空間上で近くに配置される」ように訓練されている。この性質があるから、キーワードが一致しなくても「解約したい」と「契約を終了する方法」がマッチする。これがSemantic Searchだ。

重要なのは、**この空間の形はモデルの学習データと学習方法で決まる**ということ。だからEmbeddingモデルを変えると「近い」の定義そのものが変わり、検索結果が変わる。多言語性能、ドメイン適合、対称/非対称検索（質問と文書のように形が違うテキストのマッチング）への対応はモデルごとに大きく異なる。

## 距離の測り方

- **Cosine Similarity**：ベクトルの向きの近さ。長さを無視する。テキスト検索のデファクト
- **Dot Product**：向き＋長さ。正規化済みベクトルならCosineと一致する
- **Euclidean Distance**：空間内の直線距離

使うEmbeddingモデルがどの距離尺度を想定して学習されたかを確認せずにVector DBのデフォルトを使うと、静かに精度を損なうことがある。

## 全件比較からANNへ

Top-k検索を素朴にやると、クエリと全Chunkの類似度を毎回計算することになる。数千件なら全件比較（brute force）で十分速い。しかし数百万件になると成立しない。

そこで**ANN（Approximate Nearest Neighbor）** — 厳密なTop-kを諦め、高速に「ほぼ正しい」近傍を返すインデックスを使う。代表が**HNSW**（Hierarchical Navigable Small World）で、多層のグラフを上の層から辿って近傍に降りていく構造だ。ほとんどのVector DB（pgvector、Qdrant、Weaviate等）の中身はこれだ。

ANNは近似なので、**インデックスのパラメータ次第で「本当は最近傍なのに返ってこない」ことがある**。これを測る指標がRecall@K（厳密なTop-Kのうち、ANNが返せた割合）で、速度とのトレードオフになる。「Vector DBは入れれば正しく返る」ではない、という感覚をここで持っておく。

## 実験：Embeddingモデル3種をRecall@5で比較する

今週の実験。同じ100件程度のドキュメントに対して、Embeddingモデルを3種類（例：OpenAI系、多言語オープンモデル、日本語特化モデル）差し替えて検索結果を比較する。

手順：

1. 質問と「その質問に本当に関連する文書」のペアを20〜30組つくる（これが第6回のGolden Datasetの原型になる）
2. 各モデルでコーパスをEmbeddingし、各質問でTop-5を検索
3. **Recall@5**（正解文書がTop-5に入った割合）をモデルごとに算出

ポイントは「なんとなくBが良かった」で終わらせないこと。

```
Embedding A: Recall@5 = 0.72
Embedding B: Recall@5 = 0.86
Embedding C: Recall@5 = 0.79
```

と数字で比較し、さらに**AがBに負けた質問を個別に見る**。固有名詞で外したのか、言い換えに弱いのか、日本語性能の問題なのか。この失敗分析の習慣が、後の診断力に直結する。

## 今週の「自分の言葉で説明する」課題

- Embeddingモデルを変えると、なぜ検索結果が変わるのか？
- ANNインデックスを使うと何を失い、何を得るのか？
- Recall@5が0.7という数字は、RAG全体にとって何を意味するか？

次回（第3回）はChunkingを徹底する。Chunk sizeという一見地味なパラメータが、検索品質をどれだけ左右するかを実データで確認する。
