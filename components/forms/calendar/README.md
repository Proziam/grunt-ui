# Calendar

A date-range calendar with month navigation, native date fields and quick ranges.

Inputs: unique `id`, ISO `start` and `end`, `month` as YYYY-MM, optional ISO `today` (otherwise local current date).
Slots: none. Behavior: first day starts a range, second completes it; arrows move focus. Quick ranges end today. Emits native change; submitted fields are `start` and `end`. Native fields work without JavaScript.
Dependencies: `display/icon`, foundation and local navigation icons; behavior module for the calendar grid.
