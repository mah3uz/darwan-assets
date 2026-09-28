import { createReadStream, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Markdown from "unplugin-vue-markdown/vite";
import anchor from "markdown-it-anchor";
import { fromHighlighter } from "@shikijs/markdown-exit/core";
import { createHighlighter } from "shiki";

const animations = resolve(import.meta.dirname, "../assets");
const darwanDocs = resolve(import.meta.dirname, "../../darwan/docs");

// Links written for GitHub (README sections, sibling docs) point at the matching page here.
const links: Record<string, string> = {
  "../README.md#lockscreen-keybind": "/docs/usage#lockscreen-keybind",
  "./lock-recovery.md": "/docs/lock-recovery",
  "./theme-contract.md": "/docs/theme-contract",
};

// Highlighted at build time, so the page ships coloured HTML and no highlighter. Every docs code block uses one of these.
const highlighter = await createHighlighter({
  themes: ["tokyo-night", "github-light"],
  langs: ["sh", "toml", "ini", "qml", "lua", "json"],
});

// Each code block gets a copy button; Docs.vue handles the click.
const copyButton = `<button type="button" class="code-copy" aria-label="Copy code"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg><span>Copy</span></button>`;

// The animations stay in ../assets; the build copies them (scripts/media.ts), dev serves them from there.
function serveAnimations(): Plugin {
  return {
    name: "serve-animations",
    configureServer(server) {
      server.middlewares.use("/assets", (req, res, next) => {
        const file = join(animations, decodeURIComponent((req.url ?? "").split("?")[0]));
        if (!file.startsWith(animations) || !existsSync(file)) return next();
        res.setHeader("Content-Type", "image/webp");
        createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/], template: { transformAssetUrls: { includeAbsolute: false } } }),
    Markdown({
      wrapperClasses: "prose",
      markdownItSetup(md) {
        md.use(anchor);
        // Both themes' colours are kept as CSS variables; style.css picks one to match the site's light or dark mode.
        md.use(fromHighlighter(highlighter, { themes: { dark: "tokyo-night", light: "github-light" }, defaultColor: false }));
        const fence = md.renderer.rules.fence!;
        md.renderer.rules.fence = (...args) => `<div class="code-block">${fence(...args)}${copyButton}</div>`;
        const render = md.renderer.rules.link_open ?? ((t, i, o, _e, s) => s.renderToken(t, i, o));
        md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
          const href = tokens[i].attrGet("href") ?? "";
          if (links[href]) tokens[i].attrSet("href", links[href]);
          else if (/^https?:/.test(href)) tokens[i].attrSet("rel", "noopener");
          return render(tokens, i, opts, env, self);
        };
      },
    }),
    tailwindcss(),
    serveAnimations(),
  ],
  resolve: { alias: { "@darwan-docs": darwanDocs } },
  server: { fs: { allow: [import.meta.dirname, darwanDocs] } },
  // "assets/" is taken by the animations.
  build: { assetsDir: "_app" },
});
