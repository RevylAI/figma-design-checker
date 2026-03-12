#!/usr/bin/env python3
"""
Capture app screenshots on a Revyl cloud device to compare against Figma frames.

Reads a screens.yaml mapping that ties Figma frame names to navigation
instructions, boots a Revyl device, walks through each screen, and saves
a screenshot whose filename matches the corresponding Figma export.

Usage:
    python scripts/capture.py \
        --platform android \
        --app-id $REVYL_APP_ID \
        --output-dir app_screenshots \
        --screens screens.yaml
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import yaml

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

REVYL = os.environ.get("REVYL_BIN", "revyl")


def sanitize_filename(name: str) -> str:
    name = name.strip().lower()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"[\s_-]+", "_", name)
    return name


def run_revyl(*args: str, check: bool = True) -> dict[str, Any]:
    """
    Run a revyl CLI command, parse its JSON output, and return it.

    Raises ``SystemExit`` on failure when *check* is True.
    """
    cmd = [REVYL, *args, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0 and check:
        print(f"ERROR: revyl command failed: {' '.join(cmd)}", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

    try:
        return json.loads(result.stdout) if result.stdout.strip() else {}
    except json.JSONDecodeError:
        # Some commands return non-JSON on success — treat as empty
        return {"raw": result.stdout.strip()}


def wait_for_device(timeout: int = 120) -> None:
    """Poll until the device is responsive (screenshot succeeds)."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        result = subprocess.run(
            [REVYL, "device", "screenshot", "--out", "/dev/null", "--json"],
            capture_output=True,
        )
        if result.returncode == 0:
            return
        time.sleep(3)
    print("ERROR: Device did not become ready within timeout.", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Navigation actions
# ---------------------------------------------------------------------------


def execute_step(step: dict) -> None:
    """Execute a single navigation step via the Revyl CLI."""
    action = step.get("action", "").lower()

    if action == "tap":
        target = step["target"]
        print(f"    tap: {target}")
        run_revyl("device", "tap", "--target", target)

    elif action == "type":
        target = step["target"]
        text = step["text"]
        print(f"    type: '{text}' into {target}")
        run_revyl("device", "type", "--target", target, "--text", text)

    elif action == "swipe":
        target = step.get("target", "screen")
        direction = step.get("direction", "up")
        print(f"    swipe {direction} on {target}")
        run_revyl("device", "swipe", "--target", target, "--direction", direction)

    elif action == "wait":
        seconds = int(step.get("seconds", 2))
        print(f"    wait {seconds}s")
        time.sleep(seconds)

    elif action == "go-home":
        print("    go-home")
        run_revyl("device", "go-home")

    else:
        print(f"    WARN: unknown action '{action}' — skipping", file=sys.stderr)

    # Brief pause between steps for UI to settle
    time.sleep(float(step.get("pause", 1.0)))


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------


def capture_screens(
    screens: list[dict],
    output_dir: Path,
    platform: str,
    app_id: str,
) -> list[dict]:
    """
    Boot a device, navigate to each screen, screenshot, and return results.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    results: list[dict] = []

    # --- Start device ---
    print(f"Starting {platform} device for app {app_id} ...")
    start_resp = run_revyl("device", "start", "--platform", platform, "--app-id", app_id)
    device_id = start_resp.get("device_id", start_resp.get("id", "unknown"))
    print(f"Device started: {device_id}")

    print("Waiting for device to be ready ...")
    wait_for_device()

    try:
        for i, screen in enumerate(screens, 1):
            frame_name = screen["figma_frame"]
            description = screen.get("description", frame_name)
            steps = screen.get("steps", [])
            reset = screen.get("reset", False)

            slug = sanitize_filename(frame_name)
            filename = f"{slug}.png"
            dest = output_dir / filename

            print(f"\n[{i}/{len(screens)}] {frame_name}")
            if description != frame_name:
                print(f"  Description: {description}")

            # Reset to home screen if requested
            if reset:
                print("  Resetting to home ...")
                run_revyl("device", "go-home")
                time.sleep(1)
                # Re-launch the app by tapping it — the app should be on the home screen
                # or we can stop/start. For simplicity, just go home and let steps navigate.

            # Execute navigation steps
            if steps:
                print(f"  Navigating ({len(steps)} step(s)) ...")
                for step in steps:
                    execute_step(step)

            # Allow UI animations to finish
            time.sleep(1.5)

            # Screenshot
            print(f"  Capturing screenshot -> {filename}")
            run_revyl("device", "screenshot", "--out", str(dest))

            if dest.exists():
                results.append({
                    "figma_frame": frame_name,
                    "file": filename,
                    "status": "captured",
                })
            else:
                print(f"  WARN: Screenshot file not found at {dest}", file=sys.stderr)
                results.append({
                    "figma_frame": frame_name,
                    "file": filename,
                    "status": "failed",
                })

    finally:
        # Always stop the device
        print("\nStopping device ...")
        run_revyl("device", "stop", check=False)

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Capture app screenshots via Revyl CLI for design comparison.",
    )
    p.add_argument("--platform", required=True, choices=["android", "ios"], help="Device platform")
    p.add_argument("--app-id", required=True, help="Revyl app ID")
    p.add_argument("--output-dir", default="app_screenshots", help="Directory for screenshots (default: app_screenshots)")
    p.add_argument("--screens", default="screens.yaml", help="Path to screens.yaml mapping file")
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    screens_path = Path(args.screens)
    if not screens_path.exists():
        print(f"ERROR: Screens file not found: {screens_path}", file=sys.stderr)
        sys.exit(1)

    with open(screens_path) as f:
        config = yaml.safe_load(f)

    screens = config.get("screens", [])
    if not screens:
        print("ERROR: No screens defined in config.", file=sys.stderr)
        sys.exit(1)

    print(f"Loaded {len(screens)} screen(s) from {screens_path}")
    output_dir = Path(args.output_dir)

    results = capture_screens(screens, output_dir, args.platform, args.app_id)

    # Write results manifest
    manifest_path = output_dir / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(results, f, indent=2)

    captured = sum(1 for r in results if r["status"] == "captured")
    failed = sum(1 for r in results if r["status"] == "failed")
    print(f"\nDone. {captured} captured, {failed} failed.")
    print(f"Manifest written to {manifest_path}")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
