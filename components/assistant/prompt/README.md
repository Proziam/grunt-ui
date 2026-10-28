# Assistant prompt composer

A plain-text assistance request with a pending state and optional suggested-action slot.

Inputs: `id`, `action`, `form_token`, `label`, `value`, `submit_label`, `notice`, `busy`.
Host owns conversation state and proposed edits. Dependencies: textarea, button, foundation.
`composer(id, user, initials, image="", placeholder)` is a form-free variant with message input, file picker and shortcut disclosure. Typing reveals Send; Ctrl/⌘+Enter submits its enclosing form with `prompt` and `attachment` fields. Inside `modals/modal-template` with its behavior mounted, voice/account controls emit `gui:modal-action` with `voice-input` / `switch-account`, and Send emits `gui:modal-submit` with action `prompt`. Dependencies also include `display/avatar`, `display/icon` and the optional behavior module.
