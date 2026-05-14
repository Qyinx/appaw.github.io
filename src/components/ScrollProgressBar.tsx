'use client';

import { useState, useEffect } from 'react';

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#D4899A] via-[#E8A3B2] to-[#818cf8] pointer-events-none"
      style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
    />
  );
}
