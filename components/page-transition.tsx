"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GooeyLoader } from '@/components/ui/gooey-loader';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleStart = () => {
      setIsLoading(true);
      // Clear any existing timeout when a new navigation starts
      if (timer) clearTimeout(timer);
    };

    const handleComplete = () => {
      // Show loader for 1.5 seconds (1500ms)
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    // Set up route change event listeners
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // Trigger loader when navigation starts
    handleStart();
    
    // Complete the loading after the route changes
    handleComplete();

    // Clean up
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <GooeyLoader
          primaryColor="#1e40af" // blue-800
          secondaryColor="#fde047" // yellow-300
          borderColor="#ffffff" // white
          className="mix-blend-multiply"
        />
      )}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
