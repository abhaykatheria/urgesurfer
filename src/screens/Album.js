import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Dimensions, Alert, Modal, Pressable } from 'react-native';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Icon } from '../components/Icon';
import Tabs from '../components/Tabs';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';

const COLS = 3;

export default function Album() {
  const { s, set } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(null);

  const W = Dimensions.get('window').width;
  const tile = (W - 24 * 2 - 4 * (COLS - 1)) / COLS;

  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const share = async (uri) => {
    try {
      const ok = await Sharing.isAvailableAsync();
      if (ok) await Sharing.shareAsync(uri, { dialogTitle: 'Share victory selfie' });
    } catch {}
  };

  const remove = (ts) => {
    Alert.alert('Delete photo?', 'This will remove it from your album.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          set(prev => ({ ...prev, photos: prev.photos.filter(p => p.ts !== ts) }));
          setActive(null);
        },
      },
    ]);
  };

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 24, right: 24,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <View>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>
            Victory selfies
          </Text>
          <Text style={{
            fontFamily: FONTS.display, fontSize: 38, letterSpacing: -1, fontWeight: '300',
            marginTop: 4, color: t.ink,
          }}>
            {s.photos.length} <Text style={{ fontStyle: 'italic', fontSize: 22, color: t.inkSoft }}>
              {s.photos.length === 1 ? 'wave' : 'waves'} kept
            </Text>
          </Text>
        </View>
      </View>

      {s.photos.length === 0 ? (
        <View style={{
          position: 'absolute', top: insets.top + 200, left: 32, right: 32, alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, color: t.mute, textAlign: 'center', lineHeight: 22 }}>
            No selfies yet.{'\n'}Capture one after riding out a wave to save it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ position: 'absolute', top: insets.top + 110, left: 0, right: 0, bottom: insets.bottom + 80 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {s.photos.map((p, i) => (
              <Press
                key={p.ts || i}
                onPress={() => setActive(p)}
                style={{
                  width: tile, height: tile,
                  marginRight: (i % COLS === COLS - 1) ? 0 : 4,
                  marginBottom: 4,
                  borderRadius: 4, overflow: 'hidden',
                  backgroundColor: t.sandDim,
                }}
              >
                <Image source={{ uri: p.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{
                  position: 'absolute', left: 6, bottom: 6,
                  paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                  <Text style={{ fontSize: 10, color: '#F4EFE6' }}>{p.emoji} {p.streak}d</Text>
                </View>
              </Press>
            ))}
          </View>
        </ScrollView>
      )}

      <Tabs />

      <Modal visible={!!active} animationType="fade" transparent onRequestClose={() => setActive(null)}>
        {active && (
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)' }}>
            <Pressable onPress={() => setActive(null)} style={{ flex: 1 }} />
            <View style={{ position: 'absolute', top: insets.top + 20, right: 20, zIndex: 5 }}>
              <Press onPress={() => setActive(null)} hitSlop={12}>
                <Icon.Close s={26} c="#F4EFE6" />
              </Press>
            </View>
            <View style={{ position: 'absolute', top: insets.top + 70, left: 16, right: 16, aspectRatio: 1, borderRadius: 4, overflow: 'hidden' }}>
              <Image source={{ uri: active.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={{ position: 'absolute', bottom: insets.bottom + 100, left: 24, right: 24 }}>
              <Text style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: '300', color: '#F4EFE6', letterSpacing: -0.4 }}>
                {active.emoji} {active.label}
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(244,239,230,0.7)', marginTop: 6, ...mono }}>
                {active.streak}d streak · rode {fmt(active.duration)} · intensity {active.intensity}/10
              </Text>
              <Text style={{ fontSize: 11, color: 'rgba(244,239,230,0.5)', marginTop: 4 }}>
                {new Date(active.ts).toLocaleString()}
              </Text>
            </View>
            <View style={{
              position: 'absolute', bottom: insets.bottom + 30, left: 24, right: 24,
              flexDirection: 'row', gap: 10,
            }}>
              <View style={{ flex: 1 }}>
                <Press onPress={() => remove(active.ts)} style={{
                  height: 50, borderRadius: 14, backgroundColor: 'rgba(244,239,230,0.1)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#F4EFE6', fontSize: 15 }}>Delete</Text>
                </Press>
              </View>
              <View style={{ flex: 1.4 }}>
                <Press onPress={() => share(active.uri)} style={{
                  height: 50, borderRadius: 14, backgroundColor: '#F4EFE6',
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon.Share s={16} c="#1F2A2E" />
                  <Text style={{ color: '#1F2A2E', fontSize: 15, fontWeight: '500' }}>Share</Text>
                </Press>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </Shell>
  );
}
