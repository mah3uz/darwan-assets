/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PLAUSIBLE_ENDPOINT?: string;
}
declare module "*.md" {
  import type { Component } from "vue";
  const component: Component;
  export default component;
}
declare module "*.vue" {
  import type { Component } from "vue";
  const component: Component;
  export default component;
}
declare module "virtual:releases" {
  interface Release {
    version: string;
    /** ISO 8601 with the offset it was released at. */
    published: string;
    /** HTML, rendered at build time. */
    notes: string;
    upgrade: { title: string; html: string } | null;
    previous: string | null;
  }
  const releases: Release[];
  export default releases;
}
