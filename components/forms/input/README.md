# Input

Labelled text, email, URL, search, telephone, date, time and date-time fields.

Required: unique `id`, submitted `name`, translated `label`.
Optional: `value`, `type`, `placeholder`, `help`, `error`, `required`, `disabled`,
`readonly`, `autocomplete`, `leading_icon` or `icon_image`, `prefix`, keyboard-hint `suffix`, `required_indicator=true`. The host implements any hinted shortcut. Use the dedicated number field for numeric bounds.
Slot: a trailing control inside the input surface; give it an accessible name and explicit button type.
Dependencies: `display/icon`, foundation. JavaScript: none; native validation supplements server validation.
