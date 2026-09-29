set shell := ["bash", "-euo", "pipefail", "-c"]

site := justfile_directory() / "site"

# List the recipes
default:
    @just --list --unsorted

# Run darwan.dev locally with hot reload
dev:
    cd {{site}} && bun install && bun run dev

# Build darwan.dev into site/dist
build:
    cd {{site}} && bun install --frozen-lockfile && bun run build

# Serve the built site through Cloudflare's local runtime
preview: build
    cd {{site}} && bunx wrangler dev

# Build and publish darwan.dev (run `bunx wrangler login` in site/ once first)
deploy: build
    cd {{site}} && bunx wrangler deploy

# Render site/public/og.png, the social preview image, from tools/banner.html
og:
    google-chrome-stable --headless=new --hide-scrollbars --allow-file-access-from-files \
      --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=8000 \
      --screenshot={{site}}/public/og.png "file://{{justfile_directory()}}/tools/banner.html?og"
    pngquant --quality 80-95 --speed 1 --force --ext .png {{site}}/public/og.png

# Make every theme's hover loop (darwan/themes/<id>/preview.webp) from its demo; name themes to make only those
loops *themes:
    python3 tools/loops.py {{themes}}

# The GUI demo's data (site/public/demo/data.json), made by darwan-gui's own model code from the checkout beside this
play-data:
    cd tools/play && cargo build --release -q
    mkdir -p site/public/demo
    tools/play/target/release/darwan-play-data > site/public/demo/data.json
