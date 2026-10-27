# Application shell

A responsive header, navigation and main-content frame with three named content regions.

`render(title, home_href, navigation, main_label)` calls your slot with
`"header"`, `"navigation"`, `"content"`. Use as the page shell, not nested inside
another main element. Existing Grunt navigation/session behavior remains host-owned.
Dependencies: foundation and supplied regions. JavaScript: none.
