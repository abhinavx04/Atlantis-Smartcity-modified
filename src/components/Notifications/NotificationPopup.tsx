import React from 'react';
import { motion } from 'framer-motion';
import { IoClose, IoCheckmark, IoClose as IoX } from 'react-icons/io5';
import { Notification } from '../../types/notification';

interface NotificationPopupProps {
  notification: Notification;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notification,
  onAccept,
  onReject,
  onClose,
  style
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg p-6 w-96 z-50"
      style={style}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">
          {notification.type === 'RIDE_REQUEST' ? 'New Ride Request' :
           notification.type === 'RIDE_ACCEPTED' ? 'Ride Accepted' :
           'Ride Rejected'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <IoClose size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-300">{notification.message}</p>
        
        <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">From: </span>
            {notification.rideDetails?.pickup}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">To: </span>
            {notification.rideDetails?.dropoff}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Time: </span>
            {notification.rideDetails?.departureTime && new Date(notification.rideDetails.departureTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Passenger: </span>
            {notification.rideDetails?.passengerName}
          </p>
          <p className="text-green-400 font-semibold">
            ₹{notification.rideDetails?.fare}
          </p>
        </div>

        {notification.type === 'RIDE_REQUEST' && (
          <div className="flex space-x-3">
            <button
              onClick={onAccept}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <IoCheckmark size={20} />
              <span>Accept</span>
            </button>
            <button
              onClick={onReject}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <IoX size={20} />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPopup;