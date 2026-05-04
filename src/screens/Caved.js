import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Primary, Ghost } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, today as todayIso, nowHM } from '../util';

export default function Caved() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const urge = findUrge(s, s.urgeId) || { label: 'urge' };
  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <Shell>
      <Press onPress={() => set({ screen: 'home' })}
        style={{ position: 'absolute', top: insets.top + 14, left: 18, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Back s={20} c={t.mute} />
      </Press>

      <View style={{ position: 'absolute', top: insets.top + 70, left: 32, right: 32 }}>
        <Text style={{ fontSize: 11, letterSpacing: 3, color: t.mute, textTransform: 'uppercase' }}>No shame</Text>
        <Text style={{
          fontFamily: FONTS.display, fontSize: 48, lineHeight: 56, letterSpacing: -1.2,
          fontWeight: '300', marginTop: 14, color: t.ink,
        }}>
          Noticing counts.
        </Text>
        <Text style={{ fontSize: 15, color: t.inkSoft, marginTop: 18, lineHeight: 23 }}>
          You surfed{' '}
          <Text style={{ color: t.ink, fontWeight: '500', ...mono }}>{fmt(s.caveTime)}</Text>
          {' '}before the {urge.label.toLowerCase()} wave caught you. That's awareness you didn't have last week.
        </Text>
      </View>

      {s.trigger && (
        <View style={{
          position: 'absolute', top: insets.top + 310, left: 24, right: 24,
          padding: 16, borderRadius: 16, backgroundColor: t.sandDim,
        }}>
          <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase', marginBottom: 6 }}>
            Trigger
          </Text>
          <Text style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: '300', color: t.ink, letterSpacing: -0.4 }}>
            {s.trigger}
          </Text>
        </View>
      )}

      <View style={{ position: 'absolute', bottom: insets.bottom + 30, left: 24, right: 24, gap: 10 }}>
        <Primary onPress={() => set(prev => {
          const u = prev.urgeId;
          return {
            ...prev, screen: 'home',
            running: false, endTime: null,
            counts: { ...prev.counts, [u]: (prev.counts[u] || 0) + 1 },
            log: [{
              date: todayIso(), t: nowHM(), u,
              r: `Caved ${fmt(prev.caveTime)}`,
              dur: prev.caveTime, ok: false,
              intensity: prev.intensity, trigger: prev.trigger || null,
            }, ...prev.log].slice(0, 50),
          };
        })}>Log & reset</Primary>
        <Ghost onPress={() => set({
          remaining: s.duration, running: true,
          endTime: Date.now() + s.duration * 1000,
          screen: 'timer',
        })}>Try again</Ghost>
      </View>
    </Shell>
  );
}
