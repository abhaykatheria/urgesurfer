import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Primary, Ghost } from '../components/Buttons';
import { Icon } from '../components/Icon';
import CustomUrgeSheet from '../components/CustomUrgeSheet';
import { useApp } from '../state';
import { useTheme, FONTS } from '../theme';
import { allUrges } from '../util';

export default function Onboarding() {
  const { s, set, addCustomUrge } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(s.name || '');
  const [picked, setPicked] = useState(new Set(s.tracked));
  const [customOpen, setCustomOpen] = useState(false);

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const finish = () => {
    const arr = allUrges(s).map(u => u.id).filter(id => picked.has(id));
    set({
      name: name.trim() || 'Friend',
      tracked: arr.length ? arr : ['cig'],
      urgeId: arr[0] || 'cig',
      screen: 'home',
    });
  };

  const topPad = insets.top + 18;

  return (
    <Shell>
      <View style={{ position: 'absolute', top: topPad, left: 24, right: 24, flexDirection: 'row', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{
            flex: 1, height: 2, borderRadius: 1,
            backgroundColor: i <= step ? t.kelp : t.sandDk,
          }} />
        ))}
      </View>

      {step === 0 && (
        <View style={{ position: 'absolute', top: topPad + 60, left: 24, right: 24 }}>
          <Svg width={48} height={14} viewBox="0 0 120 18" fill="none" stroke={t.kelp} strokeWidth={1.4} opacity={0.7}>
            <Path d="M0 9 Q 10 2, 20 9 T 40 9 T 60 9 T 80 9 T 100 9 T 120 9" />
          </Svg>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 52, lineHeight: 54, letterSpacing: -1.6,
            fontWeight: '300', marginTop: 18, color: t.ink,
          }}>
            Welcome to <Text style={{ fontStyle: 'italic', color: t.kelp }}>Urge Surfer.</Text>
          </Text>
          <Text style={{
            fontSize: 15.5, color: t.inkSoft, marginTop: 18, lineHeight: 24,
          }}>
            Cravings are waves — they rise, peak, and pass. We'll teach you to ride them, not fight them.
          </Text>
        </View>
      )}

      {step === 1 && (
        <View style={{ position: 'absolute', top: topPad + 60, left: 24, right: 24 }}>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>Step 1 of 2</Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 42, lineHeight: 44, letterSpacing: -1.2,
            fontWeight: '300', marginTop: 14, color: t.ink,
          }}>
            What should we{'\n'}call you?
          </Text>
          <View style={{ marginTop: 36 }}>
            <TextInput
              autoFocus
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={t.muteLo}
              maxLength={24}
              style={{
                borderBottomWidth: 1, borderBottomColor: t.lineStr,
                paddingVertical: 12,
                fontFamily: FONTS.display, fontSize: 28, color: t.ink,
                fontWeight: '300', letterSpacing: -0.4,
              }}
            />
            <Text style={{ fontSize: 12, color: t.muteLo, marginTop: 8 }}>
              Used only on your home screen.
            </Text>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={{ position: 'absolute', top: topPad + 30, left: 24, right: 24, bottom: 130 }}>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>Step 2 of 2</Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 36, lineHeight: 38, letterSpacing: -1,
            fontWeight: '300', marginTop: 10, color: t.ink,
          }}>
            What do you want{'\n'}to surf?
          </Text>
          <Text style={{ fontSize: 13, color: t.mute, marginTop: 6, marginBottom: 20 }}>
            Pick any number. You can change this later.
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {allUrges(s).map(u => {
                const on = picked.has(u.id);
                return (
                  <View key={u.id} style={{ width: '50%', padding: 4 }}>
                    <Press onPress={() => togglePick(u.id)} style={{
                      flexDirection: 'row', alignItems: 'center', gap: 10,
                      paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12,
                      backgroundColor: on ? t.ink : t.sandDim,
                    }}>
                      <Text style={{ fontSize: 20 }}>{u.emoji}</Text>
                      <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: on ? t.sand : t.ink }} numberOfLines={1}>{u.label}</Text>
                      <View style={{
                        width: 16, height: 16, borderRadius: 8,
                        borderWidth: 1.5, borderColor: on ? t.sand : t.lineStr,
                        backgroundColor: on ? t.sand : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        {on && <Icon.Check s={10} c={t.ink} />}
                      </View>
                    </Press>
                  </View>
                );
              })}
              <View style={{ width: '50%', padding: 4 }}>
                <Press onPress={() => setCustomOpen(true)} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12,
                  borderWidth: 1, borderStyle: 'dashed', borderColor: t.lineStr,
                }}>
                  <View style={{
                    width: 20, height: 20, borderRadius: 10,
                    backgroundColor: t.sandDim,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Plus s={12} c={t.ink} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', fontStyle: 'italic', color: t.inkSoft }}>
                    Add your own
                  </Text>
                </Press>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      <View style={{ position: 'absolute', bottom: insets.bottom + 28, left: 24, right: 24, flexDirection: 'row', gap: 8 }}>
        {step > 0 && (
          <View style={{ flex: 1 }}>
            <Ghost onPress={() => setStep(step - 1)}>Back</Ghost>
          </View>
        )}
        <View style={{ flex: step > 0 ? 1.5 : 1 }}>
          {step < 2 ? (
            <Primary
              disabled={step === 1 && !name.trim()}
              onPress={() => setStep(step + 1)}
            >
              {step === 0 ? "Let's begin" : 'Continue'}
            </Primary>
          ) : (
            <Primary
              disabled={picked.size === 0}
              onPress={finish}
            >
              {`Start surfing — ${picked.size} ${picked.size === 1 ? 'pattern' : 'patterns'}`}
            </Primary>
          )}
        </View>
      </View>

      <CustomUrgeSheet
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onCreate={({ label, emoji }) => {
          const id = addCustomUrge({ label, emoji });
          setPicked(prev => { const n = new Set(prev); n.add(id); return n; });
          setCustomOpen(false);
        }}
      />
    </Shell>
  );
}
