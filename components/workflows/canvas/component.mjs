const views = new WeakMap();
const number = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
function draw(canvas, view) {
  canvas.querySelector('[data-canvas-scene]').style.transform =
    `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  canvas.querySelector('[data-canvas-scale]').value =
    `${Math.round(view.scale * 100)}%`;
}
function move(node, x, y) {
  node.dataset.x = String(x);
  node.dataset.y = String(y);
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
}
export function enhance(root = document, signal) {
  const canvases = [...root.querySelectorAll('[data-gui-canvas]')];
  if (root.matches?.('[data-gui-canvas]')) canvases.unshift(root);
  for (const canvas of canvases) {
    const viewport = canvas.querySelector('[data-canvas-viewport]');
    const view = views.get(canvas) || { x: 0, y: 0, scale: 1, drag: null };
    views.set(canvas, view);
    canvas.dataset.enhanced = '';
    for (const node of canvas.querySelectorAll('[data-canvas-node]'))
      move(node, number(node.dataset.x), number(node.dataset.y));
    draw(canvas, view);
    const notify = (node) =>
      node.dispatchEvent(
        new CustomEvent('gui:node-move', {
          bubbles: true,
          detail: {
            id: node.dataset.canvasNode,
            x: number(node.dataset.x),
            y: number(node.dataset.y)
          }
        })
      );
    canvas.addEventListener(
      'click',
      (event) => {
        const action = event.target.closest('[data-canvas-action]')?.dataset
          .canvasAction;
        if (!action) return;
        if (action === 'reset') Object.assign(view, { x: 0, y: 0, scale: 1 });
        else
          view.scale = Math.max(
            0.25,
            Math.min(2, view.scale + (action === 'in' ? 0.1 : -0.1))
          );
        draw(canvas, view);
      },
      { signal }
    );
    viewport.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button !== 0 || !event.isPrimary || view.drag) return;
        const node = event.target
          .closest('[data-canvas-drag]')
          ?.closest('[data-canvas-node]');
        if (
          !node &&
          event.target.closest(
            'button, a, input, textarea, select, [data-canvas-node]'
          )
        )
          return;
        view.drag = {
          pointer: event.pointerId,
          node,
          px: event.clientX,
          py: event.clientY,
          x: node ? number(node.dataset.x) : view.x,
          y: node ? number(node.dataset.y) : view.y
        };
        viewport.setPointerCapture(event.pointerId);
      },
      { signal }
    );
    viewport.addEventListener(
      'pointermove',
      (event) => {
        const drag = view.drag;
        if (!drag || drag.pointer !== event.pointerId) return;
        const dx = event.clientX - drag.px,
          dy = event.clientY - drag.py;
        if (drag.node)
          move(drag.node, drag.x + dx / view.scale, drag.y + dy / view.scale);
        else {
          view.x = drag.x + dx;
          view.y = drag.y + dy;
          draw(canvas, view);
        }
      },
      { signal }
    );
    const finish = (event) => {
      if (view.drag?.pointer !== event.pointerId) return;
      const node = view.drag.node;
      view.drag = null;
      if (node) notify(node);
    };
    viewport.addEventListener('pointerup', finish, { signal });
    viewport.addEventListener('pointercancel', finish, { signal });
    viewport.addEventListener('lostpointercapture', finish, { signal });
    viewport.addEventListener(
      'keydown',
      (event) => {
        const node = event.target
          .closest('[data-canvas-drag]')
          ?.closest('[data-canvas-node]');
        if (!node && event.target !== viewport) return;
        const delta = {
          ArrowLeft: [-20, 0],
          ArrowRight: [20, 0],
          ArrowUp: [0, -20],
          ArrowDown: [0, 20]
        }[event.key];
        if (delta) {
          event.preventDefault();
          if (node) {
            move(
              node,
              number(node.dataset.x) + delta[0],
              number(node.dataset.y) + delta[1]
            );
            notify(node);
          } else {
            view.x -= delta[0];
            view.y -= delta[1];
            draw(canvas, view);
          }
        } else if (!node && ['+', '=', '-', 'Home'].includes(event.key)) {
          event.preventDefault();
          if (event.key === 'Home')
            Object.assign(view, { x: 0, y: 0, scale: 1 });
          else
            view.scale = Math.max(
              0.25,
              Math.min(2, view.scale + (event.key === '-' ? -0.1 : 0.1))
            );
          draw(canvas, view);
        }
      },
      { signal }
    );
    signal?.addEventListener(
      'abort',
      () => {
        view.drag = null;
      },
      { once: true }
    );
  }
}
