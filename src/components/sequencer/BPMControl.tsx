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
    <div className="space-y-3 p-5 border-b border-slate-100 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-bold text-slate-600">テンポ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-slate-800 tabular-nums">{bpm}</span>
          <span className="text-sm text-slate-400 font-medium">BPM</span>
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
            className="h-9 text-sm px-3 text-slate-500 border-slate-200 hover:bg-slate-50"
            onClick={() => onBpmChange(Math.round(originalBpm * 0.8))}
            title="ゆっくり (0.8x)"
          >
            <Turtle className="w-4 h-4 mr-1.5" /> ゆっくり
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-sm px-3 text-slate-500 border-slate-200 hover:bg-slate-50"
            onClick={() => onBpmChange(originalBpm)}
            title="標準速度 (1.0x)"
          >
            <Rabbit className="w-4 h-4 mr-1.5" /> 標準
          </Button>
        </div>
      )}
    </div>
  );
}
