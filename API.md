# API リファレンス

Recorder Visualizer の主要コンポーネントとユーティリティのAPIドキュメント

## 目次

- [AudioEngine](#audioengine)
- [PitchDetector](#pitchdetector)
- [Fingerings](#fingerings)
- [Presets](#presets)
- [Recorder3D](#recorder3d)

---

## AudioEngine

オーディオ再生とシーケンサー制御を担当するクラス

### 概要

```typescript
import { audioEngine } from './utils/AudioEngine';
```

### メソッド

#### `init(): void`

AudioContext を初期化します。ユーザーインタラクション後に呼び出す必要があります。

```typescript
audioEngine.init();
```

#### `startSequence(steps, bpm, onStepCallback, onEndCallback, loop, metronome, muted): void`

メロディーシーケンスの再生を開始します。

**パラメータ:**
- `steps: (string | null)[]` - 各ステップの音符キー（null は休符）
- `bpm: number` - テンポ（60-180）
- `onStepCallback: (stepIndex: number, noteKey: string | null) => void` - 各ステップ実行時のコールバック
- `onEndCallback: () => void` - シーケンス終了時のコールバック
- `loop: boolean` - ループ再生フラグ
- `metronome: boolean` - メトロノーム有効フラグ
- `muted: boolean` - メロディーミュートフラグ

**例:**
```typescript
audioEngine.startSequence(
  ['C5', 'D5', 'E5', null],
  120,
  (index) => console.log(`Step ${index}`),
  () => console.log('End'),
  false,
  true,
  false
);
```

#### `stopSequence(): void`

再生中のシーケンスを停止します。

```typescript
audioEngine.stopSequence();
```

#### `playNote(noteKey: string): void`

単一の音符をプレビュー再生します。

**パラメータ:**
- `noteKey: string` - 音符キー（例: 'C5', 'D5'）

```typescript
audioEngine.playNote('C5');
```

#### `setVolume(db: number): void`

マスターボリュームを設定します。

**パラメータ:**
- `db: number` - デシベル値（-30 ～ 0）

```typescript
audioEngine.setVolume(-10);
```

#### `setMetronomeVolume(db: number): void`

メトロノームのボリュームを設定します。

**パラメータ:**
- `db: number` - デシベル値（-30 ～ 0）

```typescript
audioEngine.setMetronomeVolume(-15);
```

---

## PitchDetector

マイク入力からピッチを検出するクラス

### 概要

```typescript
import { pitchDetector } from './utils/PitchDetector';
```

### メソッド

#### `start(callback: (result: PitchResult | null) => void): Promise<void>`

マイク入力を開始し、ピッチ検出を実行します。

**パラメータ:**
- `callback: (result: PitchResult | null) => void` - 検出結果のコールバック

**PitchResult 型:**
```typescript
interface PitchResult {
  note: string;      // 音符名（例: 'C5'）
  diff: number;      // 正解音との差（セント）
  frequency: number; // 周波数（Hz）
}
```

**例:**
```typescript
await pitchDetector.start((result) => {
  if (result) {
    console.log(`Note: ${result.note}, Diff: ${result.diff} cents`);
  }
});
```

#### `stop(): void`

マイク入力を停止します。

```typescript
pitchDetector.stop();
```

#### `detect(): PitchResult | null`

現在のオーディオバッファからピッチを検出します（手動呼び出し用）。

```typescript
const pitch = pitchDetector.detect();
```

---

## Fingerings

運指データベース

### 概要

```typescript
import { FINGERINGS, SCALE_ORDER } from './data/fingerings';
import type { Fingering } from './data/fingerings';
```

### 型定義

#### `Fingering`

```typescript
interface Fingering {
  note: string;       // 表示名（例: 'ド', 'レ'）
  pitch: string;      // Tone.js用ピッチ（例: 'C5', 'D5'）
  holes: boolean[];   // 穴の開閉状態 [裏穴, 左1, 左2, 左3, 右1, 右2, 右3, 右4]
  isHigh?: boolean;   // 高音域フラグ（サミング用）
}
```

### データ

#### `FINGERINGS: Record<string, Fingering>`

全ての運指データを格納するオブジェクト。

**例:**
```typescript
const cFingering = FINGERINGS['C5'];
console.log(cFingering.note);  // 'ド'
console.log(cFingering.holes); // [true, true, true, true, true, true, true, true]
```

#### `SCALE_ORDER: string[]`

音階の順序配列。

```typescript
// ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6']
```

### 対応音域

| キー | 音名 | 運指パターン |
|------|------|-------------|
| C5 | ド | ●●●●●●●● |
| D5 | レ | ●●●●●●●○ |
| E5 | ミ | ●●●●●●○○ |
| F5 | ファ | ●●●●●○●● |
| G5 | ソ | ●●●●○○○○ |
| A5 | ラ | ●●●○○○○○ |
| B5 | シ | ●●○○○○○○ |
| C6 | 高いド | ●○●○○○○○ |
| D6 | 高いレ | ○○●○○○○○ |

凡例: ● = 閉じる、○ = 開ける

---

## Presets

プリセット楽曲データ

### 概要

```typescript
import { PRESETS } from './data/presets';
import type { PresetSong } from './data/presets';
```

### 型定義

#### `PresetSong`

```typescript
interface PresetSong {
  name: string;              // 楽曲名
  bpm: number;               // 推奨テンポ
  steps: (string | null)[];  // シーケンスデータ（null は休符）
}
```

### データ

#### `PRESETS: Record<string, PresetSong>`

プリセット楽曲データ。

**収録曲:**
- カエルの歌
- きらきら星
- メリーさんの羊
- チューリップ

**例:**
```typescript
const song = PRESETS['カエルの歌'];
console.log(song.name);  // 'カエルの歌'
console.log(song.bpm);   // 100
console.log(song.steps); // ['C5', null, 'D5', null, ...]
```

---

## Recorder3D

3Dリコーダーモデルコンポーネント

### 概要

```typescript
import { RecorderScene } from './components/Recorder3D';
```

### Props

#### `RecorderSceneProps`

```typescript
interface RecorderSceneProps {
  currentFingering: Fingering | null;  // 現在表示する運指
}
```

### 使用例

```typescript
import { Canvas } from '@react-three/fiber';
import { RecorderScene } from './components/Recorder3D';
import { FINGERINGS } from './data/fingerings';

function App() {
  return (
    <Canvas>
      <RecorderScene currentFingering={FINGERINGS['C5']} />
    </Canvas>
  );
}
```

### 内部コンポーネント

#### `RecorderModel`

リコーダー本体を描画するコンポーネント。

**構成:**
- 頭部管（吹き口、ラビューム）
- 中部管（表穴1-4）
- 下部管（表穴5-7）
- 裏穴

#### `RecorderHole`

各穴を描画するコンポーネント。

**Props:**
```typescript
interface RecorderHoleProps {
  position: [number, number, number];  // 穴の位置
  isOpen: boolean;                      // 開閉状態
  label?: string;                       // ラベルテキスト
  isThumb?: boolean;                    // 裏穴フラグ
  handLabel?: string;                   // 手のラベル
}
```

### カラースキーム

```typescript
const COLORS = {
  BODY: "#3e2723",         // リコーダー本体（ダークブラウン）
  JOINT: "#f5f5dc",        // ジョイント部（ベージュ）
  HOLE_OPEN: "#1a0500",    // 開いている穴
  FINGER_CLOSE: "#60a5fa", // 押さえている穴（青）
  FINGER_GHOST: "#93c5fd", // ガイド表示（薄青）
};
```

---

## 共通型定義

### NoteKey

音符キーの型エイリアス。

```typescript
type NoteKey = 'C5' | 'D5' | 'E5' | 'F5' | 'G5' | 'A5' | 'B5' | 'C6' | 'D6';
```

### MelodyStep

メロディーステップの型エイリアス。

```typescript
type MelodyStep = string | null;  // string = 音符キー、null = 休符
```

---

## 使用例

### 基本的な使用例

```typescript
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { RecorderScene } from './components/Recorder3D';
import { FINGERINGS } from './data/fingerings';
import { audioEngine } from './utils/AudioEngine';

function RecorderApp() {
  const [currentNote, setCurrentNote] = useState('C5');
  
  const playNote = (noteKey: string) => {
    audioEngine.init();
    audioEngine.playNote(noteKey);
    setCurrentNote(noteKey);
  };
  
  return (
    <div>
      <Canvas style={{ height: '400px' }}>
        <RecorderScene currentFingering={FINGERINGS[currentNote]} />
      </Canvas>
      
      <button onClick={() => playNote('C5')}>ド</button>
      <button onClick={() => playNote('D5')}>レ</button>
      <button onClick={() => playNote('E5')}>ミ</button>
    </div>
  );
}
```

### シーケンサーの実装例

```typescript
import { useState } from 'react';
import { audioEngine } from './utils/AudioEngine';

function Sequencer() {
  const [steps, setSteps] = useState<(string | null)[]>(Array(16).fill(null));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  const startPlayback = () => {
    audioEngine.init();
    setIsPlaying(true);
    
    audioEngine.startSequence(
      steps,
      120,
      (stepIndex) => setCurrentStep(stepIndex),
      () => {
        setIsPlaying(false);
        setCurrentStep(null);
      },
      false,
      true,
      false
    );
  };
  
  const stopPlayback = () => {
    audioEngine.stopSequence();
    setIsPlaying(false);
    setCurrentStep(null);
  };
  
  return (
    <div>
      <div>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              background: currentStep === i ? 'yellow' : 'white',
              padding: '10px',
            }}
          >
            {step || '休符'}
          </div>
        ))}
      </div>
      
      <button onClick={isPlaying ? stopPlayback : startPlayback}>
        {isPlaying ? '停止' : '再生'}
      </button>
    </div>
  );
}
```

### ピッチ検出の実装例

```typescript
import { useState } from 'react';
import { pitchDetector } from './utils/PitchDetector';

function Tuner() {
  const [isActive, setIsActive] = useState(false);
  const [pitch, setPitch] = useState<{ note: string; diff: number } | null>(null);
  
  const toggleTuner = async () => {
    if (isActive) {
      pitchDetector.stop();
      setIsActive(false);
      setPitch(null);
    } else {
      try {
        await pitchDetector.start((result) => {
          setPitch(result);
        });
        setIsActive(true);
      } catch (error) {
        console.error('Microphone access denied:', error);
      }
    }
  };
  
  return (
    <div>
      <button onClick={toggleTuner}>
        {isActive ? 'チューナー停止' : 'チューナー起動'}
      </button>
      
      {pitch && (
        <div>
          <p>検出音: {pitch.note}</p>
          <p>差: {pitch.diff > 0 ? '+' : ''}{pitch.diff} セント</p>
        </div>
      )}
    </div>
  );
}
```

---

## エラーハンドリング

### AudioContext エラー

```typescript
try {
  audioEngine.init();
} catch (error) {
  console.error('AudioContext initialization failed:', error);
  // ユーザーにインタラクションを促す
}
```

### マイクアクセスエラー

```typescript
try {
  await pitchDetector.start(callback);
} catch (error) {
  if (error.name === 'NotAllowedError') {
    console.error('Microphone permission denied');
  } else if (error.name === 'NotFoundError') {
    console.error('No microphone found');
  }
}
```

---

## パフォーマンス考慮事項

### AudioEngine

- `init()` はユーザーインタラクション後に一度だけ呼び出す
- シーケンス再生中は不要な状態更新を避ける
- ボリューム変更は頻繁に行わない（デバウンス推奨）

### PitchDetector

- `start()` は HTTPS 環境でのみ動作
- 検出コールバックは高頻度で呼ばれるため、重い処理は避ける
- 使用後は必ず `stop()` を呼び出してリソースを解放

### Recorder3D

- Three.js レンダリングは GPU を使用
- 複数のモデルを同時に表示する場合はパフォーマンスに注意
- ジオメトリとマテリアルは可能な限り再利用

---

## バージョン互換性

| API | バージョン | 変更内容 |
|-----|-----------|---------|
| AudioEngine | 0.0.0 | 初回リリース |
| PitchDetector | 0.0.0 | 初回リリース |
| Fingerings | 0.0.0 | C5-D6 の9音対応 |
| Presets | 0.0.0 | 4曲収録 |

---

**更新履歴**: 2026-01-14
