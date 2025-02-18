import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion } from 'framer-motion';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface Feature {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const features: Feature[] = [
  {
    title: "Smart Transport",
    description: "Experience seamless transportation with real-time tracking and smart routing",
    icon: "🚆",
    link: "/transport"
  },
  {
    title: "Emergency Services",
    description: "24/7 emergency response system for your safety and security",
    icon: "🚨",
    link: "/emergency"
  },
  {
    title: "Weather Updates",
    description: "Stay informed with accurate weather forecasts and alerts",
    icon: "🌤",
    link: "/weather"
  },
  {
    title: "City Events",
    description: "Discover and participate in upcoming city events and activities",
    icon: "🎉",
    link: "/events"
  }
];

const Explore: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        opacity: 0,
        y: 100,
        duration: 1.5
      });

      // Tagline typing effect
      gsap.to(taglineRef.current, {
        scrollTrigger: {
          trigger: taglineRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
        duration: 2,
        text: {
          value: "Discover the future of urban living with our smart city features",
          delimiter: ""
        },
        ease: "none",
      });

      // Features stagger animation
      gsap.from(featuresRef.current?.children || [], {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 60%",
          end: "bottom 80%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-black min-h-screen overflow-hidden"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative container mx-auto px-4">
        <div 
          ref={titleRef} 
          className="text-5xl md:text-7xl font-['Syncopate'] text-white text-center mb-8 
                     tracking-wider leading-tight"
        >
          EXPLORE<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
            ATLANTIS
          </span>
        </div>

        <div 
          ref={taglineRef}
          className="text-2xl md:text-3xl text-blue-400/80 text-center mb-24 font-light 
                     min-h-[4rem] opacity-0"
        />

        <div 
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 
                        transition-all duration-300 hover:border-blue-500/30 
                        hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] group"
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl text-white mb-4 font-['Syncopate']">{feature.title}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
              <a
                href={feature.link}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 
                          transition-colors duration-200 group-hover:translate-x-2 transform"
              >
                Explore More 
                <span className="ml-2 text-lg">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;