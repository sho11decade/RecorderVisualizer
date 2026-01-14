// アプリケーションで使用される型定義

export type MelodyStep = string | null;

export interface PitchResult {
  note: string;
  diff: number;
}

export interface TunerStatus {
  status: 'waiting' | 'neutral' | 'perfect' | 'good' | 'ok' | 'wrong';
  message: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number | null;
}

export interface AudioSettings {
  bpm: number;
  volume: number;
  useMetronome: boolean;
  isMelodyMuted: boolean;
  isLooping: boolean;
}
