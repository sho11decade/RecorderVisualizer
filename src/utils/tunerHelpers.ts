import { FINGERINGS } from '../data/fingerings';
import type { PitchResult, TunerStatus } from '../types';

/**
 * ピッチ検出結果からチューナーステータスを計算
 */
export function getTunerStatus(
  isMicActive: boolean,
  detectedPitch: PitchResult | null,
  targetNoteKey: string | null
): TunerStatus {
  if (!isMicActive || !detectedPitch) {
    return { status: 'waiting', message: '待機中...' };
  }

  if (!targetNoteKey) {
    return { status: 'neutral', message: detectedPitch.note };
  }

  const targetNote = FINGERINGS[targetNoteKey].pitch;
  
  if (detectedPitch.note === targetNote) {
    if (Math.abs(detectedPitch.diff) < 20) {
      return { status: 'perfect', message: 'Perfect!' };
    }
    if (Math.abs(detectedPitch.diff) < 50) {
      return { status: 'good', message: 'Good' };
    }
    return { 
      status: 'ok', 
      message: detectedPitch.diff > 0 ? '高い' : '低い' 
    };
  } else {
    return { 
      status: 'wrong', 
      message: `今は ${detectedPitch.note}` 
    };
  }
}
