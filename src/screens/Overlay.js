import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Primary } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { findUrge, streakDays } from '../util';
import { OVERLAY_STYLES } from '../constants';

export default function Overlay() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [styleName, setStyleName] = useState('Minimal');
  const urge = findUrge(s, s.urgeId) || { label: 'urge' };
  const waveN = s.counts[s.urgeId] || 1;
  const streakNext = streakDays(s, s.urgeId);

  const renderOverlay = () => {
    if (styleName === 'Minimal') {
      return (
        <View style={{
          padding: 14, paddingVertical: 12,
          backgroundColor: 'rgba(244,239,230,0.94)', borderRadius: 8,
          flexDirection: 'row', alignItems: 'center', gap: 14,
        }}>
          <View>
            <Text style={{ fontSize: 9, letterSpacing: 2, opacity: 0.55, textTransform: 'uppercase', color: '#1F2A2E' }}>
              {urge.label}-free
            </Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 30, lineHeight: 32, fontWeight: '300', color: '#1F2A2E', ...mono }}>
              {streakNext} <Text style={{ fontSize: 13, opacity: 0.55 }}>days</Text>
            </Text>
          </View>
          <View style={{ width: 0.5, height: 36, backgroundColor: 'rgba(0,0,0,0.15)' }} />
          <View>
            <Text style={{ fontSize: 9, letterSpacing: 2, opacity: 0.55, textTransform: 'uppercase', color: '#1F2A2E' }}>Wave</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 30, lineHeight: 32, fontWeight: '300', color: '#1F2A2E', ...mono }}>
              #{waveN}
            </Text>
          </View>
        </View>
      );
    }
    if (styleName === 'Strava') {
      return (
        <View style={{ padding: 14, paddingVertical: 12, backgroundColor: 'rgba(31,42,46,0.85)', borderRadius: 8 }}>
          <Text style={{ fontSize: 9, letterSpacing: 2, opacity: 0.6, textTransform: 'uppercase', color: '#F4EFE6', marginBottom: 6 }}>
            URGE SURFER · WAVE #{waveN}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, opacity: 0.55, color: '#F4EFE6' }}>{urge.label}-free</Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: '300', color: '#F4EFE6', ...mono }}>{streakNext}d</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, opacity: 0.55, color: '#F4EFE6' }}>Rode</Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: '300', color: '#F4EFE6', ...mono }}>{s.duration / 60}:00</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, opacity: 0.55, color: '#F4EFE6' }}>Intensity</Text>
              <Text style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: '300', color: '#F4EFE6', ...mono }}>{s.intensity}/10</Text>
            </View>
          </View>
        </View>
      );
    }
    if (styleName === 'Ticker') {
      return (
        <View style={{ padding: 14, paddingVertical: 10, backgroundColor: '#1F2A2E', borderRadius: 4 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1, color: '#F4EFE6' }}>
            ● {urge.label.toUpperCase()}-FREE {streakNext}D · WAVE #{waveN} · RODE {s.duration / 60}:00
          </Text>
        </View>
      );
    }
    if (styleName === 'Polaroid') {
      return (
        <View style={{ padding: 10, paddingBottom: 14, backgroundColor: '#F4EFE6', borderRadius: 2, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 16, color: '#1F2A2E' }}>
            {urge.label}-free, {streakNext} days
          </Text>
          <Text style={{ fontSize: 10, opacity: 0.55, marginTop: 2, letterSpacing: 1.5, color: '#1F2A2E' }}>
            wave #{waveN} · rode {s.duration / 60}:00
          </Text>
        </View>
      );
    }
    // Receipt
    return (
      <View style={{ padding: 10, backgroundColor: '#F4EFE6', borderRadius: 2 }}>
        <Text style={{ textAlign: 'center', fontWeight: '700', letterSpacing: 2, fontFamily: FONTS.mono, color: '#1F2A2E', fontSize: 10, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.2)', marginBottom: 4 }}>
          URGE SURFER
        </Text>
        {[
          [`${urge.label.toUpperCase()}-FREE`, `${streakNext} DAYS`],
          ['WAVE', `#${waveN}`],
          ['RODE', `${s.duration / 60}:00`],
        ].map(([l, r], i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: '#1F2A2E' }}>{l}</Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: '#1F2A2E' }}>{r}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Streak / log were already written at Timer success. Capture the photo
  // (with metadata for the album), tag the most recent matching log entry
  // with the camera glyph so History reflects that a selfie was kept, then
  // navigate home.
  const savePhotoAndGo = (alsoShare = false) => {
    const uri = s.currentPhoto;
    if (!uri) {
      // No photo captured — just go home.
      set({ screen: 'home', currentPhoto: null });
      return;
    }
    const photo = {
      uri,
      ts: Date.now(),
      urgeId: s.urgeId,
      label: urge.label,
      emoji: urge.emoji,
      streak: streakNext,
      duration: s.duration,
      intensity: s.intensity,
      style: styleName,
    };
    set(prev => {
      const idx = prev.log.findIndex(r => r.u === prev.urgeId && r.ok && !r.r.includes('📸'));
      const log = idx >= 0
        ? prev.log.map((r, i) => i === idx ? { ...r, r: r.r + ' 📸' } : r)
        : prev.log;
      return {
        ...prev,
        screen: 'home',
        currentPhoto: null,
        photos: [photo, ...prev.photos],
        log,
      };
    });
    if (alsoShare) {
      Sharing.isAvailableAsync()
        .then(ok => ok && Sharing.shareAsync(uri, { dialogTitle: 'Share victory selfie' }))
        .catch(() => {});
    }
  };

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 16, right: 16, height: 46,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Press onPress={() => set({ screen: 'selfie' })} hitSlop={10}>
          <Icon.Back s={22} c={t.ink} />
        </Press>
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.ink }}>Share</Text>
        <Press onPress={() => savePhotoAndGo(false)} hitSlop={10}>
          <Text style={{ fontSize: 15, color: t.kelp, fontWeight: '500' }}>Save</Text>
        </Press>
      </View>

      <View style={{
        position: 'absolute', top: insets.top + 70, left: 24, right: 24,
        aspectRatio: 1, borderRadius: 4, overflow: 'hidden',
      }}>
        {s.currentPhoto ? (
          <Image source={{ uri: s.currentPhoto }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
        ) : (
          <>
            <LinearGradient
              colors={['#c8b89a', '#8a7d62']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3 }}>
                [ no photo ]
              </Text>
            </View>
          </>
        )}
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
          {renderOverlay()}
        </View>
      </View>

      <View style={{ position: 'absolute', bottom: insets.bottom + 110, left: 0, right: 0 }}>
        <Text style={{ fontSize: 11, letterSpacing: 2, color: t.mute, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 24 }}>
          Overlay
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {OVERLAY_STYLES.map(name => {
            const on = name === styleName;
            return (
              <Press key={name} onPress={() => setStyleName(name)} style={{
                width: 72, height: 96, borderRadius: 8,
                borderWidth: 1.5, borderColor: on ? t.ink : t.lineStr,
                backgroundColor: t.sandDim,
                padding: 6, justifyContent: 'space-between',
              }}>
                <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
                  <MiniPreview name={name} />
                </View>
                <Text style={{
                  fontSize: 11, color: on ? t.ink : t.inkSoft,
                  fontWeight: on ? '600' : '400', textAlign: 'center',
                }}>{name}</Text>
              </Press>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ position: 'absolute', bottom: insets.bottom + 30, left: 24, right: 24 }}>
        <Primary onPress={() => savePhotoAndGo(true)} icon={<Icon.Share s={16} c={t.sand} />}>Share</Primary>
      </View>
    </Shell>
  );
}

// Tiny visual signatures for each overlay style. Pure shapes, no text — keeps
// the tile readable at thumbnail size and quickly tells you what each preset
// will look like on the photo.
function MiniPreview({ name }) {
  if (name === 'Minimal') {
    return (
      <View style={{
        backgroundColor: 'rgba(244,239,230,0.94)', borderRadius: 3,
        paddingHorizontal: 4, paddingVertical: 4,
        flexDirection: 'row', gap: 4, alignItems: 'center',
      }}>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ height: 1.5, width: '70%', backgroundColor: 'rgba(31,42,46,0.45)' }} />
          <View style={{ height: 5, width: '85%', backgroundColor: '#1F2A2E', borderRadius: 1 }} />
        </View>
        <View style={{ width: 0.5, height: 14, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ height: 1.5, width: '60%', backgroundColor: 'rgba(31,42,46,0.45)' }} />
          <View style={{ height: 5, width: '70%', backgroundColor: '#1F2A2E', borderRadius: 1 }} />
        </View>
      </View>
    );
  }
  if (name === 'Strava') {
    return (
      <View style={{
        backgroundColor: 'rgba(31,42,46,0.9)', borderRadius: 3,
        padding: 4, gap: 3,
      }}>
        <View style={{ height: 1, width: '75%', backgroundColor: 'rgba(244,239,230,0.55)' }} />
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ flex: 1, gap: 1.5 }}>
              <View style={{ height: 1, width: '70%', backgroundColor: 'rgba(244,239,230,0.5)' }} />
              <View style={{ height: 4, width: '100%', backgroundColor: '#F4EFE6', borderRadius: 0.5 }} />
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (name === 'Ticker') {
    return (
      <View style={{
        backgroundColor: '#1F2A2E', borderRadius: 1.5,
        height: 14, paddingHorizontal: 4,
        flexDirection: 'row', alignItems: 'center', gap: 3,
      }}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#F4EFE6' }} />
        <View style={{ flex: 1, height: 1.2, backgroundColor: '#F4EFE6', opacity: 0.85 }} />
      </View>
    );
  }
  if (name === 'Polaroid') {
    return (
      <View style={{
        backgroundColor: '#F4EFE6', borderRadius: 1,
        paddingTop: 4, paddingBottom: 6, paddingHorizontal: 5,
        alignItems: 'center', gap: 2,
      }}>
        <View style={{ height: 3, width: '75%', backgroundColor: '#1F2A2E', borderRadius: 0.5 }} />
        <View style={{ height: 1, width: '55%', backgroundColor: 'rgba(31,42,46,0.45)' }} />
      </View>
    );
  }
  // Receipt
  return (
    <View style={{
      backgroundColor: '#F4EFE6', borderRadius: 1,
      padding: 4, gap: 2,
    }}>
      <View style={{ height: 1, width: '85%', backgroundColor: '#1F2A2E', alignSelf: 'center' }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '45%', height: 1, backgroundColor: '#1F2A2E' }} />
        <View style={{ width: '20%', height: 1, backgroundColor: '#1F2A2E' }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '30%', height: 1, backgroundColor: '#1F2A2E' }} />
        <View style={{ width: '25%', height: 1, backgroundColor: '#1F2A2E' }} />
      </View>
    </View>
  );
}
