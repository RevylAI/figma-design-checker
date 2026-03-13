#!/usr/bin/env python3
"""
Compare Figma design frames against real app screenshots and generate a
design-compliance report.

Uses pixelmatch (anti-aliasing aware, perceptual YIQ color distance) when
available, with a Pillow fallback. Automatically detects and masks the
device status bar / notch region so clock, battery, and carrier UI don't
skew the comparison.

Handles resolution mismatches by resizing the Figma frame to match the
device screenshot. Produces per-screen fidelity scores, an overall
compliance grade, overlay diff images, and both HTML and Markdown reports.

Usage:
    python scripts/diff.py \
        --figma-dir figma_frames \
        --app-dir app_screenshots \
        --output-dir report \
        --threshold 0.1
"""

from __future__ import annotations

import argparse
import base64
import io
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

try:
    from pixelmatch import pixelmatch as _pixelmatch

    HAS_PIXELMATCH = True
except ImportError:
    HAS_PIXELMATCH = False

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GRADE_THRESHOLDS: list[tuple[str, float]] = [
    ("A", 95.0),
    ("B", 90.0),
    ("C", 80.0),
    ("D", 70.0),
]

GRADE_COLORS: dict[str, str] = {
    "A": "#22c55e",
    "B": "#84cc16",
    "C": "#eab308",
    "D": "#f97316",
    "F": "#ef4444",
}

# Base status bar height at 1x scale (logical pixels).
STATUS_BAR_HEIGHT_IOS = 54  # iPhone with Dynamic Island / notch
STATUS_BAR_HEIGHT_ANDROID = 24

# Reference height used to compute the scale factor.
REFERENCE_HEIGHT = 844  # iPhone 14 logical height


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass
class ScreenResult:
    name: str
    figma_path: Path
    app_path: Path
    diff_path: Path | None = None
    fidelity: float = 0.0
    grade: str = "F"
    figma_size: tuple[int, int] = (0, 0)
    app_size: tuple[int, int] = (0, 0)
    error: str | None = None
    notch_masked: bool = False


@dataclass
class Report:
    screens: list[ScreenResult] = field(default_factory=list)
    overall_fidelity: float = 0.0
    overall_grade: str = "F"
    timestamp: str = ""
    threshold: float = 0.1
    engine: str = ""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def sanitize_filename(name: str) -> str:
    name = name.strip().lower()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"[\s_-]+", "_", name)
    return name


def compute_grade(score: float) -> str:
    for letter, cutoff in GRADE_THRESHOLDS:
        if score >= cutoff:
            return letter
    return "F"


def image_to_data_uri(path: Path, max_width: int = 600) -> str:
    """Encode an image as a base64 data URI for embedding in HTML."""
    img = Image.open(path).convert("RGB")
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"


# ---------------------------------------------------------------------------
# Status bar / notch detection and masking
# ---------------------------------------------------------------------------


def _detect_has_status_bar(img: Image.Image) -> bool:
    """
    Heuristically detect whether an image has a device status bar.

    Figma frames typically don't have a status bar (no clock, battery, etc.)
    while real device screenshots always do. We detect this by examining the
    top strip of the image for typical status bar indicators:
    - Dark/light near-uniform bar at the top
    - Dynamic Island (dark rounded rect) centered at the top
    """
    w, h = img.size
    # Sample the top 5% of the image
    strip_h = max(int(h * 0.05), 20)
    top_strip = img.crop((0, 0, w, strip_h)).convert("RGB")

    pixels = list(top_strip.getdata())
    total = len(pixels)
    if total == 0:
        return False

    # Check if there's a dark cluster in the center-top (Dynamic Island / notch)
    center_x_start = w // 4
    center_x_end = 3 * w // 4
    dark_center_pixels = 0
    for y in range(min(strip_h, 15)):
        for x in range(center_x_start, center_x_end):
            idx = y * w + x
            if idx < total:
                r, g, b = pixels[idx]
                if r < 30 and g < 30 and b < 30:
                    dark_center_pixels += 1

    center_area = min(strip_h, 15) * (center_x_end - center_x_start)
    if center_area > 0 and dark_center_pixels / center_area > 0.15:
        return True  # Likely has a Dynamic Island or notch

    # Check if the top strip has time-like patterns (mix of dark text on light bg)
    avg_r = sum(p[0] for p in pixels) / total
    avg_g = sum(p[1] for p in pixels) / total
    avg_b = sum(p[2] for p in pixels) / total

    # Count pixels that significantly differ from the average (text/icons)
    varied = sum(
        1
        for p in pixels
        if abs(p[0] - avg_r) > 40 or abs(p[1] - avg_g) > 40 or abs(p[2] - avg_b) > 40
    )
    # If more than 5% of pixels in the top strip are "varied" (text/icons), it's a status bar
    if varied / total > 0.05:
        return True

    return False


def _mask_status_bar(img: Image.Image, platform: str = "ios") -> Image.Image:
    """Black out the status bar region so it doesn't affect the diff."""
    base_h = STATUS_BAR_HEIGHT_IOS if platform == "ios" else STATUS_BAR_HEIGHT_ANDROID
    # Scale proportionally based on image height
    scale = img.size[1] / REFERENCE_HEIGHT
    bar_h = max(int(base_h * scale), base_h)

    masked = img.copy()
    draw = ImageDraw.Draw(masked)
    draw.rectangle([0, 0, img.size[0], bar_h], fill=(0, 0, 0))
    return masked


# ---------------------------------------------------------------------------
# Diff engine — pixelmatch (primary) + Pillow fallback
# ---------------------------------------------------------------------------


def _compare_pixelmatch(
    img_a: Image.Image,
    img_b: Image.Image,
    threshold: float = 0.1,
) -> tuple[Image.Image, float, int]:
    """
    Compare two same-sized images using pixelmatch.

    Returns (overlay_image, diff_percentage, changed_pixel_count).
    """
    w, h = img_a.size
    a_rgba = img_a.convert("RGBA")
    b_rgba = img_b.convert("RGBA")

    img1_data = list(a_rgba.tobytes())
    img2_data = list(b_rgba.tobytes())
    diff_data = [0] * (w * h * 4)

    changed_pixels = _pixelmatch(
        img1_data,
        img2_data,
        w,
        h,
        output=diff_data,
        threshold=threshold,
        includeAA=False,  # skip anti-aliased pixels
        alpha=0.1,
        diff_color=(255, 0, 80),
        aa_color=(255, 190, 0),
    )

    total_pixels = w * h
    diff_pct = (changed_pixels / total_pixels) * 100.0 if total_pixels > 0 else 0.0

    # Build overlay: composite diff highlights onto the app screenshot
    diff_img = Image.frombytes("RGBA", (w, h), bytes(diff_data))
    overlay = b_rgba.copy()
    overlay = Image.alpha_composite(overlay, diff_img)

    return overlay, diff_pct, changed_pixels


def _compare_pillow_fallback(
    img_a: Image.Image,
    img_b: Image.Image,
) -> tuple[Image.Image, float, int]:
    """Fallback pixel differ using Pillow when pixelmatch is not installed."""
    from PIL import ImageChops

    a = img_a.convert("RGB")
    b = img_b.convert("RGB")

    raw_diff = ImageChops.difference(a, b)
    gray_diff = raw_diff.convert("L")

    # Threshold to ignore tiny sub-pixel differences
    threshold_value = 10
    binary_mask = gray_diff.point(lambda p: 255 if p > threshold_value else 0)
    # Expand change regions by 9px for visibility
    expanded = binary_mask.filter(ImageFilter.MaxFilter(size=9))
    expanded_mask = expanded.point(lambda p: 255 if p > 0 else 0)

    total_pixels = a.size[0] * a.size[1]
    hist = expanded_mask.histogram()
    changed_pixels = total_pixels - hist[0]
    diff_pct = (changed_pixels / total_pixels) * 100.0 if total_pixels > 0 else 0.0

    # Build overlay with red highlight on changed regions
    overlay = b.copy().convert("RGBA")
    highlight = Image.new("RGBA", overlay.size, (255, 0, 80, 0))
    alpha_mask = expanded_mask.point(lambda p: 160 if p > 0 else 0)
    highlight.putalpha(alpha_mask)
    overlay = Image.alpha_composite(overlay, highlight)

    return overlay, diff_pct, changed_pixels


def compute_diff(
    figma_img: Image.Image,
    app_img: Image.Image,
    output_path: Path,
    threshold: float = 0.1,
    platform: str = "ios",
    mask_statusbar: bool = True,
) -> tuple[float, Path, bool]:
    """
    Pixel-diff two images. Returns (fidelity_pct, diff_image_path, notch_masked).

    The Figma frame is resized to match the app screenshot dimensions.
    Status bar is masked on both images if the app screenshot has one
    but the Figma frame does not.
    """
    # Resize Figma frame to match device screenshot
    if figma_img.size != app_img.size:
        figma_img = figma_img.resize(app_img.size, Image.LANCZOS)

    # Detect and handle status bar asymmetry
    notch_masked = False
    if mask_statusbar:
        app_has_bar = _detect_has_status_bar(app_img)
        figma_has_bar = _detect_has_status_bar(figma_img)

        if app_has_bar:
            # Always mask the app's status bar region
            app_img = _mask_status_bar(app_img, platform)
            figma_img = _mask_status_bar(figma_img, platform)
            notch_masked = True

    # Use the best available diff algorithm
    if HAS_PIXELMATCH:
        overlay, diff_pct, changed_px = _compare_pixelmatch(figma_img, app_img, threshold)
    else:
        overlay, diff_pct, changed_px = _compare_pillow_fallback(figma_img, app_img)

    fidelity = 100.0 - diff_pct
    overlay.save(output_path, "PNG")

    return fidelity, output_path, notch_masked


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------


def generate_html_report(report: Report, output_dir: Path) -> Path:
    """Produce a self-contained HTML report with embedded images."""
    html_path = output_dir / "report.html"

    screen_rows = ""
    for s in report.screens:
        if s.error:
            screen_rows += f"""
            <tr class="screen-row error">
              <td class="screen-name">{s.name}</td>
              <td colspan="4" class="error-msg">Error: {s.error}</td>
            </tr>"""
            continue

        figma_uri = image_to_data_uri(s.figma_path)
        app_uri = image_to_data_uri(s.app_path)
        diff_uri = image_to_data_uri(s.diff_path) if s.diff_path else ""
        grade_color = GRADE_COLORS.get(s.grade, "#6b7280")
        notch_note = ' <span class="notch-badge">notch masked</span>' if s.notch_masked else ""

        screen_rows += f"""
            <tr class="screen-row">
              <td class="screen-name">
                <div class="name">{s.name}</div>
                <div class="meta">Figma: {s.figma_size[0]}x{s.figma_size[1]} | App: {s.app_size[0]}x{s.app_size[1]}{notch_note}</div>
              </td>
              <td class="img-cell"><img src="{figma_uri}" alt="Figma: {s.name}" /></td>
              <td class="img-cell"><img src="{app_uri}" alt="App: {s.name}" /></td>
              <td class="img-cell"><img src="{diff_uri}" alt="Diff: {s.name}" /></td>
              <td class="score-cell">
                <div class="score" style="color: {grade_color}">{s.fidelity:.1f}%</div>
                <div class="grade" style="background: {grade_color}">{s.grade}</div>
              </td>
            </tr>"""

    overall_color = GRADE_COLORS.get(report.overall_grade, "#6b7280")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Design Compliance Report</title>
<style>
  :root {{
    --bg: #0a0a0a;
    --surface: #141414;
    --border: #262626;
    --text: #f5f5f5;
    --text-muted: #a3a3a3;
    --accent: #9D61FF;
  }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.5;
    padding: 2rem;
  }}
  .container {{ max-width: 1400px; margin: 0 auto; }}

  /* Header */
  .header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }}
  .header h1 {{
    font-size: 1.75rem;
    font-weight: 300;
    letter-spacing: -0.02em;
  }}
  .header h1 span {{ color: var(--accent); font-weight: 500; }}
  .header .timestamp {{
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: 'SF Mono', 'Fira Code', monospace;
  }}

  /* Overall score */
  .overall {{
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 2rem;
    background: var(--surface);
    border: 1px solid var(--border);
  }}
  .overall-grade {{
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    border-radius: 0;
  }}
  .overall-details h2 {{
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }}
  .overall-details .pct {{
    font-size: 2rem;
    font-weight: 600;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-variant-numeric: tabular-nums;
  }}
  .overall-details .summary {{
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }}
  .engine-badge {{
    display: inline-block;
    margin-top: 0.5rem;
    padding: 2px 8px;
    font-size: 0.7rem;
    font-family: monospace;
    background: rgba(157, 97, 255, 0.15);
    color: var(--accent);
    border: 1px solid rgba(157, 97, 255, 0.3);
  }}

  /* Legend */
  .legend {{
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    font-size: 0.8rem;
    color: var(--text-muted);
  }}
  .legend-item {{
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }}
  .legend-swatch {{
    width: 14px;
    height: 14px;
    display: inline-block;
  }}

  /* Table */
  table {{
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
    border: 1px solid var(--border);
  }}
  thead th {{
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid var(--border);
  }}
  .screen-row td {{
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}
  .screen-name .name {{ font-weight: 500; margin-bottom: 0.25rem; }}
  .screen-name .meta {{ font-size: 0.7rem; color: var(--text-muted); font-family: monospace; }}
  .notch-badge {{
    display: inline-block;
    padding: 1px 5px;
    font-size: 0.6rem;
    background: rgba(157, 97, 255, 0.15);
    color: var(--accent);
    border: 1px solid rgba(157, 97, 255, 0.3);
    margin-left: 4px;
  }}
  .img-cell img {{
    max-width: 280px;
    max-height: 500px;
    border: 1px solid var(--border);
    display: block;
  }}
  .score-cell {{
    text-align: center;
    vertical-align: middle !important;
    min-width: 100px;
  }}
  .score-cell .score {{
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-variant-numeric: tabular-nums;
  }}
  .score-cell .grade {{
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
  }}
  .error-msg {{ color: #ef4444; font-style: italic; }}

  /* Footer */
  .footer {{
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-align: center;
  }}
  .footer a {{ color: var(--accent); text-decoration: none; }}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div>
      <h1><span>Design Compliance</span> Report</h1>
    </div>
    <div class="timestamp">{report.timestamp}</div>
  </div>

  <div class="overall">
    <div class="overall-grade" style="background: {overall_color}">{report.overall_grade}</div>
    <div class="overall-details">
      <h2>Overall Fidelity</h2>
      <div class="pct" style="color: {overall_color}">{report.overall_fidelity:.1f}%</div>
      <div class="summary">{len(report.screens)} screen(s) compared</div>
      <div class="engine-badge">{report.engine}</div>
    </div>
  </div>

  <div class="legend">
    <div class="legend-item"><span class="legend-swatch" style="background: rgba(255,0,80,0.7)"></span> Diverges from design</div>
    <div class="legend-item"><span class="legend-swatch" style="background: rgba(255,190,0,0.7)"></span> Anti-aliased (ignored)</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Screen</th>
        <th>Figma Frame</th>
        <th>App Screenshot</th>
        <th>Diff Overlay</th>
        <th>Fidelity</th>
      </tr>
    </thead>
    <tbody>
      {screen_rows}
    </tbody>
  </table>

  <div class="footer">
    Generated by <a href="https://github.com/RevylAI/figma-design-checker">figma-design-checker</a>
    powered by Revyl CLI &amp; Figma API
  </div>
</div>
</body>
</html>"""

    with open(html_path, "w") as f:
        f.write(html)

    return html_path


def generate_markdown_report(report: Report, output_dir: Path) -> Path:
    """Produce a Markdown report suitable for PR comments."""
    md_path = output_dir / "report.md"

    lines = [
        "## Design Compliance Report",
        "",
        f"**Overall Fidelity: {report.overall_fidelity:.1f}% (Grade {report.overall_grade})**",
        "",
        f"Engine: {report.engine} | {len(report.screens)} screen(s) compared",
        "",
        "| Screen | Fidelity | Grade | Status |",
        "|--------|----------|-------|--------|",
    ]

    for s in report.screens:
        if s.error:
            lines.append(f"| {s.name} | -- | -- | Error: {s.error} |")
        else:
            status = "Pass" if s.fidelity >= 90.0 else "Needs review"
            lines.append(f"| {s.name} | {s.fidelity:.1f}% | {s.grade} | {status} |")

    lines += [
        "",
        "### Grade Scale",
        "",
        "| Grade | Range |",
        "|-------|-------|",
        "| A | 95%+ |",
        "| B | 90 - 95% |",
        "| C | 80 - 90% |",
        "| D | 70 - 80% |",
        "| F | < 70% |",
        "",
        f"*Generated on {report.timestamp}*",
    ]

    with open(md_path, "w") as f:
        f.write("\n".join(lines) + "\n")

    return md_path


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------


def match_screens(figma_dir: Path, app_dir: Path) -> list[tuple[str, Path, Path]]:
    """Match Figma frames to app screenshots by filename."""
    figma_files = {p.stem: p for p in figma_dir.glob("*.png")}
    app_files = {p.stem: p for p in app_dir.glob("*.png")}

    matched: list[tuple[str, Path, Path]] = []
    unmatched_figma: list[str] = []
    unmatched_app: list[str] = []

    for name, fpath in sorted(figma_files.items()):
        if name in app_files:
            display_name = name.replace("_", " ").title()
            matched.append((display_name, fpath, app_files[name]))
        else:
            unmatched_figma.append(name)

    for name in sorted(app_files):
        if name not in figma_files:
            unmatched_app.append(name)

    if unmatched_figma:
        print(
            f"WARN: {len(unmatched_figma)} Figma frame(s) with no matching app screenshot:",
            file=sys.stderr,
        )
        for n in unmatched_figma:
            print(f"  - {n}", file=sys.stderr)

    if unmatched_app:
        print(
            f"WARN: {len(unmatched_app)} app screenshot(s) with no matching Figma frame:",
            file=sys.stderr,
        )
        for n in unmatched_app:
            print(f"  - {n}", file=sys.stderr)

    return matched


def run_diff(
    figma_dir: Path,
    app_dir: Path,
    output_dir: Path,
    threshold: float = 0.1,
    platform: str = "ios",
    mask_statusbar: bool = True,
) -> Report:
    """Compare all matched screens and build a Report."""
    output_dir.mkdir(parents=True, exist_ok=True)
    diffs_dir = output_dir / "diffs"
    diffs_dir.mkdir(exist_ok=True)

    matched = match_screens(figma_dir, app_dir)
    if not matched:
        print("ERROR: No matching Figma/app screenshot pairs found.", file=sys.stderr)
        sys.exit(1)

    engine = "pixelmatch (anti-aliasing aware, YIQ)" if HAS_PIXELMATCH else "pillow (basic)"
    masking = f"status bar masked ({platform})" if mask_statusbar else "no masking"
    print(f"Engine:  {engine}")
    print(f"Masking: {masking}")
    print(f"\nComparing {len(matched)} screen(s) ...\n")

    report = Report(
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        threshold=threshold,
        engine=engine,
    )

    for display_name, figma_path, app_path in matched:
        print(f"  {display_name}")
        result = ScreenResult(
            name=display_name,
            figma_path=figma_path,
            app_path=app_path,
        )

        try:
            figma_img = Image.open(figma_path)
            app_img = Image.open(app_path)
            result.figma_size = figma_img.size
            result.app_size = app_img.size

            diff_filename = f"{sanitize_filename(display_name)}_diff.png"
            diff_path = diffs_dir / diff_filename

            fidelity, _, notch_masked = compute_diff(
                figma_img,
                app_img,
                diff_path,
                threshold=threshold,
                platform=platform,
                mask_statusbar=mask_statusbar,
            )

            result.fidelity = fidelity
            result.grade = compute_grade(fidelity)
            result.diff_path = diff_path
            result.notch_masked = notch_masked

            mask_label = " [notch masked]" if notch_masked else ""
            print(f"    Fidelity: {fidelity:.1f}% [{result.grade}]{mask_label}")

        except Exception as exc:
            result.error = str(exc)
            print(f"    ERROR: {exc}", file=sys.stderr)

        report.screens.append(result)

    # Overall score
    valid_scores = [s.fidelity for s in report.screens if s.error is None]
    if valid_scores:
        report.overall_fidelity = sum(valid_scores) / len(valid_scores)
    report.overall_grade = compute_grade(report.overall_fidelity)

    return report


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Pixel-diff Figma frames against app screenshots and generate a compliance report.",
    )
    p.add_argument("--figma-dir", required=True, help="Directory containing exported Figma PNGs")
    p.add_argument("--app-dir", required=True, help="Directory containing app screenshots")
    p.add_argument("--output-dir", default="report", help="Directory for report output (default: report)")
    p.add_argument(
        "--threshold",
        type=float,
        default=0.1,
        help="Pixelmatch threshold (0-1). Controls color distance sensitivity. (default: 0.1)",
    )
    p.add_argument(
        "--platform",
        choices=["ios", "android"],
        default="ios",
        help="Platform (controls status bar mask height). Default: ios.",
    )
    p.add_argument(
        "--no-mask-statusbar",
        action="store_true",
        help="Disable status bar / notch masking.",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    figma_dir = Path(args.figma_dir)
    app_dir = Path(args.app_dir)
    output_dir = Path(args.output_dir)

    if not figma_dir.is_dir():
        print(f"ERROR: Figma directory not found: {figma_dir}", file=sys.stderr)
        sys.exit(1)
    if not app_dir.is_dir():
        print(f"ERROR: App screenshots directory not found: {app_dir}", file=sys.stderr)
        sys.exit(1)

    report = run_diff(
        figma_dir,
        app_dir,
        output_dir,
        threshold=args.threshold,
        platform=args.platform,
        mask_statusbar=not args.no_mask_statusbar,
    )

    print(f"\n{'='*60}")
    print(f"  Overall Fidelity:  {report.overall_fidelity:.1f}%")
    print(f"  Grade:             {report.overall_grade}")
    print(f"{'='*60}\n")

    html_path = generate_html_report(report, output_dir)
    md_path = generate_markdown_report(report, output_dir)

    print(f"HTML report:     {html_path}")
    print(f"Markdown report: {md_path}")
    print(f"Diff images:     {output_dir / 'diffs'}/")


if __name__ == "__main__":
    main()
