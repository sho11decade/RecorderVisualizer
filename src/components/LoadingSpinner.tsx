import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  const { t } = useLanguage();
  const text = message ?? t.loading;
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-slate-600">{text}</p>
    </div>
  );
}
