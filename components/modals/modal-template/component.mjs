export function enhance(root = document, signal) {
  function dismiss(dialog) {
    dialog.close();
    const reopen = dialog.parentElement.querySelector('[data-gui-reopen]');
    if (reopen) { reopen.hidden = false; reopen.focus(); }
  }
  root.addEventListener('click', (event) => {
    const reopen = event.target.closest('[data-gui-reopen]');
    if (reopen && root.contains(reopen)) {
      const dialog = reopen.ownerDocument.getElementById(reopen.dataset.guiReopen);
      dialog.show();
      reopen.hidden = true;
      dialog.querySelector('button, input, textarea, select')?.focus();
      return;
    }
    const button = event.target.closest('[data-gui-modal-action]');
    const dialog = button?.closest('.gui-modal');
    if (!dialog || !root.contains(dialog)) return;
    const action = button.dataset.guiModalAction;
    const request = new CustomEvent('gui:modal-action', {
      bubbles: true, cancelable: true,
      detail: { id: dialog.id, action, value: button.value, data: new FormData(dialog.querySelector('form')) },
    });
    if (dialog.dispatchEvent(request) && action === 'cancel') dismiss(dialog);
  }, { signal });
  root.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-gui-modal-form]');
    if (!form || !root.contains(form)) return;
    event.preventDefault();
    const dialog = form.closest('.gui-modal');
    const submitter = event.submitter || form.querySelector('[type="submit"]');
    dialog.dispatchEvent(new CustomEvent('gui:modal-submit', {
      bubbles: true, cancelable: true,
      detail: { id: dialog.id, action: submitter?.value || 'confirm', data: new FormData(form, submitter || undefined) },
    }));
  }, { signal });
}
