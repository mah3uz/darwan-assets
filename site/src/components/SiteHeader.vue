<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { choice, type Choice } from "../theme";

const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 8);
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

const order: Choice[] = ["system", "light", "dark"];
const names: Record<Choice, string> = { system: "System", light: "Light", dark: "Dark" };
const nextChoice = computed(() => order[(order.indexOf(choice.value) + 1) % order.length]);
const cycle = () => (choice.value = nextChoice.value);

// Play is the GUI's full window, so it is offered only where it fits.
const nav = [
  { to: "/themes", label: "Themes" },
  { to: "/play", label: "Play", desktop: true },
  { to: "/docs", label: "Docs" },
  { to: "/credits", label: "Credits" },
];
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-colors duration-300"
    :class="scrolled ? 'border-line bg-night/80 backdrop-blur-lg' : 'border-transparent'"
  >
    <nav class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
      <RouterLink to="/" class="mr-auto flex shrink-0 items-center gap-2.5 font-semibold tracking-tight text-bright" aria-label="Darwan home">
        <img src="/darwan.svg" alt="" class="size-8" />
        <span class="hidden text-lg min-[26rem]:inline">Darwan</span>
      </RouterLink>
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="text-sm text-dim transition-colors hover:text-bright"
        :class="{ 'hidden min-[1100px]:inline': item.desktop }"
        active-class="!text-bright"
      >
        {{ item.label }}
      </RouterLink>
      <button
        type="button"
        class="text-dim transition-colors hover:text-bright"
        :aria-label="`Colour theme: ${names[choice]}. Switch to ${names[nextChoice].toLowerCase()}`"
        :title="`Theme: ${names[choice]}`"
        @click="cycle"
      >
        <svg v-if="choice === 'system'" viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" stroke-linecap="round" />
        </svg>
        <svg v-else-if="choice === 'light'" viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-2" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" stroke-linejoin="round" />
        </svg>
      </button>
      <a
        href="https://github.com/mah3uz/darwan"
        class="text-dim transition-colors hover:text-bright"
        aria-label="Darwan on GitHub"
      >
        <svg viewBox="0 0 16 16" class="size-5 fill-current" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
    </nav>
  </header>
</template>
