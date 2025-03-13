import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { transportationService } from '../../services/transportationservice';
import { notificationService } from '../../services/notificationService';
import { RideOffer } from '../../types/transportation';
import { Notification } from '../../types/notification';
import Navbar from '../Navbar';
import FindRideForm from './FindRideForm';
import OfferRideForm from './OfferRideForm';
import RideBookingModal from './RideBookingModal';
import NotificationPopup from '../Notifications/NotificationPopup';
import { motion, AnimatePresence } from 'framer-motion';

const Transportation: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [availableRides, setAvailableRides] = useState<RideOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<RideOffer | null>(null);
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
        setUserName(user.displayName || user.email?.split('@')[0] || 'Anonymous');
        
        // Subscribe to rides
        const unsubscribeRides = transportationService.subscribeToNearbyRides(
          { latitude: 0, longitude: 0, address: '' },
          (rides) => {
            setAvailableRides(rides);
            setLoading(false);
          }
        );

        // Subscribe to notifications
        const unsubscribeNotifications = notificationService.subscribeToNotifications(
          user.uid,
          (newNotifications) => {
            setNotifications(newNotifications);
          }
        );

        return () => {
          unsubscribeRides();
          unsubscribeNotifications();
        };
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRideSelect = (ride: RideOffer) => {
    setSelectedRide(ride);
  };

  const handleBookRide = async (ride: RideOffer) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Create the ride request with correct types
      const rideRequest: Omit<RideRequest, 'id'> = {
        userId: user.uid,
        userProfile: {
          name: userName,
          phone: '',
          rating: 5
        },
        pickup: ride.route.pickup,
        dropoff: ride.route.dropoff,
        timestamp: new Date(),
        status: 'pending' as const, // Fix status type
        fare: ride.fare,
        paymentStatus: 'pending' as const,
        rideType: 'carpool' as const
      };

      // Fix departureTime conversion to string
      const notification = {
        type: 'RIDE_REQUEST' as const,
        rideId: ride.id,
        fromUserId: user.uid,
        fromUserName: userName,
        toUserId: ride.driverId,
        message: `New ride request from ${userName}`,
        rideDetails: {
          pickup: ride.route.pickup.address,
          dropoff: ride.route.dropoff.address,
          fare: ride.fare,
          departureTime: new Date(ride.departureTime).toISOString(),
          passengerName: userName
        }
      };

      await transportationService.createRideRequest(rideRequest);
      await notificationService.createNotification(notification);

      setSelectedRide(null);
      alert('Ride request sent successfully!');
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Failed to book ride. Please try again.');
    }
  };

  const handleAcceptRide = async (notification: Notification) => {
    try {
      await transportationService.updateRideStatus(notification.rideId, 'accepted');
      
      await notificationService.createNotification({
        type: 'RIDE_ACCEPTED',
        rideId: notification.rideId,
        fromUserId: currentUser!,
        fromUserName: userName,
        toUserId: notification.fromUserId,
        message: `${userName} has accepted your ride request!`,
        rideDetails: notification.rideDetails
      });

      await notificationService.markAsRead(notification.id!);
      alert('Ride request accepted!');
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Failed to accept ride. Please try again.');
    }
  };

  const handleRejectRide = async (notification: Notification) => {
    try {
      await transportationService.updateRideStatus(notification.rideId, 'rejected');
      
      await notificationService.createNotification({
        type: 'RIDE_REJECTED',
        rideId: notification.rideId,
        fromUserId: currentUser!,
        fromUserName: userName,
        toUserId: notification.fromUserId,
        message: `${userName} has rejected your ride request.`,
        rideDetails: notification.rideDetails
      });

      await notificationService.markAsRead(notification.id!);
      alert('Ride request rejected.');
    } catch (error) {
      console.error('Error rejecting ride:', error);
      alert('Failed to reject ride. Please try again.');
    }
  };

  const handleCloseNotification = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      
      <Navbar currentUser={userName} />

      <div className="container mx-auto px-4 py-24">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
          <h1 className="text-3xl font-['Syncopate'] text-white mb-6 tracking-wider">
            SMART TRANSPORTATION
          </h1>

          {/* Tab buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'find' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              Find a Ride
            </button>
            <button
              onClick={() => setActiveTab('offer')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'offer' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              Offer a Ride
            </button>
          </div>

          {/* Forms */}
          <div className="grid grid-cols-1 gap-8">
            {activeTab === 'find' ? (
              <div>
                <FindRideForm />
                {/* Available rides list */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl text-white mb-4">Available Rides</h3>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : availableRides.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No rides available at the moment.</p>
                  ) : (
                    availableRides.map((ride) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-700/30 p-6 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-all duration-300"
                        onClick={() => handleRideSelect(ride)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              {ride.driverProfile.photoURL && (
                                <img
                                  src={ride.driverProfile.photoURL}
                                  alt={ride.driverProfile.name}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div>
                                <p className="text-white font-medium">{ride.driverProfile.name}</p>
                                <div className="flex text-yellow-400 text-sm">
                                  {'★'.repeat(Math.round(ride.driverProfile.rating || 5))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-300">
                              <span className="text-gray-400">From: </span>
                              {ride.route.pickup.address}
                            </p>
                            <p className="text-gray-300">
                              <span className="text-gray-400">To: </span>
                              {ride.route.dropoff.address}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {new Date(ride.departureTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold text-xl">₹{ride.fare}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {ride.availableSeats} seats available
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRideSelect(ride);
                              }}
                              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <OfferRideForm />
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRide && (
        <RideBookingModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onConfirm={handleBookRide}
        />
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <NotificationPopup
            key={notification.id}
            notification={notification}
            onAccept={() => handleAcceptRide(notification)}
            onReject={() => handleRejectRide(notification)}
            onClose={() => handleCloseNotification(notification.id!)}
            style={{
              bottom: `${(index * 120) + 16}px`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Transportation;