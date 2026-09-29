// The data darwan.dev's GUI demo shows, made by darwan-gui's own model code, so the demo matches the app: every
// theme's settings as the GUI groups them, the Wall, and a screensaver that is set up and running.
#![allow(dead_code)]
#[path = "../../../../darwan/crates/darwan-gui/src/model.rs"]
mod model;
#[path = "../../../../darwan/crates/darwan-gui/src/idle.rs"]
mod idle;

use std::collections::BTreeMap;
use std::path::Path;

use darwan_core::catalog::Catalog;
use darwan_core::config::UserConfig;
use darwan_core::hypridle::{self, Setup};
use darwan_core::wallpaper::filter::Allowed;
use darwan_core::wallpaper::online::{Client, Found, Query, Source};
use serde_json::{Map, Value, json};

// Cards point at local files; the site serves its own stills and the demo animations under the same slug.
fn site_paths(v: &mut Value) {
    match v {
        Value::Object(o) => {
            if let (Some(Value::String(id)), true) = (o.get("id").cloned(), o.contains_key("still")) {
                let slug = id.replace('/', "_");
                o.insert("still".into(), format!("/stills/{slug}.webp").into());
                o.insert("loop".into(), format!("/assets/{slug}.webp").into());
            }
            o.values_mut().for_each(site_paths);
        }
        Value::Array(a) => a.iter_mut().for_each(site_paths),
        _ => {}
    }
}

// A picture for the Wallpapers pages, shown straight from its source with its credit. The grid's thumbnail is the
// source's own; the preview a screen-sized one where the source has sizes (Commons), its only image otherwise.
fn picture(f: &Found, topic: &str) -> Value {
    let preview = if f.thumb.contains("/thumb/") {
        f.thumb.replacen("/500px-", "/1920px-", 1)
    } else {
        f.thumb.clone()
    };
    json!({
        "key": format!("{}:{}", f.source.id(), f.id),
        "source": f.source.id(),
        "sourceLabel": f.source.name(),
        "topic": topic,
        "title": f.title,
        "author": f.author,
        "licence": f.licence,
        "licenceUrl": f.licence_url,
        "page": f.page,
        "thumb": f.thumb,
        "preview": preview,
        "size": if f.width > 0 { format!("{}×{}", f.width, f.height) } else { String::new() },
    })
}

// APODs that are notices rather than pictures to set.
const NOT_PICTURES: &[&str] = &["2026-09-28"];

// Free pictures only: Commons' featured ones under their licences, and NASA's own APODs. Bing's and Wallhaven's
// belong to their owners, and an APOD with a photographer's copyright is theirs; the public demo leaves those out.
fn pictures(client: &Client, source: Source, topic: Option<&str>, most: usize) -> Vec<Value> {
    let q = Query {
        topic: topic.map(str::to_string),
        page: 1,
        ..Query::default()
    };
    let page = client
        .search(source, &q, &Allowed::defaults())
        .unwrap_or_else(|e| panic!("{}: {e}", source.name()));
    page.items
        .iter()
        .filter(|f| !f.licence.contains('©') && f.width >= f.height && !NOT_PICTURES.contains(&f.id.as_str()))
        .take(most)
        .map(|f| picture(f, topic.unwrap_or("space")))
        .collect()
}

fn walls() -> Value {
    let cache = Path::new(env!("CARGO_MANIFEST_DIR")).join("target/online-cache");
    let client = Client::new(cache);
    // A handful is enough to show the pages; every one is fetched from its source by the visitor's browser.
    let apod = pictures(&client, Source::Apod, None, 6);
    let mut nature = pictures(&client, Source::Commons, Some("nature"), 8);
    let mut space = pictures(&client, Source::Commons, Some("space"), 6);
    let mut city = pictures(&client, Source::Commons, Some("city"), 6);
    // "Your" Library: two of each, as if downloaded into ~/Pictures/Wallpapers; online they show as downloaded.
    let mut library = Vec::new();
    for (folder, list) in [("Nature", &mut nature), ("Space", &mut space), ("City", &mut city)] {
        for p in list.iter_mut().take(2) {
            p["downloaded"] = true.into();
            let mut item = p.clone();
            item["folder"] = folder.into();
            library.push(item);
        }
    }
    // Explore mixes every source, one of each in turn, as the app's first page does.
    let mut explore = Vec::new();
    let lists = [&apod, &nature, &space, &city];
    for i in 0..lists.iter().map(|l| l.len()).max().unwrap_or(0) {
        explore.extend(lists.iter().filter_map(|l| l.get(i).cloned()));
    }
    json!({
        "library": library,
        "apod": apod,
        "nature": nature,
        "space": space,
        "city": city,
        "explore": explore,
        "groups": darwan_core::wallpaper::filter::GROUPS.iter().map(|g| g.label).collect::<Vec<_>>(),
        "sources": [
            { "value": "apod", "label": Source::Apod.name() },
            { "value": "commons", "label": Source::Commons.name() },
        ],
    })
}

fn main() {
    let darwan = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../darwan");
    let (catalog, _) = Catalog::load(&darwan.join("themes")).expect("a darwan checkout beside darwan-assets");
    // The demo's gates; everything else as a theme ships.
    let config = UserConfig::parse("[lock]\ntheme = \"pixel-rainyroom\"\n[sddm]\ntheme = \"clockwork/neo-orbital\"\n")
        .unwrap();
    let wall = model::wall(&catalog, &config, "", "all");
    let mut themes = Map::new();
    for t in catalog.themes() {
        let fields = model::fields(t, &config, &BTreeMap::new(), None);
        let d = model::details(t, &config);
        themes.insert(
            t.id.clone(),
            json!({
                "name": d["name"],
                "author": d["author"],
                "background": d["background"],
                "fonts": d["fonts"],
                "form": model::form(&fields),
                "globals": model::globals(&fields),
            }),
        );
    }
    let setup = Setup {
        installed: true,
        running: true,
        service_enabled: true,
        uwsm: true,
        lua: true,
        hyprland: true,
        shells: Vec::new(),
    };
    let conf = hypridle::parse(&idle::apply(None, "enable", "", true).unwrap());
    let mut panel = idle::panel(&setup, Some(&conf), &UserConfig::default());
    panel["path"] = "~/.config/hypr/hypridle.conf".into();
    let mut out = json!({ "wall": wall, "themes": themes, "saver": panel, "walls": walls() });
    site_paths(&mut out);
    let text = serde_json::to_string(&out).unwrap();
    // A public page: nothing from the machine that made it.
    assert!(!text.contains("/home/"), "a local path would reach the site");
    println!("{text}");
}
