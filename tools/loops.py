#!/usr/bin/env python3
"""Makes each theme's hover loop, darwan/themes/<id>/preview.webp, from its demo in assets/: 640x360, every other frame."""
import concurrent.futures
import pathlib
import sys

from PIL import Image, ImageSequence

TOOLS = pathlib.Path(__file__).resolve().parent
ASSETS = TOOLS.parent / "assets"
DARWAN = TOOLS.parent.parent / "darwan"


def loop(theme):
    src = ASSETS / (theme.replace("/", "_") + ".webp")
    out = DARWAN / "themes" / theme / "preview.webp"
    if not src.exists():
        return f"{theme}: no demo in assets/"
    frames = [f.convert("RGB").resize((640, 360), Image.LANCZOS)
              for i, f in enumerate(ImageSequence.Iterator(Image.open(src))) if i % 2 == 0]
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=80, loop=0, quality=60, method=6)
    return f"{theme}: {out.stat().st_size // 1024} KB"


def main():
    themes = sys.argv[1:] or sorted(str(p.parent.relative_to(DARWAN / "themes")) for p in (DARWAN / "themes").rglob("Main.qml"))
    with concurrent.futures.ProcessPoolExecutor() as pool:
        for line in pool.map(loop, themes):
            print(line, flush=True)
    total = sum(p.stat().st_size for p in (DARWAN / "themes").rglob("preview.webp"))
    print(f"{total / 1e6:.1f} MB in all")


if __name__ == "__main__":
    main()
