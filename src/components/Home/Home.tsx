import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../Navbar';  // Add this import
import AnimatedTagline from './AnimatedTagline';
import Footer from './Footer';
import Explore from './Explore';
import SmartCityDescription from './SmartCityDescription';

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category?: string;
  relevanceScore?: number;
  location?: string;
}
 
// Add helper function at the top after imports
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
 
// In Home.tsx, add this constant at the top of the file
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUYyOTM3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NEI1RjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkF0bGFudGlzIE5ld3M8L3RleHQ+PC9zdmc+';
 
 
// Update the NewsCard component
const NewsCard: React.FC<{
  item: NewsItem;
  index: number;
}> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        news-card
        flex-shrink-0
        w-[400px]
        bg-gray-800/90
        backdrop-blur-sm
        rounded-xl
        overflow-hidden
        border
        border-gray-700/50
        shadow-[0_0_20px_rgba(0,0,0,0.3)]
        transition-all
        duration-300
        ease-out
        hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
        hover:border-blue-500/30
      `}
    >
      <div className="relative group">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={item.urlToImage || FALLBACK_IMAGE}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-['Syncopate'] text-lg font-semibold text-white mb-2 tracking-wide">
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-3">{item.description}</p>
          <div className="mt-4 text-sm text-gray-400">
            {new Date(item.publishedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add circular positions constants
 
// Update the CarouselContainer component
 
const NewsHeading: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top center+=200",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div 
      ref={headingRef}
      className="text-center mb-12"
    >
      <h2 className="font-['Syncopate'] text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 tracking-wider uppercase">
        Latest News
      </h2>
      <div className="w-24 h-1 bg-blue-500/50 mx-auto mt-4 rounded-full"></div>
    </div>
  );
};

// Add new component for scroll buttons
const ScrollButtons: React.FC<{
  onScroll: (direction: 'left' | 'right') => void;
}> = ({ onScroll }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => onScroll('left')}
        className="px-6 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 
                   transition-colors duration-300 border border-blue-500/20 group"
      >
        <span className="inline-block transform group-hover:-translate-x-1 transition-transform">
          ←
        </span>{' '}
        Previous
      </button>
      <button
        onClick={() => onScroll('right')}
        className="px-6 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 
                   transition-colors duration-300 border border-blue-500/20 group"
      >
        Next{' '}
        <span className="inline-block transform group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>
    </div>
  );
};

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  
  // Remove these refs as they're no longer needed
  // const containerRef = useRef<HTMLDivElement>(null);
  // const trackRef = useRef<HTMLDivElement>(null);

  // Add auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.email || user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);
 
  const fetchNews = async () => {
    try {
      setLoading(true);
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
 
      const response = await axios.get(
        'https://newsapi.org/v2/everything', {
          params: {
            q: 'India urban development OR smart city',
            apiKey: API_KEY,
            sortBy: 'publishedAt',
            language: 'en',
            pageSize: 30
          }
        }
      );
 
      console.log('API Response:', response.data);
 
      const articles = response.data.articles || [];
      setNews(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (newsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      newsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
 
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
        
        {/* Floating Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-[100px] bg-blue-500/20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatingCircuit ${10 + i * 2}s linear infinite`,
                  transform: `rotate(${i * 60}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Digital Rain Effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
              style={{
                left: `${i * 10}%`,
                animation: `digitalRain ${5 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Update styles to remove cyber-pulse animation */}
      <style>{`
        @keyframes floatingCircuit {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-1000px) translateX(1000px); opacity: 0; }
        }

        @keyframes digitalRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <Navbar currentUser={currentUser || ''} />
      
      {/* Main content section */}
      <div className="relative z-10">
        <AnimatedTagline />
        <SmartCityDescription />
      </div>

      {/* Explore section */}
      <Explore />

      {/* News section - moved to bottom */}
      <section className="relative z-10 py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <NewsHeading />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400">Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            <>
              <div 
                ref={newsContainerRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
              >
                <div className="flex gap-6 py-8 min-w-max px-4">
                  {news.map((item, index) => (
                    <NewsCard
                      key={item.title + index}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <ScrollButtons onScroll={handleScroll} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 text-lg">No news available</p>
            </div>
          )}
        </div>
      </section>

      {/* News modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-6 max-w-4xl mx-auto border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-['Syncopate'] text-2xl font-bold text-white tracking-wide">
                  {selectedNews.title}
                </h2>
                <button onClick={() => setSelectedNews(null)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
              {selectedNews.urlToImage && (
                <img 
                  src={selectedNews.urlToImage || FALLBACK_IMAGE}
                  alt={selectedNews.title} 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                />
              )}
              <p className="text-gray-300 mb-4">{selectedNews.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400">{selectedNews.source.name}</span>
                <a 
                  href={selectedNews.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Read more ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};
 export default Home;