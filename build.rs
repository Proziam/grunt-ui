use std::{env, error::Error, fmt::Write, fs, path::Path};

fn directories(path: &Path) -> Result<Vec<std::path::PathBuf>, Box<dyn Error>> {
    let mut paths = fs::read_dir(path)?
        .map(|entry| entry.map(|entry| entry.path()))
        .collect::<Result<Vec<_>, _>>()?;
    paths.retain(|path| path.is_dir());
    paths.sort();
    Ok(paths)
}

fn main() -> Result<(), Box<dyn Error>> {
    println!("cargo:rerun-if-changed=components");
    println!("cargo:rerun-if-changed=foundation");
    println!("cargo:rerun-if-changed=catalog");
    println!("cargo:rerun-if-changed=askama.toml");
    let root = env::current_dir()?;
    let out = env::var("OUT_DIR")?;
    let mut registry = String::from("pub static COMPONENTS: &[Component] = &[\n");
    let mut examples = String::new();
    let mut dispatch = String::from(
        "pub fn render(id: &str) -> Result<String, askama::Error> { use askama::Template; match id {\n",
    );
    let mut css = fs::read_to_string("foundation/tokens.css")?;
    let mut imports = String::new();
    let mut mounts = String::new();
    let mut count = 0;
    for category in directories(Path::new("components"))? {
        for path in directories(&category)? {
            let id = path
                .strip_prefix("components")?
                .to_string_lossy()
                .replace('\\', "/");
            if !id
                .bytes()
                .all(|b| b.is_ascii_lowercase() || b == b'-' || b == b'/')
            {
                return Err(format!("Invalid component directory: {id}").into());
            }
            let readme = fs::read_to_string(path.join("README.md"))?;
            let name = readme
                .lines()
                .next()
                .ok_or("Missing component name")?
                .trim_start_matches("# ");
            let description = readme
                .lines()
                .nth(2)
                .ok_or("Missing component description")?;
            for file in ["component.html", "component.css", "example.html"] {
                if !path.join(file).is_file() {
                    return Err(format!("Missing {id}/{file}").into());
                }
            }
            let base = root.join(&path);
            let mut dependencies = std::collections::BTreeSet::new();
            for file in ["component.html", "example.html"] {
                for line in fs::read_to_string(path.join(file))?.lines() {
                    if line.trim_start().starts_with("{% import ") {
                        let imported = line.split('"').nth(1).ok_or("Invalid import")?;
                        let dependency = imported
                            .strip_suffix("/component.html")
                            .ok_or("Component imports must name component.html")?;
                        if !root.join("components").join(imported).is_file() {
                            return Err(format!("Missing dependency {imported} in {id}").into());
                        }
                        if dependency != id {
                            dependencies.insert(dependency.to_owned());
                        }
                    }
                }
            }
            let include =
                |file: &str| format!("include_str!({:?})", base.join(file).to_string_lossy());
            let script = if path.join("component.mjs").is_file() {
                writeln!(
                    imports,
                    "import {{ enhance as mount{count} }} from './components/{id}/component.mjs';"
                )?;
                writeln!(mounts, "  mount{count}(root, controller.signal);")?;
                format!("Some({})", include("component.mjs"))
            } else {
                "None".into()
            };
            writeln!(
                registry,
                "Component {{ id: {id:?}, category: {:?}, name: {name:?}, description: {description:?}, template: {}, css: {}, example: {}, readme: {}, script: {script}, dependencies: &{:?} }},",
                id.split('/').next().ok_or("Missing category")?,
                include("component.html"),
                include("component.css"),
                include("example.html"),
                include("README.md"),
                dependencies.into_iter().collect::<Vec<_>>()
            )?;
            writeln!(
                examples,
                "#[derive(askama::Template)]\n#[template(path = {0:?})]\nstruct Example{count};",
                format!("{id}/example.html")
            )?;
            writeln!(dispatch, "{id:?} => Example{count}.render(),")?;
            writeln!(
                css,
                "\n/* {id} */\n{}",
                fs::read_to_string(path.join("component.css"))?
            )?;
            count += 1;
        }
    }
    registry.push_str("];\n");
    dispatch.push_str("_ => Err(askama::Error::Custom(Box::new(std::io::Error::new(std::io::ErrorKind::NotFound, \"Unknown component\")))) } }\n");
    examples.push_str(&dispatch);
    let script = format!(
        "{imports}\nconst mounted = new WeakMap();\nexport function enhance(root = document) {{\n  if (mounted.has(root)) return mounted.get(root);\n  const controller = new AbortController();\n{mounts}  const dispose = () => {{ controller.abort(); mounted.delete(root); }};\n  mounted.set(root, dispose);\n  return dispose;\n}}\n"
    );
    for (file, content) in [
        ("components.rs", registry),
        ("examples.rs", examples),
        ("grunt-ui.css", css),
        ("grunt-ui.mjs", script),
    ] {
        fs::write(Path::new(&out).join(file), content)?;
    }
    Ok(())
}
