import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { trackedUrges, streakDays } from '../util';
import { Primary } from '../components/Buttons';
import { DURATIONS, TRIGGERS } from '../constants';
import Press from '../components/Press';

export default function Picker() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [selected, setSel] = useState(s.urgeId);
  const [dur, setDur] = useState(s.duration);
  const [trigger, setTrigger] = useState(null);
  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const slide = useRef(new Animated.Value(40)).current;
  const opac = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.timing(opac,  { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const close = () => set({ screen: 'home' });

  return (
    <View style={{ flex: 1, backgroundColor: t.sand }}>
      <Animated.View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)', opacity: opac,
      }} />
      <Pressable onPress={close} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      <Animated.View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        top: insets.top + 80,
        backgroundColor: t.sand,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: 24, paddingTop: 10, paddingBottom: insets.bottom + 30,
        transform: [{ translateY: slide }],
      }}>
        <View style={{ width: 34, height: 3, borderRadius: 2, backgroundColor: t.muteLo, alignSelf: 'center', marginBottom: 20 }} />
        <Text style={{ fontFamily: FONTS.display, fontSize: 32, letterSpacing: -0.8, fontWeight: '300', color: t.ink }}>
          What's rising?
        </Text>
        <Text style={{ fontSize: 13, color: t.mute, marginTop: 4, marginBottom: 22 }}>
          Name it to ride it.
        </Text>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
            {trackedUrges(s).map(u => {
              const on = u.id === selected;
              return (
                <View key={u.id} style={{ width: '50%', padding: 4 }}>
                  <Press onPress={() => setSel(u.id)} style={{
                    flexDirection: 'row', alignItems: 'center', padding: 14,
                    borderRadius: 12, gap: 12,
                    backgroundColor: on ? t.ink : t.sandDim,
                  }}>
                    <Text style={{ fontSize: 22 }}>{u.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: on ? t.sand : t.ink }} numberOfLines={1}>{u.label}</Text>
                      <Text style={{ fontSize: 11, opacity: 0.55, color: on ? t.sand : t.ink, ...mono }}>
                        {streakDays(s, u.id)}d streak
                      </Text>
                    </View>
                  </Press>
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase' }}>Duration</Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 20, color: t.ink, ...mono }}>{fmt(dur)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
              {DURATIONS.map(sec => {
                const on = dur === sec;
                return (
                  <Press key={sec} onPress={() => setDur(sec)} style={{
                    flex: 1, paddingVertical: 10, alignItems: 'center',
                    borderRadius: 10, backgroundColor: on ? t.ink : t.sandDim,
                  }}>
                    <Text style={{ fontSize: 14, color: on ? t.sand : t.ink, ...mono }}>
                      {sec / 60}<Text style={{ fontSize: 10, opacity: 0.6 }}>m</Text>
                    </Text>
                  </Press>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 22 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase' }}>What's behind it?</Text>
              <Text style={{ fontSize: 11, color: t.muteLo }}>Optional</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {TRIGGERS.map(label => {
                const on = label === trigger;
                return (
                  <Press key={label} onPress={() => setTrigger(on ? null : label)} style={{
                    paddingHorizontal: 13, paddingVertical: 7, borderRadius: 12,
                    backgroundColor: on ? t.ink : 'transparent',
                    borderWidth: on ? 0 : 0.5, borderColor: t.lineStr,
                  }}>
                    <Text style={{ fontSize: 13, color: on ? t.sand : t.inkSoft }}>{label}</Text>
                  </Press>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={{ marginTop: 18 }}>
          <Primary onPress={() => set({
            urgeId: selected, duration: dur, remaining: dur,
            running: true, endTime: Date.now() + dur * 1000,
            trigger, screen: 'timer',
          })}>Begin</Primary>
        </View>
      </Animated.View>
    </View>
  );
}
