import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shell from '../components/Shell';
import Press from '../components/Press';
import { Icon } from '../components/Icon';
import Tabs from '../components/Tabs';
import CustomUrgeSheet from '../components/CustomUrgeSheet';
import { useApp } from '../state';
import { useTheme, FONTS, mono } from '../theme';
import { allUrges, trackedUrges, streakDays } from '../util';

export default function Profile() {
  const { s, set, addCustomUrge } = useApp();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(s.name || '');
  const [picked, setPicked] = useState(new Set(s.tracked));
  const [editing, setEditing] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  useEffect(() => {
    if (!editing) {
      setName(s.name || '');
      setPicked(new Set(s.tracked));
    }
  }, [s.name, s.tracked, editing]);

  const togglePick = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const save = () => {
    const arr = allUrges(s).map(u => u.id).filter(id => picked.has(id));
    if (arr.length === 0) return;
    set(prev => ({
      ...prev,
      name: name.trim() || prev.name || 'Friend',
      tracked: arr,
      urgeId: arr.includes(prev.urgeId) ? prev.urgeId : arr[0],
    }));
    setEditing(false);
  };

  const reset = () => {
    setName(s.name || '');
    setPicked(new Set(s.tracked));
    setEditing(false);
  };

  const tracked = trackedUrges(s);
  const totalRides = Object.values(s.rides).reduce((a, b) => a + b, 0);
  const totalCount = Object.values(s.counts).reduce((a, b) => a + b, 0);
  const successPct = totalCount ? Math.round((totalRides / totalCount) * 100) : 0;

  return (
    <Shell>
      <View style={{
        position: 'absolute', top: insets.top + 12, left: 16, right: 16, height: 46,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Press onPress={() => editing ? reset() : set({ screen: 'home' })} style={{ width: 36, height: 36, justifyContent: 'center' }}>
          <Icon.Back s={22} c={t.ink} />
        </Press>
        <Text style={{ fontSize: 15, fontWeight: '500', color: t.ink }}>Profile</Text>
        {editing ? (
          <Press onPress={save} hitSlop={10}>
            <Text style={{ fontSize: 15, color: picked.size ? t.kelp : t.muteLo, fontWeight: '500' }}>Save</Text>
          </Press>
        ) : (
          <Press onPress={() => setEditing(true)} hitSlop={10}>
            <Text style={{ fontSize: 15, color: t.kelp, fontWeight: '500' }}>Edit</Text>
          </Press>
        )}
      </View>

      <View style={{ position: 'absolute', top: insets.top + 70, left: 24, right: 24 }}>
        <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>Hello,</Text>
        {editing ? (
          <TextInput
            autoFocus
            value={name}
            onChangeText={setName}
            maxLength={24}
            style={{
              borderBottomWidth: 1, borderBottomColor: t.lineStr,
              paddingVertical: 4,
              fontFamily: FONTS.display, fontSize: 38, color: t.ink,
              fontWeight: '300', letterSpacing: -1, marginTop: 4,
            }}
          />
        ) : (
          <Text style={{
            fontFamily: FONTS.display, fontSize: 42, fontWeight: '300',
            letterSpacing: -1, lineHeight: 46, marginTop: 4, color: t.ink,
          }}>
            {s.name || 'Friend'}.
          </Text>
        )}
      </View>

      <View style={{
        position: 'absolute', top: insets.top + 170, left: 24, right: 24,
        flexDirection: 'row', gap: 10,
      }}>
        {[
          { k: 'Patterns', v: `${s.tracked.length}` },
          { k: 'Rides',    v: `${totalRides}` },
          { k: 'Success',  v: `${successPct}%` },
        ].map((x, i) => (
          <View key={i} style={{
            flex: 1, paddingBottom: 10,
            borderBottomWidth: 0.5, borderBottomColor: t.line,
          }}>
            <Text style={{ fontSize: 10, letterSpacing: 1.8, color: t.mute, textTransform: 'uppercase' }}>{x.k}</Text>
            <Text style={{ fontFamily: FONTS.display, fontSize: 24, lineHeight: 26, marginTop: 4, fontWeight: '300', color: t.ink, ...mono }}>
              {x.v}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', top: insets.top + 260, left: 24, right: 24, bottom: insets.bottom + 90 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <Text style={{ fontSize: 11, letterSpacing: 2.5, color: t.mute, textTransform: 'uppercase' }}>
            {editing ? 'Tracking' : `Surfing ${tracked.length}`}
          </Text>
          {editing && (
            <Text style={{ fontSize: 11, color: t.muteLo }}>{picked.size} selected</Text>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {editing ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {allUrges(s).map(u => {
                const on = picked.has(u.id);
                return (
                  <View key={u.id} style={{ width: '50%', padding: 4 }}>
                    <Press onPress={() => togglePick(u.id)} style={{
                      flexDirection: 'row', alignItems: 'center', gap: 10,
                      paddingHorizontal: 12, paddingVertical: 11, borderRadius: 12,
                      backgroundColor: on ? t.ink : t.sandDim,
                    }}>
                      <Text style={{ fontSize: 18 }}>{u.emoji}</Text>
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
                  paddingHorizontal: 12, paddingVertical: 11, borderRadius: 12,
                  borderWidth: 1, borderStyle: 'dashed', borderColor: t.lineStr,
                }}>
                  <View style={{
                    width: 18, height: 18, borderRadius: 9,
                    backgroundColor: t.sandDim, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon.Plus s={11} c={t.ink} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', fontStyle: 'italic', color: t.inkSoft }}>
                    Add your own
                  </Text>
                </Press>
              </View>
            </View>
          ) : (
            <View>
              {tracked.map(u => (
                <View key={u.id} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: t.line,
                }}>
                  <Text style={{ fontSize: 20, width: 32 }}>{u.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, color: t.ink }}>{u.label}</Text>
                    <Text style={{ fontSize: 11, color: t.mute, marginTop: 1, ...mono }}>
                      {streakDays(s, u.id)}d streak · {(s.rides[u.id] || 0)}/{(s.counts[u.id] || 0)} ridden
                    </Text>
                  </View>
                  <Press onPress={() => set({ urgeId: u.id, screen: 'picker' })}>
                    <Text style={{ fontSize: 12, color: t.kelp, fontWeight: '500' }}>Surf →</Text>
                  </Press>
                </View>
              ))}
              {tracked.length === 0 && (
                <Text style={{ textAlign: 'center', color: t.mute, fontSize: 14, marginTop: 30 }}>
                  Nothing tracked yet. Tap Edit.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <Tabs />

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
