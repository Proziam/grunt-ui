# Two-Factor Setup

Scan an authenticator QR code and enter a six-digit verification code.

Inputs: unique `id`, caller-issued `qr_image`, `title`, `description`, `preview=false`. Slots: none.
Behavior: `verify-two-factor` submission with repeated `code` digits; `resend` action. Host owns provisioning and verification. The example QR is visual reference data, not an enrollment credential.
Dependencies: `modals/modal-template`, `forms/verification-code`, local lock and scan-corner assets. Figma source: 17.
