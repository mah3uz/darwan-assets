import { createRouter, createWebHistory } from "vue-router";
import { docs } from "./docs";
import { themes } from "./data/themes";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("./pages/Home.vue") },
    { path: "/themes/:id(.*)?", component: () => import("./pages/Themes.vue"), meta: { title: "Themes", description: "All 41 Darwan themes for the SDDM login screen and the Quickshell lockscreen: pixel worlds, game tributes and Clockwork. Watch each one unlock." } },
    {
      path: "/docs",
      component: () => import("./pages/Docs.vue"),
      children: [
        { path: "", redirect: `/docs/${docs[0].slug}` },
        ...docs.map((d) => ({ path: d.slug, component: d.page, meta: { title: d.title, description: d.description } })),
      ],
    },
    { path: "/credits", component: () => import("./pages/Credits.vue"), meta: { title: "Credits", description: "Darwan's themes come from qylock by Darkkal44. The artists behind every wallpaper and font." } },
    { path: "/:rest(.*)*", component: () => import("./pages/NotFound.vue"), meta: { title: "Page not found" } },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash };
    if (to.path.startsWith("/themes") && from.path.startsWith("/themes")) return false;
    return { top: 0 };
  },
});

const site = "https://darwan.dev";
const home = {
  title: "Darwan: themes for your login screen and lockscreen",
  description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
};

// Link previews always get index.html's home page tags; these keep each page distinct for search engines, which run the app.
router.afterEach((to) => {
  const theme = themes.find((t) => t.id === to.params.id);
  const title = theme ? `${theme.family ? `${theme.family} ${theme.name}` : theme.name} theme` : (to.meta.title as string | undefined);
  const description = theme
    ? `${theme.name}, a theme${theme.author ? ` by ${theme.author}` : ""} for the SDDM login screen and the Quickshell lockscreen. Watch it unlock, and get the commands to use it with Darwan.`
    : ((to.meta.description as string | undefined) ?? home.description);

  document.title = title ? `${title} · Darwan` : home.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = site + (to.path === "/" ? "/" : to.path.replace(/\/$/, ""));
  document.querySelector('meta[name="robots"]')?.remove();
  if (to.matched[0]?.path === "/:rest(.*)*") {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.append(robots);
  }
});
