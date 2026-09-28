# Screensaver

Every Darwan theme is also a screensaver. When you step away, your lock theme fades in over the desktop with only its
background and its animation: the rain in Rainy Room, the drifting ash in Hollow Knight, Orbital's turning dial. No
clock card, no password field. Come back, press any key, and the lock's widgets slide in with that key already typed
into the password field.

## What it does

| When | What you see |
|:--|:--|
| You go idle | the screensaver fades in over your desktop |
| You come back within the grace period | any key or click fades it away, straight back to your desktop, no password |
| The grace period ends | it locks without a flicker: the same running theme becomes the lockscreen |
| You press a key on the locked screensaver | the widgets come in, and the key lands in the password field |
| You wake the lock and leave it | after 30 seconds it goes back to the screensaver; at the next idle timeout it does so even with a half-typed password, which it forgets |
| The screens turn off | an unlocked screensaver ends, so waking shows your desktop; a locked one swaps its theme for a black lock, so waking shows the password prompt |
| The machine sleeps and wakes | the lock and its password prompt, never the screensaver |
| You have several monitors | the theme runs on every screen, and what you type shows on all of them |

The grace period is `saver.lock_after`: 10 seconds unless you change it, `0` to lock the moment the screensaver
appears, or `never` for a screensaver that never locks.

## Turn it on

The screensaver starts from **hypridle**, Hyprland's idle daemon. The quickest way is the GUI: open *Darwan*, click
**Screensaver** at the top right, and follow what it says.

1. **hypridle missing?** It shows the command to install it:

   ```sh
   sudo pacman -S hypridle
   ```

2. **hypridle not running?** It shows how to start it with your session, for your setup, and a **Start now** button
   for the current one. In a session started by uwsm:

   ```sh
   systemctl --user enable --now hypridle.service
   ```

   Otherwise from Hyprland's config, in Lua:

   ```lua
   hl.on("hyprland.start", function()
       hl.exec_cmd("hypridle")
   end)
   ```

   or `exec-once = hypridle` in a classic `hyprland.conf`.

3. **No hypridle config?** **Enable the screensaver** writes `~/.config/hypr/hypridle.conf` for you. If you have one
   already, the window changes it in place, keeps your own lines and comments, and restarts hypridle so each change
   applies.

4. **Turn your shell's own idle lock off**, if it has one ([Desktop shells](/docs/shells#the-screensaver)), or both
   answer when you go idle.

Then run `darwan doctor`: its *Screensaver* section checks each of these.

### By hand

This is what **Enable** writes, for Hyprland's Lua config:

```ini
general {
    lock_cmd = darwan lock
    before_sleep_cmd = loginctl lock-session
    after_sleep_cmd = darwan resumed; hyprctl dispatch 'hl.dsp.dpms({ action = "on" })'
    inhibit_sleep = 3
}

listener {
    timeout = 300
    on-timeout = darwan saver
}

listener {
    timeout = 600
    on-timeout = hyprctl dispatch 'hl.dsp.dpms({ action = "off" })'
    on-resume = hyprctl dispatch 'hl.dsp.dpms({ action = "on" })'
}
```

With a classic `hyprland.conf`, the screen commands are `hyprctl dispatch dpms off` and `hyprctl dispatch dpms on`.
hypridle reads its config once, so restart it after editing: `systemctl --user restart hypridle.service`, or quit it
and start it again.

| Line | Why |
|:--|:--|
| `on-timeout = darwan saver` | starts the screensaver after five minutes idle |
| `lock_cmd = darwan lock` | `loginctl lock-session`, power menus and your keybind show your theme |
| `before_sleep_cmd = loginctl lock-session` | locks before the machine sleeps |
| `inhibit_sleep = 3` | holds sleep until the lock is on screen; hypridle's default only waits for hyprlock |
| `after_sleep_cmd = darwan resumed; …` | tells Darwan the machine woke, so opening a lid without touching anything doesn't bring the screensaver straight back, and turns the screens on so one key is enough |
| the screen-off listener | turns the screens off five minutes after the screensaver starts; keep your own if you have one |

## Settings

Both are in the GUI's Screensaver window, and in `~/.config/darwan/config.toml`:

```toml
[saver]
lock_after = 10     # seconds of grace before it locks; 0 locks at once, "never" never locks
quality = "full"    # "full" | "auto" | "eco" | "still"
```

`quality` decides what the theme videos play:

| `quality` | Videos | What it costs |
|:--|:--|:--|
| `full` (the default) | as shipped, on every monitor | the smoothest, and the most GPU work, power and memory: a 4K video theme takes about 4% of one CPU core and 1 GB |
| `auto` | chosen for this machine: full on a dedicated GPU with a video decoder; the smaller copies on integrated graphics, on battery, without a decoder driver or with under 8 GB of memory; still frames in power-saver mode or without a GPU | follows the power source, so a laptop saves battery on its own |
| `eco` | copies at up to 1080p and 30 fps | about a quarter of the decoding work; softer on large screens |
| `still` | the first frame of each video | almost nothing; the theme's other animations, such as rain, particles and dials, still play |

The smaller copies are made once, in the background at the lowest priority, when you pick a theme or a background,
never while you're idle. They're kept in `~/.cache/darwan/media`. Except with `full`, only the monitor you used last
plays video; the others show its first frame. `darwan doctor` says which quality your machine gets, and why.

## Try it

Without waiting for idle, and without locking anything:

```sh
darwan preview pixel-rainyroom --saver
```

It starts as the screensaver. Press a key to bring the widgets in, type `test` to unlock, or wait 30 seconds and it goes
back to the screensaver; `Ctrl+Q` closes it. The GUI's **Screensaver preview** button and `a` in the TUI do the same for
the selected theme. To start the real one now, run `darwan saver`.

## Videos and your own backgrounds

Theme videos, and your own video or animated GIF as a [background](/docs/customise#background), play through libmpv on
the graphics card that draws your desktop, Intel, AMD or NVIDIA, without copying frames through memory. An animated GIF
or WebP gets a video copy the first time you choose it, so it too decodes on the GPU instead of frame by frame on the
CPU. On the login screen, SDDM plays them with Qt's own player as before.

A video pauses whenever it's hidden, and a locked screensaver unloads its theme while the screens are off: no decoding
and no drawing until you come back.

## Troubleshooting

**It never starts.** Run `darwan doctor`. hypridle has to be running (the GUI's Screensaver window says whether it
is), and its config needs the `darwan saver` listener. Video playing in a browser or a player keeps idle off on purpose,
and hypridle respects that.

**A key went nowhere.** A key pressed in the fraction of a second while the screensaver hands over to the lock can be
lost. Press it again.

**Two lockscreens fight.** Your shell still locks on idle. Turn its idle lock off and let hypridle do it
([Desktop shells](/docs/shells#the-screensaver)).

**It came back straight after I opened the lid.** hypridle's `after_sleep_cmd` needs `darwan resumed`; the GUI's
**Fix** button adds it.

**One theme looks wrong.** `darwan check <theme>` loads it offscreen, sends it into the screensaver and unlocks it from
there. [Open an issue](https://github.com/mah3uz/darwan/issues) with what it prints.

## Commands

| Command | What it does |
|:--|:--|
| `darwan saver` | start the screensaver now; while a lock is up, send that lock back to the screensaver |
| `darwan resumed` | record a wake from sleep, for hypridle's `after_sleep_cmd` |
| `darwan preview <theme> --saver` | preview the screensaver without locking |
| `darwan lock` | lock now; while the screensaver runs, it locks that one |
