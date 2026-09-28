# Configuration

Everything lives in `~/.config/darwan/config.toml`. The CLI, TUI and GUI all edit this file and keep your comments. You can also edit it by hand. Nothing inside the theme folders is ever edited.

```toml
[lock]
theme = "clockwork/orbital"

[sddm]
theme = "pixel-rainyroom"

[clock]
format = "12h"          # "12h" | "24h"; unset, each theme keeps its own
show_ampm = false

[date]
format = "ddd, MMM d"   # one of the presets below; unset, each theme keeps its own

[saver]
lock_after = 10         # seconds from the screensaver to the lock; 0 locks at once, "never" never locks
quality = "full"        # "full" | "auto" | "eco" | "still"

[themes."clockwork/orbital"]
variant = "light"       # a customisation, see below
enableWindup = false    # one of Orbital's own options
accent = "#7aa2f7"

[themes.terraria]
background_mode = "static"
background_index = "3"
```

## Global settings

The clock settings reach the 38 themes that show a clock and the date setting the 37 that show a date: Nine Sols and Terraria show neither, and osu! has no date. Left unset, each theme keeps its own design.

| `date.format` | Looks like |
|:--|:--|
| `dddd, MMMM d` | Saturday, September 26 |
| `ddd, MMM d` | Sat, Sep 26 |
| `d MMMM yyyy` | 26 September 2026 |
| `yyyy-MM-dd` | 2026-09-26 |
| `dd/MM/yyyy` | 26/09/2026 |
| `MM/dd/yyyy` | 09/26/2026 |

## Screensaver

`saver.lock_after` is the grace period before the screensaver locks (10 seconds), and `saver.quality` what its videos
play: `full` as shipped, `auto` chosen from your hardware and power, `eco` smaller copies, `still` a still frame.
[Screensaver](/docs/screensaver) explains both; they apply to every theme.

## Per-theme options

Each theme declares what it supports. Options a theme can't use are shown disabled with the reason, and options that depend on another option unlock when it's set.

| Theme | Option | Values |
|:--|:--|:--|
| Clockwork Orbital | `enableWindup` | `true` `false` |
| osu!, osu! mania | `gameMode` | `menu` (straight to password), `game` (rhythm-game gate) |
| Genshin Impact | `background_mode`, `background_index` | `time` `random` `static`; `1`–`4` (day, night, dawn, dusk) |
| Terraria | `background_mode`, `background_index` | `time` `random` `static`; `1`–`5` |

`darwan show <theme>` always lists the current set.

## Customisations

Background, colours, fonts, the light or dark look and animation speed are settings with the same names in every
theme, such as `background`, `accent`, `variant` and `motion_speed`, set in the same `[themes."<theme>"]` section.
[Customise](/docs/customise) lists them all, with their values.
