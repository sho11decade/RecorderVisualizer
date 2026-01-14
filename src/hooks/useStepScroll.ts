import { useEffect, useRef } from 'react';

/**
 * 再生中のステップを自動スクロールで表示するカスタムフック
 */
export function useStepScroll(
  isPlaying: boolean,
  currentStep: number | null
) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isPlaying && currentStep !== null && stepRefs.current[currentStep]) {
      stepRefs.current[currentStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStep, isPlaying]);

  return stepRefs;
}
