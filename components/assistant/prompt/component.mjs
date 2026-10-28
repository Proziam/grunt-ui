export function enhance(root = document, signal) {
  root.addEventListener('input', (event) => {
    if (!event.target.matches('[data-prompt-input]') || !root.contains(event.target)) return;
    event.target.closest('[data-gui-prompt-composer]').querySelector('[data-prompt-send]').hidden = !event.target.value.trim();
  }, { signal });
  root.addEventListener('keydown', (event) => {
    if (!event.target.matches('[data-prompt-input]') || !root.contains(event.target)) return;
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && event.target.value.trim()) {
      event.preventDefault(); event.target.form?.requestSubmit();
    }
  }, { signal });
  root.addEventListener('change', (event) => {
    const input = event.target.closest('[data-gui-prompt-composer] input[type="file"]');
    if (!input || !root.contains(input)) return;
    input.closest('label').querySelector('[data-attachment-label]').textContent = input.files[0]?.name || 'Attach';
  }, { signal });
}
