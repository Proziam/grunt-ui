export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    async (event) => {
      const button = event.target.closest('[data-copy-button]');
      const field = button?.closest('[data-gui-copy]');
      if (!field || !root.contains(field)) return;
      const input = field.querySelector('input');
      const status = field.querySelector('[role="status"]');
      try {
        await navigator.clipboard.writeText(input.value);
        if (!signal?.aborted) status.textContent = field.dataset.success;
      } catch {
        if (signal?.aborted) return;
        input.focus();
        input.select();
        status.textContent = field.dataset.error;
      }
    },
    { signal }
  );
}
