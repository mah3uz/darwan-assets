import { createRouter, createWebHistory } from "vue-router";
import { docs } from "./docs";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("./pages/Home.vue") },
    { path: "/themes/:id(.*)?", component: () => import("./pages/Themes.vue"), meta: { title: "Themes" } },
    {
      path: "/docs",
      component: () => import("./pages/Docs.vue"),
      children: [
        { path: "", redirect: `/docs/${docs[0].slug}` },
        ...docs.map((d) => ({ path: d.slug, component: d.page, meta: { title: d.title } })),
      ],
    },
    { path: "/credits", component: () => import("./pages/Credits.vue"), meta: { title: "Credits" } },
    { path: "/:rest(.*)*", component: () => import("./pages/NotFound.vue"), meta: { title: "Page not found" } },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash };
    if (to.path.startsWith("/themes") && from.path.startsWith("/themes")) return false;
    return { top: 0 };
  },
});

router.afterEach((to) => {
  const title = to.meta.title as string | undefined;
  document.title = title ? `${title} · Darwan` : "Darwan: themes for your login screen and lockscreen";
});
