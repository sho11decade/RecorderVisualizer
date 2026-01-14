import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Volume2, Music, Info } from 'lucide-react';

interface HeaderControlsProps {
  volume: number;
  isMelodyMuted: boolean;
  currentSongTitle: string | null;
  onVolumeChange: (volume: number) => void;
  onMutedChange: (muted: boolean) => void;
  onInfoClick: () => void;
}

export function HeaderControls({
  volume,
  isMelodyMuted,
  currentSongTitle,
  onVolumeChange,
  onMutedChange,
  onInfoClick
}: HeaderControlsProps) {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 shrink-0">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600 truncate">
          <Music className="w-5 h-5 shrink-0" />
          Recorder Viz
        </h1>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onInfoClick}
            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
          >
            <Info className="w-5 h-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                <Volume2 className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">マスター音量</span>
                    <span className="text-xs text-slate-400">{volume > -30 ? `${volume}dB` : 'Mute'}</span>
                  </div>
                  <Slider
                    defaultValue={[-5]}
                    max={0}
                    min={-30}
                    step={1}
                    value={[volume]}
                    onValueChange={(val: number[]) => onVolumeChange(val[0])}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="mute-melody" className="text-sm font-medium">ガイド音を消す</Label>
                    <span className="text-[10px] text-slate-400">リズムのみで練習</span>
                  </div>
                  <Switch
                    id="mute-melody"
                    checked={isMelodyMuted}
                    onCheckedChange={onMutedChange}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {currentSongTitle && (
        <div className="text-xs font-medium text-slate-600 bg-indigo-50 px-3 py-2 rounded-md border border-indigo-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 truncate">
          <span className="text-indigo-500">♪</span>
          <span className="truncate">練習中: {currentSongTitle}</span>
        </div>
      )}
    </div>
  );
}
