# Tabs

Locally switched panels with arrow-key navigation and a readable no-script fallback.

Inputs: unique `id`, `label`, `(key, label)` `items`, `selected` key.
`call(key)` provides panel content. Keys must be safe, unique HTML ID suffixes.
Without JS all panels are readable and links jump to them. `enhance(root, signal)`
adds tab semantics and hides inactive panels. Dependencies: foundation.
