import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RideOffer } from '../../types/transportation';
import { transportationService } from '../../services/transportationservice';

const OfferRideForm: React.FC = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '2025-02-18', // Default to current date
    time: '09:48', // Default to current time
    availableSeats: 3,
    vehicleModel: '',
    vehicleNumber: '',
    vehicleColor: '',
    fare: '',
    waypoints: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const offerData: Omit<RideOffer, 'id'> = {
        driverId: 'abhinavx04', // Current user
        driverProfile: {
          name: 'Abhinav', // This should come from user profile
          phone: '', // This should come from user profile
          rating: 5,
          vehicleDetails: {
            model: formData.vehicleModel,
            number: formData.vehicleNumber,
            color: formData.vehicleColor
          }
        },
        route: {
          pickup: {
            latitude: 0, // These should be set from Google Maps
            longitude: 0,
            address: formData.pickup
          },
          dropoff: {
            latitude: 0,
            longitude: 0,
            address: formData.dropoff
          }
        },
        availableSeats: formData.availableSeats,
        departureTime: new Date(`${formData.date}T${formData.time}`),
        fare: parseFloat(formData.fare),
        status: 'active',
        passengers: []
      };

      await transportationService.createRideOffer(offerData);
      // Show success message and reset form
      alert('Ride offer created successfully!');
      setFormData({
        pickup: '',
        dropoff: '',
        date: '2025-02-18',
        time: '09:48',
        availableSeats: 3,
        vehicleModel: '',
        vehicleNumber: '',
        vehicleColor: '',
        fare: '',
        waypoints: ''
      });
    } catch (error) {
      console.error('Error creating ride offer:', error);
      alert('Failed to create ride offer. Please try again.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Pickup Location</label>
          <input
            type="text"
            value={formData.pickup}
            onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pickup location"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Drop-off Location</label>
          <input
            type="text"
            value={formData.dropoff}
            onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter drop-off location"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="2025-02-18"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Available Seats</label>
          <input
            type="number"
            value={formData.availableSeats}
            onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="6"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Vehicle Model</label>
          <input
            type="text"
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Honda City"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Vehicle Number</label>
          <input
            type="text"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., MH02AB1234"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Vehicle Color</label>
          <input
            type="text"
            value={formData.vehicleColor}
            onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Silver"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Fare (₹)</label>
        <input
          type="number"
          value={formData.fare}
          onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter fare amount"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Waypoints (Optional)</label>
        <textarea
          value={formData.waypoints}
          onChange={(e) => setFormData({ ...formData, waypoints: e.target.value })}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter any stops along the way (one per line)"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors flex items-center justify-center space-x-2"
      >
        <span>Offer Ride</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </motion.form>
  );
};

export default OfferRideForm;