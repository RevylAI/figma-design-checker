#!/bin/bash
# Start a cloud device, install latest preview build, and launch Bug Bazaar
set -e

REVYL="../../revyl-cli/build/revyl"
PLATFORM=${1:-ios}

if [ "$PLATFORM" = "ios" ]; then
  APP_ID="b3c671c7-1cc9-445f-9628-214a42465878"
else
  APP_ID="9facccd2-daba-4ec3-bcf0-ec86482f73b2"
fi

API_KEY=$(python3 -c "import json; print(json.load(open('$HOME/.revyl/credentials.json'))['api_key'])")

echo "Starting $PLATFORM device..."
$REVYL device start --platform "$PLATFORM" --timeout 600

echo "Fetching latest build URL..."
DOWNLOAD_URL=$(curl -s -H "Authorization: Bearer $API_KEY" \
  "https://backend.revyl.ai/api/v1/apps/$APP_ID/builds?include_download_urls=true" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['items'][0]['download_url'])")

echo "Installing app..."
$REVYL device install --app-url "$DOWNLOAD_URL" --bundle-id com.bugbazaar.app

echo "Launching..."
$REVYL device launch --bundle-id com.bugbazaar.app

echo "Done! Use 'revyl device tap/swipe/type' to interact."
