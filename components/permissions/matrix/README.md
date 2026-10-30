# Workflow permission matrix

Independent Create, Edit and Run controls, including inherited read-only grants.

Inputs: `label`, rows `(key,scope,create,edit,run,readonly)`, translated column labels.
The host interprets omitted unchecked/disabled fields and enforces current grants.
Blue table styling with 64px rows; all permission columns remain visible at 320px.
Rendered controls are not authority. Dependencies: collections/table, forms/choice,
foundation and `images/permissions/check.svg`. JavaScript: none.
