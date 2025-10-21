"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { LeaderModal } from "./leader-modal";

interface GlassmorphismProfileCardProps {
  name?: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  initials?: string;
  statusText?: string;
  statusColor?: string; 
  glowText?: string; 
  className?: string;
  description?: string;
  achievements?: string[];
}

export default function GlassmorphismProfileCard({
  name = "John Doe",
  role = "Member",
  email = "",
  avatarSrc = "",
  initials = "",
  statusText = "Active",
  statusColor = "bg-blue-500",
  glowText = "FBLA Leader",
  className,
  description = "",
  achievements = [],
}: GlassmorphismProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("relative w-full max-w-xs mx-auto cursor-pointer", className)}
        onClick={handleCardClick}
      >
      <div className="pointer-events-none absolute inset-x-3 -bottom-10 top-[90%] rounded-[28px] bg-gradient-to-r from-blue-400 to-yellow-400 opacity-90 blur-0 shadow-[0_40px_80px_-16px_rgba(0,115,230,0.4)] z-0" />
      
      <div className="absolute inset-x-0 -bottom-10 mx-auto w-full z-0">
        <div className="flex items-center justify-center gap-2 py-3 text-center text-sm font-bold text-white">
          {glowText}
        </div>
      </div>

      <Card className={cn(
        "relative z-10 w-full overflow-visible rounded-[20px] border-0",
        "bg-gradient-to-br from-blue-50/80 to-yellow-50/60 backdrop-blur-xl",
        "shadow-lg shadow-blue-200/30 hover:shadow-blue-200/50",
        "border border-blue-100/30",
        "transition-all duration-300 hover:-translate-y-1"
      )}>
        <CardContent className="p-4 sm:p-6 pt-6">

          <div className="flex flex-col items-center gap-4">
              <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-[#00205B] to-[#003DA5] flex items-center justify-center">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={`${name}'s profile`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {initials || name?.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
            <h3 className="text-xl font-semibold tracking-tight text-blue-900 sm:text-2xl text-center">
              {name}
            </h3>
          </div>

          {email && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full justify-center gap-2 rounded-2xl bg-white/20 text-blue-900 hover:bg-white/30 border-blue-200/30"
              >
                <Mail className="h-4 w-4" />
                {copied ? "Copied!" : "Contact"}
              </Button>
            </div>
          )}
        </CardContent>
        </Card>
      </motion.div>

      <LeaderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        name={name}
        role={role}
        img={avatarSrc}
        description={description}
        achievements={achievements}
      />
    </>
  );
}
