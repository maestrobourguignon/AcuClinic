import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Combination } from '../types';
import { MERIDIANS } from '../data/meridians';
import { ConnectionDiagram } from './ConnectionDiagram';
import { useTheme } from '../../theme/useTheme';

interface CombinationCardProps {
  combination: Combination;
}

export const CombinationCard: React.FC<CombinationCardProps> = ({
  combination,
}) => {
  const theme = useTheme();
  const { point1, point2, point3, point4, connectionType } = combination;

  const meridian1 = MERIDIANS[point1];
  const meridian2 = MERIDIANS[point2];
  const meridian3 = MERIDIANS[point3];
  const meridian4 = MERIDIANS[point4];

  const renderMeridianLabel = (meridian: typeof meridian1) => (
    <View
      style={[
        styles.meridianLabel,
        { backgroundColor: meridian.color, borderColor: theme.border },
      ]}
    >
      <Text
        style={[
          styles.meridianText,
          { color: meridian.textColor },
        ]}
      >
        {meridian.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {renderMeridianLabel(meridian1)}
        {renderMeridianLabel(meridian2)}
      </View>

      <View style={styles.diagramRow}>
        <ConnectionDiagram type={connectionType} width={130} height={130} />
      </View>

      <View style={styles.labelRow}>
        {renderMeridianLabel(meridian3)}
        {renderMeridianLabel(meridian4)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  diagramRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  meridianLabel: {
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    minWidth: 100,
    alignItems: 'center',
  },
  meridianText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
