# Copyable value

A selectable read-only value with clipboard feedback and manual-copy fallback.

Inputs: `value`, `label`; translated `copy_label`, `success_text`, `error_text`.
Behavior: `enhance(root, signal)`; secure-context Clipboard API. The value remains
selectable without JavaScript. Dependencies: foundation only.
