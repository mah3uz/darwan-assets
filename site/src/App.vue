<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// On a desktop, Play is the demo alone, in the whole window; its logo leads home. Matches Play.vue's desktop test.
const bare = computed(() => (route.path === "/play" ? "min-[1100px]:pointer-fine:hidden" : ""));
</script>

<template>
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">
    Skip to content
  </a>
  <SiteHeader :class="bare" />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter :class="bare" />
</template>
