# Task and settings panel

A complete form frame for task-declared fields, organization settings and provider setup.

Inputs: `title`, `description`, scoped `action`, session-bound `form_token`,
`submit_label`, `readonly`. Slot: declared fields and required revision/request IDs.
The host owns validation, permissions, receipts and draft retention. No fetching.
Dependencies: actions/button, foundation and supplied fields. Blue settings frame with a native POST form. JavaScript: none.
