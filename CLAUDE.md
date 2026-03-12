# Figma Design Checker — Agent Instructions

This project compares Figma design frames against a real running app to measure design fidelity. When operating as an automated agent, follow this guide.

## Full Workflow

Run these steps in order:

### 1. Fetch Figma frames

```bash
python scripts/fetch_figma.py \
  --file-key <FIGMA_FILE_KEY> \
  --token $FIGMA_ACCESS_TOKEN \
  --output-dir figma_frames \
  --scale 2
```

This downloads every top-level frame from the Figma file as a PNG. Use `--frame-filter "Frame A" "Frame B"` to limit to specific frames.

### 2. Capture app screenshots

```bash
python scripts/capture.py \
  --platform android \
  --app-id $REVYL_APP_ID \
  --output-dir app_screenshots \
  --screens screens.yaml
```

This boots a cloud device via Revyl CLI, navigates to each screen defined in `screens.yaml`, and saves a screenshot with a filename matching the Figma frame.

### 3. Generate the compliance report

```bash
python scripts/diff.py \
  --figma-dir figma_frames \
  --app-dir app_screenshots \
  --output-dir report \
  --threshold 0.05
```

This produces:
- `report/report.html` — visual HTML report with side-by-side comparisons
- `report/report.md` — Markdown summary for PR comments
- `report/diffs/` — overlay images highlighting divergences

## Mapping Figma Frames to App Screens

Edit `screens.yaml` to define the mapping. Each entry needs:

- **figma_frame** — The exact frame name as it appears in the Figma file. This must match character-for-character (case-sensitive).
- **steps** — A list of Revyl CLI actions (tap, type, swipe, wait, go-home) that navigate from the app's launch state to the target screen.
- **reset** — Set to `true` if the device should return to the home screen before navigating. Useful when the previous screen's state would interfere.

Navigation actions available:
- `tap` — Tap an element by its visible text or description. Revyl uses AI to resolve the target.
- `type` — Type text into a field (requires `target` and `text`).
- `swipe` — Swipe in a direction (requires `target` and `direction`: up/down/left/right).
- `wait` — Pause for `seconds` before continuing.
- `go-home` — Press the device home button.

## Interpreting the Compliance Score

The fidelity score blends two metrics:
- **Pixel fidelity (70% weight)** — Percentage of pixels that match within the threshold tolerance.
- **Structural similarity (30% weight)** — A blurred-difference comparison that measures overall layout and contrast similarity, tolerant of minor color shifts.

### Grade scale

| Grade | Score Range | Meaning |
|-------|------------|---------|
| A | 95%+ | Implementation closely matches design |
| B | 90 - 95% | Minor deviations, likely acceptable |
| C | 80 - 90% | Noticeable differences, review recommended |
| D | 70 - 80% | Significant drift from design |
| F | < 70% | Major divergence, needs rework |

## Error Handling

### Missing Figma frames
If a frame name in `screens.yaml` does not exist in the Figma file, `fetch_figma.py` will skip it (or filter it out). The diff step will report unmatched files as warnings.

### Navigation failures
If a Revyl navigation step fails (element not found, timeout), `capture.py` will log the error and continue to the next screen. The failed screen will appear in the manifest with `"status": "failed"`.

### Size mismatches
The diff script automatically resizes Figma frames to match the device screenshot dimensions. No manual intervention needed.

### Device startup failures
If the Revyl device does not become responsive within 120 seconds, `capture.py` exits with an error. Retry or check your Revyl app configuration.

## Customization

### Adjusting the threshold
The `--threshold` flag on `diff.py` controls per-channel pixel tolerance (0.0 = exact match, 1.0 = everything matches). Default is 0.05 (about 5% tolerance per color channel). Increase to 0.10 or higher if your app has dynamic content like timestamps or avatars.

### Adding new screens
1. Add a new entry to `screens.yaml` with the Figma frame name and navigation steps.
2. Re-run all three scripts.

### Using with a different app
1. Update `screens.yaml` with your app's screen names and navigation flows.
2. Set `REVYL_APP_ID` to your app's ID.
3. Update the `--file-key` to point to your Figma file.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIGMA_ACCESS_TOKEN` | Yes | Figma personal access token |
| `REVYL_APP_ID` | Yes | Revyl app ID for the build to test |
| `REVYL_BIN` | No | Path to the revyl binary (default: `revyl`) |
