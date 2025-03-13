import { db, auth } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  GeoPoint 
} from 'firebase/firestore';
import { RideRequest, RideOffer, RideLocation, Location } from '../types/transportation';

class TransportationService {
  private ridesCollection = collection(db, 'rides');
  private requestsCollection = collection(db, 'rideRequests');
  private usersCollection = collection(db, 'users');

  async createRideOffer(offer: Omit<RideOffer, 'id'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const offerData = {
      ...offer,
      driverId: user.uid,
      timestamp: serverTimestamp(),
      status: 'active',
      passengers: []
    };

    const docRef = await addDoc(this.ridesCollection, offerData);
    return docRef.id;
  }

  async createRideRequest(request: Omit<RideRequest, 'id'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const requestData = {
      ...request,
      userId: user.uid,
      timestamp: serverTimestamp(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    const docRef = await addDoc(this.requestsCollection, requestData);
    return docRef.id;
  }

  async findNearbyRides(
    pickup: Location,
    dropoff: Location,
    maxDistance: number = 5 // km
  ): Promise<RideOffer[]> {
    const q = query(
      this.ridesCollection,
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(q);
    const rides: RideOffer[] = [];

    querySnapshot.forEach((doc) => {
      const ride = { id: doc.id, ...doc.data() } as RideOffer;
      if (this.isLocationNearby(ride.route.pickup, pickup, maxDistance) &&
          this.isLocationNearby(ride.route.dropoff, dropoff, maxDistance)) {
        rides.push(ride);
      }
    });

    return rides;
  }

  // Real-time listeners
  subscribeToRideUpdates(rideId: string, callback: (ride: RideOffer) => void) {
    return onSnapshot(doc(db, 'rides', rideId), (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() } as RideOffer);
      }
    });
  }

  subscribeToNearbyRides(location: RideLocation, callback: (rides: RideOffer[]) => void) {
    const now = new Date('2025-02-18T10:12:26Z'); // Current system time
    
    const q = query(
      this.ridesCollection,
      where('status', '==', 'active'),
      where('departureTime', '>=', now)
    );

    return onSnapshot(q, (snapshot) => {
      const rides: RideOffer[] = [];
      snapshot.forEach((doc) => {
        const ride = { id: doc.id, ...doc.data() } as RideOffer;
        if (this.isLocationNearby(ride.route.pickup, location, 5)) {
          rides.push(ride);
        }
      });
      callback(rides);
    });
  }

  async bookRide(rideId: string, userId: string = 'abhinavx04'): Promise<void> {
    const rideRef = doc(db, 'rides', rideId);
    const ride = (await getDocs(query(this.ridesCollection, where('id', '==', rideId)))).docs[0];

    if (!ride) {
      throw new Error('Ride not found');
    }

    const rideData = ride.data() as RideOffer;
    if (rideData.availableSeats <= 0) {
      throw new Error('No seats available');
    }

    await updateDoc(rideRef, {
      availableSeats: rideData.availableSeats - 1,
      passengers: [...rideData.passengers, userId],
      lastUpdated: serverTimestamp()
    });

    // Create a booking record
    await addDoc(collection(db, 'bookings'), {
      rideId,
      userId,
      status: 'confirmed',
      bookedAt: serverTimestamp(),
      fareAmount: rideData.fare,
      paymentStatus: 'pending'
    });
  }

  async cancelRide(rideId: string, userId: string = 'abhinavx04'): Promise<void> {
    const rideRef = doc(db, 'rides', rideId);
    const ride = (await getDocs(query(this.ridesCollection, where('id', '==', rideId)))).docs[0];

    if (!ride) {
      throw new Error('Ride not found');
    }

    const rideData = ride.data() as RideOffer;
    await updateDoc(rideRef, {
      availableSeats: rideData.availableSeats + 1,
      passengers: rideData.passengers.filter(id => id !== userId),
      lastUpdated: serverTimestamp()
    });

    // Update booking status
    const bookingQuery = query(
      collection(db, 'bookings'),
      where('rideId', '==', rideId),
      where('userId', '==', userId)
    );

    const bookingDocs = await getDocs(bookingQuery);
    bookingDocs.forEach(async (bookingDoc) => {
      await updateDoc(doc(db, 'bookings', bookingDoc.id), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });
    });
  }

  async updateRideStatus(rideId: string, status: 'accepted' | 'rejected' | 'completed'): Promise<void> {
    const rideRef = doc(this.ridesCollection, rideId);
    await updateDoc(rideRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  private isLocationNearby(loc1: Location, loc2: Location, maxDistance: number): boolean {
    const R = 6371; // Earth's radius in km
    const lat1 = this.toRad(loc1.latitude);
    const lat2 = this.toRad(loc2.latitude);
    const dLat = this.toRad(loc2.latitude - loc1.latitude);
    const dLon = this.toRad(loc2.longitude - loc1.longitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    return d <= maxDistance;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}

export const transportationService = new TransportationService();