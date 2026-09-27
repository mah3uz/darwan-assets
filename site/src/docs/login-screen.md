# Login screen

Darwan themes the SDDM login screen with the same themes and settings as your lockscreen. You can use one theme for both, or a different one for each.

| Command | Does |
|:--|:--|
| `darwan sddm preview [theme]` | shows the theme in SDDM's own greeter, in test mode, before you apply it |
| `darwan sddm apply [theme]` | uses the theme and its settings on the login screen; asks for your password |
| `darwan sddm status` | shows what SDDM will use, and any config file that overrides it |
| `darwan sddm reset` | removes everything Darwan added, back to your previous login screen |

Without a theme id, `preview` and `apply` use the `[sddm]` theme from your config.

## What it writes

The SDDM greeter runs as its own user and can't read your home folder, so `apply` writes system files through `darwan-helper`, launched through polkit. A [customised](/docs/customise) background or font is sent along with your settings: the helper checks each file's type and size, and stores its own copy, so SDDM never reads your home folder. Changed your wallpaper or a customisation? Run `apply` again. The helper checks every value again before writing, nothing else runs as root, and it only ever touches these files:

| File | Purpose |
|:--|:--|
| `/usr/share/sddm/themes/darwan` | points at the chosen theme |
| `/usr/share/darwan/themes/<theme>/theme.conf.user` | your options, in SDDM's own override format |
| `/var/lib/darwan/sddm/media/` | copies of your background and font files |
| `/etc/sddm.conf.d/zz-darwan.conf` | `[Theme] Current=darwan` |
| `/usr/share/darwan/themes/<theme>/font/<file>` | fonts you import |

SDDM reads `/etc/sddm.conf.d/` in alphabetical order, and later files win. If another file or `/etc/sddm.conf` also sets `Current=`, `darwan doctor` will point it out.
