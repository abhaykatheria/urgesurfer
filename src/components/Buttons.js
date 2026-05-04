import React from 'react';
import { Text, View } from 'react-native';
import Press from './Press';
import { useTheme, FONTS } from '../theme';

export function Primary({ children, onPress, icon, kind = 'dark', style, disabled }) {
  const t = useTheme();
  const bg = disabled ? t.sandDk : kind === 'kelp' ? t.kelp : t.ink;
  return (
    <Press onPress={disabled ? undefined : onPress} style={[{
      width: '100%', height: 54, borderRadius: 14, backgroundColor: bg,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.5 : 1, gap: 8,
    }, style]}>
      {icon}
      <Text style={{
        color: t.sand, fontFamily: FONTS.body, fontSize: 16, fontWeight: '500',
        letterSpacing: -0.2,
      }}>{children}</Text>
    </Press>
  );
}

export function Ghost({ children, onPress, style, color }) {
  const t = useTheme();
  return (
    <Press onPress={onPress} style={[{
      width: '100%', height: 52, borderRadius: 14, backgroundColor: 'transparent',
      borderWidth: 0.5, borderColor: t.lineStr,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    }, style]}>
      <Text style={{
        color: color || t.ink, fontFamily: FONTS.body, fontSize: 15.5, fontWeight: '500',
      }}>{children}</Text>
    </Press>
  );
}
