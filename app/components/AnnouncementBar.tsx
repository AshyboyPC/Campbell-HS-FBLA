"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentDeadlines, getUpcomingDeadlines } from "@/data/eventDeadlines";

// Different background colors for variety
const announcementStyles = [
  "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200",
  "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200",
  "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200",
  "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-200"
];

// Different icons for different types of announcements
const announcementIcons = [
  "📢", "📅", "🏆", "🔔", "🎯", "📝",
  "🏛️", "👥", "💡", "📊", "🎓", "🌟"
];

// We'll use the events from eventDeadlines.ts instead

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get current month's deadlines
  const currentDeadlines = getCurrentDeadlines();
  
  // Memoize announcements to prevent unnecessary re-renders
  const announcements = React.useMemo(() => {
    if (currentDeadlines.length > 0) {
      return currentDeadlines.map((deadline, index) => ({
        ...deadline,
        style: announcementStyles[index % announcementStyles.length],
        icon: announcementIcons[index % announcementIcons.length]
      }));
    }
    return [{
      id: 'default',
      text: 'Stay tuned for upcoming events and deadlines!',
      style: announcementStyles[0],
      icon: '📌'
    }];
  }, [currentDeadlines]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % announcements.length);
    }, 5000); // 5 seconds per announcement
    
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Don't show if there are no announcements
  if (!visible || announcements.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {announcements.map((announcement, index) => (
          index === currentIndex && (
            <motion.div
              key={announcement.id}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`w-full text-sm ${announcement.style} border-b backdrop-blur-sm`}
            >
              <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3">
                <div className="flex-1 flex items-center overflow-hidden">
                  <span className="mr-2 text-base">{announcement.icon}</span>
                  <span className="font-medium">{announcement.text}</span>
                </div>
                
                {/* Show dots for multiple announcements */}
                {announcements.length > 1 && (
                  <div className="flex items-center gap-1 mr-2">
                    {announcements.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-current opacity-100' : 'bg-current opacity-30'}`}
                        aria-label={`Go to announcement ${i + 1} of ${announcements.length}`}
                      />
                    ))}
                  </div>
                )}
                
                <button
                  aria-label="Dismiss announcement"
                  onClick={() => setVisible(false)}
                  className="shrink-0 rounded-md px-2 py-1 hover:bg-black/5 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}
