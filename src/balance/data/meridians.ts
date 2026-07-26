import { Meridian, MeridianId } from '../types';

export const MERIDIANS: Record<MeridianId, Meridian> = {
  P: { id: 'P', name: 'Pulmón', group: 'upper', color: '#fff', textColor: '#000' },
  Pc: { id: 'Pc', name: 'Pericardio', group: 'upper', color: '#f44b42', textColor: '#fff' },
  C: { id: 'C', name: 'Corazón', group: 'upper', color: '#f44b42', textColor: '#fff' },
  IG: { id: 'IG', name: 'Intestino Grueso', group: 'upper', color: '#fff', textColor: '#000' },
  TA: { id: 'TA', name: 'Triple Recipiente', group: 'upper', color: '#f44b42', textColor: '#fff' },
  ID: { id: 'ID', name: 'Intestino Delgado', group: 'upper', color: '#f44b42', textColor: '#fff' },

  Bp: { id: 'Bp', name: 'Bazo Páncreas', group: 'lower', color: '#f4dc42', textColor: '#000' },
  F: { id: 'F', name: 'Hígado', group: 'lower', color: '#4ece72', textColor: '#000' },
  R: { id: 'R', name: 'Riñón', group: 'lower', color: '#000', textColor: '#fff' },
  E: { id: 'E', name: 'Estómago', group: 'lower', color: '#f4dc42', textColor: '#000' },
  VB: { id: 'VB', name: 'Vesícula Biliar', group: 'lower', color: '#4ece72', textColor: '#000' },
  B: { id: 'B', name: 'Vejiga', group: 'lower', color: '#000', textColor: '#fff' },
};

export const MERIDIAN_LIST = Object.values(MERIDIANS);
export const UPPER_MERIDIANS = MERIDIAN_LIST.filter(m => m.group === 'upper');
export const LOWER_MERIDIANS = MERIDIAN_LIST.filter(m => m.group === 'lower');
