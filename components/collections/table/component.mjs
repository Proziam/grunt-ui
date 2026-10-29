export function enhance(root = document, signal) {
  const views = [...root.querySelectorAll('[data-gui-table]')];
  if (root.matches?.('[data-gui-table]')) views.unshift(root);
  for (const view of views) {
    const table = view.querySelector('table');
    const body = table?.tBodies[0];
    if (!body) continue;
    const scroller = table.closest('.gui-table-scroll');
    const rows = [...body.rows].filter(row => !row.hasAttribute('data-gui-table-empty'));
    const empty = body.querySelector('[data-gui-table-empty]');
    const all = view.querySelector('[data-gui-table-select-all] input');
    const search = view.querySelector('input[type="search"]');
    const sortSelect = view.querySelector('[data-gui-table-sort-select] select');
    const selectedOnly = view.querySelector('[data-gui-table-selected-only] input');
    const headings = [...table.querySelectorAll('thead [data-gui-table-column]')];
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const selection = row => row.querySelector('[data-gui-table-select] input');
    let sortKey = '';
    let descending = false;

    function update(announce = true, resetScroll = false) {
      const focused = body.contains(table.ownerDocument.activeElement) ? table.ownerDocument.activeElement : null;
      const query = (search?.value || '').trim().toLocaleLowerCase();
      const group = view.querySelector('[data-gui-table-filter]:checked')?.value || '';
      const heading = headings.find(th => th.dataset.guiTableColumn === sortKey);
      const ordered = [...rows];
      if (heading) {
        const value = row => {
          const cell = row.cells[heading.cellIndex];
          return (cell?.dataset.guiSortValue ?? cell?.textContent ?? '').trim();
        };
        ordered.sort((a, b) => {
          const first = value(a);
          const second = value(b);
          const firstIsNumber = first !== '' && Number.isFinite(Number(first));
          const secondIsNumber = second !== '' && Number.isFinite(Number(second));
          const comparison = firstIsNumber && secondIsNumber
            ? Number(first) - Number(second)
            : firstIsNumber !== secondIsNumber
              ? (firstIsNumber ? -1 : 1)
              : collator.compare(first, second);
          return comparison * (descending ? -1 : 1);
        });
      }
      let next = body.firstElementChild;
      for (const row of ordered) {
        row.hidden = Boolean((group && row.dataset.guiTableGroup !== group) ||
          (query && !row.textContent.toLocaleLowerCase().includes(query)) ||
          (selectedOnly?.checked && !selection(row)?.checked));
        if (row !== next) body.insertBefore(row, next);
        next = row.nextElementSibling;
      }
      if (empty && empty !== body.lastElementChild) body.append(empty);
      const visible = rows.filter(row => !row.hidden);
      if (empty) empty.hidden = visible.length !== 0;
      const choices = visible.map(selection).filter(input => input && !input.disabled);
      const checked = choices.filter(input => input.checked).length;
      if (all) {
        all.disabled = choices.length === 0;
        all.checked = choices.length > 0 && checked === choices.length;
        all.indeterminate = false;
      }
      for (const th of headings) {
        th.setAttribute('aria-sort', th === heading ? (descending ? 'descending' : 'ascending') : 'none');
      }
      if (sortSelect) sortSelect.value = sortKey;
      if (focused) {
        const target = focused.closest('tr').hidden
          ? choices[0] || search || view.querySelector('.gui-table-scroll')
          : focused;
        if (target && table.ownerDocument.activeElement !== target) target.focus({ preventScroll: true });
      }
      const count = view.querySelector('[data-gui-table-count]');
      if (count && announce) count.textContent = `${visible.length} of ${rows.length} rows shown.`;
      if (resetScroll && scroller) scroller.scrollTop = 0;
    }

    view.addEventListener('input', (event) => {
      if (event.target === search) update(true, true);
    }, { signal });
    view.addEventListener('change', (event) => {
      if (event.target === all) {
        for (const row of rows) {
          const input = selection(row);
          if (!row.hidden && input && !input.disabled) input.checked = all.checked;
        }
      }
      if (event.target === sortSelect) { sortKey = sortSelect.value; descending = false; }
      update(true, event.target.matches('[data-gui-table-filter]') ||
        event.target === sortSelect || event.target === selectedOnly);
      if (event.target === all || event.target.closest('[data-gui-table-select]')) {
        view.dispatchEvent(new CustomEvent('gui:table-selection', {
          bubbles: true,
          detail: { id: view.id, values: rows.map(selection).filter(input => input?.checked).map(input => input.value) },
        }));
      }
    }, { signal });
    view.addEventListener('click', (event) => {
      const sort = event.target.closest('[data-gui-table-sort]');
      if (sort) {
        descending = sortKey === sort.dataset.guiTableSort ? !descending : false;
        sortKey = sort.dataset.guiTableSort;
        update(true, true);
      }
      const action = event.target.closest('[data-gui-table-action]');
      if (action && event.target.closest('button')) {
        view.dispatchEvent(new CustomEvent('gui:table-action', {
          bubbles: true, cancelable: true,
          detail: { id: view.id, action: action.dataset.guiTableAction, value: action.dataset.guiTableValue },
        }));
      }
    }, { signal });
    update(false);
  }
}
