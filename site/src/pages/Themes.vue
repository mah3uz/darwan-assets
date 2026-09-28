<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import SegmentedControl from "../components/SegmentedControl.vue";
import ThemeCard from "../components/ThemeCard.vue";
import ThemeDialog from "../components/ThemeDialog.vue";
import { families, familyOf, themes, type Theme } from "../data/themes";

const route = useRoute();
// Family picks one group; features narrow it further and combine, e.g. Pixel themes with video.
type Family = "All" | (typeof families)[number];
const features: Record<string, (t: Theme) => boolean> = {
  Video: (t) => t.background === "video",
  "Light & dark": (t) => t.defaultVariant !== null,
};
// ?filter=… opens the gallery on a family or a feature, so docs can link to e.g. the themes with a light and a dark look.
const fromQuery = String(route.query.filter ?? "");
const family = ref<Family>((families as readonly string[]).includes(fromQuery) ? (fromQuery as Family) : "All");
const wanted = ref<string[]>(fromQuery in features ? [fromQuery] : []);
const query = ref("");

const inFamily = (t: Theme, f: Family) => f === "All" || familyOf(t) === f;
const hasFeatures = (t: Theme, names: string[]) => names.every((n) => features[n](t));

const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return themes.filter(
    (t) =>
      inFamily(t, family.value) &&
      hasFeatures(t, wanted.value) &&
      (!q || t.name.toLowerCase().includes(q) || t.id.includes(q)),
  );
});

// Each count is what choosing it would show, given the other choices.
const familyCount = (f: Family) => themes.filter((t) => inFamily(t, f) && hasFeatures(t, wanted.value)).length;
const featureCount = (n: string) =>
  themes.filter((t) => inFamily(t, family.value) && hasFeatures(t, [...wanted.value, n])).length;
const toggle = (n: string) =>
  (wanted.value = wanted.value.includes(n) ? wanted.value.filter((w) => w !== n) : [...wanted.value, n]);
const reset = () => ((query.value = ""), (family.value = "All"), (wanted.value = []));

const open = computed(() => themes.find((t) => t.id === route.params.id) ?? null);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
    <h1 class="text-5xl font-semibold tracking-tight text-bright">Themes</h1>
    <p class="mt-4 max-w-2xl text-lg leading-relaxed text-dim">
      Every theme works on both the lockscreen and the login screen, and takes your own background, colours, fonts and
      animation speed where its design allows. Point at one to watch it unlock, or open it for its settings and the
      commands to use it.
    </p>

    <div class="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
      <SegmentedControl
        v-model="family"
        :options="(['All', ...families] as Family[]).map((f) => ({ value: f, label: f, hint: familyCount(f), disabled: familyCount(f) === 0 }))"
        label="Family"
        kind="radios"
        stretch
      />
      <div class="flex flex-wrap gap-2" role="group" aria-label="Only themes with">
        <button
          v-for="n in Object.keys(features)"
          :key="n"
          type="button"
          :aria-pressed="wanted.includes(n)"
          :disabled="!wanted.includes(n) && featureCount(n) === 0"
          class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors disabled:opacity-40"
          :class="wanted.includes(n) ? 'bg-blue/15 text-bright ring-blue/60' : 'text-dim ring-line enabled:hover:text-ink'"
          @click="toggle(n)"
        >
          <svg v-if="wanted.includes(n)" viewBox="0 0 16 16" class="size-3.5 fill-none stroke-current stroke-2" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ n }}<span class="tabular-nums text-dim">{{ featureCount(n) }}</span>
        </button>
      </div>
      <label class="relative block lg:ml-auto lg:w-72">
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
      {{ query.trim() ? `No theme matches “${query.trim()}” here.` : "No theme has all of these." }}
      <button type="button" class="text-blue underline-offset-4 hover:underline" @click="reset">
        Show all themes
      </button>
    </p>
  </div>

  <ThemeDialog v-if="open" :theme="open" />
</template>
