import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, EMERGENCY_CONTACT, mapStyles } from './constants';
import Navbar from '../Navbar';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: google.maps.LatLng;
  };
  type: string;
}

const Emergency: React.FC = () => {
  const navigate = useNavigate();
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Add auth listener to get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
      setCurrentTime(formattedTime);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const center = currentLocation || { lat: 20.5937, lng: 78.9629 };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const getNearbyPlaces = useCallback((location: { lat: number; lng: number }, type: string) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: type
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(prev => [
          ...prev,
          ...results.map(place => ({
            place_id: place.place_id || '',
            name: place.name || '',
            vicinity: place.vicinity || '',
            geometry: {
              location: place.geometry?.location || new google.maps.LatLng(0, 0)
            },
            type: type
          }))
        ]);
      }
    });
  }, [map]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);

          if (map) {
            map.panTo(location);
            setNearbyPlaces([]);
            ['hospital', 'police', 'fire_station'].forEach(type => 
              getNearbyPlaces(location, type)
            );
          }
        },
        (error) => {
          console.error('Error:', error);
          alert('Please enable location services to use emergency features.');
        }
      );
    }
  }, [map, getNearbyPlaces]);

  const makeEmergencyCall = (phoneNumber: string) => {
    try {
      window.location.href = `tel:${phoneNumber}`;
    } catch {
      alert(`Please call emergency number: ${phoneNumber}`);
    }
  };

  const handleLocationEmergency = () => {
    if (currentLocation) {
      setShowLocationAlert(true);
      makeEmergencyCall(EMERGENCY_CONTACT);
      setTimeout(() => setShowLocationAlert(false), 5000);
    } else {
      alert('Getting your location. Please try again in a moment.');
    }
  };

  const handleWomenChildrenEmergency = () => {
    setShowEmergencyAlert(true);
    makeEmergencyCall('1091');
    setTimeout(() => setShowEmergencyAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
      
      <Navbar currentTime={currentTime} currentUser={currentUser} />

      <main className="container mx-auto px-4 pt-16 relative z-10">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-['Syncopate'] text-white mb-4">
            EMERGENCY
          </h1>
          <div className="text-red-500 animate-pulse text-lg mb-2">
            24/7 Immediate Assistance
          </div>
        </div>

        {/* Primary Emergency Actions - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => makeEmergencyCall('112')}
            className="bg-red-500/20 hover:bg-red-500/30 text-white p-6 rounded-xl 
                       flex items-center justify-center space-x-4 border-2 border-red-500/50"
          >
            <span className="text-4xl">🆘</span>
            <div className="text-left">
              <div className="text-2xl font-bold">Emergency - 112</div>
              <div className="text-red-300">Tap to Call Now</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => makeEmergencyCall('1091')}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-white p-6 rounded-xl 
                       flex items-center justify-center space-x-4 border-2 border-purple-500/50"
          >
            <span className="text-4xl">👮‍♀️</span>
            <div className="text-left">
              <div className="text-2xl font-bold">Women Helpline - 1091</div>
              <div className="text-purple-300">Immediate Assistance</div>
            </div>
          </motion.button>
        </div>

        {/* Quick Access Emergency Services */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { name: 'Police', number: '100', icon: '👮' },
            { name: 'Ambulance', number: '108', icon: '🚑' },
            { name: 'Fire', number: '101', icon: '🚒' },
          ].map((service) => (
            <motion.button
              key={service.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => makeEmergencyCall(service.number)}
              className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50
                         hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-white font-medium">{service.name}</div>
              <div className="text-blue-400">{service.number}</div>
            </motion.button>
          ))}
        </div>

        {/* Location Map */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-['Syncopate'] text-white mb-4">
            NEARBY SERVICES
          </h2>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '400px',
                borderRadius: '0.75rem'
              }}
              center={center}
              zoom={14}
              onLoad={onMapLoad}
              options={{
                styles: mapStyles,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
              }}
            >
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }}
                />
              )}

              {nearbyPlaces.map((place: Place) => (
                <Marker
                  key={place.place_id}
                  position={{
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  }}
                  onClick={() => setSelectedPlace(place)}
                  icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${
                      place.type === 'hospital' ? 'red' :
                      place.type === 'police' ? 'blue' : 'yellow'
                    }-dot.png`
                  }}
                />
              ))}

              {selectedPlace && (
                <InfoWindow
                  position={{
                    lat: selectedPlace.geometry.location.lat(),
                    lng: selectedPlace.geometry.location.lng()
                  }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="bg-white p-2 rounded-sm">
                    <h3 className="font-bold">{selectedPlace.name}</h3>
                    <p className="text-sm">{selectedPlace.vicinity}</p>
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`;
                        window.open(url, '_blank');
                      }}
                      className="mt-2 text-blue-600 text-sm hover:underline"
                    >
                      Get Directions
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Contact Information - Collapsed by default on mobile */}
        <details className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-8">
          <summary className="text-xl font-['Syncopate'] text-white cursor-pointer">
            IMPORTANT CONTACTS
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="text-blue-400 mb-2">Emergency Contacts</h3>
              <ul className="space-y-2">
                <li>National Emergency: 112</li>
                <li>Women Helpline: 1091</li>
                <li>Child Helpline: 1098</li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 mb-2">Local Support</h3>
              <ul className="space-y-2">
                <li>Local Police: {EMERGENCY_CONTACT}</li>
                <li>Hospital: 108</li>
                <li>Fire Station: 101</li>
              </ul>
            </div>
          </div>
        </details>

        {/* Alert Messages */}
        {(showLocationAlert || showEmergencyAlert) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-500/20 border border-green-500/40 
                       rounded-lg p-4 max-w-md backdrop-blur-sm"
          >
            <p className="text-green-400">
              {showLocationAlert ? 'Connecting emergency call...' : 'Emergency alert sent!'}
              {currentLocation && showLocationAlert && (
                <span className="block text-sm mt-1">
                  Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Emergency;