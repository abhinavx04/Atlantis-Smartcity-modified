import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { transportationService } from '../../services/transportationservice';
import { RideOffer } from '../../types/transportation';
import Navbar from '../Navbar';
import { GOOGLE_MAPS_API_KEY } from '../Emergency/constants';

const Transportation: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [availableRides, setAvailableRides] = useState<RideOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<RideOffer | null>(null);
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');

  const mapCenter = { lat: 28.5921, lng: 77.0460 }; // Dwarka coordinates
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem'
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.email);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleOfferRide = () => {
    // Add your ride offer logic here
    console.log('Offering a ride');
  };

  const handleFindRide = () => {
    // Add your ride search logic here
    console.log('Finding a ride');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      
      <Navbar currentUser={currentUser || ''} />

      <div className="container mx-auto px-4 py-24">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
          <h1 className="text-3xl font-['Syncopate'] text-white mb-6 tracking-wider">
            TRANSPORTATION
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

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleOfferRide}
              className="px-6 py-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors duration-300 border border-blue-500/20"
            >
              Create New Ride Offer
            </button>
            <button
              onClick={handleFindRide}
              className="px-6 py-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors duration-300 border border-green-500/20"
            >
              Search Available Rides
            </button>
          </div>

          {/* Map */}
          <div className="mb-8">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={12}
                options={{
                  styles: [
                    {
                      featureType: 'all',
                      elementType: 'geometry',
                      stylers: [{ color: '#242f3e' }]
                    },
                    {
                      featureType: 'all',
                      elementType: 'labels.text.stroke',
                      stylers: [{ color: '#242f3e' }]
                    },
                    {
                      featureType: 'all',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#746855' }]
                    }
                  ]
                }}
              >
                {availableRides.map((ride) => (
                  <Marker
                    key={ride.id}
                    position={{
                      lat: ride.route.pickup.latitude,
                      lng: ride.route.pickup.longitude
                    }}
                    onClick={() => setSelectedRide(ride)}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Available Rides */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRides.map((ride) => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedRide(ride)}
                  className="bg-gray-700/50 hover:bg-gray-600/50 p-6 rounded-lg cursor-pointer transition-all duration-300"
                >
                  <h3 className="text-white font-medium mb-2">
                    {ride.route.pickup.address} → {ride.route.dropoff.address}
                  </h3>
                  <p className="text-gray-400">
                    Departure: {new Date(ride.departureTime).toLocaleString()}
                  </p>
                  <p className="text-blue-400 font-bold mt-2">₹{ride.fare}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transportation;