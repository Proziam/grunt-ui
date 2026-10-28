# Delete Post

A destructive confirmation for removing a blog post.

Inputs: unique `id`, `title`, `description`, `preview=false`. Slots: none.
Behavior: `gui:modal-submit` with `delete`; cancellation dismisses. Host performs deletion.
Dependencies: `modals/modal-template`, local trash icon. Figma source: 04.
