export function enhance(root = document, signal) {
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step-index], [data-tour-next]');
    const tour = button?.closest('[data-gui-tour]');
    if (!tour || !root.contains(tour)) return;
    const slides = [...tour.querySelectorAll('[data-tour-slide]')];
    const current = slides.findIndex(slide => !slide.hidden);
    const next = button.hasAttribute('data-step-index') ? Number(button.dataset.stepIndex) : current + 1;
    if (next >= slides.length) {
      tour.closest('dialog').querySelector('form').requestSubmit();
      return;
    }
    const titleId = tour.closest('dialog').getAttribute('aria-labelledby');
    slides.forEach((slide, i) => { slide.hidden = i !== next; slide.querySelector('h2').removeAttribute('id'); });
    slides[next].querySelector('h2').id = titleId;
    tour.querySelectorAll('[data-step-index]').forEach((dot, i) => {
      if (i === next) dot.setAttribute('aria-current', 'step'); else dot.removeAttribute('aria-current');
    });
    tour.querySelector('[data-tour-next]').textContent = next === slides.length - 1 ? 'Finish' : 'Next';
  }, { signal });
}
