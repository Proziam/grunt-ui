export function enhance(root = document, signal) {
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-prompt-suggestion]');
    if (!button || !root.contains(button)) return;
    const input = button.closest('[data-gui-assistant-welcome]').querySelector('[data-prompt-input]');
    input.value = button.dataset.promptSuggestion;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }, { signal });
}
