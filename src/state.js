import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URGE_CATALOG } from './constants';
import { completeSurfState, remainingFromEnd } from './util';

const Ctx = createContext(null);

// Bump the suffix when changing the persisted shape in a non-backwards-compatible way.
const STORAGE_KEY = '@urge-surfer/state-v2';

// Fields written to disk. Ephemeral things (current modal, transient flags)
// are excluded. Timer fields ARE persisted so a backgrounded or killed app
// can resume the surf where it left off (or auto-complete it on relaunch).
const PERSIST_KEYS = [
  'name', 'catalog', 'tracked', 'urgeId', 'intensity',
  'streaks', 'counts', 'rides', 'log', 'photos',
  'duration', 'running', 'endTime',
];

function freshState() {
  return {
    screen: 'onboarding',
    name: '',
    catalog: URGE_CATALOG.slice(),
    tracked: [],
    urgeId: null,
    duration: 300,
    remaining: 300,
    running: false,
    endTime: null,
    caveTime: 0,
    intensity: 7,
    trigger: null,
    streaks: {},
    counts: {},
    rides: {},
    log: [],
    photos: [],         // saved victory selfies (persisted)
    currentPhoto: null, // URI of the in-flight capture (transient)
  };
}

export function AppProvider({ children }) {
  const sysScheme = useColorScheme();
  const [s, setS] = useState(freshState);
  const [theme, setTheme] = useState(sysScheme === 'dark' ? 'dark' : 'light');
  const [loaded, setLoaded] = useState(false);

  // Hydrate from AsyncStorage on first mount. Resolve any timer state we find:
  //   - active and not yet expired → drop user back into the timer screen
  //   - active but expired while away → run the success transition inline
  //   - no active timer → land on home
  //   - no persisted snapshot at all → onboarding (the freshState default)
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (!alive) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setS(prev => {
              const merged = { ...prev, ...parsed };
              if (merged.running && merged.endTime) {
                const remaining = remainingFromEnd(merged.endTime);
                if (remaining > 0) {
                  return { ...merged, screen: 'timer', remaining };
                }
                return completeSurfState(merged);
              }
              return { ...merged, screen: 'home', running: false, endTime: null };
            });
          } catch {
            // Corrupt payload — fall through to fresh state.
          }
        }
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => { alive = false; };
  }, []);

  // Write to disk whenever persisted slice changes. Skip until first hydrate
  // completes so we don't immediately overwrite saved state with defaults.
  const writeTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      const slim = {};
      PERSIST_KEYS.forEach(k => { slim[k] = s[k]; });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(slim)).catch(() => {});
    }, 150);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [loaded, s]);

  const set = useCallback((patch) => {
    setS(prev => typeof patch === 'function' ? patch(prev) : { ...prev, ...patch });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const addCustomUrge = useCallback(({ label, emoji }) => {
    const id = 'cust_' + Date.now().toString(36);
    setS(prev => ({
      ...prev,
      catalog: [...prev.catalog, { id, label, emoji, custom: true }],
      streaks: { ...prev.streaks, [id]: 0 },
      counts:  { ...prev.counts,  [id]: 0 },
      rides:   { ...prev.rides,   [id]: 0 },
    }));
    return id;
  }, []);

  const value = useMemo(
    () => ({ s, set, theme, toggleTheme, addCustomUrge, loaded }),
    [s, set, theme, toggleTheme, addCustomUrge, loaded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp used outside AppProvider');
  return v;
}
