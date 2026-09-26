<script setup lang="ts">
import { wallpapers } from "../data/credits";
import { themes } from "../data/themes";

const supporters = ["Max", "Awkward", "Chương Kính", "MerhawiGhebrekal", "Silenett", "wawzi", "franchecol", "Trench Martyr"];
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 pt-12 sm:px-6">
    <h1 class="text-5xl font-semibold tracking-tight text-bright">Credits</h1>

    <section class="mt-10 rounded-2xl bg-surface p-6 ring-1 ring-line sm:p-8">
      <h2 class="text-2xl font-semibold tracking-tight text-bright">Built on qylock</h2>
      <div class="mt-4 max-w-[68ch] space-y-4 leading-relaxed text-ink">
        <p>
          Darwan would not exist without <a href="https://github.com/Darkkal44/qylock" class="text-blue underline underline-offset-4">qylock</a>
          by <a href="https://github.com/Darkkal44" class="text-blue underline underline-offset-4">Darkkal44</a>. Every theme in this
          collection was designed and built there: the pixel worlds, the game tributes, Clockwork, and the SDDM and Quickshell
          shim that made one theme run in both places. Darwan only builds an app around that work. The hard, creative part is
          theirs.
        </p>
        <p>
          Thank you, Darkkal, and thank you to everyone who helped qylock grow: its contributors, supporters
          {{ supporters.slice(0, -1).join(", ") }} and {{ supporters.at(-1) }}, and special thanks to Pumphium, kaizky and
          DragonChicken.
        </p>
        <p>
          If you enjoy these themes, please
          <a href="https://github.com/Darkkal44/qylock" class="text-blue underline underline-offset-4">star qylock</a> and
          <a href="https://ko-fi.com/darkkal" class="text-blue underline underline-offset-4">support Darkkal on Ko-fi</a>.
        </p>
      </div>
    </section>

    <section class="mt-16">
      <h2 class="text-2xl font-semibold tracking-tight text-bright">Wallpapers and fonts</h2>
      <p class="mt-3 max-w-[68ch] leading-relaxed text-dim">
        Huge thanks to the artists behind these wallpapers and fonts. They belong to their creators; follow the links for the
        originals, including full-resolution versions of the videos.
      </p>
      <div class="mt-8 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-dim">
            <tr class="border-b border-line">
              <th scope="col" class="py-3 pr-4 font-normal">Theme</th>
              <th scope="col" class="py-3 pr-4 font-normal">Wallpaper</th>
              <th scope="col" class="py-3 font-normal">Font you add yourself</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in themes" :key="t.id" class="border-b border-line/60">
              <th scope="row" class="py-3 pr-4 font-medium text-bright">
                <RouterLink :to="`/themes/${t.id}`" class="hover:underline hover:underline-offset-4">
                  <span v-if="t.family" class="text-dim">{{ t.family }}&nbsp;</span>{{ t.name }}
                </RouterLink>
              </th>
              <td class="py-3 pr-4">
                <a v-if="wallpapers[t.id]" :href="wallpapers[t.id].url" rel="noopener" class="text-blue underline-offset-4 hover:underline">
                  {{ wallpapers[t.id].source }}
                </a>
                <span v-else class="text-dim">Not recorded</span>
              </td>
              <td class="py-3 text-ink">{{ t.fonts.map((f) => f.family).join(", ") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="mt-12 max-w-[68ch] leading-relaxed text-dim">
      Darwan is licensed under the
      <a href="https://github.com/mah3uz/darwan/blob/main/LICENSE" class="text-blue underline-offset-4 hover:underline">GNU GPL v3.0</a>,
      the same licence as qylock, which it is derived from.
    </p>
  </div>
</template>
