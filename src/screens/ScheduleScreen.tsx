import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { Appointment, CalendarNote } from '../types';
import { useTheme } from '../theme/useTheme';

export const ScheduleScreen = () => {
  const theme = useTheme();
  const {
    appointments,
    calendarNotes,
    addAppointment,
    deleteAppointment,
    addCalendarNote,
    deleteCalendarNote,
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showDayModal, setShowDayModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    patientDni: '',
    patientName: '',
    time: '',
    notes: '',
  });

  const [newNote, setNewNote] = useState({
    content: '',
  });

  const markedDates = useMemo(() => {
    const marks: { [key: string]: { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string } } = {};

    appointments.forEach(apt => {
      const dateKey = apt.date.split('T')[0];
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: theme.primary,
      };
    });

    calendarNotes.forEach(note => {
      const dateKey = note.date.split('T')[0];
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: '#FF9800',
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: theme.primary,
        marked: marks[selectedDate]?.marked || false,
        dotColor: marks[selectedDate]?.dotColor || theme.primary,
      };
    }

    return marks;
  }, [appointments, calendarNotes, selectedDate, theme.primary]);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.date.split('T')[0] === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const dayNotes = useMemo(() => {
    return calendarNotes.filter(note => note.date.split('T')[0] === selectedDate);
  }, [calendarNotes, selectedDate]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setShowDayModal(true);
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientDni.trim()) {
      Alert.alert('Error', 'El DNI del paciente es requerido');
      return;
    }
    if (!newAppointment.time.trim()) {
      Alert.alert('Error', 'El horario es requerido');
      return;
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientDni: newAppointment.patientDni,
      patientName: newAppointment.patientName || newAppointment.patientDni,
      date: selectedDate,
      time: newAppointment.time,
      notes: newAppointment.notes,
      status: 'scheduled',
    };

    addAppointment(appointment);
    setNewAppointment({ patientDni: '', patientName: '', time: '', notes: '' });
    setShowAppointmentModal(false);
  };

  const handleAddNote = () => {
    if (!newNote.content.trim()) {
      Alert.alert('Error', 'El contenido de la nota es requerido');
      return;
    }

    const note: CalendarNote = {
      id: `note-${Date.now()}`,
      date: selectedDate,
      content: newNote.content,
      type: 'general',
    };

    addCalendarNote(note);
    setNewNote({ content: '' });
    setShowNoteModal(false);
  };

  const handleDeleteAppointment = (id: string) => {
    Alert.alert(
      'Eliminar Turno',
      '¿Estás seguro de que quieres eliminar este turno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteAppointment(id) },
      ]
    );
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteCalendarNote(id) },
      ]
    );
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={[styles.appointmentItem, { backgroundColor: theme.surface }]}
    >
      <View style={styles.appointmentTime}>
        <Text style={[styles.timeText, { color: theme.primary }]}>{item.time}</Text>
      </View>
      <View style={styles.appointmentInfo}>
        <Text style={[styles.patientName, { color: theme.text }]}>{item.patientName}</Text>
        {item.patientDni && (
          <Text style={[styles.patientDni, { color: theme.textSecondary }]}>DNI: {item.patientDni}</Text>
        )}
        {item.notes && (
          <Text style={[styles.appointmentNotes, { color: theme.textSecondary }]} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteAppointment(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNote = ({ item }: { item: CalendarNote }) => (
    <View style={[styles.noteItem, { backgroundColor: theme.surface }]}>
      <Text style={[styles.noteContent, { color: theme.text }]}>{item.content}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteNote(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteNoteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Agenda de Turnos</Text>
      </View> */}

      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.surface,
          calendarBackground: theme.surface,
          textSectionTitleColor: theme.textSecondary,
          selectedDayTextColor: theme.primaryText,
          dayTextColor: theme.text,
          textDisabledColor: theme.textSecondary,
          dotColor: theme.primary,
          selectedDotColor: theme.primaryText,
          arrowColor: theme.primary,
          monthTextColor: theme.text,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          todayTextColor: theme.primary,
          selectedDayBackgroundColor: theme.primary,
        }}
        style={[styles.calendar, { backgroundColor: theme.surface }]}
      />

      <Text style={[styles.tapHint, { color: theme.textSecondary }]}>
        Tocá un día para ver sus turnos y notas
      </Text>

      {/* Modal del día */}
      <Modal visible={showDayModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={getDayModalContentStyle(theme)}>
            {/* Header con navegación */}
            <View style={getDayModalHeaderStyle(theme)}>
              <TouchableOpacity onPress={() => navigateDay('prev')} style={styles.navButton}>
                <Ionicons name="chevron-back" size={28} color={theme.primary} />
              </TouchableOpacity>

              <View style={styles.dateTitleContainer}>
                <Text style={[styles.dayModalTitle, { color: theme.text }]}
                  numberOfLines={1} adjustsFontSizeToFit>
                  {formatDateHeader(selectedDate)}
                </Text>
              </View>

              <TouchableOpacity onPress={() => navigateDay('next')} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={28} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {/* Botones de acción */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.modalActionButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowAppointmentModal(true)}
              >
                <Ionicons name="calendar" size={18} color={theme.primaryText} />
                <Text style={[styles.modalActionText, { color: theme.primaryText }]}>+ Turno</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, { backgroundColor: '#FF9800' }]}
                onPress={() => setShowNoteModal(true)}
              >
                <Ionicons name="document-text" size={18} color="#fff" />
                <Text style={[styles.modalActionText, { color: '#fff' }]}>+ Nota</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de turnos y notas */}
            <ScrollView style={styles.dayModalScroll} contentContainerStyle={styles.dayModalScrollContent}>
              {/* Turnos */}
              {dayAppointments.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.primary }]}>Turnos</Text>
                  {dayAppointments.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.appointmentItem, { backgroundColor: theme.surface }]}
                    >
                      <View style={styles.appointmentTime}>
                        <Text style={[styles.timeText, { color: theme.primary }]}>{item.time}</Text>
                      </View>
                      <View style={styles.appointmentInfo}>
                        <Text style={[styles.patientName, { color: theme.text }]}>{item.patientName}</Text>
                        {item.patientDni && (
                          <Text style={[styles.patientDni, { color: theme.textSecondary }]}>DNI: {item.patientDni}</Text>
                        )}
                        {item.notes && (
                          <Text style={[styles.appointmentNotes, { color: theme.textSecondary }]} numberOfLines={2}>
                            {item.notes}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteAppointment(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.deleteText}>✕</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {/* Notas */}
              {dayNotes.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: '#FF9800' }]}>Notas</Text>
                  {dayNotes.map(item => (
                    <View key={item.id} style={[styles.noteItem, { backgroundColor: theme.surface }]}>
                      <Text style={[styles.noteContent, { color: theme.text }]}>{item.content}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteNote(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.deleteNoteText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Empty state */}
              {dayAppointments.length === 0 && dayNotes.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No hay turnos ni notas para este día
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Botón cerrar */}
            <TouchableOpacity
              style={[styles.closeDayModalButton, { backgroundColor: theme.surface }]}
              onPress={() => setShowDayModal(false)}
            >
              <Text style={[styles.closeDayModalText, { color: theme.textSecondary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de nuevo turno */}
      <Modal visible={showAppointmentModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nuevo Turno</Text>
            <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>DNI del Paciente *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newAppointment.patientDni}
              onChangeText={text => setNewAppointment({ ...newAppointment, patientDni: text })}
              placeholder="Número de documento"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre del Paciente</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newAppointment.patientName}
              onChangeText={text => setNewAppointment({ ...newAppointment, patientName: text })}
              placeholder="Nombre (opcional si está registrado)"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Horario *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newAppointment.time}
              onChangeText={text => setNewAppointment({ ...newAppointment, time: text })}
              placeholder="HH:MM (ej: 14:30)"
              placeholderTextColor={theme.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newAppointment.notes}
              onChangeText={text => setNewAppointment({ ...newAppointment, notes: text })}
              placeholder="Notas adicionales"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleAddAppointment}
          >
            <Text style={[styles.saveButtonText, { color: theme.primaryText }]}>Guardar Turno</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal de nota */}
      <Modal visible={showNoteModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Nueva Nota</Text>
            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
              <Text style={[styles.cancelText, { color: theme.primary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Contenido</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newNote.content}
              onChangeText={text => setNewNote({ ...newNote, content: text })}
              placeholder="Escribe tu nota..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#FF9800' }]}
            onPress={handleAddNote}
          >
            <Text style={[styles.saveButtonText, { color: '#fff' }]}>Guardar Nota</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Dynamic style functions (theme-dependent)
const getDayModalContentStyle = (theme: any) => ({
  flex: 1,
  backgroundColor: theme.background,
});
const getDayModalHeaderStyle = (theme: any) => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  padding: 12,
  borderBottomWidth: 1,
  backgroundColor: theme.surface,
  borderBottomColor: theme.border,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tapHint: {
    textAlign: 'center',
    padding: 12,
    fontSize: 14,
  },
  appointmentItem: {
    flexDirection: 'row',
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  appointmentTime: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientDni: {
    fontSize: 12,
  },
  appointmentNotes: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteText: {
    color: '#F44336',
    fontSize: 16,
    padding: 8,
  },
  noteItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
    fontSize: 14,
  },
  deleteNoteText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  navButton: {
    padding: 8,
    width: 50,
    alignItems: 'center',
  },
  dateTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  modalActionsRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalActionText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayModalScroll: {
    flex: 1,
  },
  dayModalScrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 12,
  },
  closeDayModalButton: {
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  closeDayModalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
