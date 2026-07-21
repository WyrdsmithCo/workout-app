/* pages/library.js — browse every exercise. Fully working.
   Shows the payoff of keeping data separate: this whole page is
   just a view over data/program.js. */
import { L, CARD } from '../data/program.js';

const ytLink = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' proper form tutorial');

export function render(view) {
  const strength = Object.values(L);
  const cardio = Object.values(CARD).filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i);

  view.innerHTML = `
    <div class="page-head">
      <h1>Exercise Library</h1>
      <p>Every move in your program, with form cues and a link to see it done right.</p>
    </div>
    <input id="lib-search" class="kt-wt" style="display:block;width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--ink);color:var(--text);font-family:inherit;margin-bottom:16px;" placeholder="Search exercises or muscles…">
    <div id="lib-list"></div>`;

  const listEl = view.querySelector('#lib-list');
  const search = view.querySelector('#lib-search');

  function draw(q = '') {
    const term = q.toLowerCase();
    const match = (o) => !term || (o.name + ' ' + (o.muscles || '')).toLowerCase().includes(term);
    const sHits = strength.filter(match);
    const cHits = cardio.filter(match);
    listEl.innerHTML = '';

    if (sHits.length) {
      listEl.appendChild(sectionTitle('Strength'));
      sHits.forEach((ex) => listEl.appendChild(card(ex, true)));
    }
    if (cHits.length) {
      listEl.appendChild(sectionTitle('Cardio & Conditioning'));
      cHits.forEach((ex) => listEl.appendChild(card(ex, false)));
    }
    if (!sHits.length && !cHits.length) {
      listEl.innerHTML = `<p class="muted">No matches for “${q}”.</p>`;
    }
  }

  function sectionTitle(t) {
    const d = document.createElement('div');
    d.className = 'kw-sech'; d.style.color = 'var(--str)'; d.textContent = t;
    return d;
  }

  function card(ex, isStrength) {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `
      <h2>${ex.name}</h2>
      ${ex.muscles ? `<div class="kt-chips" style="margin-top:0;margin-bottom:8px;"><span class="kt-chip">${ex.muscles}</span>${ex.tempo ? `<span class="kt-chip">tempo <b>${ex.tempo}</b></span>` : ''}</div>` : ''}
      <p class="muted"><b style="color:#d7cfe6;">${isStrength ? 'Form' : 'Tip'}:</b> ${ex.cue || ex.recs}</p>
      ${ex.mod ? `<p class="muted" style="color:var(--cool);">💡 ${ex.mod}</p>` : ''}
      ${ex.why ? `<p class="muted" style="margin-top:6px;">${ex.why}</p>` : ''}
      <a class="kt-btn form" style="margin-top:10px;" href="${ytLink(ex.name)}" target="_blank" rel="noopener">▶ Watch form</a>`;
    return d;
  }

  search.addEventListener('input', () => draw(search.value));
  draw();
}
