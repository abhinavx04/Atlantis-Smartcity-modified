import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Incident } from '../../types/incident';
import { incidentService } from '../../services/incidentService';

const AlertNotification: React.FC = () => {
  const [latestIncident, setLatestIncident] = useState<Incident | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = incidentService.subscribeToIncidents((incidents) => {
      if (incidents.length > 0) {
        const latest = incidents[0];
        setLatestIncident(latest);
        setShow(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShow(false);
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!latestIncident || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-white text-sm ${
              latestIncident.severity === 'high' ? 'bg-red-500' :
              latestIncident.severity === 'medium' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}>
              {latestIncident.type}
            </span>
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-gray-700">{latestIncident.description}</p>
          <p className="mt-1 text-sm text-gray-500">{latestIncident.location.address}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertNotification;