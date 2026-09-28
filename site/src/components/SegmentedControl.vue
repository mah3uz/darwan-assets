<script setup lang="ts" generic="T extends string">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  options: { value: T; label: string; hint?: number; disabled?: boolean }[];
  label: string;
  kind: "tabs" | "radios";
  // Tabs get ids `${id}-${value}` and control panels `${id}-${value}-panel`.
  id?: string;
  mono?: boolean;
  // Phones: fill the row, splitting it evenly between the options.
  stretch?: boolean;
}>();
const model = defineModel<T>({ required: true });

const root = ref<HTMLElement>();
const buttons: HTMLButtonElement[] = [];
const pill = ref({ left: 0, top: 0, width: 0, height: 0 });
// The pill only slides once it has been placed, so it doesn't fly in from the corner on load.
const sliding = ref(false);

function place() {
  const b = buttons[props.options.findIndex((o) => o.value === model.value)];
  if (b) pill.value = { left: b.offsetLeft, top: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight };
}

function onKey(e: KeyboardEvent) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!step) return;
  e.preventDefault();
  const n = props.options.length;
  let next = props.options.findIndex((o) => o.value === model.value);
  // Arrows skip options that are disabled.
  for (let tries = 0; tries < n; tries++) {
    next = (next + step + n) % n;
    if (!props.options[next].disabled) break;
  }
  model.value = props.options[next].value;
  buttons[next]?.focus();
}

let observer: ResizeObserver | undefined;
onMounted(() => {
  place();
  requestAnimationFrame(() => (sliding.value = true));
  observer = new ResizeObserver(place);
  if (root.value) observer.observe(root.value);
});
onBeforeUnmount(() => observer?.disconnect());
watch(model, place, { flush: "post" });
</script>

<template>
  <div
    ref="root"
    :role="kind === 'tabs' ? 'tablist' : 'radiogroup'"
    :aria-label="label"
    class="relative flex max-w-full gap-1 overflow-x-auto rounded-xl bg-surface p-1 ring-1 ring-line [scrollbar-width:none]"
    :class="stretch ? 'w-full sm:w-fit' : 'w-fit'"
    @keydown="onKey"
  >
    <span
      aria-hidden="true"
      class="absolute rounded-lg bg-raised"
      :class="sliding && 'transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)]'"
      :style="{ left: `${pill.left}px`, top: `${pill.top}px`, width: `${pill.width}px`, height: `${pill.height}px` }"
    ></span>
    <button
      v-for="(o, i) in options"
      :key="o.value"
      :ref="(el) => (buttons[i] = el as HTMLButtonElement)"
      type="button"
      :role="kind === 'tabs' ? 'tab' : 'radio'"
      :id="id && `${id}-${o.value}`"
      :aria-controls="kind === 'tabs' && id ? `${id}-${o.value}-panel` : undefined"
      :aria-selected="kind === 'tabs' ? model === o.value : undefined"
      :aria-checked="kind === 'radios' ? model === o.value : undefined"
      :tabindex="model === o.value ? 0 : -1"
      :disabled="o.disabled && model !== o.value"
      class="relative shrink-0 rounded-lg px-2 py-1.5 text-xs whitespace-nowrap transition-colors duration-300 min-[360px]:px-2.5 min-[360px]:text-sm sm:px-3.5"
      :class="[model === o.value ? 'text-bright' : 'text-dim enabled:hover:text-ink disabled:opacity-40', mono ? 'font-mono' : 'font-medium', stretch && 'flex-1 sm:flex-none']"
      @click="model = o.value"
    >
      {{ o.label }}<span v-if="o.hint !== undefined" class="ml-1 tabular-nums text-dim min-[360px]:ml-1.5">{{ o.hint }}</span>
    </button>
  </div>
</template>
