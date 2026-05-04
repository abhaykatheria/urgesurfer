import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Icon } from '../components/Icon';
import Tabs from '../components/Tabs';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { trackedUrges, streakDays } from '../util';

// Heatmap covers 6a–9p (16 hourly buckets) × 7 days (M-first).
const HEAT_HOUR_START = 6;
const HEAT_HOUR_COUNT = 16;

export default function Stats() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const rate = s.counts[s.urgeId]
    ? Math.round((s.rides[s.urgeId] / s.counts[s.urgeId]) * 100)
    : 0;

  // Real-data heatmap + triggers, scoped to the currently selected urge.
  const { heat, maxHeat, topTriggers } = useMemo(() => {
    const log = s.log.filter(r => r.u === s.urgeId);

    const heat = Array.from({ length: 7 }, () => Array(HEAT_HOUR_COUNT).fill(0));
    log.forEach(r => {
      if (!r.date || !r.t) return;
      const d = new Date(r.date + 'T00:00:00');
      if (isNaN(d.getTime())) return;
      const dayIdx = (d.getDay() + 6) % 7; // shift so Monday is row 0
      const hour = parseInt(r.t.slice(0, 2), 10);
      const col = hour - HEAT_HOUR_START;
      if (col < 0 || col >= HEAT_HOUR_COUNT) return;
      heat[dayIdx][col]++;
    });
    const maxHeat = Math.max(0, ...heat.flat());

    const trigCounts = {};
    let trigTotal = 0;
    log.forEach(r => {
      if (!r.trigger) return;
      trigCounts[r.trigger] = (trigCounts[r.trigger] || 0) + 1;
      trigTotal++;
    });
    const topTriggers = Object.entries(trigCounts)
      .map(([name, count]) => ({ t: name, pct: Math.round((count / trigTotal) * 100), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return { heat, maxHeat, topTriggers };
  }, [s.log, s.urgeId]);

  const heatLevel = (count) => {
    if (count === 0 || maxHeat === 0) return 0;
    const ratio = count / maxHeat;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5)  return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };
  const hc = (v) => v === 0 ? t.sandDk
    : v === 1 ? 'rgba(74,107,110,0.25)'
    : v === 2 ? 'rgba(74,107,110,0.50)'
    : v === 3 ? 'rgba(74,107,110,0.75)'
    : t.kelp;

  const cards = [
    { k: 'Streak',  v: `${streakDays(s, s.urgeId)}`, u: 'd' },
    { k: 'Ridden',  v: `${s.rides[s.urgeId] || 0}/${s.counts[s.urgeId] || 0}`, u: '' },
    { k: 'Success', v: `${rate}`, u: '%' },
  ];

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 24, right: 24,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <View>
          <Text style={{ fontFamily: FONTS.display, fontSize: 38, letterSpacing: -1, fontWeight: '300', color: t.ink }}>
            Your patterns.
          </Text>
        </View>
        <Press onPress={() => set({ screen: 'history' })} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 11, letterSpacing: 1.2, color: t.kelp, fontWeight: '500' }}>History</Text>
          <Icon.ArrowRight s={12} c={t.kelp} />
        </Press>
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ position: 'absolute', top: insets.top + 110, left: 0, right: 0 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 6 }}
      >
        {trackedUrges(s).slice(0, 6).map(u => {
          const on = u.id === s.urgeId;
          return (
            <Press key={u.id} onPress={() => set({ urgeId: u.id })} style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
              backgroundColor: on ? t.ink : 'transparent',
              borderWidth: on ? 0 : 0.5, borderColor: t.lineStr,
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}>
              <Text style={{ fontSize: 12 }}>{u.emoji}</Text>
              <Text style={{ fontSize: 12, color: on ? t.sand : t.inkSoft }}>{u.label}</Text>
            </Press>
          );
        })}
      </ScrollView>

      <View style={{
        position: 'absolute', top: insets.top + 160, left: 24, right: 24,
        flexDirection: 'row', gap: 10,
      }}>
        {cards.map((x, i) => (
          <View key={i} style={{ flex: 1, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: t.line }}>
            <Text style={{ fontSize: 10, letterSpacing: 1.8, color: t.mute, textTransform: 'uppercase' }}>{x.k}</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 26, lineHeight: 28, marginTop: 4, fontWeight: '300', color: t.ink, ...mono }}>
              {x.v}{x.u ? <Text style={{ fontSize: 13, color: t.mute, marginLeft: 2, fontFamily: FONTS.body }}>{x.u}</Text> : null}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', top: insets.top + 270, left: 24, right: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 11, letterSpacing: 1.8, color: t.mute, textTransform: 'uppercase' }}>Urge pattern · by hour</Text>
          <Text style={{ fontSize: 11, color: t.muteLo, ...mono }}>6a → 10p</Text>
        </View>
        <View style={{ gap: 3 }}>
          {heat.map((row, r) => (
            <View key={r} style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              <Text style={{ width: 16, fontSize: 9, color: t.mute, ...mono }}>
                {['M','T','W','T','F','S','S'][r]}
              </Text>
              {row.map((v, c) => (
                <View key={c} style={{ flex: 1, height: 14, borderRadius: 1, backgroundColor: hc(heatLevel(v)) }} />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={{ position: 'absolute', top: insets.top + 425, left: 24, right: 24 }}>
        <Text style={{ fontSize: 11, letterSpacing: 1.8, color: t.mute, textTransform: 'uppercase', marginBottom: 10 }}>Top triggers</Text>
        {topTriggers.length === 0 ? (
          <Text style={{ fontSize: 13, color: t.muteLo, fontStyle: 'italic' }}>
            Log a few surfs with triggers to see patterns here.
          </Text>
        ) : topTriggers.map((tg, i) => (
          <View key={i} style={{ marginBottom: 7 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
              <Text style={{ fontSize: 13, color: t.ink }}>{tg.t}</Text>
              <Text style={{ fontSize: 12, color: t.mute, ...mono }}>{tg.pct}%</Text>
            </View>
            <View style={{ height: 3, borderRadius: 1.5, backgroundColor: t.sandDk }}>
              <View style={{ width: `${tg.pct}%`, height: 3, borderRadius: 1.5, backgroundColor: t.kelp }} />
            </View>
          </View>
        ))}
      </View>

      <Tabs />
    </Shell>
  );
}
