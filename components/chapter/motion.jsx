"use client";
import {useEffect,useState} from "react";
import {useReducedMotion} from "framer-motion";
import {PAGE_MOTION_READY_EVENT,isPageMotionReady} from "@/lib/page-motion-ready";
import SplitText from "@/components/react-bits/SplitText";
import BlurText from "@/components/react-bits/BlurText";
import ScrollReveal from "@/components/react-bits/ScrollReveal";
import ScrollFloat from "@/components/react-bits/ScrollFloat";
import FoldText from "@/components/react-bits/FoldText";
import BorderGlow from "@/components/react-bits/BorderGlow";
import GradientText from "@/components/react-bits/GradientText";
import ScrambledText from "@/components/react-bits/ScrambledText";
import TextType from "@/components/react-bits/TextType";
export function useMotionReady(){const reduced=useReducedMotion();const [ready,setReady]=useState(false);useEffect(()=>{const sync=()=>setReady(isPageMotionReady(window.location.pathname));sync();document.addEventListener(PAGE_MOTION_READY_EVENT,sync);return()=>document.removeEventListener(PAGE_MOTION_READY_EVENT,sync);},[]);return ready&&!reduced;}
export function MotionTitle({children,kind="split"}){const active=useMotionReady();const text=String(children);return <div className="motion-heading">{!active?<span>{text}</span>:kind==="blur"?<BlurText text={text} delay={45}/>:kind==="fold"?<FoldText text={text} fontSize="inherit" color="inherit" splitBy="word" trigger="scroll"/>:kind==="float"?<ScrollFloat animationDuration={0.6} scrollStart="top bottom" scrollEnd="top 65%">{text}</ScrollFloat>:<SplitText text={text} delay={25} duration={0.65} textAlign="left"/>}</div>}
export function RevealCopy({children}){const active=useMotionReady();return active?<ScrollReveal baseOpacity={0.65} enableBlur={false} baseRotation={0} rotationEnd="bottom bottom" wordAnimationEnd="bottom 80%" containerClassName="reveal-copy">{children}</ScrollReveal>:<p className="reveal-copy">{children}</p>}
export function FeatureBorder({children,className=""}){return <BorderGlow backgroundColor="#00205B" colors={['#003DA5','#FFC72C','#00205B']} glowColor="43 100 58" borderRadius={10} glowIntensity={0.45} fillOpacity={0.05} className={className}>{children}</BorderGlow>}
export function BlueGold({children}){const active=useMotionReady();return active?<GradientText colors={['#FFC72C','#adcaff','#FFC72C']} animationSpeed={10}>{children}</GradientText>:<span>{children}</span>}
export function CodingText(){const active=useMotionReady();return active?<ScrambledText radius={80} duration={0.7} speed={0.4} scrambleChars="01<>/{}">Build something useful.</ScrambledText>:<span>Build something useful.</span>}
export function IdentityType(){const active=useMotionReady();return active?<TextType text={['Student-led.','Competition-ready.','Community-minded.']} typingSpeed={75} pauseDuration={1600} loop={false} showCursor={false}/>:<span>Student-led. Competition-ready. Community-minded.</span>}

