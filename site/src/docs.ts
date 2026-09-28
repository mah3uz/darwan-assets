import type { Component } from "vue";

type Doc = { slug: string; title: string; description: string; page: () => Promise<Component> };

export const docs: Doc[] = [
  { slug: "install", title: "Install", description: "Install Darwan from the AUR with paru, yay or makepkg: the packages, their dependencies, what gets installed and how to uninstall.", page: () => import("./docs/install.md") },
  { slug: "quick-start", title: "Quick start", description: "From a fresh install to a themed lockscreen and login screen in seven steps: check, browse, preview, lock, apply to SDDM, make it yours, add fonts.", page: () => import("./docs/quick-start.md") },
  { slug: "usage", title: "Usage", description: "Every Darwan command, the TUI's keys, the GUI's layout and saving, and how to bind darwan lock to a key in Hyprland or hypridle.", page: () => import("./docs/usage.md") },
  { slug: "shells", title: "Desktop shells", description: "Lock with Darwan under DankMaterialShell, Noctalia, Caelestia, illogical-impulse or Omarchy: route the keybind, idle and sleep to darwan lock, and use SDDM for the login screen.", page: () => import("./docs/shells.md") },
  { slug: "configuration", title: "Configuration", description: "Darwan's config.toml: the lock and SDDM themes, the global clock and date settings, each theme's own options, and where customisations go.", page: () => import("./docs/configuration.md") },
  { slug: "customise", title: "Customise", description: "Make a theme yours: your own image, video or desktop wallpaper as the background, colours typed or generated Material You-style, fonts, light and dark looks, and animation speed.", page: () => import("./docs/customise.md") },
  { slug: "fonts", title: "Fonts", description: "The commercial fonts some themes use, where to get them, and how to import them with darwan font import.", page: () => import("./docs/fonts.md") },
  { slug: "preview", title: "Preview and testing", description: "Try a theme without locking your session: live preview, full-screen preview, SDDM test mode and headless checks.", page: () => import("./docs/preview.md") },
  { slug: "login-screen", title: "Login screen", description: "Put a Darwan theme on the SDDM login screen, what the helper writes as root, and how to undo it.", page: () => import("./docs/login-screen.md") },
  { slug: "faq", title: "FAQ", description: "A crashed or hung lockscreen, a virtual keyboard on the login screen, low-quality video backgrounds, and KDE Plasma.", page: () => import("./docs/faq.md") },
  { slug: "lock-recovery", title: "Lock recovery", description: "What to do when the lockscreen crashes or hangs, and how to get back into your session.", page: () => import("@darwan-docs/lock-recovery.md") },
  { slug: "theme-contract", title: "Theme contract", description: "Everything a Darwan theme can rely on, and the rules darwan check enforces, for writing or porting a theme.", page: () => import("@darwan-docs/theme-contract.md") },
];
