import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RideOffer } from '../../types/transportation';

interface RideBookingModalProps {
  ride: RideOffer | null;
  onClose: () => void;
  onConfirm: (ride: RideOffer) => void;
}

const RideBookingModal: React.FC<RideBookingModalProps> = ({ ride, onClose, onConfirm }) => {
  if (!ride) return null;

  const vehicleDetails = ride.driverProfile.vehicleDetails;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Confirm Booking</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Driver</span>
              <span className="text-white font-medium">{ride.driverProfile.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vehicle</span>
              <span className="text-white">
                {vehicleDetails ? `${vehicleDetails.model} - ${vehicleDetails.color}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vehicle Number</span>
              <span className="text-white font-mono">
                {vehicleDetails?.number || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Departure</span>
              <span className="text-white">
                {new Date(ride.departureTime).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fare</span>
              <span className="text-blue-400 font-bold">₹{ride.fare}</span>
            </div>

            <div className="border-t border-gray-700 my-4"></div>
            
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">From</span>
                <p className="text-white">{ride.route.pickup.address}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">To</span>
                <p className="text-white">{ride.route.dropoff.address}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(ride)}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RideBookingModal;