import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Play, Pause, Mic, MicOff, Gauge, Repeat, FolderOpen, Trash2, Music } from 'lucide-react';
import { PRESETS } from '../../data/presets';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isMicActive: boolean;
  useMetronome: boolean;
  isLooping: boolean;
  onPlayToggle: () => void;
  onMicToggle: () => Promise<void>;
  onMetronomeToggle: (value: boolean) => void;
  onLoopToggle: (value: boolean) => void;
  onLoadPreset: (name: string) => void;
  onClear: () => void;
}

export function PlaybackControls({
  isPlaying,
  isMicActive,
  useMetronome,
  isLooping,
  onPlayToggle,
  onMicToggle,
  onMetronomeToggle,
  onLoopToggle,
  onLoadPreset,
  onClear
}: PlaybackControlsProps) {
  const handleMicToggle = async () => {
    try {
      await onMicToggle();
    } catch (error) {
      // Error is already handled in the hook
      console.error('Mic toggle error:', error);
    }
  };

  return (
    <div className="p-5 space-y-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            className={`flex-1 h-14 text-base font-semibold transition-all shadow-sm
              ${isPlaying
                ? 'bg-slate-800 hover:bg-slate-900 border-slate-800'
                : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:shadow-md'
              }`}
            onClick={onPlayToggle}
            title="再生/停止 (Spaceキー)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" /> 停止
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" /> 再生
              </>
            )}
          </Button>

          <Toggle
            pressed={isMicActive}
            onPressedChange={handleMicToggle}
            className={`h-14 w-14 border transition-all ${
              isMicActive 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 shadow-sm' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
            aria-label="マイク入力"
            title={isMicActive ? 'マイクをオフにする' : 'マイクで音程をチェック'}
          >
            {isMicActive ? (
              <Mic className="w-5 h-5 animate-pulse" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </Toggle>

          <Toggle
            pressed={useMetronome}
            onPressedChange={onMetronomeToggle}
            className={`h-14 w-14 border transition-colors ${
              useMetronome 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
            aria-label="メトロノーム"
            title="メトロノーム"
          >
            <Gauge className="w-5 h-5" />
          </Toggle>

          <Toggle
            pressed={isLooping}
            onPressedChange={onLoopToggle}
            className={`h-14 w-14 border transition-colors ${
              isLooping 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
            title="ループ再生"
          >
            <Repeat className="w-5 h-5" />
          </Toggle>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full hover:bg-slate-50 border-slate-200 text-slate-600 h-11 text-sm">
                <FolderOpen className="w-4 h-4 mr-2" /> 練習曲
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>サンプル曲</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(PRESETS).map((name) => (
                <DropdownMenuItem key={name} onClick={() => onLoadPreset(name)}>
                  <Music className="w-4 h-4 mr-2" />
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear} 
            className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 border-slate-200 h-11 text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" /> クリア
          </Button>
        </div>
      </div>
    </div>
  );
}
