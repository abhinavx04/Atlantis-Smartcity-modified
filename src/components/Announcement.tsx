import React, { useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  priority: string;
  category: string;
  image?: string;
}

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Current time and user for Navbar
  const currentTime = '2025-02-18 03:20:49';
  const currentUser = 'abhinavx04';

  // Sample categories
  const categories = ['all', 'general', 'emergency', 'event', 'maintenance'];

  useLayoutEffect(() => {
    fetchAnnouncements();
    checkAdminStatus();
    const ctx = gsap.context(() => {
      // Header Animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(".announcement-header h1", {
        y: 100,
        opacity: 0,
        duration: 1,
      })
      .from(".announcement-header p", {
        y: 50,
        opacity: 0,
        duration: 0.8,
      }, "-=0.5")
      .from(".controls-section", {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, "-=0.3");

      // Cards Animation
      const cards = gsap.utils.toArray(".announcement-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card as Element,
            start: "top bottom-=100",
            end: "top center",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
        });
      });

      // Background Animations
      gsap.to(".floating-circuit", {
        y: -1000,
        x: 1000,
        opacity: 0,
        duration: "random(7,12)",
        stagger: {
          each: 1,
          repeat: -1,
        },
        ease: "none",
      });

      gsap.to(".digital-rain", {
        y: "100vh",
        duration: "random(5,8)",
        stagger: {
          each: 0.2,
          repeat: -1,
        },
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

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
        <div className="flex justify-center items-center h-screen bg-black">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Smart City Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
        
        {/* Floating Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="floating-circuit absolute h-[2px] w-[100px] bg-blue-500/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${i * 60}deg)`,
              }}
            />
          ))}
        </div>

        {/* Digital Rain */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="digital-rain absolute top-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
              style={{
                left: `${i * 10}%`,
                transform: 'translateY(-100%)',
              }}
            />
          ))}
        </div>
      </div>

      <Navbar currentTime={currentTime} currentUser={currentUser} />

      <div className="pt-20 pb-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="announcement-header text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-['Syncopate'] text-white mb-4 tracking-wider">
              ANNOUNCEMENTS
            </h1>
            <p className="text-2xl md:text-3xl text-blue-400/80 text-center mb-24 font-light">
              Stay connected with the latest updates
            </p>
          </div>

          {/* Controls Section */}
          <div className="controls-section flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-['Syncopate'] tracking-wide transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
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
                className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="bg-gray-800/80 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-500/20">
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
                        <span className={`px-3 py-1 rounded-full text-xs font-['Syncopate'] tracking-wider ${getPriorityColor(announcement.priority)} text-white`}>
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
                      
                      <h2 className="text-xl font-['Syncopate'] text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 tracking-wide">
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