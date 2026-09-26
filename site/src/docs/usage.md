# Usage

Darwan is one app with three faces. `darwan` with a command is the CLI, `darwan` alone opens the TUI, and `darwan-gui` is the GUI. They share the same core and the same config file, so they behave identically.

## CLI

| Command | What it does |
|:--|:--|
| `darwan` | open the TUI |
| `darwan list` | list the themes; `L` marks the lock theme, `S` the SDDM theme |
| `darwan show <theme>` | a theme's details, fonts and settings |
| `darwan get [key]`, `set <key> <value>`, `unset <key>` | read, change or reset a setting, e.g. `darwan set clock.format 12h` |
| `darwan lock [theme]` | lock the screen now (default: the `[lock]` theme) |
| `darwan preview [theme]` | full-screen preview, no real lock ([details](/docs/preview)) |
| `darwan check <theme>… \| --all` | headless test: QML errors, missing fonts, and whether typing the password unlocks |
| `darwan sddm apply`, `preview`, `status`, `reset` | manage the login screen ([details](/docs/login-screen)) |
| `darwan font import <theme> <file>` | install a licensed font a theme needs |
| `darwan doctor` | check the session, Quickshell, fonts, the helper and SDDM's config |
| `darwan completion bash\|zsh\|fish` | print the tab-completion script for your shell |

Setting keys are `lock.theme`, `sddm.theme`, `clock.format`, `clock.show_ampm`, `date.format` and `<theme>.<option>`.

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
| `d` | doctor | `?` `q` | all keys, quit |

## GUI

Run `darwan-gui`, or open *Darwan* from your launcher. On the left is the theme gallery with search; in the centre, a live preview that reloads as you change settings (click it and type `test` to unlock); on the right, the theme's settings, saved as you change them.

Below the preview: *Use for lock*, *Lock now*, *Full-screen preview*, *Apply to SDDM*, *SDDM test mode* and *Check*, plus *Import…* for missing fonts. *Doctor* is at the top right. The *Lockscreen* / *Login screen layout* switch shows the theme as each host would.

## Lockscreen keybind

*Use for lock* only chooses the theme. To lock with Darwan, point your lock keybind and idle locker at `darwan lock`, and let a new locker take over if one ever crashes. In Hyprland's Lua config:

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

For hypridle, set `lock_cmd = darwan lock`. Pressing the keybind while already locked does nothing, because only one lockscreen runs at a time, and `darwan lock` refuses to lock while `allow_session_lock_restore` is off.
