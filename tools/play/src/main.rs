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
    let setup = Setup { installed: true, running: true, service_enabled: true, uwsm: true, lua: true };
    let conf = hypridle::parse(&idle::apply(None, "enable", "", true).unwrap());
    let mut panel = idle::panel(&setup, Some(&conf), &UserConfig::default());
    panel["path"] = "~/.config/hypr/hypridle.conf".into();
    let mut out = json!({ "wall": wall, "themes": themes, "saver": panel });
    site_paths(&mut out);
    let text = serde_json::to_string(&out).unwrap();
    // A public page: nothing from the machine that made it.
    assert!(!text.contains("/home/"), "a local path would reach the site");
    println!("{text}");
}
