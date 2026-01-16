import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Check, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PitchFeedbackProps {
  status: 'perfect' | 'good' | 'ok' | 'wrong' | 'waiting' | 'neutral';
  message: string;
}

export function PitchFeedback({ status, message }: PitchFeedbackProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (status) {
      case 'perfect':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'good':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'wrong':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getColorClass = () => {
    switch (status) {
      case 'perfect':
        return 'bg-emerald-500 text-white';
      case 'good':
        return 'bg-emerald-100 text-emerald-700';
      case 'ok':
        return 'bg-yellow-100 text-yellow-700';
      case 'wrong':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${getColorClass()}`}>
          {getIcon()}
          <span>{message}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          {status === 'perfect' && t.pitchMessages.perfect}
          {status === 'good' && t.pitchMessages.good}
          {status === 'ok' && t.pitchMessages.ok}
          {status === 'wrong' && t.pitchMessages.wrong}
          {status === 'waiting' && t.pitchMessages.waiting}
          {status === 'neutral' && t.pitchMessages.neutral}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
