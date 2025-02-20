import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { auth } from '../../firebase/config';
import Navbar from '../Navbar';
import Footer from '../Home/Footer';
import { GOOGLE_MAPS_API_KEY } from '../Emergency/constants';

const Alerts: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Add auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sample incidents for testing
  useEffect(() => {
    setIncidents([
      {
        id: '1',
        type: 'accident',
        title: 'Traffic Accident',
        description: 'Multi-vehicle collision',
        location: { lat: 28.5921, lng: 77.0460, address: 'Dwarka Sector 1' },
        severity: 'high',
        timestamp: new Date(),
        status: 'active'
      },
      // Add more sample incidents
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      
      <Navbar currentUser={currentUser || ''} />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-['Syncopate'] text-white mb-4">
            CITY ALERTS
          </h1>
          <p className="text-xl text-blue-400/80">
            Real-time updates on local incidents and emergencies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px', borderRadius: '0.75rem' }}
                center={{ lat: 28.5921, lng: 77.0460 }}
                zoom={12}
                options={{
                  styles: [
                    {
                      featureType: 'all',
                      elementType: 'geometry',
                      stylers: [{ color: '#242f3e' }]
                    }
                  ]
                }}
              >
                {incidents.map((incident) => (
                  <Marker
                    key={incident.id}
                    position={incident.location}
                    onClick={() => setSelectedIncident(incident)}
                  />
                ))}

                {selectedIncident && (
                  <InfoWindow
                    position={selectedIncident.location}
                    onCloseClick={() => setSelectedIncident(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold">{selectedIncident.title}</h3>
                      <p>{selectedIncident.description}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Incidents List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
            {incidents.map((incident) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-2 rounded-full text-white text-sm ${
                    incident.severity === 'high' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : incident.severity === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {incident.type}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(incident.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl text-white mb-2">{incident.title}</h3>
                <p className="text-gray-300 mb-4">{incident.description}</p>
                <p className="text-gray-400 text-sm">📍 {incident.location.address}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Alerts;