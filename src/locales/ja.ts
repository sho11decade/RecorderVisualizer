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
  welcomeBody: 'ブラウザで動くリコーダー練習アプリです。',
  welcomeBulletSongTitle: 'まずは「練習曲」から選ぼう',
  welcomeBulletSongBody: '「カエルの歌」などの定番曲を選んで、自動演奏に合わせて練習できます。',
  welcomeBulletMicTitle: 'マイクで音程チェック',
  welcomeBulletMicBody: 'マイクをオンにすると、あなたの吹いている音が合っているか自動判定します。',
  welcomeBulletCustomizeTitle: '自分好みにカスタマイズ',
  welcomeBulletCustomizeBody: '画面の仕切りをドラッグして、3D表示の大きさを調整できます。',
  welcomeStart: 'はじめる',
  
  // About Page
  aboutTitle: 'About Recorder Viz',
  
  // Copyright
  copyright: '© 2026 RiceZero',

  // Language
  language: '言語',
  japanese: '日本語',
  english: 'English',

  // Playback
  playing: '再生中...',
  loading: '読み込み中...',

  // Toasts
  micErrorTitle: 'マイクエラー',
  playStoppedTitle: '再生停止',
  playStoppedDescription: 'メロディーを停止しました',
  melodyEmptyTitle: 'メロディーが空です',
  melodyEmptyDescription: '音符を配置してから再生してください',
  playStartTitle: '再生開始',
  playStartDescription: 'Spaceキーで停止できます',
  playbackCompleteTitle: '再生完了',
  notePlacedTitle: '音符を配置',
  notePosition: 'ポジション {index}',
  measureAddedTitle: '小節を追加しました',
  measureAddedDescription: '8ステップ追加されました',
  presetLoadedTitle: 'プリセットを読み込みました',
  presetLoadedDescription: '「{name}」の練習を始めましょう！',
  melodyClearedTitle: 'メロディーをクリアしました',
  melodyClearedDescription: '新しいメロディーを作成できます',
  practiceToastTitle: '練習を始めましょう！',
  practiceToastDescription: 'キーボードの「?」でショートカット一覧を表示できます',

  // Editor UI
  melodyEditor: 'メロディーエディター',
  guideMuted: 'ガイド音ミュート中',
  placeNoteLegend: '音符を置く',
  restLegend: '空き（休符）',
  scaleLabel: '音階',
  addMeasure: '小節を追加',

  // Confirm dialogs
  clearMelodyTitle: 'メロディーをクリア',
  clearMelodyDescription: '現在のメロディーを全て消去します。この操作は取り消せません。',
  confirmClear: 'クリアする',
  cancel: 'キャンセル',
  loadPresetTitle: 'プリセットを読み込み',
  loadPresetDescription: '「{name}」を読み込みますか？現在の編集内容は上書きされます。',
  loadPresetConfirm: '読み込む',

  // Pitch feedback
  pitchMessages: {
    perfect: '完璧です！その調子です！',
    good: 'いい感じです！',
    ok: 'もう少し調整してみましょう',
    wrong: '違う音が検出されています',
    waiting: 'マイクからの入力を待っています',
    neutral: '音を検出しました',
  },

  // Shortcuts dialog
  shortcuts: {
    title: 'キーボードショートカット',
    description: '効率的に操作するためのキーボードショートカット',
    playStop: '再生/停止',
    showHelp: 'ヘルプを表示',
    placeNote: '音符を配置',
    previewNote: '音階をプレビュー',
    hint: '💡 ヒント: マウスホイールで3Dモデルを拡大/縮小、ドラッグで回転できます',
    shortcutButton: 'キーボードショートカット (押すと「?」キー)',
  },
};

export type Translations = typeof ja;
