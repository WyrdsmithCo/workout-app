/* ============================================================
   router.js — the smallest router that does the job.
   ------------------------------------------------------------
   We use the URL hash (#/today) instead of real paths so there's
   no server config and it works on GitHub Pages out of the box.
   Each route points at a page module that exports render(view).
   ============================================================ */

export function createRouter({ view, routes, fallback, onRoute }) {
  function current() {
    // "#/today" -> "today"; empty -> fallback
    const raw = location.hash.replace(/^#\/?/, '').trim();
    return raw || fallback;
  }

  function renderRoute() {
    const name = current();
    const page = routes[name] || routes[fallback];
    view.innerHTML = '';
    page.render(view);
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (onRoute) onRoute(name);
  }

  window.addEventListener('hashchange', renderRoute);
  // first paint
  if (!location.hash) location.replace('#/' + fallback);
  renderRoute();

  return { go: (name) => { location.hash = '#/' + name; } };
}
