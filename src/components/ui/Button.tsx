import React from 'react';
import LocalLink from '@/components/LocalLink';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const variantClasses = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  outline: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  destructive: 'btn btn-destructive',
};

const sizeClasses = {
  sm: 'min-h-11 min-w-11 px-3 py-2 text-xs',
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-11 px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  target,
  rel,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          className={classes}
          target={target || '_blank'}
          rel={rel || 'noopener noreferrer'}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <LocalLink href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </LocalLink>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
