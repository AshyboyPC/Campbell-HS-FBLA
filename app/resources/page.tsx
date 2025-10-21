'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Animation variants
import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 10,
      stiffness: 100
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 45, 158, 0.1), 0 10px 10px -5px rgba(0, 45, 158, 0.04)",
    transition: { duration: 0.2 }
  }
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

type ResourceItem = {
  name: string;
  id?: string;
  href?: string;
  embedUrl?: string;
  type: 'pdf' | 'link' | 'embed';
  category: 'competition' | 'chapter' | 'documents' | 'links';
  icon?: string;
};

const resources: ResourceItem[] = [
  // Competition Resources
  {
    name: "FBLA Competitive Events Guide",
    embedUrl: "https://storage.googleapis.com/articulate-courses/BAA%20Contributor/Choose%20Your%20Event%20(FBLA%20HS)%202023-24/story.html",
    type: 'embed',
    category: 'competition',
    icon: '🏆'
  },
  {
    name: "25-26 High School Guidelines",
    id: "1Sv3t3HJUi6mTYDHlNk4ODAEj2Wac9FQK",
    type: 'pdf',
    category: 'competition',
    icon: '📘'
  },
  {
    name: "25-26 High School Topics",
    id: "1Sv3t3HJUi6mTYDHlNk4ODAEj2Wac9FQK",
    type: 'pdf',
    category: 'competition',
    icon: '📋'
  },
  {
    name: "25-26-HS-CE-List.pdf",
    id: "1Sv3t3HJUi6mTYDHlNk4ODAEj2Wac9FQK", // Replace with actual ID
    type: 'pdf',
    category: 'competition'
  },
  
  // Chapter Resources
  {
    name: "Chapter Meeting Checklist",
    id: "1Sv3t3HJUi6mTYDHlNk4ODAEj2Wac9FQK",
    type: 'pdf',
    category: 'chapter',
    icon: '✅'
  },
  {
    name: "Meeting Skills Toolkit",
    id: "10Y8nJNHb1e3Px9mAuQRKmjg3kvzfix2T",
    type: 'pdf',
    category: 'chapter',
    icon: '💡'
  },
  {
    name: "New Member Induction Guide",
    id: "1j6H4YX2wxWKt0nHHOwhpdLj6Z98tgGXJ",
    type: 'pdf',
    category: 'chapter',
    icon: '👥'
  },

  // Official Documents
  {
    name: "FBLA High School Bylaws",
    id: "1UFNU2y_9rV2-2M7e_YDE1kzSmZeqc-6e",
    type: 'pdf',
    category: 'documents'
  },
  {
    name: "Dress Code Policy",
    id: "1vh_8BarqjV10zNUnWyDsuEg1CQrRbu32",
    type: 'pdf',
    category: 'documents'
  },

  // Quick Links
  {
    name: "FBLA National Website",
    href: "https://www.fbla.org/",
    type: 'link',
    category: 'links',
    icon: '🌐'
  },
  {
    name: "Georgia FBLA",
    href: "https://www.gafbla.org/",
    type: 'link',
    category: 'links',
    icon: '🏛️'
  },
  {
    name: "Competition Guidelines",
    href: "https://www.fbla.org/fbla/competitive-events/",
    type: 'link',
    category: 'links',
    icon: '🏆'
  }
];

const previewUrl = (id: string): string => `https://drive.google.com/file/d/${id}/preview`;
const viewUrl = (id: string): string => `https://drive.google.com/file/d/${id}/view`;
const downloadUrl = (id: string): string => `https://drive.google.com/uc?export=download&id=${id}`;

const categoryTitles = {
  competition: 'Competition Resources',
  chapter: 'Chapter Resources',
  documents: 'Official Documents',
  links: 'Quick Links'
};

// Helper component for resource cards
const ResourceCard = ({ resource, isEmbed = false }: { resource: ResourceItem, isEmbed?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isEmbed) {
    return (
      <motion.div 
        className="rounded-xl overflow-hidden border-2 border-[#003DA5]/20 bg-gradient-to-br from-white to-[#f0f5ff] shadow-sm hover:shadow-lg transition-all duration-300"
        variants={item}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 10px 25px -5px rgba(0, 45, 158, 0.1), 0 10px 10px -5px rgba(0, 45, 158, 0.04)"
        }}
      >
        <div className="p-4 border-b border-[#003DA5]/10 bg-gradient-to-r from-[#00205B] to-[#003DA5]">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="text-xl">{resource.icon}</span>
            {resource.name}
          </h3>
        </div>
        <div className="aspect-video w-full">
          <iframe
            src={resource.embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            title={resource.name}
          />
        </div>
      </motion.div>
    );
  }

  if (resource.type === 'link') {
    return (
      <motion.a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-xl bg-white border-2 border-[#003DA5]/10 hover:border-[#003DA5]/30 transition-all duration-300 group relative overflow-hidden"
        variants={item}
        whileHover={{ 
          y: -3,
          boxShadow: "0 10px 25px -5px rgba(0, 45, 158, 0.1), 0 10px 10px -5px rgba(0, 45, 158, 0.04)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00205B] to-[#003DA5] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{resource.icon}</span>
            <div>
              <h3 className="font-semibold text-[#00205B] group-hover:text-[#003DA5] transition-colors">
                {resource.name}
              </h3>
              <p className="text-sm text-[#666] mt-1">
                {new URL(resource.href!).hostname.replace('www.', '')}
              </p>
            </div>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.div 
      className="p-5 rounded-xl bg-white border-2 border-[#003DA5]/10 hover:border-[#003DA5]/30 transition-all duration-300 group relative overflow-hidden"
      variants={item}
      whileHover={{ 
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0, 45, 158, 0.1), 0 10px 10px -5px rgba(0, 45, 158, 0.04)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00205B] to-[#003DA5] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{resource.icon}</span>
            <h3 className="font-semibold text-[#00205B] group-hover:text-[#003DA5] transition-colors">
              {resource.name}
            </h3>
          </div>
          <div className="flex gap-2">
            <a 
              href={viewUrl(resource.id!)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm rounded-md bg-[#003DA5]/5 text-[#003DA5] hover:bg-[#003DA5]/10 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </a>
            <a 
              href={downloadUrl(resource.id!)} 
              className="px-3 py-1 text-sm rounded-md bg-[#003DA5] text-white hover:bg-[#00205B] transition-colors"
              download
              onClick={(e) => e.stopPropagation()}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Group resources by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  // Set initial active category
  useEffect(() => {
    setActiveCategory('competition');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#00205B] mb-4">
            FBLA Resources
          </h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Everything you need to succeed in FBLA competitions and chapter activities
          </p>
        </motion.div>

      {/* Category Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8 justify-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {Object.entries(categoryTitles).map(([key, title]) => (
          <motion.button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === key 
                ? 'bg-[#003DA5] text-white shadow-md' 
                : 'bg-white text-[#00205B] hover:bg-[#f0f5ff] border border-[#003DA5]/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            variants={item}
          >
            {title}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Embedded Guide (only for competition) */}
          {activeCategory === 'competition' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ResourceCard 
                resource={resourcesByCategory.competition?.find(r => r.type === 'embed')!} 
                isEmbed 
              />
            </motion.div>
          )}

          {/* Resource Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {resourcesByCategory[activeCategory as keyof typeof resourcesByCategory]?.map((resource) => (
              resource.type !== 'embed' && (
                <ResourceCard key={resource.name} resource={resource} />
              )
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Quick Links Section */}
      <motion.section 
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="bg-gradient-to-r from-[#00205B] to-[#003DA5] rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Check out these additional resources to help you prepare for competitions and chapter activities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {resourcesByCategory.links?.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                  whileHover={{ y: -2 }}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  );
}