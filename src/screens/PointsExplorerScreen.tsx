import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { allPointsComplete } from '../data/pointsComplete';
import { meridians } from '../data/meridians';
import { Point } from '../types';

export const PointsExplorerScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeridian, setSelectedMeridian] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const filteredPoints = useMemo(() => {
    let result = allPointsComplete;

    if (selectedMeridian) {
      result = result.filter(p => p.meridianId === selectedMeridian);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.nameChinese.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          (typeof p.indications === 'string' && p.indications.toLowerCase().includes(query)) ||
          (typeof p.treatments === 'string' && p.treatments.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, selectedMeridian]);

  const getMeridianName = (id: string) => {
    const meridian = meridians.find(m => m.id === id);
    return meridian ? meridian.name : id;
  };

  const renderPoint = ({ item }: { item: Point }) => (
    <TouchableOpacity
      style={[
        styles.pointItem,
        selectedPoint?.id === item.id && styles.pointItemSelected,
      ]}
      onPress={() => setSelectedPoint(item)}
    >
      <View style={styles.pointHeader}>
        <Text style={styles.pointId}>{item.id}</Text>
        <Text style={styles.pointName}>{item.name}</Text>
      </View>
      <Text style={styles.pointChinese}>{item.nameChinese}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorador de Puntos</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar puntos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      {/* Selector de meridiano */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Filtrar por meridiano:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          <TouchableOpacity
            style={[
              styles.meridianChip,
              selectedMeridian === null && styles.meridianChipSelected,
            ]}
            onPress={() => setSelectedMeridian(null)}
          >
            <Text style={[
              styles.meridianChipText,
              selectedMeridian === null && styles.meridianChipTextSelected,
            ]}>Todos</Text>
          </TouchableOpacity>
          {meridians.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.meridianChip,
                selectedMeridian === m.id && styles.meridianChipSelected,
              ]}
              onPress={() => setSelectedMeridian(m.id)}
            >
              <Text style={[
                styles.meridianChipText,
                selectedMeridian === m.id && styles.meridianChipTextSelected,
              ]}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de puntos */}
      <FlatList
        data={filteredPoints}
        keyExtractor={item => item.id}
        renderItem={renderPoint}
        style={styles.pointsList}
        contentContainerStyle={styles.pointsListContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron puntos</Text>
        }
      />

      {/* Detalle del punto seleccionado */}
      {selectedPoint && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailId}>{selectedPoint.id}</Text>
            <Text style={styles.detailName}>{selectedPoint.name}</Text>
            <Text style={styles.detailChinese}>{selectedPoint.nameChinese}</Text>
            <Text style={styles.detailMeridian}>{getMeridianName(selectedPoint.meridianId)}</Text>
          </View>

          <Text style={styles.detailLabel}>Ubicación:</Text>
          <Text style={styles.detailLocation}>{selectedPoint.location}</Text>

          {selectedPoint.indications && (
            <>
              <Text style={styles.detailLabel}>Indicaciones:</Text>
              <Text style={styles.detailIndications}>
                {typeof selectedPoint.indications === 'string'
                  ? selectedPoint.indications
                  : selectedPoint.indications.join(', ')}
              </Text>
            </>
          )}

          {selectedPoint.treatments && (
            <>
              <Text style={styles.detailLabel}>Tratamientos:</Text>
              <View style={styles.treatmentsContainer}>
                {Array.isArray(selectedPoint.treatments)
                  ? selectedPoint.treatments.map((t, i) => (
                    <View key={i} style={styles.treatmentChip}>
                      <Text style={styles.treatmentText}>{t}</Text>
                    </View>
                  ))
                  : <Text style={styles.detailTreatments}>{selectedPoint.treatments}</Text>
                }
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectorContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  selectorScroll: {
    flexGrow: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  meridianList: {
    backgroundColor: '#fff',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  meridianListContent: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexGrow: 0,
    alignItems: 'center',
  },
  meridianChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    flexGrow: 0,
    flexShrink: 0,
  },
  meridianChipSelected: {
    backgroundColor: '#13ec80',
  },
  meridianChipText: {
    fontSize: 14,
    color: '#666',
  },
  meridianChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pointsList: {
    flex: 1,
  },
  pointsListContent: {
    padding: 8,
  },
  pointItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointItemSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#13ec80',
    borderWidth: 2,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#13ec80',
    marginRight: 8,
  },
  pointName: {
    fontSize: 16,
    color: '#333',
  },
  pointChinese: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  detailPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#13ec80',
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  detailId: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#13ec80',
  },
  detailName: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  detailChinese: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  detailMeridian: {
    fontSize: 14,
    color: '#13ec80',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 12,
  },
  detailLocation: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  detailIndications: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
  treatmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginHorizontal: -4,
  },
  treatmentChip: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  treatmentText: {
    color: '#13ec80',
    fontSize: 12,
    fontWeight: '600',
  },
  detailTreatments: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
});
