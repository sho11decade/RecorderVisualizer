# Recorder Visualizer - 実装ドキュメント

最終更新: 2026年1月14日

## プロジェクト概要

**Recorder Visualizer**は、リコーダー学習を支援するインタラクティブなWebアプリケーションです。3D可視化、メロディーシーケンサー、ピッチ検出機能を統合し、ブラウザのみで完結する練習環境を提供します。

## システムアーキテクチャ

本プロジェクトのアーキテクチャ図は、[Draw.io形式で提供されています](./architecture.drawio)。

[![Architecture Diagram](https://img.shields.io/badge/View-Architecture_Diagram-blue?logo=diagramsdotnet)](./architecture.drawio)

このアーキテクチャ図には以下の要素が含まれています：

- **ユーザーインターフェース層**: ブラウザ、UIコンポーネント、3Dキャンバス、シーケンサーUI
- **コアアプリケーション層**: App.tsx、カスタムフック、Reactコンポーネント、コンテキスト
- **エンジン層**: AudioEngine (Tone.js)、PitchDetector (Web Audio API)、Recorder3D (Three.js)
- **データ層**: 運指データベース、プリセット楽曲、LocalStorage、i18n翻訳
- **外部サービス**: Google Analytics 4

アーキテクチャ図の閲覧には、[Draw.io](https://app.diagrams.net/)または[diagrams.net](https://www.diagrams.net/)を使用してください。VSCodeユーザーは[Draw.io Integration拡張機能](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)を利用できます。

### 技術スタック

- **フレームワーク**: React 19.2.0 + TypeScript
- **ビルドツール**: Vite 7.2.4
- **3Dレンダリング**: Three.js + React Three Fiber + Drei
- **オーディオエンジン**: Tone.js
- **UIライブラリ**: Radix UI + Tailwind CSS
- **状態管理**: React Hooks (useState, useEffect, useRef)

## プロジェクト構造

```
src/
├── App.tsx                    # メインアプリケーションコンポーネント
├── main.tsx                   # エントリーポイント
├── index.css                  # グローバルスタイル
├── components/
│   ├── Recorder3D.tsx         # 3Dリコーダーモデルと運指可視化
│   ├── pages/
│   │   ├── About.tsx          # アプリケーション情報ページ
│   │   └── Privacy.tsx        # プライバシーポリシー
│   └── ui/                    # 再利用可能なUIコンポーネント（Radix UI）
├── data/
│   ├── fingerings.ts          # 運指データベース（C5～D6）
│   └── presets.ts             # プリセット楽曲（カエルの歌、きらきら星など）
├── utils/
│   ├── AudioEngine.ts         # Tone.js音声合成・シーケンサー制御
│   └── PitchDetector.ts       # マイク入力・ピッチ検出（自己相関法）
└── styles/                    # 追加スタイル定義
```

## 主要機能の実装状況

### ✅ 完全実装済み

#### 1. 3D運指可視化システム (`Recorder3D.tsx`)

**機能:**
- Three.jsによるリアルタイム3Dレンダリング
- ソプラノリコーダー（ジャーマン式）の精密なモデリング
- 8つの穴（裏穴1 + 表穴7）の開閉状態をカラーコーディングで表示
- OrbitControls による360度視点操作
- 各穴に日本語ラベル表示（「裏穴」「左1」など）

**実装詳細:**
```typescript
interface Fingering {
  note: string;      // 表示名（ド、レ、ミ...）
  pitch: string;     // Tone.js用ピッチ表記（C5, D5...）
  holes: boolean[];  // [裏穴, 左1, 左2, 左3, 右1, 右2, 右3, 右4]
}
```

**レンダリング構成:**
- 頭部管・中部管・下部管の3セクション
- ベジェ（吹き口）の詳細形状
- ラビューム（窓）の表現
- 環境マッピングによるリアルな質感
- ContactShadows によるリアルな影表現

#### 2. メロディーシーケンサー (`App.tsx`)

**機能:**
- 16ステップのグリッドベースシーケンサー
- ステップごとの音符入力・編集・削除
- 視覚的なカレントステップ表示（黄色ハイライト）
- LocalStorage による自動保存
- BPM調整（60～180）
- ボリューム調整（-30dB～0dB）
- ループ再生対応
- メトロノーム機能

**状態管理:**
```typescript
const [melodySteps, setMelodySteps] = useState<(string | null)[]>(Array(16).fill(null));
const [isPlaying, setIsPlaying] = useState(false);
const [currentStep, setCurrentStep] = useState<number | null>(null);
const [bpm, setBpm] = useState(120);
```

**再生フロー:**
1. `audioEngine.startSequence()` でTone.js Sequenceを開始
2. コールバックで `currentStep` を更新
3. `displayFingering` が自動的に対応する運指を算出
4. 3Dモデルがリアルタイムで運指を反映

#### 3. オーディオエンジン (`AudioEngine.ts`)

**機能:**
- Tone.js PolySynth を使用した高品質音声合成
- リコーダーに近似した音色設計:
  ```typescript
  oscillator: { type: "sine" }
  envelope: {
    attack: 0.04,   // マイルドな立ち上がり
    decay: 0.2,
    sustain: 0.5,
    release: 1.2     // 長い余韻
  }
  ```
- Reverb エフェクトによるホール空間の再現
- シーケンス再生制御（開始・停止・一時停止）
- メトロノーム機能
- ミュート機能

**主要メソッド:**
```typescript
init(): void                  // AudioContext初期化
startSequence(steps, bpm, onStepCallback, onEndCallback, loop, metronome, muted): void
stopSequence(): void
playNote(noteKey: string): void  // プレビュー再生
setVolume(db: number): void
```

#### 4. ピッチ検出システム (`PitchDetector.ts`)

**機能:**
- Web Audio API による マイク入力取得
- 自己相関法（Autocorrelation）によるピッチ推定
- リアルタイム音程表示
- 正解音との差分表示（セント単位）

**実装アルゴリズム:**
```typescript
private autoCorrelate(buf: Float32Array, sampleRate: number): number {
  // 1. RMS計算でノイズフィルタリング
  // 2. ゼロクロッシング検出
  // 3. 自己相関計算
  // 4. 周波数→音程変換
}
```

**使用例:**
```typescript
pitchDetector.start((pitch) => {
  setDetectedPitch(pitch);  // { note: "C5", diff: +5 }
});
```

#### 5. プリセット楽曲システム (`presets.ts`)

**実装済みプリセット:**
- カエルの歌
- きらきら星
- メリーさんの羊
- チューリップ

**データ構造:**
```typescript
interface PresetSong {
  name: string;
  bpm: number;
  steps: (string | null)[];  // null は休符
}
```

**読み込み機能:**
- ドロップダウンメニューからワンクリック読み込み
- BPM自動設定
- 元のBPMを保存してリセット可能

#### 6. レスポンシブレイアウト

**機能:**
- ResizablePanel によるカスタマイズ可能なレイアウト
- 横配置/縦配置の切り替え
- モバイル対応（タッチ操作）

#### 7. ユーザー体験向上機能

- **ウェルカムダイアログ**: 初回訪問時のガイド表示
- **About/Privacy ページ**: 情報ページの実装
- **キーボードショートカット**: Space キーで再生/停止
- **音階パレット**: クリックで音符入力、ホバーでプレビュー再生
- **ビジュアルフィードバック**: 再生中のステップを黄色でハイライト

## データ構造詳細

### 運指データベース (`fingerings.ts`)

```typescript
export const FINGERINGS: Record<string, Fingering> = {
  'C5': { note: 'ド', pitch: 'C5', holes: [true, true, true, true, true, true, true, true] },
  'D5': { note: 'レ', pitch: 'D5', holes: [true, true, true, true, true, true, true, false] },
  'E5': { note: 'ミ', pitch: 'E5', holes: [true, true, true, true, true, true, false, false] },
  'F5': { note: 'ファ', pitch: 'F5', holes: [true, true, true, true, true, false, true, true] },
  'G5': { note: 'ソ', pitch: 'G5', holes: [true, true, true, true, false, false, false, false] },
  'A5': { note: 'ラ', pitch: 'A5', holes: [true, true, true, false, false, false, false, false] },
  'B5': { note: 'シ', pitch: 'B5', holes: [true, true, false, false, false, false, false, false] },
  'C6': { note: '高いド', pitch: 'C6', holes: [true, false, true, false, false, false, false, false] },
  'D6': { note: '高いレ', pitch: 'D6', holes: [false, false, true, false, false, false, false, false] },
};
```

**対応音域:** C5（ド）～ D6（高いレ）の9音

## 状態管理フロー

### アプリケーション状態

```typescript
// メロディーデータ
melodySteps: (string | null)[]       // シーケンサーの各ステップの音符

// 再生制御
isPlaying: boolean                    // 再生中フラグ
isLooping: boolean                    // ループ再生フラグ
useMetronome: boolean                 // メトロノームオン/オフ
isMelodyMuted: boolean                // メロディミュート
currentStep: number | null            // 現在再生中のステップインデックス

// マイク・チューナー
isMicActive: boolean                  // マイク使用中フラグ
detectedPitch: { note, diff } | null  // 検出された音程情報

// 設定
bpm: number                           // テンポ (60-180)
volume: number                        // ボリューム (-30～0 dB)
previewNote: string                   // プレビュー表示中の音符

// UI状態
showWelcome: boolean                  // ウェルカムダイアログ表示
isHorizontal: boolean                 // レイアウト方向
```

### データフロー

```
ユーザー入力
    ↓
App.tsx (状態更新)
    ↓
    ├→ AudioEngine.ts (音声再生)
    ├→ Recorder3D.tsx (3D表示更新)
    └→ LocalStorage (永続化)
```

## ビルド・デプロイ

### 開発環境

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 本番ビルド (dist/ に出力)
npm run preview  # ビルド結果のプレビュー
npm run lint     # ESLint チェック
```

### 本番ビルド成果物

- `dist/index.html` - エントリーポイント
- `dist/assets/` - バンドルされた JS/CSS
- サイズ: ~1.6MB（gzip: ~460KB）

### デプロイ要件

- 静的ホスティング対応（GitHub Pages, Netlify, Vercel など）
- HTTPS 必須（マイク機能のため）
- モダンブラウザ対応（ES2020+）

## パフォーマンス最適化

### 実装済み

1. **Three.js レンダリング最適化**
   - ジオメトリの再利用
   - マテリアルの共有
   - LOD（Level of Detail）準備

2. **オーディオ最適化**
   - Tone.js の遅延初期化（ユーザーインタラクション後）
   - PolySynth による効率的な音声合成

3. **React 最適化**
   - useRef による DOM参照
   - useCallback によるメモ化（今後の実装余地あり）

### 今後の改善案

- React.memo の適用
- useMemo によるコンポーネント最適化
- Code splitting（動的インポート）
- Web Worker による PitchDetector のオフロード

## セキュリティ・プライバシー

### データ保存

- **LocalStorage 使用**: メロディーデータのみをブラウザに保存
- **外部送信なし**: すべての処理がクライアント側で完結
- **マイク使用**: ユーザー明示的な許可が必要（getUserMedia）

### プライバシーポリシー

- `src/components/pages/Privacy.tsx` に実装済み
- データ収集なし
- Cookie 不使用
- アナリティクス未実装

## 既知の制限事項

### 技術的制限

1. **運指データ**: ジャーマン式のみ対応（バロック式は未実装）
2. **音域**: C5～D6 の9音のみ（低音域・超高音域未対応）
3. **ピッチ検出精度**: 環境ノイズの影響を受ける可能性
4. **ブラウザ互換性**: Safari での Web Audio API 制限

### UI/UX 制限

1. **ステップ数固定**: 16ステップのみ（可変長未対応）
2. **音符の長さ**: すべて均等（リズムパターン未対応）
3. **和音**: モノフォニック（単音）のみ

## 今後の拡張計画

### Phase 2 機能候補

- [ ] バロック式運指対応
- [ ] より広い音域（C4～G6）
- [ ] 可変ステップ数（8, 16, 32, 64）
- [ ] 音符の長さ調整（1/2, 1/4, 1/8拍）
- [ ] MIDI ファイルインポート
- [ ] 録音・エクスポート機能
- [ ] 楽譜表示モード
- [ ] カスタム運指エディタ

### Phase 3 機能候補

- [ ] マルチトラック対応
- [ ] リアルタイムコラボレーション
- [ ] AI 運指推奨エンジン
- [ ] アニメーション運指ガイド
- [ ] WebRTC によるリモートレッスン

## トラブルシューティング

### ビルドエラー

**問題**: TypeScript コンパイルエラー

**原因**: パッケージバージョン不一致

**解決**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 音が出ない

**問題**: 再生ボタンを押しても音が出ない

**原因**: ブラウザのオートプレイポリシー

**解決**: ユーザーインタラクション後に AudioContext を初期化済み（実装完了）

### マイクが動作しない

**問題**: ピッチ検出が起動しない

**原因**: HTTPS 接続必須、または権限拒否

**解決**:
1. HTTPS でアクセスしているか確認
2. ブラウザのマイク権限を確認
3. 別のブラウザで試す

## テスト状況

### 手動テスト完了項目

- [x] メロディー入力・編集・削除
- [x] 再生・停止・ループ
- [x] BPM/ボリューム調整
- [x] プリセット読み込み
- [x] 3D運指表示
- [x] LocalStorage 永続化
- [x] レスポンシブレイアウト
- [x] ビルド・デプロイ

### 未実装テスト

- [ ] ユニットテスト（Jest/Vitest）
- [ ] E2Eテスト（Playwright/Cypress）
- [ ] アクセシビリティテスト
- [ ] パフォーマンステスト

## 貢献ガイドライン

### コーディング規約

- **TypeScript**: 厳密な型定義を使用
- **命名規則**: 
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE
- **コメント**: 日本語で記述（関数は英語可）
- **フォーマット**: ESLint + Prettier（設定済み）

### コミットメッセージ

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル変更
refactor: リファクタリング
perf: パフォーマンス改善
test: テスト追加・修正
chore: その他の変更
```

## ライセンス・クレジット

### 使用ライブラリ

- React (MIT License)
- Three.js (MIT License)
- Tone.js (MIT License)
- Radix UI (MIT License)
- Lucide React (ISC License)

### アトリビューション

詳細は `src/Attributions.md` を参照。

---

## 変更履歴

### 2026-01-14
- 初版作成
- 全機能の実装完了
- TypeScript コンパイルエラー修正完了
- ビルド正常化確認

---

**メンテナー**: Recorder Visualizer Development Team  
**プロジェクトステータス**: ✅ Production Ready (v0.0.0)
