#!/usr/bin/env bash
# Progressive Citizen UI reveal for video demos.
# Assumes `revyl dev` is already running with Metro + relay.
# All components already live under src/ — this only rewires App.tsx.
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="${HOME}/.revyl/bin:${PATH}"

DEEP=$(revyl dev status --json | python3 -c 'import json,sys; print(json.load(sys.stdin).get("deep_link_url",""))')
if [ -z "$DEEP" ]; then
  echo "No deep_link_url — is revyl dev running?" >&2
  exit 1
fi

apply() {
  local tag="$1"
  echo "→ $tag"
  revyl device navigate --url "$DEEP" >/dev/null
  sleep "${STAGE_WAIT:-10}"
  mkdir -p /opt/cursor/artifacts/screenshots
  revyl device screenshot --out "/opt/cursor/artifacts/screenshots/${tag}.png" >/dev/null || true
}

# Stage files are generated inline by the agent during demos.
# Prefer keeping the final App.tsx as the full interactive app.
# To re-run the piece-by-piece reveal, ask the agent to "replay demo stages".

echo "Deep link ready. Ask the agent to replay stages 0→10 for a live reveal."
echo "DEEP=$DEEP"
