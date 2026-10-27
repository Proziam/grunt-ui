const toggle = document.querySelector('[data-theme-toggle]');
toggle?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.guiTheme !== 'dark';
  document.documentElement.dataset.guiTheme = dark ? 'dark' : 'light';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.textContent = dark ? 'Light theme' : 'Dark theme';
});
function filter() {
  const query = document
    .querySelector('[data-catalog-search]')
    .value.trim()
    .toLocaleLowerCase();
  const category = document.querySelector('[data-catalog-category]').value;
  let count = 0;
  for (const item of document.querySelectorAll('[data-catalog-item]')) {
    item.hidden =
      !item.textContent.toLocaleLowerCase().includes(query) ||
      Boolean(category && item.dataset.category !== category);
    if (!item.hidden) count++;
  }
  document.querySelector('[data-catalog-count]').textContent =
    `${count} components`;
}
document
  .querySelector('[data-catalog-search]')
  ?.addEventListener('input', filter);
document
  .querySelector('[data-catalog-category]')
  ?.addEventListener('change', filter);
// Examples never contact application endpoints or claim a successful mutation.
document.addEventListener('submit', (event) => {
  if (event.target.method === 'dialog') return;
  event.preventDefault();
  const feedback = document.querySelector('[data-demo-feedback]');
  if (feedback)
    feedback.textContent =
      'Example submitted locally. Connect this form to your application to save changes.';
});
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href="#example"]');
  if (!link) return;
  event.preventDefault();
  document.querySelector('[data-demo-feedback]').textContent =
    'Example destination. Supply your own URL when using this component.';
});
