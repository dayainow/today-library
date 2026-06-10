#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AVD_NAME="${AVD_NAME:-Pixel_8}"
METRO_PORT="${METRO_PORT:-8084}"

export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

if ! command -v adb >/dev/null; then
  echo "adb를 찾을 수 없습니다. Android Studio SDK platform-tools를 확인하세요."
  exit 1
fi

if ! adb devices | grep -q "device$"; then
  echo "에뮬레이터를 시작합니다: $AVD_NAME"
  "$ANDROID_HOME/emulator/emulator" -avd "$AVD_NAME" -no-snapshot-load &
  adb wait-for-device
  while [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]]; do
    sleep 2
  done
fi

echo "Android debug APK 설치 중..."
(
  cd "$ROOT/android"
  ./gradlew :app:installDebug -PreactNativeArchitectures=arm64-v8a
)

echo "Expo dev server 시작 (port $METRO_PORT)..."
echo "에뮬레이터 앱 서랍에서 '오늘의 도서관' 아이콘을 직접 눌러 실행하세요."
echo "개발 서버 URL: http://10.0.2.2:$METRO_PORT"

cd "$ROOT"
exec npx expo start --dev-client --port "$METRO_PORT" -c
