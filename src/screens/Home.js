import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Primary } from '../components/Buttons';
import { Icon } from '../components/Icon';
import Tabs from '../components/Tabs';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, formatDate, today, greetingFor, trackedUrges, streakDays } from '../util';

export default function Home() {
  const { s, set, theme, toggleTheme } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const urge = findUrge(s, s.urgeId) || trackedUrges(s)[0];
  const urgeId = urge?.id || s.urgeId;
  const rides = s.rides[urgeId] || 0;
  const count = s.counts[urgeId] || 0;
  const streak = streakDays(s, urgeId);
  const successPct = count ? Math.round((rides / count) * 100) : 0;

  const greeting = greetingFor();
  const firstName = (s.name || 'friend').split(' ')[0];

  // Theme toggle anim
  const sunOpac = useRef(new Animated.Value(theme === 'light' ? 1 : 0)).current;
  const moonOpac = useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(sunOpac,  { toValue: theme === 'light' ? 1 : 0, duration: 250, useNativeDriver: true }),
      Animated.timing(moonOpac, { toValue: theme === 'dark'  ? 1 : 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [theme]);

  const topPad = insets.top + 12;

  return (
    <Shell>
      {/* Header */}
      <View style={{
        position: 'absolute', top: topPad, left: 24, right: 24,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 10, letterSpacing: 2.4, color: t.mute,
            textTransform: 'uppercase', marginBottom: 4, fontWeight: '500',
          }}>Urge Surfer</Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 28, fontWeight: '300',
            letterSpacing: -0.6, lineHeight: 30, color: t.ink,
          }}>
            {greeting}, <Text style={{ fontStyle: 'italic', color: t.kelp }}>{firstName}.</Text>
          </Text>
        </View>
        <Press onPress={toggleTheme} style={{
          width: 34, height: 34, borderRadius: 17, backgroundColor: t.sandDk,
          alignItems: 'center', justifyContent: 'center', marginTop: 4,
        }}>
          <View style={{ width: 18, height: 18 }}>
            <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: sunOpac }}>
              <Icon.Sun s={16} c={t.ink} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: moonOpac }}>
              <Icon.Moon s={16} c={t.ink} />
            </Animated.View>
          </View>
        </Press>
      </View>

      {/* Big stat — for the selected urge, left aligned */}
      <View style={{ position: 'absolute', top: topPad + 100, left: 24, right: 24 }}>
        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase', marginBottom: 12 }}>
          {urge ? `${urge.emoji}  ${urge.label}` : 'Today'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 104, lineHeight: 116, letterSpacing: -4,
            fontWeight: '300', color: t.ink, ...mono,
          }}>{rides}</Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 22, color: t.inkSoft,
            fontStyle: 'italic', marginBottom: 16,
          }}>waves ridden</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 16, alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase' }}>Streak</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 26, marginTop: 2, color: t.ink, ...mono }}>
              {streak} <Text style={{ fontSize: 13, color: t.mute, fontFamily: FONTS.body }}>days</Text>
            </Text>
          </View>
          <View style={{ width: 0.5, alignSelf: 'stretch', backgroundColor: t.line }} />
          <View>
            <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase' }}>Success</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 26, marginTop: 2, color: t.ink, ...mono }}>
              {successPct}<Text style={{ fontSize: 13, color: t.mute, fontFamily: FONTS.body }}>%</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Urge picker pills */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ position: 'absolute', top: topPad + 336, left: 0, right: 0, maxHeight: 36 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 6, alignItems: 'center' }}
      >
        {trackedUrges(s).map(u => {
          const on = u.id === urgeId;
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

      {/* CTA */}
      <View style={{ position: 'absolute', top: topPad + 394, left: 24, right: 24 }}>
        <View style={{ height: 0.5, backgroundColor: t.line, marginBottom: 24 }} />
        <Primary kind="kelp" onPress={() => set({ screen: 'picker' })}>Start a surf →</Primary>
      </View>

      {/* Recent */}
      <View style={{ position: 'absolute', top: topPad + 484, left: 24, right: 24, bottom: insets.bottom + 90 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>Recent</Text>
          <Press onPress={() => set({ screen: 'history' })} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 11, letterSpacing: 1.2, color: t.kelp, fontWeight: '500' }}>History</Text>
            <Icon.ArrowRight s={12} c={t.kelp} />
          </Press>
        </View>
        {s.log.slice(0, 4).map((row, i) => {
          const u = findUrge(s, row.u);
          const label = row.date === today() ? (row.t || 'now') : formatDate(row.date);
          return (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 11,
              borderTopWidth: 0.5, borderTopColor: t.line, gap: 12,
            }}>
              <Text style={{ width: 48, fontSize: 12, color: t.mute, ...mono }}>{label}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: row.ok ? t.kelp : t.coral }} />
                <Text style={{ fontSize: 15, color: t.ink }}>{u ? u.label : row.u}</Text>
              </View>
              <Text style={{ fontSize: 13, color: t.mute, ...mono }}>{row.r}</Text>
            </View>
          );
        })}
      </View>

      <Tabs />
    </Shell>
  );
}
