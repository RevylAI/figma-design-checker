#!/bin/bash
set -e

PLATFORM=${1:-all}
PROFILE_IOS=${2:-preview-simulator}
PROFILE_ANDROID=${3:-preview}

if [ "$PLATFORM" = "all" ]; then
  echo "Building iOS (${PROFILE_IOS}) and Android (${PROFILE_ANDROID}) in parallel..."
  eas build --platform ios --profile "$PROFILE_IOS" --local &
  PID_IOS=$!
  eas build --platform android --profile "$PROFILE_ANDROID" --local &
  PID_ANDROID=$!
  echo "iOS build PID: $PID_IOS | Android build PID: $PID_ANDROID"
  wait $PID_IOS && echo "✓ iOS build complete" || echo "✗ iOS build failed"
  wait $PID_ANDROID && echo "✓ Android build complete" || echo "✗ Android build failed"
else
  PROFILE=${2:-preview}
  echo "Building $PLATFORM locally with profile: $PROFILE"
  eas build --platform "$PLATFORM" --profile "$PROFILE" --local
fi
