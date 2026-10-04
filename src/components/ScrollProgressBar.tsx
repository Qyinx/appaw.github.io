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
      className="fixed z-[110] h-[2px] pointer-events-none motion-reduce:hidden"
      style={{
        top: 'var(--site-frame)',
        left: 'var(--site-frame)',
        right: 'var(--site-frame)',
      }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent-brand"
        style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
}
