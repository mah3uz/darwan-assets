// The Wallpapers pages, as the GUI lays them out: Home, Library and Explore over one of your wallpapers, and a
// wallpaper full-window with Set. The pictures are free ones (Wikimedia Commons, NASA), shown from their sources.
export function walls({ D, $, esc, icon, toast, pop, closePop, segButtons, placeKnobs }) {
  const W = D.walls;
  const lists = { library: W.library, apod: W.apod, nature: W.nature, space: W.space, city: W.city, explore: W.explore };
  const S = { view: "home", category: null, featured: W.library[0], source: "", ratio: "", sort: "popular", libQuery: "", detail: null, lockOffered: false };
  const shuffled = (l) => l.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  let current = [];

  const credit = (it) => [it.sourceLabel, it.author].filter(Boolean).join(" · ");
  function card(it, list, i, cls = "") {
    const badge = list === "library" ? (i === 0 ? "IN USE" : i < 3 ? "NEW" : "") : it.downloaded ? "✓ DOWNLOADED" : "";
    return `<div class="wcard ${cls}" data-w="${list}" data-i="${i}"><div class="wthumb">
      <img src="${esc(it.thumb)}" loading="lazy" alt="" onload="this.classList.add('ready')" onerror="this.closest('.wcard').remove()">
      ${badge ? `<span class="wbadge">${badge}</span>` : ""}
      <div class="over"><b>${esc(it.title)}</b><span>${esc(list === "library" ? it.folder + (it.size ? "  ·  " + it.size : "") : credit(it))}</span></div></div></div>`;
  }
  const grid = (items, list) => `<div class="wgrid">${items.map((it) => card(it, list, lists[list].indexOf(it))).join("")}</div>`;
  const row = (title, sub, list, all) => `<div class="wrow"><div class="wrow-head"><div><div class="t">${esc(title)}${all ? `<button data-w-all="${list}" title="See all">${icon("right")}</button>` : ""}</div><div class="s">${esc(sub)}</div></div>
    <div class="arrows"><button data-w-scroll="-1">${icon("left")}</button><button data-w-scroll="1">${icon("right")}</button></div></div>
    <div class="wrow-list">${lists[list].map((it, i) => card(it, list, i)).join("")}</div></div>`;
  const titles = { apod: ["SOURCE", "NASA APOD"], nature: ["CATEGORY", "Nature"], space: ["CATEGORY", "Space"], city: ["CATEGORY", "City"] };

  function home() {
    const f = S.featured;
    return `<div class="wpad">
      <div class="whero"><div class="kicker">Featured</div><h1>${esc(f.title)}</h1>
        <div class="facts"><span>Your Library</span>${f.size ? `<span>${f.size}</span>` : ""}</div>
        <button class="glassbtn" data-w-featured>View Wallpaper${icon("external")}</button></div>
      <div class="wstrip">${W.library.map((it, i) => card(it, "library", i, it === f ? "on" : "")).join("")}</div>
      ${row("Astronomy Picture of the Day", "From NASA, day by day", "apod", true)}
      ${row("Featured on Wikimedia Commons", "Freely licensed nature photography", "nature", true)}
      ${row("Recently added", "The newest in your Library", "library", false)}
      <div class="wnote">In the app, Today on Bing and Popular on Wallhaven are here too, and every row fills as you scroll.</div>
    </div>`;
  }
  function library() {
    const words = S.libQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const shown = W.library.filter((it) => words.every((w) => (it.title + " " + it.folder).toLowerCase().includes(w)));
    return `<div class="wpad"><div class="whead"><div class="k">LIBRARY</div>
      <h2>Your wallpapers<span class="sp"></span><label class="wsearch">${icon("search")}<input data-w-libsearch placeholder="Search your wallpapers" value="${esc(S.libQuery)}"></label></h2>
      <div class="sub">~/Pictures/Wallpapers  ·  ${W.library.length} wallpapers</div></div>
      ${shown.length ? grid(shown, "library") : `<div class="wnote">Nothing matches.</div>`}</div>`;
  }
  const ratioOf = (it) => { const m = /^(\d+)×(\d+)$/.exec(it.size || ""); return m ? +m[1] / +m[2] : 0; };
  const ratios = { "21x9": [2.2, 9], "16x9": [1.7, 1.8], "16x10": [1.55, 1.65] };
  function explore() {
    let shown = W.explore.filter((it) => (S.source === "" || it.source === S.source) && (!S.ratio || (ratioOf(it) >= ratios[S.ratio][0] && ratioOf(it) <= ratios[S.ratio][1])));
    if (S.sort === "latest") shown = [...shown].reverse();
    if (S.sort === "random") shown = shuffled(shown);
    const chip = (on, label, attr) => `<button class="wchip ${on ? "on" : ""}" ${attr}>${esc(label)}</button>`;
    return `<div class="wpad"><div class="wcenter"><h2>Explore</h2>
      <div class="sub">Free wallpapers from Wallhaven, Bing, NASA and Wikimedia Commons. Never anything sexual.</div>
      <div class="wtools"><label class="wsearch">${icon("search")}<input data-w-search placeholder="Search Wallhaven"></label><button class="wbtn" data-w-filter>${icon("filter")}Filter</button></div></div>
      <div class="wchips" style="margin-top:46px">${chip(S.source === "", "All sources", 'data-w-source=""')}${W.sources.map((s) => chip(S.source === s.value, s.label, `data-w-source="${s.value}"`)).join("")}</div>
      <div class="wchips">${[["21x9", "Ultrawide (21:9)"], ["16x9", "Landscape (16:9)"], ["16x10", "16:10"]].map(([v, l]) => chip(S.ratio === v, l, `data-w-ratio="${v}"`)).join("")}</div>
      <div class="wchips">${["nature", "space", "city"].map((t) => chip(false, titles[t][1], `data-w-all="${t}"`)).join("")}</div>
      <div class="wsort"><div class="l"><b>${{ popular: "Popular Wallpapers", latest: "Latest Wallpapers", random: "Something Different" }[S.sort]}</b><span>${S.source === "" ? "From every source, mixed" : "From " + esc(W.sources.find((s) => s.value === S.source).label)}</span></div>
        <div class="seg" data-w-sort>${segButtons([{ value: "popular", label: "Popular" }, { value: "latest", label: "Latest" }, { value: "random", label: "Random" }], S.sort)}</div></div>
      ${shown.length ? grid(shown, "explore") : `<div class="wnote">Nothing in this shape here; the app finds more as you scroll.</div>`}</div>`;
  }
  function category() {
    const [k, t] = titles[S.category];
    return `<div class="wpad"><div class="whead"><button class="wback-link" data-w-back>${icon("left")}Back</button><div class="k" style="margin-top:18px">${k}</div><h2>${esc(t)}</h2></div>${grid(lists[S.category], S.category)}</div>`;
  }

  // The featured picture behind the pages, crossfading when another is featured; sharp behind Home only.
  function backdrop() {
    const bg = $("#wallsBg"), src = S.featured.preview;
    bg.classList.toggle("blur", S.view !== "home" || S.category !== null);
    const a = bg.querySelector("img.a"), b = bg.querySelector("img.b");
    const shown = bg.classList.contains("flip") ? b : a, next = shown === a ? b : a;
    if (shown.getAttribute("src") === src) return;
    if (!shown.getAttribute("src")) { shown.src = src; return; }
    next.onload = () => bg.classList.toggle("flip", next === b);
    next.src = src;
  }
  function render(view) {
    if (view) { if (view !== S.view) S.category = null; S.view = view; }
    const el = $("#wallsView");
    el.innerHTML = S.category ? category() : { home, library, explore }[S.view]();
    placeKnobs(el);
    backdrop();
  }

  function open(list, i) {
    S.detail = { list, i };
    S.lockOffered = false;
    document.body.classList.add("wdetail");
    show();
  }
  function show() {
    const { list, i } = S.detail, it = lists[list][i], d = $("#wdetail");
    d.classList.remove("ready");
    d.querySelector(".stand").src = it.thumb;
    const full = d.querySelector(".full");
    full.onload = () => { if (full.getAttribute("src") === it.preview) d.classList.add("ready"); };
    full.src = it.preview;
    const licence = it.licenceUrl ? `<a href="${esc(it.licenceUrl)}" target="_blank" rel="noopener">${esc(it.licence)}</a>` : esc(it.licence);
    $("#wbar").innerHTML = `<div class="t"><b>${esc(it.title)}</b><span>${[it.size, esc(credit(it)), licence].filter(Boolean).join("  ·  ")}</span></div>
      ${S.lockOffered ? `<button class="pill" data-w-lock>Use on lockscreen too</button>` : ""}
      <button class="pill primary" data-w-set>Set Wallpaper</button>`;
    d.querySelectorAll(".wstep").forEach((b) => (b.hidden = lists[list].length < 2));
  }
  const close = () => { document.body.classList.remove("wdetail"); S.detail = null; };
  function step(by) {
    const n = lists[S.detail.list].length;
    S.detail.i = (S.detail.i + by + n) % n;
    show();
  }

  function settings(anchor) {
    const el = pop(anchor, `<div class="h"><b>Wallpapers</b></div><div class="b">
      <div class="box"><div class="row"><span class="label">Wallpaper folder<small>~/Pictures/Wallpapers</small></span><button class="btn" data-w-toast="In the app, this picks another folder">Change</button></div>
      <div class="row"><span class="label">Set through hyprpaper<small>Found running; DMS, Noctalia, Caelestia, swww and more work too</small></span></div>
      <div class="row"><span class="label">Run matugen after each change<small>Your colours follow the wallpaper</small></span><button class="switch" data-w-flip></button></div></div></div>`, "below-end", "settings-pop");
    el.style.width = "380px";
  }
  function filter(anchor) {
    pop(anchor, `<div class="b" style="padding:6px">${W.groups.map((g) => `<div class="row"><span class="label">Show ${esc(g.toLowerCase())}</span><button class="switch" data-w-flip></button></div>`).join("")}
      <div class="notes" style="padding:8px 12px">Sexual content is never shown, whatever is on here.</div></div>`, "below", "settings-pop").style.width = "320px";
  }

  // Everything the Wallpapers pages answer; false when a click wasn't theirs.
  function click(t) {
    const w = t.closest("[data-w]");
    if (w && !t.closest(".wstrip")) { open(w.dataset.w, +w.dataset.i); return true; }
    if (w) { S.featured = W.library[+w.dataset.i]; render(); return true; }
    if (t.closest("[data-w-featured]")) { open("library", W.library.indexOf(S.featured)); return true; }
    const all = t.closest("[data-w-all]");
    if (all) { S.category = all.dataset.wAll; render(); $("#wallsView").scrollTop = 0; return true; }
    if (t.closest("[data-w-back]")) { S.category = null; render(); return true; }
    const sc = t.closest("[data-w-scroll]");
    if (sc) { const l = sc.closest(".wrow").querySelector(".wrow-list"); l.scrollBy({ left: +sc.dataset.wScroll * l.clientWidth * 0.8 }); return true; }
    const src = t.closest("[data-w-source]");
    if (src) { S.source = src.dataset.wSource; render(); return true; }
    const r = t.closest("[data-w-ratio]");
    if (r) { S.ratio = S.ratio === r.dataset.wRatio ? "" : r.dataset.wRatio; render(); return true; }
    const sort = t.closest("[data-w-sort] button");
    if (sort) { S.sort = sort.dataset.value; render(); return true; }
    if (t.closest("[data-w-filter]")) { filter(t.closest("[data-w-filter]")); return true; }
    if (t.closest("[data-w-flip]")) { t.closest("[data-w-flip]").classList.toggle("on"); return true; }
    const tt = t.closest("[data-w-toast]");
    if (tt) { closePop(); toast(tt.dataset.wToast, "", 1, "done", 3000); return true; }
    if (t.closest("[data-w-set]")) {
      const it = lists[S.detail.list][S.detail.i];
      toast(it.source === "commons" || it.source === "apod" ? "In the app: downloaded into your folder and set with hyprpaper" : "In the app: set with hyprpaper", it.thumb, 1, "done", 3500);
      S.lockOffered = true;
      show();
      return true;
    }
    if (t.closest("[data-w-lock]")) { toast("In the app, your lockscreen shows your desktop wallpaper too", lists[S.detail.list][S.detail.i].thumb, 1, "done", 3500); return true; }
    const act = t.closest("[data-act]")?.dataset.act;
    if (act === "wd-close") { close(); return true; }
    if (act === "wd-prev" || act === "wd-next") { step(act === "wd-next" ? 1 : -1); return true; }
    if (act === "walls-add") { toast("In the app, + copies pictures or videos into your Library", "", 1, "done", 3000); return true; }
    if (act === "walls-settings") { settings(t.closest("[data-act]")); return true; }
    return false;
  }
  function key(e) {
    if (S.detail) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      return true;
    }
    if (e.key === "Enter" && e.target.matches("[data-w-search]")) { toast("In the app, this searches Wallhaven", "", 1, "done", 3000); return true; }
    return false;
  }
  function input(e) {
    if (!e.target.matches("[data-w-libsearch]")) return;
    S.libQuery = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const box = $("[data-w-libsearch]");
    box.focus();
    box.setSelectionRange(pos, pos);
  }
  return { render, click, key, input, open: () => S.detail !== null };
}
