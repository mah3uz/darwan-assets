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
return_after = 30       # seconds an untouched lock keeps its widgets before the screensaver comes back; 5 or more
screen_off_locked = 300 # seconds an untouched lock keeps the screens on, or "never"; 10 or more (Hyprland)
quality = "full"        # "full" | "auto" | "eco" | "still"

[gui]
look = "darwan"         # "darwan" | "system" to follow your Qt theme's colours and font

[wallpaper]
folder = "~/Pictures/Wallpapers"
allow = ["anime", "games"]   # optional groups to show online; sexual content is never shown
colours = ["matugen"]        # run after each wallpaper change

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

| Setting | Default | Does |
|:--|:--|:--|
| `saver.lock_after` | `10` | seconds of grace before the screensaver locks; `0` locks at once, `never` never locks |
| `saver.return_after` | `30` | seconds a lock left untouched keeps its widgets before the screensaver comes back; `5` or more |
| `saver.screen_off_locked` | `300` | seconds a lock left untouched keeps the screens on, or `never`; `10` or more, on Hyprland |
| `saver.quality` | `full` | what its videos play: `full` as shipped, `auto` chosen from your hardware and power, `eco` smaller copies, `still` a still frame |

[Screensaver](/docs/screensaver) explains them; they apply to every theme.

## Wallpapers

`wallpaper.folder` is where your wallpapers live, `wallpaper.allow` which optional groups show online, `wallpaper.restart`
the wallpaper tools Darwan may restart without asking, and `wallpaper.colours` the colour generators to run after each
change. [Wallpapers](/docs/wallpapers) lists their values.

## The GUI's look

`gui.look` is the GUI's own look: `darwan`, its greys and blue with frosted glass over a blurred theme, or `system` to
follow your Qt theme's colours and font. ⚙ → *Appearance* in the GUI sets it.

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
