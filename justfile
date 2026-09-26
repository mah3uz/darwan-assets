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
