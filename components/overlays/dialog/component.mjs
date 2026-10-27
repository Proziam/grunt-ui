export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const trigger = event.target.closest('[data-gui-open]');
      if (!trigger || !root.contains(trigger)) return;
      const dialog = trigger.ownerDocument.getElementById(
        trigger.dataset.guiOpen
      );
      if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
      dialog.showModal();
    },
    { signal }
  );
}
