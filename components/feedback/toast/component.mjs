export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const toast = event.target
        .closest('[data-toast-close]')
        ?.closest('[data-gui-toast]');
      if (!toast || !root.contains(toast)) return;
      toast.hidden = true;
      toast.dispatchEvent(new CustomEvent('gui:dismiss', { bubbles: true }));
    },
    { signal }
  );
}
