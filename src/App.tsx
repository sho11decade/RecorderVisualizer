import { useState, useEffect, useRef } from 'react';
import { Plus, Settings2, VolumeX, Music, Mic } from 'lucide-react';
import { RecorderScene } from './components/Recorder3D';
import { Canvas } from '@react-three/fiber';
import { FINGERINGS, SCALE_ORDER } from './data/fingerings';
import { PRESETS } from './data/presets';
import { audioEngine } from './utils/AudioEngine';
import { pitchDetector } from './utils/PitchDetector';
import { Button } from './components/ui/button';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./components/ui/dialog";

import { About } from './components/pages/About';
import { Privacy } from './components/pages/Privacy';

// Refactored Components
import { HeaderControls } from './components/sequencer/HeaderControls';
import { RecorderDisplay } from './components/sequencer/RecorderDisplay';
import { BPMControl } from './components/sequencer/BPMControl';
import { PlaybackControls } from './components/sequencer/PlaybackControls';

// Refactored Hooks
import { useMelodyStorage } from './hooks/useMelodyStorage';
import { usePitchDetector } from './hooks/usePitchDetector';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useStepScroll } from './hooks/useStepScroll';

// Utils
import { getTunerStatus } from './utils/tunerHelpers';

// Constants
import { INITIAL_STEPS, WELCOME_KEY } from './constants/app';

export default function App() {
  // Use custom hooks
  const [melodySteps, setMelodySteps] = useMelodyStorage();
  const { isMicActive, detectedPitch, toggleMic } = usePitchDetector();
  const isHorizontal = useResponsiveLayout();
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [useMetronome, setUseMetronome] = useState(false);
  const [isMelodyMuted, setIsMelodyMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  const stepRefs = useStepScroll(isPlaying, currentStep);
  
  // Song metadata
  const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
  const [originalBpm, setOriginalBpm] = useState(120);

  // Settings
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(-5);

  // UI state
  const [previewNote, setPreviewNote] = useState<string>('C5');
  const [showWelcome, setShowWelcome] = useState(false);

  // Refs
  const countInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSpace: () => {
      if (isPlaying) {
        stopPlayback();
      } else {
        handlePlay();
      }
    },
  });

  // Auto-scroll to current step
  useEffect(() => {
    if (isPlaying && currentStep !== null && stepRefs.current[currentStep]) {
      stepRefs.current[currentStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStep, isPlaying, stepRefs]);

  // Determine which fingering to display
  const displayNoteKey = isPlaying && currentStep !== null
    ? melodySteps[currentStep]
    : previewNote;

  const displayFingering = displayNoteKey ? FINGERINGS[displayNoteKey] : FINGERINGS[previewNote];

  // Show welcome dialog on first visit
  useEffect(() => {
    const welcomeShown = localStorage.getItem(WELCOME_KEY);
    if (!welcomeShown) {
      setShowWelcome(true);
    }
  }, []);

  // Sync audio settings
  useEffect(() => {
    audioEngine.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    audioEngine.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setMelodyMute(isMelodyMuted);
  }, [isMelodyMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
      pitchDetector.stop();
      if (countInTimerRef.current) clearTimeout(countInTimerRef.current);
    };
  }, []);

  // Playback control
  const handlePlay = () => {
    if (melodySteps.every(n => n === null)) return;
    
    setIsPlaying(true);
    setCurrentStep(null);
    audioEngine.startSequence(
      melodySteps,
      bpm,
      (stepIndex) => setCurrentStep(stepIndex),
      () => {
        setIsPlaying(false);
        setCurrentStep(null);
      },
      isLooping,
      useMetronome
    );
  };

  const stopPlayback = () => {
    if (countInTimerRef.current) {
      clearTimeout(countInTimerRef.current);
      countInTimerRef.current = null;
    }
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentStep(null);
  };

  // Note editing
  const toggleNote = (stepIndex: number, noteKey: string) => {
    const newSteps = [...melodySteps];
    if (newSteps[stepIndex] === noteKey) {
      newSteps[stepIndex] = null;
    } else {
      newSteps[stepIndex] = noteKey;
      audioEngine.playNote(FINGERINGS[noteKey].pitch, "8n");
      setPreviewNote(noteKey);
    }
    setMelodySteps(newSteps);
  };

  const addSteps = () => {
    setMelodySteps(prev => [...prev, ...Array(8).fill(null)]);
  };

  // Preset management
  const loadPreset = (name: string) => {
    if (confirm(`「${name}」を読み込みますか？\n現在の編集内容は上書きされます。`)) {
      stopPlayback();
      const song = PRESETS[name];
      setMelodySteps([...song.steps]);
      setBpm(song.bpm);
      setOriginalBpm(song.bpm);
      setCurrentSongTitle(song.name);
      setIsLooping(true);
    }
  };

  const clearMelody = () => {
    if (confirm('メロディーを全て消去しますか？')) {
      stopPlayback();
      setMelodySteps(Array(INITIAL_STEPS).fill(null));
      setCurrentSongTitle(null);
    }
  };

  // Tuner status calculation
  const tunerStatus = getTunerStatus(isMicActive, detectedPitch, displayNoteKey);

  return (
    <div className="h-screen w-full bg-slate-100 overflow-hidden text-slate-900 font-sans flex flex-col">

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={(open: boolean) => {
        setShowWelcome(open);
        if (!open) localStorage.setItem(WELCOME_KEY, 'true');
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recorder Viz へようこそ！</DialogTitle>
            <DialogDescription>
              ブラウザで動くリコーダー練習アプリです。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">まずは「練習曲」から選ぼう</strong>
                「カエルの歌」などの定番曲を選んで、自動演奏に合わせて練習できます。
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">マイクで音程チェック</strong>
                マイクをオンにすると、あなたの吹いている音が合っているか自動判定します。
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">自分好みにカスタマイズ</strong>
                画面の仕切りをドラッグして、3D表示の大きさを調整できます。
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setShowWelcome(false);
              localStorage.setItem(WELCOME_KEY, 'true');
            }}>
              はじめる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResizablePanelGroup direction={isHorizontal ? "horizontal" : "vertical"} className="h-full w-full">

        {/* --- Left Panel (3D & Controls) --- */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={60} className="flex flex-col bg-white border-r border-slate-200 z-10 shadow-xl">

          {/* Header */}
          <HeaderControls
            volume={volume}
            isMelodyMuted={isMelodyMuted}
            currentSongTitle={currentSongTitle}
            onVolumeChange={setVolume}
            onMutedChange={setIsMelodyMuted}
            onInfoClick={() => setShowWelcome(true)}
          />

          {/* 3D Viewport */}
          <RecorderDisplay
            displayFingering={displayFingering}
            isMicActive={isMicActive}
            detectedPitch={detectedPitch}
            tunerStatus={tunerStatus}
          >
            <Canvas shadows className="w-full h-full">
              <RecorderScene currentFingering={displayFingering} />
            </Canvas>
          </RecorderDisplay>

          {/* Playback Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 shrink-0">
            
            <BPMControl
              bpm={bpm}
              originalBpm={originalBpm}
              currentSongTitle={currentSongTitle}
              onBpmChange={setBpm}
            />

            <PlaybackControls
              isPlaying={isPlaying}
              isMicActive={isMicActive}
              useMetronome={useMetronome}
              isLooping={isLooping}
              onPlayToggle={handlePlay}
              onMicToggle={toggleMic}
              onMetronomeToggle={setUseMetronome}
              onLoopToggle={setIsLooping}
              onLoadPreset={loadPreset}
              onClear={clearMelody}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* --- Right Panel (Melody Grid Editor) --- */}
        <ResizablePanel defaultSize={70} className="flex flex-col min-w-0 bg-slate-100/50">

          <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-500" />
              メロディーエディター
            </h2>
            <div className="flex items-center gap-4">
              {isMelodyMuted && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <VolumeX className="w-3 h-3" />
                  ガイド音ミュート中
                </div>
              )}
              <div className="hidden sm:flex text-xs text-slate-500 items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-500 rounded shadow-sm"></div>
                  <span>音符を置く</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-50 border border-slate-200 rounded shadow-sm"></div>
                  <span>空き（休符）</span>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 w-full bg-slate-100 p-4 md:p-8">
            <div className="min-w-max bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden pb-2">

              <div className="flex border-b border-slate-200 bg-slate-50/80 backdrop-blur sticky top-0 z-20">
                <div className="w-28 shrink-0 p-3 border-r border-slate-200 text-xs font-bold text-slate-400 text-center flex items-center justify-center bg-slate-100/50">
                  音階
                </div>
                <div className="flex">
                  {melodySteps.map((_, i) => (
                    <div
                      key={i}
                      ref={(el) => { if (el) stepRefs.current[i] = el; }}
                      className={`
                        w-14 h-10 flex items-center justify-center text-xs font-mono border-r border-slate-100 select-none transition-colors duration-200
                        ${(i % 8 === 0) ? 'bg-slate-100/50 text-slate-600 font-bold border-r-slate-300' : 'text-slate-400'}
                        ${(currentStep === i) ? 'bg-yellow-300 text-yellow-900 font-bold scale-110 shadow-sm z-10 rounded-sm' : ''}
                      `}
                    >
                      {i + 1}
                    </div>
                  ))}

                  <div className="w-20 flex items-center justify-center bg-slate-50/50 p-1 sticky right-0">
                    <button
                      onClick={addSteps}
                      className="w-full h-full rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors border border-dashed border-slate-300 hover:border-indigo-300"
                      title="小節を追加"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {[...SCALE_ORDER].reverse().map((noteKey) => {
                  const noteInfo = FINGERINGS[noteKey];

                  return (
                    <div key={noteKey} className="flex group hover:bg-slate-50/50 transition-colors">
                      <div
                        className="w-28 shrink-0 border-r border-slate-200 flex items-center justify-between px-5 bg-white z-10 sticky left-0 group-hover:bg-slate-50 transition-colors cursor-pointer hover:text-indigo-600"
                        onClick={() => {
                          setPreviewNote(noteKey);
                          audioEngine.playNote(noteInfo.pitch, "8n");
                        }}
                      >
                        <span className={`font-bold text-base ${noteKey.includes('6') ? 'text-indigo-600' : 'text-slate-700'}`}>
                          {noteInfo.note}
                        </span>
                        <span className="text-xs font-mono text-slate-300 group-hover:text-indigo-300">{noteInfo.pitch}</span>
                      </div>

                      <div className="flex">
                        {melodySteps.map((stepVal, stepIdx) => {
                          const isActive = stepVal === noteKey;
                          const isCurrent = currentStep === stepIdx;

                          return (
                            <div
                              key={`${noteKey}-${stepIdx}`}
                              className={`
                                w-14 h-16 border-r border-slate-100 border-b border-slate-50 relative cursor-pointer touch-manipulation
                                ${(stepIdx % 8 === 0) ? 'border-r-slate-200' : ''}
                                ${(isCurrent ? 'bg-yellow-50' : '')}
                                hover:bg-indigo-50 active:bg-indigo-100 transition-colors
                              `}
                              onClick={() => toggleNote(stepIdx, noteKey)}
                            >
                              <div
                                className={`
                                  absolute inset-1.5 rounded-lg shadow-sm transition-all duration-200 transform border flex items-center justify-center
                                  ${isActive
                                    ? 'bg-indigo-500 border-indigo-600 scale-100 opacity-100 shadow-indigo-200'
                                    : 'bg-indigo-200 border-transparent scale-75 opacity-0'}
                                `}
                              >
                                {isActive && (
                                  <span className="text-white font-bold text-xs pointer-events-none select-none">
                                    {noteInfo.note}
                                  </span>
                                )}
                              </div>

                              {isCurrent && (
                                <div className="absolute inset-0 border-x-4 border-yellow-400/50 pointer-events-none z-0" />
                              )}
                            </div>
                          );
                        })}

                        <div className="w-20 bg-slate-50/20" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
            <ScrollBar orientation="vertical" className="w-3" />
          </ScrollArea>

          {/* Footer Area with About/Privacy Links */}
          <div className="px-6 py-2 border-t border-slate-200 bg-white text-xs text-slate-400 flex justify-end gap-4 shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-slate-600 transition-colors">About</button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>About Recorder Viz</DialogTitle>
                  <DialogDescription className="sr-only">Explanation of the app</DialogDescription>
                </DialogHeader>
                <About />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-slate-600 transition-colors">Privacy</button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription className="sr-only">Privacy policy details</DialogDescription>
                </DialogHeader>
                <Privacy />
              </DialogContent>
            </Dialog>

            <span>© 2026 RiceZero</span>
          </div>

        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}