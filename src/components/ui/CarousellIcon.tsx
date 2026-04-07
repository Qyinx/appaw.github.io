import Image from 'next/image';

interface CarousellIconProps {
  className?: string;
}

export default function CarousellIcon({ className = 'h-5 w-auto' }: CarousellIconProps) {
  return (
    <Image
      src="/images/icons/Carousell.svg"
      alt="Carousell"
      width={416}
      height={80}
      className={className}
      unoptimized
    />
  );
}
