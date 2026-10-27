# Cascading resource picker

Explicit account and resource selections using authorized options supplied by the host.

Inputs: `id`, `(value,label)` `connection_options`, `resource_options`, selected values,
translated labels, submitted names and `help`. The host must replace resource options
and clear invalid selections when the account changes. No independent fetching.
Dependencies: forms/select and foundation. JavaScript: none.
