/* pages/history.js — log of completed sessions. Working.
   The Today page pushes an entry to state.history each time a day
   is completed; this page just reads it back, newest first. */
import { state } from '../store.js';
import { FULL, PHASENAME } from '../data/program.js';

export function render(view) {
  const items = [...state.history].reverse();

  view.innerHTML = `
    <div class="page-head">
      <h1>Workout History</h1>
      <p>${items.length ? `${items.length} completed session${items.length === 1 ? '' : 's'} logged.` : 'Nothing logged yet — finish a day on the workout page and it shows up here.'}</p>
    </div>
    <div id="hist"></div>`;

  const wrap = view.querySelector('#hist');
  if (!items.length) {
    wrap.innerHTML = `<div class="stub">Complete all the required steps of any day in <b>Today's Workout</b> and it'll appear here with the date, phase, and week.
    <br><br><b>TODO idea:</b> group these by week, or add a "sessions per week" bar so streaks are visible.</div>`;
    return;
  }

  items.forEach((h) => {
    const d = new Date(h.ts);
    const row = document.createElement('div');
    row.className = 'card';
    row.style.padding = '14px 16px';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;">
        <div>
          <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;">${FULL[h.day] || h.day} — ${h.title}</div>
          <div class="muted" style="margin-top:2px;">Phase ${h.phase} · ${PHASENAME[h.phase]} · Week ${h.week}</div>
        </div>
        <div class="muted" style="white-space:nowrap;">${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
      </div>`;
    wrap.appendChild(row);
  });
}
