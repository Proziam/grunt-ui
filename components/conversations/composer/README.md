# Reply composer

A plain-text reply form tied to an exact message, with an optional attachment/settings slot.

Inputs: `id`, `action`, `form_token`, opaque `reply_to`, `label`, `value`, `submit_label`,
`notice`, `disabled`. Slot: purpose, budgets, attachments and original request IDs.
The host owns draft recovery and delivery receipts. Dependencies: textarea, button, foundation.
