export interface RideLocation {
    latitude: number;
    longitude: number;
    address: string;
    placeId?: string;
  }
  
  export interface RideRequest {
    id: string;
    userId: string;
    userProfile: {
      name: string;
      phone: string;
      rating: number;
    };
    pickup: RideLocation;
    dropoff: RideLocation;
    timestamp: Date;
    status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
    fare: number;
    paymentStatus: 'pending' | 'completed';
    rideType: 'carpool' | 'taxi' | 'auto';
  }
  
  export interface RideOffer {
    id: string;
    driverId: string;
    driverProfile: {
      name: string;
      phone: string;
      rating: number;
      vehicleDetails: {
        model: string;
        number: string;
        color: string;
      };
    };
    route: {
      pickup: RideLocation;
      dropoff: RideLocation;
      waypoints?: RideLocation[];
    };
    availableSeats: number;
    departureTime: Date;
    fare: number;
    status: 'active' | 'inProgress' | 'completed' | 'cancelled';
    passengers: string[]; // Array of user IDs
  }