# Blank App — Revyl hot reload demo

Minimal Expo TypeScript app wired for Revyl's managed Metro relay.

## What's configured

- `expo-dev-client` — required so JS loads from Metro, not an embedded Release bundle
- `eas.json` — `development` / `development-simulator` profiles (`developmentClient: true`)
- `app.json` — scheme `blank-app`, iOS/Android bundle ids
- `.revyl/config.yaml` — Expo hotreload provider (`app_scheme: blank-app`)

## Start the loop

From this directory, with `REVYL_API_KEY` set (or `revyl auth login`):

```bash
# Link / create the Revyl app stream once, then build a simulator dev client
revyl init --provider expo --force   # interactive app linking if needed
revyl build --platform ios --remote  # or local EAS on macOS

# Hot reload loop (keep this running for demos)
revyl dev --detach --json
revyl dev status --wait-ready --timeout 300
```

Share the `viewer_url` from the handshake. Edits to `App.tsx` Fast Refresh on the cloud device within a couple seconds.

Prefer the Revyl-managed relay. Only fall back to `npx expo start --tunnel --dev-client` + `revyl dev --no-build --tunnel '<full dev-client link>'` if device evidence shows the relay failed.

## Teardown

```bash
revyl dev stop
```
