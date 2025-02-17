import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

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
  
  // Current time and user
  const currentTime = '2025-02-17 18:17:44';
  const currentUser = 'Kpandey2207';
  const API_KEY = '33839883-e9af-4270-96f0-cd1247dc0459';

  const categories = ['all', 'cultural', 'sports', 'technology', 'education', 'entertainment', 'community'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Sample events data since API endpoint is not specified
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000e6]">
        <Navbar currentTime={currentTime} currentUser={currentUser} />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000e6]">
      <Navbar currentTime={currentTime} currentUser={currentUser} />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
              🎉 City Events
            </h1>
            <p className="text-gray-400 text-lg">Discover exciting events happening around the city</p>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterEvents().map((event) => (
              <div
                key={event.id}
                className="group"
              >
                <div className="bg-gray-800/50 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {event.image && (
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {event.category.toUpperCase()}
                      </span>
                      {event.price && (
                        <span className="text-green-400 text-sm font-medium">
                          {event.price}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    
                    {event.registrationLink && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        <span>Register Now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;