# Button

Primary, secondary, quiet and destructive actions with native disabled and busy states.

Inputs: `label`; `kind` = secondary/primary/quiet/danger/destructive; `size` = normal/compact/large;
`type` = button/submit/reset; `disabled`, `busy`; optional submitted `name`, `value`.
Use translated text for labels. Busy buttons keep a readable label.
Optional `leading_icon` or `icon_image` adds a leading mark; `action` emits the enclosing modal's action event. `destructive` is solid; `danger` is soft. Wrap in `data-gui-palette="violet"` for the Figma modal palette.
Hover darkens the theme's resting fill by 8%; pressing returns to the resting
color. Disabled buttons do not react. Quiet buttons use the surface hover fill.
`dialog="id"` opens a native dialog; `dismiss=true` closes the enclosing dialog.
These two options require `overlays/dialog/component.mjs`. Dependencies: `display/icon`,
foundation. Otherwise JavaScript: none. Forms own submission behavior.
