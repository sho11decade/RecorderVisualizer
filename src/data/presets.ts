// 定番の練習曲プリセット
// null は休符、それ以外は音階キー

export interface PresetSong {
  name: string;
  bpm: number;
  steps: (string | null)[];
}

export const PRESETS: Record<string, PresetSong> = {
  "カエルの歌": {
    name: "カエルの歌",
    bpm: 100,
    steps: [
      "C5", null, "D5", null, "E5", null, "F5", null, 
      "E5", null, "D5", null, "C5", null, null, null,
      "E5", null, "F5", null, "G5", null, "A5", null, 
      "G5", null, "F5", null, "E5", null, null, null,
      "C5", null, null, null, "C5", null, null, null, 
      "C5", null, null, null, "C5", null, null, null,
      "C5", "C5", "D5", "D5", "E5", "E5", "F5", "F5", 
      "E5", null, "D5", null, "C5", null, null, null
    ]
  },
  "きらきら星": {
    name: "きらきら星",
    bpm: 110,
    steps: [
      "C5", null, "C5", null, "G5", null, "G5", null, 
      "A5", null, "A5", null, "G5", null, null, null,
      "F5", null, "F5", null, "E5", null, "E5", null, 
      "D5", null, "D5", null, "C5", null, null, null,
      "G5", null, "G5", null, "F5", null, "F5", null, 
      "E5", null, "E5", null, "D5", null, null, null,
      "G5", null, "G5", null, "F5", null, "F5", null, 
      "E5", null, "E5", null, "D5", null, null, null,
      "C5", null, "C5", null, "G5", null, "G5", null, 
      "A5", null, "A5", null, "G5", null, null, null,
      "F5", null, "F5", null, "E5", null, "E5", null, 
      "D5", null, "D5", null, "C5", null, null, null
    ]
  },
  "チューリップ": {
    name: "チューリップ",
    bpm: 90,
    steps: [
      "C5", null, "D5", null, "E5", null, null, null,
      "C5", null, "D5", null, "E5", null, null, null,
      "G5", null, "E5", null, "D5", null, "C5", null,
      "D5", null, "E5", null, "D5", null, null, null,
      "C5", null, "D5", null, "E5", null, null, null,
      "C5", null, "D5", null, "E5", null, null, null,
      "G5", null, "E5", null, "D5", null, "C5", null,
      "D5", null, "E5", null, "C5", null, null, null,
      "G5", null, "G5", null, "E5", null, "G5", null, 
      "A5", null, "A5", null, "G5", null, null, null,
      "E5", null, "E5", null, "D5", null, "D5", null,
      "C5", null, null, null, null, null, null, null
    ]
  },
  "チャルメラ": {
    name: "チャルメラ",
    bpm: 130,
    steps: [
      "C5", null, "D5", null, "E5", null, null, null,
      "D5", null, "C5", null, null, null, 
      "C5", null, "D5", null, "E5", null, "D5", null, 
      "E5", null, "D5", "C5", null, null, null, null
    ]
  }
};
