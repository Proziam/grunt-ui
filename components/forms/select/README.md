# Select

A native choice field for ownership, roles, providers and other short lists.

Inputs: `id`, `name`, `label`, `options` as `(value, label)` pairs; selected `value`,
`help`, `required`, `disabled`, `multiple`. For preselected multiple values use
the checkbox-group component. Native platform keyboard behavior is preserved.
Optional `optional=true` adds “(Optional)”; required fields show an asterisk.
`image` supplies a decorative leading icon; `info_image` adds a decorative label icon.
Dependencies: display/icon, foundation. JavaScript: none.
