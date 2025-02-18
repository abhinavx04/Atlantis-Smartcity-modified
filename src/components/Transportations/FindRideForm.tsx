import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RideRequest } from '../../types/transportation';

const FindRideForm: React.FC = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: 1,
    rideType: 'carpool'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation will be added
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-300 mb-2">Pickup Location</label>
        <input
          type="text"
          name="pickup"
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
          name="dropoff"
          value={formData.dropoff}
          onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter drop-off location"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Passengers</label>
          <input
            type="number"
            name="passengers"
            min="1"
            max="4"
            value={formData.passengers}
            onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Ride Type</label>
          <select
            name="rideType"
            value={formData.rideType}
            onChange={(e) => setFormData({ ...formData, rideType: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="carpool">Carpool</option>
            <option value="taxi">Taxi</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
      >
        Find Rides
      </button>
    </form>
  );
};

export default FindRideForm;