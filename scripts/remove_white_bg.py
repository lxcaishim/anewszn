#!/usr/bin/env python3
"""Remove solid/near-white background by flood-fill from image edges (PIL)."""
from __future__ import annotations

import sys
from collections import deque

from PIL import Image


def passable(r: int, g: int, b: int) -> bool:
    # Near-white, low saturation (keeps white body inside dark outline from leaking to edge)
    if r < 228 or g < 228 or b < 228:
        return False
    if r + g + b < 700:
        return False
    return (max(r, g, b) - min(r, g, b)) <= 45


def remove_edge_white_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()
    if pixels is None:
        raise RuntimeError("Could not load pixels")

    visited = bytearray(w * h)

    def idx(x: int, y: int) -> int:
        return y * w + x

    q: deque[tuple[int, int]] = deque()

    def try_add(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h:
            return
        i = idx(x, y)
        if visited[i]:
            return
        r, g, b, _a = pixels[x, y]
        if passable(r, g, b):
            visited[i] = 1
            q.append((x, y))

    for x in range(w):
        try_add(x, 0)
        try_add(x, h - 1)
    for y in range(h):
        try_add(0, y)
        try_add(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                j = idx(nx, ny)
                if not visited[j]:
                    r2, g2, b2, _a2 = pixels[nx, ny]
                    if passable(r2, g2, b2):
                        visited[j] = 1
                        q.append((nx, ny))

    return img


def main() -> None:
    inp = sys.argv[1]
    out = sys.argv[2]
    img = Image.open(inp)
    img = remove_edge_white_bg(img)
    img.save(out, "PNG", optimize=True)


if __name__ == "__main__":
    main()
