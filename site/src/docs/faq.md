# FAQ

## A theme broke and I'm stuck on the lockscreen?

Darwan shows its fallback password prompt when a theme fails to load, and if the lockscreen crashes it starts a new one by itself, which takes the lock back within a second or two. If the lockscreen hangs instead, switch to a text console (`Ctrl+Alt+F3`), log in and run `darwan lock --replace`, then switch back and unlock. [Lock recovery](/docs/lock-recovery) covers every case. Afterwards, run `darwan check <theme>` and [open an issue](https://github.com/mah3uz/darwan/issues) with the output.

## A virtual keyboard pops up on the login screen?

Open `/etc/sddm.conf.d/virtualkeyboard.conf` as root and empty `InputMethod`:

```ini
[General]
InputMethod=
```

## The background video looks low quality?

Videos are compressed to keep the download small. For the full HD or 4K version, grab the original from the [credits](/credits) and make it the theme's background, without touching the theme's files:

```sh
darwan set pixel-coffee.background ~/Videos/coffee-4k.mp4
```

## The lockscreen doesn't work on KDE Plasma?

KWin doesn't support the `ext-session-lock-v1` protocol that the Quickshell lockscreen needs. The SDDM login screen still works fine on Plasma.

## Does it work outside Arch Linux?

No. Darwan supports Arch Linux only, with Qt6 SDDM and Quickshell on Wayland.
