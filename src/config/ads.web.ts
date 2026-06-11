export function getBannerAdUnitId() {
  return '';
}

export function getInterstitialAdUnitId() {
  return '';
}

type InterstitialListener = () => void;

export function getInterstitialAd() {
  return {
    addAdEventListener: (_event: string, _handler: InterstitialListener) =>
      () => {},
    load: () => {},
    show: () => {},
  };
}
