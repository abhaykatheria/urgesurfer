import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Animated, KeyboardAvoidingView, Platform, Pressable, Keyboard } from 'react-native';
import { useTheme, FONTS } from '../theme';
import { CUSTOM_EMOJIS } from '../constants';
import { Primary, Ghost } from './Buttons';
import Press from './Press';

export default function CustomUrgeSheet({ open, onClose, onCreate }) {
  const t = useTheme();
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState(CUSTOM_EMOJIS[0]);
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    if (open) {
      setLabel('');
      setEmoji(CUSTOM_EMOJIS[Math.floor(Math.random() * CUSTOM_EMOJIS.length)]);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slide,   { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      opacity.setValue(0);
      slide.setValue(28);
    }
  }, [open]);

  if (!open) return null;
  const trimmed = label.trim();

  const submit = () => {
    if (!trimmed) return;
    Keyboard.dismiss();
    onCreate({ label: trimmed.slice(0, 20), emoji });
  };

  return (
    <Animated.View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 50, opacity, pointerEvents: 'box-none',
    }}>
      <Pressable onPress={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
      }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', pointerEvents: 'box-none' }}
      >
        <Animated.View style={{
          backgroundColor: t.sand,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 24, paddingTop: 16, paddingBottom: 32,
          transform: [{ translateY: slide }],
          shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 30, shadowOffset: { width: 0, height: -10 },
        }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: t.lineStr, alignSelf: 'center', marginBottom: 18, marginTop: 4 }} />
          <Text style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: '300', letterSpacing: -0.6, color: t.ink }}>
            Add your own.
          </Text>
          <Text style={{ fontSize: 13, color: t.mute, marginTop: 4 }}>
            Name your pattern. Pick a glyph.
          </Text>

          <View style={{ marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 14, backgroundColor: t.sandDim,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 26 }}>{emoji}</Text>
            </View>
            <TextInput
              autoFocus
              value={label}
              onChangeText={setLabel}
              onSubmitEditing={submit}
              placeholder="e.g. Late-night scroll"
              placeholderTextColor={t.muteLo}
              maxLength={20}
              style={{
                flex: 1, borderBottomWidth: 1, borderBottomColor: t.lineStr,
                paddingVertical: 10,
                fontFamily: FONTS.display, fontSize: 22, fontWeight: '300',
                letterSpacing: -0.4, color: t.ink,
              }}
            />
          </View>

          <Text style={{ fontSize: 10, letterSpacing: 2, color: t.mute, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Glyph</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 }}>
            {CUSTOM_EMOJIS.map(e => {
              const on = e === emoji;
              return (
                <View key={e} style={{ width: `${100 / 9}%`, padding: 3 }}>
                  <Press onPress={() => setEmoji(e)} style={{
                    aspectRatio: 1, borderRadius: 10,
                    backgroundColor: on ? t.ink : t.sandDim,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 18 }}>{e}</Text>
                  </Press>
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
            <View style={{ flex: 1 }}><Ghost onPress={onClose}>Cancel</Ghost></View>
            <View style={{ flex: 1.4 }}>
              <Primary disabled={!trimmed} onPress={submit}>Add to surf</Primary>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
