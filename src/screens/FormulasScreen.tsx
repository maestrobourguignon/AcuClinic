import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
  SectionList,
} from 'react-native';
import { formulas } from '../data/formulas';
import { protocols } from '../data/protocols';
import { allPointsComplete } from '../data/pointsComplete';
import { meridians } from '../data/meridians';
import { useAppStore } from '../store/useAppStore';
import { Formula, FormulaPoint, Protocol, PointTechnique, Point } from '../types';
import { useTheme } from '../theme/useTheme';

type ListItem =
  | { type: 'formula'; data: Formula }
  | { type: 'protocol'; data: Protocol };

export const FormulasScreen = () => {
  const theme = useTheme();
  const { customFormulas, addCustomFormula, deleteCustomFormula } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaDescription, setNewFormulaDescription] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<FormulaPoint[]>([]);

  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  // Para el selector de puntos en crear fórmula
  const [pointSearchQuery, setPointSearchQuery] = useState('');
  const [showPointPicker, setShowPointPicker] = useState(false);
  const [selectedMeridianFilter, setSelectedMeridianFilter] = useState<string | null>(null);
  const [tempTechnique, setTempTechnique] = useState<PointTechnique | undefined>(undefined);

  const allFormulas = useMemo(() => {
    return [...formulas, ...customFormulas];
  }, [customFormulas]);

  const categories = useMemo(() => {
    const cats = new Set(allFormulas.map(f => f.category || 'Otros'));
    return ['Todos', ...Array.from(cats)];
  }, [allFormulas]);

  const filteredFormulas = useMemo(() => {
    let result = allFormulas;

    if (selectedCategory && selectedCategory !== 'Todos') {
      result = result.filter(f => f.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          f.name.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query) ||
          f.points.some(p => {
            const point = allPointsComplete.find(pt => pt.id === p.pointId);
            return point && point.name.toLowerCase().includes(query);
          })
      );
    }

    return result;
  }, [allFormulas, selectedCategory, searchQuery]);

  const filteredProtocols = useMemo(() => {
    if (!searchQuery) return protocols;
    const query = searchQuery.toLowerCase();
    return protocols.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Datos unificados para SectionList
  const sections = useMemo(() => {
    const secs: { title: string; data: ListItem[] }[] = [];

    // Sección de fórmulas
    if (filteredFormulas.length > 0) {
      secs.push({
        title: 'Fórmulas',
        data: filteredFormulas.map(f => ({ type: 'formula' as const, data: f })),
      });
    }

    // Sección de protocolos
    if (filteredProtocols.length > 0) {
      secs.push({
        title: 'Protocolos',
        data: filteredProtocols.map(p => ({ type: 'protocol' as const, data: p })),
      });
    }

    return secs;
  }, [filteredFormulas, filteredProtocols]);

  const getPointDetails = (pointId: string) => {
    return allPointsComplete.find(p => p.id === pointId) || { name: pointId, id: pointId, number: 0, nameChinese: '', meridianId: '', location: '' };
  };

  const getMeridianName = (id: string) => {
    const meridian = meridians.find(m => m.id === id);
    return meridian ? meridian.name : id;
  };

  // Filtrar puntos para el selector
  const filteredPointsForPicker = useMemo(() => {
    let result = allPointsComplete;

    if (pointSearchQuery) {
      const query = pointSearchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.id.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.nameChinese.toLowerCase().includes(query)
      );
    }

    if (selectedMeridianFilter) {
      result = result.filter(p => p.meridianId === selectedMeridianFilter);
    }

    return result;
  }, [pointSearchQuery, selectedMeridianFilter]);

  const handleAddPointToFormula = (pointId: string, technique?: PointTechnique) => {
    // Verificar si ya está agregado
    if (selectedPoints.some(p => p.pointId === pointId)) {
      Alert.alert('Punto ya agregado', 'Este punto ya está en la fórmula');
      return;
    }
    setSelectedPoints([...selectedPoints, { pointId, technique }]);
    setTempTechnique(undefined);
  };

  const handlePointPress = (pointId: string) => {
    const point = allPointsComplete.find(p => p.id === pointId);
    if (point) {
      setSelectedPoint(point);
      setShowPointModal(true);
    }
  };

  const handleCreateFormula = () => {
    if (!newFormulaName.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    const newFormula: Formula = {
      id: `custom-${Date.now()}`,
      name: newFormulaName,
      description: newFormulaDescription || 'Fórmula personalizada',
      points: selectedPoints,
      category: 'Personal',
      isCustom: true,
    };

    addCustomFormula(newFormula);
    setShowCreateModal(false);
    setNewFormulaName('');
    setNewFormulaDescription('');
    setSelectedPoints([]);
    setPointSearchQuery('');
    setShowPointPicker(false);
    setSelectedMeridianFilter(null);
  };

  const handleDeleteFormula = (id: string) => {
    Alert.alert(
      'Eliminar Fórmula',
      '¿Estás seguro de que quieres eliminar esta fórmula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteCustomFormula(id) },
      ]
    );
  };

  const getTechniqueColor = (technique?: PointTechnique) => {
    switch (technique) {
      case 'tonificar': return theme.success;
      case 'sedar': return theme.error;
      case 'moxar': return theme.accent;
      default: return theme.textSecondary;
    }
  };

  const getTechniqueLabel = (technique?: PointTechnique) => {
    switch (technique) {
      case 'tonificar': return 'Tonificar';
      case 'sedar': return 'Sedar';
      case 'moxar': return 'Moxar';
      default: return 'Ninguna';
    }
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'formula') {
      const formula = item.data;
      return (
        <TouchableOpacity
          style={[styles.formulaItem, { backgroundColor: theme.surface }]}
          onPress={() => setSelectedFormula(formula)}
        >
          <View style={styles.formulaHeader}>
            <Text style={[styles.formulaName, { color: theme.text }]}>{formula.name}</Text>
            {formula.isCustom && (
              <TouchableOpacity
                onPress={() => handleDeleteFormula(formula.id)}
                style={styles.deleteButton}
              >
                <Text style={[styles.deleteButtonText, { color: theme.error }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.formulaDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {formula.description}
          </Text>
          <Text style={[styles.formulaPoints, { color: theme.textSecondary }]}>
            {formula.points.length} puntos
          </Text>
          {formula.category && (
            <View style={[styles.categoryBadge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.categoryText, { color: theme.primary }]}>{formula.category}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Protocol
    const protocol = item.data;
    return (
      <TouchableOpacity
        style={[styles.protocolItem, { backgroundColor: theme.surface }]}
        onPress={() => {
          setSelectedProtocol(protocol);
          setShowProtocolModal(true);
        }}
      >
        <Text style={[styles.protocolName, { color: theme.text }]}>{protocol.name}</Text>
        <Text style={[styles.protocolDescription, { color: theme.textSecondary }]} numberOfLines={3}>
          {protocol.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionHeaderTitle, { color: theme.text }]}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        {/* <Text style={[styles.title, { color: theme.text }]}>Fórmulas de Tratamiento</Text> */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={[styles.createButtonText, { color: theme.primaryText }]}>+ Nueva Fórmula</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Buscar fórmulas y protocolos..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={[styles.selectorContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>Filtrar por categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                { backgroundColor: theme.background },
                (selectedCategory === cat || (cat === 'Todos' && selectedCategory === null)) && { backgroundColor: theme.primary },
              ]}
              onPress={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: theme.textSecondary },
                (selectedCategory === cat || (cat === 'Todos' && selectedCategory === null)) && { color: theme.primaryText, fontWeight: 'bold' },
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No se encontraron resultados</Text>
        }
      />

      {/* Modal de detalle de fórmula */}
      <Modal visible={!!selectedFormula} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <ScrollView>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedFormula?.name}</Text>
              <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
                {selectedFormula?.description}
              </Text>

              <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Puntos (tocá para ver detalle):</Text>
              {selectedFormula?.points.map((point, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.pointRow, { borderBottomColor: theme.border }]}
                  onPress={() => handlePointPress(point.pointId)}
                >
                  <Text style={[styles.pointId, { color: theme.primary }]}>{point.pointId}</Text>
                  <Text style={[styles.pointName, { color: theme.text }]}>
                    {getPointDetails(point.pointId).name}
                  </Text>
                  <View style={[
                    styles.techniqueBadge,
                    { backgroundColor: getTechniqueColor(point.technique) }
                  ]}>
                    <Text style={styles.techniqueText}>
                      {getTechniqueLabel(point.technique)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeModalButton, { backgroundColor: theme.background }]}
              onPress={() => setSelectedFormula(null)}
            >
              <Text style={[styles.closeModalButtonText, { color: theme.textSecondary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de detalle de punto */}
      <Modal visible={showPointModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.pointModalContent, { backgroundColor: theme.surface }]}>
            <ScrollView>
              <View style={styles.pointModalHeader}>
                <Text style={[styles.pointModalId, { color: theme.primary }]}>{selectedPoint?.id}</Text>
                <Text style={[styles.pointModalName, { color: theme.text }]}>{selectedPoint?.name}</Text>
                <Text style={[styles.pointModalChinese, { color: theme.textSecondary }]}>{selectedPoint?.nameChinese}</Text>
                <Text style={[styles.pointModalMeridian, { color: theme.primary }]}>
                  {selectedPoint ? getMeridianName(selectedPoint.meridianId) : ''}
                </Text>
              </View>

              <Text style={[styles.pointModalLabel, { color: theme.textSecondary }]}>Ubicación:</Text>
              <Text style={[styles.pointModalText, { color: theme.text }]}>{selectedPoint?.location}</Text>

              {selectedPoint?.indications && (
                <>
                  <Text style={[styles.pointModalLabel, { color: theme.textSecondary }]}>Indicaciones:</Text>
                  <Text style={[styles.pointModalText, { color: theme.text }]}>
                    {typeof selectedPoint.indications === 'string'
                      ? selectedPoint.indications
                      : selectedPoint.indications.join(', ')}
                  </Text>
                </>
              )}

              {selectedPoint?.treatments && (
                <>
                  <Text style={[styles.pointModalLabel, { color: theme.textSecondary }]}>Tratamientos:</Text>
                  <View style={styles.treatmentsContainer}>
                    {Array.isArray(selectedPoint.treatments)
                      ? selectedPoint.treatments.map((t, i) => (
                        <View key={i} style={[styles.treatmentChip, { backgroundColor: theme.background }]}>
                          <Text style={[styles.treatmentText, { color: theme.primary }]}>{t}</Text>
                        </View>
                      ))
                      : <Text style={[styles.pointModalText, { color: theme.text }]}>{selectedPoint.treatments}</Text>
                    }
                  </View>
                </>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeModalButton, { backgroundColor: theme.background }]}
              onPress={() => setShowPointModal(false)}
            >
              <Text style={[styles.closeModalButtonText, { color: theme.textSecondary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de crear fórmula */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={[styles.createModalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.createModalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.createModalTitle, { color: theme.text }]}>Nueva Fórmula</Text>
            <TouchableOpacity onPress={() => {
              setShowCreateModal(false);
              setPointSearchQuery('');
              setShowPointPicker(false);
              setSelectedMeridianFilter(null);
            }}>
              <Text style={[styles.cancelText, { color: theme.error }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.createModalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newFormulaName}
              onChangeText={setNewFormulaName}
              placeholder="Nombre de la fórmula"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Descripción:</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newFormulaDescription}
              onChangeText={setNewFormulaDescription}
              placeholder="Descripción de la fórmula"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Puntos ({selectedPoints.length}):</Text>

            {/* Puntos seleccionados */}
            {selectedPoints.length > 0 && (
              <View style={styles.selectedPointsContainer}>
                {selectedPoints.map((item, index) => (
                  <View key={index} style={[styles.selectedPointRow, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.selectedPointId, { color: theme.primary }]}>{item.pointId}</Text>
                    <Text style={[styles.selectedPointName, { color: theme.text }]}>
                      {getPointDetails(item.pointId).name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newPoints = [...selectedPoints];
                        newPoints.splice(index, 1);
                        setSelectedPoints(newPoints);
                      }}
                    >
                      <Text style={[styles.removeText, { color: theme.error }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Botón para abrir selector de puntos */}
            <TouchableOpacity
              style={[styles.openPointPickerButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowPointPicker(!showPointPicker)}
            >
              <Text style={[styles.openPointPickerText, { color: theme.primaryText }]}>
                {showPointPicker ? 'Cerrar selector de puntos' : '+ Seleccionar Puntos'}
              </Text>
            </TouchableOpacity>

            {/* Selector de puntos */}
            {showPointPicker && (
              <View style={[styles.pointPickerContainer, { backgroundColor: theme.surface }]}>
                {/* Buscador */}
                <TextInput
                  style={[styles.pointSearchInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={pointSearchQuery}
                  onChangeText={setPointSearchQuery}
                  placeholder="Buscar por nombre o ID..."
                  placeholderTextColor={theme.textSecondary}
                />

                {/* Filtro por meridiano */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.meridianFilterScroll}>
                  <TouchableOpacity
                    style={[
                      styles.meridianFilterChip,
                      { backgroundColor: theme.background },
                      !selectedMeridianFilter && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => setSelectedMeridianFilter(null)}
                  >
                    <Text style={[
                      styles.meridianFilterText,
                      { color: theme.textSecondary },
                      !selectedMeridianFilter && { color: theme.primaryText, fontWeight: 'bold' }
                    ]}>Todos</Text>
                  </TouchableOpacity>
                  {meridians.map(m => (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.meridianFilterChip,
                        { backgroundColor: theme.background },
                        selectedMeridianFilter === m.id && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => setSelectedMeridianFilter(m.id)}
                    >
                      <Text style={[
                        styles.meridianFilterText,
                        { color: theme.textSecondary },
                        selectedMeridianFilter === m.id && { color: theme.primaryText, fontWeight: 'bold' }
                      ]}>{m.id}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Lista de puntos */}
                <ScrollView style={styles.pointPickerList}>
                  {filteredPointsForPicker.slice(0, 50).map(point => {
                    const isSelected = selectedPoints.some(p => p.pointId === point.id);
                    return (
                      <TouchableOpacity
                        key={point.id}
                        style={[
                          styles.pointPickerItem,
                          { backgroundColor: isSelected ? theme.primary + '20' : 'transparent', borderBottomColor: theme.border }
                        ]}
                        onPress={() => handleAddPointToFormula(point.id)}
                        disabled={isSelected}
                      >
                        <View style={styles.pointPickerInfo}>
                          <Text style={[styles.pointPickerId, { color: theme.primary }]}>{point.id}</Text>
                          <View style={styles.pointPickerDetails}>
                            <Text style={[styles.pointPickerName, { color: isSelected ? theme.primary : theme.text }]}>{point.name}</Text>
                            <Text style={[styles.pointPickerMeridian, { color: isSelected ? theme.primary : theme.textSecondary }]}>
                              {getMeridianName(point.meridianId)}
                            </Text>
                          </View>
                        </View>
                        {isSelected ? (
                          <View style={[styles.selectedCheck, { backgroundColor: theme.primary }]}>
                            <Text style={[styles.selectedCheckText, { color: theme.primaryText }]}>✓</Text>
                          </View>
                        ) : (
                          <Text style={[styles.addPointText, { color: theme.primary }]}>+</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  {filteredPointsForPicker.length > 50 && (
                    <Text style={[styles.morePointsText, { color: theme.textSecondary }]}>
                      Mostrando 50 de {filteredPointsForPicker.length} puntos
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleCreateFormula}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryText }]}>Guardar Fórmula</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal de detalle de protocolo */}
      <Modal visible={showProtocolModal} animationType="slide">
        <SafeAreaView style={[styles.createModalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.createModalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.createModalTitle, { color: theme.text }]}>{selectedProtocol?.name}</Text>
            <TouchableOpacity onPress={() => setShowProtocolModal(false)}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.createModalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.protocolDetailDescription, { color: theme.text }]}>
              {selectedProtocol?.description}
            </Text>
          </ScrollView>
        </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  selectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  selectorLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  selectorScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formulaItem: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formulaName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  formulaDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  formulaPoints: {
    fontSize: 12,
    marginTop: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  protocolItem: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  protocolName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  protocolDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pointId: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
  pointName: {
    flex: 1,
    fontSize: 14,
  },
  techniqueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  techniqueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontWeight: 'bold',
  },
  // Estilos del modal de punto
  pointModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  pointModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pointModalId: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pointModalName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pointModalChinese: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 2,
  },
  pointModalMeridian: {
    fontSize: 14,
    marginTop: 4,
  },
  pointModalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  pointModalText: {
    fontSize: 16,
    lineHeight: 22,
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
  createModalContainer: {
    flex: 1,
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  createModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  createModalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPointId: {
    fontWeight: 'bold',
    width: 50,
  },
  selectedPointName: {
    flex: 1,
  },
  smallTechniqueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  smallTechniqueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyPointsText: {
    textAlign: 'center',
    marginTop: 16,
  },
  selectedPointsContainer: {
    marginBottom: 12,
  },
  openPointPickerButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  openPointPickerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pointPickerContainer: {
    borderRadius: 12,
    padding: 12,
    maxHeight: 400,
  },
  pointSearchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  meridianFilterScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  meridianFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  meridianFilterText: {
    fontSize: 12,
  },
  pointPickerList: {
    maxHeight: 250,
  },
  pointPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  pointPickerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pointPickerId: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
  pointPickerDetails: {
    flex: 1,
  },
  pointPickerName: {
    fontSize: 14,
  },
  pointPickerMeridian: {
    fontSize: 11,
  },
  addPointText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  morePointsText: {
    textAlign: 'center',
    padding: 12,
    fontSize: 12,
  },
  saveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  protocolDetailDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});
