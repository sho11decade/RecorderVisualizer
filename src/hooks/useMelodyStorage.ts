import { useState, useEffect } from 'react';
import { STORAGE_KEY, INITIAL_STEPS } from '../constants/app';
import type { MelodyStep } from '../types';

/**
 * メロディーデータの永続化を管理するカスタムフック
 */
export function useMelodyStorage() {
  const [melodySteps, setMelodySteps] = useState<MelodyStep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to load saved melody", e);
      }
    }
    return Array(INITIAL_STEPS).fill(null);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(melodySteps));
  }, [melodySteps]);

  return [melodySteps, setMelodySteps] as const;
}
