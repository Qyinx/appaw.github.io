'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useProtectorColorState(options?: { trackPrice?: boolean }) {
  const trackPrice = options?.trackPrice ?? false;
  const [selectedColor, setSelectedColor] = useState(0);
  const [colorSlideAnimated, setColorSlideAnimated] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [isScanning, setIsScanning] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const prevColor = useRef(0);

  const selectColor = useCallback(
    (i: number) => {
      if (i === selectedColor) return;
      const dir = i > selectedColor ? 'right' : 'left';
      setSlideDir(dir);
      prevColor.current = selectedColor;
      setColorSlideAnimated(true);
      setIsScanning(true);
      setSelectedColor(i);
    },
    [selectedColor],
  );

  useEffect(() => {
    if (!colorSlideAnimated) return;
    const id = setTimeout(() => setIsScanning(false), 360);
    return () => clearTimeout(id);
  }, [selectedColor, colorSlideAnimated]);

  const prevSelectedRef = useRef(selectedColor);
  useEffect(() => {
    if (!trackPrice || prevSelectedRef.current === selectedColor) return;
    setPriceAnimating(true);
    const id = setTimeout(() => setPriceAnimating(false), 240);
    prevSelectedRef.current = selectedColor;
    return () => clearTimeout(id);
  }, [selectedColor, trackPrice]);

  return {
    selectedColor,
    previousColorIndex: prevColor.current,
    slideDir,
    colorSlideAnimated,
    isScanning,
    priceAnimating,
    selectColor,
    prevColorRef: prevColor,
  };
}
