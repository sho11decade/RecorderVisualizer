import { useState, useEffect, useRef, useCallback } from 'react';
import { audioEngine } from '../utils/AudioEngine';
import type { MelodyStep } from '../types';

interface UseSequencerProps {
  melodySteps: MelodyStep[];
  bpm: number;
  isLooping: boolean;
  useMetronome: boolean;
  useCountIn: boolean;
}

/**
 * シーケンサーの再生制御を管理するカスタムフック
 */
export function useSequencer({
  melodySteps,
  bpm,
  isLooping,
  useMetronome,
  useCountIn
}: UseSequencerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const countInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSequence = useCallback(() => {
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
  }, [melodySteps, bpm, isLooping, useMetronome]);

  const stopPlayback = useCallback(() => {
    if (countInTimerRef.current) {
      clearTimeout(countInTimerRef.current);
      countInTimerRef.current = null;
    }
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentStep(null);
  }, []);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      // 全て空の場合は再生しない
      if (melodySteps.every(n => n === null)) return;

      setIsPlaying(true);
      setCurrentStep(null);

      if (useCountIn) {
        audioEngine.playCountIn(bpm);
        const beatDuration = (60 / bpm) * 1000;
        countInTimerRef.current = setTimeout(() => {
          startSequence();
        }, beatDuration * 4);
      } else {
        startSequence();
      }
    }
  }, [isPlaying, melodySteps, bpm, useCountIn, startSequence, stopPlayback]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      audioEngine.stop();
      if (countInTimerRef.current) clearTimeout(countInTimerRef.current);
    };
  }, []);

  return {
    isPlaying,
    currentStep,
    handlePlay,
    stopPlayback
  };
}
