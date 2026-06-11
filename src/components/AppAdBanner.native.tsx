import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { getBannerAdUnitId } from '../config/ads';
import { isScreenshotMode } from '../config/screenshot';

export function initAds() {
  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      console.log('AdMob initialization complete:', adapterStatuses);
    })
    .catch((error) => {
      console.error('AdMob initialization failed:', error);
    });
}

export function AppAdBanner() {
  useEffect(() => {
    initAds();
  }, []);

  if (isScreenshotMode()) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    paddingVertical: 4,
  },
});
