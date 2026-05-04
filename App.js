import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/state';
import { useTheme } from './src/theme';

import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Picker from './src/screens/Picker';
import Timer from './src/screens/Timer';
import Caved from './src/screens/Caved';
import Success from './src/screens/Success';
import Selfie from './src/screens/Selfie';
import Overlay from './src/screens/Overlay';
import Stats from './src/screens/Stats';
import History from './src/screens/History';
import Profile from './src/screens/Profile';
import Album from './src/screens/Album';

import Fade from './src/components/Fade';
import { View } from 'react-native';

function Router() {
  const { s, loaded } = useApp();
  const t = useTheme();

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: t.sand }} />;
  }

  const Screen =
    s.screen === 'home'       ? Home    :
    s.screen === 'picker'     ? Picker  :
    s.screen === 'timer'      ? Timer   :
    s.screen === 'caved'      ? Caved   :
    s.screen === 'success'    ? Success :
    s.screen === 'selfie'     ? Selfie  :
    s.screen === 'overlay'    ? Overlay :
    s.screen === 'history'    ? History :
    s.screen === 'profile'    ? Profile :
    s.screen === 'stats'      ? Stats   :
    s.screen === 'album'      ? Album   :
    s.screen === 'onboarding' ? Onboarding :
    Home;

  return (
    <View style={{ flex: 1, backgroundColor: t.sand }}>
      <Fade k={s.screen}>
        <Screen />
      </Fade>
    </View>
  );
}

function ThemedStatusBar() {
  const { theme } = useApp();
  return <StatusBar style={theme === 'light' ? 'dark' : 'light'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemedStatusBar />
        <Router />
      </AppProvider>
    </SafeAreaProvider>
  );
}
