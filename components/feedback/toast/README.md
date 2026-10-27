# Toast

A polite, explicitly dismissible confirmation without an inaccessible automatic timeout.

Inputs: `message`, translated `close_label`, `tone=neutral/success/danger`.
Host inserts confirmed messages and positions the toast region. `enhance(root, signal)`
handles dismissal and emits `gui:dismiss`. Dependencies: foundation.
