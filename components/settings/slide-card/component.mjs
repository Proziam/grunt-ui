export function enhance(root = document, signal) {
  const closing = new Map();
  root.addEventListener('cancel', (event) => {
    const dialog = event.target;
    if (!dialog.matches('.gui-settings-slide-card') || !dialog.open) return;
    event.preventDefault();
    if (closing.has(dialog)) return;
    const attempt = {};
    closing.set(dialog, attempt);
    dialog.dataset.closing = '';
    // Keep the dialog in the top layer until both exit transitions finish.
    Promise.allSettled(dialog.getAnimations().map(animation => animation.finished)).then(() => {
      if (closing.get(dialog) !== attempt) return;
      closing.delete(dialog);
      dialog.close();
      delete dialog.dataset.closing;
    });
  }, { capture: true, signal });
  root.addEventListener('close', (event) => {
    const dialog = event.target;
    if (!dialog.matches('.gui-settings-slide-card')) return;
    closing.delete(dialog);
    delete dialog.dataset.closing;
  }, { capture: true, signal });
  signal?.addEventListener('abort', () => {
    for (const dialog of closing.keys()) {
      dialog.close();
      delete dialog.dataset.closing;
      dialog.parentElement?.querySelector('[data-gui-open]')?.setAttribute('aria-expanded', 'false');
    }
    closing.clear();
  }, { once: true });
  root.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-gui-settings-form]');
    if (!form || !root.contains(form)) return;
    event.preventDefault();
    const dialog = form.closest('dialog');
    dialog.dispatchEvent(new CustomEvent('gui:settings-submit', {
      bubbles: true,
      cancelable: true,
      detail: { id: dialog.id, data: new FormData(form) },
    }));
  }, { signal });
}
