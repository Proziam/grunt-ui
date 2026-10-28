# Assistant Welcome

A personalized assistant welcome with prompt suggestions and a message composer.

Inputs: unique `id`, `user`, avatar `image`, `(label, icon image, prompt text)` `suggestions`, `greeting`, `title`, `description`, `preview=false`. Slots: none.
Behavior: suggestions fill the composer; attachments stay local; typing reveals Send. `prompt` submission delivers FormData with `prompt` and `attachment`. Voice, account and more-prompts controls emit `voice-input`, `switch-account` and `more-prompts` host actions; shortcuts disclose help.
Dependencies: `modals/modal-template`, `assistant/prompt`, `display/icon`, local orb and prompt icons. Figma source: 02.
