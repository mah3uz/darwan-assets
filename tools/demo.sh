#!/bin/sh
# demo.sh THEME_ID LOG : runs demo_shell.qml for one theme under Quickshell, logging to LOG
here=$(cd "$(dirname "$0")" && pwd)
runtime=$(cd "$here/../../darwan/runtime" && pwd)
themes=$(cd "$here/../../darwan/themes" && pwd)
cd "$runtime"
DARWAN_THEME_ID="$1" DARWAN_THEME_PATH="$themes/$1" DARWAN_SESSIONS='[{"name":"Hyprland","file":"hyprland.desktop","type":"wayland"}]' \
QML2_IMPORT_PATH="$runtime/imports" QML_XHR_ALLOW_FILE_READ=1 \
exec quickshell --no-color -p "$here/shell/demo_shell.qml" > "$2" 2>&1
