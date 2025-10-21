"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Calendar, Award } from "lucide-react";

const messages = [
  { icon: <Trophy className="w-5 h-5 text-[#00205B]" />, text: "FBLA Fall Leadership Conference" },
  { icon: <Clock className="w-5 h-5 text-[#00205B]" />, text: "Counting down to FLC 2025!" },
  { icon: <Calendar className="w-5 h-5 text-[#00205B]" />, text: "November 18, 2025" },
  { icon: <Award className="w-5 h-5 text-[#00205B]" />, text: "Get ready for FLC!" },
];

function getTimeLeft(target: Date) {
  const now = new Date().getTime();
  const diff = target.getTime() - now;
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((clamped % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isComplete: clamped <= 0 };
}

const CountdownItem = ({ value, label, isHighlighted = false }: { value: number; label: string; isHighlighted?: boolean }) => {
  const prevValue = useRef(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div 
      className={`flex flex-col items-center ${isHighlighted ? 'scale-110' : ''}`}
      initial={false}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center rounded-xl overflow-hidden 
        bg-gradient-to-br from-white via-[#FFD700] to-[#003DA5] border-2 border-black`}>
        <div className="absolute inset-0.5 bg-white/90 rounded-lg">
          <AnimatePresence mode="wait">
            <motion.span 
              key={value} 
              className="text-2xl sm:text-3xl font-bold text-black flex items-center justify-center h-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {value.toString().padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#003DA5]/20 to-transparent"></div>
      </div>
      <motion.span 
        className="mt-2 text-xs font-bold text-[#00205B]"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export default function Countdown({ dateISO = "2025-11-18T09:00:00" }: { dateISO?: string }) {
  const target = new Date(dateISO);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { days, hours, minutes, seconds, isComplete } = timeLeft;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
      // Calculate progress through the current minute (0-100%)
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      const currentProgress = ((seconds * 1000 + milliseconds) / 60000) * 100;
      setProgress(currentProgress);
    }, 50); // Update more frequently for smoother animation
    return () => clearInterval(timer);
  }, [dateISO]);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(messageTimer);
  }, []);

  if (isComplete) {
    return (
      <motion.div 
        className="text-center py-6 px-4 rounded-xl bg-gradient-to-r from-[#00205B] to-[#003DA5] text-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold mb-2">FLC 2025 is Here!</h3>
        <p className="text-sm opacity-90">Have a great conference!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            className="flex items-center justify-center gap-2 text-[#00205B]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {messages[messageIndex].icon}
            <span className="text-sm font-semibold">{messages[messageIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <CountdownItem value={days} label="Days" />
        <div className="text-2xl font-bold text-white/50">:</div>
        <CountdownItem value={hours} label="Hours" />
        <div className="text-2xl font-bold text-white/50">:</div>
        <CountdownItem value={minutes} label="Minutes" />
        <div className="text-2xl font-bold text-white/50">:</div>
        <CountdownItem value={seconds} label="Seconds" isHighlighted={minutes < 10} />
      </div>
      
      <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden border border-black">
        <motion.div 
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: [
              'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #003DA5 100%)',
              'linear-gradient(90deg, #003DA5 0%, #FFD700 50%, #FFA500 100%)',
              'linear-gradient(90deg, #FFA500 0%, #003DA5 50%, #FFD700 100%)',
              'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #003DA5 100%)',
            ][Math.floor(Date.now() / 1000) % 4],
            transition: 'width 0.5s linear, background 0s',
          }}
        />
      </div>
    </motion.div>
  );
}
