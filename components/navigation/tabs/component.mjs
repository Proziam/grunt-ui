function select(tabs, key, focus = false) {
  tabs.dataset.selected = key;
  for (const tab of tabs.querySelectorAll(':scope > nav > [data-tab]')) {
    const active = tab.dataset.tab === key;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(active));
    tab.setAttribute('aria-controls', tab.hash.slice(1));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  }
  for (const panel of tabs.querySelectorAll(':scope > [data-panel]')) {
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
    panel.hidden = panel.dataset.panel !== key;
  }
}
export function enhance(root = document, signal) {
  const instances = [...root.querySelectorAll('[data-gui-tabs]')];
  if (root.matches?.('[data-gui-tabs]')) instances.unshift(root);
  for (const tabs of instances) {
    tabs.querySelector(':scope > nav').setAttribute('role', 'tablist');
    const choices = [...tabs.querySelectorAll(':scope > nav > [data-tab]')];
    const selected =
      choices.find((tab) => tab.dataset.tab === tabs.dataset.selected) ||
      choices[0];
    if (selected) select(tabs, selected.dataset.tab);
  }
  root.addEventListener(
    'click',
    (event) => {
      const tab = event.target.closest('[data-tab]');
      const tabs = tab?.closest('[data-gui-tabs]');
      if (!tabs || !root.contains(tabs)) return;
      event.preventDefault();
      select(tabs, tab.dataset.tab);
    },
    { signal }
  );
  root.addEventListener(
    'keydown',
    (event) => {
      const tab = event.target.closest('[data-tab]');
      const tabs = tab?.closest('[data-gui-tabs]');
      if (!tabs || !root.contains(tabs)) return;
      const choices = [...tabs.querySelectorAll(':scope > nav > [data-tab]')];
      const index = choices.indexOf(tab);
      const next = {
        ArrowRight: (index + 1) % choices.length,
        ArrowLeft: (index + choices.length - 1) % choices.length,
        Home: 0,
        End: choices.length - 1
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabs, choices[next].dataset.tab, true);
    },
    { signal }
  );
}
