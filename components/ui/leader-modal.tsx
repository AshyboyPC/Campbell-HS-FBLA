"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface LeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  role: string;
  img: string;
  description: string;
  achievements: string[];
}

export function LeaderModal({ 
  isOpen, 
  onClose, 
  name, 
  role, 
  img, 
  description, 
  achievements 
}: LeaderModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full bg-white/80 hover:bg-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="relative h-64 w-full rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">{name}</h3>
                  <p className="text-yellow-600 font-medium">{role}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">About</h4>
                    <p className="text-gray-700">{description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Achievements</h4>
                    <ul className="space-y-2">
                      {achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
