#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -d node_modules ]; then
  npm ci || npm install
fi

npx expo prebuild --platform ios --clean --no-install
cd ios
pod install

WORKSPACE="BlankApp.xcworkspace"
SCHEME="BlankApp"
test -d "$WORKSPACE"
echo "Workspace=$WORKSPACE Scheme=$SCHEME"

xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath "$ROOT/build/DerivedData" \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  ARCHS=arm64 \
  build

APP_PATH=$(find "$ROOT/build/DerivedData/Build/Products" -name "BlankApp.app" -type d | head -1)
test -n "$APP_PATH"
mkdir -p "$ROOT/build"
rm -f "$ROOT/build/app.tar.gz"
COPYFILE_DISABLE=1 tar -czf "$ROOT/build/app.tar.gz" -C "$(dirname "$APP_PATH")" "$(basename "$APP_PATH")"
echo "Wrote $ROOT/build/app.tar.gz from $APP_PATH"
ls -la "$ROOT/build/app.tar.gz"
