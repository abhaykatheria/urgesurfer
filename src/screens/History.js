import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, formatDate, trackedUrges } from '../util';

export default function History() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => filter === 'all' ? s.log : s.log.filter(r => r.u === filter),
    [filter, s.log]
  );

  const { dates, groups } = useMemo(() => {
    const g = {};
    filtered.forEach(r => { (g[r.date] = g[r.date] || []).push(r); });
    return { groups: g, dates: Object.keys(g).sort().reverse() };
  }, [filtered]);

  const filterPills = [{ id: 'all', label: 'All', emoji: '∞' }, ...trackedUrges(s)];

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 24, right: 24,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Press onPress={() => set({ screen: 'home' })} style={{
          width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.Back s={20} c={t.ink} />
        </Press>
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.ink }}>History</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ position: 'absolute', top: insets.top + 60, left: 24, right: 24 }}>
        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>All time</Text>
        <Text style={{ fontFamily: FONTS.display, fontSize: 38, letterSpacing: -1, fontWeight: '300', marginTop: 4, color: t.ink }}>
          {filtered.length} <Text style={{ fontStyle: 'italic', fontSize: 22, color: t.inkSoft }}>urges logged</Text>
        </Text>
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ position: 'absolute', top: insets.top + 150, left: 0, right: 0 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 6 }}
      >
        {filterPills.map(u => {
          const on = u.id === filter;
          return (
            <Press key={u.id} onPress={() => setFilter(u.id)} style={{
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

      <ScrollView
        style={{ position: 'absolute', top: insets.top + 200, left: 0, right: 0, bottom: 0 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 40 }}
      >
        {dates.map(date => {
          const rows = groups[date];
          const ok = rows.filter(r => r.ok).length;
          return (
            <View key={date} style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <Text style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: '400', letterSpacing: -0.3, color: t.ink }}>
                  {formatDate(date)}
                </Text>
                <Text style={{ fontSize: 11, color: t.mute, ...mono }}>{ok}/{rows.length} rode</Text>
              </View>
              {rows.map((row, i) => {
                const u = findUrge(s, row.u);
                return (
                  <View key={i} style={{
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: t.line,
                  }}>
                    <Text style={{ width: 42, fontSize: 11, color: t.mute, ...mono }}>{row.t}</Text>
                    <Text style={{ width: 24, fontSize: 16 }}>{u?.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: t.ink }}>{u?.label || row.u}</Text>
                      <Text style={{ fontSize: 11, color: t.mute, marginTop: 1 }}>
                        {(row.trigger || '—')} · i{row.intensity}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: row.ok ? t.kelp : t.coral }} />
                      <Text style={{ fontSize: 12, color: row.ok ? t.kelpDk : t.coral, ...mono }}>{row.r}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
        {dates.length === 0 && (
          <Text style={{ textAlign: 'center', color: t.mute, marginTop: 40, fontSize: 14 }}>
            No entries yet.
          </Text>
        )}
      </ScrollView>
    </Shell>
  );
}
