/* pages/settings.js — real, working settings backed by the store. */
import { state, save, resetAll } from '../store.js';

export function render(view) {
  view.innerHTML = `
    <div class="page-head"><h1>Settings</h1><p>Preferences are saved to this browser.</p></div>

    <div class="card">
      <div class="toggle">
        <div><div class="t-l">Weight units</div><div class="t-s">Label shown next to weights</div></div>
        <button class="btn" id="units" type="button">${(state.settings.units || 'lb').toUpperCase()}</button>
      </div>
      <div class="toggle">
        <div><div class="t-l">Rest-timer sound</div><div class="t-s">Beep when a rest timer hits zero</div></div>
        <div class="switch" id="sound" role="switch" tabindex="0" aria-checked="${state.settings.sound}"></div>
      </div>
    </div>

    <div class="card">
      <h2>Data</h2>
      <p class="muted">Everything lives in this browser only. Clearing wipes your weights, history, and progress.</p>
      <button class="btn danger" id="wipe" type="button" style="margin-top:10px;">Clear all data</button>
    </div>

    <div class="stub">
      <b>TODO ideas:</b> real <code>lb↔kg</code> conversion (currently a label only), a data <b>export/import</b> to JSON, and moving storage to a backend so it syncs across devices — that's your full-stack step.
    </div>`;

  const unitsBtn = view.querySelector('#units');
  unitsBtn.addEventListener('click', () => {
    state.settings.units = (state.settings.units === 'lb') ? 'kg' : 'lb';
    save(); unitsBtn.textContent = state.settings.units.toUpperCase();
  });

  const sound = view.querySelector('#sound');
  const flip = () => { state.settings.sound = !state.settings.sound; sound.setAttribute('aria-checked', String(state.settings.sound)); save(); };
  sound.addEventListener('click', flip);
  sound.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });

  view.querySelector('#wipe').addEventListener('click', () => {
    if (confirm('Clear ALL saved data? This cannot be undone.')) { resetAll(); location.hash = '#/home'; }
  });
}
