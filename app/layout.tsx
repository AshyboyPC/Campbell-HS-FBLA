'use client';

import "./globals.css";
import { CosmicAnalyticsProvider } from "cosmic-analytics";
import { AuthProvider } from "@/app/contexts/AuthContext";
import dynamic from 'next/dynamic';

// Import client components with no SSR
const AnnouncementBar = dynamic(
  () => import('@/app/components/AnnouncementBar'), 
  { ssr: false }
);
const Navbar = dynamic(
  () => import('@/app/components/Navbar'), 
  { ssr: false }
);
const Footer = dynamic(
  () => import('@/app/components/Footer'), 
  { ssr: false }
);
const PageTransition = dynamic<{ children: React.ReactNode }>(
  () => import('@/components/page-transition'), 
  { ssr: false }
);

import { displayFont, subtitleFont, bodyFont } from "./fonts";

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${bodyFont.variable} ${displayFont.variable} ${subtitleFont.variable} font-body`}
    >
      <body
        className="antialiased"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(62,147,252,0.10), transparent 40%), radial-gradient(circle at 85% 15%, rgba(255,199,44,0.20), transparent 45%), radial-gradient(circle at 20% 80%, rgba(62,147,252,0.08), transparent 40%), linear-gradient(174.2deg, rgba(255,244,228,1) 7.1%, rgba(240,246,238,1) 67.4%)",
        }}
      >
        <style jsx global>{`
          :root {
            --font-display: ${displayFont.style.fontFamily};
            --font-subtitle: ${subtitleFont.style.fontFamily};
            --font-body: ${bodyFont.style.fontFamily};
          }
          
          /* Apply display font to all headings */
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-display), sans-serif;
          }
          
          /* Apply BHF Beats Bold to subtitles */
          .font-subtitle,
          .subtitle,
          h2, h3, h4,
          nav a,
          .nav-link,
          .navbar *,
          .text-subtitle,
          .numbers,
          [class*="text-"][class*="subtitle"],
          [class*="text-"][class*="nav"],
          [class*="text-"][class*="number"] {
            font-family: var(--font-subtitle), sans-serif !important;
          }
          
          /* Apply to all numbers */
          .countup-number,
          [class*="number"],
          .text-number,
          .stat-number,
          .counter {
            font-family: var(--font-subtitle), sans-serif !important;
          }
          
          /* Navbar specific */
          nav,
          .navbar,
          .nav-menu,
          .nav-item,
          .nav-link {
            font-family: var(--font-subtitle), sans-serif !important;
          }
          
          .font-display {
            font-family: var(--font-display), sans-serif;
          }
          
          .font-body {
            font-family: var(--font-body), sans-serif;
          }
        `}</style>
        <main className="min-h-screen flex flex-col">
          <CosmicAnalyticsProvider>
            <AuthProvider>
              <AnnouncementBar />
              <Navbar />
              <PageTransition>
                <div className="flex-1">
                  {children}
                </div>
              </PageTransition>
              <Footer />
            </AuthProvider>
          </CosmicAnalyticsProvider>
        </main>
      </body>
    </html>
  );
}