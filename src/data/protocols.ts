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
  'pulmon': '13V',    // Feishu
  'intestino-grueso': '25IG', // No existe, usar 11V
  'estomago': '20V',   // Weishu
  'bazo-pancreas': '19V', // Pishu
  'corazon': '15V',   // Xinshu
  'intestino-delgado': '27V', // No existe, usar 14V
  'vejiga': '23V',   // Shenshu
  'rinon': '23V',    // Shenshu
  'maestro-corazon': '14V', // No existe, usar 15V
  'triple-recalentador': '22V', // Sanjiaoshu
  'vesicula-biliar': '19V', // Ganshu
  'higado': '18V',    // Ganshu
};

// Puntos Mu de alarma (para tratamiento de órganos)
export const muPoints = {
  'pulmon': '1P',     // Zhongfu
  'intestino-grueso': '25IG', // No existe
  'estomago': '30E',  // Qichong
  'bazo-pancreas': '13E', // No existe
  'corazon': '1MC',   // Tianchi
  'intestino-delgado': '24IG', // No existe
  'vejiga': '3RM',    // Zhongji
  'rinon': '25E',     // No existe
  'maestro-corazon': '17RM', // Shanzhong
  'triple-recalentador': '17RM', // Shanzhong
  'vesicula-biliar': '24IG', // No existe
  'higado': '13H',    // Zhangmen
};
