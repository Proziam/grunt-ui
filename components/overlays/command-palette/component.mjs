export function enhance(root = document, signal) {
  root.addEventListener(
    'input',
    (event) => {
      const command = event.target.closest('[data-gui-command]');
      if (
        !command ||
        !root.contains(command) ||
        !event.target.matches('input[type="search"]')
      )
        return;
      const query = event.target.value.trim().toLocaleLowerCase();
      let visible = 0;
      for (const item of command.querySelectorAll('li')) {
        item.hidden = !item.textContent.toLocaleLowerCase().includes(query);
        if (!item.hidden) visible++;
      }
      command.querySelector('[data-command-empty]').hidden = visible !== 0;
    },
    { signal }
  );
}
