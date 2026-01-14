import { useState, useEffect, useRef } from 'react';
import { pitchDetector } from '../utils/PitchDetector';
import type { PitchResult } from '../types';

/**
 * マイク入力とピッチ検出を管理するカスタムフック
 */
export function usePitchDetector() {
  const [isMicActive, setIsMicActive] = useState(false);
  const [detectedPitch, setDetectedPitch] = useState<PitchResult | null>(null);
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
    } else {
      try {
        await pitchDetector.start();
        setIsMicActive(true);
      } catch (err) {
        alert("マイクの使用が許可されませんでした。ブラウザの設定を確認してください。");
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

  return { isMicActive, detectedPitch, toggleMic };
}
