'use client';

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const SocialCards = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const socials = [
    {
      id: 'instagram',
      icon: 'mdi:instagram',
      label: 'Instagram',
      username: '@campbell_fbla',
      url: 'https://instagram.com/campbell_fbla',
      bgColor: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]'
    },
    {
      id: 'tiktok',
      icon: 'ic:baseline-tiktok',
      label: 'TikTok',
      username: '@chs.fbla',
      url: 'https://tiktok.com/@chs.fbla',
      bgColor: 'bg-black'
    },
    {
      id: 'remind',
      icon: 'mdi:bell',
      label: 'Remind',
      username: '@chs4fbla',
      url: 'https://www.remind.com/join/chs4fbla',
      bgColor: 'bg-[#3F8CF7]'
    }
  ];

  return (
    <div className="group w-[250px] mx-auto flex flex-col gap-4 transition-all duration-200">
      {socials.map((social) => (
        <motion.a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative flex items-center justify-between px-4 py-3 rounded-lg ${social.bgColor} text-white transition-all duration-200 cursor-pointer
            ${hoveredCard && hoveredCard !== social.id ? 'opacity-60 blur-[2px] scale-95' : 'opacity-100'}
            hover:!opacity-100 hover:!blur-0 hover:scale-105 hover:z-10`}
          onMouseEnter={() => setHoveredCard(social.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center gap-3">
            <Icon icon={social.icon} width={24} height={24} />
            <span className="font-medium">{social.label}</span>
          </div>
          <span className="text-sm font-semibold">{social.username}</span>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialCards;
