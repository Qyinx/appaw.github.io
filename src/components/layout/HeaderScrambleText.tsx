'use client';

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

/** Mono-safe charset — equal cell widths, no layout jump during scramble */
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*?/';

const SCRAMBLE_DURATION_MIN = 550;
const SCRAMBLE_DURATION_MAX = 750;

function scrambleFrame(target: string, progress: number): string {
  const chars = [...target];
  const locked = Math.floor(progress * chars.length);
  return chars
    .map((char, index) => {
      if (/\s/.test(char)) return char;
      if (progress >= 1 || index < locked) return char;
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    })
    .join('');
}

function canUseScramble(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface HeaderScrambleHandle {
  start: () => void;
  stop: () => void;
}

interface HeaderScrambleTextProps {
  text: string;
  uppercase?: boolean;
  className?: string;
}

const HeaderScrambleText = forwardRef<HeaderScrambleHandle, HeaderScrambleTextProps>(
  function HeaderScrambleText({ text, uppercase = false, className = '' }, ref) {
    const displayText = uppercase ? text.toUpperCase() : text;
    const [shown, setShown] = useState(displayText);
    const frameRef = useRef<number | null>(null);
    const runningRef = useRef(false);

    useEffect(() => {
      setShown(displayText);
    }, [displayText]);

    const stop = useCallback(() => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      runningRef.current = false;
      setShown(displayText);
    }, [displayText]);

    const start = useCallback(() => {
      if (!canUseScramble()) return;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      runningRef.current = true;
      const duration =
        SCRAMBLE_DURATION_MIN + Math.random() * (SCRAMBLE_DURATION_MAX - SCRAMBLE_DURATION_MIN);
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setShown(scrambleFrame(displayText, progress));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setShown(displayText);
          runningRef.current = false;
          frameRef.current = null;
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    }, [displayText]);

    useImperativeHandle(ref, () => ({ start, stop }), [start, stop]);

    useEffect(() => () => stop(), [stop]);

    return (
      <span className={`header-chrome__scramble-slot${className ? ` ${className}` : ''}`}>
        <span className="header-chrome__scramble header-chrome__scramble--ghost" aria-hidden="true">
          {displayText}
        </span>
        <span className="header-chrome__scramble header-chrome__scramble--live">{shown}</span>
      </span>
    );
  },
);

export default HeaderScrambleText;

export function useHeaderScrambleTrigger() {
  const scrambleRef = useRef<HeaderScrambleHandle>(null);

  const onPointerEnter = useCallback(() => scrambleRef.current?.start(), []);
  const onPointerLeave = useCallback(() => scrambleRef.current?.stop(), []);
  const onFocus = useCallback(() => scrambleRef.current?.start(), []);
  const onBlur = useCallback(() => scrambleRef.current?.stop(), []);

  return { scrambleRef, onPointerEnter, onPointerLeave, onFocus, onBlur };
}
