import { Mic } from 'lucide-react';
import type { Fingering } from '../../data/fingerings';
import type { TunerStatus, PitchResult } from '../../types';

interface RecorderDisplayProps {
  displayFingering: Fingering | null;
  isMicActive: boolean;
  detectedPitch: PitchResult | null;
  tunerStatus: TunerStatus;
  children: React.ReactNode;
}

export function RecorderDisplay({
  displayFingering,
  isMicActive,
  detectedPitch,
  tunerStatus,
  children
}: RecorderDisplayProps) {
  return (
    <div className="flex-1 relative bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden min-h-[200px]">
      {/* Target Note Display */}
      <div className="absolute top-4 left-0 w-full text-center z-10 pointer-events-none px-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target</span>
        <div className="text-4xl font-black text-slate-800 mt-1 drop-shadow-sm transition-all duration-100">
          {displayFingering?.note || "-"}
        </div>
        <div className="text-sm font-mono text-slate-500">
          {displayFingering?.pitch || ""}
        </div>
      </div>

      {/* Tuner Display */}
      {isMicActive && (
        <div className="absolute top-24 left-0 w-full flex flex-col items-center justify-center z-10 pointer-events-none px-4">
          <div className={`
            backdrop-blur-md bg-white/80 px-4 py-2 rounded-xl shadow-lg border transition-colors duration-200
            ${tunerStatus.status === 'perfect' ? 'border-emerald-400 bg-emerald-50/90' :
              tunerStatus.status === 'good' ? 'border-emerald-200' :
                tunerStatus.status === 'wrong' ? 'border-red-200 bg-red-50/50' :
                  'border-slate-200'}
          `}>
            <div className="flex items-center gap-2 mb-1 justify-center">
              <Mic className={`w-3 h-3 ${isMicActive ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-500 uppercase">Your Pitch</span>
            </div>

            <div className="text-center">
              {detectedPitch ? (
                <>
                  <div className={`text-2xl font-black ${
                    tunerStatus.status === 'wrong' ? 'text-red-500' :
                    tunerStatus.status === 'waiting' ? 'text-slate-400' : 
                    'text-slate-800'
                  }`}>
                    {detectedPitch.note}
                  </div>
                  <div className={`text-xs font-mono mt-1 ${
                    tunerStatus.status === 'perfect' ? 'text-emerald-600 font-bold' :
                    tunerStatus.status === 'good' ? 'text-emerald-500' :
                    'text-slate-500'
                  }`}>
                    {tunerStatus.message}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {detectedPitch.diff > 0 ? '+' : ''}{detectedPitch.diff.toFixed(0)} cents
                  </div>
                </>
              ) : (
                <div className="text-lg text-slate-400">...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      {children}
    </div>
  );
}
