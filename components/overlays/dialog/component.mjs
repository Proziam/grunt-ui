export function enhance(root = document, signal) {
  const outside = new WeakSet();
  function onBackdrop(event, dialog) {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
  }
  root.addEventListener('pointerdown', (event) => {
    const dialog = event.target.closest('dialog[data-gui-light-dismiss]');
    if (!dialog || !root.contains(dialog)) return;
    outside.delete(dialog);
    if (onBackdrop(event, dialog)) outside.add(dialog);
  }, { signal });
  root.addEventListener(
    'click',
    (event) => {
      const dismiss = event.target.closest('[data-gui-close]');
      const parent = event.target.closest('dialog');
      if (parent && root.contains(parent) &&
          (dismiss || (outside.has(parent) && onBackdrop(event, parent)))) {
        outside.delete(parent);
        if (parent.requestClose) parent.requestClose();
        else if (parent.dispatchEvent(new Event('cancel', { cancelable: true }))) parent.close();
        return;
      }
      const trigger = event.target.closest('[data-gui-open]');
      if (!trigger || !root.contains(trigger)) return;
      const dialog = trigger.ownerDocument.getElementById(
        trigger.dataset.guiOpen
      );
      if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
      dialog.showModal();
      trigger.setAttribute('aria-expanded', 'true');
    },
    { signal }
  );
  root.addEventListener('close', (event) => {
    if (!(event.target instanceof HTMLDialogElement)) return;
    for (const trigger of root.querySelectorAll('[data-gui-open]')) {
      if (trigger.dataset.guiOpen === event.target.id) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    }
  }, { capture: true, signal });
}
