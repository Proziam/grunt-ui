export function enhance(root = document, signal) {
  root.addEventListener('keydown', (event) => {
    const dialog = event.target.closest('.gui-modal[data-size="experience"]');
    if (!dialog || !root.contains(dialog)) return;
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault(); dialog.querySelector('input[name="location"]').focus();
    }
  }, { signal });
}
