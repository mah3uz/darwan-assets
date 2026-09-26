<script setup lang="ts">
import { ref } from "vue";
import type { Theme } from "../data/themes";

defineProps<{ theme: Theme }>();

// The animation only loads once someone shows interest; together they weigh 80 MB.
const playing = ref(false);
</script>

<template>
  <RouterLink
    :to="`/themes/${theme.id}`"
    class="group block"
    @mouseenter="playing = true"
    @mouseleave="playing = false"
    @focus="playing = true"
    @blur="playing = false"
  >
    <div class="relative aspect-video overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-shadow group-hover:ring-violet/60 group-focus-visible:ring-violet/60">
      <img :src="theme.still" alt="" width="1280" height="720" loading="lazy" decoding="async" class="size-full object-cover" />
      <img v-if="playing" :src="theme.animation" alt="" class="absolute inset-0 size-full object-cover" />
    </div>
    <div class="mt-3 flex items-baseline justify-between gap-3">
      <h2 class="font-medium text-bright">
        <span v-if="theme.family" class="text-dim">{{ theme.family }}&nbsp;</span>{{ theme.name }}
      </h2>
      <span v-if="theme.fonts.length" class="shrink-0 text-xs text-amber" title="Uses a font you add yourself">needs a font</span>
    </div>
  </RouterLink>
</template>
