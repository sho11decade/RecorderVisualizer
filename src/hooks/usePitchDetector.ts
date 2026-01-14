import { useState, useEffect, useRef } from 'react';
import { pitchDetector } from '../utils/PitchDetector';
import type { PitchResult } from '../types';

/**
 * マイク入力とピッチ検出を管理するカスタムフック
 */
export function usePitchDetector() {
  const [isMicActive, setIsMicActive] = useState(false);
  const [detectedPitch, setDetectedPitch] = useState<PitchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // マイク検出ループ
  useEffect(() => {
    const detectLoop = () => {
      if (!isMicActive) return;
      const result = pitchDetector.detect();
      if (result) {
        setDetectedPitch(result);
      } else {
        setDetectedPitch(null);
      }
      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    if (isMicActive) {
      detectLoop();
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setDetectedPitch(null);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isMicActive]);

  const toggleMic = async () => {
    if (isMicActive) {
      pitchDetector.stop();
      setIsMicActive(false);
      setError(null);
    } else {
      try {
        setError(null);
        await pitchDetector.start();
        setIsMicActive(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'マイクの使用が許可されませんでした';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      pitchDetector.stop();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return { isMicActive, detectedPitch, error, toggleMic };
}
