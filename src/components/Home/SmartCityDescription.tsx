import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SmartCityDescription: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cityNameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(st => st.kill());

    const ctx = gsap.context(() => {
      // Animate city name
      gsap.fromTo(cityNameRef.current,
        {
          y: 50,
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
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate description text with a typewriter-like effect
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top center+=50",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate decorative lines
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
              start: "top center+=150",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-20 overflow-hidden">
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
          About Us
          </h2>
        </div>

        {/* Description */}
        <div
          ref={descriptionRef}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            A smart city is a municipality that makes use of information and communication technology (ICT) to boost administrative effectiveness, disseminate information to the general public, and enhance the standard of public services as well as the welfare of its residents.
          </p>
          
          <p className="text-gray-400 text-lg leading-relaxed">
            While the precise definition varies, a smart city's primary goal is to use smart technology and data analysis to optimise local operations, spur economic growth, and enhance residents' quality of life. The smart city's worth is determined by how it chooses to use its technology, not just how much of it it may have.
          </p>

          {/* Added new description */}
          <p className="text-gray-300 text-lg leading-relaxed mt-8">
            <span className="text-blue-400 font-semibold">A Smart Paradise</span><br />
            The success of a smart city rests on its capacity to forge a solid alliance between the public and private sectors, notably with regard to bureaucracy and rules. The majority of the labour required to establish and sustain a digital, data-driven environment is done outside of the government, thus this partnership is essential. Sensors from one business, cameras from another, and a server from a third company might all be part of the surveillance apparatus for crowded streets.
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