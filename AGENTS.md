# AGENTS.md

## Cursor Cloud specific instructions

This repo is a Python CLI tool (**Figma Design Checker**) that compares Figma
design frames against real app screenshots and emits a fidelity report. Standard
usage and env vars are documented in `README.md` and `CLAUDE.md`; only the
non-obvious cloud caveats are captured here.

### What runs where
- **`scripts/diff.py` — fully runnable offline, no secrets.** It only reads PNGs
  from disk. The repo ships sample inputs (`figma_export/`, `app_screenshots/`)
  and sample outputs (`report/`), so this is the way to smoke-test the tool
  end-to-end without any external service.
- **`scripts/fetch_figma.py`** needs `FIGMA_ACCESS_TOKEN` + a real Figma file key
  (hits `api.figma.com`). Cannot run without those secrets.
- **`scripts/capture.py` / `scripts/capture_atlas.py`** shell out to the Revyl
  CLI (`revyl` binary, overridable via `REVYL_BIN`) and need Revyl auth
  (`REVYL_APP_ID` / `REVYL_API_KEY`). The `revyl` binary is not installed in this
  environment, so these capture stages can't run here.

### Running the diff stage (the offline smoke test)
The `README` "Run" example writes Figma frames to `figma_frames/`, but the
committed sample designs live in `figma_export/`. Point `diff.py` at the shipped
dirs and use the Android status-bar mask (the sample screenshots are Android):

```bash
python3 scripts/diff.py --figma-dir figma_export --app-dir app_screenshots --output-dir report --platform android
```

Non-obvious notes:
- `diff.py` is **slow** (~1–2 min for the 9 sample screens): `pixelmatch` runs in
  pure Python over full-resolution RGBA byte lists. This is expected, not a hang.
- The Figma/app dirs are intentionally not 1:1 — `diff.py` matches by filename
  and prints WARN lines for unmatched frames/screenshots. That is normal.
- The generated `report/report.html` is self-contained (base64-embedded images),
  so it can be opened directly with a `file://` URL to inspect visually.

### sample-app/
`sample-app/` is an Expo/React Native fixture (the app-under-test), not the
shipped product. It needs Node + the Android/iOS toolchain + EAS to build and is
**not** required to run the checker. `sample-app/package-lock.json` is
git-ignored.
