# File and attachment item

A file identity with size, access state and an optional authorized download action.

Inputs: `name`, `size`, `kind`, `status`, `href`, `action_label`, `tone`.
Omit href when content is unavailable; the server authorizes every download.
Dependencies: display/badge and foundation. JavaScript: none.
