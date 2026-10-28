# Grunt UI

HTML-first components for Grunt: readable Askama templates, scoped CSS, native
browser controls, and small optional ES modules. Light and dark themes included.

**147 components · 17 behavior modules · Cargo-only build**

## Browse the library

Run `bacon` to serve the catalog and rebuild on edits. Restarting or quitting
Bacon stops the catalog and its child processes before continuing.
On Windows, run it from Git Bash (included with Git for Windows).

To serve without automatic rebuilds:

```sh
cargo run --locked --features catalog --bin catalog -- serve
```

Open **http://127.0.0.1:4100**. Search by name or category, try the live examples,
switch themes, and read each component's exact source and inputs alongside it.
Drag a live example's right edge to preview widths from 320px to the available
desktop canvas width. Focus the handle to use arrow keys (Shift for larger steps),
Home for phone width, or End to restore full width. On smaller windows, it fits
the available space. Preview media queries respond to the selected width.

Prefer browsing files? Start with the [component directory](components/README.md).
The visual direction takes inspiration from AlignUI's website: quiet surfaces,
fine borders, deliberate typography, and restrained orange accents.

## One folder per component

```text
components/integrations/connection-card/
├── component.html    # Named inputs and content slots
├── component.css     # gui-prefixed styles
├── example.html      # Compiled, runnable usage
└── README.md         # Inputs, behavior, dependencies
```

Interactive components also contain `component.mjs`. Shared theme values live in
[`foundation/tokens.css`](foundation/tokens.css). Folder discovery is automatic;
every example compiles and renders in the normal catalog build.

## Take just what you need

```sh
cargo run --locked --features catalog --bin catalog -- \
  extract integrations/connection-card ./extracted-component
```

Extraction includes imported components, example dependencies, selective asset
bundles, the license, and a runnable `example/index.html`. Serve the extracted
directory over HTTP to try it. Existing nonempty destinations are rejected.

For the full library, use a pinned checkout and the Rust asset API. The default
crate has no dependencies; only the optional catalog adds Askama, Axum, and Tokio.
See the **[integration guide](docs/integration.md)** for template paths, real list
inputs, asset routes, and Grunt's retained-page lifecycle.

## Build and contribute

```sh
cargo fmt --all -- --check
cargo clippy --locked --all-features --all-targets -- -D warnings
cargo run --locked --features catalog --bin catalog -- build
```

`dist/` is a static catalog suitable for any static host. Serve it over HTTP;
ES modules need an HTTP origin. Custom destinations and server addresses are
accepted: `build ./site` and `serve 127.0.0.1:4200`.

Add a component folder with the four files above. Keep imports one per line and
README opening lines as a heading, blank line, and one-sentence description.
Use explicit inputs, scoped classes, and existing primitives. Verify the example
at phone and desktop widths, with keyboard input and both themes.

Components handle presentation and local interaction. Application data, access,
storage, and operation outcomes remain in Grunt. Catalog data is illustrative.

[MIT license](LICENSE).
