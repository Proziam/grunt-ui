export function enhance(root = document, signal) {
  const iso = date => date.toISOString().slice(0, 10);
  const date = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  };
  const calendars = [...root.querySelectorAll('[data-gui-calendar]')];
  if (root.matches?.('[data-gui-calendar]')) calendars.unshift(root);
  for (const calendar of calendars) {
    const start = calendar.querySelector('[data-calendar-start]');
    const end = calendar.querySelector('[data-calendar-end]');
    const grid = calendar.querySelector('[data-calendar-grid]');
    const now = new Date();
    const today = date(calendar.dataset.today) || new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
    let shown = date(`${calendar.dataset.month}-01`) || date(end.value) || today;
    shown = new Date(Date.UTC(shown.getUTCFullYear(), shown.getUTCMonth(), 1, 12));
    let selectingEnd = false;
    function validate() {
      end.setCustomValidity(start.value && end.value && start.value > end.value ? 'Choose an end date on or after the start date.' : '');
    }
    function draw(focusDate) {
      const doc = calendar.ownerDocument;
      calendar.querySelector('[data-calendar-heading]').textContent = shown.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      grid.replaceChildren();
      for (const label of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
        const weekday = doc.createElement('span'); weekday.className = 'gui-calendar__weekday'; weekday.textContent = label; grid.append(weekday);
      }
      const offset = shown.getUTCDay();
      const days = new Date(Date.UTC(shown.getUTCFullYear(), shown.getUTCMonth() + 1, 0)).getUTCDate();
      for (let cell = 0; cell < Math.ceil((offset + days) / 7) * 7; cell++) {
        const wrap = doc.createElement('span'); wrap.className = 'gui-calendar__day'; grid.append(wrap);
        const day = cell - offset + 1;
        if (day < 1 || day > days) continue;
        const value = iso(new Date(Date.UTC(shown.getUTCFullYear(), shown.getUTCMonth(), day, 12)));
        const button = doc.createElement('button'); button.type = 'button'; button.textContent = day; button.dataset.calendarDate = value;
        button.setAttribute('aria-label', date(value).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'UTC' }));
        button.setAttribute('aria-pressed', String(value === start.value || value === end.value));
        if (value === iso(today)) button.setAttribute('aria-current', 'date');
        if (start.value && end.value && value >= start.value && value <= end.value) wrap.dataset.inRange = '';
        wrap.append(button);
      }
      if (focusDate) grid.querySelector(`[data-calendar-date="${focusDate}"]`)?.focus();
      validate();
    }
    function changed() {
      start.dispatchEvent(new Event('change', { bubbles: true }));
      end.dispatchEvent(new Event('change', { bubbles: true }));
    }
    calendar.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.calendarMonth) {
        shown.setUTCMonth(shown.getUTCMonth() + Number(button.dataset.calendarMonth)); draw();
      } else if (button.dataset.calendarDate) {
        const value = button.dataset.calendarDate;
        if (!selectingEnd) { start.value = value; end.value = ''; selectingEnd = true; }
        else { if (value < start.value) { end.value = start.value; start.value = value; } else end.value = value; selectingEnd = false; }
        changed(); draw(value);
      } else if (button.dataset.calendarRange) {
        const to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12));
        const from = new Date(to);
        const range = button.dataset.calendarRange;
        if (range === 'week') from.setUTCDate(from.getUTCDate() - 7);
        if (range === 'month') { from.setUTCDate(1); from.setUTCMonth(from.getUTCMonth() - 1); from.setUTCDate(Math.min(today.getUTCDate(), new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)).getUTCDate())); }
        if (range === 'year') from.setUTCFullYear(from.getUTCFullYear() - 1);
        start.value = iso(from); end.value = iso(to); selectingEnd = false; shown = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1, 12)); changed(); draw();
      }
    }, { signal });
    calendar.addEventListener('change', (event) => { if (event.target === start || event.target === end) draw(); }, { signal });
    grid.addEventListener('keydown', (event) => {
      const value = event.target.dataset.calendarDate;
      if (!value) return;
      const day = date(value);
      const deltas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (event.key in deltas) day.setUTCDate(day.getUTCDate() + deltas[event.key]);
      else if (event.key === 'Home') day.setUTCDate(day.getUTCDate() - day.getUTCDay());
      else if (event.key === 'End') day.setUTCDate(day.getUTCDate() + 6 - day.getUTCDay());
      else return;
      event.preventDefault(); shown = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1, 12)); draw(iso(day));
    }, { signal });
    draw();
  }
}
