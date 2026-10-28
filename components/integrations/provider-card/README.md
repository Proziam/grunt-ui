# Integration discovery card

A service icon, name, short description and bottom-right Connect action.

- Inputs: `name`, `description`, `href` (the application's connection setup route), `connected` (default `false`).
- Content slot: a service SVG or image, displayed at 32px; the adjacent name labels it.
- Size: fills its grid column, with a 22px inset and fixed 236px height (362px wide in Figma). Titles truncate to one line; descriptions clamp to two lines with an ellipsis. Supply at most two short sentences; full text remains in the markup for assistive technology.
- Behavior: Connect submits a native GET form to setup; it never marks a service connected. `connected=true` renders a static green Connected label with a checkmark instead. The example shows this state on Google Drive; preview submissions do nothing.
- Dependencies: `actions/button`; the example also uses `layout/grid`.
- Connect uses the unmodified `actions/button` secondary button.
- Service SVGs live in `images/integrations/`, exported from Page 1 in Figma. The asset API and catalog serve them; extraction includes images referenced by selected examples.
- Design: [Grunt Components](https://www.figma.com/design/J704mKQTVAYpFBsghMLupi/Untitled?node-id=81-990).
