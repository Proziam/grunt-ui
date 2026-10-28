# Dashboard Tour

A caller-sized dashboard tour with a chart illustration and live pagination.

Inputs: unique `id`, nonempty `(title, description)` `slides`, `preview=false`. Slots: none.
Behavior: Next and dots navigate local slides; Skip dismisses; Finish emits `gui:modal-submit` with action `finish-tour`. Slide content is caller supplied.
Dependencies: `modals/modal-template`, `display/dashboard-preview`, `navigation/stepper`, `actions/button`. Figma source: 19 (first slide).
