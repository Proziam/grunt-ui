use askama::Template;
use axum::{
    Router,
    extract::Path,
    http::{StatusCode, header},
    response::IntoResponse,
    routing::get,
};
use grunt_ui::{COMPONENTS, Component};
use std::{error::Error, fs, path::Path as FilePath};

#[derive(Template)]
#[template(path = "index.html")]
struct Index {
    components: &'static [Component],
    scripted: usize,
    categories: Vec<&'static str>,
}

#[derive(Template)]
#[template(path = "detail.html")]
struct Detail<'a> {
    component: &'a Component,
    preview: &'a str,
}

fn index() -> Result<String, askama::Error> {
    Index {
        components: COMPONENTS,
        scripted: COMPONENTS.iter().filter(|c| c.script.is_some()).count(),
        categories: COMPONENTS
            .iter()
            .map(|c| c.category)
            .collect::<std::collections::BTreeSet<_>>()
            .into_iter()
            .collect(),
    }
    .render()
}

fn detail(component: &Component) -> Result<String, askama::Error> {
    let preview = grunt_ui::examples::render(component.id)?;
    Detail {
        component,
        preview: &preview,
    }
    .render()
}

fn catalog_asset(path: &str) -> Option<(&'static str, &'static str)> {
    match path {
        "catalog.css" => Some((
            "text/css; charset=utf-8",
            include_str!("../../catalog/catalog.css"),
        )),
        "catalog.mjs" => Some((
            "text/javascript; charset=utf-8",
            include_str!("../../catalog/catalog.mjs"),
        )),
        "demo-image.svg" => Some((
            "image/svg+xml",
            include_str!("../../catalog/demo-image.svg"),
        )),
        _ => grunt_ui::asset(path),
    }
}

async fn serve(Path(path): Path<String>) -> impl IntoResponse {
    if let Some((content_type, content)) = grunt_ui::binary_asset(&path) {
        return (
            [
                (header::CONTENT_TYPE, content_type),
                (header::X_CONTENT_TYPE_OPTIONS, "nosniff"),
            ],
            content,
        )
            .into_response();
    }
    let response = if path == "index.html" {
        index().map(|body| ("text/html; charset=utf-8", body))
    } else if let Some((content_type, content)) = catalog_asset(&path) {
        Ok((content_type, content.to_owned()))
    } else if let Some(component) = path
        .strip_suffix(".html")
        .and_then(|id| COMPONENTS.iter().find(|c| c.id == id))
    {
        detail(component).map(|body| ("text/html; charset=utf-8", body))
    } else {
        return (StatusCode::NOT_FOUND, "Not found").into_response();
    };
    match response {
        Ok((kind, body)) => (
            [
                (header::CONTENT_TYPE, kind),
                (header::X_CONTENT_TYPE_OPTIONS, "nosniff"),
            ],
            body,
        )
            .into_response(),
        Err(error) => (StatusCode::INTERNAL_SERVER_ERROR, error.to_string()).into_response(),
    }
}

fn write(root: &FilePath, name: &str, content: impl AsRef<[u8]>) -> Result<(), Box<dyn Error>> {
    let path = root.join(name);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(path, content)?;
    Ok(())
}

fn export(root: &FilePath) -> Result<(), Box<dyn Error>> {
    write(root, "index.html", &index()?)?;
    write(
        root,
        "foundation/fonts/InterVariable.woff2",
        grunt_ui::INTER,
    )?;
    write(root, "foundation/fonts/OFL.txt", grunt_ui::INTER_LICENSE)?;
    for (name, content) in grunt_ui::IMAGES {
        write(root, name, content)?;
    }
    for (name, content) in grunt_ui::RASTERS {
        write(root, name, content)?;
    }
    for asset in [
        "grunt-ui.css",
        "grunt-ui.mjs",
        "auto.mjs",
        "catalog.css",
        "catalog.mjs",
        "demo-image.svg",
        "foundation/tokens.css",
    ] {
        let (_, content) = catalog_asset(asset).ok_or("Missing asset")?;
        write(root, asset, content)?;
    }
    for component in COMPONENTS {
        write(root, &format!("{}.html", component.id), &detail(component)?)?;
        write(
            root,
            &format!("components/{}/component.css", component.id),
            component.css,
        )?;
        if let Some(script) = component.script {
            write(
                root,
                &format!("components/{}/component.mjs", component.id),
                script,
            )?;
        }
    }
    println!(
        "Rendered {} components to {}",
        COMPONENTS.len(),
        root.display()
    );
    Ok(())
}

fn extract(id: &str, root: &FilePath) -> Result<(), Box<dyn Error>> {
    if root.exists() && fs::read_dir(root)?.next().is_some() {
        return Err(
            "Choose a new or empty destination; existing files will not be overwritten.".into(),
        );
    }
    let mut pending = vec![id];
    let mut selected = std::collections::BTreeMap::new();
    while let Some(id) = pending.pop() {
        if selected.contains_key(id) {
            continue;
        }
        let component = COMPONENTS
            .iter()
            .find(|c| c.id == id)
            .ok_or_else(|| format!("Unknown component: {id}"))?;
        selected.insert(component.id, component);
        pending.extend(component.dependencies.iter().copied());
    }
    let mut css = grunt_ui::TOKENS.to_owned();
    let mut imports = String::new();
    let mut mounts = String::new();
    use std::fmt::Write as _;
    for (index, component) in selected.values().enumerate() {
        for (file, content) in [
            ("component.html", component.template),
            ("component.css", component.css),
            ("example.html", component.example),
            ("README.md", component.readme),
        ] {
            write(
                root,
                &format!("components/{}/{file}", component.id),
                content,
            )?;
        }
        writeln!(css, "\n/* {} */\n{}", component.id, component.css)?;
        if let Some(script) = component.script {
            write(
                root,
                &format!("components/{}/component.mjs", component.id),
                script,
            )?;
            writeln!(
                imports,
                "import {{ enhance as mount{index} }} from './components/{}/component.mjs';",
                component.id
            )?;
            writeln!(mounts, "  mount{index}(root, controller.signal);")?;
        }
    }
    write(root, "foundation/tokens.css", grunt_ui::TOKENS)?;
    write(
        root,
        "foundation/fonts/InterVariable.woff2",
        grunt_ui::INTER,
    )?;
    write(root, "foundation/fonts/OFL.txt", grunt_ui::INTER_LICENSE)?;
    write(root, "grunt-ui.css", &css)?;
    write(
        root,
        "grunt-ui.mjs",
        format!(
            "{imports}\nconst mounted = new WeakMap();\nexport function enhance(root = document) {{\n  if (mounted.has(root)) return mounted.get(root);\n  const controller = new AbortController();\n{mounts}  const dispose = () => {{ controller.abort(); mounted.delete(root); }};\n  mounted.set(root, dispose);\n  return dispose;\n}}\n"
        ),
    )?;
    write(root, "auto.mjs", grunt_ui::AUTO)?;
    write(root, "askama.toml", "[general]\ndirs = [\"components\"]\n")?;
    write(root, "LICENSE", include_str!("../../LICENSE"))?;
    for asset in ["catalog.css", "catalog.mjs", "demo-image.svg"] {
        let (_, content) = catalog_asset(asset).ok_or("Missing preview asset")?;
        write(root, asset, content)?;
    }
    let preview = grunt_ui::examples::render(id)?;
    for (name, content) in grunt_ui::IMAGES {
        if selected.values().any(|component| {
            component.example.contains(name)
                || component.template.contains(name)
                || component.css.contains(name)
        }) || preview.contains(name)
        {
            write(root, name, content)?;
        }
    }
    for (name, content) in grunt_ui::RASTERS {
        if preview.contains(name)
            || selected.values().any(|component| {
                component.example.contains(name) || component.template.contains(name)
            })
        {
            write(root, name, content)?;
        }
    }
    write(
        root,
        "example/index.html",
        format!(
            r#"<!doctype html>
<html lang="en" data-gui-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{id} · Grunt UI example</title>
  <link rel="stylesheet" href="../grunt-ui.css">
  <link rel="stylesheet" href="../catalog.css">
</head>
<body>
  <header class="catalog-header"><h1>{id}</h1><button type="button" data-theme-toggle aria-pressed="false">Dark theme</button></header>
  <main class="catalog-main catalog-detail">
    <p>Illustrative data · submissions stay in this preview.</p>
    <section class="catalog-preview">{preview}</section>
    <p data-demo-feedback role="status"></p>
  </main>
  <script type="module" src="../auto.mjs"></script>
  <script type="module" src="../catalog.mjs"></script>
</body>
</html>
"#
        ),
    )?;
    let folders = selected
        .keys()
        .map(|id| format!("- `components/{id}/`\n"))
        .collect::<String>();
    write(
        root,
        "README.md",
        format!(
            "# {id}\n\nExtracted from [Grunt UI](https://github.com/Proziam/grunt-ui), MIT licensed.\n\nServe this directory over HTTP and open `example/index.html` for the live example.\nImport templates from `components/`; load `grunt-ui.css` and, for standalone pages,\n`auto.mjs`. The catalog CSS/JS and demo image are preview-only assets.\n\nIncluded component and example dependencies:\n\n{folders}\nSee each folder's README for inputs, slots and behavior.\n[Integration guide](https://github.com/Proziam/grunt-ui/blob/main/docs/integration.md).\n"
        ),
    )?;
    println!(
        "Extracted {id} and its example dependencies: {} folders in {}",
        selected.len(),
        root.display()
    );
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let mut args = std::env::args().skip(1);
    match args.next().as_deref() {
        Some("build") => export(FilePath::new(&args.next().unwrap_or_else(|| "dist".into()))),
        Some("extract") => {
            let id = args.next().ok_or("Supply a component ID, for example integrations/connection-card")?;
            let destination = args.next().ok_or("Supply a new or empty destination directory")?;
            extract(&id, FilePath::new(&destination))
        }
        None | Some("serve") => {
            // Render every example before opening the server, including off-screen examples.
            for component in COMPONENTS { grunt_ui::examples::render(component.id)?; }
            let address = args.next().unwrap_or_else(|| "127.0.0.1:4100".into());
            let listener = tokio::net::TcpListener::bind(&address).await?;
            println!("Grunt UI: http://{address} ({} components)", COMPONENTS.len());
            let app = Router::new()
                .route("/", get(|| async { axum::response::Redirect::temporary("./index.html") }))
                .route("/{*path}", get(serve));
            axum::serve(listener, app).await?;
            Ok(())
        }
        Some(_) => Err("Usage: cargo run --features catalog --bin catalog -- [serve [address] | build [directory] | extract component destination]".into()),
    }
}
