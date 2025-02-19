import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmartCityDescription: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cityNameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure GSAP is registered
    gsap.registerPlugin(ScrollTrigger);

    // Reset any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(st => st.kill());

    const ctx = gsap.context(() => {
      // Animate city name with more lenient trigger points
      gsap.fromTo(cityNameRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cityNameRef.current,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
            markers: false, // Ensure this is false
            once: false // Allow re-triggering
          }
        }
      );

      // Adjust description animation
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top bottom-=50",
            end: "bottom center",
            toggleActions: "play none none reverse",
            markers: false // Ensure this is false
          }
        }
      );

      // Update lines animation
      if (linesRef.current) {
        const lines = linesRef.current.children;
        gsap.fromTo(lines,
          {
            scaleX: 0,
            opacity: 0
          },
          {
            scaleX: 1,
            opacity: 0.3,
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: linesRef.current,
              start: "top bottom",
              end: "bottom center",
              toggleActions: "play none none reverse",
              markers: false // Ensure this is false
            }
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative py-20 min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:40px_40px] opacity-5" />
      </div>

      {/* Decorative Lines */}
      <div ref={linesRef} className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-full bg-blue-500/20 transform origin-left"
            style={{
              top: `${20 + i * 15}%`,
              transform: 'scaleX(0)'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* City Name */}
        <div
          ref={cityNameRef}
          className="text-center mb-12"
        >
          <h2 className="font-['Syncopate'] text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
            ABOUT US
          </h2>
        </div>

        {/* Description */}
        <div
          ref={descriptionRef}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            A place where governance is at your fingertips, where your voice is heard, and where safety isn’t a privilege but a right. It’s a city that sees before disasters strike, that moves before emergencies escalate, that connects people not just digitally, but in purpose. It’s where innovation doesn’t just build skyscrapers—it builds trust, security, and a future that belongs to everyone.
          </p>
          
          <p className="text-gray-300 text-lg leading-relaxed">
          Dwarka is a living, breathing symphony of technology and humanity—a place where innovation serves the people. It’s a city that listens, adapts, and evolves, to make life richer, safer, and more connected. It’s not just about automation; it’s about harmony—between people, nature, and progress. A smart city is a dream realized, a future embraced, and a promise that technology can make life not just easier, but more meaningful.
          </p>

          {/* Additional decorative element */}
          <div className="pt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCityDescription;