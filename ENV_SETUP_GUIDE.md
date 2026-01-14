# Google Analytics 環境変数設定ガイド（簡潔版）

## 方法1: ローカル開発（推奨）

### .env.local ファイルを作成

プロジェクトルートに `.env.local` ファイルを作成：

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

計測IDを取得する：
1. https://analytics.google.com にアクセス
2. プロパティを作成
3. ウェブストリームの計測ID（`G-` で始まる）をコピー

### ローカルで確認

```bash
npm run dev
```

## 方法2: 本番環境（Cloudflare Pages）

### Cloudflare Dashboard での設定

1. **https://dash.cloudflare.com** にアクセス
2. **Pages** → `recorder-visualizer` をクリック
3. **設定** タブ
4. **環境変数** セクション

### 環境変数を追加（本番環境）

```
変数名: VITE_GA_MEASUREMENT_ID
値: G-XXXXXXXXXX
環境: Production
```

## 3: デプロイして確認

```bash
npm run build
git add .
git commit -m "Google Analytics setup"
git push origin main
```

## トラッキング確認

### Google Analytics でリアルタイム確認

1. https://analytics.google.com
2. リアルタイム レポート
3. アクティブなユーザーが表示されるか確認

### ブラウザのコンソールで確認

F12（開発者ツール）→ コンソールで以下を確認：

```javascript
console.log(window.gtag); // 関数が表示されれば正常
```

## トラブルシューティング

### イベントが記録されない

**原因**: 計測ID が間違っているまたは設定されていない

**確認**:
1. Cloudflare Dashboard で環境変数を確認
2. 計測ID が `G-` で始まるか確認
3. Pages プロジェクトを再デプロイ

```bash
npm run build
git push origin main
```

### `VITE_GA_MEASUREMENT_ID` が見つからないエラー

**原因**: `.env.local` がない、または計測ID が設定されていない

**解決**:
1. `.env.local` ファイルを作成
2. `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` を追加
3. 開発サーバーを再起動: `npm run dev`

### ローカルで Google Analytics スクリプトが読み込まれない

**確認**:
```bash
# .env.local の内容を確認
cat .env.local

# 値が正しくセットされているか確認
echo $VITE_GA_MEASUREMENT_ID
```

## 値が設定されない場合の確認リスト

- [ ] Google Analytics で計測ID を取得したか?
- [ ] Cloudflare Pages の環境変数セクションで値を入力したか?
- [ ] デプロイ後、最低 5分 待ったか?（キャッシュ反映待ち）
- [ ] 計測ID が `G-XXXXXXXXXX` 形式か?
- [ ] コピー＆ペーストで余分なスペースが入っていないか?

## 手動での設定確認

Cloudflare Dashboard で直接確認：

```
https://dash.cloudflare.com
  → Pages 
  → recorder-visualizer
  → 設定
  → 環境変数
```

表に以下が表示されていることを確認：
- **変数名**: VITE_GA_MEASUREMENT_ID
- **値**: G-XXXXXXXXXX
- **環境**: Production チェック✓

---

**参考**:
- [Google Analytics 計測ID の取得](https://support.google.com/analytics/answer/9539674)
- [Vite 環境変数](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Pages 環境変数](https://developers.cloudflare.com/pages/platform/build-configuration/)
