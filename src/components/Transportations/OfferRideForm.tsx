import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoLocationSharp, IoCarSport, IoTime, IoPeople, IoCash, IoColorPalette } from 'react-icons/io5';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';

const OfferRideForm: React.FC = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    availableSeats: '3',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleColor: '',
    fare: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const rideData = {
        driverId: user.uid,
        driverProfile: {
          name: user.displayName || 'Anonymous',
          photoURL: user.photoURL,
          phone: '',
          rating: 5,
          vehicleDetails: {
            model: formData.vehicleModel,
            number: formData.vehicleNumber.toUpperCase(),
            color: formData.vehicleColor
          }
        },
        route: {
          pickup: {
            address: formData.pickup
          },
          dropoff: {
            address: formData.dropoff
          }
        },
        departureTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        availableSeats: parseInt(formData.availableSeats),
        fare: parseFloat(formData.fare),
        status: 'active',
        passengers: [],
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'rides'), rideData);
      console.log('Ride offered with ID:', docRef.id);
      alert('Ride offered successfully!');

      // Reset form
      setFormData({
        pickup: '',
        dropoff: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        availableSeats: '3',
        vehicleModel: '',
        vehicleNumber: '',
        vehicleColor: '',
        fare: '',
      });
    } catch (error) {
      console.error('Error offering ride:', error);
      alert('Failed to offer ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Offer a Ride</h2>
        
        <div className="space-y-6">
          {/* Location Details */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoLocationSharp className="w-5 h-5 mr-2 text-blue-500" />
                From
              </label>
              <input
                type="text"
                value={formData.pickup}
                onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter starting location"
                required
              />
            </div>
            
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoLocationSharp className="w-5 h-5 mr-2 text-red-500" />
                To
              </label>
              <input
                type="text"
                value={formData.dropoff}
                onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter destination"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoTime className="w-5 h-5 mr-2 text-purple-500" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoTime className="w-5 h-5 mr-2 text-green-500" />
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoCarSport className="w-5 h-5 mr-2 text-yellow-500" />
                Vehicle Model
              </label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Honda Civic"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoCarSport className="w-5 h-5 mr-2 text-orange-500" />
                Vehicle Number
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., DL01AB1234"
                required
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoColorPalette className="w-5 h-5 mr-2 text-pink-500" />
                Color
              </label>
              <input
                type="text"
                value={formData.vehicleColor}
                onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Silver"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoPeople className="w-5 h-5 mr-2 text-blue-500" />
                Seats
              </label>
              <select
                value={formData.availableSeats}
                onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <IoCash className="w-5 h-5 mr-2 text-green-500" />
                Fare (₹)
              </label>
              <input
                type="number"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Offering Ride...</span>
            </>
          ) : (
            'Offer Ride'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default OfferRideForm;