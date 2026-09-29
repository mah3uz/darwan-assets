// darwan.dev's GUI demo: the Darwan GUI's screens, driven by data.json (made by darwan-gui's own model code, `just
// play-data`). The live theme is played by its recorded demo; nothing here touches anyone's system.
const D = await (await fetch("data.json")).json();

const $ = (s, root = document) => root.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const icon = (name, cls = "") => `<svg class="i ${cls}"><use href="#i-${name}"/></svg>`;
const kindOf = (bg) => (bg === "video" ? ["film", "Video"] : bg === "image" ? ["image", "Image"] : ["colour", "Colour"]);

const cards = D.wall.sections.flatMap((s) => s.themes.map((t) => ({ ...t, family: s.title })));
const byId = Object.fromEntries(cards.map((c) => [c.id, c]));

const saverMarks = Object.fromEntries(D.saver.timeline.markers.map((m) => [m.id, m.choices]));
const S = {
  look: "darwan",
  filter: "all",
  query: "",
  order: cards.map((c) => c.id),
  current: -1,
  mode: "lock",
  inspector: true,
  tab: "theme",
  draft: {},
  gates: { lock: D.wall.gates.lock.id, sddm: D.wall.gates.sddm.id },
  stepOpen: false,
  saver: { saver: 300, lock: "10", screenOff: 600, suspend: 0, lockBeforeSleep: true, lockWithDarwan: true, quality: D.saver.quality },
  closed: [],
  seen: new Set(),
  keyboard: false,
};

/* ─── Settings: the draft over data.json's defaults ─── */
const allFields = (id) => [...D.themes[id].form.groups.flatMap((g) => g.fields), ...D.themes[id].globals.fields];
const valueOf = (f) => (f.key in S.draft ? S.draft[f.key] : f.value);
const isSet = (f) => (f.key in S.draft ? S.draft[f.key] !== "" && S.draft[f.key] !== f.value : f.isSet);
function offReason(f, fields) {
  if (!f.disabled) return "";
  if (f.disabled === "only with a custom background") return fields.some((x) => x.control === "media" && valueOf(x) !== "") ? "" : f.disabled;
  if (f.disabled === "only when a colour is generated") return fields.some((x) => x.kind === "color" && valueOf(x) === "generate") ? "" : f.disabled;
  return f.disabled;
}
// As model.rs says it: one line per reason, naming every setting it holds back.
function notes(list, fields) {
  const reasons = [];
  for (const f of list) {
    const r = offReason(f, fields);
    if (!r) continue;
    const found = reasons.find((x) => x[0] === r);
    found ? found[1].push(f.label) : reasons.push([r, [f.label]]);
  }
  const names = (l) => (l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}`);
  return reasons.map(([r, l]) => (r.startsWith("only ") ? `${names(l)} ${l.length > 1 ? "apply" : "applies"} ${r}.` : `${names(l)}: ${r.replace(/\.$/, "")}.`));
}
const changes = (id) => D.themes[id].form.groups.flatMap((g) => g.fields).filter(isSet).length;
const globalChanges = () => D.themes[S.gates.lock].globals.fields.filter(isSet).length;
function set(key, value) {
  S.draft[key] = value;
  if (!S.toldDraft) {
    S.toldDraft = true;
    toast("In the app the live theme changes as you do; this demo plays a recording.", "", 1, "done", 4000);
  }
  renderAll();
}
const dirty = () => Object.keys(S.draft).some((k) => S.draft[k] !== undefined);

/* ─── The screensaver, as idle.rs orders and words it ─── */
const span = (s) => (s % 3600 === 0 ? `${s / 3600} hour${s === 3600 ? "" : "s"}` : s % 60 === 0 ? `${s / 60} min` : `${s} s`);
function timeline() {
  const v = S.saver;
  const marks = [];
  if (v.saver) {
    marks.push({ id: "saver", name: "Screensaver", icon: "moon", value: span(v.saver), at: v.saver, cur: String(v.saver) });
    const lock = v.lock === "never" ? null : +v.lock;
    marks.push({ id: "lock", name: "Locks", icon: "lock", value: lock === null ? "Never" : lock === 0 ? "At once" : `+${span(lock)}`, at: lock === null ? null : v.saver + lock + 0.1, cur: v.lock });
  }
  marks.push({ id: "screenOff", name: "Screen off", icon: "display", value: v.screenOff ? span(v.screenOff) : "Never", at: v.screenOff ? v.screenOff - 0.2 : null, cur: String(v.screenOff || 0) });
  marks.push({ id: "suspend", name: "Suspend", icon: "power", value: v.suspend ? span(v.suspend) : "Never", at: v.suspend || null, cur: String(v.suspend || 0) });
  marks.sort((a, b) => (a.at ?? Infinity) - (b.at ?? Infinity));
  const clash = v.saver && v.screenOff && v.screenOff <= v.saver;
  marks.forEach((m, i) => { m.x = 0.2 + (marks.length > 1 ? (0.66 * i) / (marks.length - 1) : 0); m.never = m.at === null; m.warn = clash && m.id === "saver"; });
  const s = marks.find((m) => m.id === "saver"), l = marks.find((m) => m.id === "lock");
  const open = s && l && l.x > s.x ? [s.x, l.x] : null;
  const note = clash ? ["The screen turns off before the screensaver would start, so you'll never see it.", true]
    : !v.saver ? [`No screensaver: the screen just turns off${v.screenOff ? ` after ${span(v.screenOff)}` : " never"}.`, false]
    : v.lock === "never" ? ["It never locks by itself: until you lock it, any key goes back to the desktop without a password.", true]
    : v.lock === "0" ? ["It locks as soon as it starts.", false]
    : [`For the first ${span(+v.lock)} (the amber stretch), any key goes back to the desktop without a password.`, false];
  return { marks, open, note };
}
function summary() {
  const v = S.saver;
  const parts = [v.saver ? `screensaver after ${span(v.saver)}, ${v.lock === "never" ? "never locks by itself" : v.lock === "0" ? "locks at once" : `locks ${span(+v.lock)} later`}` : "no screensaver"];
  parts.push(v.screenOff ? `screen off after ${span(v.screenOff)}` : "screen stays on");
  parts.push(v.suspend ? `suspends after ${span(v.suspend)}` : "never suspends");
  return parts.join(" · ");
}
function saverPanel(wide) {
  const t = timeline();
  const q = D.saver.qualities.find((x) => x.value === S.saver.quality);
  return `<div class="${wide ? "" : "narrow"}">
    <div class="status"><span class="dot"></span>Ready · hypridle is running<span class="sp"></span><button class="pill" data-act="saver-preview">${icon("play", "small")}Preview</button></div>
    <div class="tl-head"><span>When you step away</span><span class="sp"></span><label>Screensaver</label><button class="switch ${S.saver.saver ? "on" : ""}" data-saver-toggle="saver"></button></div>
    <div class="tl-box"><div class="timeline">
      <span class="tl-track"></span>
      ${t.open ? `<span class="tl-open" style="left:${t.open[0] * 100}%;width:${(t.open[1] - t.open[0]) * 100}%" title="Until it locks, a key goes back to the desktop without a password"></span>` : ""}
      <span class="tl-start"><i></i>Idle</span>
      ${t.marks.map((m) => `<button class="mk ${m.never ? "never" : ""} ${m.warn ? "warn" : ""}" data-mark="${m.id}" style="left:${m.x * 100}%"><span class="d">${icon(m.icon)}</span><span class="v">${esc(m.value)}</span><span class="n">${m.name}</span></button>`).join("")}
    </div><div class="tl-note ${t.note[1] ? "warn" : ""}">${esc(t.note[0])}</div></div>
    <div class="cols">
      <div class="group"><div class="group-head">When the machine sleeps</div><div class="box">
        <div class="row"><span class="label">Lock before sleep<small>Waking shows the password prompt, never the screensaver or your desktop</small></span><button class="switch ${S.saver.lockBeforeSleep ? "on" : ""}" data-saver-toggle="lockBeforeSleep"></button></div>
        <div class="row"><span class="label">Lock with Darwan<small>loginctl lock-session and power menus show your Darwan theme</small></span><button class="switch ${S.saver.lockWithDarwan ? "on" : ""}" data-saver-toggle="lockWithDarwan"></button></div>
      </div></div>
      <div class="group"><div class="group-head">Video</div>
        <div class="seg stretch" data-seg="quality">${segButtons(D.saver.qualities, S.saver.quality)}</div>
        <div class="notes" title="${esc(q.long)}">${esc(D.saver.qualityLine && S.saver.quality === D.saver.quality ? D.saver.qualityLine : q.long)}</div>
      </div>
    </div>
    <div class="foot">Saved to ~/.config/hypr/hypridle.conf when you save, and hypridle restarts to pick it up.</div>
  </div>`;
}

/* ─── Shared bits ─── */
const segButtons = (options, current) => `<span class="knob"></span>` + options.map((o) => `<button data-value="${esc(o.value)}" class="${o.value === current ? "on" : ""}">${esc(o.label)}${o.badge ? `<span class="badge">${o.badge}</span>` : ""}</button>`).join("");
function placeKnobs(root = document) {
  root.querySelectorAll(".seg").forEach((seg) => {
    const on = seg.querySelector("button.on"), knob = seg.querySelector(".knob");
    if (!knob) return;
    knob.style.display = on ? "" : "none";
    if (on) { knob.style.left = on.offsetLeft + "px"; knob.style.width = on.offsetWidth + "px"; }
  });
}
let popEl = null;
function pop(anchor, html, place = "above", cls = "") {
  closePop();
  const el = document.createElement("div");
  el.className = "pop " + cls;
  el.innerHTML = html;
  document.body.appendChild(el);
  const a = anchor.getBoundingClientRect(), p = el.getBoundingClientRect();
  let left = Math.min(Math.max(8, a.left + a.width / 2 - p.width / 2), innerWidth - p.width - 8);
  let top = place === "above" ? a.top - p.height - 10 : a.bottom + 8;
  if (place === "below-end") left = a.right - p.width;
  if (place === "left") { left = a.left - p.width - 14; top = Math.min(Math.max(8, a.top + a.height / 2 - p.height / 2), innerHeight - p.height - 8); }
  el.style.left = Math.max(8, left) + "px";
  el.style.top = Math.max(8, Math.min(top, innerHeight - p.height - 8)) + "px";
  el.style.setProperty("--origin", place === "left" ? "100% 50%" : `${a.left + a.width / 2 - left}px ${place === "above" ? "100%" : "0"}`);
  popEl = el;
  placeKnobs(el);
  return el;
}
function closePop() {
  if (!popEl) return;
  const el = popEl;
  popEl = null;
  el.classList.add("out");
  setTimeout(() => el.remove(), 110);
}
let toastTimer;
function toast(text, image, progress, kind, ms = 2600) {
  const t = $("#toast");
  const onStage = document.body.classList.contains("staged");
  if (!onStage) {
    t.style.position = "fixed";
    t.style.left = "auto";
    t.style.right = "24px";
    t.style.bottom = "24px";
    document.body.appendChild(t);
  } else if (t.parentElement !== $("#dock")) {
    t.removeAttribute("style");
    $("#dock").appendChild(t);
  }
  t.querySelector("img").style.display = image ? "" : "none";
  if (image) t.querySelector("img").src = image;
  t.querySelector(".tl").textContent = text;
  t.querySelector(".tp i").style.width = (progress < 0 ? 30 : progress * 100) + "%";
  t.classList.toggle("done", kind === "done");
  t.classList.add("on");
  clearTimeout(toastTimer);
  if (kind === "done") toastTimer = setTimeout(() => t.classList.remove("on"), ms);
}
function stages(steps, image, last) {
  let t = 0;
  steps.forEach(([text, ms, p], i) => {
    setTimeout(() => toast(text, image, p, i === steps.length - 1 ? "done" : "", 3200), t);
    t += ms;
  });
  if (last) setTimeout(last, t);
}

/* ─── The Wall ─── */
const chipKeep = {
  all: () => true,
  video: (c) => c.background === "video",
  fonts: (c) => D.themes[c.id].fonts.length > 0,
  inuse: (c) => c.id === S.gates.lock || c.id === S.gates.sddm,
};
const keeps = (c) => (S.filter.startsWith("family:") ? c.family === S.filter.slice(7) : chipKeep[S.filter](c)) && (S.query === "" || c.title.toLowerCase().includes(S.query) || c.id.includes(S.query));
function renderWall() {
  const gate = (kind) => {
    const c = byId[S.gates[kind]];
    return `<div class="gate" data-hover-loop="${c.loop}">
      <img src="${c.still}" alt="">
      <div class="info"><div class="l"><div class="eyebrow">${icon(kind === "lock" ? "lock" : "login", "small")}${kind === "lock" ? "Lockscreen" : "Login screen"}</div><h2>${esc(c.title)}</h2></div>
        <button class="pill" data-act="${kind === "lock" ? "lock-now" : "sddm-test"}">${kind === "lock" ? "Lock now" : "Test"}</button>
        <button class="pill primary" data-open="${c.id}">Customise</button></div></div>`;
  };
  $("#gates").innerHTML = gate("lock") + gate("sddm");
  const step = $("#stepaway");
  step.classList.toggle("open", S.stepOpen);
  step.innerHTML = `<button class="line" data-act="step">${icon("moon")}<b>When you step away</b><span class="sum">${esc(summary())}</span><span class="act">${S.stepOpen ? "Done" : "Change…"}</span></button>
    <div class="panel"><div><div class="inner">${saverPanel(true)}</div></div></div>`;
  const families = D.wall.sections.map((s) => s.title);
  const chips = [["all", "All"], ...families.map((f) => [`family:${f}`, f]), ["video", "Video backgrounds"], ["fonts", "Brings its own font"], ["inuse", "In use"]];
  const count = (key) => cards.filter((c) => (key.startsWith("family:") ? c.family === key.slice(7) : chipKeep[key](c))).length;
  $("#chips").innerHTML = chips.map(([k, l]) => `<button class="chip ${S.filter === k ? "on" : ""}" data-chip="${k}">${esc(l)}<span class="n">${count(k)}</span></button>`).join("");
  const shown = cards.filter(keeps);
  S.order = shown.map((c) => c.id);
  $("#sections").innerHTML = shown.length === 0 ? `<div class="empty">No theme matches “${esc(S.query)}”.</div>`
    : D.wall.sections.map((s) => {
      const list = shown.filter((c) => c.family === s.title);
      if (!list.length) return "";
      return `<div class="family"><h3>${esc(s.title)}</h3><span>${list.length}</span></div><div class="grid">${list.map(card).join("")}</div>`;
    }).join("");
  placeKnobs($("#stepaway"));
}
function card(c) {
  const [kindIcon, kindText] = kindOf(c.background);
  const marks = (c.id === S.gates.lock ? `<span class="mark" style="color:var(--lock)" title="Your lockscreen">${icon("lock")}</span>` : "")
    + (c.id === S.gates.sddm ? `<span class="mark" style="color:var(--login)" title="Your login screen">${icon("login")}</span>` : "");
  return `<div class="card" tabindex="0" data-open="${c.id}" data-id="${c.id}" data-hover-loop="${c.loop}">
    <div class="thumb"><img src="${c.still}" loading="lazy" alt=""><div class="marks">${marks}</div></div>
    <div class="meta"><span class="name">${esc(c.name)}</span><span class="kind">${icon(kindIcon)}${kindText}</span></div></div>`;
}
// One loop at a time, only while its card is hovered or chosen from the keyboard.
function playLoop(host) {
  if (!host || host.querySelector("img.loop")) return;
  const img = new Image();
  img.className = "loop";
  img.onload = () => img.classList.add("ready");
  img.src = host.dataset.hoverLoop;
  (host.querySelector(".thumb") || host).insertBefore(img, host.querySelector(".marks, .info"));
}
const stopLoop = (host) => host?.querySelector("img.loop")?.remove();
document.addEventListener("mouseover", (e) => {
  const h = e.target.closest("[data-hover-loop]");
  if (h && !document.body.classList.contains("staged")) playLoop(h);
});
document.addEventListener("mouseout", (e) => {
  const h = e.target.closest("[data-hover-loop]");
  if (h && !h.contains(e.relatedTarget) && !(S.keyboard && h === document.activeElement)) stopLoop(h);
});

/* ─── The Stage ─── */
const INSPECTOR = 404;
function target() {
  const W = innerWidth, H = innerHeight;
  const L = 56, R = (S.inspector ? W - INSPECTOR : W) - 32, T = 72, B = H - 100;
  let w = R - L, h = (w * 9) / 16;
  if (h > B - T) { h = B - T; w = (h * 16) / 9; }
  return { left: L + (R - L - w) / 2, top: T + (B - T - h) / 2, width: w, height: h };
}
const place = (el, r) => Object.assign(el.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
function layout() {
  const r = target();
  if (document.body.classList.contains("staged")) place($("#frame"), r);
  $("#dock").style.left = r.left + r.width / 2 + "px";
  $("#strip").style.left = r.left + r.width / 2 + "px";
}
const themeId = () => S.order[S.current];
let liveTimer;
function loadLive() {
  const id = themeId(), frame = $("#frame"), c = byId[id];
  frame.classList.remove("live-ready", "loading-on");
  frame.querySelector(".still").src = c.still;
  frame.querySelector(".loading div").textContent = `Loading ${c.title}…`;
  const key = id + S.mode;
  const img = new Image();
  const started = performance.now();
  clearTimeout(liveTimer);
  // A theme opened before comes straight back; a first open says it's loading instead of looking stuck.
  if (!S.seen.has(key)) liveTimer = setTimeout(() => frame.classList.add("loading-on"), 120);
  img.onload = () => {
    if (themeId() !== id) return;
    setTimeout(() => {
      clearTimeout(liveTimer);
      frame.querySelector(".live").src = img.src;
      frame.classList.remove("loading-on");
      frame.classList.add("live-ready");
      S.seen.add(key);
    }, S.seen.has(key) ? 0 : Math.max(0, 700 - (performance.now() - started)));
  };
  img.src = c.loop;
}
function openTheme(id, from) {
  closePop();
  const frame = $("#frame");
  S.current = S.order.indexOf(id);
  if (S.current < 0) { S.order = cards.map((c) => c.id); S.current = S.order.indexOf(id); }
  const r = from?.getBoundingClientRect();
  frame.classList.remove("animate", "live-ready", "loading-on", "comparing");
  frame.style.display = "block";
  frame.style.opacity = 1;
  $("#backdrop img").src = byId[id].still;
  frame.querySelector(".still").src = byId[id].still;
  frame.querySelector(".live").removeAttribute("src");
  if (r) place(frame, r); else { place(frame, target()); frame.style.opacity = 0; }
  document.body.classList.add("staged");
  document.body.classList.remove("settled");
  renderStage();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    frame.classList.add("animate");
    frame.style.opacity = 1;
    layout();
    setTimeout(() => { document.body.classList.add("settled"); loadLive(); }, 370);
  }));
  poke();
}
function closeTheme() {
  closePop();
  const id = themeId(), frame = $("#frame");
  document.body.classList.remove("settled", "idle");
  const c = document.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
  c?.scrollIntoView({ block: "nearest" });
  document.body.classList.remove("staged");
  frame.classList.remove("live-ready", "loading-on");
  const r = c?.querySelector(".thumb").getBoundingClientRect();
  if (r && r.bottom > 0 && r.top < innerHeight) place(frame, r); else frame.style.opacity = 0;
  setTimeout(() => { frame.style.display = "none"; }, 360);
  S.keyboard = false;
  $("#toast").classList.remove("on");
}
function step(by) {
  S.current = (S.current + by + S.order.length) % S.order.length;
  $("#backdrop img").src = byId[themeId()].still;
  renderStage();
  loadLive();
}
function renderStage() {
  if (S.current < 0) return;
  const id = themeId(), t = D.themes[id];
  $("#stageTitle").innerHTML = `${esc(t.name)}${dirty() ? " <em>— Edited</em>" : ""}`;
  $("#stageSub").textContent = `by ${t.author} · ${t.background} background${id === S.gates.lock ? " · your lockscreen" : ""}${id === S.gates.sddm ? " · your login screen" : ""}`;
  $("#modes").innerHTML = segButtons([{ value: "lock", label: "Lockscreen" }, { value: "sddm", label: "Login screen" }], S.mode);
  $("#compareBtn").hidden = changes(id) === 0;
  const i = S.current, n = S.order.length;
  const near = [...new Set([-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => S.order[(i + k + n * 2) % n]))];
  $("#strip").innerHTML = near.map((tid) => `<button class="${tid === id ? "on" : ""}" data-switch="${tid}" title="${esc(byId[tid].title)}"><img src="${byId[tid].still}" alt=""></button>`).join("");
  placeKnobs($("#stage"));
  renderInspector();
}

/* ─── The settings ─── */
function control(f, fields) {
  const v = valueOf(f);
  switch (f.control) {
    case "switch": return `<button class="switch ${v === "true" ? "on" : ""}" data-flip="${f.key}"></button>`;
    case "looks": return `<div class="looks">${f.choices.map((c) => { const look = c.value === "light" || c.value === "dark" ? c.value : "auto"; return `<button class="${c.value === v ? "on" : ""}" data-set="${f.key}" data-value="${esc(c.value)}"><span class="tile ${look}"></span>${look === "auto" ? "Auto" : esc(c.label)}</button>`; }).join("")}</div>`;
    case "segmented": return `<div class="seg small" data-seg-field="${f.key}">${segButtons(f.choices, v)}</div>`;
    case "menu": return `<select class="menu ${isSet(f) ? "" : "default"}" data-select="${f.key}">${f.choices.map((c) => `<option value="${esc(c.value)}" ${c.value === v ? "selected" : ""}>${esc(c.label)}</option>`).join("")}</select>`;
    case "slider": { const n = parseFloat(v || 0), p = ((n - f.min) / (f.max - f.min)) * 100; return `<div class="slider"><input type="range" min="${f.min}" max="${f.max}" step="${f.step || 1}" value="${n}" style="--p:${p}%" data-range="${f.key}"><output>${n}${f.unit}</output></div>`; }
    case "well": { const gen = v === "generate", ok = /^#[0-9a-f]{3,8}$/i.test(v); return `<span class="well-row"><span class="code">${gen ? "from background" : ok ? v.toLowerCase() : "theme’s own"}</span><span class="well"><span class="${gen ? "gen" : ok ? "" : "none"}" style="${ok ? `background:${v}` : ""}"></span><input type="color" value="${ok && v.length === 7 ? v : "#0a84ff"}" data-colour="${f.key}" title="Pick a colour"></span></span>`; }
    case "media": return `<div class="media"><div class="tile"><img src="${v === "" ? byId[themeId()].still : byId[S.gates.sddm].still}" alt=""></div><div><select class="menu ${isSet(f) ? "" : "default"}" data-select="${f.key}"><option value="" ${v === "" ? "selected" : ""}>The theme’s own</option><option value="desktop" ${v === "desktop" ? "selected" : ""}>Desktop wallpaper</option></select><small>or drop a file on the picture</small></div></div>`;
    case "font": return `<div><select class="menu ${isSet(f) ? "" : "default"}" data-select="${f.key}"><option value="">Theme default</option>${["Inter", "JetBrains Mono", "Noto Serif", "Outfit"].map((x) => `<option ${x === v ? "selected" : ""}>${x}</option>`).join("")}</select>${v ? `<div class="sample" style="font-family:'${esc(v)}'">The quick brown fox · 12:34</div>` : ""}</div>`;
    default: return `<input class="menu" value="${esc(v)}" data-text="${f.key}" placeholder="Theme default">`;
  }
}
function row(f, fields, first) {
  const off = offReason(f, fields), stacked = f.control === "media" || f.control === "font";
  return `<div class="row ${stacked ? "stacked" : ""} ${off ? "off" : ""} ${isSet(f) ? "changed" : ""}" title="${esc(off)}">
    <span class="label">${esc(f.label)}</span>
    ${isSet(f) && !stacked ? `<button class="reset" data-reset="${f.key}" title="Back to the default">${icon("reset", "small")}</button>` : ""}
    ${control(f, fields)}</div>`;
}
function group(title, list, fields, extraNotes = [], foldable = true) {
  const closed = S.closed.includes(title), n = list.filter(isSet).length;
  return `<div class="group ${closed ? "closed" : ""}"><button class="group-head" ${foldable ? `data-fold="${esc(title)}"` : ""}>${esc(title)}${n ? `<span class="count">${n} changed</span>` : ""}${foldable ? icon("down") : ""}</button>
    <div class="box">${list.map((f, i) => row(f, fields, i === 0)).join("")}</div>
    ${[...notes(list, fields), ...extraNotes].map((t) => `<div class="notes">${esc(t)}</div>`).join("")}</div>`;
}
const clockNote = "Used by every theme that shows a clock or date. Left at the default, each theme keeps its own design.";
function renderInspector() {
  if (S.current < 0) return;
  const id = themeId(), t = D.themes[id], fields = allFields(id);
  $("#insName").textContent = t.name;
  $("#tabs").innerHTML = segButtons([{ value: "theme", label: "This theme", badge: changes(id) }, { value: "all", label: "All themes", badge: globalChanges() }], S.tab);
  const body = $("#insBody"), top = body.scrollTop;
  body.innerHTML = S.tab === "theme"
    ? t.form.groups.map((g) => group(g.title, g.fields, fields)).join("")
    : group("Clock and date", t.globals.fields, fields, [clockNote])
      + `<div class="group"><div class="group-head">Screensaver</div><div class="box"><div class="row"><span class="label">When you step away<small>${esc(summary())}</small></span><button class="btn" data-act="saver-settings">Settings…</button></div></div></div>`
      + `<div class="group"><div class="group-head">Login screen</div><div class="box"><div class="row"><span class="label">Test it in SDDM’s own greeter<small>Opens a window; your session stays as it is.</small></span><button class="btn" data-act="sddm-test">Open…</button></div></div></div>`;
  body.scrollTop = top;
  placeKnobs($("#inspector"));
}
function renderAll() {
  document.body.classList.toggle("dirty", dirty());
  renderWall();
  renderStage();
  if (popEl?.classList.contains("settings-pop")) fillSettings(popEl);
}
function fillSettings(el) {
  const fields = allFields(S.gates.lock);
  el.innerHTML = `<div class="h"><b>Settings</b><div class="seg stretch" data-seg="settab">${segButtons([{ value: "general", label: "General", badge: globalChanges() }, { value: "saver", label: "Screensaver" }], S.settab)}</div></div>
    <div class="b">${S.settab === "general" ? group("Clock and date", D.themes[S.gates.lock].globals.fields, fields, [clockNote], false) : saverPanel(false)}</div>`;
  placeKnobs(el);
}

/* ─── Look switch ─── */
function renderLook() {
  document.body.dataset.look = S.look;
  $("#look").innerHTML = `<span class="knob" style="top:${S.look === "darwan" ? 4 : 34}px"></span>
    <button class="${S.look === "darwan" ? "on" : ""}" data-look-choice="darwan" title="Darwan’s own look${S.look === "darwan" ? " · in use" : ""}"><img src="/darwan.svg" alt=""></button>
    <button class="${S.look === "system" ? "on" : ""}" data-look-choice="system" title="Your system’s Qt theme${S.look === "system" ? " · in use" : ""}">${icon("display")}</button>`;
  requestAnimationFrame(() => placeKnobs());
}

/* ─── Input ─── */
document.addEventListener("click", (e) => {
  const t = e.target;
  if (popEl && !popEl.contains(t) && !t.closest("[data-act=try],[data-act=use],[data-act=settings],[data-act=saver-settings],[data-mark]")) closePop();
  const look = t.closest("[data-look-choice]");
  if (look) { S.look = look.dataset.lookChoice; return renderLook(); }
  const open = t.closest("[data-open]");
  if (open && !t.closest("[data-act]")) return openTheme(open.dataset.open, open.querySelector(".thumb") || open);
  const chip = t.closest("[data-chip]");
  if (chip) { S.filter = chip.dataset.chip; return renderWall(); }
  const segBtn = t.closest(".seg button");
  if (segBtn) {
    const seg = segBtn.closest(".seg"), v = segBtn.dataset.value;
    if (seg.id === "modes") { S.mode = v; renderStage(); return loadLive(); }
    if (seg.id === "tabs") { S.tab = v; return renderInspector(); }
    if (seg.dataset.seg === "settab") { S.settab = v; return fillSettings(popEl); }
    if (seg.dataset.seg === "quality") { S.saver.quality = v; return renderAll(); }
    if (seg.dataset.segField) return set(seg.dataset.segField, v);
  }
  const setBtn = t.closest("[data-set]");
  if (setBtn) return set(setBtn.dataset.set, setBtn.dataset.value);
  const flip = t.closest("[data-flip]");
  if (flip) {
    const f = allFields(S.current >= 0 ? themeId() : S.gates.lock).find((x) => x.key === flip.dataset.flip);
    return set(f.key, valueOf(f) === "true" ? "false" : "true");
  }
  const reset = t.closest("[data-reset]");
  if (reset) return set(reset.dataset.reset, "");
  const fold = t.closest("[data-fold]");
  if (fold) { const g = fold.dataset.fold; S.closed = S.closed.includes(g) ? S.closed.filter((x) => x !== g) : [...S.closed, g]; return renderInspector(); }
  const sw = t.closest("[data-switch]");
  if (sw) { S.current = S.order.indexOf(sw.dataset.switch); $("#backdrop img").src = byId[themeId()].still; renderStage(); return loadLive(); }
  const tog = t.closest("[data-saver-toggle]");
  if (tog) { const k = tog.dataset.saverToggle; S.saver[k] = k === "saver" ? (S.saver.saver ? 0 : 300) : !S.saver[k]; return renderAll(); }
  const mark = t.closest("[data-mark]");
  if (mark) {
    const id = mark.dataset.mark, cur = timeline().marks.find((m) => m.id === id).cur;
    const el = pop(mark, saverMarks[id].map((c) => `<button class="item" data-mark-set="${id}" data-value="${c.value}">${esc(c.label)}${String(c.value) === cur ? '<span class="hint">✓</span>' : ""}</button>`).join(""), "below");
    el.style.minWidth = "180px";
    return;
  }
  const markSet = t.closest("[data-mark-set]");
  if (markSet) {
    const id = markSet.dataset.markSet, v = markSet.dataset.value;
    S.saver[id] = id === "lock" ? v : +v;
    closePop();
    return renderAll();
  }
  const a = t.closest("[data-act]");
  if (!a) return;
  const act = {
    back: closeTheme,
    step: () => { S.stepOpen = !S.stepOpen; renderWall(); if (S.stepOpen) setTimeout(() => $("#stepaway").scrollIntoView({ behavior: "smooth", block: "start" }), 360); },
    inspector: () => { S.inspector = !S.inspector; document.body.classList.toggle("inspector", S.inspector); layout(); },
    save: () => { S.draft = {}; toast("Saved to ~/.config/darwan/config.toml (in the app)", "", 1, "done"); renderAll(); },
    discard: () => { S.draft = {}; renderAll(); },
    doctor: () => toast("Doctor: the session, the themes and SDDM all check out", "", 1, "done"),
    settings: () => { if (popEl?.classList.contains("settings-pop")) return closePop(); S.settab = "general"; fillSettings(pop(a, "", "below-end", "settings-pop")); },
    "saver-settings": () => { S.settab = "saver"; const el = pop(a, "", "left", "settings-pop"); fillSettings(el); },
    "lock-now": () => toast(`In the app, this locks your session with ${byId[S.gates.lock].title}`, byId[S.gates.lock].still, 1, "done", 3500),
    "sddm-test": () => toast("In the app, this opens SDDM’s own greeter in a window", byId[S.gates.sddm].still, 1, "done", 3500),
    "saver-preview": () => toast("In the app, this plays your lockscreen’s screensaver full screen", byId[S.gates.lock].still, 1, "done", 3500),
    check: () => stages([["Loading it offscreen", 800, 0.25], ["Looking for QML errors", 800, 0.55], ["Typing the password", 900, 0.85], ["Check passed", 10, 1]], byId[themeId()].still),
    try: () => {
      if (popEl) return closePop();
      const el = pop(a, ["Full-screen preview", "Screensaver (this theme)", "Through SDDM’s own greeter", null, "Lock now with this theme"].map((x) => (x ? `<button class="item" data-try>${x}</button>` : '<div class="divider"></div>')).join(""), "above");
      el.style.minWidth = "250px";
      el.addEventListener("click", (ev) => { if (ev.target.closest("[data-try]")) { closePop(); toast("In the app, this runs darwan with this theme", byId[themeId()].still, 1, "done", 3200); } });
    },
    use: () => {
      if (popEl) return closePop();
      const id = themeId();
      const choice = (gate, label, ic) => `<button class="choice" data-gate="${gate}" ${S.gates[gate] === id ? "disabled" : ""}><div class="swap"><img class="from" src="${byId[S.gates[gate]].still}" alt="">${icon("right")}<img src="${byId[id].still}" alt=""></div><div class="what">${icon(ic)}${label}</div><div class="now">${S.gates[gate] === id ? "Already this theme" : "Now: " + esc(byId[S.gates[gate]].name)}</div></button>`;
      const el = pop(a, `<h4>Use ${esc(byId[id].title)} as</h4><div class="gate-choices">${choice("lock", "Lockscreen", "lock")}${choice("sddm", "Login screen", "login")}</div><button class="btn both" data-gate="both">Both</button>`, "above");
      el.addEventListener("click", (ev) => {
        const g = ev.target.closest("[data-gate]");
        if (!g || g.disabled) return;
        closePop();
        const img = byId[id].still;
        const lock = () => { S.gates.lock = id; toast("Lockscreen set", img, 1, "done"); renderAll(); };
        const sddm = () => stages([["Asking for permission", 1100, 0.25], ["Installing to the login screen", 1300, 0.7], ["Login screen set", 10, 1]], img, () => { S.gates.sddm = id; renderAll(); });
        if (g.dataset.gate === "lock") lock();
        else if (g.dataset.gate === "sddm") sddm();
        else { lock(); setTimeout(sddm, 900); }
      });
    },
  }[a.dataset.act];
  act?.();
});
document.addEventListener("change", (e) => {
  const s = e.target.closest("[data-select]");
  if (s) return set(s.dataset.select, s.value);
  const tx = e.target.closest("[data-text]");
  if (tx) set(tx.dataset.text, tx.value);
});
document.addEventListener("input", (e) => {
  const r = e.target.closest("[data-range]");
  if (r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%"); r.nextElementSibling.textContent = r.value + (allFields(themeId()).find((f) => f.key === r.dataset.range)?.unit || ""); }
  const c = e.target.closest("[data-colour]");
  if (c) c.previousElementSibling.style.background = c.value;
});
document.addEventListener("pointerup", (e) => {
  const r = e.target.closest?.("[data-range]");
  if (r) set(r.dataset.range, String(r.value));
  compare(false);
});
document.addEventListener("change", (e) => { const c = e.target.closest("[data-colour]"); if (c) set(c.dataset.colour, c.value); }, true);
const compare = (on) => { $("#frame").classList.toggle("comparing", on && changes(themeId()) > 0); $("#compareBtn").classList.toggle("held", on); };
$("#compareBtn").addEventListener("pointerdown", () => compare(true));
$("#search").addEventListener("input", (e) => { S.query = e.target.value.trim().toLowerCase(); renderWall(); });

// The bars step aside after 2.5 s without the pointer moving, never while it rests on them.
let idleTimer;
function poke(e) {
  document.body.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const over = document.querySelector("#inspector:hover, .dock:hover, #stage .top:hover, .strip:hover, .lookswitch:hover");
    if (document.body.classList.contains("settled") && !popEl && !over) document.body.classList.add("idle");
  }, 2500);
  if (e && document.body.classList.contains("settled")) {
    const near = e.clientY > innerHeight - 170 && e.clientX < innerWidth - (S.inspector ? INSPECTOR : 0);
    $("#strip").classList.toggle("on", near || $("#strip").matches(":hover"));
  }
}
addEventListener("mousemove", (e) => { S.keyboard = false; poke(e); });
addEventListener("resize", () => { layout(); placeKnobs(); });

addEventListener("keydown", (e) => {
  const typing = e.target.closest("input, select, textarea");
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") { e.preventDefault(); if (document.body.classList.contains("staged")) closeTheme(); return $("#search").focus(); }
  if (e.key === "Escape") { if (popEl) return closePop(); if (typing) return e.target.blur(); if (document.body.classList.contains("staged")) return closeTheme(); }
  if (typing) return;
  if (document.body.classList.contains("staged")) {
    poke();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") { e.preventDefault(); $("[data-act=inspector]").click(); }
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "\\" && !e.repeat) compare(true);
    return;
  }
  const c = e.target.closest(".card");
  if (!c) return;
  const all = [...document.querySelectorAll(".card")], i = all.indexOf(c);
  const cols = getComputedStyle(c.parentElement).gridTemplateColumns.split(" ").length;
  const to = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + cols, ArrowUp: i - cols }[e.key];
  if (to !== undefined) {
    e.preventDefault();
    S.keyboard = true;
    const next = all[Math.max(0, Math.min(all.length - 1, to))];
    all.forEach((x) => { x.classList.remove("kb"); stopLoop(x); });
    next.classList.add("kb");
    next.focus();
    next.scrollIntoView({ block: "nearest", behavior: "smooth" });
    playLoop(next);
  }
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTheme(c.dataset.id, c.querySelector(".thumb")); }
});
addEventListener("keyup", (e) => { if (e.key === "\\") compare(false); });

// A theme picked at random behind the glass, as the app does at each launch.
$("#wallpaper img").src = cards[Math.floor(Math.random() * cards.length)].still;
document.body.classList.add("inspector");
renderLook();
renderAll();
layout();
