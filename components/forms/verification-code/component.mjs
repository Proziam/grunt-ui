export function enhance(root = document, signal) {
  function fields(input) { return [...input.closest('[data-gui-verification]').querySelectorAll('input')]; }
  root.addEventListener('input', (event) => {
    const input = event.target.closest('[data-gui-verification] input');
    if (!input || !root.contains(input)) return;
    input.value = input.value.replace(/\D/g, '').slice(-1);
    if (input.value) { const all = fields(input); all[all.indexOf(input) + 1]?.focus(); }
  }, { signal });
  root.addEventListener('paste', (event) => {
    const input = event.target.closest('[data-gui-verification] input');
    if (!input || !root.contains(input)) return;
    const digits = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!digits) return;
    event.preventDefault();
    const all = fields(input), start = all.indexOf(input);
    const targets = all.slice(start);
    targets.forEach((field, i) => { if (digits[i]) field.value = digits[i]; });
    targets[Math.min(digits.length, targets.length) - 1].focus();
    input.closest('fieldset').dispatchEvent(new Event('input', { bubbles: true }));
  }, { signal });
  root.addEventListener('keydown', (event) => {
    const input = event.target.closest('[data-gui-verification] input');
    if (!input || !root.contains(input)) return;
    const all = fields(input), index = all.indexOf(input);
    if (event.key === 'Backspace' && !input.value) all[index - 1]?.focus();
    if (event.key === 'ArrowLeft') all[index - 1]?.focus();
    if (event.key === 'ArrowRight') all[index + 1]?.focus();
  }, { signal });
}
