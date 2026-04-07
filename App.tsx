import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import { useTheme } from './src/theme/useTheme';

export default function App() {
  const { loadAllData, isLoading } = useAppStore();
  const [isReady, setIsReady] = useState(false);
  const colors = useTheme();

  useEffect(() => {
    const initializeApp = async () => {
      await loadAllData();
      setIsReady(true);
    };
    initializeApp();
  }, []);

  if (!isReady || isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando AcuClinic...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="#13ec80" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
