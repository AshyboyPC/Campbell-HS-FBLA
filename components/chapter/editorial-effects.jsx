'use client';

import ScrollReveal from '@/components/react-bits/ScrollReveal';
import TextLoop from '@/components/react-bits/TextLoop';
import {useMotionReady} from '@/components/chapter/motion';

export function AboutHeroFold() {
  return (
    <h1 className="about-fold-title">
      <span>FROM NATIONAL FBLA</span>
      <span className="about-fold-accent">TO CAMPBELL</span>
      <span>HIGH SCHOOL.</span>
    </h1>
  );
}

export function ChapterTextRibbon() {
  const ready = useMotionReady();
  return (
    <aside className="about-text-ribbon" aria-label="National FBLA, Georgia FBLA, Campbell FBLA">
      {ready && <TextLoop text="NATIONAL FBLA  GEORGIA FBLA  CAMPBELL FBLA" shape="wave" speed={44} direction="forward" separator="✦" curviness={24} fontSize={26} fontWeight={500} letterSpacing={1.25} uppercase color="#061a4e" ribbon ribbonColor="#ffc72c" ribbonWidth={58} pauseOnHover />}
    </aside>
  );
}

export function EditorialReveal({children, className = ''}) {
  return (
    <ScrollReveal baseOpacity={0.22} enableBlur baseRotation={0} blurStrength={5} rotationEnd="bottom 72%" wordAnimationEnd="bottom 72%" containerClassName={`editorial-reveal ${className}`.trim()}>
      {children}
    </ScrollReveal>
  );
}
