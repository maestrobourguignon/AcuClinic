import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { formulas } from '../data/formulas';
import { protocols } from '../data/protocols';
import { allPoints } from '../data/points';
import { useAppStore } from '../store/useAppStore';
import { Formula, FormulaPoint, Protocol, PointTechnique } from '../types';
import { useTheme } from '../theme/useTheme';

export const FormulasScreen = () => {
  const theme = useTheme();
  const { customFormulas, addCustomFormula, deleteCustomFormula } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaDescription, setNewFormulaDescription] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<FormulaPoint[]>([]);
  
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

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
            const point = allPoints.find(pt => pt.id === p.pointId);
            return point && point.name.toLowerCase().includes(query);
          })
      );
    }

    return result;
  }, [allFormulas, selectedCategory, searchQuery]);

  const getPointDetails = (pointId: string) => {
    return allPoints.find(p => p.id === pointId) || { name: pointId, id: pointId };
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

  const renderFormula = ({ item }: { item: Formula }) => (
    <TouchableOpacity
      style={[styles.formulaItem, { backgroundColor: theme.surface }]}
      onPress={() => setSelectedFormula(item)}
    >
      <View style={styles.formulaHeader}>
        <Text style={[styles.formulaName, { color: theme.text }]}>{item.name}</Text>
        {item.isCustom && (
          <TouchableOpacity
            onPress={() => handleDeleteFormula(item.id)}
            style={styles.deleteButton}
          >
            <Text style={[styles.deleteButtonText, { color: theme.error }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.formulaDescription, { color: theme.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={[styles.formulaPoints, { color: theme.textSecondary }]}>
        {item.points.length} puntos
      </Text>
      {item.category && (
        <View style={[styles.categoryBadge, { backgroundColor: theme.surface }]}>
          <Text style={[styles.categoryText, { color: theme.primary }]}>{item.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderProtocol = ({ item }: { item: Protocol }) => (
    <TouchableOpacity
      style={[styles.protocolItem, { backgroundColor: theme.surface }]}
      onPress={() => {
        setSelectedProtocol(item);
        setShowProtocolModal(true);
      }}
    >
      <Text style={[styles.protocolName, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.protocolDescription, { color: theme.textSecondary }]} numberOfLines={3}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Fórmulas de Tratamiento</Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={[styles.createButtonText, { color: theme.primaryText }]}>+ Nueva Fórmula</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Buscar fórmulas..."
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

      <FlatList
        data={filteredFormulas}
        keyExtractor={item => item.id}
        renderItem={renderFormula}
        style={styles.formulasList}
        contentContainerStyle={styles.formulasListContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No se encontraron fórmulas</Text>
        }
        ListFooterComponent={
          <>
            {/* Sección de Protocolos */}
            <View style={[styles.protocolSection, { backgroundColor: theme.background }]}>
              <Text style={[styles.protocolSectionTitle, { color: theme.text }]}>Protocolos</Text>
            </View>
            <FlatList
              data={protocols}
              keyExtractor={item => item.id}
              renderItem={renderProtocol}
              scrollEnabled={false}
              contentContainerStyle={styles.protocolListContent}
            />
          </>
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
              
              <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Puntos:</Text>
              {selectedFormula?.points.map((point, index) => (
                <View key={index} style={[styles.pointRow, { borderBottomColor: theme.border }]}>
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
                </View>
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

      {/* Modal de crear fórmula */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={[styles.createModalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.createModalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.createModalTitle, { color: theme.text }]}>Nueva Fórmula</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
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
            <FlatList
              data={selectedPoints}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={[styles.selectedPointRow, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.selectedPointId, { color: theme.primary }]}>{item.pointId}</Text>
                  <Text style={[styles.selectedPointName, { color: theme.text }]}>
                    {getPointDetails(item.pointId).name}
                  </Text>
                  <View style={[
                    styles.smallTechniqueBadge,
                    { backgroundColor: getTechniqueColor(item.technique) }
                  ]}>
                    <Text style={styles.smallTechniqueText}>
                      {getTechniqueLabel(item.technique)}
                    </Text>
                  </View>
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
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyPointsText, { color: theme.textSecondary }]}>
                  Agregá puntos desde el Explorador de Puntos
                </Text>
              }
            />
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
  formulasList: {
    flex: 1,
  },
  formulasListContent: {
    padding: 8,
  },
  formulaItem: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 4,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
    paddingVertical: 8,
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
  // Protocolos
  protocolSection: {
    padding: 16,
    paddingBottom: 8,
  },
  protocolSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  protocolListContent: {
    padding: 8,
    paddingTop: 0,
  },
  protocolItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  protocolName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  protocolDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  protocolDetailDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});
