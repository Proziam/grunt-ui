# Search and filter bar

A native GET form with search, optional filters and an explicit submit action.

Inputs: scoped `action`, `label`, `query`, field `name="q"`, translated `search_label`,
`submit_label`, `placeholder` (defaults to `search_label`). Slot: selects or hidden organization/cursor fields.
The visible search label needs no ID; supplied filters need unique IDs. Search wraps above filters at narrow widths.
Blue palette. Dependencies: actions/button, display/icon, foundation, supplied controls and modal search/chevron assets. JavaScript: none.
