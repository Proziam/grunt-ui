# Grunt UI

- HTML-first, Askama, CSS, native browser controls, minimal ES modules. Cargo-only.
- Keep each component in `components/<category>/<name>/`. Put its template,
  styles, example, documentation and optional behavior together.
- `component.html` defines explicit macro inputs. Use call blocks for content.
- Templates must not depend on undeclared page variables or fetch data.
- Prefix classes with `gui-`. Use foundation variables, never global element rules.
- Keep customer text escaped. Only authored, compiled examples may render as HTML.
- Use native links/forms and emit documented events for application operations.
- Every example must compile and render through the catalog's normal build.
- Never fake a saved, authorized, connected, delivered or paid state after a click.
- Repeated instances must have independent state and unique caller-supplied IDs.
- Prefer shared primitives over copied feature markup. Document dependencies.
- Do not introduce a frontend framework, package manager, generated source tree,
  component registry file or a test suite. Discovery follows the folder structure.
- Run `cargo fmt --all -- --check`, Clippy with all features/targets, and the catalog
  export. Browse responsive examples when browser tooling is available.
- Keep README files short and useful: inputs, content slots, behavior, dependencies.
