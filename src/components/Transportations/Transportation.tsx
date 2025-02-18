import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { transportationService } from '../../services/transportationservice';
import { Ride, Location } from '../../types/transportation';
import Navbar from '../Navbar';
import { GOOGLE_MAPS_API_KEY } from '../Emergency/constants';

const Transportation: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const mapCenter = { lat: 28.5921, lng: 77.0460 }; // Dwarka coordinates
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSearch = async () => {
    if (pickup && dropoff) {
      try {
        const availableRides = await transportationService.searchRides(
          pickup,
          dropoff,
          new Date()
        );
        setRides(availableRides);
      } catch (error) {
        console.error('Error searching rides:', error);
      }
    }
  };

  const handleCreateRide = () => {
    // Navigate to create ride form
    navigate('/transportation/create');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      
      <Navbar currentUser={currentUser} />

      <div className="container mx-auto px-4 py-24">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
          <h1 className="text-3xl font-['Syncopate'] text-white mb-6 tracking-wider">TRANSPORTATION</h1>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleCreateRide}
                className="px-6 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors duration-300 border border-blue-500/20"
              >
                Offer a Ride
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors duration-300 border border-green-500/20"
              >
                Find a Ride
              </button>
            </div>
          </div>

          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={12}
              options={{ styles: mapStyles }}
            >
              {pickup && <Marker position={pickup} />}
              {dropoff && <Marker position={dropoff} />}
            </GoogleMap>
          </LoadScript>

          {rides.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl text-white mb-4">Available Rides</h2>
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors duration-300"
                    onClick={() => setSelectedRide(ride)}
                  >
                    <p className="text-white">From: {ride.route.startLocation.lat}, {ride.route.startLocation.lng}</p>
                    <p className="text-white">To: {ride.route.endLocation.lat}, {ride.route.endLocation.lng}</p>
                    <p className="text-gray-400">Departure: {new Date(ride.departureTime).toLocaleString()}</p>
                    <p className="text-gray-400">Available Seats: {ride.maxPassengers - ride.passengers.length}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transportation;