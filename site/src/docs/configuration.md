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

[themes."clockwork/orbital"]
themeMode = "light"
enableWindup = false

[themes.terraria]
background_mode = "static"
background_index = "3"
```

## Global settings

The clock settings reach the 39 themes that show a clock and the date setting the 38 that show a date: Nine Sols and Terraria show neither, and osu! has no date. Left unset, each theme keeps its own design.

| `date.format` | Looks like |
|:--|:--|
| `dddd, MMMM d` | Saturday, September 26 |
| `ddd, MMM d` | Sat, Sep 26 |
| `d MMMM yyyy` | 26 September 2026 |
| `yyyy-MM-dd` | 2026-09-26 |
| `dd/MM/yyyy` | 26/09/2026 |
| `MM/dd/yyyy` | 09/26/2026 |

## Per-theme options

Each theme declares what it supports. Options a theme can't use are shown disabled with the reason, and options that depend on another option unlock when it's set.

| Theme | Option | Values |
|:--|:--|:--|
| Clockwork Orbital | `themeMode` | `dark` `light` |
| Clockwork Orbital | `enableWindup` | `true` `false` |
| Clockwork Tape | `themeMode` | `dark` `light` |
| osu!, osu! mania | `gameMode` | `menu` (straight to password), `game` (rhythm-game gate) |
| Genshin Impact | `background_mode`, `background_index` | `time` `random` `static`; `1`–`4` (day, night, dawn, dusk) |
| Terraria | `background_mode`, `background_index` | `time` `random` `static`; `1`–`5` |

`darwan show <theme>` always lists the current set.
