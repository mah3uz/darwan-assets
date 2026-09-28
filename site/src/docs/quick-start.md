# Quick start

From a fresh install to both screens and the screensaver themed, in eight steps. `pixel-coffee` is just an example; `darwan list` shows every theme's id, and so does the [theme gallery](/themes).

## 1. Check your system

Anything missing is listed with a fix:

```sh
darwan doctor
```

## 2. Browse the themes

Open *Darwan* from your app launcher, or the GUI from a terminal:

```sh
darwan-gui
```

Prefer the terminal? The TUI has the same themes and settings:

```sh
darwan
```

## 3. Try one full screen

Nothing is locked; type `test` to unlock, or press `Ctrl+Q` to close:

```sh
darwan preview pixel-coffee
```

## 4. Use it for your lockscreen

Choose the theme:

```sh
darwan set lock.theme pixel-coffee
```

Then bind a key to `darwan lock` (see [Lockscreen keybind](/docs/usage#lockscreen-keybind)) and try it; unlock with your real password:

```sh
darwan lock
```

## 5. Turn on the screensaver

The same theme, with only its background and animation, when you step away. In the GUI, click **Screensaver** at the
top right: it installs and starts hypridle with you, and writes its config. Try the look first:

```sh
darwan preview pixel-coffee --saver
```

[Screensaver](/docs/screensaver) has the details and the setup by hand.

## 6. Use it on the login screen

See it in SDDM's own greeter first:

```sh
darwan sddm preview pixel-coffee
```

Then apply it. This asks for your password, because it writes system files:

```sh
darwan sddm apply pixel-coffee
```

Log out to see it. To go back to your previous login screen:

```sh
darwan sddm reset
```

## 7. Make it yours (optional)

Use your desktop wallpaper as the background and take the accent colour from it:

```sh
darwan set pixel-coffee.background desktop
darwan set pixel-coffee.accent generate
```

Or open the GUI and try things in the live preview before you save. [Customise](/docs/customise) lists everything you can change. Run `darwan sddm apply` again to bring your changes to the login screen.

## 8. Add missing fonts (optional)

Eight themes use commercial fonts that can't be shipped; see [Fonts](/docs/fonts).
