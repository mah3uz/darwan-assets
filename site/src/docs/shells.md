# Desktop shells

Most Hyprland setups bring a lockscreen of their own. DankMaterialShell, Noctalia, Caelestia and illogical-impulse draw
one, and Omarchy uses hyprlock or its own shell's. To lock with Darwan, send every lock to `darwan lock` and turn the
shell's own lock off, so that only one lockscreen ever answers. This page shows how for each of them.

## Where a lock comes from

A session is locked from three places, and each one has to reach Darwan:

| | What usually starts it |
|:--|:--|
| **Your keybind**, and the lock button in a power menu | a Hyprland bind, or a call into the shell |
| **Idle** | the shell's idle timer, or hypridle |
| **Before sleep** | the shell or hypridle, which holds sleep back until the lock is on screen |

`loginctl lock-session`, which many power menus call, asks whichever program listens for it: hypridle's `lock_cmd`,
or the shell itself. Hyprland allows one lockscreen at a time, so when two answer the same request, one of them fails.

Whatever your shell, Hyprland's `allow_session_lock_restore` must be on. It lets a new lockscreen take over if one
crashes, and `darwan lock` refuses to lock without it ([Usage](/docs/usage) shows the line). illogical-impulse,
Caelestia and Omarchy 4 already turn it on.

| Shell | Its lockscreen | What changes |
|:--|:--|:--|
| [DankMaterialShell](#dankmaterialshell) | its own | one setting |
| [Noctalia](#noctalia) | its own | turn it off, idle in Noctalia, sleep in hypridle, a keybind |
| [Caelestia](#caelestia) | its own | keybind, idle and sleep settings, sleep in hypridle |
| [illogical-impulse](#illogical-impulse) (end-4) | its own, started by hypridle | one line in hypridle |
| [Omarchy 4](#omarchy-4) | the Omarchy shell's | keybind, idle and sleep to hypridle |
| [Omarchy 3](#omarchy-3) | hyprlock, started by hypridle | hypridle and keybind |
| [Anything else with hypridle](#anything-else-with-hypridle) | hyprlock or another | hypridle and keybind |

The [login screen](#the-login-screen) is separate: several of these shells come with a greeter that isn't SDDM.

## DankMaterialShell

DMS can hand every lock to another program. In **Settings → Power & Sleep → Custom commands**, set **Lock** to:

```sh
darwan lock
```

or set it in `~/.config/DankMaterialShell/settings.json`:

```json
"customPowerActionLock": "darwan lock"
```

That's all. DMS's lock keybind (`dms ipc call lock lock`), its idle lock and fade-to-lock, the power menu's Lock and
`loginctl lock-session` now all run Darwan instead of DMS's lockscreen.

Leave **Lock before suspend** on, in **Settings → Lock Screen**. It needs **loginctl integration**, which is on by
default. Before sleep, DMS asks logind to lock, which runs `darwan lock`, and holds sleep back for up to four fifths of
logind's `InhibitDelayMaxSec` (4 seconds with the default of 5), long enough for Darwan's lock to come up.

Don't also run hypridle with a `lock_cmd`: DMS already answers every lock, and a second answer races it.

## Noctalia

Noctalia 5 draws its own lockscreen. It locks on `loginctl lock-session` and before sleep, so turn it off, then give idle
to Darwan. In **Settings → Security → Lock Screen**, or in a file under `~/.config/noctalia/`:

```toml
[lockscreen]
enabled = false

[idle.behavior.lock]
timeout = 600
action = "command"
command = "darwan lock"
enabled = true
```

With the lockscreen off, `noctalia msg session lock` does nothing, and Noctalia no longer locks before sleep. Bind a key
to `darwan lock` ([Usage](/docs/usage)), and let hypridle lock before sleep with only this in
`~/.config/hypr/hypridle.conf`:

```ini
general {
    lock_cmd = darwan lock
    before_sleep_cmd = loginctl lock-session
    inhibit_sleep = 3
}
```

Start hypridle with the session (see [Starting hypridle](#starting-hypridle)). Noctalia's own **Lock and suspend**
actions fall back to a plain suspend while its lockscreen is off; hypridle locks first.

## Caelestia

Caelestia brings up its own lockscreen whenever logind asks for a lock, and there's no setting to stop that. So keep
`loginctl lock-session` out of Darwan's way and call Darwan directly.

**Keybind.** An empty keybind removes Caelestia's. In `~/.config/caelestia/hypr-vars.lua`:

```lua
return {
    kbLock        = "",
    kbRestoreLock = "",
}
```

and bind your own in `~/.config/caelestia/hypr-user.lua`:

```lua
hl.bind("SUPER + L", hl.dsp.exec_cmd("darwan lock"), { desc = "Lock" })
```

**Idle and sleep.** In `~/.config/caelestia/shell.json`, turn off Caelestia's lock before sleep and make the idle lock
run Darwan. An `idleAction` that is a list runs as a command:

```json
"general": {
    "idle": {
        "lockBeforeSleep": false,
        "timeouts": [
            { "timeout": 180, "idleAction": ["darwan", "lock"] },
            { "timeout": 300, "idleAction": "dpms off", "returnAction": "dpms on" },
            { "timeout": 600, "idleAction": ["suspendThenHibernate"] }
        ]
    }
}
```

**Before sleep**, let hypridle start Darwan itself rather than through `loginctl lock-session`. In
`~/.config/hypr/hypridle.conf`, with no `lock_cmd`:

```ini
general {
    before_sleep_cmd = darwan lock --for-sleep
    inhibit_sleep = 3
}
```

`--for-sleep` locks with a plain black screen, which is up in a fraction of a second, and loads your theme after wake.
Start hypridle with the session (see [Starting hypridle](#starting-hypridle)).

The launcher's **Lock** action still calls `loginctl lock-session`, and so still shows Caelestia's lockscreen. To change
it, copy `launcher.actions` from Caelestia's example config into `shell.json` and set that entry's command to
`["darwan", "lock"]`.

## illogical-impulse

end-4's illogical-impulse sends every lock through `loginctl lock-session` to hypridle: the keybind, the session
screen's Lock and the idle timer. So one change moves all of them to Darwan. In `~/.config/hypr/hypridle.conf`,
change the `general` block to:

```ini
general {
    lock_cmd = darwan lock
    before_sleep_cmd = loginctl lock-session
    inhibit_sleep = 3
}
```

This drops `after_sleep_cmd`, which only refocused illogical-impulse's lockscreen. Restart hypridle or log in again.
If an update of the dotfiles replaces `hypridle.conf`, make the change again.

## Omarchy 4

Omarchy 4 keeps its lockscreen inside the Omarchy shell: the shell's idle timer, the System menu and
<kbd>Super</kbd>+<kbd>Ctrl</kbd>+<kbd>L</kbd> run `omarchy-system-lock`, and a user service locks through the shell
before sleep. Darwan takes over the keybind, idle and sleep; the System menu's Lock stays Omarchy's.

1. **Keybind.** In `~/.config/hypr/bindings.lua`:

   ```lua
   hl.unbind("SUPER + CTRL + L")
   o.bind("SUPER + CTRL + L", "Lock system", "darwan lock")
   ```

2. **Idle.** Omarchy's idle timer can't run another locker, so turn it off. This also stops the idle screensaver, and
   the stay-awake cup stays in the bar:

   ```sh
   omarchy toggle idle stay-awake
   ```

3. **Sleep.** Stop Omarchy's lock before suspend:

   ```sh
   systemctl --user mask --now omarchy-sleep-lock.service
   ```

4. **hypridle** does both instead. Omarchy 4 doesn't ship it, so install it (`sudo pacman -S hypridle`) and write
   `~/.config/hypr/hypridle.conf`:

   ```ini
   general {
       lock_cmd = darwan lock
       before_sleep_cmd = loginctl lock-session
       inhibit_sleep = 3
   }

   listener {
       timeout = 300
       on-timeout = loginctl lock-session
   }
   ```

   Then start it with the session (see [Starting hypridle](#starting-hypridle)).

To go back: `systemctl --user unmask omarchy-sleep-lock.service`, `omarchy toggle idle allow-idle`, stop hypridle, and
remove the two binding lines.

## Omarchy 3

Omarchy 3 locks with hyprlock through hypridle, and <kbd>Super</kbd>+<kbd>Ctrl</kbd>+<kbd>L</kbd> runs
`omarchy-system-lock`. In `~/.config/hypr/hypridle.conf`, replace `omarchy-system-lock` with Darwan:

```ini
general {
    lock_cmd = darwan lock
    before_sleep_cmd = loginctl lock-session
    inhibit_sleep = 3
}

listener {
    timeout = 150
    on-timeout = pgrep -f '[d]arwan lock-supervisor' || omarchy-launch-screensaver
}

listener {
    timeout = 152
    on-timeout = loginctl lock-session
}
```

The first listener keeps Omarchy's screensaver from starting behind a lock that is already up. Rebind the key in
`~/.config/hypr/bindings.conf`:

```ini
unbind = SUPER CTRL, L
bindd = SUPER CTRL, L, Lock system, exec, darwan lock
```

and turn on `allow_session_lock_restore` in `~/.config/hypr/hyprland.conf`, as in [Usage](/docs/usage). Restart
hypridle with `omarchy-restart-hypridle`. Two things to know: `omarchy-refresh-hypridle` puts back Omarchy's
`hypridle.conf`, and the extras `omarchy-system-lock` did on lock, such as locking 1Password and resetting the keyboard
layout, no longer run.

## Anything else with hypridle

If your setup locks through hypridle, point it at Darwan as in [Usage](/docs/usage): `lock_cmd = darwan lock`,
`before_sleep_cmd = loginctl lock-session` and `inhibit_sleep = 3`, plus a keybind for `darwan lock`. Replace
whatever the idle listeners and keybinds called before (often `hyprlock`) with `loginctl lock-session` or
`darwan lock`.

## The screensaver

Darwan's [screensaver](/docs/screensaver) starts from a hypridle listener that runs `darwan saver`, so hypridle has to
own idle: turn the shell's own idle lock off, and let the listener start the screensaver, which locks after its grace
period (`saver.lock_after`). The GUI's screensaver settings write the listener; with a shell that already locks for
you, turn their *Lock with Darwan* and *Lock before sleep* switches off, so only one program answers each lock.

| Shell | For the screensaver |
|:--|:--|
| DankMaterialShell | set DMS's idle lock (and its screen-off timeout, if hypridle turns the screens off) to never in **Settings → Power & Sleep**; keep its Lock before suspend; in hypridle, only the `darwan saver` and screen-off listeners, no `lock_cmd` |
| Noctalia | set `enabled = false` under `[idle.behavior.lock]` and add the `darwan saver` listener to the hypridle config above |
| Caelestia | drop the `darwan lock` entry from `general.idle.timeouts` and add the `darwan saver` listener to hypridle |
| illogical-impulse | replace the idle listener's `loginctl lock-session` with `darwan saver` |
| Omarchy 4 | replace the listener's `loginctl lock-session` with `darwan saver` |
| Omarchy 3 | replace both listeners (Omarchy's screensaver at 150 seconds and the lock at 152) with one that runs `darwan saver` |

The listener:

```ini
listener {
    timeout = 300
    on-timeout = darwan saver
}
```

and in `general`, `after_sleep_cmd = darwan resumed` (followed by your usual command to turn the screens on), so
opening a lid without touching anything doesn't bring the screensaver straight back.

## Starting hypridle

In a session started by uwsm, run it as the systemd user service that comes with hypridle:

```sh
systemctl --user enable --now hypridle.service
```

Otherwise start it from your Hyprland config, in Lua:

```lua
hl.on("hyprland.start", function()
    hl.exec_cmd("hypridle")
end)
```

or, in a classic `hyprland.conf`, `exec-once = hypridle`.

## Check it

1. Run `darwan doctor`. It checks `allow_session_lock_restore`, and that hypridle, if it locks with Darwan, waits
   for the lock before sleep.
2. Press your lock key, run `loginctl lock-session`, and let the machine go idle. Each should show your Darwan theme.
   If the shell's own lockscreen appears for any of them, that path still reaches it.
3. Suspend and wake. The theme should be on screen, or a black lock that turns into it, never your desktop.
4. Leave the machine idle for the screensaver: your theme without its widgets should fade in, never the shell's own
   screensaver or lockscreen.

## The login screen

Darwan's login-screen themes are SDDM themes, applied with `darwan sddm apply` ([Login screen](/docs/login-screen)).
Some shells use a different display manager:

| Shell | Login screen |
|:--|:--|
| DankMaterialShell | its optional greeter, dank-greeter, runs on greetd |
| Noctalia | its optional greeter, noctalia-greeter, runs on greetd |
| Caelestia, illogical-impulse | none; you choose |
| Omarchy | SDDM with Omarchy's theme and autologin |

To move from greetd to SDDM:

```sh
sudo pacman -S --needed sddm
sudo systemctl disable greetd.service
sudo systemctl enable sddm.service
darwan sddm apply <theme>
```

and reboot. `sudo systemctl disable sddm.service` and `enable greetd.service` go back.

**Omarchy** already uses SDDM. `darwan sddm apply` takes over from Omarchy's theme, because Darwan's
`zz-darwan.conf` is read after Omarchy's `10-theme.conf`, and `omarchy-refresh-sddm` doesn't undo it.
`darwan sddm reset` goes back to Omarchy's theme. Omarchy logs you in automatically: always on Omarchy 3, and on
Omarchy 4 when the disk is encrypted (otherwise only on the first boot), so you see the login screen after logging
out. To see it at every boot, remove `/etc/sddm.conf.d/autologin.conf`; on an encrypted disk, the disk password still
comes first.
