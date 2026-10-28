# Project Access

Review existing project members and select another person to invite.

Inputs: unique `id`, `people` as `(key, name, email, initials, image)` tuples, `(value, label)` `members`, `title`, `description`, `preview=false`. Slots: none.
Behavior: `remove-person` action includes the person's key; `update-access` submission includes `member`. Host confirms changes before updating the list.
Dependencies: `modals/modal-template`, `people/identity`, `forms/person-select`. Figma source: 13.
