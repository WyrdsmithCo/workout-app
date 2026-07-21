/* pages/progress.js — stats, current weights, and a weight-over-time chart. */
import { state } from '../store.js';

export function render(view) {
  const unit = state.settings.units || 'lb';

  // current (latest) weight per exercise, for the table
  const weights = Object.entries(state.weights)
    .filter(([, v]) => v != null)
    .map(([k, v]) => ({ name: k.replace(/^w:/, ''), val: v }))
    .sort((a, b) => a.name.localeCompare(b.name));

  view.innerHTML = `
    <div class="page-head"><h1>Progress</h1><p>Your numbers over the whole journey.</p></div>

    <div class="grid2" style="margin-bottom:14px;">
      <div class="stat"><div class="l">Workouts banked</div><div class="n accent">${state.total}</div></div>
      <div class="stat"><div class="l">Weeks completed</div><div class="n">${state.weeksDone}</div></div>
    </div>

    <div class="card">
      <h2>Weight over time</h2>
      <div id="chartWrap"><canvas id="wChart" height="220"></canvas></div>
      <div id="chartEmpty"></div>
    </div>

    <div class="card">
      <h2>Current working weights</h2>
      ${weights.length
        ? `<table class="data"><thead><tr><th>Exercise</th><th>Weight</th></tr></thead><tbody>${weights.map((w) => `<tr><td>${w.name}</td><td><b>${w.val} ${unit}</b></td></tr>`).join('')}</tbody></table>`
        : `<p class="muted">Log a weight on any strength exercise and it'll show up here.</p>`}
    </div>`;

  drawChart(view, unit);
}

function drawChart(view, unit) {
  const log = state.weightLog || [];

  // Need at least a couple of points to draw a line worth looking at.
  if (log.length < 2) {
    view.querySelector('#wChart').style.display = 'none';
    view.querySelector('#chartEmpty').innerHTML =
      `<p class="muted">Log weights across a few different sessions and your progress line will appear here. (Right now there ${log.length === 1 ? 'is 1 entry' : 'are 0 entries'}.)</p>`;
    return;
  }

  // Group the flat log into one line per exercise: { "Bicep curl": [{x,y}, ...] }
  const byExercise = {};
  log.forEach((e) => {
    (byExercise[e.exercise] = byExercise[e.exercise] || []).push({ x: e.ts, y: e.weight });
  });

  const palette = ['#37e0a0', '#ffb43d', '#ff7a3d', '#9d7bff', '#5bc6ff', '#7af0c6', '#ff9db0'];
  const datasets = Object.entries(byExercise).map(([name, points], i) => ({
    label: name,
    data: points.sort((a, b) => a.x - b.x),
    borderColor: palette[i % palette.length],
    backgroundColor: palette[i % palette.length],
    tension: 0.3,
    pointRadius: 3,
  }));

  const ctx = view.querySelector('#wChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: 'nearest' },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day' },
          ticks: { color: '#a59bbd' },
          grid: { color: 'rgba(255,255,255,.05)' },
        },
        y: {
          title: { display: true, text: unit, color: '#a59bbd' },
          ticks: { color: '#a59bbd' },
          grid: { color: 'rgba(255,255,255,.05)' },
        },
      },
      plugins: {
        legend: { labels: { color: '#f4f1f8', boxWidth: 12 } },
      },
    },
  });
}