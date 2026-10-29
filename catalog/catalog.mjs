const toggle = document.querySelector('[data-theme-toggle]');
toggle?.addEventListener('click', () => {
  const dark = document.documentElement.dataset.guiTheme !== 'dark';
  document.documentElement.dataset.guiTheme = dark ? 'dark' : 'light';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.textContent = dark ? 'Light theme' : 'Dark theme';
  for (const frame of document.querySelectorAll('[data-gui-preview-frame]')) {
    frame.contentDocument.documentElement.dataset.guiTheme = dark ? 'dark' : 'light';
  }
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

// A separate viewport makes media queries respond to the preview width.
for (const preview of document.querySelectorAll('.catalog-preview')) {
  const stage = document.createElement('div');
  stage.className = 'gui-preview-stage';
  const canvas = document.createElement('div');
  canvas.className = 'gui-preview-canvas';
  const frame = document.createElement('iframe');
  frame.dataset.guiPreviewFrame = '';
  frame.title = 'Live component example';
  const source = document.implementation.createHTMLDocument(frame.title);
  source.documentElement.lang = 'en';
  source.documentElement.dataset.guiTheme = document.documentElement.dataset.guiTheme;
  const base = source.createElement('base');
  base.href = document.baseURI;
  source.head.append(base);
  const viewport = source.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1';
  source.head.append(viewport);
  for (const stylesheet of document.querySelectorAll('link[rel="stylesheet"]')) {
    source.head.append(stylesheet.cloneNode(true));
  }
  source.body.className = 'gui-preview-document';
  source.body.innerHTML = preview.innerHTML;
  const feedback = source.createElement('p');
  feedback.className = 'catalog-feedback';
  feedback.dataset.demoFeedback = '';
  feedback.setAttribute('role', 'status');
  source.body.append(feedback);
  for (const module of ['auto.mjs', 'catalog.mjs']) {
    const script = source.createElement('script');
    script.type = 'module';
    script.src = new URL(module, document.querySelector('script[src$="catalog.mjs"]').src).href;
    source.body.append(script);
  }
  frame.srcdoc = '<!doctype html>' + source.documentElement.outerHTML;
  const handle = document.createElement('div');
  handle.className = 'gui-preview-handle';
  handle.tabIndex = 0;
  handle.setAttribute('role', 'separator');
  handle.setAttribute('aria-orientation', 'vertical');
  handle.setAttribute('aria-label', 'Resize live example');
  handle.title = 'Drag to resize. Arrow keys adjust; Home selects phone width; End restores full width.';
  const readout = document.createElement('span');
  readout.className = 'gui-preview-size';
  let requestedWidth = Infinity;
  let width;
  let minimum;
  let maximum;
  function resize() {
    maximum = Math.max(1, Math.floor(stage.clientWidth) - handle.offsetWidth);
    minimum = Math.min(320, maximum);
    width = Math.round(Math.max(minimum, Math.min(maximum, requestedWidth)));
    canvas.style.width = `${width}px`;
    handle.setAttribute('aria-valuemin', String(minimum));
    handle.setAttribute('aria-valuemax', String(maximum));
    handle.setAttribute('aria-valuenow', String(width));
    handle.setAttribute('aria-valuetext', `${width} pixels`);
    readout.textContent = `${width}px · Drag right edge to resize`;
  }
  let drag;
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || drag) return;
    event.preventDefault();
    handle.focus();
    drag = { id: event.pointerId, x: event.clientX, width };
    handle.setPointerCapture(event.pointerId);
    canvas.dataset.resizing = '';
  });
  handle.addEventListener('pointermove', (event) => {
    if (drag?.id !== event.pointerId) return;
    requestedWidth = Math.max(minimum, Math.min(maximum, drag.width + event.clientX - drag.x));
    resize();
  });
  function stopDrag(event) {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    delete canvas.dataset.resizing;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  }
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    handle.addEventListener(event, stopDrag);
  }
  handle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 100 : 10;
    switch (event.key) {
      case 'ArrowLeft': requestedWidth = width - step; break;
      case 'ArrowRight': requestedWidth = width + step; break;
      case 'Home': requestedWidth = minimum; break;
      case 'End': requestedWidth = Infinity; break;
      default: return;
    }
    event.preventDefault();
    if (Number.isFinite(requestedWidth)) requestedWidth = Math.max(minimum, Math.min(maximum, requestedWidth));
    resize();
  });
  handle.addEventListener('dblclick', () => {
    requestedWidth = Infinity;
    resize();
  });
  frame.addEventListener('load', () => {
    const content = frame.contentDocument;
    content.documentElement.dataset.guiTheme = document.documentElement.dataset.guiTheme;
    const observer = new ResizeObserver(() => {
      const border = frame.offsetHeight - frame.clientHeight;
      frame.style.height = `${Math.ceil(content.body.getBoundingClientRect().height) + border}px`;
    });
    observer.observe(content.body);
  });
  canvas.append(frame, handle);
  stage.append(canvas);
  preview.classList.replace('catalog-preview', 'gui-preview');
  preview.replaceChildren(stage, readout);
  new ResizeObserver(resize).observe(stage);
  resize();
}
// Examples never contact application endpoints or claim a successful mutation.
// Pointer events inside an iframe do not bubble; a click in the catalog is outside its panel.
document.addEventListener('pointerdown', () => {
  for (const frame of document.querySelectorAll('[data-gui-preview-frame]')) {
    for (const dialog of frame.contentDocument.querySelectorAll('dialog[data-gui-light-dismiss][open]')) {
      if (dialog.requestClose) dialog.requestClose();
      else if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) dialog.close();
    }
  }
});
document.addEventListener('submit', (event) => {
  if (event.target.method === 'dialog') return;
  event.preventDefault();
});
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href="#example"]');
  if (!link) return;
  event.preventDefault();
});
