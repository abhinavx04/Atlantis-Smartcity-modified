export interface Incident {
    id: string;
    type: IncidentType;
    severity: 'low' | 'medium' | 'high';
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    description: string;
    timestamp: string;
    status: 'active' | 'resolved';
  }
  
  export type IncidentType = 
    | 'ACCIDENT'
    | 'CONSTRUCTION'
    | 'WEATHER'
    | 'POLICE'
    | 'FIRE'
    | 'MEDICAL'
    | 'OTHER';