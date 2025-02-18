import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, EMERGENCY_CONTACT, mapStyles } from './constants';
import Navbar from '../Navbar';
import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

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
  
  // Current time state
  const [currentTime, setCurrentTime] = useState<string>('');
  interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    timestamp: string;
  }

  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportImages, setReportImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [currentUser] = useState<string>('Krishna27S');

  // // Update current time every second
  // useEffect(() => {
  //   const updateTime = () => {
  //     const now = new Date();
  //     const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
  //     setCurrentTime(formattedTime);
  //   };

  //   updateTime(); // Initial update
  //   const interval = setInterval(updateTime, 1000);

  //   return () => clearInterval(interval);
  // }, []);

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

  const handleSOS = useCallback(() => {
    if (currentLocation) {
      // Send SOS alert
      const message = `Emergency SOS from ${currentUser} at ${currentLocation.lat}, ${currentLocation.lng}`;
      // Implement your emergency notification system here
      setShowEmergencyAlert(true);
      // Call emergency number
      makeEmergencyCall('112');
    }
  }, [currentLocation, currentUser]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation) return;

    try {
      // Show loading state
      setIsSubmitting(true);

      // Prepare email template parameters
      const templateParams = {
        to_email: ADMIN_EMAIL,
        from_name: currentUser || 'Anonymous User',
        emergency_type: reportType,
        description: reportDescription,
        location: `${currentLocation.lat}, ${currentLocation.lng}`,
        timestamp: new Date().toLocaleString(),
        google_maps_link: `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
      };

      // Send email
      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams,
        EMAIL_PUBLIC_KEY
      );

      if (response.status === 200) {
        // Show success message
        setShowAlert({
          type: 'success',
          message: 'Emergency report sent successfully!'
        });

        // Reset form
        setReportType('');
        setReportDescription('');
        setReportImages([]);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setShowAlert({
        type: 'error',
        message: 'Failed to send report. Please try again or call emergency services directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReportImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
      
      <Navbar currentUser={currentUser} />

      <main className="container mx-auto px-4 pt-16 relative z-10">
        {/* Header with Emergency Title and Location */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-['Syncopate'] text-white mb-6">
            EMERGENCY
          </h1>
          <div className="text-red-500 animate-pulse text-xl">
            Your Location: {currentLocation ? 
              `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 
              'Locating...'}
          </div>
        </div>

        {/* Primary Emergency Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Emergency Button 1 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => makeEmergencyCall('112')}
            className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30
                       border-2 border-red-500/30 rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">🚨</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">EMERGENCY</h3>
            <p className="text-red-300">Call 112</p>
          </motion.button>

          {/* Police Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => makeEmergencyCall('100')}
            className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30
                       border-2 border-blue-500/30 rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">👮</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">POLICE</h3>
            <p className="text-blue-300">Call 100</p>
          </motion.button>

          {/* Ambulance Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => makeEmergencyCall('108')}
            className="bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30
                       border-2 border-green-500/30 rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">🚑</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">AMBULANCE</h3>
            <p className="text-green-300">Call 108</p>
          </motion.button>
        </div>

        {/* Map Section */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 mb-12 border border-gray-700/50">
          <h2 className="text-2xl font-['Syncopate'] text-white mb-6">NEARBY EMERGENCY SERVICES</h2>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '500px',
                borderRadius: '1rem'
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

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <QuickActionButton
            icon="🚒"
            label="Fire Brigade"
            number="101"
            onClick={() => makeEmergencyCall('101')}
            color="red"
          />
          <QuickActionButton
            icon="👮‍♀️"
            label="Women Helpline"
            number="1091"
            onClick={() => makeEmergencyCall('1091')}
            color="purple"
          />
          <QuickActionButton
            icon="👶"
            label="Child Helpline"
            number="1098"
            onClick={() => makeEmergencyCall('1098')}
            color="blue"
          />
          <QuickActionButton
            icon="🏥"
            label="Emergency"
            number="112"
            onClick={() => makeEmergencyCall('112')}
            color="green"
          />
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

        {/* Report Emergency - Moved up */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-['Syncopate'] text-white mb-4">
            REPORT EMERGENCY
          </h2>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Type of Emergency</label>
              <select 
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="accident">Accident</option>
                <option value="crime">Crime</option>
                <option value="fire">Fire</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white"
                rows={4}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="text-gray-300"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
              transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Report'}
            </button>
          </form>

          {/* Alert Message */}
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                showAlert.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/40 text-red-400'
              }`}
            >
              <p>{showAlert.message}</p>
            </motion.div>
          )}
        </div>

        {/* SOS Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSOS}
          className="fixed bottom-8 right-8 bg-red-500 text-white w-20 h-20 rounded-full 
                    flex items-center justify-center text-2xl font-bold shadow-lg 
                    hover:bg-red-600 transition-colors z-50 animate-pulse"
        >
          SOS
        </motion.button>

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

// Helper component for Quick Action buttons
const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  number: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, number, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`bg-${color}-500/20 hover:bg-${color}-500/30 
                border border-${color}-500/30 rounded-xl p-4 text-center`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className={`text-${color}-400 font-medium`}>{label}</h3>
    <p className={`text-${color}-300 text-sm`}>{number}</p>
  </motion.button>
  );

  // Export the Emergency component
  export default Emergency;