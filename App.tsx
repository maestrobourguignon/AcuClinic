import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import { useThemeMode } from './src/theme/useTheme';

export default function App() {
  const loadAllData = useAppStore((s) => s.loadAllData);
  const isLoading = useAppStore((s) => s.isLoading);
  const { isDark } = useThemeMode();

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {isLoading ? null : <AppNavigator />}
    </SafeAreaProvider>
  );
}
