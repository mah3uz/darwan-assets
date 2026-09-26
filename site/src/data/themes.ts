import list from "./themes.json";

export type Theme = (typeof list)[number];
export const themes: Theme[] = list;
export const families = ["Clockwork", "Pixel", "Other"] as const;
export const familyOf = (t: Theme) => t.family ?? "Other";
