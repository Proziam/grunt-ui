# Verify Email

Enter a four-digit email verification code or request another code.

Inputs: unique `id`, `email`, `title`, `preview=false`. Slots: none.
Behavior: `verify` submission; join repeated `code` values. `resend` action requests delivery. Host verifies and sends; the component never claims either succeeded.
Dependencies: `modals/modal-template`, `display/feature-icon`, `forms/verification-code`. Figma source: 16.
