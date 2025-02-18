export interface EmergencyAlert {
  id: string;
  type: 'disaster' | 'accident' | 'safety' | 'outage';
  title: string;
  description: string;
  location: { lat: number; lng: number };
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
}

export interface EmergencyReport {
  id: string;
  type: string;
  description: string;
  location: { lat: number; lng: number };
  images: string[];
  status: 'pending' | 'investigating' | 'resolved';
  timestamp: Date;
}

export interface SafetyGuide {
  id: string;
  title: string;
  category: string;
  steps: string[];
  images?: string[];
}