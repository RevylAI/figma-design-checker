# Agent Instructions

<!-- revyl:agents:start -->
## Revyl — blank app hot reload

This is an Expo blank app for Revyl hot-reload demos. Run all `revyl`
commands from `blank-app/` (or `-C blank-app`).

Cloud agents need `REVYL_API_KEY` as a Runtime Secret (browser login is not
supported on headless VMs).

```bash
if ! command -v revyl >/dev/null 2>&1; then
  REVYL_NO_MODIFY_PATH=1 sh -c 'curl -fsSL https://revyl.com/install.sh | sh'
  export PATH="$HOME/.revyl/bin:$PATH"
fi
revyl auth status || revyl auth login --api-key="$REVYL_API_KEY"

# Start hot reload (managed relay). Share viewer_url immediately.
revyl dev --detach --json
revyl dev status --wait-ready --timeout 300

# Keep the loop running for demos. JS/TS edits Fast Refresh automatically.
# Stop with: revyl dev stop
```

Never paste API keys or launch-var values into chat, logs, or PRs.
<!-- revyl:agents:end -->
