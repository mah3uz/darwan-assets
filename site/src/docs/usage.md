# Usage

Darwan is one app with three faces. `darwan` with a command is the CLI, `darwan` alone opens the TUI, and `darwan-gui` is the GUI. They share the same core and the same config file, so they behave identically.

## CLI

| Command | What it does |
|:--|:--|
| `darwan` | open the TUI |
| `darwan list` | list the themes; `L` marks the lock theme, `S` the SDDM theme |
| `darwan show <theme>` | a theme's details, fonts and settings |
| `darwan get [key]`, `set <key> <value>`, `unset <key>` | read, change or reset a setting, e.g. `darwan set clock.format 12h` |
| `darwan unset <theme>` | put every setting of one theme back to its default |
| `darwan lock [theme]` | lock the screen now (default: the `[lock]` theme) |
| `darwan preview [theme]` | full-screen preview, no real lock; `--saver` shows the screensaver ([details](/docs/preview)) |
| `darwan saver` | start the [screensaver](/docs/screensaver) now, as hypridle does when you're idle |
| `darwan resumed` | record a wake from sleep, for hypridle's `after_sleep_cmd` |
| `darwan check <theme>… \| --all` | headless test: QML errors, missing fonts, and whether typing the password unlocks |
| `darwan sddm apply`, `preview`, `status`, `reset` | manage the login screen ([details](/docs/login-screen)) |
| `darwan font import <theme> <file>` | install a licensed font a theme needs |
| `darwan wallpaper set <file> [-o DP-1]` | set the desktop wallpaper through whatever draws it ([details](/docs/wallpapers)) |
| `darwan wallpaper status`, `list`, `prepare`, `online` | what draws it; your folder; thumbnails ahead of time; browse and download online |
| `darwan doctor` | check the session, Quickshell, fonts, the helper and SDDM's config |
| `darwan completion bash\|zsh\|fish` | print the tab-completion script for your shell |

Setting keys are `lock.theme`, `sddm.theme`, `clock.format`, `clock.show_ampm`, `date.format`, the screensaver's `saver.*`, the [wallpaper](/docs/wallpapers) pages' `wallpaper.*`, `gui.look`, `<theme>.<option>` for a theme's own options, and `<theme>.<setting>` for [customisations](/docs/customise) such as `pixel-coffee.background` or `nothing.variant`.

Tab completion offers theme ids, setting keys and each key's values. Load it when your shell starts, so it stays in step with the installed version:

```sh
echo 'source <(darwan completion zsh)' >> ~/.zshrc                    # zsh
echo 'source <(darwan completion bash)' >> ~/.bashrc                  # bash
echo 'darwan completion fish | source' >> ~/.config/fish/config.fish  # fish
```

## TUI

Run `darwan` in a terminal. Themes are grouped into Clockwork, Pixel and Other themes, with a still preview of the selected one (kitty, sixel or iTerm graphics, falling back to block characters). Keys that can't work on your system are greyed out and say why.

| Key | Action | Key | Action |
|:--|:--|:--|:--|
| `⏎` `→` | settings for the theme | `/` | search by name or id |
| `p` | preview as the lockscreen | `P` | preview with the SDDM layout |
| `l` | use as the lock theme | `L` | lock now |
| `s` | apply to the SDDM login screen | `S` | preview in SDDM's test mode |
| `f` | import a missing font | `c` | check the theme |
| `a` | preview the screensaver | `d` | doctor |
| `?` | all keys | `q` | quit |

## GUI

Run `darwan-gui`, or open *Darwan* from your launcher.

![The start screen: your lockscreen theme behind its name, both gates side by side, and every theme as a card below.](/screens/gui-wall.webp)

**The start screen** opens on your lockscreen theme, filling the window behind its name, with *Customise* and *Lock now*. The two cards under it are your gates, the lockscreen and the login screen: click the login screen to feature it instead (with *Test*), and hover either to watch it unlock. Then every theme as a card: hover one, or move to it with the arrow keys, to watch it unlock. The chips filter by family, video backgrounds, themes that bring their own font, or the ones in use; `Ctrl+F` searches. **Doctor** at the top turns amber when something needs a look, and runs the full check when clicked.

![A theme open: the live theme fills the window, with its settings beside it.](/screens/gui.webp)

**Open a theme** and it fills the window, live: click it and type `test` to unlock. `←` `→` step through the themes (or hover near the bottom for a strip of them), *Lockscreen* / *Login screen* shows it as each host would, and the bars step aside while you look. At the bottom: *Try* (full screen, the screensaver, SDDM's own greeter, or lock now), *Check*, *Compare changes* once you've changed it (hold it, or `\`, to see it as it ships) and *Use as…*, which puts it on the lockscreen, the login screen or both. `Esc` goes back to the start screen. A theme you've opened before comes back at once.

**The settings** sit beside it (`Ctrl+I` hides them): *This theme* for its background, look, colours, fonts, motion and [customisations](/docs/customise), *All themes* for the clock and date. The preview shows every change at once; nothing is written until *Save* (`Ctrl+S`), and *Discard* goes back. Closing the window or running a command with unsaved changes asks you to save or discard first. Drop an image or video on the preview to use it as the background. A colour opens a picker: the theme's own, generated from the background, or your own from a colour wheel, a pasted code or swatches. *Reset* in the ⋯ menu puts every setting of the theme back to its default, unsaved until you press *Save*.

**Wallpapers**: *Home*, *Library* and *Explore* in the pill at the top show your wallpaper folder and free wallpapers online; open one and *Set Wallpaper* ([Wallpapers](/docs/wallpapers)).

**⚙** holds the look (Darwan's own, the default, or your system's Qt theme, `gui.look`, saved as you pick), the clock and date, and the [screensaver](/docs/screensaver).

## Lockscreen keybind

*Use as… → Lockscreen* only chooses the theme. To lock with Darwan, point your lock keybind and idle locker at `darwan lock`, and let a new locker take over if one ever crashes. Using DankMaterialShell, Noctalia, Caelestia, illogical-impulse or Omarchy? They have a lockscreen of their own; [Desktop shells](/docs/shells) shows how to hand it to Darwan. In Hyprland's Lua config:

```lua
hl.config({ misc = { allow_session_lock_restore = true } })
hl.bind("SUPER + L", hl.dsp.exec_cmd("darwan lock"), { desc = "Lock" })
```

or in a classic `hyprland.conf`:

```ini
misc {
    allow_session_lock_restore = true
}
bind = SUPER, L, exec, darwan lock
```

For hypridle, lock with Darwan and let sleep wait until the lock is up:

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
```

The listener starts the [screensaver](/docs/screensaver) after five minutes idle, and the GUI's screensaver settings
(⚙ → *Screensaver*) write all of this for you.

`inhibit_sleep = 3` matters: hypridle's default waits for the lock only when the command is hyprlock, so without it the machine can go to sleep before Darwan's lock is on screen. `darwan doctor` checks this.

Pressing the keybind while already locked does nothing, because only one lockscreen runs at a time, and `darwan lock` refuses to lock while `allow_session_lock_restore` is off. If the lockscreen crashes, for example when a monitor drops out during sleep, Darwan starts a new one by itself within a second or two and it takes the lock back; your desktop never shows.
