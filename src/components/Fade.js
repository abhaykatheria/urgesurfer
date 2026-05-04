import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function Fade({ k, children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    opacity.setValue(0);
    translate.setValue(4);
    Animated.parallel([
      Animated.timing(opacity,   { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [k]);

  return (
    <Animated.View style={{
      flex: 1,
      opacity,
      transform: [{ translateY: translate }],
    }}>
      {children}
    </Animated.View>
  );
}
