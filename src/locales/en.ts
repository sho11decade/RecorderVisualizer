import type { Translations } from './ja';

export const en: Translations = {
  // Header
  appTitle: 'Recorder Viz',
  about: 'About',
  privacy: 'Privacy',
  menu: 'Menu',
  volume: 'Volume',
  mutemelody: 'Mute Melody',
  keyboardShortcuts: 'Shortcuts',
  welcomeGuide: 'Welcome Guide',

  // Playback Controls
  play: 'Play',
  stop: 'Stop',
  microphone: 'Microphone',
  micOn: 'Turn off microphone',
  micOff: 'Check pitch with microphone',
  metronome: 'Metronome',
  loop: 'Loop',
  selectSong: 'Select Song',
  presetSongs: 'Sample Songs',
  clear: 'Clear',
  clearMelody: 'Clear Melody',

  // BPM Control
  tempo: 'Tempo',
  slow: 'Slow',
  normal: 'Normal',
  
  // Notes
  notes: {
    C5: 'C',
    D5: 'D',
    E5: 'E',
    F5: 'F',
    G5: 'G',
    A5: 'A',
    B5: 'B',
    C6: 'High C',
    D6: 'High D',
  },

  // Tuner
  tunerTitle: 'Tuner',
  noSound: 'No sound detected',
  tooLow: 'Too Low',
  tooHigh: 'Too High',
  perfect: 'Perfect!',

  // Messages
  micError: 'Failed to access microphone',
  micPermission: 'Please allow microphone access',

  // Tooltips
  playPause: 'Play/Stop (Space key)',
  clearAll: 'Clear Melody (Delete key)',
  loadPreset: 'Load preset song',
  metronomeToggle: 'Toggle Metronome',
  loopToggle: 'Toggle Loop',

  // Welcome Dialog
  welcomeTitle: 'Welcome to Recorder Viz!',
  welcomeDescription: 'Make recorder learning fun and intuitive.',
  welcomeBody: 'A browser-based practice app for recorder players.',
  welcomeBulletSongTitle: 'Start with “Practice Songs”',
  welcomeBulletSongBody: 'Pick classics like “Frog Song” and practice along with auto playback.',
  welcomeBulletMicTitle: 'Check pitch with your mic',
  welcomeBulletMicBody: 'Turn on the mic to automatically judge your intonation.',
  welcomeBulletCustomizeTitle: 'Customize your view',
  welcomeBulletCustomizeBody: 'Drag the dividers to adjust the 3D view size.',
  welcomeStart: 'Get started',
  
  // About Page
  aboutTitle: 'About Recorder Viz',
  
  // Copyright
  copyright: '© 2026 RiceZero',

  // Language
  language: 'Language',
  japanese: '日本語',
  english: 'English',

  // Playback
  playing: 'Playing...',
  loading: 'Loading...',

  // Toasts
  micErrorTitle: 'Microphone error',
  playStoppedTitle: 'Playback stopped',
  playStoppedDescription: 'Melody playback stopped',
  melodyEmptyTitle: 'Melody is empty',
  melodyEmptyDescription: 'Place some notes before playing',
  playStartTitle: 'Playback started',
  playStartDescription: 'Press Space to stop',
  playbackCompleteTitle: 'Playback finished',
  notePlacedTitle: 'Placed note',
  notePosition: 'Position {index}',
  measureAddedTitle: 'Added a bar',
  measureAddedDescription: 'Added 8 more steps',
  presetLoadedTitle: 'Preset loaded',
  presetLoadedDescription: 'Start practicing “{name}”!',
  melodyClearedTitle: 'Melody cleared',
  melodyClearedDescription: 'You can create a new melody',
  practiceToastTitle: "Let's start practicing!",
  practiceToastDescription: 'Press “?” to open keyboard shortcuts',

  // Editor UI
  melodyEditor: 'Melody Editor',
  guideMuted: 'Guide tone muted',
  placeNoteLegend: 'Place note',
  restLegend: 'Empty (rest)',
  scaleLabel: 'Scale',
  addMeasure: 'Add bar',

  // Confirm dialogs
  clearMelodyTitle: 'Clear melody',
  clearMelodyDescription: 'This will remove all notes. This cannot be undone.',
  confirmClear: 'Clear',
  cancel: 'Cancel',
  loadPresetTitle: 'Load preset',
  loadPresetDescription: 'Load “{name}”? Current edits will be overwritten.',
  loadPresetConfirm: 'Load',

  // Pitch feedback
  pitchMessages: {
    perfect: 'Perfect! Keep it up!',
    good: 'Sounds good!',
    ok: 'Adjust a bit more',
    wrong: 'A different note was detected',
    waiting: 'Waiting for microphone input',
    neutral: 'Detected a note',
  },

  // Shortcuts dialog
  shortcuts: {
    title: 'Keyboard Shortcuts',
    description: 'Shortcuts to operate efficiently',
    playStop: 'Play / Stop',
    showHelp: 'Show help',
    placeNote: 'Place note',
    previewNote: 'Preview scale',
    hint: '💡 Hint: Use mouse wheel to zoom, drag to rotate the 3D model',
    shortcutButton: 'Keyboard shortcuts (or press “?”)',
  },
};
