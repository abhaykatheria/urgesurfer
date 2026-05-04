import { URGE_CATALOG } from './constants';

export function fmtTime(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDate(iso) {
  const t = today();
  const d = new Date(iso + 'T00:00:00');
  const now = new Date();
  const yIso = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  if (iso === t) return 'Today';
  if (iso === yIso) return 'Yesterday';
  const diff = Math.floor((new Date(t) - d) / 86400000);
  const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
  if (diff < 7) return weekday;
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return `${mo} ${d.getDate()}`;
}

export function trackedUrges(s) {
  const set = new Set(s.tracked);
  return (s.catalog || URGE_CATALOG).filter(u => set.has(u.id));
}

export function allUrges(s) {
  return s.catalog || URGE_CATALOG;
}

export function findUrge(s, id) {
  return allUrges(s).find(u => u.id === id);
}

export function greetingFor(date = new Date()) {
  const hr = date.getHours();
  if (hr < 5)  return 'Hey';
  if (hr < 12) return 'Morning';
  if (hr < 17) return 'Afternoon';
  if (hr < 22) return 'Evening';
  return 'Hey';
}

// Pure transition for "surf complete". Used both by Timer (auto + manual) and
// by state hydration when a persisted timer expired while the app was closed.
export function completeSurfState(prev, durationOverride) {
  const u = prev.urgeId;
  const dur = durationOverride ?? prev.duration;
  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  return {
    ...prev,
    remaining: 0, running: false, endTime: null, screen: 'success',
    counts:  { ...prev.counts,  [u]: (prev.counts[u]  || 0) + 1 },
    rides:   { ...prev.rides,   [u]: (prev.rides[u]   || 0) + 1 },
    // streak is computed from log via streakDays(); no longer stored here.
    log: [{
      date: today(), t: nowHM(), u,
      r: `Rode ${fmt(dur)}`,
      dur, ok: true,
      intensity: prev.intensity, trigger: prev.trigger || null,
    }, ...prev.log].slice(0, 50),
  };
}

// remaining seconds, derived from absolute endTime.
export function remainingFromEnd(endTime) {
  if (!endTime) return 0;
  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

// "Streak days" for a given urge = whole days elapsed since the most recent
// cave entry for that urge. If the user has never caved, it counts from the
// earliest log entry. No log at all → 0. Caved today → 0.
export function streakDays(s, urgeId) {
  if (!urgeId || !s?.log?.length) return 0;
  const entries = s.log.filter(r => r.u === urgeId);
  if (entries.length === 0) return 0;
  const lastCave = entries.find(r => r.ok === false);
  const anchorIso = lastCave ? lastCave.date : entries[entries.length - 1].date;
  const anchor = new Date(anchorIso + 'T00:00:00');
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((todayMid - anchor) / 86400000));
}
