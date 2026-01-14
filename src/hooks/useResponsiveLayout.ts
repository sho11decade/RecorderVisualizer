import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '../constants/app';

/**
 * レスポンシブレイアウトを管理するカスタムフック
 */
export function useResponsiveLayout() {
  const [isHorizontal, setIsHorizontal] = useState(() => 
    window.innerWidth >= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const checkSize = () => setIsHorizontal(window.innerWidth >= MOBILE_BREAKPOINT);
    
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return isHorizontal;
}
