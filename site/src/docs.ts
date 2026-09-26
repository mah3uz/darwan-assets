import type { Component } from "vue";

type Doc = { slug: string; title: string; page: () => Promise<Component> };

export const docs: Doc[] = [
  { slug: "install", title: "Install", page: () => import("./docs/install.md") },
  { slug: "quick-start", title: "Quick start", page: () => import("./docs/quick-start.md") },
  { slug: "usage", title: "Usage", page: () => import("./docs/usage.md") },
  { slug: "configuration", title: "Configuration", page: () => import("./docs/configuration.md") },
  { slug: "fonts", title: "Fonts", page: () => import("./docs/fonts.md") },
  { slug: "preview", title: "Preview and testing", page: () => import("./docs/preview.md") },
  { slug: "login-screen", title: "Login screen", page: () => import("./docs/login-screen.md") },
  { slug: "faq", title: "FAQ", page: () => import("./docs/faq.md") },
  { slug: "lock-recovery", title: "Lock recovery", page: () => import("@darwan-docs/lock-recovery.md") },
  { slug: "theme-contract", title: "Theme contract", page: () => import("@darwan-docs/theme-contract.md") },
];
