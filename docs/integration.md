# Integrating Grunt UI

## 1. Make templates available at compile time

Keep a pinned checkout at `vendor/grunt-ui` (a Git submodule or vendored source
works). The host application's `Cargo.toml`:

```toml
[dependencies]
grunt-ui = { path = "vendor/grunt-ui" }
askama = { version = "0.16.1", default-features = false, features = ["config", "derive", "std"] }
```

Merge this into the host's `askama.toml`:

```toml
[general]
dirs = ["templates", "vendor/grunt-ui/components"]
```

Askama resolves imports at compile time. A Rust dependency alone does **not** add
its templates to the host's search path. Keep the template checkout and embedded
assets on the same revision. For extracted components, add their `components`
directory instead and serve the extracted files directly.

```jinja
{% import "actions/button/component.html" as button %}
{% import "layout/card/component.html" as card %}

{% call card::render(title=heading, description=description) %}
  <p>{{ explanation }}</p>
  {{ button::render(label=submit_label, kind="primary", type="submit") }}
{% endcall %}
```

Macros declare every input in `component.html`. Content comes from call blocks;
the library never looks up undeclared page variables.

### Real list values and caller-owned rows

```rust
#[derive(askama::Template)]
#[template(path = "workflows.html")]
struct Workflows<'a> {
    workflows: &'a [Workflow],
}

struct Workflow {
    name: String,
    href: String,
}
```

```jinja
{% import "collections/list/component.html" as list %}

{% call(workflow) list::render(
  items=workflows,
  label="Workflows",
  empty_text="No workflows yet."
) %}
  <a href="{{ workflow.href }}">{{ workflow.name }}</a>
{% endcall %}
```

Pass `items=your_list`, not `items="your_list"`. Both the list variable and the
local row name are your choice. Tables similarly call your block with `row`;
you supply its cells. Smaller components document their tuple shapes beside the
template. Inputs accept borrowed strings and owned Rust strings.

Translate labels and format numbers/dates in the application. Give each repeated
instance a unique ID; use distinct radio names for distinct groups. Supply valid
ID suffixes for tab keys. Override submitted field names when composing repeated
settings. Choose heading levels through composition: page headers own the h1,
section/card frames use h2, and item cards use h3.

## 2. Serve the assets

The default crate exposes:

- `COMPONENTS`: folder-derived metadata and source, including example dependencies.
- `CSS`, `TOKENS`, `JAVASCRIPT`, `AUTO`: embedded asset contents.
- `asset(path)`: exact lookup returning `(content_type, content)` or `None`.

An Axum host can mount the asset lookup beneath a versioned prefix:

```rust
use axum::{
    extract::Path,
    http::{StatusCode, header},
    response::{IntoResponse, Response},
};

async fn ui_asset(Path(path): Path<String>) -> Response {
    match grunt_ui::asset(&path) {
        Some((kind, body)) => (
            [(header::CONTENT_TYPE, kind),
             (header::X_CONTENT_TYPE_OPTIONS, "nosniff")],
            body,
        ).into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}

// Add to your existing router:
// .route("/ui/v0.1/{*path}", axum::routing::get(ui_asset))
```

```html
<link rel="stylesheet" href="/ui/v0.1/grunt-ui.css">
<script type="module" src="/ui/v0.1/auto.mjs"></script>
```

`grunt-ui.mjs` imports `components/<category>/<name>/component.mjs` relatively;
serve those module URLs too. `asset()` handles them. Use a revision-specific URL
prefix if adding immutable cache headers. `catalog.css`, `catalog.mjs`, and the
sample illustration are demonstration assets, not application styles or behavior.

### Selective use

Run `catalog extract <category/name> <empty-directory>` from the library checkout.
It follows imports transitively, including the example's imports, and creates:

```text
components/          # Requested component and imported examples/primitives
foundation/          # Shared variables
grunt-ui.css         # Only the selected CSS plus variables
grunt-ui.mjs         # Only the selected behavior modules
auto.mjs             # Standalone initialization
example/index.html   # Already-rendered preview
askama.toml
README.md
LICENSE
```

Preview-only catalog assets are also included. Keep the dependency folders when
copying a component. Slot contents may require additional components chosen by
the host; their imports and styles are the host's responsibility.

## 3. Mount behavior in the right lifecycle

Standalone pages use `auto.mjs` once. Retained/dynamic pages import the explicit
entry instead:

```js
import { enhance } from '/ui/v0.1/grunt-ui.mjs';

const dispose = enhance(pageRoot);
// When the root is permanently discarded:
dispose();
```

Calling `enhance` again for the same mounted root returns the same cleanup.
Cleanup removes listeners and pending interaction callbacks; it does not erase
form values or reset local panel state. Re-mount after replacing a root's contents
so newly inserted tabs and canvases initialize. Keep mount roots non-overlapping;
a root may be a component element, a page element, or the document.

For one component, import its `enhance(root, signal)` directly, pass an
`AbortController` signal, and abort it when finished. Direct module initializers
must be called only once per root lifetime.

### Existing Grunt application

- Add the stylesheet to `templates/layouts/app.html` and route library assets in
  `src/site/assets.rs`, alongside the existing versioned bundle.
- Import explicit initialization from the existing shell/page mounting code.
  `static/js/app-runtime.mjs` emits `app:activate` with `detail.root` for a
  retained page and `app:dispose` when it is discarded.
- Keep one cleanup per root. Initialize existing pages once during shell startup;
  call cleanup on disposal. The persistent shell can mount its own non-overlapping
  header/navigation roots. Retaining an inactive page does not require cleanup.
- Keep existing form transport, draft recovery, and authorization handlers. A
  native form can work without a library-specific event bus.

Optional component events:

| Component | Event | Meaning |
| --- | --- | --- |
| Canvas | `gui:node-move`, bubbling, `{id, x, y}` detail | Visit-local presentation coordinates |
| Toast | `gui:dismiss`, bubbling | User hid this toast |
| Repeating list | Native bubbling `input` | A row was added or removed |

Canvas does not model edges or store execution graphs. Place the application's
existing connectors in the scene and keep node coordinates in its view state.
Account/resource pickers use already-authorized options; the host refreshes
dependent options. Charts draw prepared values, with equivalent data tables.

## 4. Theme and application boundaries

Set `data-gui-theme="light"` or `"dark"` on the document or a subtree. Grunt's
existing `data-workspace-theme="dark"` root attribute is also supported. Override
`--gui-*` variables after loading the foundation to customize the palette, fonts,
radii, and shadows. The font stack uses local fonts; no font service is contacted.

Only `gui-` classes are styled. Components do not require the catalog reset.
Native dates, selects, files, details, dialogs, and popovers use current browser
behavior. Tabs retain all content without JavaScript; dialog opening, command
filtering, copying, secret reveal, dynamic rows, and canvas manipulation require
their small modules. Native popovers need a browser with Popover API support.

Customer text stays escaped. Pass approved URLs: HTML escaping alone does not
validate schemes or grant access. Supply real form actions, CSRF tokens, selected
values, revision/request IDs, and confirmed operation states from the application.
The catalog intercepts example submissions locally and never calls Grunt endpoints.
