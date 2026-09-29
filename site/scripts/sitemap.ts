import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { docs } from "../src/docs";
import themes from "../src/data/themes.json";

const site = "https://darwan.dev";
const paths = ["/", "/themes", ...themes.map((t) => `/themes/${t.id}`), ...docs.map((d) => `/docs/${d.slug}`), "/releases", "/credits"];

const urls = paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join("\n");
writeFileSync(
  join(import.meta.dir, "..", "dist", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap: ${paths.length} pages`);
