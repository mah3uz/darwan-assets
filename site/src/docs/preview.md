# Preview and testing

You never have to lock your real session to try a theme.

| Mode | How | Password | Good for |
|:--|:--|:--|:--|
| **Live preview** | GUI centre pane | `test` | tweaking settings and seeing the change at once |
| **Full-screen preview** | `darwan preview <theme>` | `test`, or your real one with `--pam` | the exact lockscreen runtime, without locking; `Ctrl+Q` closes it |
| **SDDM preview** | `darwan sddm preview <theme>` | none (visual only) | how it looks in SDDM's own greeter before applying |
| **Headless check** | `darwan check --all --shots ./shots` | typed for you | QML errors, missing fonts and a real unlock test across every theme |

## Preview flags

| Flag | Example | Does |
|:--|:--|:--|
| `--sddm` | `darwan preview pixel-coffee --sddm` | shows the login-screen layout instead of the lockscreen |
| `--pam` | `darwan preview osu --pam` | unlocks with your real password instead of `test` |
| `--at HH:MM` | `darwan preview nier-automata --at 00:00` | fakes the time of day (needs `libfaketime`) |
| `--shot FILE` | `darwan preview osu --shot osu.png` | saves a 1280×720 still once the theme has settled |

`--at` runs the preview in Qt's own `qml` runner, because Quickshell can't start under libfaketime, so it always uses the mock password.
