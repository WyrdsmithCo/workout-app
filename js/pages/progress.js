/* pages/progress.js — partly built. Shows banked stats + your
   current logged weights. Charting over time is the next step. */
import { state } from '../store.js';

export function render(view) {
  const weights = Object.entries(state.weights)
    .filter(([, v]) => v != null)
    .map(([k, v]) => ({ name: k.replace(/^w:/, ''), val: v }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const unit = state.settings.units || 'lb';

  view.innerHTML = `
    <div class="page-head"><h1>Progress</h1><p>Your numbers over the whole journey.</p></div>

    <div class="grid2" style="margin-bottom:14px;">
      <div class="stat"><div class="l">Workouts banked</div><div class="n accent">${state.total}</div></div>
      <div class="stat"><div class="l">Weeks completed</div><div class="n">${state.weeksDone}</div></div>
    </div>

    <div class="card">
      <h2>Current working weights</h2>
      ${weights.length
        ? `<table class="data"><thead><tr><th>Exercise</th><th>Weight</th></tr></thead><tbody>${weights.map((w) => `<tr><td>${w.name}</td><td><b>${w.val} ${unit}</b></td></tr>`).join('')}</tbody></table>`
        : `<p class="muted">Log a weight on any strength exercise and it'll show up here.</p>`}
    </div>

    <div class="stub">
      <b>TODO — the fun part:</b> chart weight-per-exercise over time. Right now the store only keeps your <i>latest</i> weight per move. To graph trends you'll want to log a <code>{ ts, exercise, weight }</code> entry each session (similar to how <code>history</code> works), then draw it. Easiest path: add <a href="https://www.chartjs.org/" target="_blank" rel="noopener" style="color:var(--cool)">Chart.js</a> via a <code>&lt;script&gt;</code> tag and render a line chart here.
    </div>`;
}
