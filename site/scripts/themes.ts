import { parse } from "smol-toml";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { Glob } from "bun";

const site = join(import.meta.dir, "..");
const darwan = join(site, "..", "..", "darwan");
const themesDir = join(darwan, "themes");

if (!existsSync(themesDir)) {
  console.error(`No darwan checkout at ${darwan}; clone it next to darwan-assets.`);
  process.exit(1);
}

type Toml = {
  name: string;
  family?: string;
  author?: string;
  background?: string;
  font?: { family: string; license: string; url?: string }[];
  option?: { key: string; label: string; type: string; choices?: { value: string; label: string }[] }[];
  supports?: Record<string, boolean>;
};

const stills = join(site, "public", "stills");
mkdirSync(stills, { recursive: true });

const themes = [];
for (const file of new Glob("**/darwan.toml").scanSync(themesDir)) {
  const dir = dirname(join(themesDir, file));
  const id = relative(themesDir, dir);
  const slug = id.replace("/", "_");
  const t = parse(readFileSync(join(dir, "darwan.toml"), "utf8")) as Toml;
  const still = join(stills, `${slug}.webp`);
  const magick = Bun.spawnSync(["magick", join(dir, "preview.jpg"), "-resize", "640x360", "-quality", "80", still]);
  if (magick.exitCode !== 0) {
    console.error(`magick failed for ${id}: ${magick.stderr}`);
    process.exit(1);
  }
  themes.push({
    id,
    name: t.name,
    family: t.family ?? null,
    author: t.author ?? null,
    background: t.background ?? null,
    fonts: (t.font ?? []).map(({ family, license, url }) => ({ family, license, url: url ?? null })),
    options: (t.option ?? []).map(({ key, label, type, choices }) => ({
      key,
      label,
      type,
      choices: choices?.map((c) => c.label) ?? null,
    })),
    clock: t.supports?.clock_format ?? false,
    date: t.supports?.date_format ?? false,
    still: `/stills/${slug}.webp`,
    animation: `/assets/${slug}.webp`,
  });
}

const order = (f: string | null) => (f === "Clockwork" ? 0 : f === "Pixel" ? 1 : 2);
themes.sort((a, b) => order(a.family) - order(b.family) || a.name.localeCompare(b.name));

writeFileSync(join(site, "src", "data", "themes.json"), JSON.stringify(themes, null, 2) + "\n");
copyFileSync(join(darwan, "packaging", "arch", "darwan.svg"), join(site, "public", "darwan.svg"));
copyFileSync(join(site, "..", "banner.png"), join(site, "public", "banner.png"));
console.log(`${themes.length} themes`);
