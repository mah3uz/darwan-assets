import { cpSync } from "node:fs";
import { join } from "node:path";

const site = join(import.meta.dir, "..");
cpSync(join(site, "..", "assets"), join(site, "dist", "assets"), { recursive: true });
