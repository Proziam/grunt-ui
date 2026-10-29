# Icon button

A consistently sized, labelled action with optional pressed and disabled states.

Inputs: icon `name`, accessible `label`, `type`, `disabled`, `pressed`, `toggle`.
Optional `image` supplies a local icon; `action` participates in the enclosing modal's action event.
The host owns toggle state changes. Dependencies: display/icon and foundation.
`dismiss=true` closes the enclosing dialog through `overlays/dialog/component.mjs`.
Otherwise JavaScript: none.
