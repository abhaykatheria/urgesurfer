import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function Shell({ children, style }) {
  const t = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: t.sand }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative', overflow: 'hidden' },
});
