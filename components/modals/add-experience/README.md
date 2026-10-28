# Add Experience

Add employment details to a profile or save a draft for later.

Inputs: unique `id`, `title`, `description`, `preview=false`. Slots: none.
Behavior: `add-experience` submission or `save-draft` action with FormData. Fields: `title`, `company`, `website` (host name after HTTPS prefix), `location`, `employment`, `position`, `description`. Host persists data; search-styled fields accept text. Ctrl/⌘+K focuses location within this dialog.
Dependencies: `modals/modal-template`, `forms/input`, `forms/select`, `forms/textarea`, local flag/search/save icons. Figma source: 21.
