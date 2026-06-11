import { useCallback } from 'react';

export function useInterstitialAd() {
  const executeWithAd = useCallback((action: () => void) => {
    action();
  }, []);

  return { executeWithAd };
}
