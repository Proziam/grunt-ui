# Alert and banner

Persistent information, warnings and recovery messages with optional actions.

Inputs: `title`, `description`, `tone=info/success/warning/danger`, `urgent=false`, `palette="blue"` (or `"violet"`).
Use `urgent` only for an immediately relevant error; avoid repeated announcements.
Content slot: recovery actions. Severity uses a labelled message and line icon on a neutral surface.
Dependencies: display/icon and foundation. JavaScript: none.
