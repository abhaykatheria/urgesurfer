import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const make = (children) => ({ s = 20, c = 'currentColor' }) => (
  <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    {children(c)}
  </Svg>
);

export const Icon = {
  Wave: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12c2 0 2-3 5-3s3 3 5 3 2-3 5-3 3 3 5 3" />
      <Path d="M2 17c2 0 2-3 5-3s3 3 5 3 2-3 5-3 3 3 5 3" opacity={0.5} />
    </Svg>
  ),
  Plus: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  Close: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round">
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  ),
  Camera: ({ s = 22, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <Circle cx={12} cy={13} r={3.5} />
    </Svg>
  ),
  Chart: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Svg>
  ),
  Home: ({ s = 22, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 11l9-7 9 7v10H3z" />
    </Svg>
  ),
  User: ({ s = 22, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c1-4 4-6 8-6s7 2 8 6" strokeLinecap="round" />
    </Svg>
  ),
  Check: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12l5 5 11-12" />
    </Svg>
  ),
  Share: ({ s = 20, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6" />
    </Svg>
  ),
  Back: ({ s = 22, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 4l-8 8 8 8" />
    </Svg>
  ),
  ArrowRight: ({ s = 18, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 5l7 7-7 7" />
    </Svg>
  ),
  Sun: ({ s = 18, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={3.6} />
      <Path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </Svg>
  ),
  Moon: ({ s = 18, c = '#000' }) => (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.5 14.4A8.5 8.5 0 1 1 9.6 3.5a7 7 0 0 0 10.9 10.9z" />
    </Svg>
  ),
};
