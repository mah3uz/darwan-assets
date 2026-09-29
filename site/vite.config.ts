import { createReadStream, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Markdown from "unplugin-vue-markdown/vite";
import anchor from "markdown-it-anchor";
import { fromHighlighter } from "@shikijs/markdown-exit/core";
import { createHighlighter } from "shiki";
import { createMarkdownExit } from "markdown-exit";

const animations = resolve(import.meta.dirname, "../assets");
const darwanDocs = resolve(import.meta.dirname, "../../darwan/docs");
const changelog = resolve(import.meta.dirname, "../../darwan/CHANGELOG.md");

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

// darwan's CHANGELOG.md, one entry per release, as `virtual:releases` for the Releases page. "Unreleased" stays out.
function releases(): Plugin {
  const id = "virtual:releases";
  const md = createMarkdownExit();
  const heading = /^(\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) ([+-]\d{2}:\d{2})$/;
  function read() {
    const entries = readFileSync(changelog, "utf8")
      .split(/^## /m)
      .slice(1)
      .map((part) => {
        const end = part.indexOf("\n");
        return { title: part.slice(0, end).trim(), text: part.slice(end + 1).trim() };
      })
      .filter((e) => e.title !== "Unreleased")
      .map((e) => {
        const m = heading.exec(e.title);
        if (!m) throw new Error(`CHANGELOG.md: "## ${e.title}" is not "## <version> - <YYYY-MM-DD HH:MM +HH:MM>"`);
        // What people must do after upgrading gets its own box, so it's split from the rest.
        const at = e.text.search(/^### Upgrading from/m);
        const next = at < 0 ? -1 : e.text.slice(at + 1).search(/^### /m);
        const upgrade = at < 0 ? "" : next < 0 ? e.text.slice(at) : e.text.slice(at, at + 1 + next);
        const notes = at < 0 ? e.text : e.text.replace(upgrade, "");
        const [upgradeTitle, ...upgradeText] = upgrade.split("\n");
        return {
          version: m[1],
          published: `${m[2]}T${m[3]}:00${m[4]}`,
          notes: md.render(notes.trim()),
          upgrade: upgrade ? { title: upgradeTitle.replace(/^### /, ""), html: md.render(upgradeText.join("\n").trim()) } : null,
        };
      });
    return entries.map((e, i) => ({ ...e, previous: entries[i + 1]?.version ?? null }));
  }
  return {
    name: "releases",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load(source) {
      if (source !== `\0${id}`) return;
      this.addWatchFile(changelog);
      return `export default ${JSON.stringify(read())};`;
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
    releases(),
  ],
  resolve: { alias: { "@darwan-docs": darwanDocs } },
  server: { fs: { allow: [import.meta.dirname, darwanDocs] } },
  // "assets/" is taken by the animations.
  build: { assetsDir: "_app" },
});
