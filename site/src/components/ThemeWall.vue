<script setup lang="ts">
import { themes } from "../data/themes";

const columns = [0, 1, 2, 3].map((c) => themes.filter((_, i) => i % 4 === c));
</script>

<template>
  <div class="wall pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="plane">
      <div v-for="(col, c) in columns" :key="c" class="column" :class="c % 2 ? 'down' : 'up'">
        <div class="track">
          <img
            v-for="(t, i) in [...col, ...col]"
            :key="i"
            :src="t.still"
            alt=""
            width="1280"
            height="720"
            loading="eager"
            decoding="async"
            class="aspect-video w-full rounded-xl object-cover shadow-[0_18px_40px_#0009] ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
    <div class="shade absolute inset-0"></div>
  </div>
</template>

<style scoped>
.wall {
  animation: fade-in 1.6s ease-out both;
  perspective: 2200px;
  perspective-origin: 30% 50%;
  mask-image: linear-gradient(90deg, transparent 30%, #000 62%);
}
.plane {
  position: absolute;
  left: 46%;
  top: -30%;
  display: grid;
  grid-template-columns: repeat(4, 17rem);
  gap: 1rem;
  transform: rotateY(-20deg) rotateX(12deg) rotateZ(-8deg);
  transform-origin: 0 50%;
}
.track {
  display: grid;
  gap: 1rem;
}
.column.up .track {
  animation: rise 140s linear infinite;
}
.column.down .track {
  animation: rise 160s linear infinite reverse;
  margin-top: -3rem;
}
@keyframes rise {
  to {
    transform: translateY(calc(-50% - 0.5rem));
  }
}
.shade {
  background:
    linear-gradient(180deg, var(--color-night) 6%, transparent 24%, transparent 80%, var(--color-night) 100%),
    linear-gradient(90deg, var(--color-night) 34%, transparent 60%);
}
@media (max-width: 900px) {
  .wall {
    mask-image: linear-gradient(180deg, #000 0%, transparent 70%);
    opacity: 0.35;
  }
  .plane {
    left: 10%;
  }
  .shade {
    background: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none !important;
  }
}
</style>
