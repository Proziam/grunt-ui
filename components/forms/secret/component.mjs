export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const button = event.target.closest('[data-secret-toggle]');
      const field = button?.closest('[data-gui-secret]');
      if (!field || !root.contains(field)) return;
      const input = field.querySelector('input');
      if (!input || input.disabled || button.disabled) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      const label = reveal ? field.dataset.hide : field.dataset.show;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.setAttribute('aria-pressed', String(reveal));
    },
    { signal }
  );
}
