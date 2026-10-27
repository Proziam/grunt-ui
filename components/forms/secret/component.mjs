export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const button = event.target.closest('[data-secret-toggle]');
      const field = button?.closest('[data-gui-secret]');
      if (!field || !root.contains(field)) return;
      const input = field.querySelector('input');
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.textContent = reveal ? field.dataset.hide : field.dataset.show;
      button.setAttribute('aria-pressed', String(reveal));
    },
    { signal }
  );
}
