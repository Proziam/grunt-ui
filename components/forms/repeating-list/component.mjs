export function enhance(root = document, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const button = event.target.closest(
        '[data-add-item], [data-remove-item]'
      );
      const list = button?.closest('[data-gui-repeating]');
      if (!list || !root.contains(list)) return;
      if (button.hasAttribute('data-add-item')) {
        const fragment = list
          .querySelector('[data-repeating-template]')
          .content.cloneNode(true);
        const input = fragment.querySelector('input');
        list.querySelector('[data-repeating-items]').append(fragment);
        input.focus();
      } else {
        const row = button.closest('.gui-repeating-list__row');
        const focus =
          row.nextElementSibling?.querySelector('input') ||
          row.previousElementSibling?.querySelector('input') ||
          list.querySelector('[data-add-item]');
        row.remove();
        focus.focus();
      }
      list.dispatchEvent(new Event('input', { bubbles: true }));
    },
    { signal }
  );
}
