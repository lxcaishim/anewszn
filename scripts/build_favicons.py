#!/usr/bin/env python3
"""Flatten RGBA favicon onto white, then export tab/home-screen sizes.

remove.bg-style cutouts often drop the white fill inside line art; at 16–32px only
dark strokes remain on a transparent tab background, so the icon reads as a black smudge.
Compositing on white restores the intended look at small sizes.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def flatten_on_white(rgba: Image.Image) -> Image.Image:
    rgba = rgba.convert("RGBA")
    base = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    flat = Image.alpha_composite(base, rgba)
    return flat.convert("RGB")


def main() -> None:
    src_path = ASSETS / "favicon-source.png"
    if not src_path.exists():
        print("Missing", src_path, file=sys.stderr)
        sys.exit(1)

    src = Image.open(src_path)
    flat = flatten_on_white(src)

    sizes = [
        (32, "favicon-32.png"),
        (16, "favicon-16.png"),
        (180, "apple-touch-icon.png"),
    ]
    resample = Image.Resampling.LANCZOS
    for dim, name in sizes:
        out = flat.resize((dim, dim), resample)
        dest = ASSETS / name
        out.save(dest, "PNG", optimize=True)
        print("Wrote", dest.relative_to(ROOT))


if __name__ == "__main__":
    main()
