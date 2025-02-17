import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar'; // Import the Navbar component

gsap.registerPlugin(ScrollTrigger);

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  image?: string;
}

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Current time and user for Navbar
  const currentTime = '2025-02-17 17:40:03';
  const currentUser = 'Kpandey2207';

  // Sample categories
  const categories = ['all', 'general', 'emergency', 'event', 'maintenance'];

  useEffect(() => {
    fetchAnnouncements();
    checkAdminStatus();
    initializeAnimations();
  }, []);

  const initializeAnimations = () => {
    gsap.from('.announcement-content', {
      duration: 1,
      y: 20,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.5,
    });
  };

  // Simulated API call with sample data
  const fetchAnnouncements = async () => {
    try {
      // Simulated data - replace with actual API call
      const sampleAnnouncements: Announcement[] = [
        {
          id: 1,
          title: "🚨 Emergency System Maintenance",
          description: "Critical system updates will be performed tonight. Please save your work.",
          date: "2025-02-17 18:00:00",
          priority: "high",
          category: "emergency",
          image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
          id: 2,
          title: "🎉 City Festival Coming Soon",
          description: "Join us for the annual city festival with live performances and food stalls!",
          date: "2025-02-20 09:00:00",
          priority: "medium",
          category: "event",
          image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        // Add more sample announcements as needed
      ];

      setAnnouncements(sampleAnnouncements);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  };

  const checkAdminStatus = () => {
    const userIsAdmin = true; // Replace with actual admin check
    setIsAdmin(userIsAdmin);
  };

  const filterAnnouncements = () => {
    return announcements.filter(announcement => {
      const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar currentTime={currentTime} currentUser={currentUser} />
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Include Navbar at the top */}
      <Navbar currentTime={currentTime} currentUser={currentUser} />

      <div className="pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto announcement-content"
        >
          {/* Header Section */}
          <div className="announcement-header text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
              📢 City Announcements
            </h1>
            <p className="text-gray-400 text-lg">Stay updated with the latest news and events</p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filterAnnouncements().map((announcement) => (
                <motion.div
                  key={announcement.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="announcement-card group"
                >
                  <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {announcement.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={announcement.image}
                          alt={announcement.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)} text-white`}>
                          {announcement.priority?.toUpperCase() || 'NORMAL'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(announcement.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {announcement.title}
                      </h2>
                      
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {announcement.description}
                      </p>
                      
                      <button className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        <span>Read more</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 right-8"
            >
              <button
                onClick={() => {/* Add announcement logic */}}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Announcement;