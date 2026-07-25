// Store principal de la aplicación
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, ClinicalRecord, Appointment, CalendarNote, Formula, Treatment, TreatmentSession, TreatmentType } from '../types';

interface AppState {
  // Pacientes
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (dni: string, patient: Partial<Patient>) => void;
  deletePatient: (dni: string) => void;
  loadPatients: () => Promise<void>;

  // Tratamientos (nuevo)
  treatments: Treatment[];
  addTreatment: (treatment: Treatment) => void;
  updateTreatment: (id: string, treatment: Partial<Treatment>) => void;
  deleteTreatment: (id: string) => void;
  loadTreatments: () => Promise<void>;

  // Sesiones de tratamiento (nuevo)
  treatmentSessions: TreatmentSession[];
  addTreatmentSession: (session: TreatmentSession) => void;
  updateTreatmentSession: (id: string, session: Partial<TreatmentSession>) => void;
  deleteTreatmentSession: (id: string) => void;
  loadTreatmentSessions: () => Promise<void>;

  // Historias clínicas (legacy - mantener por compatibilidad)
  clinicalRecords: ClinicalRecord[];
  addClinicalRecord: (record: ClinicalRecord) => void;
  updateClinicalRecord: (id: string, record: Partial<ClinicalRecord>) => void;
  deleteClinicalRecord: (id: string) => void;
  loadClinicalRecords: () => Promise<void>;

  // Turnos
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  loadAppointments: () => Promise<void>;

  // Notas del calendario
  calendarNotes: CalendarNote[];
  addCalendarNote: (note: CalendarNote) => void;
  updateCalendarNote: (id: string, note: Partial<CalendarNote>) => void;
  deleteCalendarNote: (id: string) => void;
  loadCalendarNotes: () => Promise<void>;

  // Fórmulas personalizadas
  customFormulas: Formula[];
  addCustomFormula: (formula: Formula) => void;
  updateCustomFormula: (id: string, formula: Partial<Formula>) => void;
  deleteCustomFormula: (id: string) => void;
  loadCustomFormulas: () => Promise<void>;

  // Loading states
  isLoading: boolean;
  loadAllData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial states
  patients: [],
  treatments: [],
  treatmentSessions: [],
  clinicalRecords: [],
  appointments: [],
  calendarNotes: [],
  customFormulas: [],
  isLoading: false,

  // Pacientes
  addPatient: async (patient: Patient) => {
    const newPatients = [...get().patients, patient];
    set({ patients: newPatients });
    await AsyncStorage.setItem('patients', JSON.stringify(newPatients));
  },

  updatePatient: async (dni: string, updates: Partial<Patient>) => {
    const newPatients = get().patients.map(p => 
      p.dni === dni ? { ...p, ...updates } : p
    );
    set({ patients: newPatients });
    await AsyncStorage.setItem('patients', JSON.stringify(newPatients));
  },

  deletePatient: async (dni: string) => {
    const newPatients = get().patients.filter(p => p.dni !== dni);
    set({ patients: newPatients });
    await AsyncStorage.setItem('patients', JSON.stringify(newPatients));
  },

  loadPatients: async () => {
    try {
      const data = await AsyncStorage.getItem('patients');
      if (data) {
        set({ patients: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  },

  // Tratamientos
  addTreatment: async (treatment: Treatment) => {
    const newTreatments = [...get().treatments, treatment];
    set({ treatments: newTreatments });
    await AsyncStorage.setItem('treatments', JSON.stringify(newTreatments));
  },

  updateTreatment: async (id: string, updates: Partial<Treatment>) => {
    const newTreatments = get().treatments.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    set({ treatments: newTreatments });
    await AsyncStorage.setItem('treatments', JSON.stringify(newTreatments));
  },

  deleteTreatment: async (id: string) => {
    const newTreatments = get().treatments.filter(t => t.id !== id);
    set({ treatments: newTreatments });
    await AsyncStorage.setItem('treatments', JSON.stringify(newTreatments));
  },

  loadTreatments: async () => {
    try {
      const data = await AsyncStorage.getItem('treatments');
      if (data) {
        set({ treatments: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading treatments:', error);
    }
  },

  // Sesiones de tratamiento
  addTreatmentSession: async (session: TreatmentSession) => {
    const newSessions = [...get().treatmentSessions, session];
    set({ treatmentSessions: newSessions });
    await AsyncStorage.setItem('treatmentSessions', JSON.stringify(newSessions));
  },

  updateTreatmentSession: async (id: string, updates: Partial<TreatmentSession>) => {
    const newSessions = get().treatmentSessions.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    set({ treatmentSessions: newSessions });
    await AsyncStorage.setItem('treatmentSessions', JSON.stringify(newSessions));
  },

  deleteTreatmentSession: async (id: string) => {
    const newSessions = get().treatmentSessions.filter(s => s.id !== id);
    set({ treatmentSessions: newSessions });
    await AsyncStorage.setItem('treatmentSessions', JSON.stringify(newSessions));
  },

  loadTreatmentSessions: async () => {
    try {
      const data = await AsyncStorage.getItem('treatmentSessions');
      if (data) {
        set({ treatmentSessions: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading treatment sessions:', error);
    }
  },

  // Historias clínicas (legacy)
  addClinicalRecord: async (record: ClinicalRecord) => {
    const newRecords = [...get().clinicalRecords, record];
    set({ clinicalRecords: newRecords });
    await AsyncStorage.setItem('clinicalRecords', JSON.stringify(newRecords));
  },

  updateClinicalRecord: async (id: string, updates: Partial<ClinicalRecord>) => {
    const newRecords = get().clinicalRecords.map(r => 
      r.id === id ? { ...r, ...updates } : r
    );
    set({ clinicalRecords: newRecords });
    await AsyncStorage.setItem('clinicalRecords', JSON.stringify(newRecords));
  },

  deleteClinicalRecord: async (id: string) => {
    const newRecords = get().clinicalRecords.filter(r => r.id !== id);
    set({ clinicalRecords: newRecords });
    await AsyncStorage.setItem('clinicalRecords', JSON.stringify(newRecords));
  },

  loadClinicalRecords: async () => {
    try {
      const data = await AsyncStorage.getItem('clinicalRecords');
      if (data) {
        set({ clinicalRecords: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading clinical records:', error);
    }
  },

  // Turnos
  addAppointment: async (appointment: Appointment) => {
    const newAppointments = [...get().appointments, appointment];
    set({ appointments: newAppointments });
    await AsyncStorage.setItem('appointments', JSON.stringify(newAppointments));
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>) => {
    const newAppointments = get().appointments.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    set({ appointments: newAppointments });
    await AsyncStorage.setItem('appointments', JSON.stringify(newAppointments));
  },

  deleteAppointment: async (id: string) => {
    const newAppointments = get().appointments.filter(a => a.id !== id);
    set({ appointments: newAppointments });
    await AsyncStorage.setItem('appointments', JSON.stringify(newAppointments));
  },

  loadAppointments: async () => {
    try {
      const data = await AsyncStorage.getItem('appointments');
      if (data) {
        set({ appointments: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  },

  // Notas del calendario
  addCalendarNote: async (note: CalendarNote) => {
    const newNotes = [...get().calendarNotes, note];
    set({ calendarNotes: newNotes });
    await AsyncStorage.setItem('calendarNotes', JSON.stringify(newNotes));
  },

  updateCalendarNote: async (id: string, updates: Partial<CalendarNote>) => {
    const newNotes = get().calendarNotes.map(n => 
      n.id === id ? { ...n, ...updates } : n
    );
    set({ calendarNotes: newNotes });
    await AsyncStorage.setItem('calendarNotes', JSON.stringify(newNotes));
  },

  deleteCalendarNote: async (id: string) => {
    const newNotes = get().calendarNotes.filter(n => n.id !== id);
    set({ calendarNotes: newNotes });
    await AsyncStorage.setItem('calendarNotes', JSON.stringify(newNotes));
  },

  loadCalendarNotes: async () => {
    try {
      const data = await AsyncStorage.getItem('calendarNotes');
      if (data) {
        set({ calendarNotes: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading calendar notes:', error);
    }
  },

  // Fórmulas personalizadas
  addCustomFormula: async (formula: Formula) => {
    const newFormulas = [...get().customFormulas, { ...formula, isCustom: true }];
    set({ customFormulas: newFormulas });
    await AsyncStorage.setItem('customFormulas', JSON.stringify(newFormulas));
  },

  updateCustomFormula: async (id: string, updates: Partial<Formula>) => {
    const newFormulas = get().customFormulas.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    set({ customFormulas: newFormulas });
    await AsyncStorage.setItem('customFormulas', JSON.stringify(newFormulas));
  },

  deleteCustomFormula: async (id: string) => {
    const newFormulas = get().customFormulas.filter(f => f.id !== id);
    set({ customFormulas: newFormulas });
    await AsyncStorage.setItem('customFormulas', JSON.stringify(newFormulas));
  },

  loadCustomFormulas: async () => {
    try {
      const data = await AsyncStorage.getItem('customFormulas');
      if (data) {
        set({ customFormulas: JSON.parse(data) });
      }
    } catch (error) {
      console.error('Error loading custom formulas:', error);
    }
  },

  // Load all data
  loadAllData: async () => {
    set({ isLoading: true });
    await Promise.all([
      get().loadPatients(),
      get().loadTreatments(),
      get().loadTreatmentSessions(),
      get().loadClinicalRecords(),
      get().loadAppointments(),
      get().loadCalendarNotes(),
      get().loadCustomFormulas(),
    ]);
    set({ isLoading: false });
  },
}));
