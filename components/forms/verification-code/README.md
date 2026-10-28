# Verification Code

Numeric code entry with large individual digits, paste support and autofill hints.

Inputs: unique `id`, `name`, `label`, `digits=4` (4 or 6), `label_visible=true`, `required=true`.
Slots: none. Behavior: digits advance focus; Backspace and arrows move; paste fills remaining digits. Read the code with `FormData.getAll(name).join('')`. Verification belongs to the host.
Dependencies: foundation; optional behavior module.
