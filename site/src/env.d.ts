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
