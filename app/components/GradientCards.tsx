"use client"

import { Canvas } from "@react-three/fiber"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Trophy, Users, HandHeart } from "lucide-react"
import GrainyGradient from "@/components/ui/gradient-shader-card"

interface Ripple {
  id: number
  x: number
  y: number
  startTime: number
}

interface GradientCardProps {
  title: string
  description: string
  icon: React.ReactNode
  colors: {
    color1: string
    color2: string
    color3: string
    color4: string
  }
}

const GradientCard = ({ title, description, icon, colors }: GradientCardProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      startTime: currentTime,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 2000)
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative h-64 w-full overflow-hidden rounded-2xl cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ preserveDrawingBuffer: true }}
        className="absolute inset-0"
      >
        <GrainyGradient 
          ripples={ripples} 
          onTimeUpdate={handleTimeUpdate}
          colors={colors}
        />
      </Canvas>
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

const GradientCards = () => {
  const cards = [
    {
      title: "Fundraiser Success",
      description: "Thank you for helping us reach our travel goal!",
      icon: <Trophy className="w-6 h-6 text-white" />,
      colors: {
        color1: "#00205B", // Dark blue
        color2: "#003DA5", // Blue
        color3: "#FFFFFF", // White
        color4: "#FFC72C"  // Yellow
      }
    },
    {
      title: "Regionals Winners",
      description: "Congrats to members advancing to State!",
      icon: <Users className="w-6 h-6 text-white" />,
      colors: {
        color1: "#003DA5", // Blue
        color2: "#00205B", // Dark blue
        color3: "#FFC72C", // Yellow
        color4: "#FFFFFF"  // White
      }
    },
    {
      title: "Community Service Day",
      description: "Volunteering with local partners across Smyrna.",
      icon: <HandHeart className="w-6 h-6 text-white" />,
      colors: {
        color1: "#FFC72C", // Yellow
        color2: "#FFFFFF", // White
        color3: "#00205B", // Dark blue
        color4: "#003DA5"  // Blue
      }
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-12">
      {cards.map((card, index) => (
        <GradientCard
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
          colors={card.colors}
        />
      ))}
    </div>
  )
}

export default GradientCards
