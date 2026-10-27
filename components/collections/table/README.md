# Data table

A scrollable semantic table with typed caller-owned rows and an empty state.

Inputs: `caption`, list of `columns`, iterable `rows`, `empty_text`.
`call(row)` supplies actual `th`/`td` cells; keep cell counts aligned with columns.
Use native links in headings for server sorting. `.gui-table__numeric` aligns numbers.
Dependencies: foundation and row content. JavaScript: none.
