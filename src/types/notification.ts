export interface Notification {
    id?: string;
    type: 'RIDE_REQUEST' | 'RIDE_ACCEPTED' | 'RIDE_REJECTED';
    rideId: string;
    fromUserId: string;
    fromUserName?: string; // Add this field
    toUserId: string;
    message: string;
    read: boolean;
    createdAt: Date;
    rideDetails?: {
        pickup: string;
        dropoff: string;
        fare: number;
        departureTime: string;
        passengerName: string;
    };
}