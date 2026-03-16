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
import { protocols, organs } from '../data/protocols';
import { allPoints } from '../data/points';
import { useAppStore } from '../store/useAppStore';
import { Formula, FormulaPoint, Protocol, PointTechnique } from '../types';

export const FormulasScreen = () => {
  const { customFormulas, addCustomFormula, deleteCustomFormula } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  
  // Estado para crear fórmula
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaDescription, setNewFormulaDescription] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<FormulaPoint[]>([]);
  
  // Estado para protocolo
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

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

  const getTechniqueColor = (technique: PointTechnique) => {
    switch (technique) {
      case 'tonificar': return '#4CAF50';
      case 'sedar': return '#F44336';
      case 'moxar': return '#FF9800';
      default: return '#666';
    }
  };

  const getTechniqueLabel = (technique: PointTechnique) => {
    switch (technique) {
      case 'tonificar': return 'Tonificar';
      case 'sedar': return 'Sedar';
      case 'moxar': return 'Moxar';
      default: return 'Ninguna';
    }
  };

  const renderFormula = ({ item }: { item: Formula }) => (
    <TouchableOpacity
      style={styles.formulaItem}
      onPress={() => setSelectedFormula(item)}
    >
      <View style={styles.formulaHeader}>
        <Text style={styles.formulaName}>{item.name}</Text>
        {item.isCustom && (
          <TouchableOpacity
            onPress={() => handleDeleteFormula(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.formulaDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.formulaPoints}>
        {item.points.length} puntos
      </Text>
      {item.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fórmulas de Tratamiento</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowProtocolModal(true)}
          >
            <Text style={styles.actionButtonText}>Protocolos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.createButton]}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={[styles.actionButtonText, styles.createButtonText]}>+ Nueva</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar fórmulas..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      {/* Selector de categoría */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Filtrar por categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                (selectedCategory === cat || (cat === 'Todos' && selectedCategory === null)) && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
            >
              <Text style={[
                styles.categoryChipText,
                (selectedCategory === cat || (cat === 'Todos' && selectedCategory === null)) && styles.categoryChipTextSelected,
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
          <Text style={styles.emptyText}>No se encontraron fórmulas</Text>
        }
      />

      {/* Modal de detalle de fórmula */}
      <Modal visible={!!selectedFormula} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedFormula?.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedFormula?.description}
              </Text>
              
              <Text style={styles.modalSectionTitle}>Puntos:</Text>
              {selectedFormula?.points.map((point, index) => (
                <View key={index} style={styles.pointRow}>
                  <Text style={styles.pointId}>{point.pointId}</Text>
                  <Text style={styles.pointName}>
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
              style={styles.closeModalButton}
              onPress={() => setSelectedFormula(null)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de crear fórmula */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.createModalContainer}>
          <View style={styles.createModalHeader}>
            <Text style={styles.createModalTitle}>Nueva Fórmula</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.createModalContent}>
            <Text style={styles.inputLabel}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={newFormulaName}
              onChangeText={setNewFormulaName}
              placeholder="Nombre de la fórmula"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.inputLabel}>Descripción:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newFormulaDescription}
              onChangeText={setNewFormulaDescription}
              placeholder="Descripción de la fórmula"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Puntos ({selectedPoints.length}):</Text>
            <FlatList
              data={selectedPoints}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.selectedPointRow}>
                  <Text style={styles.selectedPointId}>{item.pointId}</Text>
                  <Text style={styles.selectedPointName}>
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
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyPointsText}>
                  Agregá puntos desde el Explorador de Puntos
                </Text>
              }
            />
          </ScrollView>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreateFormula}
          >
            <Text style={styles.saveButtonText}>Guardar Fórmula</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal de protocolos */}
      <Modal visible={showProtocolModal} animationType="slide">
        <SafeAreaView style={styles.createModalContainer}>
          <View style={styles.createModalHeader}>
            <Text style={styles.createModalTitle}>Protocolos</Text>
            <TouchableOpacity onPress={() => setShowProtocolModal(false)}>
              <Text style={styles.cancelText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.createModalContent}>
            {protocols.map(protocol => (
              <TouchableOpacity
                key={protocol.id}
                style={styles.protocolItem}
                onPress={() => {
                  setSelectedProtocol(protocol);
                  setShowProtocolModal(false);
                }}
              >
                <Text style={styles.protocolName}>{protocol.name}</Text>
                <Text style={styles.protocolDescription} numberOfLines={3}>
                  {protocol.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#13ec80',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#13ec80',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#13ec80',
  },
  createButtonText: {
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  categoryList: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryChipSelected: {
    backgroundColor: '#13ec80',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formulasList: {
    flex: 1,
  },
  formulasListContent: {
    padding: 8,
  },
  formulaItem: {
    backgroundColor: '#fff',
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
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 18,
  },
  formulaDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  formulaPoints: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#13ec80',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pointId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#13ec80',
    width: 50,
  },
  pointName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  createModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  createModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelText: {
    color: '#F44336',
    fontSize: 16,
  },
  createModalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPointId: {
    fontWeight: 'bold',
    color: '#13ec80',
    width: 50,
  },
  selectedPointName: {
    flex: 1,
    color: '#333',
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
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyPointsText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#13ec80',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  protocolItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  protocolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  protocolDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
