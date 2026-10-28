//! HTML-first components. Templates and examples live beside their CSS.
//! See the repository's integration guide for Askama imports and asset serving.

pub struct Component {
    pub id: &'static str,
    pub category: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub template: &'static str,
    pub css: &'static str,
    pub example: &'static str,
    pub readme: &'static str,
    pub script: Option<&'static str>,
    /// Includes imports used by the example so an extracted folder stays runnable.
    pub dependencies: &'static [&'static str],
}

include!(concat!(env!("OUT_DIR"), "/components.rs"));

pub const CSS: &str = include_str!(concat!(env!("OUT_DIR"), "/grunt-ui.css"));
pub const JAVASCRIPT: &str = include_str!(concat!(env!("OUT_DIR"), "/grunt-ui.mjs"));
pub const TOKENS: &str = include_str!("../foundation/tokens.css");
pub const AUTO: &str = "import { enhance } from './grunt-ui.mjs';\nenhance();\n";
pub const INTER: &[u8] = include_bytes!("../foundation/fonts/InterVariable.woff2");
pub const INTER_LICENSE: &str = include_str!("../foundation/fonts/OFL.txt");

/// Raster images are kept as bytes so photo assets survive serving and extraction.
pub fn binary_asset(path: &str) -> Option<(&'static str, &'static [u8])> {
    if path == "foundation/fonts/InterVariable.woff2" {
        return Some(("font/woff2", INTER));
    }
    RASTERS
        .iter()
        .find(|(name, _)| *name == path)
        .map(|(_, bytes)| ("image/png", *bytes))
}

/// Exact, relative asset lookup. Mount beneath a versioned prefix in the host app.
pub fn asset(path: &str) -> Option<(&'static str, &'static str)> {
    if let Some((_, content)) = IMAGES.iter().find(|(name, _)| *name == path) {
        return Some(("image/svg+xml", content));
    }
    match path {
        "foundation/fonts/OFL.txt" => Some(("text/plain; charset=utf-8", INTER_LICENSE)),
        "grunt-ui.css" => Some(("text/css; charset=utf-8", CSS)),
        "grunt-ui.mjs" => Some(("text/javascript; charset=utf-8", JAVASCRIPT)),
        "auto.mjs" => Some(("text/javascript; charset=utf-8", AUTO)),
        "foundation/tokens.css" => Some(("text/css; charset=utf-8", TOKENS)),
        _ => {
            let (id, file) = path.strip_prefix("components/")?.rsplit_once('/')?;
            let component = COMPONENTS.iter().find(|component| component.id == id)?;
            match file {
                "component.css" => Some(("text/css; charset=utf-8", component.css)),
                "component.mjs" => Some(("text/javascript; charset=utf-8", component.script?)),
                _ => None,
            }
        }
    }
}

#[cfg(feature = "catalog")]
pub mod examples {
    include!(concat!(env!("OUT_DIR"), "/examples.rs"));
}
