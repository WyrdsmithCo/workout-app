/* ============================================================
   store.js — the single source of truth
   ------------------------------------------------------------
   In the artifact we used window.storage (an async sandbox API).
   In a real browser we use localStorage: synchronous, per-origin,
   persists until cleared. Every module imports the SAME `state`
   object (modules are singletons), mutates it, then calls save().
   subscribe() lets pages react when data changes.

   NEXT STEP (full-stack): swap these read/write functions for
   fetch() calls to a backend API + database, and this file becomes
   your data layer. The rest of the app won't need to change.
   ============================================================ */

const KEY = 'momentum-workout-v1';
const listeners = [];

function fresh() {
  return {
    phase: 1,
    week: 1,
    weights: {},        // { "w:Exercise name": number }
    checks: {},         // { "p1-Mon-2-0": true }   completed items this week
    counted: {},        // { "c:Mon": true }        day already banked this week
    swaps: {},          // { itemId: variantIndex }
    walk: [false, false, false, false, false, false, false],
    walkCounted: false,
    total: 0,           // lifetime workouts banked
    weeksDone: 0,       // lifetime weeks completed
    history: [],        // [{ ts, phase, week, day, title }]
    weightLog: [],      // [{ ts, exercise, weight }] — one entry per logged weight
    settings: { units: 'lb', sound: true },
    profile: {
      name: 'Chelsea',
      height: `5'5"`,
      startWeight: 170,
      goalLow: 150,
      goalHigh: 165,
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const saved = JSON.parse(raw);
    // merge onto fresh() so new fields added in future versions don't break old saves
    return Object.assign(fresh(), saved, {
      settings: Object.assign(fresh().settings, saved.settings || {}),
      profile: Object.assign(fresh().profile, saved.profile || {}),
    });
  } catch (e) {
    console.warn('Could not read saved data, starting fresh.', e);
    return fresh();
  }
}

export const state = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Save failed', e);
  }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.push(fn);
}

export function resetAll() {
  const blank = fresh();
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, blank);
  save();
}
