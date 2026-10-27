# Audit event

An immutable action, actor, time and authorized details for audit inspection.

Inputs: `action`, `actor`, ISO `datetime`, `time_label`, `(label,value)` `fields`.
The application redacts protected values before rendering. Dependencies: key-value, foundation.
