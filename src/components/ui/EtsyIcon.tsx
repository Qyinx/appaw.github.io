import React from 'react';

interface EtsyIconProps {
  className?: string;
}

export default function EtsyIcon({ className = 'w-5 h-5' }: EtsyIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="3.5" fill="#F1641E" />
      <path
        fill="#FFFFFF"
        d="M7 5h10v2.6H9.8v3.1h5.5v2.6H9.8v3.1h7.4V19H7V5z"
      />
    </svg>
  );
}
