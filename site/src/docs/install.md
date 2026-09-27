# Install

Darwan supports **Arch Linux only**, with Qt6 SDDM and Quickshell on Wayland.

## Packages

Darwan is in the AUR as two packages. Install **one** of them:

| Package      | What you get                                                    |
|:-------------|:----------------------------------------------------------------|
| `darwan-bin` | the prebuilt release; installs in seconds (recommended)         |
| `darwan`     | the same release, compiled on your machine; takes a few minutes |

With [paru](https://aur.archlinux.org/packages/paru) or [yay](https://aur.archlinux.org/packages/yay):

```sh
paru -S darwan-bin
yay -S darwan-bin
```

Without an AUR helper:

```sh
git clone https://aur.archlinux.org/darwan-bin.git
cd darwan-bin
makepkg -si
```

To compile it yourself, use `darwan` instead of `darwan-bin`.

## Dependencies

Your AUR helper or `makepkg -s` installs these for you.

| | Packages |
|--:|:--|
| **Required** | `quickshell` `qt6-base` `qt6-declarative` `qt6-5compat` `qt6-multimedia` `qt6-multimedia-ffmpeg` `polkit` `ttf-jetbrains-mono-nerd` |
| **Optional** | `sddm` (the login screen), `libfaketime` (`darwan preview --at`), `noto-fonts-cjk` (Chinese text in Genshin Impact) |
| **Build** (`darwan` only) | `rust` `lld` `librsvg` |

## What gets installed

| Path | What |
|:--|:--|
| `/usr/bin/darwan` | CLI and TUI |
| `/usr/bin/darwan-gui` | GUI, also in your app launcher as *Darwan* |
| `/usr/lib/darwan/darwan-helper` | privileged SDDM helper, run through `pkexec` |
| `/usr/share/darwan/runtime/` | the QML runtime shared by the lockscreen and the previews |
| `/usr/share/darwan/themes/` | all 40 themes |
| `/usr/share/polkit-1/actions/org.darwan.policy` | lets the helper ask for your password once per session |

To build from the repository instead, see [Development](https://github.com/mah3uz/darwan/blob/main/docs/development.md).

## Uninstall

If you applied a theme to the login screen, undo that first. It removes the files Darwan's helper wrote, which pacman doesn't track:

```sh
darwan sddm reset
```

Then remove the package (`darwan` if you installed that one):

```sh
sudo pacman -R darwan-bin
```

Your settings stay in `~/.config/darwan/`; delete that folder too if you want them gone.
