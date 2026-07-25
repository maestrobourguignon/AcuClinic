// Simple theme hook with toggle support
import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

let globalTheme: ThemeMode = 'system';
const listeners: Set<() => void> = new Set();

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  
  const [mode, setMode] = useState<ThemeMode>(globalTheme);
  
  useEffect(() => {
    const listener = () => setMode(globalTheme);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  const isDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
  return isDark ? darkColors : lightColors;
};

export const useThemeMode = () => {
  const [mode, setMode] = useState<ThemeMode>(globalTheme);
  const systemColorScheme = useColorScheme();
  
  useEffect(() => {
    const listener = () => setMode(globalTheme);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  const isDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
  
  return {
    mode,
    isDark,
    setMode: (newMode: ThemeMode) => {
      globalTheme = newMode;
      listeners.forEach(l => l());
    },
    toggle: () => {
      const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
      globalTheme = next;
      listeners.forEach(l => l());
    }
  };
};
