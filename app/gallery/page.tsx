'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlipReveal, FlipRevealItem } from '@/components/ui/flip-reveal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { X } from 'lucide-react';

const images = [
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/2411d2cd-e694-4eaf-8fc2-424855ac92ca/SLC7.jpg", 
    alt: "Students by illuminated FBLA letters",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/33659004-bb0e-4a33-a076-b89b77a0febc/SLC10.jpg", 
    alt: "Group in front of FBLA backdrop",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/67ff674c-c627-4d01-b06f-7226f97bd55a/SLC3.jpg", 
    alt: "FBLA plush mascots",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/6ee40188-061b-4205-b4c5-cda9fad5b7dd/SLC8.jpg", 
    alt: "Students posing at SLC",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/7318ebd2-e5c5-4d63-ab61-fc304ad7c599/SLC6.jpg", 
    alt: "SLC formal group by FBLA letters",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/7e0f8568-1334-42c0-8054-258257e54e45/SLC9.jpg", 
    alt: "Group in front of Georgia FBLA backdrop",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/88651f09-65f7-4e18-baf9-36d7fe38abde/SLC11.JPG", 
    alt: "Neon Georgia FBLA sign",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/c3bffe2b-91ab-4ede-a8b6-f0b02904511c/SLC5.jpg", 
    alt: "Three students by FBLA letters",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/c615ee02-79e7-4a1c-98fa-d8bee75bfc7c/SLC1.jpg", 
    alt: "Conference hall audience and stage",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/eb471d55-5a07-471c-aeab-93d13e13c636/SLC.jpg", 
    alt: "Large auditorium at SLC",
    category: 'slc2025'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/debcb7b2-53d0-486f-9c7b-eb8c18334a1d/Regional_winner_3.jpg", 
    alt: "Regional winner medal photo",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/39d93355-6e30-43b5-aab9-8205427ad196/Camie_-_MLK_Award.jpg", 
    alt: "Camie MLK Award",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/6c55ef8c-ef43-43fb-8c43-e5db6d7a5973/Tyler_MLK_Award.jpg", 
    alt: "Tyler MLK Award",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/e81e10ac-733a-464a-9e47-64ef25983200/IMG_0339.JPG", 
    alt: "Student with medal in hallway",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/753ede79-dea5-404e-afa5-c5d8b9c06e9a/FLC2.JPG", 
    alt: "Speaker at podium during FLC",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/717db393-78c3-41e1-8384-b89dbf30caad/FLC3.jpg", 
    alt: "FLC group photo",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/f2203447-4110-46e7-8e62-2e9d0234e2f1/FLC_1.jpg", 
    alt: "GAFBLA stage with podium",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/fe71d8b7-3e82-4103-9741-36103cb605d4/FLC.jpg", 
    alt: "FLC formal group photo",
    category: 'gaWinners'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/0172d37d-d231-4823-9bf6-91c6c109d885/FBLA_Week_Table.jpg", 
    alt: "FBLA Week promotional table at Campbell HS",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/12a5a322-afea-42f7-973a-2e84fea65158/Food_Drive.jpg", 
    alt: "FBLA Food Drive donation boxes",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/1d64d741-81a3-431f-b664-48f41d5076fa/Feb_Social5.jpg", 
    alt: "February social students at table",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/23db7a04-f275-4c5e-964e-ebf93abf9248/Feb_Social_4.jpg", 
    alt: "February social smiles and snacks",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/2c04df90-a290-478f-bec0-8bc67949fbd5/Feb_Social_3.jpg", 
    alt: "Group around pink table during social",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/34f7a917-b928-4cbb-aba8-8023ad6f048c/Fall_Rally_Motivational_Speaker.jpg", 
    alt: "Fall Rally motivational speaker display",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/87ba3b21-d144-4816-9b25-aee9c309b5ba/Fab_Social_3.jpg", 
    alt: "February social classroom celebration",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/a95eafe3-fc34-4ac1-8ce0-41380b553c17/Fall_Rally_Group.JPG", 
    alt: "Fall Rally group outdoors",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/cd05c245-51b2-4df9-b714-262fb3f6e3cb/Fall_Rally.jpg", 
    alt: "Fall Rally swing ride",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/cd0c4108-1b26-464d-8e7c-4e0f111944c3/Feb_Social_1.jpg", 
    alt: "Student activity with pink tablecloths",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/daabd847-0c7e-46db-ab12-681a53869677/FBLA_Shirts_-_Embrace_the_Challenge.JPG", 
    alt: "FBLA shirts - Embrace the Challenge",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/e11934a0-ed61-4f17-83a7-4caf6cca4e09/Campbell-High-Student-Volunteer-IAS.JPG", 
    alt: "Campbell High student volunteer",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/e812751f-ca71-4a76-b42d-c37055f6af91/Feb_Social.jpg", 
    alt: "February social group at table",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/7041062f-ed82-4c03-a635-0fac2c19be0d/thumbnail_trick_or_treat_-_2.png", 
    alt: "Halloween Beetlejuice theme graphic",
    category: 'events'
  },
  { 
    src: "https://storage.googleapis.com/cosmic-project-image-assets/images/163a33f7-7734-4632-a368-912df051e1b4/September_Challenge.JPG", 
    alt: "September Service Challenge thank you cards",
    category: 'events'
  }
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  
  // Close modal on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl text-[#00205B] mb-2"
      >
        Gallery
      </motion.h1>

      <p className="text-sm text-[#00205B]/80 mb-8">
        Browse photos from our events, competitions, and activities.
      </p>

      <div className="mb-8">
        <ToggleGroup
          type="single"
          value={activeFilter}
          onValueChange={(value) => setActiveFilter(value || 'all')}
          className="flex flex-wrap gap-2 justify-center"
        >
          <ToggleGroupItem 
            value="all" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-[#00205B] text-white' : 'bg-white text-[#00205B] hover:bg-gray-100'}`}
          >
            All Photos
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="slc2025" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'slc2025' ? 'bg-[#00205B] text-white' : 'bg-white text-[#00205B] hover:bg-gray-100'}`}
          >
            SLC 2025
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="gaWinners" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'gaWinners' ? 'bg-[#00205B] text-white' : 'bg-white text-[#00205B] hover:bg-gray-100'}`}
          >
            GA Competition Winners
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="events" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'events' ? 'bg-[#00205B] text-white' : 'bg-white text-[#00205B] hover:bg-gray-100'}`}
          >
            Events & Activities
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="relative">
        <FlipReveal
          keys={[activeFilter]}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          showClass="block"
          hideClass="hidden"
        >
          {images
            .filter(img => activeFilter === 'all' || img.category === activeFilter)
            .map((img, i) => (
              <FlipRevealItem
                key={img.src}
                flipKey={img.category}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#003DA5]/15 bg-white/60 backdrop-blur-sm transition-transform duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading={i < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm line-clamp-2">{img.alt}</p>
                </div>
              </FlipRevealItem>
            ))}
        </FlipReveal>
      </div>

      {/* Image Modal - Simple Enlarged View */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close image"
            >
              <X size={32} />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <motion.div 
                className="relative w-full h-full flex items-center justify-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  style={{
                    transform: 'scale(1.5)', // Default zoom level
                    transformOrigin: 'center center',
                    cursor: 'zoom-out',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const img = e.currentTarget;
                    const currentScale = window.getComputedStyle(img).transform;
                    
                    if (currentScale === 'none' || currentScale.includes('1.5')) {
                      img.style.transform = 'scale(2.5)';
                      img.style.cursor = 'zoom-out';
                    } else {
                      img.style.transform = 'scale(1.5)';
                      img.style.cursor = 'zoom-in';
                    }
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}