import React from 'react';

interface CarousellIconProps {
  className?: string;
}

export default function CarousellIcon({ className = 'w-5 h-5' }: CarousellIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.842c-.46 2.396-2.463 4.158-4.894 4.158-2.431 0-4.434-1.762-4.894-4.158-.08-.418.196-.818.618-.898.422-.08.823.196.903.618.322 1.677 1.756 2.938 3.373 2.938s3.051-1.261 3.373-2.938c.08-.422.481-.698.903-.618.422.08.698.48.618.898zM8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}
