# darwan-assets

Demo animations of every [darwan](https://github.com/mah3uz/darwan) theme, for darwan's README. They live here so that cloning or building darwan never downloads them.

## The animations

Each file is an animated WebP, 1920×1080 at 25 fps, about 5 to 8 seconds long, looping. It shows the theme as the lockscreen: a cursor goes to the password field, `test` is typed, Enter is pressed, the theme's own unlock animation plays, and the screen fades as the session unlocks. Every theme is shown with its default settings for the user `traveler`.

To show one in a README:

```html
<img src="https://raw.githubusercontent.com/mah3uz/darwan-assets/main/pixel-coffee.webp" width="100%"/>
```

| Theme | Id | File | Size |
|:---|:---|:---|--:|
| Clockwork · Neo-Orbital | `clockwork/neo-orbital` | [`clockwork_neo-orbital.webp`](./clockwork_neo-orbital.webp) | 2.1 MB |
| Clockwork · Orbital | `clockwork/orbital` | [`clockwork_orbital.webp`](./clockwork_orbital.webp) | 0.7 MB |
| Clockwork · Tape | `clockwork/tape` | [`clockwork_tape.webp`](./clockwork_tape.webp) | 0.8 MB |
| Pixel · Coffee | `pixel-coffee` | [`pixel-coffee.webp`](./pixel-coffee.webp) | 1.8 MB |
| Pixel · Cyberpunk | `pixel-cyberpunk` | [`pixel-cyberpunk.webp`](./pixel-cyberpunk.webp) | 1.7 MB |
| Pixel · Dusk City | `pixel-dusk-city` | [`pixel-dusk-city.webp`](./pixel-dusk-city.webp) | 1.1 MB |
| Pixel · Emerald | `pixel-emerald` | [`pixel-emerald.webp`](./pixel-emerald.webp) | 4.4 MB |
| Pixel · Hollow Knight | `pixel-hollowknight` | [`pixel-hollowknight.webp`](./pixel-hollowknight.webp) | 3.1 MB |
| Pixel · Munchlax | `pixel-munchlax` | [`pixel-munchlax.webp`](./pixel-munchlax.webp) | 0.6 MB |
| Pixel · Night City | `pixel-night-city` | [`pixel-night-city.webp`](./pixel-night-city.webp) | 2.1 MB |
| Pixel · Rainy Room | `pixel-rainyroom` | [`pixel-rainyroom.webp`](./pixel-rainyroom.webp) | 1.9 MB |
| Pixel · Sakura | `pixel-sakura` | [`pixel-sakura.webp`](./pixel-sakura.webp) | 1.5 MB |
| Pixel · Skyscrapers | `pixel-skyscrapers` | [`pixel-skyscrapers.webp`](./pixel-skyscrapers.webp) | 1.6 MB |
| Pixel · Waterfall | `pixel-waterfall` | [`pixel-waterfall.webp`](./pixel-waterfall.webp) | 2.3 MB |
| Dog Samurai | `dog-samurai` | [`dog-samurai.webp`](./dog-samurai.webp) | 2.5 MB |
| Enfield | `enfield` | [`enfield.webp`](./enfield.webp) | 7.7 MB |
| Field | `field` | [`field.webp`](./field.webp) | 0.5 MB |
| Forest | `forest` | [`forest.webp`](./forest.webp) | 3.9 MB |
| Genshin Impact | `genshin` | [`genshin.webp`](./genshin.webp) | 5.9 MB |
| Girl · Coffee | `girl-coffee` | [`girl-coffee.webp`](./girl-coffee.webp) | 0.5 MB |
| Girl · Pillow | `girl-pillow` | [`girl-pillow.webp`](./girl-pillow.webp) | 0.2 MB |
| Honkai: Star Rail | `star-rail` | [`star-rail.webp`](./star-rail.webp) | 2.9 MB |
| Man · Bicycle | `man-bicycle` | [`man-bicycle.webp`](./man-bicycle.webp) | 0.8 MB |
| Material You | `material-you` | [`material-you.webp`](./material-you.webp) | 0.3 MB |
| Material You Dark | `material-you-dark` | [`material-you-dark.webp`](./material-you-dark.webp) | 0.3 MB |
| Minecraft | `minecraft` | [`minecraft.webp`](./minecraft.webp) | 1.0 MB |
| NieR: Automata | `nier-automata` | [`nier-automata.webp`](./nier-automata.webp) | 1.2 MB |
| Nine Sols | `ninesols` | [`ninesols.webp`](./ninesols.webp) | 0.7 MB |
| Ninja Gaiden | `ninja-gaiden` | [`ninja-gaiden.webp`](./ninja-gaiden.webp) | 0.8 MB |
| Nothing | `nothing` | [`nothing.webp`](./nothing.webp) | 0.2 MB |
| osu! | `osu` | [`osu.webp`](./osu.webp) | 1.7 MB |
| osu! mania | `osumania` | [`osumania.webp`](./osumania.webp) | 0.3 MB |
| Reverse: 1999 - I | `reverse-1999-1` | [`reverse-1999-1.webp`](./reverse-1999-1.webp) | 4.1 MB |
| Reverse: 1999 - II | `reverse-1999-2` | [`reverse-1999-2.webp`](./reverse-1999-2.webp) | 2.5 MB |
| Sword | `sword` | [`sword.webp`](./sword.webp) | 3.1 MB |
| Terraria | `terraria` | [`terraria.webp`](./terraria.webp) | 2.5 MB |
| The Last of Us | `last-of-us` | [`last-of-us.webp`](./last-of-us.webp) | 4.3 MB |
| Windows 7 | `windows-7` | [`windows-7.webp`](./windows-7.webp) | 0.4 MB |
| Winter | `winter` | [`winter.webp`](./winter.webp) | 4.2 MB |
| Women · Umbrella | `women-umbrella` | [`women-umbrella.webp`](./women-umbrella.webp) | 0.9 MB |
| Wuthering Waves | `wuwa` | [`wuwa.webp`](./wuwa.webp) | 3.1 MB |

41 files, 82 MB in total.

## Re-recording

The recorder runs each demo on a Hyprland headless output, so nothing appears on your screens and your pointer and keyboard stay free. The cursor is drawn and the input is synthetic.

Needs: Hyprland, `quickshell`, `grim`, `ffmpeg` with `libwebp`, `python3`, and a darwan checkout next to this repository (`../darwan`), whose runtime the demo loads.

```sh
hyprctl output create headless darwan-test
tools/record.py                     # every theme
tools/record.py pixel-coffee osu    # some themes
tools/record.py --quality 80 ...    # WebP quality, default 75
hyprctl output remove darwan-test
```

`record.py` refuses to start without the `darwan-test` output. It captures from the moment the demo starts until the theme unlocks, and reports each theme's frame count, dropped frames and whether it unlocked.

| File | Does |
|:---|:---|
| `tools/record.py` | launches each demo on the headless output, captures it and encodes the WebP |
| `tools/demo.sh` | runs one theme's demo under Quickshell with darwan's runtime |
| `tools/shell/demo_shell.qml` | the demo: loads the theme through darwan's `ThemeHost`, draws the cursor, clicks and types |
| `tools/shell/ThemeHost.qml`, `FallbackPrompt.qml`, `contract` | links into `../darwan/runtime` (Quickshell only loads QML from its own folder) |

## Credits

The themes come from [qylock](https://github.com/Darkkal44/qylock) by [Darkkal44](https://github.com/Darkkal44). The wallpapers, videos and fonts in these recordings belong to their creators, listed in [darwan's acknowledgements](https://github.com/mah3uz/darwan#acknowledgements).
