# Command palette

A locally searchable navigation dialog with native link focus and Escape dismissal.

Inputs: `id`, `title`, `trigger_label`, `(label,description,href)` `commands`,
`search_label`, `empty_label`. Uses only the loaded, authorized command list.
Dependencies: overlays/dialog, foundation. JS: dialog opening and local filtering.
The host may bind its existing shortcut to the trigger; no global shortcut is registered here.
