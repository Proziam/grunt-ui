# Stepper

Explicit completed, current and upcoming stages for onboarding and setup.

Inputs: `label`, list of translated `steps`, one-based `current` step number.
This display does not navigate or infer completion. Dependencies: foundation. JavaScript: none.
`dots(label, count, current=1)` renders keyboard-focusable step buttons with zero-based `data-step-index`; the parent owns navigation (as in `modals/dashboard-tour`).
