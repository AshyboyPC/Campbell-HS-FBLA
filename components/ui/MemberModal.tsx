'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './button';

type Member = {
  firstName: string;
  lastName: string;
  grade: string;
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  tshirtSize: string;
  previousParticipation: string;
  interests: string[];
};

type MemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
};

const MemberModal = ({ isOpen, onClose, member }: MemberModalProps) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#00205B] to-[#003DA5] flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <h2 className="text-2xl font-bold text-[#00205B]">
                  {member.firstName} {member.lastName}
                </h2>
                <p className="text-gray-600">Grade {member.grade}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-[#00205B] border-b pb-1">Contact Info</h3>
                  <p><span className="text-gray-600">Email:</span> {member.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {member.phone}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-[#00205B] border-b pb-1">Parent/Guardian</h3>
                  <p>{member.parentName}</p>
                  <p><span className="text-gray-600">Email:</span> {member.parentEmail}</p>
                  <p><span className="text-gray-600">Phone:</span> {member.parentPhone}</p>
                </div>

                {member.interests && member.interests.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-[#00205B] border-b pb-1 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#00205B]/10 text-[#00205B] rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">T-Shirt Size: {member.tshirtSize}</p>
                    <p className="text-sm text-gray-500">
                      Previous FBLA: {member.previousParticipation || 'No'}
                    </p>
                  </div>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberModal;
