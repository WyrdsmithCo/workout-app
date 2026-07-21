/* pages/profile.js — displays the profile from the store.
   Editing fields is the intended next build. */
import { state } from '../store.js';

export function render(view) {
  const p = state.profile;
  view.innerHTML = `
    <div class="page-head"><h1>Profile</h1><p>Who this plan is built for.</p></div>

    <div class="card">
      <h2>${p.name}</h2>
      <table class="data" style="margin-top:6px;">
        <tbody>
          <tr><td>Height</td><td><b>${p.height}</b></td></tr>
          <tr><td>Starting weight</td><td><b>${p.startWeight} lb</b></td></tr>
          <tr><td>Goal range</td><td><b>${p.goalLow}–${p.goalHigh} lb</b></td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Goals</h2>
      <p class="muted">Lean out to the target range, build a strong back and toned arms, keep it sustainable with two kids and a job. Priority muscles: <b style="color:#d7cfe6;">back &amp; arms</b>.</p>
    </div>

    <div class="stub">
      <b>TODO:</b> make these fields editable — swap each value for an <code>&lt;input&gt;</code>, write changes to <code>state.profile</code>, and call <code>save()</code>. A weigh-in log (date + weight) would also feed a great chart on the Progress page.
    </div>`;
}
