export function enhance(root = document, signal) {
  root.addEventListener('change', (event) => {
    const input = event.target.closest('[data-gui-person-select] input');
    if (!input || !root.contains(input)) return;
    const picker = input.closest('[data-gui-person-select]');
    picker.querySelector('[data-person-value]').textContent = input.dataset.label;
    picker.querySelector('details').open = false;
    picker.querySelector('summary').focus();
  }, { signal });
  root.addEventListener('keydown', (event) => {
    const picker = event.target.closest('[data-gui-person-select]');
    if (!picker || !root.contains(picker)) return;
    const details = picker.querySelector('details');
    if (event.key === 'Escape' && details.open) {
      event.preventDefault(); event.stopPropagation();
      details.open = false; picker.querySelector('summary').focus();
    } else if (event.key === 'ArrowDown' && event.target.tagName === 'SUMMARY') {
      event.preventDefault(); details.open = true;
      (picker.querySelector('input:checked') || picker.querySelector('input'))?.focus();
    }
  }, { signal });
  root.addEventListener('click', (event) => {
    for (const details of root.querySelectorAll('[data-gui-person-select] details[open]')) {
      if (!details.contains(event.target)) details.open = false;
    }
  }, { signal });
}
