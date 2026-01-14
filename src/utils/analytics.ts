import { useEffect } from 'react';

/**
 * Google Analytics トラッキングスクリプト
 * ページビューおよびカスタムイベントを記録します
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Google Analytics を動的に初期化
 */
export const initializeGoogleAnalytics = (measurementId: string) => {
  if (!measurementId || measurementId === 'YOUR_GA_ID') {
    console.warn('Google Analytics measurement ID not configured. Set VITE_GA_MEASUREMENT_ID in environment.');
    return;
  }

  // Google Analytics スクリプトを動的に読み込む
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // 設定を実行
  if (typeof window.gtag === 'undefined') {
    console.warn('Google Analytics gtag not available');
    return;
  }

  window.gtag('config', measurementId, {
    'page_path': window.location.pathname,
    'cookie_flags': 'SameSite=None;Secure'
  });
};

/**
 * ページビューを記録
 */
export const trackPageView = (path: string, title: string) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    'page_path': path,
    'page_title': title
  });
};

/**
 * カスタムイベントを記録
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('event', eventName, eventParams);
};

/**
 * 再生イベントを記録
 */
export const trackPlaybackEvent = (action: 'play' | 'stop' | 'pause') => {
  trackEvent('playback', {
    'action': action,
    'timestamp': new Date().toISOString()
  });
};

/**
 * メロディー操作を記録
 */
export const trackMelodyEvent = (action: 'add_note' | 'remove_note' | 'clear' | 'load_preset') => {
  trackEvent('melody', {
    'action': action,
    'timestamp': new Date().toISOString()
  });
};

/**
 * マイク使用を記録
 */
export const trackMicEvent = (state: 'on' | 'off') => {
  trackEvent('microphone', {
    'state': state,
    'timestamp': new Date().toISOString()
  });
};

/**
 * エラーイベントを記録
 */
export const trackErrorEvent = (errorType: string, description: string) => {
  trackEvent('error', {
    'error_type': errorType,
    'error_description': description,
    'timestamp': new Date().toISOString()
  });
};

/**
 * React コンポーネント用 Hook - 簡易ページビュー自動記録
 */
export const usePageTracking = () => {
  useEffect(() => {
    // ページビューを記録
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        'page_path': window.location.pathname,
        'page_title': document.title
      });
    }
  }, []);
};
