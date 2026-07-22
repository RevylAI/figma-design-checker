# Agent Instructions

<!-- revyl:agents:start -->
## Revyl — run this app on a cloud device

Use the Revyl CLI to build, run, and verify app changes on a cloud device.
Revyl viewer URLs are live device streams — share them with the user as soon
as you have one.

Hot-reload demo app: `blank-app/` (Expo + expo-dev-client). Design-check
sample: `sample-app/`. Run Revyl from the app directory (`cd blank-app` or
`-C blank-app`).

On a local machine the CLI opens the live viewer in the user's browser
automatically when the session is ready (check "opened_browser" in the
handshake; --no-open disables it). ALWAYS also post viewer_url as a clickable
markdown link — that is the fallback on cloud VMs — and never try to open a
browser yourself.

Cloud agents require `REVYL_API_KEY` as a Runtime Secret. Browser login is not
supported in headless VMs.

One-time setup (ephemeral shells may lack the CLI):

```bash
if ! command -v revyl >/dev/null 2>&1; then
  REVYL_NO_MODIFY_PATH=1 sh -c 'curl -fsSL https://revyl.com/install.sh | sh'
  export PATH="$HOME/.revyl/bin:$PATH"
fi
revyl auth status || revyl auth login --api-key="$REVYL_API_KEY"
```

Dev loop for Expo hot reload (run from `blank-app/`):

```bash
# First time (or after native changes): build + upload a development client,
# then start the managed relay loop. Prefer Revyl remote builds on Linux VMs.
revyl build --platform ios --remote   # needs auth + linked app_id
revyl dev --detach --json             # Metro + relay + cloud device

# Share viewer_url immediately, then wait until the full loop is live:
revyl dev status --wait-ready --timeout 300

# JS/TS edits Fast Refresh automatically. Native changes:
revyl dev rebuild --wait --json
```

Rebuild-first / remote-native loop (when not using Metro hot reload):

```bash
revyl dev --remote --detach --json
revyl dev status            # state: building -> idle
revyl dev logs --build --follow
revyl dev rebuild --wait --json
```

Verify like a user (separate short-lived commands; never in the loop terminal):

```bash
revyl device screenshot --out screen.png
revyl device validation -s 0 "<expected user-visible outcome>" --json
revyl device report --session-id <session-id> --json
```

Auth: when .revyl/config.yaml has an auth_bypass section, sessions launch
authenticated automatically (launch vars + deep link are applied for you). If
the app ever shows a logged-out state mid-session (expired token), re-mint the
launch vars with this repo's own mint script (if it has one), then re-fire the
auth deep link:

```bash
revyl dev auth refresh
```

Stop with `revyl dev stop` when done. Never paste launch-var values or
tokens into code, logs, screenshots, or PRs — reference key names only.
<!-- revyl:agents:end -->
