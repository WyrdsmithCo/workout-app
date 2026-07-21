/* nav.js — renders the sidebar links and marks the active one.
   Defined once; every page reuses it. Change the menu here only. */

export const NAV_ITEMS = [
  { id: 'home',     label: 'Home',              icon: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { id: 'today',    label: "Today's Workout",   icon: 'M6 3v4M18 3v4M4 9h16M5 5h14v16H5z' },
  { id: 'progress', label: 'Progress',          icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
  { id: 'calendar', label: 'Calendar',          icon: 'M6 3v4M18 3v4M4 9h16M5 5h14v16H5z M8 13h3v3H8z' },
  { id: 'library',  label: 'Exercise Library',  icon: 'M4 5h16M4 12h16M4 19h10' },
  { id: 'history',  label: 'Workout History',   icon: 'M12 8v5l3 2M3 12a9 9 0 1 0 3-6.7L3 8' },
  { id: 'settings', label: 'Settings',          icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2 1-2 4-2-1a7 7 0 0 1-2 1l-.5 2h-4L8 19a7 7 0 0 1-2-1l-2 1-2-4 2-1a7 7 0 0 1 0-2l-2-1 2-4 2 1a7 7 0 0 1 2-1l.5-2h4l.5 2a7 7 0 0 1 2 1l2-1 2 4-2 1a7 7 0 0 1 0 2z' },
  { id: 'profile',  label: 'Profile',           icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
];

export function renderNav(mount, activeId) {
  mount.innerHTML = '';
  NAV_ITEMS.forEach((item) => {
    const a = document.createElement('a');
    a.href = '#/' + item.id;
    a.className = item.id === activeId ? 'active' : '';
    a.innerHTML =
      `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${item.icon}"/></svg>` +
      `<span class="lbl">${item.label}</span>`;
    mount.appendChild(a);
  });
}
