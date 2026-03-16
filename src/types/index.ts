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
  id: string; // ej: "1P", "36E"
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
  technique?: PointTechnique; // Opcional para fórmulas predefinidas, requerido para personalizadas
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  points: FormulaPoint[];
  category?: string; // ej: "Gastralgia", "Asma", "Personal"
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

// Paciente
export interface Patient {
  dni: string; // ID del paciente
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

// Historia clínica
export interface ClinicalRecord {
  id: string;
  patientDni: string;
  date: string;
  reason: string; // Motivo de consulta
  treatment: string; // Treatment applied
  pointsUsed: FormulaPoint[];
  observations: string; // Cómo se sintió después
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
