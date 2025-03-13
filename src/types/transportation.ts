import { Timestamp } from 'firebase/firestore';

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface VehicleDetails {
  model: string;
  number: string;
  color: string;
}

export interface UserProfile {
  name: string;
  photoURL?: string;
  phone: string;
  rating: number;
  vehicleDetails?: VehicleDetails;
}

export interface RideOffer {
  id: string;
  driverId: string;
  driverProfile: UserProfile;
  route: {
    pickup: Location;
    dropoff: Location;
  };
  departureTime: Date | string;
  availableSeats: number;
  fare: number;
  status: 'active' | 'completed' | 'cancelled';
  passengers: string[];
  createdAt: Timestamp; // Updated to use imported Timestamp
}

export interface RideRequest {
  id: string;
  userId: string;
  userProfile: UserProfile;
  pickup: Location;
  dropoff: Location;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  fare: number;
  paymentStatus: 'pending' | 'completed';
  rideType: 'carpool' | 'taxi' | 'auto';
}