#!/usr/bin/env python3
"""Records darwan unlock demos on a headless output, so real screens, pointer and keyboard stay untouched."""
import argparse
import concurrent.futures
import json
import pathlib
import shutil
import subprocess
import sys
import time

TOOLS = pathlib.Path(__file__).resolve().parent
ASSETS = TOOLS.parent
DARWAN = ASSETS.parent / "darwan"
OUTPUT = "darwan-test"
FPS = 25
SCRATCH = pathlib.Path("/dev/shm/darwan-demo")


def hypr(*args):
    return subprocess.run(["hyprctl", *args], capture_output=True, text=True, check=True).stdout


def output_workspace():
    for m in json.loads(hypr("monitors", "-j")):
        if m["name"] == OUTPUT:
            return m["activeWorkspace"]["id"]
    return None


def all_themes():
    return sorted(str(p.parent.relative_to(DARWAN / "themes")) for p in (DARWAN / "themes").rglob("Main.qml"))


def record(theme, log, clip):
    # Launching without the headless output would put the demo on a real screen.
    ws = output_workspace()
    if ws is None:
        sys.exit(f"no {OUTPUT} output; create it with: hyprctl output create headless {OUTPUT}")
    log.unlink(missing_ok=True)
    hypr("dispatch", f'hl.dsp.exec_cmd("{TOOLS}/demo.sh {theme} {log}", {{ workspace = "{ws} silent" }})')
    deadline = time.monotonic() + 30
    while "DEMO START" not in (log.read_text() if log.exists() else ""):
        if time.monotonic() > deadline:
            return "never started"
        time.sleep(0.02)
    enc = subprocess.Popen(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-vcodec", "ppm",
         "-framerate", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "8",
         "-pix_fmt", "yuv444p", str(clip)],
        stdin=subprocess.PIPE)
    t0, frames, late = time.monotonic(), 0, 0
    while True:
        due = t0 + frames / FPS
        now = time.monotonic()
        if due > now:
            time.sleep(due - now)
        elif now - due > 1 / FPS:
            late += 1
        enc.stdin.write(subprocess.run(["grim", "-o", OUTPUT, "-t", "ppm", "-"], capture_output=True, check=True).stdout)
        frames += 1
        text = log.read_text()
        if "DEMO END" in text:
            break
        if frames > FPS * 40:
            break
    enc.stdin.close()
    enc.wait()
    end = next((l.split("DEMO END", 1)[1].strip() for l in text.splitlines() if "DEMO END" in l), "timed out")
    return f"{frames} frames in {time.monotonic() - t0:.1f}s, {late} late, {end}"


def encode(clip, dst, quality):
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(clip), "-c:v", "libwebp_anim",
         "-q:v", str(quality), "-compression_level", "4", "-loop", "0", str(dst)],
        check=True)
    clip.unlink()
    return dst.stat().st_size


def main():
    ap = argparse.ArgumentParser(description="Record each theme's unlock demo as a 1080p, 25 fps animated WebP (default: every theme).")
    ap.add_argument("--quality", type=int, default=75)
    ap.add_argument("themes", nargs="*")
    args = ap.parse_args()
    themes = args.themes or all_themes()
    shutil.rmtree(SCRATCH, ignore_errors=True)
    SCRATCH.mkdir(parents=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        jobs = []
        for theme in themes:
            slug = theme.replace("/", "_")
            clip = SCRATCH / f"{slug}.mkv"
            result = record(theme, SCRATCH / f"{slug}.log", clip)
            print(f"{theme}: {result}", flush=True)
            if clip.exists():
                jobs.append((theme, pool.submit(encode, clip, ASSETS / f"{slug}.webp", args.quality)))
        for theme, job in jobs:
            print(f"{theme}: {job.result() / 1e6:.1f} MB", flush=True)
    shutil.rmtree(SCRATCH, ignore_errors=True)


if __name__ == "__main__":
    main()
