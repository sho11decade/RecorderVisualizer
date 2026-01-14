# Cloudflare Pages - GitHub自動デプロイ設定ガイド

GitHub連携を使用する場合、CLI経由のデプロイは不要です。Cloudflare Dashboardで一度だけ設定することで、以降は自動的にデプロイされます。

## 推奨: Cloudflare Dashboard での GitHub連携設定

### ステップ1: Cloudflareで既存プロジェクトを確認

1. **https://dash.cloudflare.com** にログイン
2. **Workers & Pages** をクリック
3. **Pages** タブで `recorder-visualizer` を確認

### ステップ2: GitHub連携を設定

1. `recorder-visualizer` プロジェクトをクリック
2. **設定** タブ → **Git リポジトリ**
3. **GitHub に接続** をクリック

#### GitHub認可

- GitHubアカウントでサインイン
- Cloudflareに権限を付与（初回のみ）

#### リポジトリ選択

- **Organization**: `sho11decade`
- **Repository**: `RecorderVisualizer`
- **Branch to deploy**: `main`

### ステップ3: ビルド設定

Cloudflare Dashboardで以下を設定：

```
✓ ビルドコマンド: npm run build
✓ ビルド出力ディレクトリ: dist
✓ Node.js バージョン: 18 (デフォルト)
```

### ステップ4: デプロイメント確認

設定完了後、以下のURLでページが動作します：

```
https://recorder-visualizer.pages.dev/
```

## デプロイメントフロー

GitHub連携設定後：

```
GitHub に git push
  ↓
Cloudflare が自動検出
  ↓
npm install
npm run build
  ↓
dist/ を Pages にデプロイ
  ↓
自動的に本番環境に反映（2-5分）
```

### プルリクエスト時（自動プレビュー）

PRを作成すると、自動的にプレビューURLが生成されます：

```
https://pr-<number>.recorder-visualizer.pages.dev/
```

## ローカルでのテスト

開発環境でテストする場合：

```bash
npm run dev      # Viteの開発サーバー（推奨）
npm run build    # 本番ビルド確認
```

## CLI経由のデプロイ（手動）

GitHub連携を設定した後、緊急時に手動デプロイが必要な場合：

```bash
npm run build
npx wrangler pages deploy dist --project-name=recorder-visualizer
```

### トークンエラーが出た場合

エラー例：
```
Authentication error [code: 10000]
```

**解決方法:**

GitHub連携を使用している場合は、このコマンドは実行不要です。

ただしCLI経由でデプロイしたい場合は、APIトークンの権限を確認：

1. https://dash.cloudflare.com/profile/api-tokens にアクセス
2. 該当トークンを編集
3. **権限** で以下を確認：
   ```
   Account Settings > Pages
   ```
4. 不足していれば追加

## セキュリティベストプラクティス

✅ **GitHub連携を使う（推奨）**
- API トークンが不要
- リポジトリと連携するだけ
- より安全で管理が簡単

❌ **避けるべき**
- ローカルマシンに API トークンを保存
- コードにトークンを含める
- 環境変数の設定を忘れる

## トラブルシューティング

### デプロイが開始されない

1. GitHub リポジトリの設定を確認
   ```
   Settings → Webhooks
   ```
   Cloudflare Webhook が登録されているか確認

2. Cloudflare Pages の デプロイメント履歴を確認
   - 失敗していれば、ビルドログで原因確認

### ビルドが失敗する

```bash
# ローカルで本番ビルドをテスト
npm run build
```

成功すれば環境の問題、失敗すれば コード問題

### Node.js バージョンの問題

Cloudflareで Node.js バージョンを明示的に指定：

1. **設定** → **環境変数**
2. 以下を追加：
   ```
   NODE_VERSION: 18
   ```

## 確認チェックリスト

- [ ] Cloudflare Dashboard にログイン
- [ ] Pages プロジェクト確認: `recorder-visualizer`
- [ ] GitHub リポジトリ連携完了
- [ ] ビルド設定入力: `npm run build` / `dist`
- [ ] main ブランチに push
- [ ] デプロイメント開始を確認
- [ ] `https://recorder-visualizer.pages.dev/` で動作確認

---

**推奨フロー:**
1. Cloudflare Dashboard で GitHub連携を一度だけ設定
2. 以降はGitHubへpushするだけで自動デプロイ
3. ローカルではテスト用に `npm run dev` を使用

**参考リンク**
- [Cloudflare Pages + GitHub](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages ビルド設定](https://developers.cloudflare.com/pages/platform/build-configuration/)
