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
import { useAppStore } from '../store/useAppStore';
import { Appointment, CalendarNote } from '../types';

export const ScheduleScreen = () => {
  const {
    appointments,
    calendarNotes,
    patients,
    addAppointment,
    deleteAppointment,
    addCalendarNote,
    deleteCalendarNote,
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form state
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

    // Agregar appointments
    appointments.forEach(apt => {
      const dateKey = apt.date.split('T')[0];
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: '#13ec80',
      };
    });

    // Agregar notas
    calendarNotes.forEach(note => {
      const dateKey = note.date.split('T')[0];
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: '#FF9800',
      };
    });

    // Agregar fecha seleccionada
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: '#13ec80',
        marked: marks[selectedDate]?.marked || false,
        dotColor: marks[selectedDate]?.dotColor || '#13ec80',
      };
    }

    return marks;
  }, [appointments, calendarNotes, selectedDate]);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.date.split('T')[0] === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const dayNotes = useMemo(() => {
    return calendarNotes.filter(note => note.date.split('T')[0] === selectedDate);
  }, [calendarNotes, selectedDate]);

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

  const getPatientName = (dni: string) => {
    const patient = patients.find(p => p.dni === dni);
    return patient ? patient.name : dni;
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      style={styles.appointmentItem}
      onPress={() => setSelectedAppointment(item)}
    >
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.appointmentInfo}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        {item.patientDni && (
          <Text style={styles.patientDni}>DNI: {item.patientDni}</Text>
        )}
        {item.notes && (
          <Text style={styles.appointmentNotes} numberOfLines={2}>
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
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteNote(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteNoteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda de Turnos</Text>
      </View>

      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#13ec80',
          selectedDayBackgroundColor: '#13ec80',
          arrowColor: '#13ec80',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
        }}
        style={styles.calendar}
      />

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowAppointmentModal(true)}
        >
          <Text style={styles.actionButtonText}>+ Turno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.noteButton]}
          onPress={() => setShowNoteModal(true)}
        >
          <Text style={[styles.actionButtonText, styles.noteButtonText]}>+ Nota</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daySection}>
        <Text style={styles.dayTitle}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      <FlatList
        data={dayAppointments}
        keyExtractor={item => item.id}
        renderItem={renderAppointment}
        style={styles.list}
        ListHeaderComponent={
          dayNotes.length > 0 ? (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notas</Text>
              {dayNotes.map(note => (
                <View key={note.id} style={styles.noteItem}>
                  <Text style={styles.noteContent}>{note.content}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <Text style={styles.deleteNoteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          dayAppointments.length === 0 && dayNotes.length === 0 ? (
            <Text style={styles.emptyText}>No hay turnos ni notas para este día</Text>
          ) : null
        }
      />

      {/* Modal de nuevo turno */}
      <Modal visible={showAppointmentModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Turno</Text>
            <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>DNI del Paciente *</Text>
            <TextInput
              style={styles.input}
              value={newAppointment.patientDni}
              onChangeText={text => setNewAppointment({ ...newAppointment, patientDni: text })}
              placeholder="Número de documento"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Nombre del Paciente</Text>
            <TextInput
              style={styles.input}
              value={newAppointment.patientName}
              onChangeText={text => setNewAppointment({ ...newAppointment, patientName: text })}
              placeholder="Nombre (opcional si está registrado)"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Horario *</Text>
            <TextInput
              style={styles.input}
              value={newAppointment.time}
              onChangeText={text => setNewAppointment({ ...newAppointment, time: text })}
              placeholder="HH:MM (ej: 14:30)"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAppointment.notes}
              onChangeText={text => setNewAppointment({ ...newAppointment, notes: text })}
              placeholder="Notas adicionales"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddAppointment}
          >
            <Text style={styles.saveButtonText}>Guardar Turno</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal de nota */}
      <Modal visible={showNoteModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Nota</Text>
            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Contenido</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newNote.content}
              onChangeText={text => setNewNote({ ...newNote, content: text })}
              placeholder="Escribe tu nota..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddNote}
          >
            <Text style={styles.saveButtonText}>Guardar Nota</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  calendar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: -6,
    backgroundColor: '#fff',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    backgroundColor: '#13ec80',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteButton: {
    backgroundColor: '#FF9800',
  },
  noteButtonText: {
    color: '#fff',
  },
  daySection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  list: {
    flex: 1,
  },
  appointmentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
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
    color: '#13ec80',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientDni: {
    fontSize: 12,
    color: '#666',
  },
  appointmentNotes: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  deleteText: {
    color: '#F44336',
    fontSize: 16,
    padding: 8,
  },
  notesSection: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deleteNoteText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
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
    minHeight: 100,
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
});
