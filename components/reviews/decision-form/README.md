# Review decision form

Version-bound approval and change-request submission with optional feedback.

Inputs: unique `id`, scoped `action`, `form_token`, `review_id`, exact `version`,
`notice`, translated control labels, `disabled`. Host validates request identity,
current reviewer authority and version before accepting a decision.
Dependencies: forms/textarea, actions/button, foundation. JavaScript: none.
