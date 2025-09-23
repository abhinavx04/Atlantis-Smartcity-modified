import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import backgroundVideo from '../assets/AdobeStock_303072233.mp4';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showCreds, setShowCreds] = useState<boolean>(true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video: immediate source for fastest start */}
      <LandingBackgroundVideo src={backgroundVideo} />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Content */}
      <div 
        className={`
          relative z-20 
          flex min-h-screen flex-col items-center justify-center 
          transition-all duration-500 ease-in-out
          ${showLogin ? 'translate-x-[-25%]' : ''}
        `}
      >
        {/* Quick Credentials Dropdown */}
        <div className="absolute top-6 right-6 z-30">
          <div className="min-w-[260px] rounded-xl border border-white/15 bg-black/50 backdrop-blur-md shadow-xl">
            <button
              onClick={() => setShowCreds(!showCreds)}
              className="w-full flex items-center justify-between px-4 py-3 text-white/90 hover:text-white"
            >
              <span className="text-sm tracking-wide">Demo credentials</span>
              <svg className={`w-4 h-4 transition-transform ${showCreds ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            {showCreds && (
              <div className="px-4 pb-4 pt-1 text-sm text-white/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Email</span>
                  <code className="bg-white/5 border border-white/10 rounded px-2 py-0.5">admin@gmail.com</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Password</span>
                  <code className="bg-white/5 border border-white/10 rounded px-2 py-0.5">admin123</code>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Title Section */}
        <div 
          className="text-center mb-16 transform transition-all duration-500 hover:scale-105"
          style={{
            animation: 'fadeIn 1.5s ease-out',
          }}
        >
          {/* Main Title */}
          <div className="relative">
            <h1 
              style={{
                fontFamily: 'Poiret One, cursive',
                fontSize: 'clamp(5rem, 15vw, 9rem)',
                letterSpacing: '0.1em',
                fontWeight: '400',
                lineHeight: '1',
                background: 'linear-gradient(to right, #fff, #a5f3fc, #fff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
                transform: 'translateZ(0)',  // For better text rendering
              }}
              className="relative z-10"
            >
              Dwarka
            </h1>
            {/* Echo effect */}
            <div 
              style={{
                fontFamily: 'Poiret One, cursive',
                fontSize: 'clamp(5rem, 15vw, 9rem)',
                letterSpacing: '0.1em',
                fontWeight: '400',
                lineHeight: '1',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                color: 'rgba(165, 243, 252, 0.1)',
                filter: 'blur(8px)',
                transform: 'translateZ(-1px)',
                animation: 'glowPulse 3s infinite',
              }}
            >
              Dwarka
            </div>
          </div>

          {/* Subtitle */}
          <div 
            style={{
              fontFamily: 'Michroma, sans-serif',
              fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
              letterSpacing: '0.8em',
              fontWeight: '400',
              marginTop: '2rem',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            className="uppercase"
          >
            Smart City Paradise
          </div>
        </div>

        {/* Buttons */}
        <div 
          className="flex gap-8" 
          style={{ 
            animation: 'fadeIn 2s ease-out',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          <button
            onClick={() => setShowLogin(true)}
            className="
              relative px-12 py-5
              text-white text-base
              rounded-full
              transition-all duration-500
              hover:scale-105
              focus:outline-none
              uppercase
            "
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.3em',
              fontWeight: '400',
            }}
          >
            Explore
          </button>
        </div>
      </div>

      {/* Login Form */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glowPulse {
            0% {
              opacity: 0.3;
              filter: blur(8px);
            }
            50% {
              opacity: 0.6;
              filter: blur(12px);
            }
            100% {
              opacity: 0.3;
              filter: blur(8px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;

// Background video that starts buffering immediately
const LandingBackgroundVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Ensure playback kicks off as soon as possible
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    v.addEventListener('canplay', tryPlay, { once: true });
    v.addEventListener('canplaythrough', tryPlay, { once: true });
    tryPlay();
    return () => {
      v.removeEventListener('canplay', tryPlay);
      v.removeEventListener('canplaythrough', tryPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute top-0 left-0 min-h-screen w-full object-cover z-0"
      style={{ filter: 'brightness(0.9)' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};