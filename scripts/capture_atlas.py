#!/usr/bin/env python3
"""
Pull app screenshots from a Revyl **Atlas** to compare against Figma frames.

This is the Atlas-powered counterpart to ``capture.py``. Instead of booting a
live cloud device and hand-scripting navigation (tap/type/swipe) to reach each
screen, it reads the app's Atlas — Revyl's auto-built map of every screen it has
already explored — and downloads the representative screenshot for each screen.

Because the Atlas already explored the app, there is no device to boot and no
navigation to script: each ``screens`` entry just maps a Figma frame name to an
Atlas screen (by label/id or a fuzzy search query).

The output is byte-for-byte compatible with ``capture.py``: screenshots are
written to ``<output-dir>/<slug>.png`` (slug derived from the Figma frame name)
alongside a ``manifest.json``, so ``diff.py`` consumes the result unchanged.

Usage:
    python scripts/capture_atlas.py \
        --app "Crate" \
        --build all \
        --output-dir app_screenshots \
        --screens screens.crate.yaml

Each screen in the YAML needs a ``figma_frame`` plus exactly one Atlas selector:

    screens:
      - figma_frame: "Storefront - Home"
        atlas_screen: storefront_home_feed     # Atlas entity_label or screen id

      - figma_frame: "Checkout"
        atlas_query: "checkout payment form"    # fuzzy semantic search

Optional per-screen ``group`` overrides which observation bucket to pull
(representative | latest | most_common | distinct); defaults to --group.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

import yaml

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

REVYL = os.environ.get("REVYL_BIN", "revyl")

# The observation buckets the Atlas exposes, in fallback-preference order. Single
# source of truth for the CLI --group choices, per-screen `group:` validation,
# and the fallback chain in pick_screenshot.
GROUPS = ["representative", "latest", "most_common", "distinct"]
GROUP_FALLBACK = GROUPS

# A bare UUID, used to tell "this is already a screen id" from "this is a label".
_UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I
)


def sanitize_filename(name: str) -> str:
    """Identical to capture.py / diff.py so filenames line up for matching."""
    name = name.strip().lower()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"[\s_-]+", "_", name)
    return name


def run_revyl_json(*args: str, check: bool = True) -> Any:
    """Run a revyl CLI command with --json and return the parsed payload.

    On a nonzero exit the CLI's stderr is *always* surfaced, so a failed Atlas
    call is never silently swallowed into an empty ``{}`` (which would otherwise
    masquerade as "no screenshot found"). ``check`` additionally aborts the run.
    """
    cmd = [REVYL, "atlas", *args, "--json"]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"ERROR: revyl command failed (exit {result.returncode}): {' '.join(cmd)}", file=sys.stderr)
        if result.stderr.strip():
            print(result.stderr.strip(), file=sys.stderr)
        if check:
            sys.exit(1)
        return {}

    out = result.stdout.strip()
    if not out:
        return {}
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        print(f"ERROR: could not parse JSON from: {' '.join(cmd)}", file=sys.stderr)
        print(out[:500], file=sys.stderr)
        if check:
            sys.exit(1)
        return {}


# ---------------------------------------------------------------------------
# Atlas resolution
# ---------------------------------------------------------------------------


def load_screen_index(app: str, build: str) -> dict[str, str]:
    """Return a label -> screen_id map from the Atlas structure."""
    # `atlas map` defaults to --limit 20; raise it so apps with many screens are
    # fully indexed (an un-indexed label silently drops that screen).
    data = run_revyl_json("map", "--app", app, "--build", build, "--limit", "1000")
    index: dict[str, str] = {}
    for node in data.get("structure_nodes", []):
        label = node.get("label")
        sid = node.get("id")
        if label and sid:
            index[label.strip().lower()] = sid
    return index


def resolve_screen_id(
    entry: dict,
    index: dict[str, str],
    app: str,
    build: str,
) -> tuple[str | None, str]:
    """
    Resolve a screens.yaml entry to an Atlas screen id.

    Returns (screen_id, how) where *how* describes the resolution path for logs.
    """
    # 1. Explicit label or id via `atlas_screen`
    target = entry.get("atlas_screen")
    if target:
        target = str(target).strip()
        if _UUID_RE.match(target):
            return target, "id"
        sid = index.get(target.lower())
        if sid:
            return sid, f"label '{target}'"
        return None, f"label '{target}' (not found in Atlas)"

    # 2. Fuzzy search via `atlas_query` (token-based; prefer one keyword)
    query = entry.get("atlas_query")
    if query:
        data = run_revyl_json("search", str(query), "--app", app, "--build", build)
        results = data.get("results", []) if isinstance(data, dict) else []
        if not results:
            return None, f"search '{query}' (no results)"
        top = results[0]
        sid = top.get("id")
        ambiguous = f" [{len(results)} matches, using top]" if len(results) > 1 else ""
        how = (
            f"search '{query}' -> {top.get('label')} "
            f"({top.get('observation_count')} obs){ambiguous}"
        )
        if not sid:
            return None, how + " — top result has no id"
        return sid, how

    return None, "no atlas_screen/atlas_query selector"


def pick_screenshot(observations: dict, group: str) -> tuple[str | None, str | None]:
    """
    Choose the best screenshot URL for a screen from its observations payload.

    Tries the requested *group* first, then GROUP_FALLBACK, then the screen's
    own representative. Returns (url, observation_id).
    """
    groups = observations.get("groups", {}) if isinstance(observations, dict) else {}

    order = [group] + [g for g in GROUP_FALLBACK if g != group]
    for g in order:
        items = groups.get(g)
        if isinstance(items, list) and items:
            first = items[0]
            url = first.get("screenshot_url")
            if url:
                # Raw observation buckets carry observation_id; the grouped
                # (representative/most_common) ones expose representative_observation_id.
                obs_id = first.get("observation_id") or first.get("representative_observation_id")
                return url, obs_id

    # Last resort: the screen-level representative shot. ``screen`` may be an
    # explicit null in the payload, so coerce to {} before .get().
    screen = (observations.get("screen") or {}) if isinstance(observations, dict) else {}
    if screen.get("screenshot_url"):
        return screen["screenshot_url"], screen.get("representative_observation_id")

    return None, None


def download(url: str, dest: Path, *, retries: int = 2, max_bytes: int = 25 * 1024 * 1024) -> bool:
    """Download a (pre-signed) screenshot URL to *dest* atomically.

    Writes to a ``.part`` temp file and renames only on a verified non-empty
    response, so a failed, empty, or truncated download never leaves a corrupt
    ``.png`` that ``diff.py`` would later glob and choke on. Retries transient
    failures. Returns True on success.
    """
    tmp = dest.with_suffix(dest.suffix + ".part")
    last_err: str | None = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "figma-design-checker"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                status = getattr(resp, "status", 200) or 200
                if status >= 400:
                    raise urllib.error.HTTPError(url, status, "bad status", resp.headers, None)
                data = resp.read(max_bytes + 1)
            if not data:
                raise ValueError("empty response body")
            if len(data) > max_bytes:
                raise ValueError(f"response exceeds {max_bytes} byte cap")
            tmp.write_bytes(data)
            tmp.replace(dest)  # atomic rename on the same filesystem
            return True
        except Exception as exc:  # noqa: BLE001 - report, retry, then give up cleanly
            last_err = str(exc)
            if attempt < retries:
                print(f"  retry {attempt + 1}/{retries}: download failed: {exc}", file=sys.stderr)
    print(f"  ERROR: download failed after {retries + 1} attempt(s): {last_err}", file=sys.stderr)
    if tmp.exists():
        tmp.unlink()
    return False


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------


def capture_from_atlas(
    screens: list[dict],
    output_dir: Path,
    app: str,
    build: str,
    default_group: str,
) -> list[dict]:
    output_dir.mkdir(parents=True, exist_ok=True)
    results: list[dict] = []

    # Validate up front before any network work: every entry needs a non-empty
    # figma_frame, and no two frames may collapse to the same slug. diff.py
    # matches purely on filename stem, so a collision would silently overwrite
    # one screenshot and compare a Figma frame against the wrong app screen.
    seen_slugs: dict[str, str] = {}
    for entry in screens:
        if not isinstance(entry, dict):
            print(f"ERROR: each 'screens' entry must be a mapping, got {type(entry).__name__}: {entry!r}", file=sys.stderr)
            sys.exit(1)
        frame = str(entry.get("figma_frame", "")).strip()
        if not frame:
            print("ERROR: every screen entry needs a non-empty 'figma_frame'.", file=sys.stderr)
            sys.exit(1)
        slug = sanitize_filename(frame)
        if not slug:
            print(f"ERROR: figma_frame '{frame}' has no filename-safe characters; rename it.", file=sys.stderr)
            sys.exit(1)
        if slug in seen_slugs:
            print(
                f"ERROR: figma_frame '{frame}' and '{seen_slugs[slug]}' both map to "
                f"'{slug}.png'. Rename one — diff.py matches by filename and would "
                f"compare the wrong screen.",
                file=sys.stderr,
            )
            sys.exit(1)
        seen_slugs[slug] = frame
        if not entry.get("atlas_screen") and not entry.get("atlas_query"):
            print(f"ERROR: screen '{frame}' needs an 'atlas_screen' or 'atlas_query' selector.", file=sys.stderr)
            sys.exit(1)
        if entry.get("atlas_screen") and entry.get("atlas_query"):
            print(f"  WARN: screen '{frame}' sets both atlas_screen and atlas_query; using atlas_screen.", file=sys.stderr)
        grp = entry.get("group", default_group)
        if grp not in GROUPS:
            print(f"ERROR: screen '{frame}' has invalid group '{grp}'; choose one of: {', '.join(GROUPS)}.", file=sys.stderr)
            sys.exit(1)

    print(f"Loading Atlas structure for app '{app}' (build={build}) ...")
    index = load_screen_index(app, build)
    print(f"Atlas has {len(index)} mapped screen(s): {', '.join(sorted(index)) or '(none)'}")
    if not index:
        print(
            "  WARN: no screens indexed for this build. If the app has an Atlas, "
            "try '--build all' to aggregate across builds.",
            file=sys.stderr,
        )

    for i, screen in enumerate(screens, 1):
        frame_name = screen["figma_frame"]
        group = screen.get("group", default_group)
        slug = sanitize_filename(frame_name)
        filename = f"{slug}.png"
        dest = output_dir / filename

        print(f"\n[{i}/{len(screens)}] {frame_name}")

        screen_id, how = resolve_screen_id(screen, index, app, build)
        print(f"  Resolve: {how}")
        if not screen_id:
            results.append({"figma_frame": frame_name, "file": filename, "status": "failed"})
            continue

        observations = run_revyl_json(
            "observations", screen_id, "--app", app, "--build", build, check=False
        )
        url, obs_id = pick_screenshot(observations, group)
        if not url:
            print(
                "  WARN: no downloadable screenshot in the Atlas for this screen "
                "(see any revyl error above)",
                file=sys.stderr,
            )
            results.append({"figma_frame": frame_name, "file": filename, "status": "failed"})
            continue

        print(f"  Screenshot: group='{group}' obs={obs_id}")
        print(f"  Downloading -> {filename}")
        ok = download(url, dest)

        results.append({
            "figma_frame": frame_name,
            "file": filename,
            "status": "captured" if ok else "failed",
            "screen_id": screen_id,
            "observation_id": obs_id,
            "source": "atlas",
        })

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Pull app screenshots from a Revyl Atlas for design comparison.",
    )
    p.add_argument("--app", required=True, help="Revyl app name or app id (with an Atlas)")
    p.add_argument(
        "--build",
        default="latest",
        help="Build id, version, 'latest', or 'all' to aggregate across builds (default: latest)",
    )
    p.add_argument("--output-dir", default="app_screenshots", help="Directory for screenshots")
    p.add_argument("--screens", default="screens.yaml", help="Path to screens mapping YAML")
    p.add_argument(
        "--group",
        default="representative",
        choices=GROUPS,
        help="Which observation bucket to pull per screen (default: representative)",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    screens_path = Path(args.screens)
    if not screens_path.exists():
        print(f"ERROR: Screens file not found: {screens_path}", file=sys.stderr)
        sys.exit(1)

    with open(screens_path) as f:
        config = yaml.safe_load(f)

    if not isinstance(config, dict):
        print("ERROR: screens file must be a mapping with a top-level 'screens:' list.", file=sys.stderr)
        sys.exit(1)
    screens = config.get("screens", [])
    if not screens:
        print("ERROR: No screens defined in config.", file=sys.stderr)
        sys.exit(1)

    print(f"Loaded {len(screens)} screen(s) from {screens_path}")
    output_dir = Path(args.output_dir)

    results = capture_from_atlas(screens, output_dir, args.app, args.build, args.group)

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
