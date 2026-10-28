# Copyable value

A selectable read-only value with clipboard feedback and manual-copy fallback.

Inputs: `value`, `label`; translated `copy_label`, `success_text`, `error_text`.
Variants: `icon_only`, `inset`, `label_visible`, optional `icon_image`; `button(value, label)` renders a standalone copy action with status feedback.
Behavior: `enhance(root, signal)`; secure-context Clipboard API. The value remains
selectable without JavaScript in the field variant. Dependencies: `display/icon`, `actions/button`, foundation and optional copy image.
