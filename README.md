# Momentum — Workout App

A guided, phase-based workout tracker. Vanilla HTML/CSS/JS — no build step, no
framework. One page module per screen, a tiny hash router, and shared state in
`localStorage`.

## Run it locally (5 minutes)

You need a local server because the app uses ES modules (`import`/`export`),
which browsers block on `file://`. Easiest way in VS Code:

1. Open the `workout-app` folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
4. It opens at something like `http://127.0.0.1:5500` and reloads on save.

No VS Code? Any static server works, e.g. with Python:

```bash
cd workout-app
python3 -m http.server 5500
# then open http://localhost:5500
```

## Put it on GitHub (get the Git rep in)

```bash
cd workout-app
git init
git add .
git commit -m "Initial commit: Momentum workout app scaffold"

# make an empty repo on github.com first (no README), then:
git remote add origin https://github.com/<your-username>/momentum-workout.git
git branch -M main
git push -u origin main
```

Want it live on the web for free? In the repo on GitHub:
**Settings → Pages → Source: `main` / root → Save.** It'll publish at
`https://<your-username>.github.io/momentum-workout/`.

## How it's wired

```
index.html            shell: nav mount + <main> view + floating timer/modal
css/styles.css        all styles (shell + tracker)
js/
  app.js              entry — imports pages, boots router + nav
  router.js           hash router (#/today -> pages/today.render(view))
  store.js            state + localStorage (swap for an API later = full-stack)
  data/program.js     ALL workout data — exercises, cardio, the 3 phases
  components/nav.js    the sidebar links (edit the menu here, once)
  pages/
    home.js           dashboard (working)
    today.js          the guided workout (working — the big one)
    library.js        exercise library (working)
    history.js        completed-session log (working)
    settings.js       units / sound / clear data (working)
    progress.js       stats + weights table (partial — charting is TODO)
    calendar.js       month grid of trained days (partial — month nav TODO)
    profile.js        stats & goals (display — editing is TODO)
```

**To add a page:** create `js/pages/whatever.js` exporting `render(view)`,
add it to the imports + `routes` in `app.js`, and add a nav item in
`components/nav.js`. That's it.

**To change a workout:** edit `data/program.js`. Nothing else needs to change —
the Today page and the Library both read from it.

## Where to grow next (in rough order)

1. **Progress charting** — log `{ ts, exercise, weight }` per session, draw it with Chart.js.
2. **Calendar month navigation** + a streak counter.
3. **Editable profile** + a weigh-in log.
4. **Real lb↔kg conversion** in Settings.
5. **Backend + database** so data syncs across devices — this is the full-stack leap.
   `store.js` is the only file that would change.
