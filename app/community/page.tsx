'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx';
import { communityStories } from '@/data/communityStories';

export default function CommunityPage() {
  const storiesSectionRef = useRef<HTMLDivElement>(null);
  const serviceSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // This will be used to handle any scroll-based effects
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#00205B] to-[#00308F] text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Our Community Impact
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl"
        >
          Stories of leadership, service, and achievement from our FBLA chapter
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => scrollToSection(storiesSectionRef)}
          className="bg-white text-[#00205B] px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
        >
          Explore Our Stories
        </motion.button>
      </div>

      {/* Stories Section */}
      <div ref={storiesSectionRef} className="min-h-screen">
        <FullScreenScrollFX
          sections={communityStories.map(story => ({
            ...story,
            title: <>{story.title}</>,
            rightLabel: <span className="opacity-70">{story.rightLabel}</span>
          }))}
          header={<><div>FBLA</div><div>Stories</div></>}
          footer={null}
          showProgress={true}
          colors={{
            text: 'rgba(255,255,255,0.95)',
            overlay: 'rgba(0, 32, 91, 0.4)',  // Reduced opacity from 0.75 to 0.4
            pageBg: '#ffffff',
            stageBg: '#00205B'
          }}
          className="font-sans"
        />
      </div>

      {/* Service Section */}
      <div ref={serviceSectionRef} className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00205B] mb-8 text-center">
            Community Service & Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white/70 backdrop-blur p-6 border border-[#003DA5]/15">
              <h2 className="text-xl text-[#00205B]">Ongoing Projects</h2>
              <ul className="mt-2 text-sm text-[#00205B]/80 list-disc pl-5 space-y-1">
                <li>Local food bank volunteer shifts</li>
                <li>Financial literacy workshops</li>
                <li>Campus cleanup days</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white/70 backdrop-blur p-6 border border-[#003DA5]/15">
              <h2 className="text-xl text-[#00205B]">Future Initiatives</h2>
              <ul className="mt-2 text-sm text-[#00205B]/80 list-disc pl-5 space-y-1">
                <li>Entrepreneurship bootcamp for students</li>
                <li>Community business mentorship program</li>
                <li>Sustainability projects on campus</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold text-[#00205B] mb-4">Ready to Get Involved?</h3>
            <div className="bg-gradient-to-r from-[#00205B] to-[#003DA5] p-4 rounded-lg shadow-lg mb-6 transform transition-all hover:scale-105">
              <p className="text-white text-lg font-bold text-center">
                🎯 Fundraising Goal: <span className="text-yellow-300">$5,000</span> for SLC Travel Scholarships
              </p>
              <p className="text-white/90 text-sm text-center mt-1">
                Help ensure every qualifier can compete at the State Leadership Conference!
              </p>
            </div>
            <button 
              onClick={() => scrollToSection(storiesSectionRef)}
              className="bg-[#00205B] text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all"
            >
              View Our Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}