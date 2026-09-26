/// <reference types="vite/client" />
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
