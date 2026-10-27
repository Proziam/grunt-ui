# Dialog and drawer

A native modal with focus containment, Escape dismissal and an optional side-sheet layout.

Inputs: unique `id`, `title`, `trigger_label`, translated `close_label`, `sheet=false`.
Content slot: any fields, prose or form. `enhance(root, signal)` opens the dialog;
the browser owns modal focus, restoration and closing. Dependencies: foundation.
Opening requires JavaScript. Place an autofocus attribute in the slot when needed.
