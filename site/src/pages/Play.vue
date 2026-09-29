<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// A window-sized GUI with hover and keys: it needs a wide screen and a pointer, so phones get the pictures instead.
const query = window.matchMedia("(min-width: 1100px) and (pointer: fine)");
const desktop = ref(query.matches);
const update = () => (desktop.value = query.matches);
onMounted(() => query.addEventListener("change", update));
onBeforeUnmount(() => query.removeEventListener("change", update));
</script>

<template>
  <iframe
    v-if="desktop"
    src="/demo/index.html"
    title="The Darwan GUI, playable"
    class="block h-dvh w-full border-0"
  />

  <div v-else class="mx-auto max-w-[1600px] px-4 pt-10 sm:px-6">
    <h1 class="text-4xl font-semibold tracking-tight text-bright">Try the GUI</h1>
    <p class="mt-3 max-w-[80ch] leading-relaxed text-dim">
      Darwan's GUI, here in your browser with the real themes and their settings. Hover a card to watch it unlock, open
      one, change its settings, try the screensaver timeline, browse the Wallpapers pages. The live theme is played by
      its recorded demo, the wallpapers are free ones from Wikimedia Commons and NASA, and the buttons that would lock,
      apply, set or save only say what they'd do: nothing touches your system.
    </p>

    <div class="mt-6 space-y-4">
      <p class="rounded-xl bg-surface p-4 text-ink ring-1 ring-line">
        The demo is the GUI's full window, so it needs a desktop screen. Here is what it looks like:
      </p>
      <img src="/screens/gui-wall.webp" alt="The start screen: your lockscreen and login screen, and every theme as a card." class="w-full rounded-xl ring-1 ring-line" loading="lazy" />
      <img src="/screens/gui.webp" alt="A theme open full-window and live, with its settings beside it." class="w-full rounded-xl ring-1 ring-line" loading="lazy" />
    </div>
  </div>
</template>
