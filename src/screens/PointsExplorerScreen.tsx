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
  Modal,
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
  const [showIndicationsModal, setShowIndicationsModal] = useState(false);

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
        {/* <Text style={[styles.title, { color: theme.text }]}>Explorador de Puntos</Text> */}
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

      {/* Modal de detalle del punto */}
      <Modal visible={!!selectedPoint} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <Text style={[styles.detailId, { color: theme.primary }]}>{selectedPoint?.id}</Text>
                <Text style={[styles.detailName, { color: theme.text }]}>{selectedPoint?.name}</Text>
                {selectedPoint?.detail?.namePinyin && (
                  <Text style={[styles.detailPinyin, { color: theme.textSecondary }]}>{selectedPoint.detail.namePinyin}</Text>
                )}
                <Text style={[styles.detailChinese, { color: theme.textSecondary }]}>{selectedPoint?.nameChinese}</Text>
                <Text style={[styles.detailMeridian, { color: theme.primary }]}>
                  {selectedPoint ? getMeridianName(selectedPoint.meridianId) : ''}
                </Text>
              </View>

              {/* Ubicación anatómica */}
              <View style={styles.section}>
                <Text style={[styles.detailLabel, { color: theme.primary }]}>Ubicación Anatómica</Text>
                <Text style={[styles.detailText, { color: theme.text }]}>
                  {selectedPoint?.detail?.anatomicalLocation || selectedPoint?.location}
                </Text>
              </View>

              {/* Indicaciones clínicas — botón que abre sub-modal */}
              {selectedPoint?.detail && (() => {
                const d = selectedPoint.detail!;
                const totalItems = (d.indicationsRespiratory?.length ?? 0) + (d.indicationsLocal?.length ?? 0) + (d.indicationsGeneral?.length ?? 0) + (d.indicationsMental?.length ?? 0);
                if (totalItems === 0) return null;
                return (
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={[styles.indicationsButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                      onPress={() => setShowIndicationsModal(true)}
                    >
                      <Ionicons name="medical-outline" size={20} color={theme.primary} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.indicationsButtonText, { color: theme.text }]}>Indicaciones Clínicas</Text>
                        <Text style={[styles.indicationsButtonSub, { color: theme.textSecondary }]}>
                          {totalItems} indicación{totalItems !== 1 ? 'es' : ''} · Tocá para ver
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                );
              })()}

              {/* Resto del detalle del punto */}
              {selectedPoint?.detail && (
                <>
                  {/* Clasificación energética */}
                  {selectedPoint.detail.energeticClassification && selectedPoint.detail.energeticClassification.length > 0 && (
                    <View style={styles.section}>
                      <Text style={[styles.detailLabel, { color: theme.primary }]}>Clasificación Energética</Text>
                      {selectedPoint.detail.energeticClassification.map((cls, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={[styles.bullet, { color: theme.accent }]}>◆</Text>
                          <Text style={[styles.bulletText, { color: theme.text }]}>{cls}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Acciones energéticas */}
                  {selectedPoint.detail.energeticActions && selectedPoint.detail.energeticActions.length > 0 && (
                    <View style={styles.section}>
                      <Text style={[styles.detailLabel, { color: theme.primary }]}>Acciones Energéticas</Text>
                      {selectedPoint.detail.energeticActions.map((act, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={[styles.bullet, { color: theme.success }]}>▸</Text>
                          <Text style={[styles.bulletText, { color: theme.text }]}>{act}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Técnica de punción */}
                  {(selectedPoint.detail.punctureDirection || selectedPoint.detail.punctureDepth) && (
                    <View style={styles.section}>
                      <Text style={[styles.detailLabel, { color: theme.primary }]}>Técnica de Punción</Text>
                      {selectedPoint.detail.punctureDirection && (
                        <Text style={[styles.detailText, { color: theme.text }]}>Dirección: {selectedPoint.detail.punctureDirection}</Text>
                      )}
                      {selectedPoint.detail.punctureDepth && (
                        <Text style={[styles.detailText, { color: theme.text }]}>Profundidad: {selectedPoint.detail.punctureDepth}</Text>
                      )}
                      {selectedPoint.detail.moxa && (
                        <Text style={[styles.detailText, { color: theme.text }]}>Moxibustión: {selectedPoint.detail.moxa}</Text>
                      )}
                    </View>
                  )}

                  {/* Precauciones */}
                  {selectedPoint.detail.precautions && (
                    <View style={[styles.section, styles.precautionSection]}>
                      <Text style={[styles.detailLabel, { color: theme.error }]}>⚠ Precaución</Text>
                      <Text style={[styles.detailText, { color: theme.error }]}>{selectedPoint.detail.precautions}</Text>
                    </View>
                  )}

                  {/* Resonancia del nombre */}
                  {selectedPoint.detail.nameMeaning && (
                    <View style={styles.section}>
                      <Text style={[styles.detailLabel, { color: theme.primary }]}>Resonancia del Nombre</Text>
                      {selectedPoint.detail.nameBreakdown && (
                        <Text style={[styles.detailText, { color: theme.textSecondary, fontStyle: 'italic' }]}>
                          {selectedPoint.detail.nameBreakdown}
                        </Text>
                      )}
                      <Text style={[styles.detailText, { color: theme.text, marginTop: 4 }]}>
                        {selectedPoint.detail.nameMeaning}
                      </Text>
                    </View>
                  )}
                </>
              )}

              {/* Indicaciones genéricas (para puntos sin detail) */}
              {!selectedPoint?.detail && selectedPoint?.indications && (
                <View style={styles.section}>
                  <TouchableOpacity
                    style={[styles.indicationsButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                    onPress={() => setShowIndicationsModal(true)}
                  >
                    <Ionicons name="medical-outline" size={20} color={theme.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.indicationsButtonText, { color: theme.text }]}>Indicaciones Clínicas</Text>
                      <Text style={[styles.indicationsButtonSub, { color: theme.textSecondary }]}>Tocá para ver</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              {selectedPoint?.detail && selectedPoint?.treatments && (
                <View style={styles.section}>
                  <Text style={[styles.detailLabel, { color: theme.primary }]}>Tratamientos</Text>
                  <View style={styles.treatmentsContainer}>
                    {Array.isArray(selectedPoint.treatments)
                      ? selectedPoint.treatments.map((t, i) => (
                        <View key={i} style={[styles.treatmentChip, { backgroundColor: theme.background }]}>
                          <Text style={[styles.treatmentText, { color: theme.primary }]}>{t}</Text>
                        </View>
                      ))
                      : <Text style={[styles.detailText, { color: theme.text }]}>{selectedPoint.treatments}</Text>
                    }
                  </View>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setSelectedPoint(null)}
            >
              <Text style={[styles.closeButtonText, { color: theme.primaryText }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sub-modal de indicaciones clínicas */}
      <Modal visible={showIndicationsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.indicationsModalHeader}>
              <Text style={[styles.indicationsModalTitle, { color: theme.text }]}>
                Indicaciones — {selectedPoint?.id}
              </Text>
              <Text style={[styles.indicationsModalSubtitle, { color: theme.textSecondary }]}>
                {selectedPoint?.name}
              </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedPoint?.detail ? (
                <>
                  {selectedPoint.detail.indicationsRespiratory && selectedPoint.detail.indicationsRespiratory.length > 0 && (
                    <View style={styles.indicationsCategory}>
                      <View style={[styles.categoryHeader, { backgroundColor: theme.primary + '18' }]}>
                        <Ionicons name="fitness-outline" size={18} color={theme.primary} />
                        <Text style={[styles.categoryTitle, { color: theme.primary }]}>Respiratorias</Text>
                      </View>
                      {selectedPoint.detail.indicationsRespiratory.map((ind, i) => (
                        <View key={i} style={styles.indicationItem}>
                          <Text style={[styles.indicationDot, { color: theme.primary }]}>•</Text>
                          <Text style={[styles.indicationText, { color: theme.text }]}>{ind}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedPoint.detail.indicationsLocal && selectedPoint.detail.indicationsLocal.length > 0 && (
                    <View style={styles.indicationsCategory}>
                      <View style={[styles.categoryHeader, { backgroundColor: theme.accent + '18' }]}>
                        <Ionicons name="body-outline" size={18} color={theme.accent} />
                        <Text style={[styles.categoryTitle, { color: theme.accent }]}>Locales / Canal</Text>
                      </View>
                      {selectedPoint.detail.indicationsLocal.map((ind, i) => (
                        <View key={i} style={styles.indicationItem}>
                          <Text style={[styles.indicationDot, { color: theme.accent }]}>•</Text>
                          <Text style={[styles.indicationText, { color: theme.text }]}>{ind}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedPoint.detail.indicationsGeneral && selectedPoint.detail.indicationsGeneral.length > 0 && (
                    <View style={styles.indicationsCategory}>
                      <View style={[styles.categoryHeader, { backgroundColor: theme.success + '18' }]}>
                        <Ionicons name="people-outline" size={18} color={theme.success} />
                        <Text style={[styles.categoryTitle, { color: theme.success }]}>Generales</Text>
                      </View>
                      {selectedPoint.detail.indicationsGeneral.map((ind, i) => (
                        <View key={i} style={styles.indicationItem}>
                          <Text style={[styles.indicationDot, { color: theme.success }]}>•</Text>
                          <Text style={[styles.indicationText, { color: theme.text }]}>{ind}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedPoint.detail.indicationsMental && selectedPoint.detail.indicationsMental.length > 0 && (
                    <View style={styles.indicationsCategory}>
                      <View style={[styles.categoryHeader, { backgroundColor: '#9C27B0' + '18' }]}>
                        <Ionicons name="brain-outline" size={18} color="#9C27B0" />
                        <Text style={[styles.categoryTitle, { color: '#9C27B0' }]}>Psíquicas / Mentales</Text>
                      </View>
                      {selectedPoint.detail.indicationsMental.map((ind, i) => (
                        <View key={i} style={styles.indicationItem}>
                          <Text style={[styles.indicationDot, { color: '#9C27B0' }]}>•</Text>
                          <Text style={[styles.indicationText, { color: theme.text }]}>{ind}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                /* Fallback para puntos sin detail */
                <View style={styles.indicationsCategory}>
                  <View style={[styles.categoryHeader, { backgroundColor: theme.primary + '18' }]}>
                    <Ionicons name="medical-outline" size={18} color={theme.primary} />
                    <Text style={[styles.categoryTitle, { color: theme.primary }]}>Indicaciones</Text>
                  </View>
                  {Array.isArray(selectedPoint?.indications) ? (
                    selectedPoint!.indications!.map((ind, i) => (
                      <View key={i} style={styles.indicationItem}>
                        <Text style={[styles.indicationDot, { color: theme.primary }]}>•</Text>
                        <Text style={[styles.indicationText, { color: theme.text }]}>{ind}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.indicationItem}>
                      <Text style={[styles.indicationDot, { color: theme.primary }]}>•</Text>
                      <Text style={[styles.indicationText, { color: theme.text }]}>{selectedPoint?.indications as string}</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowIndicationsModal(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.primaryText }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailId: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  detailPinyin: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailChinese: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailMeridian: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
  section: {
    marginTop: 14,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  precautionSection: {
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  indicationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  indicationsButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  indicationsButtonSub: {
    fontSize: 12,
    marginTop: 2,
  },
  indicationsModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  indicationsModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicationsModalSubtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
  indicationsCategory: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  indicationItem: {
    flexDirection: 'row',
    paddingLeft: 12,
    marginBottom: 4,
    paddingRight: 8,
  },
  indicationDot: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  indicationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
