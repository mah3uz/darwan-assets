<script setup lang="ts">
import { ref } from "vue";
import type { Theme } from "../data/themes";

defineProps<{ theme: Theme }>();

// The animation only loads once someone shows interest; together they weigh 80 MB.
const playing = ref(false);
const loaded = ref(false);
function stop() {
  playing.value = false;
  loaded.value = false;
}
</script>

<template>
  <RouterLink
    :to="`/themes/${theme.id}`"
    class="group block"
    @mouseenter="playing = true"
    @mouseleave="stop"
    @focus="playing = true"
    @blur="stop"
  >
    <div class="relative aspect-video overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-shadow group-hover:ring-violet/60 group-focus-visible:ring-violet/60">
      <img :src="theme.still" alt="" width="1280" height="720" loading="lazy" decoding="async" class="size-full object-cover" />
      <img
        v-if="playing"
        :src="theme.animation"
        alt=""
        class="absolute inset-0 size-full object-cover transition-opacity duration-500"
        :class="loaded ? 'opacity-100' : 'opacity-0'"
        @load="loaded = true"
      />
    </div>
    <div class="mt-3 flex items-baseline justify-between gap-3">
      <h2 class="font-medium text-bright">
        <span v-if="theme.family" class="text-dim">{{ theme.family }}&nbsp;</span>{{ theme.name }}
      </h2>
      <span class="flex shrink-0 gap-2 text-xs">
        <span v-if="theme.defaultVariant" class="text-violet" title="Has a light and a dark look">light · dark</span>
        <span v-if="theme.fonts.length" class="text-amber" title="Uses a font you add yourself">needs a font</span>
      </span>
    </div>
  </RouterLink>
</template>
