import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  category: string;
  image?: string;
  organizer?: string;
  capacity?: number;
  registrationLink?: string;
  price?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Current time and user from props
  const currentTime = '2025-02-17 21:38:32';
  const currentUser = 'abhinavx04';
  const headerRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const categories = ['all', 'cultural', 'sports', 'technology', 'education', 'entertainment', 'community'];

  useEffect(() => {
    fetchEvents();
    initAnimations();
  }, []);

  const initAnimations = () => {
    // Header animation
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }

    // Events cards animation
    if (eventsRef.current) {
      gsap.from(eventsRef.current.children, {
        scrollTrigger: {
          trigger: eventsRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Your existing sample events data
      const sampleEvents = [
        {
          id: '1',
          title: '🎭 Cultural Festival 2025',
          description: 'Experience the vibrant cultures of our city with traditional performances, international cuisine, and interactive art installations.',
          startDate: '2025-02-20 15:00:00',
          endDate: '2025-02-22 22:00:00',
          location: 'City Center Plaza',
          category: 'cultural',
          image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
          organizer: 'City Cultural Committee',
          capacity: 5000,
          price: 'Free Entry'
        },
        {
          id: '2',
          title: '🏃 City Marathon',
          description: 'Annual city marathon featuring 5K, 10K, and full marathon routes through scenic city landmarks.',
          startDate: '2025-03-01 06:00:00',
          location: 'Sports Complex',
          category: 'sports',
          image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
          organizer: 'City Sports Association',
          registrationLink: 'https://citymarathon.com'
        },
        {
          id: '3',
          title: '💻 Tech Innovation Summit',
          description: 'Join leading tech experts for talks, workshops, and networking opportunities in emerging technologies.',
          startDate: '2025-02-25 09:00:00',
          endDate: '2025-02-26 18:00:00',
          location: 'Convention Center',
          category: 'technology',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
          organizer: 'Tech Innovation Hub',
          price: '$199'
        }
      ];

      setEvents(sampleEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navbar currentTime={currentTime} currentUser={currentUser} />

      {/* Hero Section with GSAP Animations */}
      <div className="relative pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
        </div>

        <div ref={headerRef} className="relative container mx-auto px-4 pt-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-['Syncopate'] text-white text-center mb-6 tracking-wider"
          >
            CITY EVENTS
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl text-blue-400/80 text-center max-w-2xl mx-auto mb-12 font-light"
          >
            Discover and participate in exciting events happening across Atlantis
          </motion.p>

          {/* Enhanced Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/40 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 rounded-full text-white 
                          placeholder-white/30 outline-none border border-white/10 
                          focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid with GSAP ScrollTrigger */}
      <div className="relative container mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filterEvents().map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden 
                                border border-gray-700/30 hover:border-blue-500/30 
                                transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    {event.image && (
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 
                                   group-hover:scale-110"
                        />
                        <div className="absolute bottom-4 left-4 z-20">
                          <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full 
                                         text-sm text-white">
                            {event.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 
                                   transition-colors duration-300">
                        {event.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <LocationIcon className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {event.price && (
                        <div className="flex justify-between items-center">
                          <span className="text-green-400">{event.price}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg 
                                     hover:bg-blue-500/30 transition-colors duration-300"
                          >
                            Register Now
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/80 backdrop-blur-xl rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto 
                        border border-gray-700/30"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal content here */}
              <div className="relative">
                {selectedEvent.image && (
                  <div className="h-64 relative">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
                  <p className="text-gray-400 mb-4">{selectedEvent.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="text-gray-400 mb-1">Date & Time</h3>
                      <p>{new Date(selectedEvent.startDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Location</h3>
                      <p>{selectedEvent.location}</p>
                    </div>
                    {selectedEvent.organizer && (
                      <div>
                        <h3 className="text-gray-400 mb-1">Organizer</h3>
                        <p>{selectedEvent.organizer}</p>
                      </div>
                    )}
                    {selectedEvent.capacity && (
                      <div>
                        <h3 className="text-gray-400 mb-1">Capacity</h3>
                        <p>{selectedEvent.capacity} attendees</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                    {selectedEvent.registrationLink && (
                      <a
                        href={selectedEvent.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Register
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Icon Components
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
    />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
    />
  </svg>
);

export default Events;