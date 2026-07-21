/* pages/profile.js — editable profile. Inputs write straight to
   state.profile and save() on change. Same store, same pattern. */
import { state, save } from '../store.js';

export function render(view) {
  const p = state.profile;

  view.innerHTML = `
    <div class="page-head"><h1>Profile</h1><p>Who this plan is built for. Changes save as you type.</p></div>

    <div class="card">
      <h2>Your details</h2>
      <div id="fields"></div>
    </div>

    <div class="card">
      <h2>Goals</h2>
      <p class="muted">Lean out to your target range, build a strong back and toned arms, keep it sustainable with two kids and a job. Priority muscles: <b style="color:#d7cfe6;">back &amp; arms</b>.</p>
    </div>`;

  const fields = view.querySelector('#fields');

  // [key, label, type]
  const rows = [
    ['name', 'Name', 'text'],
    ['height', 'Height', 'text'],
    ['startWeight', 'Starting weight (lb)', 'number'],
    ['goalLow', 'Goal low (lb)', 'number'],
    ['goalHigh', 'Goal high (lb)', 'number'],
  ];

  rows.forEach(([key, label, type]) => {
    const row = document.createElement('div');
    row.className = 'toggle'; // reuses the spaced row style
    row.innerHTML = `
      <div><div class="t-l">${label}</div></div>
      <input type="${type}" value="${p[key] ?? ''}" ${type === 'number' ? 'inputmode="decimal"' : ''}
        style="width:130px;height:36px;border-radius:8px;border:1px solid var(--line);background:var(--ink);color:var(--text);text-align:right;padding:0 10px;font-family:'Space Grotesk',sans-serif;font-size:16px;">`;
    const input = row.querySelector('input');
    input.addEventListener('change', () => {
      // numbers get stored as numbers, text as text
      p[key] = type === 'number' ? (parseFloat(input.value) || 0) : input.value;
      save();
    });
    fields.appendChild(row);
  });
}