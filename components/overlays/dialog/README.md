# Dialog and drawer

A native modal with focus containment, Escape dismissal and an optional side-sheet layout.

Inputs: unique `id`, `title`, `trigger_label`, translated `close_label`, `sheet=false`.
Content slot: any fields, prose or form. `enhance(root, signal)` opens the dialog;
the browser owns modal focus, restoration and closing. Dependencies: foundation.
Opening requires JavaScript. Place an autofocus attribute in the slot when needed.
The module also supports caller-owned dialogs: `[data-gui-open="id"]` opens one,
`[data-gui-close]` dismisses its enclosing dialog, and `data-gui-light-dismiss` on
a dialog enables outside-click dismissal. A drag starting inside does not dismiss.
Dismissal requests emit the native cancelable `cancel` event so animated panels can finish their exit before closing.
Trigger `aria-expanded` follows native open/close events.
