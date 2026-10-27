# Tooltip

A focusable explanation for a short, nonessential piece of context.

Inputs: unique `id`, visible `label`, plain-text `description`.
Use a popover or disclosure for essential instructions or interactive content.
Dependencies: foundation. The small `enhance(root, signal)` module adds Escape
dismissal; appearance and focus/hover behavior are CSS-owned.
