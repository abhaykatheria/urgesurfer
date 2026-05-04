import React from 'react';
import { View, Text } from 'react-native';
import Press from './Press';
import { Icon } from './Icon';
import { useTheme } from '../theme';
import { useApp } from '../state';

const TABS = [
  { I: 'Home',   l: 'Today', screen: 'home' },
  { I: 'Chart',  l: 'Stats', screen: 'stats' },
  { I: 'Camera', l: 'Album', screen: 'album' },
  { I: 'User',   l: 'Me',    screen: 'profile' },
];

export default function Tabs() {
  const { s, set } = useApp();
  const t = useTheme();
  return (
    <View style={{
      position: 'absolute', bottom: 28, left: 24, right: 24,
      flexDirection: 'row', justifyContent: 'space-between',
      paddingTop: 14, borderTopWidth: 0.5, borderTopColor: t.line,
    }}>
      {TABS.map((tab, i) => {
        const Comp = Icon[tab.I];
        const active = tab.screen === s.screen;
        return (
          <Press key={i}
            onPress={() => tab.screen && set({ screen: tab.screen })}
            style={{ alignItems: 'center', gap: 3, opacity: active ? 1 : 0.4 }}>
            <Comp s={20} c={t.ink} />
            <Text style={{ fontSize: 10, letterSpacing: 0.5, color: t.ink }}>{tab.l}</Text>
          </Press>
        );
      })}
    </View>
  );
}
