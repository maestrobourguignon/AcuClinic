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
import { Patient, Treatment, TreatmentSession, TreatmentType, FormulaPoint, Point } from '../types';
import { useTheme } from '../theme/useTheme';
import { formulas } from '../data/formulas';
import { allPointsComplete } from '../data/pointsComplete';
import { meridians } from '../data/meridians';

const TREATMENT_TYPES: { value: TreatmentType; label: string }[] = [
  { value: 'sindromico', label: 'Sindrómico' },
  { value: 'dolor', label: 'Dolor' },
  { value: 'otro', label: 'Otro' },
];

export const ClinicalRecordsScreen = () => {
  const theme = useTheme();
  const {
    patients,
    treatments,
    treatmentSessions,
    customFormulas,
    addPatient,
    addTreatment,
    addTreatmentSession,
    deletePatient,
  } = useAppStore();

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showFormulasModal, setShowFormulasModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtros para el selector de puntos
  const [pointSearchQuery, setPointSearchQuery] = useState('');
  const [selectedMeridianFilter, setSelectedMeridianFilter] = useState<string | null>(null);

  // Filtro para fórmulas
  const [formulaSearchQuery, setFormulaSearchQuery] = useState('');

  // Todas las fórmulas combinadas
  const allFormulas = useMemo(() => [...formulas, ...customFormulas], [customFormulas]);

  // Form nuevo paciente
  const [newPatient, setNewPatient] = useState({
    lastName: '',
    firstName: '',
    dni: '',
    birthDate: '',
    phone: '',
    email: '',
    notes: '',
  });

  // Form nuevo tratamiento
  const [newTreatment, setNewTreatment] = useState({
    type: 'sindromico' as TreatmentType,
    reason: '',
    notes: '',
  });

  // Form nueva sesión
  const [newSession, setNewSession] = useState({
    patientState: '',
    treatment: '',
    observations: '',
    notes: '',
    pointsUsed: [] as FormulaPoint[],
  });

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      p =>
        p.dni.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.firstName.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

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

  const filteredFormulas = useMemo(() => {
    if (!formulaSearchQuery) return allFormulas;
    const query = formulaSearchQuery.toLowerCase();
    return allFormulas.filter(
      f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
    );
  }, [allFormulas, formulaSearchQuery]);

  const getPatientTreatments = (dni: string) => {
    return treatments
      .filter(t => t.patientDni === dni)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  };

  const getTreatmentSessions = (treatmentId: string) => {
    return treatmentSessions
      .filter(s => s.treatmentId === treatmentId)
      .sort((a, b) => a.sessionNumber - b.sessionNumber);
  };

  const getNextSessionNumber = (treatmentId: string) => {
    const sessions = getTreatmentSessions(treatmentId);
    return sessions.length + 1;
  };

  const getMeridianName = (id: string) => {
    const meridian = meridians.find(m => m.id === id);
    return meridian ? meridian.name : id;
  };

  const handleAddPatient = () => {
    if (!newPatient.dni.trim()) {
      Alert.alert('Error', 'El DNI es requerido');
      return;
    }
    if (!newPatient.lastName.trim() || !newPatient.firstName.trim()) {
      Alert.alert('Error', 'El apellido y nombre son requeridos');
      return;
    }

    const exists = patients.find(p => p.dni === newPatient.dni);
    if (exists) {
      Alert.alert('Error', 'Ya existe un paciente con este DNI');
      return;
    }

    addPatient({
      dni: newPatient.dni,
      lastName: newPatient.lastName,
      firstName: newPatient.firstName,
      birthDate: newPatient.birthDate || undefined,
      phone: newPatient.phone || undefined,
      email: newPatient.email || undefined,
      notes: newPatient.notes || undefined,
      createdAt: new Date().toISOString(),
    });

    setNewPatient({ lastName: '', firstName: '', dni: '', birthDate: '', phone: '', email: '', notes: '' });
    setShowPatientModal(false);
  };

  const handleAddTreatment = () => {
    if (!newTreatment.reason.trim()) {
      Alert.alert('Error', 'El motivo de consulta es requerido');
      return;
    }

    const treatment: Treatment = {
      id: `treatment-${Date.now()}`,
      patientDni: selectedPatient!.dni,
      type: newTreatment.type,
      reason: newTreatment.reason,
      startDate: new Date().toISOString(),
      notes: newTreatment.notes || undefined,
      isActive: true,
    };

    addTreatment(treatment);
    setSelectedTreatment(treatment);
    setNewTreatment({ type: 'sindromico', reason: '', notes: '' });
    setShowTreatmentModal(false);
    setShowSessionModal(true);
  };

  const handleAddSession = () => {
    if (!newSession.treatment.trim()) {
      Alert.alert('Error', 'El tratamiento realizado es requerido');
      return;
    }

    const sessionNumber = getNextSessionNumber(selectedTreatment!.id);
    const isFirstSession = sessionNumber === 1;

    if (isFirstSession && !newSession.patientState.trim()) {
      Alert.alert('Error', 'El estado actual del paciente es requerido en la primera sesión');
      return;
    }

    const session: TreatmentSession = {
      id: `session-${Date.now()}`,
      treatmentId: selectedTreatment!.id,
      sessionNumber,
      date: new Date().toISOString(),
      patientState: isFirstSession ? newSession.patientState : undefined,
      treatment: newSession.treatment,
      pointsUsed: newSession.pointsUsed,
      observations: newSession.observations || undefined,
      notes: newSession.notes || undefined,
    };

    addTreatmentSession(session);
    setNewSession({ patientState: '', treatment: '', observations: '', notes: '', pointsUsed: [] });
    setShowSessionModal(false);
  };

  const handleAddSinglePoint = (point: Point) => {
    if (newSession.pointsUsed.some(p => p.pointId === point.id)) {
      Alert.alert('Punto ya agregado', 'Este punto ya está en la sesión');
      return;
    }
    setNewSession({
      ...newSession,
      pointsUsed: [...newSession.pointsUsed, { pointId: point.id }]
    });
  };

  const handleAddFormulaPoints = (formulaPoints: FormulaPoint[]) => {
    const existingIds = new Set(newSession.pointsUsed.map(p => p.pointId));
    const newPoints = formulaPoints.filter(p => !existingIds.has(p.pointId));

    if (newPoints.length === 0) {
      Alert.alert('Puntos ya agregados', 'Todos los puntos de esta fórmula ya están en la sesión');
      return;
    }

    setNewSession({
      ...newSession,
      pointsUsed: [...newSession.pointsUsed, ...newPoints]
    });
  };

  const handleRemovePoint = (pointId: string) => {
    setNewSession({
      ...newSession,
      pointsUsed: newSession.pointsUsed.filter(p => p.pointId !== pointId)
    });
  };

  const handleDeletePatient = (dni: string) => {
    Alert.alert(
      'Eliminar Paciente',
      '¿Estás seguro? Esto también eliminará todos sus tratamientos.',
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
    const patientTreatments = getPatientTreatments(item.dni);
    const activeTreatments = patientTreatments.filter(t => t.isActive).length;

    return (
      <TouchableOpacity
        style={[styles.patientItem, { backgroundColor: theme.surface }]}
        onPress={() => setSelectedPatient(item)}
      >
        <View style={styles.patientHeader}>
          <Text style={[styles.patientDni, { color: theme.textSecondary }]}>DNI: {item.dni}</Text>
          <TouchableOpacity
            onPress={() => handleDeletePatient(item.dni)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteText, { color: theme.error }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.patientName, { color: theme.text }]}>
          {item.lastName}, {item.firstName}
        </Text>
        {item.phone && (
          <Text style={[styles.patientContact, { color: theme.textSecondary }]}>📞 {item.phone}</Text>
        )}
        <Text style={[styles.treatmentCount, { color: theme.primary }]}>
          {activeTreatments} tratamiento{activeTreatments !== 1 ? 's' : ''} activo{activeTreatments !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTreatment = ({ item }: { item: Treatment }) => {
    const sessions = getTreatmentSessions(item.id);
    const sessionsLength = sessions.length;
    const typeLabel = TREATMENT_TYPES.find(t => t.value === item.type)?.label || item.type;

    return (
      <TouchableOpacity
        style={[styles.treatmentItem, { backgroundColor: theme.surface, borderLeftColor: theme.primary }]}
        onPress={() => setSelectedTreatment(item)}
      >
        <View style={styles.treatmentHeader}>
          <View style={[styles.typeBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.typeBadgeText, { color: theme.primaryText }]}>{typeLabel}</Text>
          </View>
          {item.isActive && (
            <Text style={[styles.activeBadge, { color: theme.success }]}>Activo</Text>
          )}
        </View>
        <Text style={[styles.treatmentReason, { color: theme.text }]}>{item.reason}</Text>
        <Text style={[styles.treatmentDate, { color: theme.textSecondary }]}>
          Inicio: {new Date(item.startDate).toLocaleDateString()}
        </Text>
        <Text style={[styles.sessionCount, { color: theme.textSecondary }]}>
          {sessionsLength} sesión{sessionsLength !== 1 ? 'es' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSession = ({ item, index }: { item: TreatmentSession; index: number }) => {
    const isFirst = index === 0;

    return (
      <View style={[styles.sessionItem, { backgroundColor: theme.surface }]}>
        <View style={styles.sessionHeader}>
          {/* <Text style={[styles.sessionNumber, { color: theme.primary }]}>Sesión {item.sessionNumber}</Text> */}
          <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>

        {isFirst && item.patientState && (
          <>
            <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>Estado actual:</Text>
            <Text style={[styles.sessionText, { color: theme.text }]}>{item.patientState}</Text>
          </>
        )}

        {item.treatment && (
          <>
            <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>Tratamiento:</Text>
            <Text style={[styles.sessionText, { color: theme.text }]}>{item.treatment}</Text>
          </>
        )}

        {item.pointsUsed.length > 0 && (
          <>
            <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>Puntos:</Text>
            <Text style={[styles.sessionText, { color: theme.text }]}>
              {item.pointsUsed.map(p => p.pointId).join(', ')}
            </Text>
          </>
        )}

        {item.observations && (
          <>
            <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>Cómo se sintió:</Text>
            <Text style={[styles.sessionText, { color: theme.text }]}>{item.observations}</Text>
          </>
        )}

        {item.notes && (
          <>
            <Text style={[styles.sessionLabel, { color: theme.textSecondary }]}>Notas:</Text>
            <Text style={[styles.sessionText, { color: theme.text }]}>{item.notes}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        {/* <Text style={[styles.title, { color: theme.text }]}>Historias Clínicas</Text> */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowPatientModal(true)}
        >
          <Text style={[styles.addButtonText, { color: theme.primaryText }]}>+ Nuevo Paciente</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Buscar por DNI, apellido o nombre..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.dni}
        renderItem={renderPatient}
        style={styles.patientList}
        contentContainerStyle={styles.patientListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay pacientes registrados</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Agregá un nuevo paciente para comenzar
            </Text>
          </View>
        }
      />

      {/* Modal nuevo paciente */}
      <Modal visible={showPatientModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nuevo Paciente</Text>
            <TouchableOpacity onPress={() => setShowPatientModal(false)}>
              <Text style={[styles.cancelText, { color: theme.error }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Apellido *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.lastName}
              onChangeText={text => setNewPatient({ ...newPatient, lastName: text })}
              placeholder="Apellido"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.firstName}
              onChangeText={text => setNewPatient({ ...newPatient, firstName: text })}
              placeholder="Nombre"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>DNI *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.dni}
              onChangeText={text => setNewPatient({ ...newPatient, dni: text })}
              placeholder="Número de documento"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Fecha de nacimiento</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.birthDate}
              onChangeText={text => setNewPatient({ ...newPatient, birthDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Teléfono</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.phone}
              onChangeText={text => setNewPatient({ ...newPatient, phone: text })}
              placeholder="Teléfono"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.email}
              onChangeText={text => setNewPatient({ ...newPatient, email: text })}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newPatient.notes}
              onChangeText={text => setNewPatient({ ...newPatient, notes: text })}
              placeholder="Notas adicionales"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleAddPatient}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryText }]}>Guardar Paciente</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal detalle paciente + tratamientos */}
      <Modal visible={!!selectedPatient} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedPatient?.lastName}, {selectedPatient?.firstName}
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>DNI: {selectedPatient?.dni}</Text>
            </View>
            <TouchableOpacity onPress={() => { setSelectedPatient(null); setSelectedTreatment(null); }}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.patientInfo, { backgroundColor: theme.surface }]}>
            {selectedPatient?.birthDate && (
              <Text style={[styles.infoText, { color: theme.text }]}>🎂 {selectedPatient.birthDate}</Text>
            )}
            {selectedPatient?.phone && (
              <Text style={[styles.infoText, { color: theme.text }]}>📞 {selectedPatient.phone}</Text>
            )}
            {selectedPatient?.email && (
              <Text style={[styles.infoText, { color: theme.text }]}>✉️ {selectedPatient.email}</Text>
            )}
            {selectedPatient?.notes && (
              <Text style={[styles.infoText, { color: theme.text }]}>📝 {selectedPatient.notes}</Text>
            )}
          </View>

          <View style={[styles.treatmentsSection, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tratamientos</Text>
            <TouchableOpacity
              style={[styles.addTreatmentButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowTreatmentModal(true)}
            >
              <Text style={[styles.addTreatmentButtonText, { color: theme.primaryText }]}>+ Nuevo</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={selectedPatient ? getPatientTreatments(selectedPatient.dni) : []}
            keyExtractor={item => item.id}
            renderItem={renderTreatment}
            style={styles.treatmentsList}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary, padding: 16 }]}>
                No hay tratamientos registrados
              </Text>
            }
            ListFooterComponent={
              selectedTreatment ? (
                <View style={[styles.sessionsSection, { backgroundColor: theme.background }]}>
                  <Text style={[styles.sessionsTitle, { color: theme.text }]}>
                    Sesiones de: {selectedTreatment.reason}
                  </Text>
                  <TouchableOpacity
                    style={[styles.addSessionButton, { backgroundColor: theme.primary }]}
                    onPress={() => setShowSessionModal(true)}
                  >
                    <Text style={[styles.addSessionButtonText, { color: theme.primaryText }]}>+ Nueva Sesión</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={getTreatmentSessions(selectedTreatment.id)}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => renderSession({ item, index })}
                    scrollEnabled={false}
                  />
                </View>
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>

      {/* Modal nuevo tratamiento */}
      <Modal visible={showTreatmentModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nuevo Tratamiento</Text>
            <TouchableOpacity onPress={() => setShowTreatmentModal(false)}>
              <Text style={[styles.cancelText, { color: theme.error }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Tipo de tratamiento</Text>
            <View style={styles.typeSelector}>
              {TREATMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    newTreatment.type === type.value && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setNewTreatment({ ...newTreatment, type: type.value })}
                >
                  <Text style={[
                    styles.typeOptionText,
                    { color: theme.text },
                    newTreatment.type === type.value && { color: theme.primaryText, fontWeight: 'bold' },
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Motivo de consulta *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newTreatment.reason}
              onChangeText={text => setNewTreatment({ ...newTreatment, reason: text })}
              placeholder="¿Por qué consulta el paciente?"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newTreatment.notes}
              onChangeText={text => setNewTreatment({ ...newTreatment, notes: text })}
              placeholder="Notas adicionales"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleAddTreatment}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryText }]}>Crear Tratamiento</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal nueva sesión */}
      <Modal visible={showSessionModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Nueva Sesión #{getNextSessionNumber(selectedTreatment?.id || '')}
            </Text>
            <TouchableOpacity onPress={() => setShowSessionModal(false)}>
              <Text style={[styles.cancelText, { color: theme.error }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {getNextSessionNumber(selectedTreatment?.id || '') === 1 && (
              <>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Estado actual del paciente *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={newSession.patientState}
                  onChangeText={text => setNewSession({ ...newSession, patientState: text })}
                  placeholder="Describe el estado actual del paciente..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </>
            )}

            <Text style={[styles.inputLabel, { color: theme.text }]}>Tratamiento realizado *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newSession.treatment}
              onChangeText={text => setNewSession({ ...newSession, treatment: text })}
              placeholder="Describe el tratamiento aplicado..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />

            {/* Selector de puntos */}
            <Text style={[styles.inputLabel, { color: theme.text }]}>Puntos utilizados</Text>

            {/* Puntos ya seleccionados */}
            {newSession.pointsUsed.length > 0 && (
              <View style={[styles.selectedPointsContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.selectedPointsLabel, { color: theme.textSecondary }]}>
                  {newSession.pointsUsed.length} puntos seleccionados:
                </Text>
                <View style={styles.selectedPointsRow}>
                  {newSession.pointsUsed.map((p, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.selectedPointChip, { backgroundColor: theme.primary }]}
                      onPress={() => handleRemovePoint(p.pointId)}
                    >
                      <Text style={[styles.selectedPointChipText, { color: theme.primaryText }]}>
                        {p.pointId} ✕
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Botones para agregar puntos */}
            <View style={styles.pointsButtonsRow}>
              <TouchableOpacity
                style={[styles.pointsModalButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowPointsModal(true)}
              >
                <Text style={[styles.pointsModalButtonText, { color: theme.primaryText }]}>
                  + Puntos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pointsModalButton, { backgroundColor: '#FF9800' }]}
                onPress={() => setShowFormulasModal(true)}
              >
                <Text style={[styles.pointsModalButtonText, { color: '#fff' }]}>
                  + Fórmulas
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.text }]}>¿Cómo se sintió después?</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newSession.observations}
              onChangeText={text => setNewSession({ ...newSession, observations: text })}
              placeholder="Observaciones post-tratamiento"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Notas adicionales</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newSession.notes}
              onChangeText={text => setNewSession({ ...newSession, notes: text })}
              placeholder="Notas extras"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleAddSession}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryText }]}>Guardar Sesión</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal selector de puntos */}
      <Modal visible={showPointsModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Puntos</Text>
            <TouchableOpacity onPress={() => {
              setShowPointsModal(false);
              setPointSearchQuery('');
              setSelectedMeridianFilter(null);
            }}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={[styles.pickerSearchContainer, { backgroundColor: theme.surface }]}>
            <TextInput
              style={[styles.pickerSearchInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
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
          </View>

          {/* Lista de puntos */}
          <FlatList
            data={filteredPointsForPicker.slice(0, 100)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = newSession.pointsUsed.some(p => p.pointId === item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.pointPickerItem,
                    { backgroundColor: isSelected ? theme.primary + '20' : theme.surface, borderBottomColor: theme.border }
                  ]}
                  onPress={() => handleAddSinglePoint(item)}
                  disabled={isSelected}
                >
                  <View style={styles.pointPickerInfo}>
                    <Text style={[styles.pointPickerId, { color: isSelected ? theme.primary : theme.primary }]}>{item.id}</Text>
                    <View style={styles.pointPickerDetails}>
                      <Text style={[styles.pointPickerName, { color: isSelected ? theme.primary : theme.text }]}>{item.name}</Text>
                      <Text style={[styles.pointPickerMeridian, { color: isSelected ? theme.primary : theme.textSecondary }]}>
                        {getMeridianName(item.meridianId)}
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
            }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary, padding: 20 }]}>
                No se encontraron puntos
              </Text>
            }
            ListFooterComponent={
              filteredPointsForPicker.length > 100 ? (
                <Text style={[styles.morePointsText, { color: theme.textSecondary }]}>
                  Mostrando 100 de {filteredPointsForPicker.length} puntos
                </Text>
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>

      {/* Modal selector de fórmulas */}
      <Modal visible={showFormulasModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Fórmula</Text>
            <TouchableOpacity onPress={() => {
              setShowFormulasModal(false);
              setFormulaSearchQuery('');
            }}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {/* Buscador */}
          <View style={[styles.pickerSearchContainer, { backgroundColor: theme.surface }]}>
            <TextInput
              style={[styles.pickerSearchInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              value={formulaSearchQuery}
              onChangeText={setFormulaSearchQuery}
              placeholder="Buscar fórmula..."
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Lista de fórmulas */}
          <FlatList
            data={filteredFormulas}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.formulaPickerItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
                onPress={() => {
                  handleAddFormulaPoints(item.points);
                  setShowFormulasModal(false);
                }}
              >
                <View style={styles.formulaPickerInfo}>
                  <Text style={[styles.formulaPickerName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.formulaPickerDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={[styles.formulaPickerPoints, { color: theme.primary }]}>
                    {item.points.length} puntos
                  </Text>
                </View>
                <Text style={[styles.addPointText, { color: theme.primary }]}>+</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary, padding: 20 }]}>
                No se encontraron fórmulas
              </Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addButtonText: { fontWeight: 'bold' },
  searchInput: { marginHorizontal: 16, marginVertical: 12, padding: 12, borderRadius: 10, fontSize: 16, borderWidth: 1 },
  patientList: { flex: 1 },
  patientListContent: { padding: 8 },
  patientItem: { padding: 16, marginVertical: 4, marginHorizontal: 4, borderRadius: 8 },
  patientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientDni: { fontSize: 12 },
  deleteText: { fontSize: 16 },
  patientName: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  patientContact: { fontSize: 14, marginTop: 4 },
  treatmentCount: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 18 },
  emptySubtext: { fontSize: 14, marginTop: 8 },

  // Modal styles
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalSubtitle: { fontSize: 14 },
  cancelText: { fontSize: 16 },
  modalContent: { flex: 1, padding: 16 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  input: { borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { margin: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { fontWeight: 'bold', fontSize: 16 },

  // Patient info
  patientInfo: { padding: 16 },
  infoText: { fontSize: 14, marginBottom: 4 },

  // Treatments
  treatmentsSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  addTreatmentButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  addTreatmentButtonText: { fontWeight: 'bold', fontSize: 14 },
  treatmentsList: { flex: 1 },

  // Treatment item
  treatmentItem: { padding: 16, marginVertical: 4, marginHorizontal: 8, borderRadius: 8, borderLeftWidth: 4 },
  treatmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  typeBadgeText: { fontSize: 12, fontWeight: 'bold' },
  activeBadge: { fontSize: 12, fontWeight: 'bold' },
  treatmentReason: { fontSize: 16, fontWeight: 'bold' },
  treatmentDate: { fontSize: 12, marginTop: 4 },
  sessionCount: { fontSize: 12, marginTop: 4 },

  // Sessions
  sessionsSection: { padding: 16 },
  sessionsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  addSessionButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addSessionButtonText: { fontWeight: 'bold' },
  sessionItem: { padding: 16, borderRadius: 8, marginBottom: 12 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sessionNumber: { fontSize: 16, fontWeight: 'bold' },
  sessionDate: { fontSize: 14 },
  sessionLabel: { fontSize: 12, marginTop: 8 },
  sessionText: { fontSize: 14, marginTop: 2 },

  // Type selector
  typeSelector: { flexDirection: 'row', marginBottom: 16 },
  typeOption: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, marginHorizontal: 4, alignItems: 'center' },
  typeOptionText: { fontSize: 14 },

  // Points selector
  selectedPointsContainer: { padding: 12, borderRadius: 8, marginBottom: 12 },
  selectedPointsLabel: { fontSize: 12, marginBottom: 8 },
  selectedPointsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  selectedPointChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  selectedPointChipText: { fontSize: 12, fontWeight: 'bold' },
  pointsButtonsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pointsModalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  pointsModalButtonText: { fontWeight: 'bold', fontSize: 16 },

  // Point picker
  pickerSearchContainer: { padding: 12 },
  pickerSearchInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 },
  meridianFilterScroll: { flexGrow: 0 },
  meridianFilterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  meridianFilterText: { fontSize: 12 },
  pointPickerItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  pointPickerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  pointPickerId: { fontSize: 16, fontWeight: 'bold', width: 50 },
  pointPickerDetails: { flex: 1 },
  pointPickerName: { fontSize: 14 },
  pointPickerMeridian: { fontSize: 11 },
  addPointText: { fontSize: 24, fontWeight: 'bold' },
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
  morePointsText: { textAlign: 'center', padding: 12, fontSize: 12 },

  // Formula picker
  formulaPickerItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  formulaPickerInfo: { flex: 1 },
  formulaPickerName: { fontSize: 16, fontWeight: 'bold' },
  formulaPickerDesc: { fontSize: 12, marginTop: 2 },
  formulaPickerPoints: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
});
