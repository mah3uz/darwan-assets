import { createReadStream, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Markdown from "unplugin-vue-markdown/vite";
import anchor from "markdown-it-anchor";

const animations = resolve(__dirname, "../assets");
const darwanDocs = resolve(__dirname, "../../darwan/docs");

// Links written for GitHub (README sections, sibling docs) point at the matching page here.
const links: Record<string, string> = {
  "../README.md#lockscreen-keybind": "/docs/usage#lockscreen-keybind",
  "./lock-recovery.md": "/docs/lock-recovery",
  "./theme-contract.md": "/docs/theme-contract",
};

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
  server: { fs: { allow: [__dirname, darwanDocs] } },
  // "assets/" is taken by the animations.
  build: { assetsDir: "_app" },
});
