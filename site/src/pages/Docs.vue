<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { docs } from "../docs";
import { track } from "../analytics";

const route = useRoute();
const router = useRouter();

// The copy buttons come with the Markdown's code blocks (vite.config.ts), so their clicks are handled here.
async function copyCode(button: HTMLButtonElement) {
  const code = button.closest(".code-block")?.querySelector("pre")?.textContent;
  if (!code) return;
  await navigator.clipboard.writeText(code.replace(/\n$/, ""));
  track("Copy code", { page: route.path });
  const label = button.querySelector("span");
  button.dataset.copied = "";
  if (label) label.textContent = "Copied";
  window.setTimeout(() => {
    delete button.dataset.copied;
    if (label) label.textContent = "Copy";
  }, 1600);
}

// Markdown renders plain <a> tags; keep internal links inside the app instead of reloading the page.
function follow(e: MouseEvent) {
  const copy = (e.target as HTMLElement).closest<HTMLButtonElement>(".code-copy");
  if (copy) {
    copyCode(copy);
    return;
  }
  const a = (e.target as HTMLElement).closest("a");
  if (!a || a.origin !== location.origin || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  router.push(a.pathname + a.hash);
}
const at = computed(() => docs.findIndex((d) => route.path === `/docs/${d.slug}`));
const next = computed(() => docs[at.value + 1]);
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[13rem_1fr]">
    <nav aria-label="Documentation" class="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <ul class="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        <li v-for="d in docs" :key="d.slug" class="shrink-0">
          <RouterLink
            :to="`/docs/${d.slug}`"
            class="block rounded-lg px-3 py-1.5 text-sm text-dim transition-colors hover:text-bright"
            active-class="bg-surface !text-bright ring-1 ring-line"
          >
            {{ d.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <article class="min-w-0" @click="follow">
      <RouterView />
      <RouterLink
        v-if="next"
        :to="`/docs/${next.slug}`"
        class="mt-16 flex max-w-[72ch] items-center justify-between rounded-xl px-5 py-4 ring-1 ring-line transition-colors hover:bg-surface"
      >
        <span class="text-dim">Next</span>
        <span class="font-medium text-bright">{{ next.title }}</span>
      </RouterLink>
    </article>
  </div>
</template>
