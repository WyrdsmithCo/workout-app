/* pages/calendar.js — a real month grid that dots the days you
   trained (from history). Month navigation + streaks are TODO. */
import { state } from '../store.js';

export function render(view) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // set of "YYYY-M-D" strings that have a completed session
  const trained = new Set(
    state.history.map((h) => {
      const d = new Date(h.ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const first = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push('');
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dow = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  view.innerHTML = `
    <div class="page-head"><h1>Calendar</h1><p>Every dot is a completed workout. ${monthName}.</p></div>
    <div class="card">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;">
        ${dow.map((d) => `<div class="muted" style="font-size:.66rem;font-weight:600;letter-spacing:.05em;">${d}</div>`).join('')}
        ${cells.map((c) => {
          if (c === '') return `<div></div>`;
          const isTrained = trained.has(`${year}-${month}-${c}`);
          const isToday = c === now.getDate();
          return `<div style="aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;
            border:1px solid ${isToday ? 'var(--focus)' : 'var(--line)'};background:${isTrained ? 'rgba(55,224,160,.14)' : 'var(--surface-2)'};font-family:'Space Grotesk',sans-serif;font-size:.8rem;color:${isTrained ? 'var(--done)' : 'var(--muted)'};">
            ${c}${isTrained ? '<span style="width:5px;height:5px;border-radius:50%;background:var(--done);margin-top:3px;"></span>' : ''}
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="stub">
      <b>TODO:</b> add ◀ ▶ buttons to page through months (track a <code>viewMonth</code> variable and re-render), and a streak counter. The data's already here in <code>state.history</code> — this is a pure-view feature, a great first solo build.
    </div>`;
}
