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
import { Patient, Treatment, TreatmentSession, TreatmentType, FormulaPoint } from '../types';
import { useTheme } from '../theme/useTheme';
import { allPoints } from '../data/points';

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
    addPatient,
    addTreatment,
    addTreatmentSession,
    deletePatient,
  } = useAppStore();

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showFormulaPicker, setShowFormulaPicker] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSelectFormula = (formulaPoints: FormulaPoint[]) => {
    setNewSession({ ...newSession, pointsUsed: formulaPoints });
    setShowFormulaPicker(false);
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
    const lastSession = sessions[sessions.length - 1];
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
          {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSession = ({ item, index }: { item: TreatmentSession; index: number }) => {
    const isFirst = index === 0;

    return (
      <View style={[styles.sessionItem, { backgroundColor: theme.surface }]}>
        <View style={styles.sessionHeader}>
          <Text style={[styles.sessionNumber, { color: theme.primary }]}>Sesión {item.sessionNumber}</Text>
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
        <Text style={[styles.title, { color: theme.text }]}>Historias Clínicas</Text>
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
              <Text style={[styles.addTreatmentButtonText, { color: theme.primaryText }]}>+ Nuevo Tratamiento</Text>
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

            <Text style={[styles.inputLabel, { color: theme.text }]}>Puntos utilizados</Text>
            <TouchableOpacity
              style={[styles.pointsButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setShowFormulaPicker(true)}
            >
              <Text style={[styles.pointsButtonText, { color: theme.primary }]}>
                {newSession.pointsUsed.length > 0 
                  ? `${newSession.pointsUsed.length} puntos seleccionados`
                  : 'Seleccionar puntos de fórmula'}
              </Text>
            </TouchableOpacity>
            {newSession.pointsUsed.length > 0 && (
              <Text style={[styles.selectedPoints, { color: theme.textSecondary }]}>
                {newSession.pointsUsed.map(p => p.pointId).join(', ')}
              </Text>
            )}

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

      {/* Modal selector de fórmulas */}
      <Modal visible={showFormulaPicker} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Fórmula</Text>
            <TouchableOpacity onPress={() => setShowFormulaPicker(false)}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.formulaPickerHint, { color: theme.textSecondary, padding: 16 }]}>
            Selecciona una fórmula para usar sus puntos, o selecciona puntos individuales
          </Text>
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
  
  // Points
  pointsButton: { padding: 16, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  pointsButtonText: { fontSize: 16, fontWeight: 'bold' },
  selectedPoints: { fontSize: 12, marginTop: 8 },
  
  // Formula picker
  formulaPickerHint: { fontSize: 14 },
});
