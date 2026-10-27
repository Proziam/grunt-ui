# Resource tree

Nested native disclosures and links for folders, projects and workflow groups.

Macros: `render(label)`; paired `branch_open(label, open=false)` / `branch_close()`;
`leaf(label, href, current=false)`. Pair branch calls at each nesting level;
Askama does not allow recursively nesting the same content macro.
Uses ordinary navigation semantics, avoiding an incomplete ARIA tree widget.
Dependencies: foundation. JavaScript: none.
