import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, AppState } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Primary, Ghost } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, completeSurfState, remainingFromEnd } from '../util';

export default function Timer() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const urge = findUrge(s, s.urgeId) || { label: 'Urge', emoji: '🌊' };

  // Drive `remaining` from absolute `endTime`. setInterval is just for visual
  // refresh; iOS may throttle it in the background but the math always uses
  // wall-clock time, so foregrounding (or coming back from a kill) snaps to
  // the correct value. AppState 'active' triggers an extra immediate refresh.
  useEffect(() => {
    if (!s.running) return;

    const tick = () => {
      const remaining = remainingFromEnd(s.endTime);
      set(prev => {
        if (!prev.running) return prev;
        if (remaining <= 0) return completeSurfState(prev);
        return { ...prev, remaining };
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') tick();
    });

    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [s.running, s.endTime]);

  // Breathing 4-7-8 prompt
  const [phase, setPhase] = useState('Breathe in — 4');
  useEffect(() => {
    const cycle = () => {
      const tt = (Date.now() / 1000) % 12;
      if (tt < 4) setPhase('Breathe in — ' + Math.ceil(4 - tt));
      else if (tt < 7) setPhase('Hold — ' + Math.ceil(7 - tt));
      else setPhase('Breathe out — ' + Math.ceil(12 - tt));
    };
    cycle();
    const id = setInterval(cycle, 500);
    return () => clearInterval(id);
  }, []);

  // Breathing pulse — animated via Animated.View overlaid on the SVG.
  // Native driver on transform.scale, so it stays smooth without re-rendering SVG.
  const breath = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1.08, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breath, { toValue: 0.85, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const elapsed = s.duration - s.remaining;

  const R = 140;
  const C = 2 * Math.PI * R;
  const progress = 1 - (s.remaining / s.duration);

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 24, right: 24,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Press onPress={() => set({ running: false, endTime: null, screen: 'home' })} hitSlop={10}>
          <Icon.Close s={22} c={t.mute} />
        </Press>
        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>
          {urge.emoji} {urge.label} · surfing
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={{
        position: 'absolute', top: insets.top + 75, left: 0, right: 0, height: 340,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Svg width={300} height={300} viewBox="0 0 300 300" style={{ position: 'absolute' }}>
          <Circle cx={150} cy={150} r={140} fill="none" stroke={t.kelp} strokeWidth={0.5} opacity={0.2} />
          <Circle cx={150} cy={150} r={110} fill="none" stroke={t.kelp} strokeWidth={0.5} opacity={0.3} />
          <Circle
            cx={150} cy={150} r={R}
            fill="none" stroke={t.kelp} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={`${C * progress} ${C}`}
            transform="rotate(-90 150 150)"
          />
        </Svg>
        <Animated.View style={{
          position: 'absolute',
          width: 164, height: 164, borderRadius: 82,
          backgroundColor: t.kelp, opacity: 0.12,
          transform: [{ scale: breath }],
        }} />
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase', marginBottom: 6 }}>
            Remaining
          </Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 88, letterSpacing: -3,
            lineHeight: 100, fontWeight: '300', color: t.ink, ...mono,
          }}>
            {fmt(s.remaining)}
          </Text>
        </View>
      </View>

      <View style={{ position: 'absolute', top: insets.top + 425, left: 32, right: 32, alignItems: 'center' }}>
        <Text style={{
          fontFamily: FONTS.display, fontSize: 22, fontStyle: 'italic',
          color: t.kelpDk, letterSpacing: -0.3,
        }}>
          {phase}
        </Text>
        <Text style={{
          fontSize: 13.5, color: t.inkSoft, marginTop: 10, lineHeight: 20,
          maxWidth: 280, textAlign: 'center',
        }}>
          This craving is borrowing your attention. It gives it back, always.
        </Text>
      </View>

      {/* Intensity */}
      <View style={{ position: 'absolute', bottom: insets.bottom + 110, left: 24, right: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase' }}>Intensity</Text>
          <Text style={{ fontSize: 12, color: t.inkSoft, ...mono }}>{s.intensity} / 10</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 3 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Press
              key={i}
              onPress={() => set({ intensity: i + 1 })}
              hitSlop={{ top: 16, bottom: 16, left: 2, right: 2 }}
              style={{
                flex: 1, height: 14, borderRadius: 1,
                backgroundColor: i < s.intensity ? t.kelp : t.sandDk,
              }}
            />
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={{ position: 'absolute', bottom: insets.bottom + 30, left: 24, right: 24, flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Ghost
            onPress={() => set({ running: false, endTime: null, caveTime: elapsed, screen: 'caved' })}
            style={{ height: 46 }}
            color={t.mute}
          >I caved</Ghost>
        </View>
        <View style={{ flex: 1.3 }}>
          <Primary
            onPress={() => set(prev => completeSurfState(prev))}
            icon={<Icon.Check s={16} c={t.sand} />}
            style={{ height: 46 }}
          >Surfed it</Primary>
        </View>
      </View>
    </Shell>
  );
}
