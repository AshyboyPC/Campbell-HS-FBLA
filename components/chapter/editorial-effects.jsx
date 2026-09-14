'use client';

import FoldText from '@/components/react-bits/FoldText';
import ScrollReveal from '@/components/react-bits/ScrollReveal';
import TextLoop from '@/components/react-bits/TextLoop';

export function AboutHeroFold() {
  return (
    <h1 className="about-fold-title">
      <FoldText text="FROM NATIONAL FBLA" splitBy="word" hinge="top" trigger="mount" duration={0.62} stagger={0.055} perspective={760} creaseShading={0.28} fontSize="inherit" fontWeight={500} color="inherit" />
      <span className="about-fold-accent"><FoldText text="TO CAMPBELL" splitBy="word" hinge="top" trigger="mount" duration={0.62} stagger={0.06} perspective={760} creaseShading={0.28} fontSize="inherit" fontWeight={500} color="inherit" /></span>
      <FoldText text="HIGH SCHOOL." splitBy="word" hinge="top" trigger="mount" duration={0.62} stagger={0.055} perspective={760} creaseShading={0.28} fontSize="inherit" fontWeight={500} color="inherit" />
    </h1>
  );
}

export function ChapterTextRibbon() {
  return (
    <aside className="about-text-ribbon" aria-label="National FBLA, Georgia FBLA, Campbell FBLA">
      <TextLoop text="NATIONAL FBLA  GEORGIA FBLA  CAMPBELL FBLA" shape="wave" speed={44} direction="forward" separator="✦" curviness={24} fontSize={26} fontWeight={500} letterSpacing={1.25} uppercase color="#061a4e" ribbon ribbonColor="#ffc72c" ribbonWidth={58} pauseOnHover />
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
