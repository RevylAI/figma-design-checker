#!/usr/bin/env python3
"""
Compare Figma design frames against real app screenshots and generate a
design-compliance report.

Handles resolution mismatches by resizing the Figma frame to match the
device screenshot. Produces per-screen fidelity scores, an overall
compliance grade, overlay diff images, and both HTML and Markdown reports.

Usage:
    python scripts/diff.py \
        --figma-dir figma_frames \
        --app-dir app_screenshots \
        --output-dir report \
        --threshold 0.05
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


@dataclass
class Report:
    screens: list[ScreenResult] = field(default_factory=list)
    overall_fidelity: float = 0.0
    overall_grade: str = "F"
    timestamp: str = ""
    threshold: float = 0.05


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
# Diff engine
# ---------------------------------------------------------------------------


def compute_diff(
    figma_path: Path,
    app_path: Path,
    output_path: Path,
    threshold: float = 0.05,
) -> tuple[float, Path]:
    """
    Pixel-diff two images. Returns (fidelity_percentage, diff_image_path).

    The Figma frame is resized to match the app screenshot dimensions so
    that resolution differences don't skew the comparison.

    Threshold controls per-channel tolerance: pixel channels differing by
    less than ``threshold * 255`` are considered matching.
    """
    figma_img = Image.open(figma_path).convert("RGB")
    app_img = Image.open(app_path).convert("RGB")

    # Resize Figma frame to match device screenshot
    if figma_img.size != app_img.size:
        figma_img = figma_img.resize(app_img.size, Image.LANCZOS)

    width, height = app_img.size
    total_pixels = width * height

    # Use numpy-style operations via raw bytes for performance
    import struct

    figma_bytes = figma_img.tobytes()
    app_bytes = app_img.tobytes()

    channel_threshold = int(threshold * 255)
    matching_pixels = 0

    diff_data = bytearray(width * height * 4)  # RGBA

    for i in range(total_pixels):
        offset_rgb = i * 3
        offset_rgba = i * 4

        fr, fg, fb = figma_bytes[offset_rgb], figma_bytes[offset_rgb + 1], figma_bytes[offset_rgb + 2]
        ar, ag, ab = app_bytes[offset_rgb], app_bytes[offset_rgb + 1], app_bytes[offset_rgb + 2]

        dr = abs(fr - ar)
        dg = abs(fg - ag)
        db = abs(fb - ab)

        if dr <= channel_threshold and dg <= channel_threshold and db <= channel_threshold:
            matching_pixels += 1
            diff_data[offset_rgba] = 0
            diff_data[offset_rgba + 1] = 200
            diff_data[offset_rgba + 2] = 0
            diff_data[offset_rgba + 3] = 40
        else:
            max_diff = max(dr, dg, db)
            alpha = min(int(max_diff * 1.5), 220)
            diff_data[offset_rgba] = 220
            diff_data[offset_rgba + 1] = 40
            diff_data[offset_rgba + 2] = 40
            diff_data[offset_rgba + 3] = alpha

    diff_img = Image.frombytes("RGBA", (width, height), bytes(diff_data))

    fidelity = (matching_pixels / total_pixels) * 100.0 if total_pixels > 0 else 0.0

    # Composite the diff overlay onto the app screenshot for context
    overlay = app_img.copy().convert("RGBA")
    overlay = Image.alpha_composite(overlay, diff_img)
    overlay.save(output_path, "PNG")

    return fidelity, output_path


def compute_structural_similarity(figma_path: Path, app_path: Path) -> float:
    """
    Approximate structural similarity using a blurred-difference approach.

    This is a lightweight proxy for SSIM that does not require scikit-image.
    It blurs both images to suppress noise, then measures the mean absolute
    difference of the blurred versions.
    """
    figma_img = Image.open(figma_path).convert("L")  # grayscale
    app_img = Image.open(app_path).convert("L")

    if figma_img.size != app_img.size:
        figma_img = figma_img.resize(app_img.size, Image.LANCZOS)

    # Apply Gaussian-like blur to focus on structure, not pixel noise
    radius = 3
    figma_blur = figma_img.filter(ImageFilter.GaussianBlur(radius=radius))
    app_blur = app_img.filter(ImageFilter.GaussianBlur(radius=radius))

    w, h = figma_blur.size

    # Use raw bytes for fast iteration
    fb_bytes = figma_blur.tobytes()
    ab_bytes = app_blur.tobytes()

    total_diff = sum(abs(fb_bytes[i] - ab_bytes[i]) for i in range(len(fb_bytes)))

    max_possible = w * h * 255
    similarity = (1.0 - total_diff / max_possible) * 100.0 if max_possible > 0 else 0.0
    return similarity


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

        screen_rows += f"""
            <tr class="screen-row">
              <td class="screen-name">
                <div class="name">{s.name}</div>
                <div class="meta">Figma: {s.figma_size[0]}x{s.figma_size[1]} | App: {s.app_size[0]}x{s.app_size[1]}</div>
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
      <div class="summary">{len(report.screens)} screen(s) compared | threshold: {report.threshold * 100:.0f}% per channel</div>
    </div>
  </div>

  <div class="legend">
    <div class="legend-item"><span class="legend-swatch" style="background: rgba(0,200,0,0.4)"></span> Matches design</div>
    <div class="legend-item"><span class="legend-swatch" style="background: rgba(220,40,40,0.8)"></span> Diverges from design</div>
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

    overall_emoji = {"A": "+", "B": "+", "C": "~", "D": "-", "F": "-"}.get(report.overall_grade, "")
    lines = [
        f"## Design Compliance Report",
        "",
        f"**Overall Fidelity: {report.overall_fidelity:.1f}% (Grade {report.overall_grade})**",
        "",
        f"Threshold: {report.threshold * 100:.0f}% per channel | {len(report.screens)} screen(s) compared",
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
    """
    Match Figma frames to app screenshots by filename.

    Both directories are expected to contain PNGs with sanitized filenames
    (produced by fetch_figma.py and capture.py respectively).
    """
    figma_files = {p.stem: p for p in figma_dir.glob("*.png")}
    app_files = {p.stem: p for p in app_dir.glob("*.png")}

    matched: list[tuple[str, Path, Path]] = []
    unmatched_figma: list[str] = []
    unmatched_app: list[str] = []

    for name, fpath in sorted(figma_files.items()):
        if name in app_files:
            # Reconstruct a display name from the slug
            display_name = name.replace("_", " ").title()
            matched.append((display_name, fpath, app_files[name]))
        else:
            unmatched_figma.append(name)

    for name in sorted(app_files):
        if name not in figma_files:
            unmatched_app.append(name)

    if unmatched_figma:
        print(f"WARN: {len(unmatched_figma)} Figma frame(s) with no matching app screenshot:", file=sys.stderr)
        for n in unmatched_figma:
            print(f"  - {n}", file=sys.stderr)

    if unmatched_app:
        print(f"WARN: {len(unmatched_app)} app screenshot(s) with no matching Figma frame:", file=sys.stderr)
        for n in unmatched_app:
            print(f"  - {n}", file=sys.stderr)

    return matched


def run_diff(
    figma_dir: Path,
    app_dir: Path,
    output_dir: Path,
    threshold: float = 0.05,
) -> Report:
    """Compare all matched screens and build a Report."""
    output_dir.mkdir(parents=True, exist_ok=True)
    diffs_dir = output_dir / "diffs"
    diffs_dir.mkdir(exist_ok=True)

    matched = match_screens(figma_dir, app_dir)
    if not matched:
        print("ERROR: No matching Figma/app screenshot pairs found.", file=sys.stderr)
        sys.exit(1)

    print(f"Comparing {len(matched)} screen(s) ...\n")

    report = Report(
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        threshold=threshold,
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

            fidelity, _ = compute_diff(figma_path, app_path, diff_path, threshold)
            structural = compute_structural_similarity(figma_path, app_path)

            # Blend pixel fidelity (70%) with structural similarity (30%)
            blended = fidelity * 0.7 + structural * 0.3

            result.fidelity = blended
            result.grade = compute_grade(blended)
            result.diff_path = diff_path

            print(f"    Pixel: {fidelity:.1f}% | Structural: {structural:.1f}% | Blended: {blended:.1f}% [{result.grade}]")

        except Exception as exc:
            result.error = str(exc)
            print(f"    ERROR: {exc}", file=sys.stderr)

        report.screens.append(result)

    # Overall score — average of successful screens
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
        default=0.05,
        help="Per-channel tolerance (0-1). Pixels within this tolerance are considered matching. (default: 0.05)",
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

    report = run_diff(figma_dir, app_dir, output_dir, threshold=args.threshold)

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
