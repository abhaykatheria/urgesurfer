import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

// Keys that affect how a node lays out within its parent. These belong on the
// outer Pressable so siblings can size correctly (e.g. flex:1 in a row).
// Visual props (bg, padding, border, etc.) stay on the inner Animated.View
// so the press-scale transform animates them.
const LAYOUT_KEYS = [
  'flex', 'flexBasis', 'flexGrow', 'flexShrink',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'alignSelf',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'marginHorizontal', 'marginVertical', 'marginStart', 'marginEnd',
  'position', 'top', 'right', 'bottom', 'left', 'zIndex',
];

function splitStyle(style) {
  const flat = StyleSheet.flatten(style) || {};
  const layout = {};
  const visual = {};
  for (const k in flat) {
    (LAYOUT_KEYS.includes(k) ? layout : visual)[k] = flat[k];
  }
  return { layout, visual };
}

export default function Press({ children, onPress, style, hitSlop }) {
  const scale = useRef(new Animated.Value(1)).current;
  const animTo = (v) => Animated.timing(scale, {
    toValue: v, duration: 80, useNativeDriver: true,
  }).start();
  const { layout, visual } = splitStyle(style);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animTo(0.97)}
      onPressOut={() => animTo(1)}
      hitSlop={hitSlop}
      style={layout}
    >
      <Animated.View style={[{ flex: 1 }, visual, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
