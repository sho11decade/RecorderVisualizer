# SEO設定ガイド

このドキュメントは、Recorder VizのSEO（検索エンジン最適化）設定について説明しています。

## 実装済みのSEO対策

### 1. メタタグ設定 (`index.html`)

#### Primary Meta Tags
- **Title**: "Recorder Viz - インタラクティブなリコーダー学習ツール"
- **Description**: 検索結果に表示される説明文
- **Keywords**: リコーダー、音楽学習、楽器学習ツール等
- **Robots**: インデックス許可設定

#### Open Graph (OG) Tags
- `og:title`, `og:description`, `og:image`
- `og:type`, `og:url`, `og:locale`
- ソーシャルメディア共有時の表示を最適化

#### Twitter Card Tags
- `twitter:card`: `summary_large_image`形式
- Twitter/Xでのシェア時の見栄え向上

#### その他
- `theme-color`: ブラウザUIの色設定
- `canonical`: 正規URL指定
- `manifest.json`: PWAマニフェスト

### 2. OGイメージ (`public/og-image.png`)

- **形式**: SVG（スケーラブル）
- **サイズ**: 1200x630px（推奨サイズ）
- **デザイン**: アプリケーションを視覚的に表現
- Facebook、Twitter、Linkedinなどでの共有時に表示

### 3. robots.txt (`public/robots.txt`)

- 検索エンジンボットのクローリング制御
- サイトマップの場所を指定
- Crawl-delay: 1秒（サーバー負荷軽減）

### 4. sitemap.xml (`public/sitemap.xml`)

- URLのリスト
- 最終更新日時
- 更新頻度
- 優先度を指定
- Google Search Consoleへの登録用

### 5. manifest.json (`public/manifest.json`)

- PWA（Progressive Web App）マニフェスト
- アプリ名、説明、アイコン等を定義
- ホーム画面インストール時の表示を制御

## 導入チェックリスト

### Cloudflare Pages デプロイ前

- [ ] `wrangler login` でCloudflareにログイン
- [ ] `npm run deploy` でデプロイ実行
- [ ] デプロイ後のURLを確認

### SEO検証

#### Google
- [ ] [Google Search Console](https://search.google.com/search-console) にサイトマップを登録
- [ ] URLインスペクションでページ情報を確認
- [ ] インデックスカバレッジをチェック

#### その他のツール
- [ ] [Open Graph Debugger](https://developers.facebook.com/tools/debug/og/object/) でOGタグをテスト
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) でTwitterカードをテスト
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) でパフォーマンスをチェック

### よくある質問

**Q: OGイメージが表示されない**
- A: ソーシャルメディアのキャッシュをクリアして、デバッグツールで再確認してください

**Q: Google検索に表示されない**
- A: Search Consoleでサイトマップを登録後、インデックス依頼を行ってください。通常2-4週間必要

**Q: robots.txtの場所は？**
- A: `public/robots.txt` - デプロイ時に `https://recorder.ricezero.fun/robots.txt` で自動的にアクセス可能

**Q: sitemap.xmlをカスタマイズしたい**
- A: `public/sitemap.xml` を編集してください。複数ページがある場合は全URLを追加してください

## サイトマップの更新方法

新しいページやルートを追加した場合：

```xml
<url>
  <loc>https://recorder.ricezero.fun/new-page</loc>
  <lastmod>2026-01-14</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## 構造化データ（Schema.org）

より詳細なSEO対策のため、以下の実装も検討できます：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Recorder Viz",
  "description": "インタラクティブなリコーダー学習ツール",
  "url": "https://recorder.ricezero.fun",
  "applicationCategory": "EducationalApplication"
}
</script>
```

## パフォーマンス最適化との関係

- **Core Web Vitals**: Lighthouse スコア 90+ を目標
- **画像最適化**: OGイメージはSVG形式で軽量化
- **キャッシング**: Cloudflare Pagesが自動的に最適化

---

**最終更新**: 2026年1月14日
