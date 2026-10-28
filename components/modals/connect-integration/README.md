# Connect Integration

Review requested permissions before connecting Untitled to Linear.

Inputs: unique `id`, `permissions`, `integration_url`, `documentation_url`, `title`, `description`, `preview=false`. Slots: none.
Behavior: real clipboard copy, native documentation link, `connect` submission. The host performs authorization; the component never claims a connection.
Dependencies: `modals/modal-template`, `display/icon`, `integrations/logo-tile`, `actions/copy-value`, `actions/button`, local brand assets. Figma source: 22.
