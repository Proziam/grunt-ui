# Checkbox and radio group

Native independent or mutually exclusive choices with optional explanations.

`render(name, value, label, type="checkbox", checked=false, disabled=false, description="", note="")`.
`note` adds muted inline context beside the label, such as “(Default)”.
`group(legend, help="", palette="blue")` wraps a slot in a borderless fieldset with a muted section heading; use `palette="violet"` in modal contexts. Radio choices share
a name; separate instances use distinct names. Use actual server-selected values.
`control(name, value, checked=false, disabled=false, type="checkbox", label="")`
renders only the input for custom content. Supply an accessible `label` or wrap it
in a native label containing the choice text.
Dependencies: foundation. JavaScript: none.
