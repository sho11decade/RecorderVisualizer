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
 * Google Analytics 計測ID（ハードコーディング）
 * Google Analytics https://analytics.google.com で取得
 */
const GA_MEASUREMENT_ID = 'G-7G6NFXX580';

/**
 * Google Analytics を動的に初期化
 */
export const initializeGoogleAnalytics = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics measurement ID not configured.');
    return;
  }

  // データレイヤーが既に初期化されているか確認
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  // Google Analytics スクリプトを動的に読み込む
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  script.onload = () => {
    // 公式スクリプト読み込み後、データレイヤーの履歴コマンドを実行
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      'page_path': window.location.pathname,
      'cookie_flags': 'SameSite=None;Secure'
    });
    console.log('Google Analytics initialized successfully');
  };

  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);
};

/**
 * ページビューを記録
 */
export const trackPageView = (path: string, title: string) => {
  if (typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
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
      window.gtag('config', GA_MEASUREMENT_ID, {
        'page_path': window.location.pathname,
        'page_title': document.title
      });
    }
  }, []);
};
