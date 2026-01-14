# Cloudflare Pages - GitHub 連携デプロイガイド

このガイドでは、Recorder VizをCloudflare Pagesと連携し、GitHubの更新を自動的にデプロイする方法を説明します。

## セットアップ手順

### ステップ1: Cloudflare Dashboardでプロジェクトを確認

1. **Cloudflare Dashboard** にログイン
   - https://dash.cloudflare.com

2. **Workers & Pages** をクリック
   - 左サイドバーから「Workers & Pages」を選択

3. **Pages** タブで `recorder-visualizer` プロジェクトを確認
   - 既に作成済み（手動デプロイから）

### ステップ2: GitHub連携の設定

1. **Cloudflare Dashboardから GitHub連携**
   - Pages タブで `recorder-visualizer` をクリック
   - **設定** タブを選択
   - **Git リポジトリ** セクションで **GitHub に接続** をクリック

2. **GitHub認可**
   - GitHubアカウントでログイン
   - Cloudflareに権限を付与

3. **リポジトリを選択**
   - `sho11decade/RecorderVisualizer` を選択

4. **ビルド設定を入力**
   ```
   ビルドコマンド: npm run build
   ビルド出力ディレクトリ: dist
   ```

### ステップ3: デプロイメントのカスタマイズ（オプション）

Cloudflare Dashboardで以下を設定できます：

**環境変数の追加**
1. **設定** → **環境変数**
2. 必要に応じて環境変数を追加

**ビルド設定の詳細**
1. **設定** → **ビルド設定**
   - NodeJSバージョン: 18以上
   - デプロイメント前後のスクリプト

## デプロイメントフロー

### 自動デプロイ（GitHub連携）

```
GitHub に git push
    ↓
Cloudflare Webhook トリガー
    ↓
npm install 実行
    ↓
npm run build 実行
    ↓
dist/ フォルダを Pages にアップロード
    ↓
本番環境に反映（数秒～数分）
```

### プレビューデプロイ

- **プルリクエスト作成時**: 自動でプレビューURLが生成
- URL例: `https://pr-123.recorder-visualizer.pages.dev`
- マージ前に本番環境の状態をプレビュー可能

### 本番デプロイ

- `main` ブランチへの push でデプロイ
- URL: `https://recorder-visualizer.pages.dev`

## CLI でのデプロイ（手動）

GitHub連携の設定後も、CLIでのデプロイは引き続き可能：

```bash
npm run deploy
```

## トラブルシューティング

### デプロイが失敗する場合

**1. ビルドコマンドの確認**
```bash
npm run build
```
ローカルでビルドが成功するか確認

**2. Cloudflare Dashboard のログを確認**
- Pages プロジェクト → **デプロイメント** タブ
- 失敗したデプロイをクリック
- ビルドログを確認

**3. GitHub Actions ログを確認**
```
GitHub リポジトリ → Actions → 最新のワークフロー
```

### よくある問題

| 問題 | 原因 | 解決方法 |
|------|------|--------|
| `npm install` 失敗 | 依存関係の問題 | `npm ci` をローカルで試す |
| ビルド失敗 | TypeScript エラー | `npm run build` でローカル確認 |
| 静的ファイル未検出 | 出力ディレクトリ設定 | `dist` が設定されているか確認 |
| デプロイ後 404 | ルーティング設定 | `wrangler.toml` の確認 |

## 環境変数の設定

本番環境での環境変数が必要な場合：

1. **Cloudflare Dashboard で設定**
   - Pages → **設定** → **環境変数**
   - 本番環境の変数を追加

2. **ビルド時と実行時の区別**
   ```bash
   # ビルド時: VITE_で始まる変数が React コードで使用可能
   VITE_API_URL=https://api.example.com
   ```

3. **コード内での使用**
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

## セキュリティ設定

### APIトークンの管理

GitHub Actions使用時（`.github/workflows/deploy.yml`）：

1. **GitHub Secrets に設定**
   - リポジトリ → Settings → Secrets and variables → Actions
   - `CLOUDFLARE_API_TOKEN`: CloudflareのAPIトークン
   - `CLOUDFLARE_ACCOUNT_ID`: CloudflareアカウントID

2. **Cloudflareでトークンを生成**
   - https://dash.cloudflare.com/profile/api-tokens
   - **Create Token** → カスタム設定
   - 権限: `Account.Pages` (Edit)

### ドメイン設定（カスタムドメイン）

1. **Cloudflare で独自ドメインを持っている場合**
   - Pages → **カスタムドメイン** → **カスタムドメインを追加**
   - 例: `recorder-viz.example.com`

2. **DNS レコード自動追加**
   - Cloudflare Pages が自動的に CNAME を設定

## ベストプラクティス

✅ **推奨**
- `main` ブランチのみを本番デプロイ対象とする
- プルリクエストのプレビューデプロイで検証
- タグ付けしたリリースごとにバージョン記録
- コミットメッセージは明確に記述

❌ **避けるべき**
- 直接本番ファイルを編集
- 環境変数をコード内に記述
- 機密情報を含むシークレットをコミット

## 確認チェックリスト

- [ ] GitHub アカウントとリポジトリを確認
- [ ] Cloudflare アカウントにログイン
- [ ] Pages プロジェクト `recorder-visualizer` が表示されている
- [ ] GitHub 連携設定を完了
- [ ] ビルドコマンド: `npm run build`
- [ ] 出力ディレクトリ: `dist`
- [ ] main ブランチへの push でデプロイ開始
- [ ] デプロイ完了後、URL にアクセスして動作確認

---

**参考リンク**
- [Cloudflare Pages 公式ドキュメント](https://developers.cloudflare.com/pages/)
- [GitHub Actions Workflow](https://docs.github.com/en/actions)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

**最終更新**: 2026年1月14日
