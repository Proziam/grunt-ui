# Repeating text list

Addable and removable native fields for domains, tags, addresses and simple list settings.

Inputs: `label`, repeated form `name`, iterable text `values`, translated add/remove/item labels.
Read values with your normal repeated-field parser. Existing fields work without JS.
`enhance(root, signal)` preserves focus and emits native input events after edits.
Dependencies: foundation.
