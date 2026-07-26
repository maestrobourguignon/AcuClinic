import { ChannelRelations } from '../types';

export const channelRelations: ChannelRelations = {
  P: ['Bp', 'B', 'IG', 'B', 'F'],
  IG: ['E', 'F', 'P', 'R', 'E'],
  E: ['IG', 'Pc', 'Bp', 'Pc', 'IG'],
  Bp: ['P', 'ID', 'E', 'TA', 'C'],
  C: ['R', 'VB', 'ID', 'VB', 'Bp'],
  ID: ['B', 'Bp', 'C', 'F', 'B'],
  B: ['ID', 'P', 'R', 'P', 'ID'],
  R: ['C', 'TA', 'B', 'IG', 'Pc'],
  Pc: ['F', 'E', 'TA', 'E', 'R'],
  TA: ['VB', 'R', 'Pc', 'Bp', 'VB'],
  VB: ['TA', 'C', 'F', 'C', 'TA'],
  F: ['Pc', 'IG', 'VB', 'ID', 'P'],
};
