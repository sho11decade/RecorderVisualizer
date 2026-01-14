# Google Analytics 設定ガイド

Recorder Viz に Google Analytics を統合し、ユーザー行動を追跡できます。

## セットアップ手順

### ステップ1: Google Analytics 4 プロパティの作成

1. **Google Analytics**（https://analytics.google.com）にアクセス
2. **新しいプロパティを作成** をクリック
   - プロパティ名: "Recorder Viz"
   - レポートタイムゾーン: 日本
   - 通貨: JPY

3. **データストリーム設定**
   - プラットフォーム: **ウェブ**
   - ウェブサイトのURL: `https://recorder-visualizer.pages.dev`
   - ストリーム名: "Recorder Viz"
   - **ストリームを作成**

4. **計測ID（Measurement ID）をコピー**
   - 形式: `G-XXXXXXXXXX`

### ステップ2: Cloudflare Pages に環境変数を設定

1. **Cloudflare Dashboard** にアクセス
2. **Pages** → `recorder-visualizer`
3. **設定** → **環境変数**
4. **環境変数を追加**

**本番環境（Production）:**
```
名前: VITE_GA_MEASUREMENT_ID
値: G-XXXXXXXXXX （ステップ1で取得した計測ID）
```

**プレビュー環境（オプション）:**
```
名前: VITE_GA_MEASUREMENT_ID
値: G-PREVIEW-ID （テスト用）
```

### ステップ3: ローカル開発環境での設定

`.env.local` ファイルをプロジェクトルートに作成：

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### ステップ4: ビルドとデプロイ

```bash
npm run build
git add .
git commit -m "Add Google Analytics integration"
git push origin main
```

Cloudflare Pages が自動的にビルドしてデプロイします。

## トラッキング機能

### 自動トラッキング

- **ページビュー**: アプリケーションロード時に自動記録

### カスタムイベント

以下のイベントが自動的に記録されます：

#### 再生制御
- `playback` イベント
  - `action: 'play'` - メロディー再生開始
  - `action: 'stop'` - メロディー停止

#### メロディー操作
- `melody` イベント
  - `action: 'clear'` - メロディークリア
  - `action: 'load_preset'` - プリセット読み込み

#### マイク操作
- `microphone` イベント
  - `state: 'on'` - マイク有効化
  - `state: 'off'` - マイク無効化

#### エラー
- `error` イベント
  - `error_type: string` - エラー種類
  - `error_description: string` - エラー詳細

## Google Analytics で見るべきデータ

### レポート種類

1. **ホーム画面**
   - ユーザー数（24時間、7日間、30日間）
   - エンゲージメント率

2. **エンゲージメント** → **イベント**
   - `playback` イベント数
   - `melody` イベント数
   - `microphone` イベント数
   - `error` イベント数

3. **ユーザー** → **デバイス情報**
   - OS（Windows, macOS, Linux, iOS, Android等）
   - ブラウザ情報

### 実装例：カスタムイベント

```typescript
// 再生開始をトラッキング
trackPlaybackEvent('play');

// メロディークリアをトラッキング
trackMelodyEvent('clear');

// マイク有効化をトラッキング
trackMicEvent('on');

// エラーをトラッキング
trackErrorEvent('microphone', 'Microphone not found');
```

## トラブルシューティング

### イベントが Google Analytics に表示されない

1. **計測IDの確認**
   ```
   Cloudflare Pages 環境変数で正しい計測IDを設定
   ```

2. **ビルド再実行**
   ```bash
   npm run build
   git push origin main
   ```

3. **Google Analytics にリアルタイムレポートを確認**
   - Google Analytics → レポート → リアルタイム
   - データが表示されているか確認

### 本番と開発の計測IDを分ける

開発環境用に別のプロパティを作成し、`.env.local` で管理：

```env
# 開発環境
VITE_GA_MEASUREMENT_ID=G-DEV-ID

# 本番環境は Cloudflare Pages で設定
```

## プライバシーとポリシー

Google Analytics 使用時は、プライバシーポリシーの更新が必要です：

```markdown
## データ収集について

当アプリケーションは、ユーザー体験向上のため Google Analytics でアクセス解析を行っています。

### 収集するデータ
- ページビュー
- ユーザーの行動（再生、クリア等）
- デバイス情報（OS、ブラウザ）
- エラー情報

### データの使用
- サービス改善のための分析
- ユーザー体験の向上
- 機能の最適化

### プライバシー保護
- IPアドレスは匿名化されます
- 個人を特定する情報は収集されません
```

## 参考リンク

- [Google Analytics 公式ドキュメント](https://support.google.com/analytics)
- [Google Analytics 4 設定ガイド](https://support.google.com/analytics/answer/10089681)
- [gtag.js リファレンス](https://developers.google.com/analytics/devguides/collection/gtagjs)

---

**注意**: プライバシー規則（GDPR等）に従い、必要に応じてユーザーの同意を取得してください。

**最終更新**: 2026年1月15日
