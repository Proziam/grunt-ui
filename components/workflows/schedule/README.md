# Local schedule and sending hours

A named-zone clock, native weekday choices and an application-calculated next-run preview.

Inputs: `id`, `title`, `(value,label)` `zones`, selected `zone`, ISO `time`,
`days` as `(value,label,checked)`, `preview`; translated field labels.
Override `time_name`, `zone_name`, `days_name` for multiple schedules in one form.
This component is explicitly local-time. A fixed-offset clock uses separate task
declarations. The host computes DST and next occurrences. Dependencies: input, select, choice.
