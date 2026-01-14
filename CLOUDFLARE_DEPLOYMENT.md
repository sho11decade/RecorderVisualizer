# Cloudflare Workersへのデプロイ方法

このプロジェクトはCloudflare WorkersおよびCloudflare Pagesで実行できます。

## セットアップ

### 前提条件
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)がインストールされていること
- Cloudflareアカウント

### インストール

1. **依存関係をインストール**
```bash
npm install
```

2. **Wrangler ログイン**
```bash
wrangler login
```

3. **wrangler.toml を編集**
`wrangler.toml`の `zone_name` をあなたのドメインに変更してください：
```toml
[[routes]]
pattern = "*/*"
zone_name = "your-domain.com"  # ← ここをあなたのドメインに変更
```

## デプロイ方法

### オプション 1: Cloudflare Pagesへのデプロイ（推奨）

#### 方法A: GitHub連携（自動デプロイ）
1. GitHubにこのリポジトリをプッシュ
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages に移動
3. **"GitHub に接続"** をクリック
4. リポジトリを選択
5. ビルド設定：
   - **ビルドコマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `dist`

#### 方法B: CLIから直接デプロイ
```bash
npm run build
npm run deploy
```

### オプション 2: Cloudflare Workersへのデプロイ

```bash
npm run build
wrangler deploy
```

## 開発時のローカルテスト

```bash
npm run dev
```

または、Workersのローカル環境でテスト：
```bash
npm run build
npm run workers:dev
```

## 環境変数の設定

`.wrangler` ディレクトリ内の`wrangler.toml`で環境変数を設定できます：

```toml
[env.production]
name = "recorder-visualizer"
vars = { ENVIRONMENT = "production" }
```

## トラブルシューティング

### `wrangler login` でエラーが出る場合
```bash
wrangler logout
wrangler login
```

### ビルドエラーが出る場合
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Pagesにデプロイ後、404エラーが出る場合
- `src/worker.ts`がSPAのルーティングを正しく処理していることを確認
- `_redirects` ファイルが不要（Workerが処理）

## 本番環境設定

デプロイする前に確認：
- `vite.config.ts` の `base` オプン確認
- `src/worker.ts` のキャッシュ設定確認
- Cloudflareの利用規約確認

---

デプロイ後のURL: `https://your-project.pages.dev` または `https://recorder-visualizer.your-domain.com`
