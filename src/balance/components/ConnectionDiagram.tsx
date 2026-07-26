import React from 'react';
import { Image, StyleSheet, View, ImageRequireSource } from 'react-native';
import { ConnectionType } from '../types';

const IMAGE_MAP: Record<ConnectionType, ImageRequireSource> = {
  empe: require('../../../assets/m_empe.png'),
  deitado: require('../../../assets/m_deitado.png'),
  quadrado: require('../../../assets/m_square.png'),
};

interface ConnectionDiagramProps {
  type: ConnectionType;
  width?: number;
  height?: number;
}

export const ConnectionDiagram: React.FC<ConnectionDiagramProps> = ({
  type,
  width = 90,
  height = 90,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={IMAGE_MAP[type]}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
