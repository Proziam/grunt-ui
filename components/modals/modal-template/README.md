# Modal Template

A reusable dialog with a feature icon, clear heading, content slot and paired actions.

`render`: unique `id`, `title`; optional `description`, feature-icon `image`, `cancel="Cancel"`, `confirm="Confirm"`, `kind="primary"`, `confirm_action="confirm"`, `close_label="Close"`, `preview=false`.
Slot: form fields or supporting content. The header and action footer are included; do not nest forms. The example shows project-name editing and emits `save-project` with the `name` field.
`surface`: `id`, `title`, `preview=false`, `size`, `close=true`, `close_label`, `divided=false`.
Use `surface` for custom compositions; its slot contains the whole dialog form. Helpers: `heading` and `actions`.
`heading(id, title, description="", image="", centered=false)` supplies the labelled heading.
`actions(cancel="Cancel", confirm="Confirm", kind="primary", align="stretch", cancel_icon="", cancel_action="cancel", confirm_action="confirm")` supplies the footer; `align` also accepts `end` or `between`.
The template renders no opening button. Production: use `preview=false` and a caller-owned `data-gui-open="id"` trigger for native modal focus/Escape behavior. The catalog uses `preview=true` to show the dialog immediately without a backdrop; closing reveals Reopen.
Events: bubbling, cancelable `gui:modal-submit` and `gui:modal-action`, with `{id, action, data: FormData}`; actions also include `value`. An unprevented `cancel` action dismisses automatically. Submissions and other actions remain host-controlled; the host performs operations and closes on success. No success state is simulated.
Dependencies: `overlays/dialog`, `actions/button`, `display/icon`, `display/feature-icon`, foundation and local close icon. The example also uses `forms/input` and the local save icon.
