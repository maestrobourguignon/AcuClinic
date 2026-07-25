// Protocolos de tratamiento
import { Protocol } from '../types';

export const protocols: Protocol[] = [
  {
    id: 'raiz-rama',
    name: 'Tratamiento Raíz-Rama (Ben-Biao)',
    description: 'Jerarquía entre la causa y el síntoma. La Raíz (Ben) es el factor etiológico primario, la Rama (Biao) son los síntomas secundarios.',
    organSelection: true,
  },
  {
    id: 'tecnica-planos',
    name: 'Técnica de Planos (Jie-Gen)',
    description: 'Para desbloquear la circulación energética en casos de estancamiento que producen dolor.',
    organSelection: true,
  },
  {
    id: 'tratamiento-base',
    name: 'Tratamiento Base',
    description: 'Fórmula protocolaria basada en las "ocho reglas" (Ba Gang). Estructura: Punto Emperador, Puntos Ministros, Puntos Ayudantes.',
    organSelection: true,
  },
];

// Órganos/Vísceras para selección en protocolos
export const organs = [
  { id: 'pulmon', name: 'Pulmón', meridian: 'P' },
  { id: 'intestino-grueso', name: 'Intestino Grueso', meridian: 'IG' },
  { id: 'estomago', name: 'Estómago', meridian: 'E' },
  { id: 'bazo-pancreas', name: 'Bazo-Páncreas', meridian: 'BP' },
  { id: 'corazon', name: 'Corazón', meridian: 'C' },
  { id: 'intestino-delgado', name: 'Intestino Delgado', meridian: 'ID' },
  { id: 'vejiga', name: 'Vejiga', meridian: 'V' },
  { id: 'rinon', name: 'Riñón', meridian: 'R' },
  { id: 'maestro-corazon', name: 'Maestro Corazón', meridian: 'MC' },
  { id: 'triple-recalentador', name: 'Triple Recalentador', meridian: 'TR' },
  { id: 'vesicula-biliar', name: 'Vesícula Biliar', meridian: 'VB' },
  { id: 'higado', name: 'Hígado', meridian: 'H' },
];

// Puntos Shu del dorso (para tratamiento de órganos)
export const shuPoints = {
  'pulmon': 'V13',    // Feishu
  'intestino-grueso': 'IG25', // No existe, usar V11
  'estomago': 'V20',   // Weishu
  'bazo-pancreas': 'V19', // Pishu
  'corazon': 'V15',   // Xinshu
  'intestino-delgado': 'V27', // No existe, usar V14
  'vejiga': 'V23',   // Shenshu
  'rinon': 'V23',    // Shenshu
  'maestro-corazon': 'V14', // No existe, usar V15
  'triple-recalentador': 'V22', // Sanjiaoshu
  'vesicula-biliar': 'V19', // Ganshu
  'higado': 'V18',    // Ganshu
};

// Puntos Mu de alarma (para tratamiento de órganos)
export const muPoints = {
  'pulmon': 'P1',     // Zhongfu
  'intestino-grueso': 'IG25', // No existe
  'estomago': 'E30',  // Qichong
  'bazo-pancreas': 'E13', // No existe
  'corazon': 'MC1',   // Tianchi
  'intestino-delgado': 'IG24', // No existe
  'vejiga': 'RM3',    // Zhongji
  'rinon': 'E25',     // No existe
  'maestro-corazon': 'RM17', // Shanzhong
  'triple-recalentador': 'RM17', // Shanzhong
  'vesicula-biliar': 'IG24', // No existe
  'higado': 'H13',    // Zhangmen
};
