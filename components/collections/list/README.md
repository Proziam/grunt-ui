# List

A data-driven list with caller-defined rows and an empty state.

Inputs: `items` (any iterable), `empty_text`, `label=""`, `divided=true`.
Use `{% call(item) list::render(items=my_list, empty_text="…") %}` to receive each
item. Both the list variable and the local item name are your choice.
Dependencies: foundation and supplied row content. JavaScript: none.
