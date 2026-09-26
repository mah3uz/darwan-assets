<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CopyCommand from "./CopyCommand.vue";
import { wallpapers } from "../data/credits";
import { themes, type Theme } from "../data/themes";

const props = defineProps<{ theme: Theme }>();
const router = useRouter();
const dialog = ref<HTMLDialogElement>();

const index = computed(() => themes.findIndex((t) => t.id === props.theme.id));
const prev = computed(() => themes[(index.value - 1 + themes.length) % themes.length]);
const next = computed(() => themes[(index.value + 1) % themes.length]);
const credit = computed(() => wallpapers[props.theme.id]);
const background = { video: "Video", image: "Still image", color: "Plain colour" } as Record<string, string>;

const close = () => router.push("/themes");

function onKey(e: KeyboardEvent) {
  if ((e.target as HTMLElement).closest("input, button")) return;
  if (e.key === "ArrowLeft") router.replace(`/themes/${prev.value.id}`);
  if (e.key === "ArrowRight") router.replace(`/themes/${next.value.id}`);
}

onMounted(() => {
  dialog.value?.showModal();
  window.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="'theme-title'"
    class="m-auto max-h-[calc(100svh-2rem)] w-[min(72rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl bg-night text-ink ring-1 ring-line backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    @close="close"
    @click.self="dialog?.close()"
  >
    <div class="relative">
      <img
        :key="theme.id"
        :src="theme.animation"
        :alt="`${theme.name} unlocking: the password is typed and the theme plays its unlock animation.`"
        width="1920"
        height="1080"
        class="aspect-video w-full bg-surface object-cover"
        :style="{ backgroundImage: `url(${theme.still})`, backgroundSize: 'cover' }"
      />
    </div>

    <div class="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <div class="flex items-start justify-between gap-4">
          <h2 id="theme-title" class="text-3xl font-semibold tracking-tight text-bright">
            <span v-if="theme.family" class="text-dim">{{ theme.family }}&nbsp;</span>{{ theme.name }}
          </h2>
          <button
            type="button"
            class="shrink-0 rounded-lg px-3 py-1.5 text-sm text-ink ring-1 ring-line hover:bg-surface hover:text-bright"
            @click="dialog?.close()"
          >
            Close
          </button>
        </div>
        <p class="mt-2 text-dim">
          By {{ theme.author ?? "unknown" }}<template v-if="credit">, wallpaper from
            <a :href="credit.url" rel="noopener" class="text-ink underline underline-offset-4">{{ credit.source }}</a></template>.
        </p>

        <div class="mt-8 space-y-2">
          <CopyCommand :command="`darwan preview ${theme.id}`" />
          <CopyCommand :command="`darwan set lock.theme ${theme.id}`" />
          <CopyCommand :command="`darwan sddm apply ${theme.id}`" />
        </div>
        <p class="mt-3 text-sm text-dim">
          Preview it without locking, use it for your lockscreen, or put it on your login screen.
        </p>
      </div>

      <dl class="space-y-5 text-sm">
        <div>
          <dt class="text-dim">Id</dt>
          <dd class="mt-1 font-mono text-bright">{{ theme.id }}</dd>
        </div>
        <div v-if="theme.background">
          <dt class="text-dim">Background</dt>
          <dd class="mt-1 text-bright">{{ background[theme.background] ?? theme.background }}</dd>
        </div>
        <div>
          <dt class="text-dim">Your clock and date settings</dt>
          <dd class="mt-1 text-bright">
            {{ theme.clock && theme.date ? "Both apply" : theme.clock ? "The clock applies; it shows no date" : "It shows no clock or date" }}
          </dd>
        </div>
        <div v-if="theme.options.length">
          <dt class="text-dim">Options</dt>
          <dd v-for="o in theme.options" :key="o.key" class="mt-1">
            <span class="text-bright">{{ o.label }}</span>
            <span v-if="o.choices" class="text-dim">: {{ o.choices.join(", ") }}</span>
          </dd>
        </div>
        <div v-if="theme.fonts.length">
          <dt class="text-dim">Font you add yourself</dt>
          <dd v-for="f in theme.fonts" :key="f.family" class="mt-1">
            <a v-if="f.url" :href="f.url" rel="noopener" class="text-amber underline underline-offset-4">{{ f.family }}</a>
            <span v-else class="text-amber">{{ f.family }}</span>
            <span class="text-dim">, {{ f.license }}. </span>
            <RouterLink to="/docs/fonts" class="text-blue underline-offset-4 hover:underline">How to add it</RouterLink>
          </dd>
        </div>
      </dl>
    </div>

    <nav class="flex justify-between border-t border-line px-6 py-4 text-sm sm:px-8" aria-label="Other themes">
      <RouterLink :to="`/themes/${prev.id}`" replace class="text-dim hover:text-bright">‹ {{ prev.name }}</RouterLink>
      <RouterLink :to="`/themes/${next.id}`" replace class="text-dim hover:text-bright">{{ next.name }} ›</RouterLink>
    </nav>
  </dialog>
</template>

<style scoped>
dialog[open] {
  animation: open 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
dialog[open]::backdrop {
  animation: fade-in 0.35s ease-out;
}
@keyframes open {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
}
</style>
