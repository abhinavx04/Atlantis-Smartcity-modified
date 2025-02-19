import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RideOffer } from '../../types/transportation';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { IoCarSport, IoLocation, IoTime, IoPeople, IoCash } from 'react-icons/io5';

interface AvailableRidesProps {
  onRideSelect: (ride: RideOffer) => void;
  searchCriteria?: {
    date?: string;
    pickup?: string;
    dropoff?: string;
    passengers?: number;
  };
}

const AvailableRides: React.FC<AvailableRidesProps> = ({ onRideSelect, searchCriteria }) => {
  const [rides, setRides] = useState<RideOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current timestamp for comparison
    const now = Timestamp.now();

    // Create query to get active rides
    const ridesQuery = query(
      collection(db, 'rides'),
      where('status', '==', 'active'),
      where('departureTime', '>=', now)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(ridesQuery, (snapshot) => {
      const availableRides: RideOffer[] = [];
      snapshot.forEach((doc) => {
        const rideData = doc.data() as RideOffer;
        // Filter rides based on search criteria if provided
        if (searchCriteria) {
          const rideDate = new Date(rideData.departureTime).toISOString().split('T')[0];
          if (
            searchCriteria.date &&
            rideDate !== searchCriteria.date
          ) {
            return;
          }
          if (
            searchCriteria.passengers &&
            rideData.availableSeats < searchCriteria.passengers
          ) {
            return;
          }
        }
        availableRides.push({
          id: doc.id,
          ...rideData
        });
      });
      
      // Sort rides by departure time
      availableRides.sort((a, b) => 
        new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      );
      
      setRides(availableRides);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchCriteria]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No rides available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <motion.div
          key={ride.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all cursor-pointer"
          onClick={() => onRideSelect(ride)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img
                  src={ride.driverProfile.photoURL || 'https://via.placeholder.com/40'}
                  alt={ride.driverProfile.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{ride.driverProfile.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    {'★'.repeat(Math.round(ride.driverProfile.rating))}
                    <span className="text-gray-400 text-sm ml-1">
                      ({ride.driverProfile.rating})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-gray-300">
                <IoLocation className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm">{ride.route.pickup.address}</p>
                  <p className="text-sm mt-1">{ride.route.dropoff.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-300">
                  <IoTime className="w-5 h-5 text-green-500" />
                  <span>
                    {new Date(ride.departureTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <IoPeople className="w-5 h-5 text-yellow-500" />
                  <span>{ride.availableSeats} seats left</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IoCarSport className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-300">
                    {ride.driverProfile.vehicleDetails.model} - {ride.driverProfile.vehicleDetails.color}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <IoCash className="w-5 h-5 text-green-500" />
                  <span className="text-white font-bold">₹{ride.fare}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AvailableRides;