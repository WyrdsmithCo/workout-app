/* pages/calendar.js — month grid of completed workouts, with month nav.
   The pattern: `year`/`month` are this page's state. Change them,
   call draw(), the view rebuilds. Same loop the Today page uses. */
import { state } from '../store.js';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export function render(view) {
  const today = new Date();
  // These two variables ARE the state of this page.
  let year = today.getFullYear();
  let month = today.getMonth();

  view.innerHTML = `
    <div class="page-head"><h1>Calendar</h1><p>Every dot is a completed workout.</p></div>
    <div class="card" id="cal"></div>`;
  const cal = view.querySelector('#cal');

  function draw() {
    // Which calendar days have a completed session? (built from history)
    const trained = new Set(
      state.history.map((h) => {
        const d = new Date(h.ts);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );

    const firstDay = new Date(year, month, 1).getDay();      // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isThisMonth = year === today.getFullYear() && month === today.getMonth();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push('');       // blanks before day 1
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    cal.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <button class="btn" id="prev" type="button" aria-label="Previous month">◀</button>
        <div style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.05rem;">${MONTHS[month]} ${year}</div>
        <button class="btn" id="next" type="button" aria-label="Next month">▶</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;">
        ${DOW.map((d) => `<div class="muted" style="font-size:.66rem;font-weight:600;letter-spacing:.05em;">${d}</div>`).join('')}
        ${cells.map((c) => {
          if (c === '') return '<div></div>';
          const isTrained = trained.has(`${year}-${month}-${c}`);
          const isToday = isThisMonth && c === today.getDate();
          return `<div style="aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;
            border:1px solid ${isToday ? 'var(--focus)' : 'var(--line)'};
            background:${isTrained ? 'rgba(55,224,160,.14)' : 'var(--surface-2)'};
            font-family:'Space Grotesk',sans-serif;font-size:.8rem;color:${isTrained ? 'var(--done)' : 'var(--muted)'};">
            ${c}${isTrained ? '<span style="width:5px;height:5px;border-radius:50%;background:var(--done);margin-top:3px;"></span>' : ''}
          </div>`;
        }).join('')}
      </div>
      ${!isThisMonth ? '<button class="kt-reset" id="todayBtn" type="button" style="margin-top:14px;">↺ Back to this month</button>' : ''}`;

    // Wire the buttons: nudge the variables, then redraw.
    cal.querySelector('#prev').addEventListener('click', () => {
      month--; if (month < 0) { month = 11; year--; } draw();
    });
    cal.querySelector('#next').addEventListener('click', () => {
      month++; if (month > 11) { month = 0; year++; } draw();
    });
    const backBtn = cal.querySelector('#todayBtn');
    if (backBtn) backBtn.addEventListener('click', () => {
      year = today.getFullYear(); month = today.getMonth(); draw();
    });
  }

  draw();
}