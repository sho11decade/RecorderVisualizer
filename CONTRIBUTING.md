# コントリビューションガイド

Recorder Visualizer への貢献を歓迎します！このドキュメントでは、プロジェクトへの貢献方法を説明します。

## 行動規範

このプロジェクトに参加するすべての人は、以下の行動規範を遵守することが期待されます：

- 敬意を持って他者と接する
- 建設的なフィードバックを提供する
- コミュニティの多様性を尊重する
- プロフェッショナルな態度を維持する

## 貢献の種類

### 🐛 バグ報告

バグを発見した場合は、以下の情報を含めて Issue を作成してください：

- **明確なタイトル**: 問題を簡潔に説明
- **再現手順**: 問題を再現するための詳細な手順
- **期待される動作**: 本来どのように動作すべきか
- **実際の動作**: 実際に何が起きたか
- **環境情報**: ブラウザ、OS、バージョンなど
- **スクリーンショット**: 可能であれば画像を添付

**テンプレート:**
```markdown
## バグの説明
[バグの簡潔な説明]

## 再現手順
1. ...
2. ...
3. ...

## 期待される動作
[期待される動作の説明]

## 実際の動作
[実際に起きたことの説明]

## 環境
- ブラウザ: Chrome 120.0
- OS: Windows 11
- バージョン: 0.0.0

## スクリーンショット
[可能であれば添付]
```

### ✨ 機能提案

新機能のアイデアがある場合：

1. まず Issue を作成して提案を議論
2. 実装方法について意見を求める
3. 承認後にプルリクエストを作成

**テンプレート:**
```markdown
## 機能の概要
[提案する機能の簡潔な説明]

## 動機
[なぜこの機能が必要か]

## 提案する実装
[どのように実装するか]

## 代替案
[検討した他の方法]
```

### 📝 ドキュメント改善

- タイポの修正
- 説明の追加・改善
- サンプルコードの追加
- 翻訳（将来的に英語版を予定）

### 💻 コード貢献

以下のガイドラインに従ってください。

## 開発環境のセットアップ

### 必要なツール

- Node.js 18.0.0 以上
- npm 9.0.0 以上
- Git
- VS Code（推奨）

### セットアップ手順

```bash
# リポジトリをフォーク
# GitHub上で Fork ボタンをクリック

# フォークをクローン
git clone https://github.com/YOUR_USERNAME/recorder-visualizer.git
cd recorder-visualizer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### VS Code 推奨拡張機能

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

## コーディング規約

### TypeScript

```typescript
// ✅ Good
interface UserData {
  name: string;
  age: number;
}

function getUserName(user: UserData): string {
  return user.name;
}

// ❌ Bad
function getUserName(user: any) {
  return user.name;
}
```

### 命名規則

- **コンポーネント**: PascalCase
  ```typescript
  function RecorderModel() { ... }
  ```

- **関数・変数**: camelCase
  ```typescript
  const userName = 'John';
  function calculateTotal() { ... }
  ```

- **定数**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_STEPS = 16;
  const DEFAULT_BPM = 120;
  ```

- **型・インターフェース**: PascalCase
  ```typescript
  interface Fingering { ... }
  type NoteKey = string;
  ```

### コメント

```typescript
// ✅ Good: 日本語で明確に説明
// ユーザーの年齢を計算する
function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

// ✅ Good: 英語でも可
/**
 * Calculates the age based on birth year
 * @param birthYear - The year of birth
 * @returns The calculated age
 */
function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

// ❌ Bad: コメントなし、または自明な内容
function calculateAge(birthYear: number): number {
  // 年齢を返す
  return new Date().getFullYear() - birthYear;
}
```

### ファイル構成

```typescript
// ✅ Good: インポートの順序
// 1. 外部ライブラリ
import { useState } from 'react';
import * as THREE from 'three';

// 2. 内部モジュール（絶対パス）
import { Button } from './components/ui/button';

// 3. 相対パス
import { FINGERINGS } from '../data/fingerings';

// 4. 型のみインポート
import type { Fingering } from '../types';

// 5. スタイル
import './styles.css';
```

### React コンポーネント

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500"
    >
      {label}
    </button>
  );
}

// ❌ Bad: 型定義なし
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

## コミット規約

### Conventional Commits

以下の形式を使用してください：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマットなど）
- `refactor`: バグ修正や機能追加ではないコード変更
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

### 例

```bash
# 新機能
git commit -m "feat(audio): add metronome volume control"

# バグ修正
git commit -m "fix(3d): correct hole position for F5 fingering"

# ドキュメント
git commit -m "docs(readme): update installation instructions"

# リファクタリング
git commit -m "refactor(audio): simplify sequence playback logic"
```

## プルリクエストのガイドライン

### 作成前のチェックリスト

- [ ] コードがビルドエラーなく動作する
- [ ] ESLint エラーがない
- [ ] 既存の機能を壊していない
- [ ] 適切なコミットメッセージを使用
- [ ] ドキュメントを更新（必要な場合）

### プルリクエストの手順

1. **フィーチャーブランチを作成**
   ```bash
   git checkout -b feature/add-baroque-fingering
   ```

2. **変更を実装**
   ```bash
   # コードを編集
   npm run dev  # 動作確認
   npm run lint # Lint チェック
   npm run build # ビルド確認
   ```

3. **変更をコミット**
   ```bash
   git add .
   git commit -m "feat(fingering): add baroque fingering support"
   ```

4. **フォークにプッシュ**
   ```bash
   git push origin feature/add-baroque-fingering
   ```

5. **プルリクエストを作成**
   - GitHub で "New Pull Request" をクリック
   - 明確なタイトルと説明を記入
   - 関連する Issue をリンク

### プルリクエストのテンプレート

```markdown
## 変更内容
[変更内容の簡潔な説明]

## 動機と背景
[なぜこの変更が必要か]

## 変更の種類
- [ ] バグ修正
- [ ] 新機能
- [ ] 破壊的変更
- [ ] ドキュメント更新

## テスト方法
1. ...
2. ...
3. ...

## スクリーンショット（該当する場合）
[画像を添付]

## チェックリスト
- [ ] コードがビルドできる
- [ ] ESLint エラーがない
- [ ] 既存機能を壊していない
- [ ] ドキュメントを更新した

## 関連 Issue
Closes #123
```

## コードレビュープロセス

### レビュアーの責任

- 24-48時間以内にレビューを開始
- 建設的なフィードバックを提供
- コードの品質、パフォーマンス、セキュリティを確認
- ドキュメントの完全性を確認

### 著者の責任

- フィードバックに迅速に対応
- 質問に丁寧に答える
- 必要に応じて変更を加える
- レビュー後に「Re-request review」をクリック

## テストガイドライン

### 現在のテスト状況

現在、自動テストは実装されていません。将来的に以下を追加予定：

- ユニットテスト（Vitest）
- コンポーネントテスト（React Testing Library）
- E2Eテスト（Playwright）

### 手動テストのチェックリスト

新機能追加時は以下を確認：

- [ ] メロディーの入力・編集・削除
- [ ] 再生・停止・ループ
- [ ] 3D運指表示の正確性
- [ ] BPM/ボリューム調整
- [ ] プリセット読み込み
- [ ] マイク・ピッチ検出（HTTPS環境で）
- [ ] LocalStorage の永続化
- [ ] レスポンシブレイアウト
- [ ] 各ブラウザでの動作（Chrome, Firefox, Safari）

## ブランチ戦略

### メインブランチ

- `main`: 本番環境と同期する安定版

### 作業ブランチ

- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新
- `refactor/*`: リファクタリング

### 例

```bash
git checkout -b feature/add-midi-import
git checkout -b fix/pitch-detection-accuracy
git checkout -b docs/update-api-reference
```

## リリースプロセス

1. バージョン番号を更新（package.json）
2. CHANGELOG.md を更新
3. タグを作成
   ```bash
   git tag -a v0.1.0 -m "Release version 0.1.0"
   git push origin v0.1.0
   ```

## 質問・サポート

質問がある場合：

1. まず [FAQ](./FAQ.md) を確認（準備中）
2. [Issues](https://github.com/yourusername/recorder-visualizer/issues) で既存の質問を検索
3. 見つからない場合は新しい Issue を作成

## ライセンス

貢献したコードは、プロジェクトのライセンス（MIT）の下で公開されます。

---

**ありがとうございます！** あなたの貢献が Recorder Visualizer をより良いものにします。🎵
