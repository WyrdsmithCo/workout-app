/* pages/home.js — dashboard. Reads the store; fully working. */
import { state } from '../store.js';
import { PROGRAMS, PHASELEN, PHASENAME, FULL, progressionTip } from '../data/program.js';

export function render(view) {
  const p = PROGRAMS[state.phase];
  const done = p.order.filter((d) => {
    const items = [];
    p.days[d].sections.forEach((s, si) => s.items.forEach((it, ii) => { if (!it.opt) items.push(`p${state.phase}-${d}-${si}-${ii}`); }));
    return items.length && items.every((id) => state.checks[id]);
  }).length;

  view.innerHTML = `
    <div class="page-head">
      <span class="pill">Phase ${state.phase} · ${PHASENAME[state.phase]}</span>
      <h1 style="margin-top:10px;">Hey ${state.profile.name} 👋</h1>
      <p>Week ${state.week} of ${PHASELEN[state.phase]}. Here's where you stand.</p>
    </div>

    <div class="grid2" style="margin-bottom:14px;">
      <div class="stat"><div class="l">Workouts banked</div><div class="n accent">${state.total}</div></div>
      <div class="stat"><div class="l">Weeks completed</div><div class="n">${state.weeksDone}</div></div>
    </div>

    <div class="card">
      <h2>This week</h2>
      <p class="muted">${done} of 4 sessions done · ${state.walk.filter(Boolean).length}/5 walk days logged.</p>
      <div class="kt-banner" style="margin:12px 0 0;">${progressionTip(state.phase, state.week)}</div>
    </div>

    <a class="btn primary" href="#/today" style="width:100%;justify-content:center;">Start today's workout →</a>

    <div class="card" style="margin-top:14px;">
      <h2>Quick links</h2>
      <p class="muted">Jump to <a href="#/library" style="color:var(--cool)">the exercise library</a>, review <a href="#/history" style="color:var(--cool)">your history</a>, or check <a href="#/progress" style="color:var(--cool)">progress</a>.</p>
    </div>`;
}
