# Share Post to Accounts

Choose which connected social accounts should receive a published post.

Inputs: unique `id`, `accounts` as `(value, label, account, checked)` tuples, `title`, `description`, `preview=false`. Slots: none.
Behavior: native switches; `share` submission includes repeated `accounts` values. Connection state is caller supplied.
Dependencies: `modals/modal-template`, `modals/post-published`, `forms/switch`. Figma source: 06.
