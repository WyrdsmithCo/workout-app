/* ============================================================
   app.js — the entry point. index.html loads only this.
   It imports every page module, hands them to the router,
   and keeps the nav's active link in sync.
   ============================================================ */
import { createRouter } from './router.js';
import { renderNav } from './components/nav.js';

import * as home from './pages/home.js';
import * as today from './pages/today.js';
import * as progress from './pages/progress.js';
import * as calendar from './pages/calendar.js';
import * as library from './pages/library.js';
import * as history from './pages/history.js';
import * as settings from './pages/settings.js';
import * as profile from './pages/profile.js';

const view = document.getElementById('view');
const nav = document.getElementById('nav');

const routes = { home, today, progress, calendar, library, history, settings, profile };

createRouter({
  view,
  routes,
  fallback: 'home',
  onRoute: (name) => renderNav(nav, name),
});
