import { Platform } from 'react-native';
import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

const AD_REQUEST_OPTIONS = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['library', 'books', 'education'],
};

function pickPlatformUnitId(androidId?: string, iosId?: string) {
  return Platform.OS === 'ios' ? iosId : androidId;
}

export function getBannerAdUnitId() {
  if (__DEV__) {
    return TestIds.BANNER;
  }

  return (
    pickPlatformUnitId(
      process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID,
      process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_IOS,
    ) ?? TestIds.BANNER
  );
}

export function getInterstitialAdUnitId() {
  if (__DEV__) {
    return TestIds.INTERSTITIAL;
  }

  return (
    pickPlatformUnitId(
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID_ANDROID,
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_UNIT_ID_IOS,
    ) ?? TestIds.INTERSTITIAL
  );
}

let interstitialAd: InterstitialAd | null = null;

export function getInterstitialAd() {
  if (!interstitialAd) {
    interstitialAd = InterstitialAd.createForAdRequest(
      getInterstitialAdUnitId(),
      AD_REQUEST_OPTIONS,
    );
  }

  return interstitialAd;
}
