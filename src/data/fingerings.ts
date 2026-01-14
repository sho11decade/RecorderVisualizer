// ソプラノリコーダー（ジャーマン式とバロック式の共通部分を中心とした簡易モデル）
// 0: 裏穴 (親指)
// 1-3: 左手 (人差指、中指、薬指)
// 4-7: 右手 (人差指、中指、薬指、小指)
// true = 閉じる, false = 開ける

export interface Fingering {
  note: string;     // 表示名 (例: ド, レ)
  pitch: string;    // Tone.js用ピッチ (例: C5)
  holes: boolean[]; // [0, 1, 2, 3, 4, 5, 6, 7]
  isHigh?: boolean; // サミング（裏穴半開）フラグ - 今回は簡易的に0をfalseにするかどうかの制御に使用
}

export const FINGERINGS: Record<string, Fingering> = {
  'C5': { note: 'ド', pitch: 'C5', holes: [true, true, true, true, true, true, true, true] },
  'D5': { note: 'レ', pitch: 'D5', holes: [true, true, true, true, true, true, true, false] },
  'E5': { note: 'ミ', pitch: 'E5', holes: [true, true, true, true, true, true, false, false] },
  'F5': { note: 'ファ', pitch: 'F5', holes: [true, true, true, true, true, false, true, true] }, // ジャーマン式
  'G5': { note: 'ソ', pitch: 'G5', holes: [true, true, true, true, false, false, false, false] },
  'A5': { note: 'ラ', pitch: 'A5', holes: [true, true, true, false, false, false, false, false] },
  'B5': { note: 'シ', pitch: 'B5', holes: [true, true, false, false, false, false, false, false] },
  'C6': { note: '高いド', pitch: 'C6', holes: [true, false, true, false, false, false, false, false] },
  'D6': { note: '高いレ', pitch: 'D6', holes: [false, false, true, false, false, false, false, false] },
};

export const SCALE_ORDER = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6'];
