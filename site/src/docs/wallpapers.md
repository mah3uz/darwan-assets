# Wallpapers

Darwan sets your desktop wallpaper through whatever already draws it, so nothing new runs and your setup keeps working.
Browse your own folder and free wallpapers online in the GUI, and set one in a click.

## What draws your wallpaper

Darwan looks for, in this order: your shell (DankMaterialShell, Noctalia, Caelestia, Omarchy), your desktop's own
background (KDE Plasma, GNOME, Cinnamon, MATE, Xfce), sway, waypaper when its backend is what runs, and the wallpaper
tool itself (hyprpaper, awww/swww, wpaperd, mpvpaper, gSlapper, swaybg, wbg). It checks the result by asking that tool
what it shows, and says so plainly when something can't be done, such as a video with a tool that only shows pictures.

```sh
darwan wallpaper status
```

shows what draws the wallpaper, what it can do and what each screen shows.

## In the GUI

The pill at the top of the window reads *Themes · Home · Library · Explore*. The three wallpaper pages sit over one of
your wallpapers at full size.

| Page | What's there |
|:--|:--|
| **Home** | one of your wallpapers featured, with *View Wallpaper* and a strip of others to feature instead; then rows from Bing, Wallhaven, NASA's Astronomy Picture of the Day, Wikimedia Commons, and what you added last |
| **Library** | your wallpaper folder and its subfolders, four levels down, newest first, with NEW and IN USE badges, colour chips and a search; **+** adds pictures or videos |
| **Explore** | every source mixed, or one picked with the source chips; search Wallhaven, pick a shape (ultrawide, 16:9, 16:10) and Popular, Latest or Random, or open a topic such as Nature, Space or City |

Explore loads the first 50 pictures at once and 25 more each time you reach the end.

Open a wallpaper and it fills the window: its thumbnail at once, then a copy the size of your screen fades in. Step with
‹ › or the arrow keys, and `Esc` goes back.

**Set Wallpaper** asks which screen when you have several and your tool can give each its own; pick one or *All*. An
online picture is downloaded into your folder first, with its credit (author, licence and source page), and marked
DOWNLOADED from then on, so it's never fetched twice. Once it's set, *Use on lockscreen too* makes your lock theme show
your desktop wallpaper.

**⚙** on the wallpaper pages changes the folder, says what draws your wallpaper, and holds the colour generators.

## Your folder

By default, `Wallpapers` (or `wallpapers`) in your Pictures folder, found through `user-dirs.dirs`, so a localised
Pictures folder works. Change it with `wallpaper.folder` or ⚙ → *Wallpaper folder*.

Thumbnails go to the shared freedesktop cache, `~/.cache/thumbnails`, so your file manager and Darwan make each one
once. Each picture's colours are kept too, for the colour chips. To make them all ahead of time:

```sh
darwan wallpaper prepare
```

## Online

No account or API key is needed.

| Source | What it has |
|:--|:--|
| Wallhaven | searchable; popular, latest or random |
| Bing | Microsoft's image of the day |
| NASA APOD | the Astronomy Picture of the Day |
| Wikimedia Commons | featured pictures: nature, space, city, night |

Pictures and responses are cached under `~/.cache/darwan` (`$XDG_CACHE_HOME`), so a second visit is quick.

## Filter

**Sexual content in any form is never shown**, from any source, and there is no switch for it.

People and portraits, anime and manga, games, films and TV, war and weapons, gore and violence, and horror stay hidden
too until you allow them under *Filter* on the Explore page, or with `wallpaper.allow`:

```sh
darwan set wallpaper.allow anime,games
```

Wallhaven pictures appear one by one, as each one's own tags pass these checks.

## Colours from the wallpaper

When your shell makes your colours from the wallpaper (DMS, Caelestia, Noctalia), Darwan sets the wallpaper through it,
so the colours follow as they do from the shell's own settings, and runs nothing else.

With a plain wallpaper tool, Darwan can run matugen, pywal, wallust or hellwal after each change: switch it on in ⚙ on
the wallpaper pages, or with `wallpaper.colours`. pywal is told not to set the wallpaper itself, and a matugen set up to
change the wallpaper is left alone.

## Tools that must be restarted

swaybg and wbg, and mpvpaper or gSlapper without their control socket, can only change by being restarted. Darwan asks first:
just this time, or always (`wallpaper.restart`). One that systemd runs is never restarted behind its back. From a
terminal, add `--allow-restart`.

## Settings

| Setting | Values | Default |
|:--|:--|:--|
| `wallpaper.folder` | an absolute path, or one starting with `~/` | `~/Pictures/Wallpapers` |
| `wallpaper.allow` | any of `people` `anime` `games` `series` `war` `gore` `horror` | none |
| `wallpaper.restart` | any of `swaybg` `mpvpaper` `gSlapper` `wbg` | none: Darwan asks |
| `wallpaper.colours` | any of `matugen` `pywal` `wallust` `hellwal` | none |

## Commands

| Command | What it does |
|:--|:--|
| `darwan wallpaper set <file>` | show the file as the wallpaper on every screen; `-o DP-1` for one, repeat for more |
| `darwan wallpaper status` | what draws the wallpaper, what it can do and what each screen shows |
| `darwan wallpaper list` | the wallpapers in your folder, newest first |
| `darwan wallpaper prepare` | make every thumbnail and colour ahead of time |
| `darwan wallpaper online [source] [words]` | browse `wallhaven` (the default), `bing`, `apod` or `commons`; `--sort`, `--topic` for Commons |

`darwan wallpaper online` numbers what it finds. `--download 3` saves the third into your folder with its credit, and
`--set` also sets it:

```sh
darwan wallpaper online wallhaven lake --download 3 --set
darwan wallpaper online commons --topic space
```
