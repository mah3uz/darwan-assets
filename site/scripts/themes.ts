import { parse } from "smol-toml";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
  color?: { key: string; label: string }[];
  supports?: {
    clock_format?: boolean;
    date_format?: boolean;
    background?: boolean;
    colors?: boolean;
    fonts?: string[];
    motion?: boolean;
    variants?: string[];
    default_variant?: string;
  };
};

// Rebuilt from scratch, so a removed theme leaves no still behind.
const stills = join(site, "public", "stills");
rmSync(stills, { recursive: true, force: true });
mkdirSync(stills, { recursive: true });
const animations = join(site, "..", "assets");

// A theme's other look: public/variants/<slug>-<variant>.webp (a still made with `darwan check --shots`),
// and assets/<slug>-<variant>.webp when it also has an animation.
function variantMedia(slug: string, variant: string) {
  const still = `/variants/${slug}-${variant}.webp`;
  const animation = `/assets/${slug}-${variant}.webp`;
  return {
    name: variant,
    still: existsSync(join(site, "public", still)) ? still : null,
    animation: existsSync(join(animations, `${slug}-${variant}.webp`)) ? animation : null,
  };
}

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
    customise: {
      background: t.supports?.background ?? false,
      colors: t.supports?.colors ?? false,
      roles: (t.color ?? []).map((c) => c.label),
      fonts: t.supports?.fonts ?? [],
      motion: t.supports?.motion ?? false,
    },
    defaultVariant: t.supports?.default_variant ?? null,
    variants: (t.supports?.variants ?? [])
      .filter((v) => v !== t.supports?.default_variant)
      .map((v) => variantMedia(slug, v)),
    still: `/stills/${slug}.webp`,
    animation: `/assets/${slug}.webp`,
    // The theme as the screensaver (`darwan preview <id> --saver --shot`), in public/ambient.
    ambient: existsSync(join(site, "public", "ambient", `${slug}.webp`)) ? `/ambient/${slug}.webp` : null,
  });
}

const order = (f: string | null) => (f === "Clockwork" ? 0 : f === "Pixel" ? 1 : 2);
themes.sort((a, b) => order(a.family) - order(b.family) || a.name.localeCompare(b.name));

writeFileSync(join(site, "src", "data", "themes.json"), JSON.stringify(themes, null, 2) + "\n");
copyFileSync(join(darwan, "packaging", "arch", "darwan.svg"), join(site, "public", "darwan.svg"));
const icon = Bun.spawnSync([
  "magick", "-background", "#13141f", "-density", "300", join(darwan, "packaging", "arch", "darwan.svg"),
  "-flatten", "-resize", "180x180", join(site, "public", "apple-touch-icon.png"),
]);
if (icon.exitCode !== 0) {
  console.error(`magick failed for the touch icon: ${icon.stderr}`);
  process.exit(1);
}
console.log(`${themes.length} themes`);
