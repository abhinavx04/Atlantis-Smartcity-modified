import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { RideOffer } from '../../types/transportation';
import { IoPeople } from 'react-icons/io5';

const FindRideForm: React.FC = () => {
  const [availableRides, setAvailableRides] = useState<RideOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch rides
  const fetchRides = async () => {
    try {
      setIsLoading(true);
      const ridesRef = collection(db, 'rides');
      
      // Query for active rides
      const q = query(
        ridesRef,
        where('status', '==', 'active')
      );

      const querySnapshot = await getDocs(q);
      const rides: RideOffer[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const departureTime = data.departureTime?.toDate?.() || new Date(data.departureTime);
        
        rides.push({
          id: doc.id,
          ...data,
          departureTime: departureTime
        } as RideOffer);
      });

      // Sort rides by departure time
      const sortedRides = rides.sort((a, b) => {
        const timeA = new Date(a.departureTime).getTime();
        const timeB = new Date(b.departureTime).getTime();
        return timeA - timeB;
      });

      setAvailableRides(sortedRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleBookRide = async (ride: RideOffer) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to book a ride');
        return;
      }

      // Add booking logic here
      console.log('Booking ride:', ride);
      alert('Booking feature coming soon!');
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Failed to book ride');
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50"
        >
          <h2 className="text-xl text-white font-semibold mb-4">Available Rides</h2>
          {availableRides.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No rides available at the moment.</p>
          ) : (
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <motion.div
                  key={ride.id}
                  className="bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3">
                        {ride.driverProfile.photoURL && (
                          <img
                            src={ride.driverProfile.photoURL}
                            alt={ride.driverProfile.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="text-white font-medium">{ride.driverProfile.name}</h3>
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(Math.round(ride.driverProfile.rating || 5))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-gray-300 text-sm">
                          <span className="text-gray-400">When: </span>
                          {new Date(ride.departureTime).toLocaleString()}
                        </p>
                        <p className="text-gray-300 text-sm">
                          <span className="text-gray-400">From: </span>
                          {ride.route.pickup.address}
                        </p>
                        <p className="text-gray-300 text-sm">
                          <span className="text-gray-400">To: </span>
                          {ride.route.dropoff.address}
                        </p>
                        {ride.driverProfile.vehicleDetails && (
                          <p className="text-gray-300 text-sm">
                            <span className="text-gray-400">Vehicle: </span>
                            {ride.driverProfile.vehicleDetails.model} - {ride.driverProfile.vehicleDetails.color}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gray-800/50 p-2 rounded-lg">
                        <p className="text-green-400 font-bold text-xl">₹{ride.fare}</p>
                        <div className="flex items-center justify-end mt-1">
                          <IoPeople className="w-4 h-4 text-gray-400 mr-1" />
                          <p className="text-gray-300 text-sm">{ride.availableSeats} seats</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBookRide(ride)}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
                      >
                        Book Ride
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FindRideForm;