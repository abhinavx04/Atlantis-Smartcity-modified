import axios from 'axios';
import { Incident, IncidentType } from '../types/incident';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

class IncidentService {
  private incidentsCollection = collection(db, 'incidents');

  async fetchGoogleIncidents(bounds: google.maps.LatLngBounds): Promise<Incident[]> {
    try {
      const response = await axios.get(
        `https://roads.googleapis.com/v1/incidents?bounds=${bounds.toString()}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      return this.transformGoogleIncidents(response.data.incidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  }

  private transformGoogleIncidents(googleIncidents: any[]): Incident[] {
    return googleIncidents.map(incident => ({
      id: incident.id,
      type: this.mapIncidentType(incident.type),
      severity: this.calculateSeverity(incident),
      location: {
        lat: incident.location.latitude,
        lng: incident.location.longitude,
        address: incident.description
      },
      description: incident.description,
      timestamp: new Date(incident.startTime).toISOString(),
      status: 'active'
    }));
  }

  private mapIncidentType(googleType: string): IncidentType {
    const typeMap: Record<string, IncidentType> = {
      'ACCIDENT': 'ACCIDENT',
      'CONSTRUCTION': 'CONSTRUCTION',
      'WEATHER': 'WEATHER',
      // Add more mappings as needed
    };
    return typeMap[googleType] || 'OTHER';
  }

  private calculateSeverity(incident: any): 'low' | 'medium' | 'high' {
    // Implement severity calculation logic based on incident properties
    return 'medium';
  }

  subscribeToIncidents(callback: (incidents: Incident[]) => void) {
    const q = query(this.incidentsCollection, orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const incidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Incident[];
      callback(incidents);
    });
  }

  async addIncident(incident: Omit<Incident, 'id'>) {
    try {
      await addDoc(this.incidentsCollection, {
        ...incident,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding incident:', error);
      throw error;
    }
  }
}

export const incidentService = new IncidentService();