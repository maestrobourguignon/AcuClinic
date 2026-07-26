import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MERIDIANS } from '../data/meridians';
import { MeridianId } from '../types';
import { useTheme } from '../../theme/useTheme';

interface StaticResultCardProps {
  channelId: string;
  positions: number[];
  displayIndex: number;
}

export const StaticResultCard: React.FC<StaticResultCardProps> = ({
  channelId,
  positions,
  displayIndex,
}) => {
  const theme = useTheme();
  const meridian = MERIDIANS[channelId as MeridianId];

  if (!meridian) {
    return null;
  }

  const symbols: string[] = [];

  if (positions.includes(1) || positions.includes(5)) {
    symbols.push('X');
  }
  if (positions.includes(3)) {
    symbols.push('—');
  }
  if (positions.includes(2) || positions.includes(4)) {
    symbols.push('|');
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: meridian.color, borderColor: theme.border },
      ]}
    >
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{displayIndex}</Text>
      </View>
      <Text style={[styles.meridianName, { color: meridian.textColor }]}>
        {meridian.name}
      </Text>
      {symbols.length > 0 && (
        <Text style={[styles.symbols, { color: meridian.textColor }]}>
          {symbols.join(' ')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginHorizontal: 20,
  },
  indexBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  meridianName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  symbols: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 8,
  },
});
