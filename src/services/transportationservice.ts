import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  GeoPoint,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Ride, RideRequest, Location, User, Route } from '../types/transportation';

export class TransportationService {
  private ridesCollection = collection(db, 'rides');
  private requestsCollection = collection(db, 'rideRequests');
  private usersCollection = collection(db, 'users');

  async createRide(rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      const ride = {
        ...rideData,
        driver: currentUser.uid,
        passengers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      };

      const docRef = await addDoc(this.ridesCollection, ride);
      return docRef.id;
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  }

  async searchRides(pickup: Location, dropoff: Location, departureTime: Date) {
    try {
      // This is a simple implementation. In production, you'd want to use
      // geohashing or a more sophisticated search algorithm
      const q = query(
        this.ridesCollection,
        where('status', '==', 'pending'),
        where('departureTime', '>=', departureTime)
      );

      const querySnapshot = await getDocs(q);
      const rides: Ride[] = [];

      querySnapshot.forEach((doc) => {
        const ride = { id: doc.id, ...doc.data() } as Ride;
        // Filter rides based on proximity to pickup/dropoff
        if (this.isLocationNearby(ride.route.startLocation, pickup, 5) && 
            this.isLocationNearby(ride.route.endLocation, dropoff, 5)) {
          rides.push(ride);
        }
      });

      return rides;
    } catch (error) {
      console.error('Error searching rides:', error);
      throw error;
    }
  }

  private isLocationNearby(loc1: Location, loc2: Location, kmThreshold: number): boolean {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(loc2.lat - loc1.lat);
    const dLon = this.toRad(loc2.lng - loc1.lng);
    const lat1 = this.toRad(loc1.lat);
    const lat2 = this.toRad(loc2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    return d <= kmThreshold;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  async requestRide(rideId: string, pickup: Location, dropoff: Location) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      const request: Omit<RideRequest, 'id'> = {
        user: currentUser.uid as any,
        pickup,
        dropoff,
        requestTime: new Date(),
        status: 'pending'
      };

      return await addDoc(this.requestsCollection, request);
    } catch (error) {
      console.error('Error requesting ride:', error);
      throw error;
    }
  }
}

export const transportationService = new TransportationService();