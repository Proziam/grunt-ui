# Verification code

A native one-time-code form with single-field or segmented numeric entry.

Inputs: `id`, `action`, `form_token`, `title`, `description`, `label`, `submit_label`, `length=6`.
Optional `segmented=false`; when true, join repeated `code` values on the server.
Optional recovery slot. Challenge identity and attempt limits are host responsibilities.
Dependencies: `actions/button`, `forms/verification-code`, foundation. Segmented mode has optional focus/paste enhancement.
