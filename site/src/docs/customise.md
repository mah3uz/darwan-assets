# Customise

Every theme can take your own background, colours, fonts and animation speed, through settings that have the same
names in every theme. Each theme says which of them its design allows: the [theme gallery](/themes) lists them, and so
does `darwan show <theme>`. Settings are per theme, so changing Rainy Room never touches Orbital.

## Try it live

The GUI is the easiest way. Open a theme and change anything in the settings beside it: the live preview shows it at
once, nothing is written until you press **Save** (`Ctrl+S`), and **Discard** goes back to what you had. Hold
**Compare changes** to see the theme as it ships. Drop an image or a video on the preview to make it the background.
If you close the window or run a command with unsaved changes, the GUI asks first. **Reset** in the ⋯ menu puts every
setting of the theme back to its default, in the same unsaved way.

A colour opens a picker with three choices: the theme's own, generated from the background, or a custom one from a
colour wheel, a pasted code, or swatches of the colours your background gives. Each choice shows in the preview at once;
**Cancel** or `Esc` puts back what you had.

The TUI and the CLI change the same settings. In the TUI, open a theme's settings with `⏎`; the arrow keys switch a
colour between the theme's own and generated, and a background between the theme's own and your desktop wallpaper, and
`⏎` lets you type a value; `R` twice resets the whole theme. From a shell:

```sh
darwan set pixel-rainyroom.background desktop
darwan set pixel-rainyroom.accent generate
darwan unset pixel-rainyroom.accent     # back to the theme's own
darwan unset pixel-rainyroom            # every setting of the theme
```

All three write to `~/.config/darwan/config.toml`, under the theme's own section:

```toml
[themes."pixel-rainyroom"]
background = "desktop"
background_dim = 25
accent = "generate"
color_scheme = "scheme-vibrant"
font_text = "JetBrainsMono Nerd Font"
motion_speed = 1.5
```

The lockscreen uses your settings the next time it locks. The login screen uses them after `darwan sddm apply`, which
also copies your background and font files for SDDM, because SDDM can't read your home folder.

## Background

| Setting | Values |
|:--|:--|
| `background` | a file: an image (`png` `jpg` `jpeg` `webp` `bmp`), an animated `gif` or a video (`mp4` `mkv` `webm` `mov`); `desktop` for your desktop wallpaper; or a colour like `#1e1e2e` |
| `background_fit` | `cover` fills the screen (the default); `contain` shows all of it |
| `background_dim` | `0` to `80`, the percentage to darken it by so text stays readable |

Videos and animated GIFs play through libmpv on your graphics card on the lockscreen and in the
[screensaver](/docs/screensaver). A GIF or WebP gets a video copy the first time you choose it, kept in
`~/.cache/darwan/media`, so it decodes on the GPU too instead of frame by frame on the CPU.

`desktop` finds whatever draws your wallpaper and uses its current file, so the lockscreen follows when you change it.
It knows [DankMaterialShell](https://github.com/AvengeMedia/DankMaterialShell), Omarchy, Caelestia, Noctalia,
hyprpaper, awww, swww, gSlapper, mpvpaper, swaybg and waypaper; `darwan doctor` shows which one it found. Where your
shell keeps a separate light and a dark wallpaper, the theme's look picks between them. For the login screen, run
`darwan sddm apply` again after changing wallpapers: SDDM gets a copy, not a link.

Genshin Impact, NieR: Automata and Terraria keep their own backgrounds, because the scene is part of their design.

## Colours

| Setting | Values |
|:--|:--|
| `accent` | a colour like `#e6bb5c`, or `generate` |
| `text_color` | a colour, or `generate` |
| the theme's own roles | some themes have more, such as Rainy Room's rain colour; `darwan show <theme>` lists them |
| `color_source` | what `generate` reads: `background` (the theme's background or yours, the default) or `desktop` (your wallpaper) |
| `color_scheme` | `scheme-tonal-spot` (the default), `scheme-vibrant`, `scheme-expressive`, `scheme-content`, `scheme-fidelity`, `scheme-monochrome`, `scheme-neutral`, `scheme-rainbow`, `scheme-fruit-salad` |
| `color_contrast` | `-1` to `1` |

`generate` picks colours from an image the way Android's Material You does, with the same algorithm and scheme names as
[matugen](https://github.com/InioX/matugen), so a desktop themed with matugen and your lockscreen match. **Material
You** goes further: it uses a whole Material palette. `generate` builds that palette from the background, and a colour
you pick replaces only its own part: a picked accent leads the accent colours while the background still gives the rest.
With nothing generated, a picked accent builds the whole palette on its own.

Genshin Impact, osu! and osu! mania keep their own colours, because each of their backgrounds comes with a matching
colour scheme; Windows 7 keeps Aero's.

## Fonts

| Setting | Values |
|:--|:--|
| `font_text` | the name of an installed font family (see `fc-list : family`), or a `.ttf` / `.otf` file |
| `font_clock` | the same, for the clock |

Minecraft, Nine Sols and Terraria have no separate clock, so they take a text font only. A theme's own licensed font
(see [Fonts](/docs/fonts)) is still what it uses when you set neither.

## Light and dark

Seven themes have a second look, designed to fit the theme rather than filtered from it:

| Theme | Its own look | The other |
|:--|:--|:--|
| Clockwork Orbital | dark | light |
| Clockwork Neo-Orbital | light | dark, a deep violet field |
| Clockwork Tape | dark | light, like drafting paper |
| Girl · Coffee | light | dark, a frosted dark card over the same artwork |
| Material You | light | dark |
| NieR: Automata | light | dark, NieR's own inverted palette |
| Nothing | light | dark, as in Nothing OS |

Set `variant` to `light`, `dark`, or `auto` to follow your desktop's light or dark preference. The theme dialog in the
[gallery](/themes?filter=Light+%26+dark) shows both looks.

## Motion

| Setting | Values |
|:--|:--|
| `motion_speed` | `0.25` to `3`: `2` plays every animation twice as fast |
| `motion_curve` | `smooth`, `snappy`, `bouncy` or `linear` |
| `reduce_motion` | `true` stops looping animations and makes transitions instant |

Every theme takes these.
