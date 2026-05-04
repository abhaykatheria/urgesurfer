import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../components/Press';
import { Icon } from '../components/Icon';
import { useApp } from '../state';
import { FONTS } from '../theme';

export default function Selfie() {
  const { s, set } = useApp();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const captured = s.currentPhoto;

  const launchCamera = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Camera permission needed',
          'Enable camera access in Settings to capture a victory selfie.',
        );
        setBusy(false);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        quality: 0.85,
        allowsEditing: false,
        exif: false,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        set({ currentPhoto: result.assets[0].uri });
      }
    } catch (e) {
      Alert.alert('Camera error', e?.message || 'Could not open the camera.');
    } finally {
      setBusy(false);
    }
  };

  // Auto-launch the system camera the first time the screen opens with no
  // photo yet — matches the original "tap shutter to capture" expectation.
  useEffect(() => {
    if (!captured) launchCamera();
    // intentionally not depending on `captured` — only auto-launch on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retake = () => {
    set({ currentPhoto: null });
    launchCamera();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 16, right: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <Press onPress={() => set({ screen: 'success' })} hitSlop={10}>
          <Icon.Close s={22} c="#F4EFE6" />
        </Press>
        <Text style={{ fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: '#F4EFE6' }}>Victory</Text>
        <Text style={{ fontSize: 12, color: 'rgba(244,239,230,0.6)' }}>1:1</Text>
      </View>

      <View style={{
        position: 'absolute', top: insets.top + 70, left: 16, right: 16,
        aspectRatio: 1, borderRadius: 4, overflow: 'hidden',
      }}>
        {captured ? (
          <Image source={{ uri: captured }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <>
            <LinearGradient
              colors={['#4a5d60', '#2a3a3d']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 3 }}>
                {busy ? '[ camera opening… ]' : '[ tap shutter ]'}
              </Text>
            </View>
          </>
        )}
      </View>

      {!captured ? (
        <View style={{
          position: 'absolute', bottom: insets.bottom + 30, left: 0, right: 0,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(244,239,230,0.1)' }} />
          <Press onPress={launchCamera} style={{
            width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#F4EFE6',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: '#F4EFE6' }} />
          </Press>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(244,239,230,0.1)' }} />
        </View>
      ) : (
        <View style={{
          position: 'absolute', bottom: insets.bottom + 30, left: 16, right: 16,
          flexDirection: 'row', gap: 8,
        }}>
          <View style={{ flex: 1 }}>
            <Press onPress={retake} style={{
              height: 52, borderRadius: 14, backgroundColor: 'rgba(244,239,230,0.1)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#F4EFE6', fontSize: 15 }}>Retake</Text>
            </Press>
          </View>
          <View style={{ flex: 1.4 }}>
            <Press onPress={() => set({ screen: 'overlay' })} style={{
              height: 52, borderRadius: 14, backgroundColor: '#F4EFE6',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Text style={{ color: '#1F2A2E', fontSize: 15, fontWeight: '500' }}>Add overlay</Text>
              <Icon.ArrowRight s={16} c="#1F2A2E" />
            </Press>
          </View>
        </View>
      )}
    </View>
  );
}
