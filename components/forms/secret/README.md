# Secret input

A masked credential field with an explicit, accessible reveal control.

Inputs: `id`, `name`, `label`, translated `show_label`, `hide_label`.
Intentionally accepts no saved credential value. Browser autocomplete is marked
as a new secret. `enhance(root, signal)` toggles visibility locally.
Dependencies: foundation. JavaScript: reveal only; masked entry works without it.
