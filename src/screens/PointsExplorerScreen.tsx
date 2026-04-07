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
import { useTheme } from '../theme/useTheme';
import { Ionicons } from '@expo/vector-icons';

export const PointsExplorerScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeridian, setSelectedMeridian] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [showMeridianFilter, setShowMeridianFilter] = useState(false);

  const filteredPoints = useMemo(() => {
    let result = allPointsComplete;

    // Si hay búsqueda, buscar en TODOS los puntos (ignorar filtro de meridiano)
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
    } else if (selectedMeridian) {
      // Si no hay búsqueda, aplicar filtro de meridiano
      result = result.filter(p => p.meridianId === selectedMeridian);
    }

    return result;
  }, [searchQuery, selectedMeridian]);

  const getMeridianName = (id: string) => {
    const meridian = meridians.find(m => m.id === id);
    return meridian ? meridian.name : id;
  };

  const activeFilterCount = selectedMeridian ? 1 : 0;

  const renderPoint = ({ item }: { item: Point }) => (
    <TouchableOpacity
      style={[
        styles.pointItem,
        { backgroundColor: theme.surface },
        selectedPoint?.id === item.id && { borderColor: theme.primary, borderWidth: 2 },
      ]}
      onPress={() => setSelectedPoint(item)}
    >
      <View style={styles.pointHeader}>
        <Text style={[styles.pointId, { color: theme.primary }]}>{item.id}</Text>
        <Text style={[styles.pointName, { color: theme.text }]}>{item.name}</Text>
      </View>
      <Text style={[styles.pointChinese, { color: theme.textSecondary }]}>{item.nameChinese}</Text>
      <Text style={[styles.pointMeridian, { color: theme.textSecondary }]}>
        {getMeridianName(item.meridianId)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header con búsqueda */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Explorador de Puntos</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
          placeholder="Buscar puntos en todos los meridianos..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Barra desplegable de filtro por meridiano */}
      <View style={[styles.filterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowMeridianFilter(!showMeridianFilter)}
        >
          <Ionicons name="filter" size={18} color={theme.primary} />
          <Text style={[styles.filterToggleText, { color: theme.text }]}>
            Filtrar por meridiano
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: theme.primary }]}>
              <Text style={[styles.filterBadgeText, { color: theme.primaryText }]}>{activeFilterCount}</Text>
            </View>
          )}
          <Ionicons
            name={showMeridianFilter ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        {showMeridianFilter && (
          <View style={styles.filterContent}>
            <TouchableOpacity
              style={[
                styles.meridianChip,
                { backgroundColor: theme.background },
                selectedMeridian === null && { backgroundColor: theme.primary },
              ]}
              onPress={() => setSelectedMeridian(null)}
            >
              <Text style={[
                styles.meridianChipText,
                { color: theme.textSecondary },
                selectedMeridian === null && { color: theme.primaryText, fontWeight: 'bold' },
              ]}>Todos</Text>
            </TouchableOpacity>
            <View style={styles.meridianGrid}>
              {meridians.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.meridianChip,
                    { backgroundColor: theme.background },
                    selectedMeridian === m.id && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setSelectedMeridian(m.id)}
                >
                  <Text style={[
                    styles.meridianChipText,
                    { color: theme.textSecondary },
                    selectedMeridian === m.id && { color: theme.primaryText, fontWeight: 'bold' },
                  ]}>{m.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Contador de resultados */}
      <View style={[styles.resultsBar, { backgroundColor: theme.background }]}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredPoints.length} punto{filteredPoints.length !== 1 ? 's' : ''}
          {searchQuery && ' · buscando en todos los meridianos'}
          {!searchQuery && selectedMeridian && ` · ${getMeridianName(selectedMeridian)}`}
        </Text>
        {searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={[styles.clearSearch, { color: theme.primary }]}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de puntos */}
      <FlatList
        data={filteredPoints}
        keyExtractor={item => item.id}
        renderItem={renderPoint}
        style={styles.pointsList}
        contentContainerStyle={styles.pointsListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No se encontraron puntos</Text>
            {searchQuery && (
              <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Intentá con otro término de búsqueda
              </Text>
            )}
          </View>
        }
      />

      {/* Detalle del punto seleccionado */}
      {selectedPoint && (
        <View style={[styles.detailPanel, { backgroundColor: theme.surface, borderTopColor: theme.primary }]}>
          <View style={styles.detailHeader}>
            <Text style={[styles.detailId, { color: theme.primary }]}>{selectedPoint.id}</Text>
            <Text style={[styles.detailName, { color: theme.text }]}>{selectedPoint.name}</Text>
            <Text style={[styles.detailChinese, { color: theme.textSecondary }]}>{selectedPoint.nameChinese}</Text>
            <Text style={[styles.detailMeridian, { color: theme.primary }]}>
              {getMeridianName(selectedPoint.meridianId)}
            </Text>
          </View>

          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Ubicación:</Text>
          <Text style={[styles.detailLocation, { color: theme.text }]}>{selectedPoint.location}</Text>

          {selectedPoint.indications && (
            <>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Indicaciones:</Text>
              <Text style={[styles.detailIndications, { color: theme.text }]}>
                {typeof selectedPoint.indications === 'string'
                  ? selectedPoint.indications
                  : selectedPoint.indications.join(', ')}
              </Text>
            </>
          )}

          {selectedPoint.treatments && (
            <>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Tratamientos:</Text>
              <View style={styles.treatmentsContainer}>
                {Array.isArray(selectedPoint.treatments)
                  ? selectedPoint.treatments.map((t, i) => (
                    <View key={i} style={[styles.treatmentChip, { backgroundColor: theme.background }]}>
                      <Text style={[styles.treatmentText, { color: theme.primary }]}>{t}</Text>
                    </View>
                  ))
                  : <Text style={[styles.detailTreatments, { color: theme.text }]}>{selectedPoint.treatments}</Text>
                }
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.background }]}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  filterBar: {
    borderBottomWidth: 1,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContent: {
    padding: 12,
    paddingTop: 0,
  },
  meridianGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  meridianChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  meridianChipText: {
    fontSize: 13,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 12,
  },
  clearSearch: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointsList: {
    flex: 1,
  },
  pointsListContent: {
    padding: 8,
  },
  pointItem: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  pointName: {
    fontSize: 16,
  },
  pointChinese: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  pointMeridian: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  detailPanel: {
    padding: 16,
    borderTopWidth: 2,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  detailId: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailChinese: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  detailMeridian: {
    fontSize: 14,
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  detailLocation: {
    fontSize: 16,
    lineHeight: 22,
  },
  detailIndications: {
    fontSize: 14,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  treatmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailTreatments: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});
