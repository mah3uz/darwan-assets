import QtQuick
import QtQuick.Window
import QtQuick.Shapes
import QtTest
import Quickshell
import "contract"

// Plays one theme's unlock with a drawn cursor and synthetic input, so recording never takes the real pointer.
ShellRoot {
    id: root

    readonly property real w: win.width
    readonly property real h: win.height
    property var steps: []
    property bool finished: false

    Window {
        id: win
        visible: true
        visibility: Window.FullScreen
        color: "black"
        title: "darwan demo: " + Quickshell.env("DARWAN_THEME_ID")

        ThemeHost {
            id: host
            anchors.fill: parent
            themePath: Quickshell.env("DARWAN_THEME_PATH")
            hostMode: "lock"
            userName: "traveler"
            sessionList: JSON.parse(Quickshell.env("DARWAN_SESSIONS") || "[]")
            authBackend: MockAuth {}
            Behavior on opacity { NumberAnimation { duration: 700; easing.type: Easing.InOutQuad } }
            onUnlocked: {
                opacity = 0
                root.after(1100, root.finish)
            }
        }

        Item {
            id: pointer
            z: 100
            visible: false
            width: 30
            height: 42
            Shape {
                scale: 1.25
                transformOrigin: Item.TopLeft
                ShapePath {
                    fillColor: "white"
                    strokeColor: "black"
                    strokeWidth: 1.6
                    joinStyle: ShapePath.RoundJoin
                    startX: 0; startY: 0
                    PathLine { x: 0; y: 25 }
                    PathLine { x: 6.5; y: 19.5 }
                    PathLine { x: 10.5; y: 28.5 }
                    PathLine { x: 14.5; y: 26.8 }
                    PathLine { x: 10.6; y: 18 }
                    PathLine { x: 18.5; y: 18 }
                    PathLine { x: 0; y: 0 }
                }
            }
        }

        TestCase {
            id: input
            when: false
            optional: true
        }
    }

    Timer {
        id: tick
        property var fn
        onTriggered: fn()
    }

    function after(ms, fn) {
        tick.fn = fn
        tick.interval = ms
        tick.restart()
    }

    ParallelAnimation {
        id: glide
        property real tx
        property real ty
        NumberAnimation { target: pointer; property: "x"; to: glide.tx; duration: 900; easing.type: Easing.InOutCubic }
        NumberAnimation { target: pointer; property: "y"; to: glide.ty; duration: 900; easing.type: Easing.InOutCubic }
        onFinished: root.next()
    }

    // Hover effects need real move events along the path, not just the end point.
    Timer {
        interval: 33
        repeat: true
        running: glide.running
        onTriggered: input.mouseMove(win.contentItem, pointer.x, pointer.y)
    }

    function glideTo(x, y) {
        return () => {
            glide.tx = x
            glide.ty = y
            glide.start()
        }
    }

    function wait(ms) { return () => after(ms, next) }
    function next() { if (steps.length > 0) steps.shift()() }

    function passwordField(item) {
        if (!item || !item.visible || item.opacity === 0)
            return null
        if (item.echoMode === TextInput.Password)
            return item
        for (let i = 0; i < item.children.length; i++) {
            const found = passwordField(item.children[i])
            if (found)
                return found
        }
        return null
    }

    function typeKey(key) { return () => { input.keyClick(key); after(230, next) } }

    function start() {
        console.warn("DEMO START")
        pointer.x = w * 0.8
        pointer.y = h * 0.92
        pointer.visible = true
        // Going straight to the field matters: some menus select whatever row the pointer crosses.
        const field = passwordField(host.themeItem)
        if (field) {
            after(600, () => aim(field))
            return
        }
        // "Press to start" screens reveal the field only after a key or click.
        steps = [wait(600), glideTo(w * 0.52, h * 0.64), () => {
            input.keyClick(Qt.Key_Return)
            input.mouseClick(win.contentItem, pointer.x, pointer.y)
            after(1000, () => aim(passwordField(host.themeItem)))
        }]
        next()
    }

    function aim(field) {
        const typing = [wait(350), typeKey(Qt.Key_T), typeKey(Qt.Key_E), typeKey(Qt.Key_S), typeKey(Qt.Key_T),
                        wait(600), () => { input.keyClick(Qt.Key_Return); after(7000, finish) }]
        if (field) {
            const c = field.mapToItem(win.contentItem, field.width / 2, field.height / 2)
            steps = [glideTo(c.x, c.y), () => { input.mouseClick(win.contentItem, c.x, c.y); next() }].concat(typing)
        } else {
            steps = typing
        }
        next()
    }

    function finish() {
        if (finished)
            return
        finished = true
        console.warn("DEMO END " + (host.opacity === 0 ? "unlocked" : "no-unlock"))
        host.unload()
        Qt.callLater(() => Qt.quit())
    }

    Timer {
        interval: 2500
        running: host.themeReady || host.usingFallback
        onTriggered: root.start()
    }
}
