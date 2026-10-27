export function enhance(root = document, signal) {
  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return;
      if (root.matches?.('.gui-tooltip:hover, .gui-tooltip:focus-within'))
        root.dataset.dismissed = '';
      for (const tooltip of root.querySelectorAll(
        '.gui-tooltip:hover, .gui-tooltip:focus-within'
      ))
        tooltip.dataset.dismissed = '';
    },
    { signal }
  );
  const reset = (event) => {
    const tooltip = event.target.closest('.gui-tooltip');
    if (tooltip && !tooltip.contains(event.relatedTarget))
      delete tooltip.dataset.dismissed;
  };
  root.addEventListener('pointerout', reset, { signal });
  root.addEventListener('focusout', reset, { signal });
}
