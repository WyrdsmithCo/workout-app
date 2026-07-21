/* ============================================================
   pages/today.js — the guided workout (the heart of the app)
   Ported from the single-file artifact. Differences:
     - reads/writes the shared `state` + save() (localStorage)
     - pulls all workout data from data/program.js
     - drives the rest-timer + modal that live in index.html
   ============================================================ */
import { state, save } from '../store.js';
import { PROGRAMS, L, CARD, PHASELEN, PHASENAME, PHASEDESC, FULL, progressionTip } from '../data/program.js';

const C = { warm:'var(--warm)', act:'var(--act)', cardio:'var(--cardio)', str:'var(--str)', cool:'var(--cool)' };
const DAY_OF_WEEK = { 1:'Mon', 3:'Wed', 5:'Fri', 6:'Sat' };

let root = null;
let active = null;
let wired = false;

export function render(view) {
  root = view;
  if (!active) active = DAY_OF_WEEK[new Date().getDay()] || 'Mon';
  wireGlobals();
  paint();
}

/* ---------- helpers over state ---------- */
const prog = () => PROGRAMS[state.phase];
function variant(item, slotId) {
  const list = [item].concat((item.alts || []).map((a) => Object.assign({}, item, a, { alts: undefined })));
  const idx = (state.swaps[slotId] || 0) % list.length;
  return { v: list[idx], count: list.length };
}
const keyOf = (day, si, ii) => `p${state.phase}-${day}-${si}-${ii}`;
function dayItems(day) {
  const out = [];
  prog().days[day].sections.forEach((s, si) => s.items.forEach((it, ii) => out.push({ it, id: keyOf(day, si, ii), req: !it.opt })));
  return out;
}
function dayProgress(day) {
  const items = dayItems(day).filter((x) => x.req);
  const done = items.filter((x) => state.checks[x.id]).length;
  return { done, total: items.length };
}
function dayComplete(day) { const p = dayProgress(day); return p.total > 0 && p.done === p.total; }
function sessionsThisWeek() { return prog().order.filter((d) => dayComplete(d)).length; }
const ytLink = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' proper form tutorial');

/* ---------- render ---------- */
function paint() {
  const sw = sessionsThisWeek();
  root.innerHTML = `
    <div class="kt-top">
      <div><div class="kt-title">Today's Workout</div><div class="kt-sub">dumbbells · kettlebells · bag · mat</div></div>
      <div class="kt-bank"><div class="n" id="bank">${state.total}</div><div class="l">workouts done</div></div>
    </div>
    <div class="kt-phasestrip">
      <button class="kt-phasebtn" id="phaseBtn" type="button"><span class="pl">Phase</span><span class="pv">${state.phase} <small>${PHASENAME[state.phase]}</small></span></button>
      <button class="kt-phasebtn kt-weekbtn" id="weekBtn" type="button"><span class="pl">Progress</span><span class="pv">Week ${state.week}<small> of ${PHASELEN[state.phase]} · ${sw}/4 done</small></span></button>
    </div>
    <div class="kt-banner">${progressionTip(state.phase, state.week)}</div>
    <div class="kt-tabs" id="tabs"></div>
    <div id="day"></div>
    <button class="kt-advance" id="advance" type="button"></button>
    <button class="kt-reset" id="resetDay" type="button">↻ Reset this day's checkmarks</button>
    <div class="kw-sech">Every week · all days</div>
    <div id="walkWeek"></div>`;

  const today = DAY_OF_WEEK[new Date().getDay()];
  const tabs = root.querySelector('#tabs');
  prog().order.forEach((d) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kt-tab' + (d === active ? ' active' : '');
    const done = dayComplete(d);
    b.innerHTML = `<span class="d">${d}</span><span class="f">${prog().days[d].focus.split('·')[0].trim()}</span>` +
      (done ? '<span class="today">✓ done</span>' : (d === today ? '<span class="today">Today</span>' : ''));
    b.addEventListener('click', () => { active = d; paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    tabs.appendChild(b);
  });

  renderDay();
  renderAdvance();
  renderWalk();

  root.querySelector('#phaseBtn').addEventListener('click', openPhaseSwitch);
  root.querySelector('#weekBtn').addEventListener('click', openWeekInfo);
  root.querySelector('#resetDay').addEventListener('click', () => {
    dayItems(active).forEach((x) => { delete state.checks[x.id]; });
    state.counted['c:' + active] = false; save(); paint();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function renderAdvance() {
  const b = root.querySelector('#advance');
  const sw = sessionsThisWeek();
  const ready = sw >= 3;
  const last = state.week >= PHASELEN[state.phase];
  b.className = 'kt-advance' + (ready ? ' ready' : '');
  if (last && ready) b.textContent = `🏁 Phase ${state.phase} complete — see what's next`;
  else if (ready) b.textContent = `✓ Week ${state.week} done — start Week ${state.week + 1}`;
  else b.textContent = `Start next week (you've done ${sw}/4 — finish more first?)`;
  b.onclick = advance;
}

function renderDay() {
  const day = prog().days[active];
  const wrap = root.querySelector('#day');
  wrap.innerHTML = '';
  const pr = dayProgress(active);
  const pct = Math.round((pr.done / pr.total) * 100);
  const head = document.createElement('div');
  head.className = 'kt-dayhead';
  head.innerHTML = `<h2>${FULL[active]} — ${day.title}</h2>
    <div class="meta"><span>🎯 <b>${day.focus}</b></span><span>⏱ Est. <b>~${day.min} min</b></span></div>
    <div class="kt-progwrap"><div class="kt-progbar"><div class="kt-progfill" style="width:${pct}%"></div></div>
    <div class="kt-progtxt">${pr.done} of ${pr.total} steps · ${pct}%</div></div>`;
  wrap.appendChild(head);
  if (day.note) { const n = document.createElement('div'); n.className = 'kt-note'; n.innerHTML = day.note; wrap.appendChild(n); }
  day.sections.forEach((s, si) => {
    const box = document.createElement('div');
    box.className = 'kt-sec';
    box.innerHTML = `<div class="kt-sec-h"><span class="kt-sec-dot" style="background:${C[s.type]}"></span><span class="kt-sec-t" style="color:${C[s.type]}">${s.title}</span><span class="kt-sec-min">~${s.min} min</span></div>`;
    s.items.forEach((it, ii) => {
      const id = keyOf(active, si, ii);
      box.appendChild(it.simple ? simpleRow(it, id) : it.cardio ? cardioRow(it, id) : strengthRow(it, id));
    });
    wrap.appendChild(box);
  });
}

function checkHeader(id, inner) {
  const el = document.createElement('div');
  el.innerHTML = `<div class="kt-row-main"><span class="kt-box"><svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6"/></svg></span><div class="kt-body">${inner}</div></div>`;
  el.querySelector('.kt-row-main').addEventListener('click', (e) => {
    if (e.target.closest('.kt-tools') || e.target.closest('.kt-wt') || e.target.closest('a') || e.target.closest('button')) return;
    toggle(id);
  });
  return el;
}
const optTag = (it) => (it.opt ? '<span class="opttag">optional</span>' : '');

function simpleRow(it, id) {
  const row = document.createElement('div');
  row.className = 'kt-row' + (state.checks[id] ? ' done' : '') + (it.opt ? ' opt' : '');
  row.appendChild(checkHeader(id, `<div class="kt-name">${it.name}${optTag(it)}</div><div class="kt-detail">${it.detail || ''}</div>`));
  if (it.time) {
    const t = document.createElement('div'); t.className = 'kt-tools';
    const b = document.createElement('button'); b.className = 'kt-btn rest'; b.type = 'button'; b.textContent = '⏱ ' + fmt(it.time);
    b.addEventListener('click', () => startTimer(it.time, it.name)); t.appendChild(b); row.appendChild(t);
  }
  return row;
}
function cardioRow(it, id) {
  const row = document.createElement('div');
  row.className = 'kt-row' + (state.checks[id] ? ' done' : '') + (it.opt ? ' opt' : '');
  row.appendChild(checkHeader(id, `<div class="kt-name">${it.name}${optTag(it)}</div><div class="kt-chips"><span class="kt-chip">⏱ <b>${it.dur}</b></span><span class="kt-chip">🔥 ${it.intensity}</span></div><div class="kt-cue"><span class="tag">Tip: </span>${it.recs}</div>`));
  const t = document.createElement('div'); t.className = 'kt-tools';
  if (it.yt) { const a = document.createElement('a'); a.className = 'kt-btn form'; a.href = ytLink(it.yt); a.target = '_blank'; a.rel = 'noopener'; a.textContent = '▶ Watch form'; t.appendChild(a); }
  if (it.time) { const b = document.createElement('button'); b.className = 'kt-btn rest'; b.type = 'button'; b.textContent = '⏱ Timer ' + fmt(it.time); b.addEventListener('click', () => startTimer(it.time, it.name)); t.appendChild(b); }
  row.appendChild(t);
  return row;
}
function strengthRow(it, id) {
  const { v, count } = variant(it, id);
  const row = document.createElement('div');
  row.className = 'kt-row' + (state.checks[id] ? ' done' : '') + (it.opt ? ' opt' : '');
  let chips = `<span class="kt-chip"><b>${v.sets}</b> sets</span><span class="kt-chip"><b>${v.reps}</b> reps</span>`;
  if (v.rest) chips += `<span class="kt-chip">rest <b>${v.rest}s</b></span>`;
  if (v.tempo) chips += `<span class="kt-chip">tempo <b>${v.tempo}</b></span>`;
  row.appendChild(checkHeader(id, `<div class="kt-name">${v.name}${optTag(it)}</div><div class="kt-chips">${chips}</div><div class="kt-cue"><span class="tag">Form: </span>${v.cue}</div>${v.mod ? `<div class="kt-mod">💡 ${v.mod}</div>` : ''}`));
  if (v.weight) {
    const wkey = 'w:' + v.name;
    const cur = state.weights[wkey];
    const unit = state.settings.units || 'lb';
    const wt = document.createElement('div'); wt.className = 'kt-wt';
    wt.innerHTML = `<label>Weight</label><button class="kt-step" type="button" data-a="-">−</button><input type="number" inputmode="decimal" value="${cur != null ? cur : ''}" placeholder="—"><span class="unit">${unit}</span>${cur != null ? `<span class="kt-last">last: ${cur} ${unit} — beat it</span>` : ''}`;
    const input = wt.querySelector('input');
    wt.querySelector('[data-a="-"]').addEventListener('click', () => { input.value = Math.max(0, (parseFloat(input.value) || 0) - 2.5); saveWt(wkey, input.value); });
    const plus = document.createElement('button'); plus.className = 'kt-step'; plus.type = 'button'; plus.textContent = '+';
    plus.addEventListener('click', () => { input.value = (parseFloat(input.value) || 0) + 2.5; saveWt(wkey, input.value); });
    wt.insertBefore(plus, wt.querySelector('.unit'));
    input.addEventListener('change', () => saveWt(wkey, input.value));
    row.appendChild(wt);
  }
  const t = document.createElement('div'); t.className = 'kt-tools';
  const yt = document.createElement('a'); yt.className = 'kt-btn form'; yt.href = ytLink(v.name); yt.target = '_blank'; yt.rel = 'noopener'; yt.textContent = '▶ Watch form'; t.appendChild(yt);
  if (v.rest) { const r = document.createElement('button'); r.className = 'kt-btn rest'; r.type = 'button'; r.textContent = '⏱ Rest ' + v.rest + 's'; r.addEventListener('click', () => startTimer(v.rest, 'Rest — ' + v.name)); t.appendChild(r); }
  else if (v.time) { const r = document.createElement('button'); r.className = 'kt-btn rest'; r.type = 'button'; r.textContent = '⏱ ' + fmt(v.time); r.addEventListener('click', () => startTimer(v.time, v.name)); t.appendChild(r); }
  if (count > 1) { const sw = document.createElement('button'); sw.className = 'kt-btn'; sw.type = 'button'; sw.textContent = '⇄ Swap'; sw.addEventListener('click', () => { state.swaps[id] = ((state.swaps[id] || 0) + 1) % count; save(); renderDay(); }); t.appendChild(sw); }
  const wy = document.createElement('button'); wy.className = 'kt-btn'; wy.type = 'button'; wy.textContent = 'ⓘ Why';
  const why = document.createElement('div'); why.className = 'kt-why'; why.innerHTML = `<b>Why it's here:</b> ${v.why}<br><b>Muscles worked:</b> ${v.muscles}`;
  wy.addEventListener('click', () => why.classList.toggle('open')); t.appendChild(wy);
  row.appendChild(t); row.appendChild(why);
  return row;
}
function saveWt(k, val) { const n = parseFloat(val); state.weights[k] = isNaN(n) ? null : n; save(); renderDay(); }

function toggle(id) {
  state.checks[id] = !state.checks[id];
  const done = dayComplete(active);
  const ck = 'c:' + active;
  if (done && !state.counted[ck]) {
    state.counted[ck] = true; state.total++;
    state.history.push({ ts: Date.now(), phase: state.phase, week: state.week, day: active, title: prog().days[active].title });
    celebrate(); bump();
  } else if (!done && state.counted[ck]) {
    state.counted[ck] = false; state.total = Math.max(0, state.total - 1);
  }
  save(); paint();
}
function bump() { const n = root.querySelector('#bank'); if (!n) return; n.classList.remove('num-pop'); void n.offsetWidth; n.classList.add('num-pop'); }

/* ---------- week / phase progression ---------- */
function clearWeek() { state.checks = {}; state.counted = {}; state.walk = [false,false,false,false,false,false,false]; state.walkCounted = false; }
function nextWeek() { state.weeksDone++; clearWeek(); state.week++; save(); paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); celebrate(); }
function repeatWeek() { clearWeek(); save(); paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function goPhase(p) { state.weeksDone++; clearWeek(); state.phase = p; state.week = 1; save(); paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); celebrate(); }

function advance() {
  if (state.week < PHASELEN[state.phase]) { nextWeek(); return; }
  if (state.phase < 3) {
    openModal(`Phase ${state.phase} complete 🎉`,
      `You've done all ${PHASELEN[state.phase]} weeks of Phase ${state.phase} — ${PHASENAME[state.phase]}. Move up when your body's ready (form solid, feeling it), not just because the weeks are up.`,
      [
        { label: `Start Phase ${state.phase + 1} — ${PHASENAME[state.phase + 1]}`, primary: true, fn: () => goPhase(state.phase + 1) },
        { label: 'Not yet — run this week again', fn: repeatWeek },
      ]);
  } else {
    openModal('You finished the whole program 🏆',
      "That's all 3 phases done — a full transformation cycle. Keep the momentum: run Phase 3 again in maintenance, or drop back to Phase 2 to build more.",
      [
        { label: 'Repeat Phase 3 (maintain)', primary: true, fn: () => goPhase(3) },
        { label: 'Back to Phase 2 (build more)', fn: () => goPhase(2) },
      ]);
  }
}
function openPhaseSwitch() {
  const opts = [1, 2, 3].map((p) => ({
    label: `Phase ${p} — ${PHASENAME[p]}${p === state.phase ? ' (current)' : ''}`,
    sub: PHASEDESC[p], primary: p === state.phase,
    fn: () => { if (p !== state.phase) goPhase(p); },
  }));
  openModal('Switch phase', "Jump to any phase — best when your body's ready, not just the calendar. Switching resets the week and this week's checkmarks (your logged weights stay).", opts);
}
function openWeekInfo() {
  openModal(`Week ${state.week} · Phase ${state.phase}`,
    `You're on week ${state.week} of ${PHASELEN[state.phase]} in the ${PHASENAME[state.phase]} phase. ${state.weeksDone} weeks banked all-time. Finish your sessions and the week rolls over from the button on the workout.`,
    [{ label: 'Got it', primary: true, fn: () => {} }]);
}

/* ---------- walks ---------- */
function renderWalk() {
  const el = root.querySelector('#walkWeek');
  if (!el) return;
  const done = state.walk.filter(Boolean).length;
  const pct = Math.min(100, Math.round((done / 5) * 100));
  const labels = ['M','T','W','Th','F','Sa','Su'];
  el.className = 'kw-card' + (done >= 5 ? ' kw-hit' : '');
  el.innerHTML = `<div class="kw-top"><div><div class="kw-title">Walks</div><div class="kw-sub">Aim 7–8k steps <b>per day</b> · walk 5 days this week</div></div><div class="kw-count">${done}<span>/5</span></div></div><div class="kw-bar"><div class="kw-fill" style="width:${pct}%"></div></div><div class="kw-days" id="kwDays"></div>`;
  const row = el.querySelector('#kwDays');
  labels.forEach((d, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'kw-day'; b.textContent = d;
    b.setAttribute('aria-pressed', state.walk[i] ? 'true' : 'false'); b.setAttribute('aria-label', 'Walk on ' + d);
    b.addEventListener('click', () => toggleWalk(i)); row.appendChild(b);
  });
}
function toggleWalk(i) {
  state.walk[i] = !state.walk[i];
  const done = state.walk.filter(Boolean).length;
  if (done >= 5 && !state.walkCounted) { state.walkCounted = true; state.total++; celebrate(); bump(); }
  else if (done < 5 && state.walkCounted) { state.walkCounted = false; state.total = Math.max(0, state.total - 1); }
  save(); paint();
}

/* ---------- shell UI: timer + modal (wired once) ---------- */
let tRemain = 0, tInt = null;
function wireGlobals() {
  if (wired) return;
  wired = true;
  document.getElementById('rest-minus').addEventListener('click', () => { tRemain = Math.max(0, tRemain - 15); paintTimer(); });
  document.getElementById('rest-plus').addEventListener('click', () => { tRemain += 15; document.getElementById('rest-timer').classList.remove('zero'); paintTimer(); });
  document.getElementById('rest-skip').addEventListener('click', () => { clearInterval(tInt); document.getElementById('rest-timer').classList.remove('show'); });
  document.getElementById('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
}
const fmt = (s) => { const m = Math.floor(s / 60), ss = s % 60; return m + ':' + String(ss).padStart(2, '0'); };
function paintTimer() { document.getElementById('rest-num').textContent = fmt(Math.max(0, tRemain)); }
function startTimer(sec, label) {
  clearInterval(tInt); tRemain = sec;
  const el = document.getElementById('rest-timer');
  document.getElementById('rest-label').textContent = label; paintTimer();
  el.classList.remove('zero'); el.classList.add('show');
  tInt = setInterval(() => { tRemain--; paintTimer(); if (tRemain <= 0) { clearInterval(tInt); timerDone(); } }, 1000);
}
function timerDone() {
  const el = document.getElementById('rest-timer');
  el.classList.add('zero'); document.getElementById('rest-label').textContent = 'Go! Next set';
  beep(); buzz(); setTimeout(() => el.classList.remove('show'), 3500);
}
function beep() {
  if (!state.settings.sound) return;
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination); o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, a.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.5);
    o.start(); o.stop(a.currentTime + 0.5);
  } catch (e) { /* audio not available */ }
}
function buzz() { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); }

function openModal(title, body, actions) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  const box = document.getElementById('modal-actions'); box.innerHTML = '';
  actions.forEach((a) => {
    const b = document.createElement('button');
    b.className = 'kt-maction' + (a.primary ? ' primary' : '');
    b.type = 'button';
    b.innerHTML = a.label + (a.sub ? `<small>${a.sub}</small>` : '');
    b.addEventListener('click', () => { closeModal(); a.fn && a.fn(); });
    box.appendChild(b);
  });
  document.getElementById('modal').classList.add('show');
}
function closeModal() { document.getElementById('modal').classList.remove('show'); }

function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const colors = ['#37e0a0','#ffb43d','#ff7a3d','#9d7bff','#5bc6ff'];
  const layer = document.createElement('div'); layer.className = 'kt-burst'; layer.style.left = 0; layer.style.top = 0;
  document.body.appendChild(layer);
  const cx = window.innerWidth / 2, cy = window.innerHeight * 0.35;
  for (let k = 0; k < 40; k++) {
    const p = document.createElement('div'); p.className = 'kt-particle'; p.style.background = colors[k % colors.length];
    p.style.left = cx + 'px'; p.style.top = cy + 'px'; layer.appendChild(p);
    const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 160;
    p.animate(
      [{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist + 120}px) rotate(${Math.random() * 540}deg)`, opacity: 0 }],
      { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.15,.7,.3,1)' }
    );
  }
  setTimeout(() => layer.remove(), 1500);
}
