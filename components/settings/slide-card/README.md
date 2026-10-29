# Settings slide card

A right-hand settings panel with a 250ms slide-and-fade transition and outside-click dismissal.

- `render(id, title, trigger_label, description="", cancel_label="Cancel", apply_label="Apply Changes", close_label="Close settings", close_image="")`: use a unique caller-owned `id` per panel. The call block supplies form controls; do not nest forms. Give controls unique IDs. Separate forms isolate radio groups.
- `section(title)` wraps its call block in a fieldset with a full-width legend.
- The trigger opens a native modal dialog. Close, Cancel, Escape, or a click outside the panel reverse the 250ms slide-and-fade, then close the dialog and restore focus. Clicking inside (or dragging from inside to outside) keeps it open. The body scrolls while the header and footer stay visible. Reduced-motion preferences disable the transition.
- Apply emits bubbling, cancelable `gui:settings-submit` with `{ id, data: FormData }` after native validation. The application owns saving, errors, and closing on success (`dialog.requestClose()` for animated dismissal). Dismissal preserves draft control values; reset them in the application if required.
- Styling: `--gui-motion-slide`, shared foundation tokens, and `data-gui-palette="blue"`. The 400px panel shrinks to the viewport with an 8px inset.
- Dependencies: foundation, actions/button, actions/icon-button, display/icon, overlays/dialog (including its behavior), and this module. The example also uses forms/select, forms/choice, and `images/settings/` SVGs.
