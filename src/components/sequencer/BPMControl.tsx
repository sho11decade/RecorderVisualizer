import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Gauge, Turtle, Rabbit } from 'lucide-react';

interface BPMControlProps {
  bpm: number;
  originalBpm: number;
  currentSongTitle: string | null;
  onBpmChange: (bpm: number) => void;
}

export function BPMControl({
  bpm,
  originalBpm,
  currentSongTitle,
  onBpmChange
}: BPMControlProps) {
  return (
    <div className="space-y-2 p-4 border-b border-slate-100 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">テンポ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black text-slate-800 tabular-nums">{bpm}</span>
          <span className="text-xs text-slate-400 font-medium">BPM</span>
        </div>
      </div>

      <Slider
        max={180}
        min={60}
        step={5}
        value={[bpm]}
        onValueChange={(val: number[]) => onBpmChange(val[0])}
        className="w-full py-2 cursor-pointer"
      />

      {currentSongTitle && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 text-slate-500 border-slate-200 hover:bg-slate-50"
            onClick={() => onBpmChange(Math.round(originalBpm * 0.8))}
            title="ゆっくり (0.8x)"
          >
            <Turtle className="w-3 h-3 mr-1" /> ゆっくり
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 text-slate-500 border-slate-200 hover:bg-slate-50"
            onClick={() => onBpmChange(originalBpm)}
            title="標準速度 (1.0x)"
          >
            <Rabbit className="w-3 h-3 mr-1" /> 標準
          </Button>
        </div>
      )}
    </div>
  );
}
