import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import { Primary, Ghost } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, streakDays } from '../util';

export default function Success() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const urge = findUrge(s, s.urgeId) || { label: 'urge' };

  const stats = [
    { k: `${urge.label} streak`, v: `${streakDays(s, s.urgeId)}`, u: 'days' },
    { k: 'This wave', v: `${s.duration / 60}:00`, u: 'min' },
    { k: 'Intensity rode', v: `${s.intensity}`, u: '/10' },
    { k: 'Total surfed', v: `${s.rides[s.urgeId] || 0}`, u: '' },
  ];

  return (
    <Shell>
      <View style={{ position: 'absolute', top: insets.top + 60, left: 32, right: 32 }}>
        <Text style={{ fontSize: 11, letterSpacing: 3, color: t.kelp, textTransform: 'uppercase' }}>
          Wave ridden · {Math.floor(s.duration / 60)}:00
        </Text>
        <Text style={{
          fontFamily: FONTS.display, fontSize: 56, lineHeight: 64, letterSpacing: -1.8,
          fontWeight: '300', marginTop: 16, color: t.ink,
        }}>
          You outlasted{'\n'}the <Text style={{ fontStyle: 'italic', color: t.kelp }}>{urge.label.toLowerCase()}.</Text>
        </Text>
        <Svg width={80} height={10} viewBox="0 0 120 10" fill="none" stroke={t.kelp} strokeWidth={1} opacity={0.6} style={{ marginTop: 20 }}>
          <Path d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5" />
        </Svg>
      </View>

      <View style={{
        position: 'absolute', top: insets.top + 320, left: 24, right: 24,
        flexDirection: 'row', flexWrap: 'wrap', gap: 8,
      }}>
        {stats.map((x, i) => (
          <View key={i} style={{
            width: '48.5%',
            paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14,
            backgroundColor: t.sandDim,
          }}>
            <Text style={{ fontSize: 10, letterSpacing: 1.8, color: t.mute, textTransform: 'uppercase' }}>{x.k}</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 32, lineHeight: 36, marginTop: 6, fontWeight: '300', color: t.ink, ...mono }}>
              {x.v}<Text style={{ fontSize: 14, color: t.mute, marginLeft: 2, fontFamily: FONTS.body }}>{x.u}</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', bottom: insets.bottom + 30, left: 24, right: 24, gap: 10 }}>
        <Primary onPress={() => set({ screen: 'selfie' })} icon={<Icon.Camera s={18} c={t.sand} />}>
          Victory selfie
        </Primary>
        <Ghost onPress={() => set({ screen: 'home' })}>Done</Ghost>
      </View>
    </Shell>
  );
}
