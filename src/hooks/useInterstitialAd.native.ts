import { useCallback, useEffect, useRef, useState } from 'react';
import { AdEventType } from 'react-native-google-mobile-ads';

import { getInterstitialAd } from '../config/ads';

export function useInterstitialAd() {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const interstitial = getInterstitialAd();

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
        if (pendingActionRef.current) {
          pendingActionRef.current();
          pendingActionRef.current = null;
        }
      },
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const executeWithAd = useCallback(
    (action: () => void) => {
      const interstitial = getInterstitialAd();

      if (interstitialLoaded) {
        pendingActionRef.current = action;
        interstitial.show();
      } else {
        action();
      }
    },
    [interstitialLoaded],
  );

  return { executeWithAd };
}
