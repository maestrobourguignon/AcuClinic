export type MeridianId = 'P' | 'Pc' | 'C' | 'IG' | 'TA' | 'ID' | 'Bp' | 'F' | 'R' | 'E' | 'VB' | 'B';
export type MeridianGroup = 'upper' | 'lower';
export type ConnectionType = 'empe' | 'deitado' | 'quadrado';

export interface Meridian {
  id: MeridianId;
  name: string;
  group: MeridianGroup;
  color: string;
  textColor: string;
}

export interface Combination {
  id: string;
  point1: MeridianId;
  point2: MeridianId;
  point3: MeridianId;
  point4: MeridianId;
  connectionType: ConnectionType;
}

export interface ChannelRelations {
  [key: string]: string[];
}
