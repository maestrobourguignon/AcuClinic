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
import { useAppStore } from '../store/useAppStore';
import { Patient, ClinicalRecord, FormulaPoint } from '../types';
import { allPoints } from '../data/points';

export const ClinicalRecordsScreen = () => {
  const {
    patients,
    clinicalRecords,
    addPatient,
    addClinicalRecord,
    deletePatient,
  } = useAppStore();

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [newPatient, setNewPatient] = useState({
    dni: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [newRecord, setNewRecord] = useState({
    reason: '',
    treatment: '',
    observations: '',
    notes: '',
  });

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      p =>
        p.dni.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  const getPatientRecords = (dni: string) => {
    return clinicalRecords
      .filter(r => r.patientDni === dni)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleAddPatient = () => {
    if (!newPatient.dni.trim()) {
      Alert.alert('Error', 'El DNI es requerido');
      return;
    }
    if (!newPatient.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    const exists = patients.find(p => p.dni === newPatient.dni);
    if (exists) {
      Alert.alert('Error', 'Ya existe un paciente con este DNI');
      return;
    }

    addPatient({
      dni: newPatient.dni,
      name: newPatient.name,
      phone: newPatient.phone,
      email: newPatient.email,
      notes: newPatient.notes,
      createdAt: new Date().toISOString(),
    });

    setNewPatient({ dni: '', name: '', phone: '', email: '', notes: '' });
    setShowPatientModal(false);
  };

  const handleAddRecord = () => {
    if (!newRecord.reason.trim()) {
      Alert.alert('Error', 'El motivo de consulta es requerido');
      return;
    }

    const record: ClinicalRecord = {
      id: `record-${Date.now()}`,
      patientDni: selectedPatient!.dni,
      date: new Date().toISOString(),
      reason: newRecord.reason,
      treatment: newRecord.treatment,
      pointsUsed: [], // Se puede agregar después
      observations: newRecord.observations,
      notes: newRecord.notes,
    };

    addClinicalRecord(record);
    setNewRecord({ reason: '', treatment: '', observations: '', notes: '' });
    setShowRecordModal(false);
  };

  const handleDeletePatient = (dni: string) => {
    Alert.alert(
      'Eliminar Paciente',
      '¿Estás seguro? Esto también eliminará todas sus historias clínicas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deletePatient(dni),
        },
      ]
    );
  };

  const renderPatient = ({ item }: { item: Patient }) => {
    const records = getPatientRecords(item.dni);
    const lastRecord = records[0];

    return (
      <TouchableOpacity
        style={styles.patientItem}
        onPress={() => setSelectedPatient(item)}
      >
        <View style={styles.patientHeader}>
          <Text style={styles.patientDni}>{item.dni}</Text>
          <TouchableOpacity
            onPress={() => handleDeletePatient(item.dni)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.patientName}>{item.name}</Text>
        {lastRecord && (
          <View style={styles.lastRecordInfo}>
            <Text style={styles.lastRecordDate}>
              Última consulta: {new Date(lastRecord.date).toLocaleDateString()}
            </Text>
            <Text style={styles.lastRecordReason} numberOfLines={1}>
              {lastRecord.reason}
            </Text>
          </View>
        )}
        <Text style={styles.recordCount}>
          {records.length} historia{records.length !== 1 ? 's' : ''} clínica{records.length !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historias Clínicas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPatientModal(true)}
        >
          <Text style={styles.addButtonText}>+ Nuevo Paciente</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por DNI o nombre..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.dni}
        renderItem={renderPatient}
        style={styles.patientList}
        contentContainerStyle={styles.patientListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay pacientes registrados</Text>
            <Text style={styles.emptySubtext}>
              Agregá un nuevo paciente para comenzar
            </Text>
          </View>
        }
      />

      {/* Modal de nuevo paciente */}
      <Modal visible={showPatientModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Paciente</Text>
            <TouchableOpacity onPress={() => setShowPatientModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>DNI *</Text>
            <TextInput
              style={styles.input}
              value={newPatient.dni}
              onChangeText={text => setNewPatient({ ...newPatient, dni: text })}
              placeholder="Número de documento"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={newPatient.name}
              onChangeText={text => setNewPatient({ ...newPatient, name: text })}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={newPatient.phone}
              onChangeText={text => setNewPatient({ ...newPatient, phone: text })}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={newPatient.email}
              onChangeText={text => setNewPatient({ ...newPatient, email: text })}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newPatient.notes}
              onChangeText={text => setNewPatient({ ...newPatient, notes: text })}
              placeholder="Notas adicionales"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddPatient}
          >
            <Text style={styles.saveButtonText}>Guardar Paciente</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal de detalle del paciente */}
      <Modal visible={!!selectedPatient} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{selectedPatient?.name}</Text>
              <Text style={styles.modalSubtitle}>DNI: {selectedPatient?.dni}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedPatient(null)}>
              <Text style={styles.cancelText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.patientInfo}>
            {selectedPatient?.phone && (
              <Text style={styles.infoText}>📞 {selectedPatient.phone}</Text>
            )}
            {selectedPatient?.email && (
              <Text style={styles.infoText}>✉️ {selectedPatient.email}</Text>
            )}
            {selectedPatient?.notes && (
              <Text style={styles.infoText}>📝 {selectedPatient.notes}</Text>
            )}
          </View>

          <View style={styles.recordsSection}>
            <Text style={styles.sectionTitle}>Historial de Treatments</Text>
            <TouchableOpacity
              style={styles.addRecordButton}
              onPress={() => setShowRecordModal(true)}
            >
              <Text style={styles.addRecordButtonText}>+ Nueva Sesión</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={selectedPatient ? getPatientRecords(selectedPatient.dni) : []}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.recordLabel}>Motivo de consulta:</Text>
                <Text style={styles.recordText}>{item.reason}</Text>
                
                {item.treatment && (
                  <>
                    <Text style={styles.recordLabel}>Tratamiento:</Text>
                    <Text style={styles.recordText}>{item.treatment}</Text>
                  </>
                )}
                
                {item.observations && (
                  <>
                    <Text style={styles.recordLabel}>Cómo se sintió:</Text>
                    <Text style={styles.recordText}>{item.observations}</Text>
                  </>
                )}
                
                {item.notes && (
                  <>
                    <Text style={styles.recordLabel}>Notas:</Text>
                    <Text style={styles.recordText}>{item.notes}</Text>
                  </>
                )}
              </View>
            )}
            style={styles.recordsList}
            ListEmptyComponent={
              <Text style={styles.emptyRecordsText}>
                No hay sesiones registradas
              </Text>
            }
          />
        </SafeAreaView>
      </Modal>

      {/* Modal de nueva sesión */}
      <Modal visible={showRecordModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Sesión</Text>
            <TouchableOpacity onPress={() => setShowRecordModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Motivo de consulta *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newRecord.reason}
              onChangeText={text => setNewRecord({ ...newRecord, reason: text })}
              placeholder="¿Por qué consulta el paciente?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Tratamiento realizado</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newRecord.treatment}
              onChangeText={text => setNewRecord({ ...newRecord, treatment: text })}
              placeholder="Describe el tratamiento aplicado"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>¿Cómo se sintió después?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newRecord.observations}
              onChangeText={text => setNewRecord({ ...newRecord, observations: text })}
              placeholder="Observaciones post-tratamiento"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Notas adicionales</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newRecord.notes}
              onChangeText={text => setNewRecord({ ...newRecord, notes: text })}
              placeholder="Notas extras"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddRecord}
          >
            <Text style={styles.saveButtonText}>Guardar Sesión</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#13ec80',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  patientList: {
    flex: 1,
  },
  patientListContent: {
    padding: 8,
  },
  patientItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientDni: {
    fontSize: 12,
    color: '#999',
  },
  deleteText: {
    color: '#F44336',
    fontSize: 16,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  lastRecordInfo: {
    marginTop: 8,
  },
  lastRecordDate: {
    fontSize: 12,
    color: '#13ec80',
  },
  lastRecordReason: {
    fontSize: 14,
    color: '#666',
  },
  recordCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cancelText: {
    color: '#F44336',
    fontSize: 16,
  },
  modalContent: {
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
  patientInfo: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recordsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addRecordButton: {
    backgroundColor: '#13ec80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addRecordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recordsList: {
    flex: 1,
  },
  recordItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    color: '#13ec80',
    fontWeight: 'bold',
  },
  recordLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  recordText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  emptyRecordsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
