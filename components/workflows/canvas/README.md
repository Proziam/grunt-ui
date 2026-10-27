# Workflow canvas

A presentation-only viewport with pan, zoom and pointer/keyboard node positioning.

`render(id, label, zoom_in, zoom_out, reset)` accepts `position(id, x, y, label, movable)`
call blocks. Node coordinates are visit-local. Events: bubbling `gui:node-move`
with `{id,x,y}`. Set `movable=false` for locked workflows. No execution graph is stored.
Arrow keys pan; +/− zoom; Home resets. Focus a move handle and use arrows to move it.
Dependencies: foundation and supplied node content. JS: `enhance(root, signal)`.
