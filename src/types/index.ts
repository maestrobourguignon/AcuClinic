// Tipos principales de la aplicación AcuClinic

// Meridianos
export type MeridianType = 
  | 'Pulmón' | 'Intestino Grueso' | 'Estómago' | 'Bazo-Páncreas'
  | 'Corazón' | 'Intestino Delgado' | 'Vejiga' | 'Riñón'
  | 'Maestro Corazón' | 'Triple Recalentador' | 'Vesícula Biliar' | 'Hígado'
  | 'Vaso Gobernador' | 'Vaso Concepción';

export interface Meridian {
  id: string;
  name: string;
  nameChinese: string;
  type: 'Yin' | 'Yang';
  organ: MeridianType;
  points: Point[];
}

// Puntos de acupuntura
export type PointTechnique = 'sedar' | 'tonificar' | 'moxar';

export interface Point {
  id: string; // ej: "P1", "E36"
  number: number;
  name: string;
  nameChinese: string;
  meridianId: string;
  location: string;
  indications?: string | string[];
  treatments?: string | string[];
}

// Fórmulas de tratamiento
export interface FormulaPoint {
  pointId: string;
  technique?: PointTechnique;
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  points: FormulaPoint[];
  category?: string;
  isCustom?: boolean;
}

// Protocolos
export type ProtocolType = 'raiz-rama' | 'tecnica-planos' | 'tratamiento-base';

export interface Protocol {
  id: ProtocolType;
  name: string;
  description: string;
  organSelection?: boolean;
}

// ============================================
// TIPOS DE PACIENTE Y TRATAMIENTOS
// ============================================

// Tipos de tratamiento
export type TreatmentType = 'sindromico' | 'dolor' | 'otro';

// Paciente
export interface Patient {
  dni: string; // ID del paciente
  lastName: string;     // Apellido
  firstName: string;    // Nombre
  birthDate?: string;   // Fecha de nacimiento (YYYY-MM-DD)
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

// Tratamiento (agrupa varias sesiones)
export interface Treatment {
  id: string;
  patientDni: string;
  type: TreatmentType;  // síndrome, dolor, otro
  reason: string;       // Motivo de consulta
  startDate: string;   // Fecha de inicio
  endDate?: string;     // Fecha de fin (opcional)
  notes?: string;
  isActive: boolean;   // Si está en curso
}

// Sesión de tratamiento (cada visita)
export interface TreatmentSession {
  id: string;
  treatmentId: string;
  sessionNumber: number;  // 1, 2, 3... (secuencial dentro del tratamiento)
  date: string;
  // Primera sesión: estado actual del paciente
  patientState?: string;  // Estado actual del paciente (solo sesión 1)
  // Tratamiento realizado
  treatment: string;
  // Puntos utilizados
  pointsUsed: FormulaPoint[];
  // Cómo se sintió después
  observations?: string;
  // Notas adicionales
  notes?: string;
}

// Historia clínica (deprecated - usar Treatment y TreatmentSession)
export interface ClinicalRecord {
  id: string;
  patientDni: string;
  date: string;
  reason: string;
  treatment: string;
  pointsUsed: FormulaPoint[];
  observations: string;
  notes?: string;
}

// Turnos
export interface Appointment {
  id: string;
  patientDni: string;
  patientName: string;
  date: string; // ISO date string
  time: string; // HH:mm
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Nota del calendario
export interface CalendarNote {
  id: string;
  date: string;
  content: string;
  type: 'general' | 'patient';
  patientDni?: string;
}
