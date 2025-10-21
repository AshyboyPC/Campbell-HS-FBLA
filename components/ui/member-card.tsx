"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  name: string;
  role?: string;
  img: string;
  className?: string;
}

export default function MemberCard({ 
  name, 
  role, 
  img, 
  className 
}: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center p-4 rounded-xl",
        "bg-white/80 backdrop-blur-sm border border-blue-100/50",
        "hover:shadow-md hover:shadow-blue-100/30 transition-all",
        className
      )}
    >
      <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3 border-2 border-blue-100/50">
        <Image
          src={img}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <h3 className="font-medium text-blue-900 text-center">{name}</h3>
      {role && <p className="text-sm text-blue-600/80 text-center">{role}</p>}
    </motion.div>
  );
}
