<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ command: string }>();
const copied = ref(false);
let timer: number | undefined;

async function copy() {
  await navigator.clipboard.writeText(props.command);
  copied.value = true;
  clearTimeout(timer);
  timer = window.setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
  <div class="group flex items-center gap-3 rounded-xl border border-line bg-surface/80 py-2 pr-2 pl-4 font-mono text-sm backdrop-blur">
    <span class="select-none text-dim" aria-hidden="true">$</span>
    <code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-bright">{{ command }}</code>
    <button
      type="button"
      class="shrink-0 rounded-lg px-3 py-1.5 font-sans text-xs font-medium transition-colors"
      :class="copied ? 'bg-green/15 text-green' : 'bg-raised text-ink hover:bg-line'"
      @click="copy"
    >
      {{ copied ? "Copied" : "Copy" }}
    </button>
    <span class="sr-only" aria-live="polite">{{ copied ? "Copied to clipboard" : "" }}</span>
  </div>
</template>
