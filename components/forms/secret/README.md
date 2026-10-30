# Secret input

A masked credential field with an explicit, accessible reveal control.

Inputs: unique `id`, `name`, `label`, translated `show_label`, `hide_label`, `placeholder`, `disabled=false`.
Intentionally accepts no saved credential value. Browser autocomplete is marked
as a new secret. `enhance(root, signal)` toggles visibility locally.
Violet focus, integrated eye action, and native disabled state. Dependencies: forms/input,
display/icon, foundation, `images/secret/`. JavaScript: reveal only; masked entry works without it.
