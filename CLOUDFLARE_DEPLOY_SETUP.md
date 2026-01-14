# Cloudflare Pages デプロイ設定ガイド

GitHub連携でデプロイコマンドを実行するために必要な設定です。

## 現在のエラー

```
Authentication error [code: 10000]
User API Token の権限不足
```

## 解決手順

### ステップ1: 正しい API Token を作成

1. **https://dash.cloudflare.com/profile/api-tokens** にアクセス
2. **Create Token** をクリック
3. 以下の権限を設定：

```
Permission Scope:
- Account > Cloudflare Pages > Edit
- Account > Cloudflare Workers > Edit (必要に応じて)
```

4. **Continue to summary** → **Create Token**
5. トークンをコピー

### ステップ2: GitHub Secrets に登録

1. GitHub リポジトリ → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret** をクリック
4. 以下を追加：
   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: [コピーしたトークン]
   ```
5. **Add secret**

### ステップ3: Cloudflare Dashboard でビルド設定

1. **https://dash.cloudflare.com** → **Pages** → `recorder-visualizer`
2. **設定** → **ビルド設定**
3. 以下を設定：

```
✓ ビルドコマンド: npm run build
✓ ビルド出力ディレクトリ: dist
✓ デプロイコマンド: npx wrangler pages deploy dist --project-name=recorder-visualizer
```

4. **デプロイメント設定** → **環境変数**
5. 環境変数を追加：
   ```
   名前: CLOUDFLARE_API_TOKEN
   値: [上記で取得したトークン]
   ```

### ステップ4: GitHub連携を有効化

1. **設定** → **Git リポジトリ**
2. **GitHub に接続** をクリック
3. リポジトリを選択：
   ```
   Organization: sho11decade
   Repository: RecorderVisualizer
   Branch: main
   ```

## デプロイメントフロー

```
git push to main
  ↓
GitHub Webhook トリガー
  ↓
Cloudflare Pages ビルド開始
  ↓
npm install → npm run build
  ↓
npm run build 完了後、デプロイコマンド実行
  ↓
npx wrangler pages deploy dist
  ↓
Pages にデプロイ完了
```

## トラブルシューティング

### Token エラーが続く場合

1. トークンの権限を再確認
   - https://dash.cloudflare.com/profile/api-tokens
   - 該当トークン → **Edit** → 権限確認

2. 環境変数が正しく設定されているか確認
   - Cloudflare Dashboard の環境変数
   - GitHub Secrets の環境変数

3. トークンを再作成
   - 古いトークンを削除
   - 新しいトークンを作成
   - GitHub Secrets と Cloudflare 環境変数を更新

### ビルドログの確認

Cloudflare Pages でデプロイメント失敗時：
1. Pages プロジェクト → **デプロイメント** タブ
2. 失敗したデプロイをクリック
3. **ビルドログ** で詳細確認

## 確認チェックリスト

- [ ] 新しい API Token を作成（Pages > Edit 権限）
- [ ] GitHub Secrets に `CLOUDFLARE_API_TOKEN` を登録
- [ ] Cloudflare ビルド設定で環境変数を追加
- [ ] ビルドコマンド: `npm run build`
- [ ] デプロイコマンド: `npx wrangler pages deploy dist --project-name=recorder-visualizer`
- [ ] GitHub リポジトリを接続
- [ ] main ブランチに push してデプロイ開始を確認

---

**参考リンク**
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- [Pages Build Configuration](https://developers.cloudflare.com/pages/platform/build-configuration/)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
