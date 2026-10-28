# Add Team Members

Select existing teammates to invite into a new project.

Inputs: unique `id`, three `portraits` as `(name, initials, image)` tuples, `members` as `(key, name, handle, initials, image, role, checked)` tuples, `title`, `description`, `preview=false`. Slots: none.
Behavior: native checkboxes; `add-members` submission includes repeated `members`. Host performs invitations.
Dependencies: `modals/modal-template`, `modals/team-welcome`, `people/identity`, `forms/choice`. Figma source: 15.
