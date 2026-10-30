# Badge and status

Compact, text-labelled statuses and categories with optional dots.

Inputs: `label`, `tone=neutral/success/warning/danger/info/accent`, `dot=false`.
Status must come from application data; color never replaces the text label.
`appearance="outline"` is the default: 12px text on a neutral surface. `appearance="soft"` opts into a tinted fill; optional `image` supplies a local status icon.
Dependencies: display/icon, foundation. JavaScript: none.
