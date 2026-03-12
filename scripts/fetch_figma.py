#!/usr/bin/env python3
"""
Fetch design frames from a Figma file and export them as PNGs.

Uses the Figma REST API to enumerate top-level frames across all pages,
then exports each frame at the requested scale. Frames are saved with
sanitized filenames so they can be matched against app screenshots later.

Usage:
    python scripts/fetch_figma.py \
        --file-key abc123 \
        --token $FIGMA_ACCESS_TOKEN \
        --output-dir figma_frames \
        --scale 2 \
        --frame-filter "Shop - Home" "Product - Detail"
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

FIGMA_API_BASE = "https://api.figma.com/v1"
MAX_IDS_PER_REQUEST = 50  # Figma caps image-export batches
DOWNLOAD_RETRIES = 3
DOWNLOAD_BACKOFF = 2  # seconds, doubled on each retry

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def sanitize_filename(name: str) -> str:
    """Turn a Figma frame name into a filesystem-safe slug."""
    name = name.strip().lower()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"[\s_-]+", "_", name)
    return name


def extract_file_key(value: str) -> str:
    """Accept either a raw file key or a full Figma URL and return the key."""
    if value.startswith("http"):
        parts = urlparse(value).path.strip("/").split("/")
        # URL format: /file/{key}/... or /design/{key}/...
        for i, segment in enumerate(parts):
            if segment in ("file", "design") and i + 1 < len(parts):
                return parts[i + 1]
        raise ValueError(f"Could not extract file key from URL: {value}")
    return value


def figma_get(endpoint: str, token: str, params: dict | None = None) -> dict:
    """Perform an authenticated GET against the Figma API."""
    url = f"{FIGMA_API_BASE}{endpoint}"
    headers = {"X-FIGMA-TOKEN": token}
    resp = requests.get(url, headers=headers, params=params or {}, timeout=60)
    if resp.status_code == 403:
        print("ERROR: Figma API returned 403 — check your access token and file permissions.", file=sys.stderr)
        sys.exit(1)
    if resp.status_code == 404:
        print(f"ERROR: Figma resource not found — {endpoint}", file=sys.stderr)
        sys.exit(1)
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------


def list_frames(file_key: str, token: str, frame_filter: list[str] | None = None) -> list[dict]:
    """
    Return all top-level FRAME nodes across every page in the file.

    Each entry is ``{"id": "1:2", "name": "Frame Name", "page": "Page 1"}``.
    If *frame_filter* is provided only frames whose names appear in the list
    are returned (case-insensitive match).
    """
    data = figma_get(f"/files/{file_key}", token, params={"depth": 2})
    document = data.get("document", {})

    filter_set: set[str] | None = None
    if frame_filter:
        filter_set = {n.strip().lower() for n in frame_filter}

    frames: list[dict] = []
    for page in document.get("children", []):
        if page.get("type") != "CANVAS":
            continue
        page_name = page.get("name", "Untitled Page")
        for node in page.get("children", []):
            if node.get("type") not in ("FRAME", "COMPONENT", "COMPONENT_SET"):
                continue
            name = node.get("name", "Untitled")
            if filter_set and name.strip().lower() not in filter_set:
                continue
            frames.append({
                "id": node["id"],
                "name": name,
                "page": page_name,
            })

    return frames


def export_frames(
    file_key: str,
    token: str,
    frames: list[dict],
    scale: float = 1.0,
    fmt: str = "png",
) -> dict[str, str]:
    """
    Request rendered images for a list of frames.

    Returns a mapping of ``node_id -> image_url``.
    Handles batching when there are more frames than the API limit.
    """
    all_urls: dict[str, str] = {}

    # Batch the IDs
    ids_list = [f["id"] for f in frames]
    for i in range(0, len(ids_list), MAX_IDS_PER_REQUEST):
        batch = ids_list[i : i + MAX_IDS_PER_REQUEST]
        params = {
            "ids": ",".join(batch),
            "format": fmt,
            "scale": str(scale),
        }
        data = figma_get(f"/images/{file_key}", token, params=params)
        images = data.get("images", {})
        all_urls.update(images)

    return all_urls


def download_image(url: str, dest: Path) -> None:
    """Download a single image URL to *dest* with retries."""
    backoff = DOWNLOAD_BACKOFF
    for attempt in range(1, DOWNLOAD_RETRIES + 1):
        try:
            resp = requests.get(url, timeout=120, stream=True)
            resp.raise_for_status()
            with open(dest, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            return
        except requests.RequestException as exc:
            if attempt == DOWNLOAD_RETRIES:
                raise
            print(f"  Retry {attempt}/{DOWNLOAD_RETRIES} for {dest.name}: {exc}", file=sys.stderr)
            time.sleep(backoff)
            backoff *= 2


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Export Figma frames as PNGs for design comparison.",
    )
    p.add_argument(
        "--file-key",
        required=True,
        help="Figma file key or full URL (e.g. https://www.figma.com/file/abc123/...)",
    )
    p.add_argument(
        "--token",
        default=os.environ.get("FIGMA_ACCESS_TOKEN", ""),
        help="Figma personal access token (default: $FIGMA_ACCESS_TOKEN)",
    )
    p.add_argument(
        "--output-dir",
        default="figma_frames",
        help="Directory to save exported PNGs (default: figma_frames)",
    )
    p.add_argument(
        "--scale",
        type=float,
        default=1.0,
        help="Export scale factor — use 2 for retina (default: 1)",
    )
    p.add_argument(
        "--frame-filter",
        nargs="*",
        default=None,
        help="Only export frames whose names match (case-insensitive)",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    if not args.token:
        print("ERROR: Figma access token is required. Pass --token or set FIGMA_ACCESS_TOKEN.", file=sys.stderr)
        sys.exit(1)

    file_key = extract_file_key(args.file_key)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # 1. List frames
    print(f"Fetching file structure for {file_key} ...")
    frames = list_frames(file_key, args.token, frame_filter=args.frame_filter)

    if not frames:
        print("No frames found matching your criteria.", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(frames)} frame(s):")
    for f in frames:
        print(f"  - {f['name']}  (page: {f['page']}, id: {f['id']})")

    # 2. Request exports
    print(f"\nExporting at {args.scale}x scale ...")
    urls = export_frames(file_key, args.token, frames, scale=args.scale)

    # 3. Download images
    manifest: list[dict] = []
    for frame in frames:
        url = urls.get(frame["id"])
        if not url:
            print(f"  WARN: No export URL for '{frame['name']}' — skipping", file=sys.stderr)
            continue
        filename = f"{sanitize_filename(frame['name'])}.png"
        dest = output_dir / filename
        print(f"  Downloading {filename} ...")
        download_image(url, dest)
        manifest.append({
            "name": frame["name"],
            "file": filename,
            "page": frame["page"],
            "id": frame["id"],
        })

    # 4. Write manifest
    manifest_path = output_dir / "manifest.json"
    import json

    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone. {len(manifest)} frame(s) saved to {output_dir}/")
    print(f"Manifest written to {manifest_path}")


if __name__ == "__main__":
    main()
