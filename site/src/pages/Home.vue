<script setup lang="ts">
import { ref } from "vue";
import CopyCommand from "../components/CopyCommand.vue";
import SegmentedControl from "../components/SegmentedControl.vue";
import ThemeWall from "../components/ThemeWall.vue";
import { themes } from "../data/themes";
import { track } from "../analytics";

const featured = themes[Math.floor(Math.random() * themes.length)];

const faces = [
  {
    id: "gui",
    label: "GUI",
    command: "darwan-gui",
    text: "Every theme as a card that plays its unlock when you hover it. Open one and it fills the window, live, with its settings beside it and every change shown before you save it. Drop an image or a video on it to make it the background, browse and set wallpapers, and set up the screensaver and hypridle under ⚙.",
  },
  {
    id: "tui",
    label: "TUI",
    command: "darwan",
    text: "The same themes and settings in your terminal, with a still preview drawn through kitty, sixel or iTerm graphics.",
  },
  {
    id: "cli",
    label: "CLI",
    command: "darwan --help",
    text: "Every action as a command, in colour on your terminal, with tab completion for theme ids, every setting a theme supports, and their values.",
  },
] as const;
const face = ref<(typeof faces)[number]["id"]>("gui");

const installers = [
  { id: "paru", label: "paru", commands: ["paru -S darwan-bin"] },
  { id: "yay", label: "yay", commands: ["yay -S darwan-bin"] },
  {
    id: "makepkg",
    label: "makepkg",
    commands: ["git clone https://aur.archlinux.org/darwan-bin.git", "cd darwan-bin", "makepkg -si"],
  },
] as const;
const installer = ref<(typeof installers)[number]["id"]>("paru");

const saverViews = [
  { value: "saver", label: "Screensaver" },
  { value: "lock", label: "Lock" },
] as const;
const saverView = ref<(typeof saverViews)[number]["value"]>("saver");

const features = [
  { title: "A screensaver in every theme", text: "When you step away, your lock theme fades in with only its background and its animation. After a grace period you choose, it becomes the lock without a flicker." },
  { title: "Type straight away", text: "The first key you press on the screensaver brings the lock back and lands in the password field. With several monitors, what you type shows on every one." },
  { title: "Idle, set up for you", text: "The GUI tells you whether hypridle is installed and running, writes its config, shows the idle, lock, screen-off and suspend times as one timeline, and names any shell timer that would act too." },
  { title: "Light on your machine", text: "Nothing runs while you work. Videos play through libmpv on your graphics card, with smaller copies or still frames if you want them, and stop while the screens are off." },
  { title: "Make it yours", text: "Your own image, GIF, video or desktop wallpaper behind a theme, colours picked or generated from it the way Material You does, your fonts, and your animation speed." },
  { title: "Light and dark", text: "Seven themes have a second look designed for them, not filtered from them, and can follow your desktop's light or dark mode." },
  { title: "Wallpapers, set for you", text: "Browse your folder and free wallpapers from Wallhaven, Bing, NASA and Wikimedia Commons, never anything sexual, and set one through whatever draws your desktop: DankMaterialShell, Omarchy, hyprpaper, swww, swaybg and more." },
  { title: "One config file", text: "~/.config/darwan/config.toml holds everything and keeps your comments. Each theme says what it supports, and options it can't use are shown disabled with the reason." },
  { title: "Try without locking", text: "A live preview that shows each change before you save it, full-screen previews of the lock and the screensaver with a mock password, SDDM's own test mode, and headless checks that type the password for you." },
  { title: "Never locked out", text: "If a theme fails to load, you get a plain password prompt. If the lockscreen crashes, a new one takes the lock back within a second or two, and neither a crash, the screens turning off nor sleep ever shows your desktop." },
  { title: "Your clock, everywhere", text: "12- or 24-hour time, AM/PM and a date format apply to every theme that shows them." },
  { title: "Root only where it must be", text: "A small helper writes SDDM's files through polkit and checks every value again. Nothing else runs as root." },
];
</script>

<template>
  <section class="relative -mt-16 flex min-h-[max(40rem,100svh)] items-center overflow-hidden pt-16">
    <ThemeWall />
    <div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div class="max-w-xl">
        <div class="rise flex items-center gap-5">
          <img src="/darwan.svg" alt="" class="size-16 drop-shadow-[0_14px_30px_#2a63ec66] sm:size-20" />
          <h1 class="text-7xl leading-[0.9] font-bold tracking-[-0.04em] text-bright sm:text-8xl">Darwan</h1>
        </div>
        <p class="rise mt-5 text-dim" style="--step: 1">
          <span lang="bn" class="mr-1 font-bangla text-xl text-violet">দারোয়ান</span>
          is Bangla for gatekeeper.
        </p>
        <p class="rise mt-8 text-3xl leading-tight font-medium tracking-tight text-ink sm:text-4xl" style="--step: 2">
          Hand-crafted themes for<br />
          <span class="text-gate">both of your gates.</span>
        </p>
        <p class="rise mt-6 max-w-md text-lg leading-relaxed text-dim" style="--step: 3">
          Choose, customise, preview and apply {{ themes.length }} themes to your SDDM login screen, your Quickshell
          lockscreen and your screensaver, from one app on Arch Linux.
        </p>
        <CopyCommand command="paru -S darwan-bin" class="rise mt-10 max-w-sm" style="--step: 4" />
        <div class="rise mt-5 flex flex-wrap gap-3" style="--step: 5">
          <RouterLink
            to="/themes"
            class="rounded-xl bg-bright px-5 py-3 font-medium text-night transition-colors hover:bg-white light:hover:bg-ink"
          >
            Browse the themes
          </RouterLink>
          <RouterLink
            to="/docs/quick-start"
            class="rounded-xl px-5 py-3 font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface hover:text-bright"
          >
            Quick start
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
    <div class="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
      <figure>
        <div class="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          <img
            :src="featured.animation"
            :alt="`${featured.name} unlocking: the password is typed and the theme plays its unlock animation.`"
            width="1920"
            height="1080"
            loading="lazy"
            class="aspect-video w-full bg-cover object-cover"
            :style="{ backgroundImage: `url(${featured.still})` }"
          />
        </div>
        <figcaption class="mt-3 text-sm text-dim">
          <RouterLink :to="`/themes/${featured.id}`" class="hover:text-bright">
            {{ featured.family ? `${featured.family} ${featured.name}` : featured.name }}
          </RouterLink>
        </figcaption>
      </figure>
      <div>
        <h2 class="text-4xl font-semibold tracking-tight text-bright">Two gates, one theme</h2>
        <dl class="mt-8 space-y-7">
          <div class="border-l-2 border-blue pl-5">
            <dt class="text-lg font-medium text-bright">The login screen</dt>
            <dd class="mt-1 leading-relaxed text-dim">
              SDDM shows it when your computer starts. <code class="font-mono text-sm text-ink">darwan sddm apply</code>
              puts your theme there, and <code class="font-mono text-sm text-ink">darwan sddm reset</code> takes it back.
            </dd>
          </div>
          <div class="border-l-2 border-violet pl-5">
            <dt class="text-lg font-medium text-bright">The lockscreen</dt>
            <dd class="mt-1 leading-relaxed text-dim">
              Quickshell shows it when you lock. Bind a key to
              <code class="font-mono text-sm text-ink">darwan lock</code> and the same theme guards your session.
            </dd>
          </div>
          <div class="border-l-2 border-green pl-5">
            <dt class="text-lg font-medium text-bright">When you step away</dt>
            <dd class="mt-1 leading-relaxed text-dim">
              The theme fades in as your screensaver, only its background and animation, and becomes the lock when its
              grace period ends.
            </dd>
          </div>
        </dl>
        <p class="mt-8 leading-relaxed text-dim">
          Use one theme for both, or a different one for each. Your settings reach both screens, because they come from
          the same file, and your own background and fonts go with them.
        </p>
      </div>
    </div>

    <ul class="mt-24 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="f in features" :key="f.title">
        <h3 class="font-medium text-bright">{{ f.title }}</h3>
        <p class="mt-2 leading-relaxed text-dim">{{ f.text }}</p>
      </li>
    </ul>
  </section>

  <section class="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
    <div class="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
      <div>
        <h2 class="text-4xl font-semibold tracking-tight text-bright">A screensaver that is your lock</h2>
        <p class="mt-4 text-lg leading-relaxed text-dim">
          Go idle and your theme fades in without its widgets: the rain, the drifting ash, the turning dial. Come back
          within the grace period and any key fades it away. Stay away, and the same running theme becomes the lock.
        </p>
        <ul class="mt-8 space-y-4 leading-relaxed text-dim">
          <li>
            <span class="text-bright">Type your password straight away.</span> The first key brings the widgets in and
            lands in the password field, on every monitor.
          </li>
          <li>
            <span class="text-bright">Screens off and sleep stay safe.</span> A lock nobody touches turns the screens
            off, and waking shows your desktop or the password prompt, never the screensaver. A locked screensaver
            unloads its theme while the screens are off.
          </li>
          <li>
            <span class="text-bright">Set up in the GUI.</span> ⚙ → Screensaver installs and starts hypridle with you,
            writes its config, and picks how much video your machine plays.
          </li>
        </ul>
        <div class="mt-8 space-y-2">
          <CopyCommand command="darwan preview pixel-rainyroom --saver" />
        </div>
        <RouterLink to="/docs/screensaver" class="mt-4 inline-block text-blue underline-offset-4 hover:underline">
          Turn on the screensaver
        </RouterLink>
      </div>
      <figure>
        <div class="relative overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          <div class="stack">
            <img
              v-for="v in saverViews"
              :key="v.value"
              :src="`/screens/saver-${v.value}.webp`"
              :alt="v.value === 'saver'
                ? 'Rainy Room as the screensaver: the rainy room and its falling rain, without the clock or the password field.'
                : 'Rainy Room as the lock: the clock, the password field and the power buttons over the same room.'"
              width="1280"
              height="720"
              loading="lazy"
              class="aspect-video w-full object-cover transition-opacity duration-500"
              :class="saverView === v.value ? 'opacity-100' : 'opacity-0'"
            />
          </div>
          <div class="absolute right-4 bottom-4 shadow-lg">
            <SegmentedControl v-model="saverView" :options="[...saverViews]" label="Show" kind="radios" />
          </div>
        </div>
        <figcaption class="mt-3 text-sm text-dim">
          <RouterLink to="/themes/pixel-rainyroom" class="hover:text-bright">Pixel Rainy Room</RouterLink>, as the
          screensaver and as the lock
        </figcaption>
      </figure>
    </div>
  </section>

  <section class="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div class="max-w-xl">
        <h2 class="text-4xl font-semibold tracking-tight text-bright">One app, three ways in</h2>
        <p class="mt-4 text-lg leading-relaxed text-dim">
          The GUI, the TUI and the CLI share one core and one config file, so they always agree.
        </p>
      </div>
      <SegmentedControl
        v-model="face"
        :options="faces.map((f) => ({ value: f.id, label: f.label }))"
        label="Ways to use Darwan"
        kind="tabs"
        id="face"
        class="self-start sm:self-auto"
      />
    </div>

    <!-- Panels share one grid cell, so the section keeps the tallest one's height and never jumps. -->
    <div class="stack mt-8">
      <div
        v-for="f in faces"
        :key="f.id"
        :id="`face-${f.id}-panel`"
        role="tabpanel"
        :aria-labelledby="`face-${f.id}`"
        :inert="face !== f.id"
        class="flex flex-col transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
        :class="face === f.id ? 'opacity-100' : 'pointer-events-none translate-y-2 scale-[.99] opacity-0'"
      >
        <div class="flex-1 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
          <img
            v-if="f.id !== 'cli'"
            :src="`/screens/${f.id}.webp`"
            :alt="f.id === 'gui' ? 'The Darwan GUI: a theme open full-window and live, with its settings beside it.' : 'The Darwan TUI in a terminal, with a theme preview.'"
            width="1910"
            height="1070"
            loading="lazy"
            class="w-full"
          />
          <pre
            v-else
            class="h-full overflow-x-auto p-6 font-mono text-xs leading-relaxed text-ink sm:text-sm"
          ><span class="text-dim">$</span> <span class="text-bright">darwan list</span>
<span class="font-bold text-violet">Clockwork</span> <span class="text-dim">· 3</span>
     <span class="text-blue">clockwork/neo-orbital</span>  Neo-Orbital     <span class="text-violet">light · dark</span>
     <span class="text-blue">clockwork/orbital</span>      Orbital         <span class="text-violet">light · dark</span>
<span class="font-bold text-violet">Pixel</span> <span class="text-dim">· 11</span>
   <span class="font-bold text-blue">S</span> <span class="text-blue">pixel-emerald</span>          Emerald
  <span class="font-bold text-violet">L</span>  <span class="text-blue">pixel-rainyroom</span>        Rainy Room
<span class="font-bold text-violet">Other</span> <span class="text-dim">· 26</span>
     <span class="text-blue">genshin</span>                Genshin Impact  <span class="font-bold text-amber">1 font missing</span>
     <span class="text-blue">nothing</span>                Nothing         <span class="text-violet">light · dark</span>
     <span class="text-dim">…</span>

<span class="text-dim">$</span> <span class="text-bright">darwan set pixel-rainyroom.background desktop</span>
<span class="text-blue">pixel-rainyroom.background</span> = <span class="text-green">desktop</span>
<span class="text-dim">$</span> <span class="text-bright">darwan doctor</span>
<span class="font-bold text-violet">Lockscreen</span>
<span class="font-bold text-green">ok   </span> Wayland session wayland-1
<span class="font-bold text-green">ok   </span> Hyprland misc:allow_session_lock_restore is on
<span class="font-bold text-green">ok   </span> desktop wallpaper: ~/Pictures/Wallpapers/horizons.png (DMS)

<span class="font-bold text-violet">Themes</span>
<span class="font-bold text-green">ok   </span> 40 themes in /usr/share/darwan/themes
<span class="font-bold text-amber">warn </span> genshin: font HYWenHei-85W missing … <span class="text-dim">darwan font import genshin &lt;file&gt;</span>

<span class="font-bold text-violet">SDDM</span>
<span class="font-bold text-green">ok   </span> SDDM uses darwan

<span class="font-bold text-green">No problems that stop darwan from working.</span></pre>
        </div>
        <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="max-w-2xl leading-relaxed text-dim">{{ f.text }}</p>
          <RouterLink to="/docs/usage" class="shrink-0 text-blue underline-offset-4 hover:underline">How to use it</RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
    <div class="grid gap-12 rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-10 lg:grid-cols-2">
      <div>
        <h2 class="text-4xl font-semibold tracking-tight text-bright">Install from the AUR</h2>
        <p class="mt-4 max-w-md leading-relaxed text-dim">
          Darwan runs on Arch Linux with Qt6 SDDM and Quickshell on Wayland. Your AUR helper pulls in everything it
          needs.
        </p>
        <p class="mt-6 text-sm text-dim">
          Prefer to compile it yourself? Install <code class="font-mono text-ink">darwan</code> instead of
          <code class="font-mono text-ink">darwan-bin</code>.
        </p>
        <RouterLink to="/docs/install" class="mt-3 inline-block text-sm text-blue underline-offset-4 hover:underline">
          Dependencies, installed files and uninstalling
        </RouterLink>
      </div>
      <div>
        <SegmentedControl
          v-model="installer"
          :options="installers.map((i) => ({ value: i.id, label: i.label }))"
          label="Install with"
          @update:model-value="(v: string) => track('Install method', { method: v })"
          kind="tabs"
          id="install"
          mono
          class="w-fit"
        />
        <div class="stack mt-4">
          <div
            v-for="i in installers"
            :key="i.id"
            :id="`install-${i.id}-panel`"
            role="tabpanel"
            :aria-labelledby="`install-${i.id}`"
            :inert="installer !== i.id"
            class="space-y-2 self-start transition duration-300"
            :class="installer === i.id ? 'opacity-100' : 'pointer-events-none opacity-0'"
          >
            <CopyCommand v-for="c in i.commands" :key="c" :command="c" />
          </div>
        </div>
        <p class="mt-8 text-dim">Then check your system, and try a theme without locking anything:</p>
        <div class="mt-3 space-y-2">
          <CopyCommand command="darwan doctor" />
          <CopyCommand command="darwan preview pixel-coffee" />
        </div>
        <p class="mt-3 text-sm text-dim">
          Type <code class="font-mono text-ink">test</code> to unlock the preview.
          <RouterLink to="/docs/quick-start" class="text-blue underline-offset-4 hover:underline">The quick start</RouterLink>
          takes it from there.
        </p>
      </div>
    </div>
  </section>

  <section class="mx-auto mt-32 max-w-3xl px-4 text-center sm:px-6">
    <h2 class="text-3xl font-semibold tracking-tight text-bright">Built on qylock</h2>
    <p class="mt-5 text-lg leading-relaxed text-dim">
      Every theme here was designed and built by
      <a href="https://github.com/Darkkal44" class="text-ink underline underline-offset-4">Darkkal44</a> in
      <a href="https://github.com/Darkkal44/qylock" class="text-ink underline underline-offset-4">qylock</a>: the pixel
      worlds, the game tributes, Clockwork, and the shim that runs one theme in both places. Darwan builds an app around
      that work.
    </p>
    <RouterLink to="/credits" class="mt-6 inline-block text-blue underline-offset-4 hover:underline">
      Credits for the themes, wallpapers and fonts
    </RouterLink>
  </section>
</template>
