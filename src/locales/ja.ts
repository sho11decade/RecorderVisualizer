export const ja = {
  // Header
  appTitle: 'Recorder Viz',
  about: 'About',
  privacy: 'Privacy',
  menu: 'メニュー',
  volume: '音量設定',
  mutemelody: 'メロディーをミュート',
  keyboardShortcuts: 'ショートカット',
  welcomeGuide: 'ようこそガイド',

  // Playback Controls
  play: '再生',
  stop: '停止',
  microphone: 'マイク',
  micOn: 'マイクをオフにする',
  micOff: 'マイクで音程をチェック',
  metronome: 'メトロノーム',
  loop: 'リピート',
  selectSong: '曲を選択',
  presetSongs: 'サンプル曲',
  clear: 'クリア',
  clearMelody: 'メロディーをクリア',

  // BPM Control
  tempo: 'テンポ',
  slow: 'ゆっくり',
  normal: '標準',
  
  // Notes
  notes: {
    C5: 'ド',
    D5: 'レ',
    E5: 'ミ',
    F5: 'ファ',
    G5: 'ソ',
    A5: 'ラ',
    B5: 'シ',
    C6: '高いド',
    D6: '高いレ',
  },

  // Tuner
  tunerTitle: 'チューナー',
  noSound: '音を検出していません',
  tooLow: '低い',
  tooHigh: '高い',
  perfect: 'ピッタリ！',

  // Messages
  micError: 'マイクへのアクセスに失敗しました',
  micPermission: 'マイクの使用を許可してください',

  // Tooltips
  playPause: '再生/停止 (Spaceキー)',
  clearAll: 'メロディーをクリア (Deleteキー)',
  loadPreset: 'プリセット曲を読み込み',
  metronomeToggle: 'メトロノームのオン/オフ',
  loopToggle: 'リピート再生',

  // Welcome Dialog
  welcomeTitle: 'Recorder Viz へようこそ！',
  welcomeDescription: 'リコーダー学習を楽しく、直感的に。',
  
  // About Page
  aboutTitle: 'About Recorder Viz',
  
  // Copyright
  copyright: '© 2026 RiceZero',

  // Language
  language: '言語',
  japanese: '日本語',
  english: 'English',
};

export type Translations = typeof ja;
