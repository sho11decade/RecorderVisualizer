import { useEffect } from 'react';

/**
 * キーボードショートカットを管理するカスタムフック
 */
export function useKeyboardShortcuts(handlers: {
  onSpace?: () => void;
  onHelp?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールドでは無効化
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space' && handlers.onSpace) {
        e.preventDefault();
        handlers.onSpace();
      }
      
      if (e.key === '?' && handlers.onHelp) {
        e.preventDefault();
        handlers.onHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
