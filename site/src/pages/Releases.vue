<script setup lang="ts">
import releases from "virtual:releases";

const repo = "https://github.com/mah3uz/darwan";

// In the visitor's own time zone, with the zone named, since releases can come hours apart.
const format = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" });
const clock = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
const day = (iso: string) => format.format(new Date(iso));
const time = (iso: string) => clock.format(new Date(iso));
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
    <header class="max-w-[68ch]">
      <p class="rise text-sm font-medium tracking-wide text-gate uppercase">Changelog</p>
      <h1 class="rise mt-2 text-5xl font-semibold tracking-tight text-bright" style="--step: 1">Releases</h1>
      <p class="rise mt-4 leading-relaxed text-dim" style="--step: 2">
        Every Darwan release, newest first: what changed, and anything to do after you upgrade. Your AUR helper picks up
        a new release with its next update.
      </p>
      <div class="rise mt-6 flex flex-wrap gap-3 text-sm" style="--step: 3">
        <a :href="`${repo}/releases.atom`" class="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-ink ring-1 ring-line transition-colors hover:text-bright">
          <svg viewBox="0 0 24 24" class="size-4 fill-none stroke-current stroke-2" aria-hidden="true">
            <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" stroke-linecap="round" /><circle cx="6" cy="18" r="1.5" class="fill-current" />
          </svg>
          Follow new releases
        </a>
        <a :href="`${repo}/releases`" class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-dim ring-1 ring-line transition-colors hover:text-bright">
          On GitHub
        </a>
      </div>
    </header>

    <ol class="mt-16">
      <li
        v-for="(r, i) in releases"
        :id="`v${r.version}`"
        :key="r.version"
        class="group grid scroll-mt-24 gap-x-10 md:grid-cols-[11rem_1fr]"
      >
        <div class="pb-4 md:sticky md:top-24 md:self-start md:pb-16">
          <a :href="`#v${r.version}`" class="inline-flex items-baseline gap-2">
            <span class="text-3xl font-semibold tracking-tight" :class="i === 0 ? 'text-gate' : 'text-bright'">{{ r.version }}</span>
          </a>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span v-if="i === 0" class="rounded-full bg-green/15 px-2 py-0.5 text-xs font-medium text-green ring-1 ring-green/30">Latest</span>
            <span v-if="!r.previous" class="rounded-full bg-violet/15 px-2 py-0.5 text-xs font-medium text-violet ring-1 ring-violet/30">First release</span>
          </div>
          <time :datetime="r.published" class="mt-3 block text-sm text-ink">{{ day(r.published) }}</time>
          <span class="block text-xs text-dim">{{ time(r.published) }}</span>
        </div>

        <div class="relative border-line pb-16 md:border-l md:pl-10" :class="{ 'md:pb-4': i === releases.length - 1 }">
          <span
            class="absolute top-3 -left-[7px] hidden size-3.5 rounded-full ring-4 ring-night md:block"
            :class="i === 0 ? 'bg-linear-to-br from-blue to-violet shadow-[0_0_18px] shadow-violet/60' : 'bg-line'"
            aria-hidden="true"
          />
          <div class="prose max-w-none text-[0.97rem]" v-html="r.notes" />

          <aside v-if="r.upgrade" class="mt-8 rounded-2xl bg-amber/8 p-5 ring-1 ring-amber/25 sm:p-6">
            <h3 class="flex items-center gap-2 font-semibold text-amber">
              <svg viewBox="0 0 24 24" class="size-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ r.upgrade.title }}
            </h3>
            <div class="prose prose-sm mt-3 max-w-none" v-html="r.upgrade.html" />
          </aside>

          <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a :href="`${repo}/releases/tag/v${r.version}`" class="text-dim underline-offset-4 transition-colors hover:text-bright hover:underline">
              v{{ r.version }} on GitHub
            </a>
            <a
              v-if="r.previous"
              :href="`${repo}/compare/v${r.previous}...v${r.version}`"
              class="text-dim underline-offset-4 transition-colors hover:text-bright hover:underline"
            >
              Every commit since {{ r.previous }}
            </a>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
