# Share Post to Channels

Select social channels for a published blog post.

Inputs: unique `id`, `channels` as `(value, label, checked)` tuples, `title`, `description`, `preview=false`. Slots: none.
Behavior: native checkboxes; `share` submission includes repeated `channels` values. Host performs sharing.
Dependencies: `modals/modal-template`, `modals/post-published`, `forms/choice`. Figma source: 05.
