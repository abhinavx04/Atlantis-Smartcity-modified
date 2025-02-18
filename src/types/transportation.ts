export interface User {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber?: string;
    homeAddress?: Location;
    workAddress?: Location;
    preferredRoutes?: Route[];
    rating?: number;
    totalRides?: number;
  }
  
  export interface Location {
    lat: number;
    lng: number;
    address: string;
    placeId?: string;
  }
  
  export interface Route {
    startLocation: Location;
    endLocation: Location;
    waypoints?: Location[];
    distance?: number;
    duration?: number;
  }
  
  export interface Ride {
    id: string;
    driver: User;
    passengers: User[];
    maxPassengers: number;
    route: Route;
    departureTime: Date;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    fare: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface RideRequest {
    id: string;
    user: User;
    pickup: Location;
    dropoff: Location;
    requestTime: Date;
    status: 'pending' | 'accepted' | 'rejected';
  }