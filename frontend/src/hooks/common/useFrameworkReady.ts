import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

/**
 * フレームワークの準備が完了したときに実行される関数を呼び出すフック
 * Expo環境でのフレームワーク初期化完了を通知するために使用
 */
export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}
