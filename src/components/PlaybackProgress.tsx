import { Progress } from './ui/progress';
import { Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaybackProgressProps {
  currentStep: number | null;
  totalSteps: number;
  isPlaying: boolean;
}

export function PlaybackProgress({ currentStep, totalSteps, isPlaying }: PlaybackProgressProps) {
  const { t } = useLanguage();

  if (!isPlaying || currentStep === null) {
    return null;
  }

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-indigo-600 text-white px-4 py-2 shadow-md animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-semibold">{t.playing}</span>
        </div>
        <span className="text-xs font-mono">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-1.5 bg-indigo-800"
      />
    </div>
  );
}
