<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import ThemeCard from "../components/ThemeCard.vue";
import ThemeDialog from "../components/ThemeDialog.vue";
import { families, familyOf, themes, type Theme } from "../data/themes";

const route = useRoute();
const filters: Record<string, (t: Theme) => boolean> = {
  All: () => true,
  ...Object.fromEntries(families.map((f) => [f, (t: Theme) => familyOf(t) === f])),
  Video: (t) => t.background === "video",
};
const filter = ref("All");
const query = ref("");

const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return themes.filter(
    (t) =>
      filters[filter.value](t) &&
      (!q || t.name.toLowerCase().includes(q) || t.id.includes(q)),
  );
});

const open = computed(() => themes.find((t) => t.id === route.params.id) ?? null);
const count = (f: string) => themes.filter(filters[f]).length;
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
    <h1 class="text-5xl font-semibold tracking-tight text-bright">Themes</h1>
    <p class="mt-4 max-w-2xl text-lg leading-relaxed text-dim">
      Every theme works on both the lockscreen and the login screen. Point at one to watch it unlock, or open it for its
      settings and the commands to use it.
    </p>

    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div role="radiogroup" aria-label="Show" class="flex flex-wrap gap-1 rounded-xl bg-surface p-1 ring-1 ring-line">
        <button
          v-for="f in Object.keys(filters)"
          :key="f"
          type="button"
          role="radio"
          :aria-checked="filter === f"
          class="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors"
          :class="filter === f ? 'bg-raised text-bright' : 'text-dim hover:text-ink'"
          @click="filter = f"
        >
          {{ f }} <span class="ml-1 tabular-nums text-dim">{{ count(f) }}</span>
        </button>
      </div>
      <label class="relative block sm:w-72">
        <span class="sr-only">Search themes</span>
        <input
          v-model="query"
          type="search"
          placeholder="Search by name or id"
          class="w-full rounded-xl bg-surface px-4 py-2.5 text-sm text-bright ring-1 ring-line placeholder:text-dim focus:ring-blue focus:outline-none"
        />
      </label>
    </div>

    <ul v-if="shown.length" class="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="t in shown" :key="t.id">
        <ThemeCard :theme="t" />
      </li>
    </ul>
    <p v-else class="mt-16 text-center text-dim">
      No theme matches “{{ query }}”.
      <button type="button" class="text-blue underline-offset-4 hover:underline" @click="(query = ''), (filter = 'All')">
        Show all themes
      </button>
    </p>
  </div>

  <ThemeDialog v-if="open" :theme="open" />
</template>
