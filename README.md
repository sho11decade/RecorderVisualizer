# Recorder Visualizer

**リコーダー学習を、もっと楽しく、もっと直感的に。**

Recorder Visualizer は、ブラウザで動作する無料のリコーダー練習支援アプリケーションです。3D可視化、メロディーシーケンサー、ピッチ検出機能を統合し、初心者から経験者まで楽しく練習できる環境を提供します。

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)

## [Access the app](https://recorder.ricezero.fun/)

![スクリーンショット](./public/rec21.gif)

## 主な機能

### 3D運指ガイド
- **リアルタイム3D表示**: Three.jsによる精密なリコーダーモデル
- **視覚的な運指表示**: 押さえるべき穴を色分けして表示
- **360度回転**: マウスやタッチで自由に視点を操作

### メロディーシーケンサー
- **16ステップグリッド**: 直感的な音符入力インターフェース
- **プリセット楽曲**: カエルの歌、きらきら星など定番曲を収録
- **自動保存**: ブラウザに楽曲を自動保存
- **テンポ調整**: 60～180 BPM で自由に調整
- **ループ再生**: 繰り返し練習に最適

### ピッチ検出チューナー
- **リアルタイム音程表示**: マイクで自分の演奏をチェック
- **音程差表示**: 正解音との差をビジュアル表示
- **自動認識**: 吹いた音を自動で識別

### 高品質オーディオ
- **Tone.js エンジン**: リコーダーに近い自然な音色
- **リバーブエフェクト**: ホールのような響き
- **メトロノーム機能**: リズム練習をサポート

## クイックスタート

### 必要環境
- Node.js 18.0.0 以上
- npm 9.0.0 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/recorder-visualizer.git

# ディレクトリに移動
cd recorder-visualizer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:5173](http://localhost:5173) を開きます。

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 使い方

### 基本操作

1. **音符の入力**: 画面下の音階パレットから音符をクリックしてグリッドに配置
2. **再生**: ▶️ ボタンで演奏開始
3. **運指確認**: 3Dモデルで指の位置を確認
4. **プリセット読み込み**: メニューから定番曲を選択

### ショートカットキー

- `Space`: 再生/停止
- マウスホイール: 3Dビューのズーム

### ピッチ検出の使い方

1. 🎤 マイクボタンをクリック
2. ブラウザのマイク権限を許可
3. リコーダーを吹いて音程をチェック

## 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite 7
- **3Dレンダリング**: Three.js + React Three Fiber
- **オーディオ**: Tone.js
- **UI コンポーネント**: Radix UI + Tailwind CSS
- **スタイリング**: Tailwind CSS
- **型チェック**: TypeScript 5.9

## プロジェクト構造

```
src/
├── App.tsx                    # メインアプリケーション
├── components/
│   ├── Recorder3D.tsx         # 3Dリコーダーモデル
│   ├── pages/                 # 情報ページ
│   └── ui/                    # UIコンポーネント
├── data/
│   ├── fingerings.ts          # 運指データベース
│   └── presets.ts             # プリセット楽曲
└── utils/
    ├── AudioEngine.ts         # 音声合成エンジン
    └── PitchDetector.ts       # ピッチ検出
```

詳細な実装ドキュメントは [IMPLEMENTATION.md](./IMPLEMENTATION.md) を参照してください。

## 対応音域

現在、以下の音域に対応しています：

- **C5（ド）** ～ **D6（高いレ）** の9音
- ジャーマン式運指

## ブラウザ対応

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+（一部機能制限あり）

**注意**: マイク機能を使用するには HTTPS 接続が必要です。

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](./LICENSE) ファイルを参照してください。

## 謝辞

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3Dレンダリング
- [Tone.js](https://tonejs.github.io/) - Web Audio フレームワーク
- [Radix UI](https://www.radix-ui.com/) - アクセシブルなUIコンポーネント
- [Lucide](https://lucide.dev/) - 美しいアイコンセット

## サポート・作者
開発者: RiceZero (https://ricezero.fun/)
[Twitter: @ricezero21](https://twitter.com/ricezero21)
[GitHub: sho11decade](https://github.com/sho11decade)
[Email: contact@ricezero.fun](mailto:contact@ricezero.fun)

問題がある場合は、[Issues](https://github.com/sho11decade/RecorderVisualizer/issues) ページで報告するか、
[フォーム](https://ricezero.fun/contact) までお願いします。
