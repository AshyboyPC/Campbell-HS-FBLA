import { Inter, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';

// Main display font (TalinademoRegular)
export const displayFont = localFont({
  src: '../fonts/TalinademoRegular-BLP7G.otf',
  variable: '--font-display',
  display: 'swap',
});

// Subtitle font (BHF Beats Bold)
export const subtitleFont = localFont({
  src: '../fonts/BHF Beats Bold.ttf',
  variable: '--font-subtitle',
  display: 'swap',
});

// Body font (Aminute)
export const bodyFont = localFont({
  src: '../fonts/Aminute.ttf',
  variable: '--font-body',
  display: 'swap',
});
