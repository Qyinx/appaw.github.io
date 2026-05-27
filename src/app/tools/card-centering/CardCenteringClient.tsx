"use client";
import React, { useEffect } from 'react';
import styles from './card-centering.module.css';
import { Button } from '@/components/ui';

export default function CardCenteringClient() {
  const resetRef = React.useRef<(() => void) | null>(null);
  const fitRef = React.useRef<(() => void) | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  useEffect(() => {
    // DOM elements
    const upload = document.getElementById('upload') as HTMLInputElement | null;
    const img = document.getElementById('card-image') as HTMLImageElement | null;
    const imgWrapper = document.getElementById('image-wrapper') as HTMLDivElement | null;
    const overlay = document.getElementById('overlay-canvas') as HTMLCanvasElement | null;
    const workspace = document.getElementById('workspace') as HTMLDivElement | null;
    const plotCanvas = document.getElementById('plot-canvas') as HTMLCanvasElement | null;

    if (!overlay || !workspace || !img || !imgWrapper || !plotCanvas || !upload) return;

    // Narrowed, non-null locals for safe use inside nested functions
    const uploadEl = upload as HTMLInputElement;
    const imgEl = img as HTMLImageElement;
    const imgWrapperEl = imgWrapper as HTMLDivElement;
    const overlayEl = overlay as HTMLCanvasElement;
    const workspaceEl = workspace as HTMLDivElement;
    const plotCanvasEl = plotCanvas as HTMLCanvasElement;

    const ctx = overlayEl.getContext('2d')!;
    const plotCtx = plotCanvasEl.getContext('2d')!;

    const controls = {
      zoom: document.getElementById('zoom') as HTMLInputElement,
      rotate: document.getElementById('rotate') as HTMLInputElement,
      tiltY: document.getElementById('tiltY') as HTMLInputElement,
      tiltX: document.getElementById('tiltX') as HTMLInputElement,
      panX: document.getElementById('panX') as HTMLInputElement,
      panY: document.getElementById('panY') as HTMLInputElement,
    } as Record<string, HTMLInputElement>;

    let centerX = 0;
    let centerY = 0;

    const outerGuides = { top: -245, bottom: 245, left: -175, right: 175 };
    const innerGuides = { top: -210, bottom: 210, left: -140, right: 140 };

    const DEFAULTS = {
      zoom: '1',
      rotate: '0',
      tiltX: '0',
      tiltY: '0',
      panX: '0',
      panY: '0',
      outer: { ...outerGuides },
      inner: { ...innerGuides },
    };

    let dragging: string | null = null;
    let lastPointerX = 0,
      lastPointerY = 0;

    let initialPinchDistance: number | null = null;
    let initialZoom = 1;

    let hitArea = 25;
    // Increase touch hit targets on coarse (touch) devices so handles are easier to grab
    const isCoarsePointer = typeof window !== 'undefined' && (window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : ('ontouchstart' in window));
    if (isCoarsePointer) {
      hitArea = 36;
    }

    // Pull colors from the site's style guide CSS variables when available
    const rootStyles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const colorOuter = (rootStyles?.getPropertyValue('--color-accent-500') || '#f59e0b').trim();
    const colorInner = (rootStyles?.getPropertyValue('--color-primary-500') || '#f07a86').trim();
    const colorHover = (rootStyles?.getPropertyValue('--color-primary-300') || '#ffc2cc').trim();

    function resizeCanvas() {
      overlayEl.width = workspaceEl.clientWidth;
      overlayEl.height = workspaceEl.clientHeight;
      centerX = overlayEl.width / 2;
      centerY = overlayEl.height / 2;
      drawOverlay();
    }
    window.addEventListener('resize', resizeCanvas);

    const uploadHandler = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        imgEl.src = event.target?.result as string;
        imgEl.style.display = 'block';
        Object.values(controls).forEach((ctrl: any) => {
          ctrl.value = ctrl.defaultValue;
          const ev = new Event('input', { bubbles: false });
          ctrl.dispatchEvent(ev);
        });
      };
      reader.readAsDataURL(file);
    };
    uploadEl.addEventListener('change', uploadHandler);

    function updateTransform() {
      const z = parseFloat(controls.zoom.value);
      const r = parseFloat(controls.rotate.value);
      const tx = parseFloat(controls.tiltX.value);
      const ty = parseFloat(controls.tiltY.value);
      // Invert horizontal yaw so slider direction matches visual expectation
      const tiltXdeg = tx;
      const tiltYdeg = -ty;
      const px = parseInt(controls.panX.value || '0');
      const py = parseInt(controls.panY.value || '0');

      const zoomValEl = document.getElementById('zoom-val');
      const rotValEl = document.getElementById('rot-val');
      const tiltXValEl = document.getElementById('tiltX-val');
      const tiltYValEl = document.getElementById('tiltY-val');

      if (zoomValEl) zoomValEl.innerText = z.toFixed(2);
      if (rotValEl) rotValEl.innerText = r.toFixed(2) + '°';
      if (tiltXValEl) tiltXValEl.innerText = tx.toFixed(2) + '°';
      if (tiltYValEl) tiltYValEl.innerText = ty.toFixed(2) + '°';

      imgWrapperEl.style.transform = `translate(${px}px, ${py}px) scale(${z}) rotateZ(${r}deg) rotateX(${tiltXdeg}deg) rotateY(${tiltYdeg}deg)`;
      drawOverlay();
    }

    function resetAll() {
      controls.zoom.value = DEFAULTS.zoom;
      controls.rotate.value = DEFAULTS.rotate;
      controls.tiltX.value = DEFAULTS.tiltX;
      controls.tiltY.value = DEFAULTS.tiltY;
      controls.panX.value = DEFAULTS.panX;
      controls.panY.value = DEFAULTS.panY;

      outerGuides.top = DEFAULTS.outer.top;
      outerGuides.bottom = DEFAULTS.outer.bottom;
      outerGuides.left = DEFAULTS.outer.left;
      outerGuides.right = DEFAULTS.outer.right;

      innerGuides.top = DEFAULTS.inner.top;
      innerGuides.bottom = DEFAULTS.inner.bottom;
      innerGuides.left = DEFAULTS.inner.left;
      innerGuides.right = DEFAULTS.inner.right;

      updateTransform();
    }

    function fitToImage() {
      // Fit the image to the workspace area while preserving aspect ratio
      if (!imgEl || !overlayEl) return;
      const iw = imgEl.naturalWidth || imgEl.width || 1;
      const ih = imgEl.naturalHeight || imgEl.height || 1;
      const scaleX = (overlayEl.clientWidth * 0.8) / iw;
      const scaleY = (overlayEl.clientHeight * 0.8) / ih;
      const scale = Math.max(0.1, Math.min(Math.min(scaleX, scaleY), 3));
      controls.zoom.value = String(scale);
      controls.panX.value = '0';
      controls.panY.value = '0';
      updateTransform();
    }

    // expose controls to the component-level buttons via refs
    resetRef.current = resetAll;
    fitRef.current = fitToImage;

    Object.values(controls).forEach((ctrl: any) => ctrl.addEventListener('input', updateTransform));

    function drawOverlay() {
      ctx.clearRect(0, 0, overlayEl.width, overlayEl.height);

      // Center and auxiliary alignment guides
      // Strong, solid center cross for quick visual reference
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, overlayEl.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(overlayEl.width, centerY);
      ctx.stroke();

      // Faint quarter guides (25% and 75%) dashed for finer alignment
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      const vQuarters = [overlayEl.width * 0.25, overlayEl.width * 0.75];
      vQuarters.forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, overlayEl.height);
        ctx.stroke();
      });
      const hQuarters = [overlayEl.height * 0.25, overlayEl.height * 0.75];
      hQuarters.forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(overlayEl.width, y);
        ctx.stroke();
      });
      ctx.restore();

      const oxL = centerX + outerGuides.left;
      const oxR = centerX + outerGuides.right;
      const oyT = centerY + outerGuides.top;
      const oyB = centerY + outerGuides.bottom;
      const oxW = oxR - oxL;
      const oxH = oyB - oyT;

      const ixL = centerX + innerGuides.left;
      const ixR = centerX + innerGuides.right;
      const iyT = centerY + innerGuides.top;
      const iyB = centerY + innerGuides.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.rect(oxL, oyT, oxW, oxH);
      ctx.moveTo(ixL, iyT);
      ctx.lineTo(ixL, iyB);
      ctx.lineTo(ixR, iyB);
      ctx.lineTo(ixR, iyT);
      ctx.closePath();
      ctx.fillStyle = 'rgba(244, 67, 54, 0.15)';
      try { ctx.fill('evenodd'); } catch { ctx.fill(); }
      ctx.restore();

      ctx.setLineDash([5, 5]);
      drawDragLine(0, centerY + outerGuides.top, overlayEl.width, centerY + outerGuides.top, dragging === 'outerTop', true, colorOuter);
      drawDragLine(0, centerY + outerGuides.bottom, overlayEl.width, centerY + outerGuides.bottom, dragging === 'outerBottom', true, colorOuter);
      drawDragLine(centerX + outerGuides.left, 0, centerX + outerGuides.left, overlayEl.height, dragging === 'outerLeft', false, colorOuter);
      drawDragLine(centerX + outerGuides.right, 0, centerX + outerGuides.right, overlayEl.height, dragging === 'outerRight', false, colorOuter);

      ctx.setLineDash([]);
      drawDragLine(0, centerY + innerGuides.top, overlayEl.width, centerY + innerGuides.top, dragging === 'innerTop', true, colorInner);
      drawDragLine(0, centerY + innerGuides.bottom, overlayEl.width, centerY + innerGuides.bottom, dragging === 'innerBottom', true, colorInner);
      drawDragLine(centerX + innerGuides.left, 0, centerX + innerGuides.left, overlayEl.height, dragging === 'innerLeft', false, colorInner);
      drawDragLine(centerX + innerGuides.right, 0, centerX + innerGuides.right, overlayEl.height, dragging === 'innerRight', false, colorInner);

      calculateCentering();
    }

    function drawDragLine(x1: number, y1: number, x2: number, y2: number, isHovered: boolean, isHorizontal: boolean, baseColor: string) {
      const color = isHovered ? colorHover : baseColor;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      const handleSize = isCoarsePointer ? 28 : 20;
      const offset = handleSize / 2;
      if (isHorizontal) {
        ctx.fillRect(centerX - offset, y1 - offset, handleSize, handleSize);
      } else {
        ctx.fillRect(x1 - offset, centerY - offset, handleSize, handleSize);
      }
    }

    function calculateCentering() {
      const distLeft = innerGuides.left - outerGuides.left;
      const distRight = outerGuides.right - innerGuides.right;
      const distTop = innerGuides.top - outerGuides.top;
      const distBottom = outerGuides.bottom - innerGuides.bottom;

      const totalLR = distLeft + distRight;
      const totalTB = distTop + distBottom;

      let lrPercentL = 50,
        lrPercentR = 50;
      let tbPercentT = 50,
        tbPercentB = 50;

      if (totalLR > 0) {
        lrPercentL = (distLeft / totalLR) * 100;
        lrPercentR = (distRight / totalLR) * 100;
      }
      if (totalTB > 0) {
        tbPercentT = (distTop / totalTB) * 100;
        tbPercentB = (distBottom / totalTB) * 100;
      }

      const elLR = document.getElementById('lr-ratio');
      const elTB = document.getElementById('tb-ratio');

      if (elLR) elLR.innerText = `${lrPercentL.toFixed(1)} / ${lrPercentR.toFixed(1)}`;
      if (elTB) elTB.innerText = `${tbPercentT.toFixed(1)} / ${tbPercentB.toFixed(1)}`;

      // Axis-aligned PSA thresholds (percent ranges)
      const PSA = {
        PSA10: { min: 45, max: 55 },
        PSA9: { min: 40, max: 60 },
        PSA8: { min: 35, max: 65 },
      };

      function axisZone(percent: number) {
        if (percent >= PSA.PSA10.min && percent <= PSA.PSA10.max) return 'PSA10';
        if (percent >= PSA.PSA9.min && percent <= PSA.PSA9.max) return 'PSA9';
        if (percent >= PSA.PSA8.min && percent <= PSA.PSA8.max) return 'PSA8';
        return 'Below';
      }

      const lrZone = axisZone(lrPercentL);
      const tbZone = axisZone(tbPercentT);

      const zoneColorMap: Record<string, string> = {
        PSA10: '#4caf50', // green
        PSA9: '#f59e0b', // accent/gold
        PSA8: '#ffb020', // amber
        Below: '#f44336', // red
      };

      if (elLR) (elLR as HTMLElement).style.color = zoneColorMap[lrZone];
      if (elTB) (elTB as HTMLElement).style.color = zoneColorMap[tbZone];

      // Combined zone: the stricter (worst) axis determines the overall grade
      let overallZone = 'Below';
      if (lrZone === 'PSA10' && tbZone === 'PSA10') {
        overallZone = 'PSA10';
      } else if (
        (lrZone === 'PSA10' || lrZone === 'PSA9') &&
        (tbZone === 'PSA10' || tbZone === 'PSA9')
      ) {
        overallZone = 'PSA9';
      } else if (
        (lrZone === 'PSA10' || lrZone === 'PSA9' || lrZone === 'PSA8') &&
        (tbZone === 'PSA10' || tbZone === 'PSA9' || tbZone === 'PSA8')
      ) {
        overallZone = 'PSA8';
      }

      drawPlot(lrPercentL, tbPercentT, overallZone);
    }

    function drawPlot(lr: number, tb: number, overallZone: string) {
      // Hi-DPI support
      const dpr = window.devicePixelRatio || 1;
      const cw = plotCanvasEl.clientWidth || plotCanvasEl.width;
      const ch = plotCanvasEl.clientHeight || plotCanvasEl.height;
      plotCanvasEl.width = Math.round(cw * dpr);
      plotCanvasEl.height = Math.round(ch * dpr);
      plotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      plotCtx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const pxPerPercent = cw / 100; // maps 0-100% -> 0-cw

      // (Using axis-aligned PSA thresholds instead of radial percent thresholds)

      // Draw gridlines with stronger center and additional quarter guides
      plotCtx.save();
      const gridLines = [12.5, 25, 50, 75, 87.5];
      gridLines.forEach((p) => {
        const pos = p * pxPerPercent;
        // style stronger center line, medium 25/75, faint for quarters
        if (p === 50) {
          plotCtx.strokeStyle = 'rgba(255,255,255,0.12)';
          plotCtx.lineWidth = 1.6;
          plotCtx.setLineDash([]);
        } else if (p === 25 || p === 75) {
          plotCtx.strokeStyle = 'rgba(255,255,255,0.08)';
          plotCtx.lineWidth = 1.2;
          plotCtx.setLineDash([6, 6]);
        } else {
          plotCtx.strokeStyle = 'rgba(255,255,255,0.04)';
          plotCtx.lineWidth = 1;
          plotCtx.setLineDash([6, 6]);
        }

        // vertical
        plotCtx.beginPath();
        plotCtx.moveTo(pos, 0);
        plotCtx.lineTo(pos, ch);
        plotCtx.stroke();
        // horizontal
        plotCtx.beginPath();
        plotCtx.moveTo(0, pos);
        plotCtx.lineTo(cw, pos);
        plotCtx.stroke();
      });
      plotCtx.restore();


      // Draw axis-aligned rectangular PSA zones (PSA8 outer -> PSA10 inner)
      const zones = [
        { name: 'PSA8', min: 35, max: 65, color: 'rgba(255,194,204,0.45)' },
        { name: 'PSA9', min: 40, max: 60, color: 'rgba(255,154,166,0.6)' },
        { name: 'PSA10', min: 45, max: 55, color: 'rgba(240,122,134,0.9)' },
      ];

      zones.forEach((z) => {
        const x = z.min * pxPerPercent;
        const y = z.min * pxPerPercent;
        const w = (z.max - z.min) * pxPerPercent;
        const h = w;
        plotCtx.beginPath();
        plotCtx.fillStyle = z.color;
        plotCtx.fillRect(x, y, w, h);
        plotCtx.lineWidth = 1.2;
        plotCtx.strokeStyle = 'rgba(0,0,0,0.18)';
        plotCtx.strokeRect(x, y, w, h);
      });

      // Draw center crosshair
      plotCtx.strokeStyle = 'rgba(0,0,0,0.5)';
      plotCtx.lineWidth = 2;
      plotCtx.beginPath();
      plotCtx.moveTo(cx - 10, cy);
      plotCtx.lineTo(cx + 10, cy);
      plotCtx.moveTo(cx, cy - 10);
      plotCtx.lineTo(cx, cy + 10);
      plotCtx.stroke();

      // Compute point position
      const px = lr * pxPerPercent;
      const py = tb * pxPerPercent;

      // Determine which PSA zone the point falls into using axis thresholds
      let zoneLabel = overallZone === 'PSA10' ? 'PSA 10' : overallZone === 'PSA9' ? 'PSA 9' : overallZone === 'PSA8' ? 'PSA 8' : 'Below PSA 8';

      // Draw the measured point with subtle glow
      plotCtx.beginPath();
      const dotR = 6;
      // Glow
      plotCtx.fillStyle = 'rgba(0,0,0,0.25)';
      plotCtx.beginPath();
      plotCtx.arc(px, py, dotR + 6, 0, Math.PI * 2);
      plotCtx.fill();

      // Core
      plotCtx.beginPath();
      plotCtx.arc(px, py, dotR, 0, Math.PI * 2);
      plotCtx.fillStyle = '#111';
      plotCtx.fill();
      plotCtx.lineWidth = 1.5;
      plotCtx.strokeStyle = '#fff';
      plotCtx.stroke();

      // Label (top-right)
      plotCtx.fillStyle = 'rgba(255,255,255,0.95)';
      plotCtx.font = '12px Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue"';
      plotCtx.textAlign = 'right';
      plotCtx.fillText(`${zoneLabel}`, cw - 8, 16);
      plotCtx.fillStyle = 'rgba(255,255,255,0.75)';
      plotCtx.font = '11px Inter, ui-sans-serif';
      plotCtx.fillText(`L/R ${lr.toFixed(1)}%  T/B ${tb.toFixed(1)}%`, cw - 8, 32);
    }

    // --- Touch / Mouse Interaction Logic ---
    function getDistance(t1: Touch, t2: Touch) {
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }

    function getPointerPos(e: any) {
      if (e.touches && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    }

    function pointerDown(e: any) {
      if (e.touches && e.touches.length === 2) {
        dragging = 'pinch';
        initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
        initialZoom = parseFloat(controls.zoom.value);
        // prevent the page from scrolling while pinch-zooming
        try { document.body.style.overflow = 'hidden'; } catch {}
        return;
      }

      const pos = getPointerPos(e);
      const rect = overlayEl.getBoundingClientRect();
      const mouseX = pos.clientX - rect.left;
      const mouseY = pos.clientY - rect.top;

      const xRel = mouseX - centerX;
      const yRel = mouseY - centerY;

      if (Math.abs(yRel - innerGuides.top) < hitArea) dragging = 'innerTop';
      else if (Math.abs(yRel - innerGuides.bottom) < hitArea) dragging = 'innerBottom';
      else if (Math.abs(xRel - innerGuides.left) < hitArea) dragging = 'innerLeft';
      else if (Math.abs(xRel - innerGuides.right) < hitArea) dragging = 'innerRight';
      else if (Math.abs(yRel - outerGuides.top) < hitArea) dragging = 'outerTop';
      else if (Math.abs(yRel - outerGuides.bottom) < hitArea) dragging = 'outerBottom';
      else if (Math.abs(xRel - outerGuides.left) < hitArea) dragging = 'outerLeft';
      else if (Math.abs(xRel - outerGuides.right) < hitArea) dragging = 'outerRight';

      if (!dragging) {
        dragging = 'image';
        lastPointerX = pos.clientX;
        lastPointerY = pos.clientY;
        overlayEl.style.cursor = 'grabbing';
      }
      // prevent the page from scrolling while interacting with the canvas
      try { document.body.style.overflow = 'hidden'; } catch {}
      drawOverlay();
    }

    function pointerMove(e: any) {
      if (!dragging) return;
      e.preventDefault();

      if (dragging === 'pinch' && e.touches && e.touches.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scaleChange = currentDistance / (initialPinchDistance || 1);
        let newZoom = initialZoom * scaleChange;
        newZoom = Math.max(0.1, Math.min(newZoom, 3));
        controls.zoom.value = String(newZoom);
        updateTransform();
        return;
      }

      const pos = getPointerPos(e);

      if (dragging === 'image') {
        const dx = pos.clientX - lastPointerX;
        const dy = pos.clientY - lastPointerY;

        controls.panX.value = String(parseInt(controls.panX.value || '0') + dx);
        controls.panY.value = String(parseInt(controls.panY.value || '0') + dy);

        lastPointerX = pos.clientX;
        lastPointerY = pos.clientY;
        updateTransform();
      } else if (dragging !== 'pinch') {
        const rect = overlayEl.getBoundingClientRect();
        const mouseX = pos.clientX - rect.left;
        const mouseY = pos.clientY - rect.top;

        let relY = mouseY - centerY;
        let relX = mouseX - centerX;
        const gap = 10;

        if (dragging === 'innerTop') innerGuides.top = Math.max(outerGuides.top + gap, Math.min(relY, innerGuides.bottom - gap));
        if (dragging === 'innerBottom') innerGuides.bottom = Math.min(outerGuides.bottom - gap, Math.max(relY, innerGuides.top + gap));
        if (dragging === 'innerLeft') innerGuides.left = Math.max(outerGuides.left + gap, Math.min(relX, innerGuides.right - gap));
        if (dragging === 'innerRight') innerGuides.right = Math.min(outerGuides.right - gap, Math.max(relX, innerGuides.left + gap));

        if (dragging === 'outerTop') outerGuides.top = Math.min(relY, innerGuides.top - gap);
        if (dragging === 'outerBottom') outerGuides.bottom = Math.max(relY, innerGuides.bottom + gap);
        if (dragging === 'outerLeft') outerGuides.left = Math.min(relX, innerGuides.left - gap);
        if (dragging === 'outerRight') outerGuides.right = Math.max(relX, innerGuides.right + gap);

        drawOverlay();
      }
    }

    function pointerUp(e: any) {
      if (e && e.touches && e.touches.length === 1 && dragging === 'pinch') {
        dragging = null;
        try { document.body.style.overflow = ''; } catch {}
        return;
      }

      if (!e || !e.touches || e.touches.length === 0) {
        dragging = null;
        overlayEl.style.cursor = 'grab';
        drawOverlay();
        try { document.body.style.overflow = ''; } catch {}
      }
    }

    overlayEl.addEventListener('mousedown', pointerDown as any);
    window.addEventListener('mousemove', pointerMove as any, { passive: false });
    window.addEventListener('mouseup', pointerUp as any);

    overlayEl.addEventListener('touchstart', pointerDown as any, { passive: false });
    window.addEventListener('touchmove', pointerMove as any, { passive: false });
    window.addEventListener('touchend', pointerUp as any);
    window.addEventListener('touchcancel', pointerUp as any);

    // Initialization
    setTimeout(() => {
      resizeCanvas();
      updateTransform();
    }, 60);

    // cleanup
    return () => {
      resetRef.current = null;
      fitRef.current = null;
      window.removeEventListener('resize', resizeCanvas);
      uploadEl.removeEventListener('change', uploadHandler);
      Object.values(controls).forEach((ctrl: any) => ctrl.removeEventListener('input', updateTransform));
      overlayEl.removeEventListener('mousedown', pointerDown as any);
      window.removeEventListener('mousemove', pointerMove as any);
      window.removeEventListener('mouseup', pointerUp as any);
      overlayEl.removeEventListener('touchstart', pointerDown as any);
      window.removeEventListener('touchmove', pointerMove as any);
      window.removeEventListener('touchend', pointerUp as any);
      window.removeEventListener('touchcancel', pointerUp as any);
      try { document.body.style.overflow = ''; } catch {}
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.workspaceContainer} id="workspace">
        <div id="image-wrapper" className={styles.imageWrapper}>
          <img id="card-image" className={styles.cardImage} style={{ display: 'none' }} />
        </div>
        <canvas id="overlay-canvas" className={styles.overlayCanvas}></canvas>
      </div>

      <div className={styles.controlsContainer}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-display font-bold">Visual Centering Analyzer</h2>
            <p className="text-sm text-neutral-400">Quickly check whether an uploaded card image can meet PSA 10 centering.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => resetRef.current?.()}>Reset</Button>
            <Button variant="secondary" size="sm" onClick={() => fitRef.current?.()}>Fit</Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Choose Image</Button>
            <span className={styles.uploadFilename}>{fileName ?? 'No file selected'}</span>
          </div>
          <input type="file" id="upload" ref={fileInputRef} className={styles.hiddenFileInput} accept="image/*" aria-label="Upload card image" />
          <p className={styles.instructions}>
            <b>1.</b> Drag image to Pan / Pinch to Zoom.<br />
            <b>2.</b> Drag <b>Blue Lines</b> to physical card edges.<br />
            <b>3.</b> Drag <b>Red Lines</b> to inner art borders.
          </p>
        </div>

        <div className={styles.controlGroup}>
          <h3 className={styles.sectionTitle}>Image Adjustments</h3>
          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <label htmlFor="zoom">Zoom</label>
              <span id="zoom-val" className={styles.sliderValue}>1.0</span>
            </div>
            <input className={styles.rangeSlider} aria-label="Zoom" type="range" id="zoom" min="0.1" max="3" step="0.01" defaultValue="1" />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <label htmlFor="rotate">Rotation</label>
              <span id="rot-val" className={styles.sliderValue}>0°</span>
            </div>
            <input className={styles.rangeSlider} aria-label="Rotation" type="range" id="rotate" min="-45" max="45" step="0.05" defaultValue="0" />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <label htmlFor="tiltY">H-Tilt (Yaw)</label>
              <span id="tiltY-val" className={styles.sliderValue}>0°</span>
            </div>
            <input className={styles.rangeSlider} aria-label="Horizontal tilt" type="range" id="tiltY" min="-45" max="45" step="0.05" defaultValue="0" />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlHeader}>
              <label htmlFor="tiltX">V-Tilt (Pitch)</label>
              <span id="tiltX-val" className={styles.sliderValue}>0°</span>
            </div>
            <input className={styles.rangeSlider} aria-label="Vertical tilt" type="range" id="tiltX" min="-45" max="45" step="0.05" defaultValue="0" />
          </div>

          <input aria-hidden="true" type="range" id="panX" min="-1500" max="1500" step="1" defaultValue="0" style={{ display: 'none' }} />
          <input aria-hidden="true" type="range" id="panY" min="-1500" max="1500" step="1" defaultValue="0" style={{ display: 'none' }} />
        </div>

        <div className={styles.controlGroup}>
          <h3 className={styles.sectionTitle}>Measurements</h3>
          <div className={styles.resultsBox}>
            L/R: <span id="lr-ratio">50.0 / 50.0</span>
            <br />
            T/B: <span id="tb-ratio">50.0 / 50.0</span>
          </div>
          <div className={styles.legend}>
            <p>
              <span style={{ background: '#2196F3' }}></span> Outer
            </p>
            <p>
              <span style={{ background: '#f44336' }}></span> Inner/Border
            </p>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <h3 className={styles.sectionTitle}>Centering Plot (PSA 10 Zone)</h3>
          <div className={styles.plotContainer}>
            <canvas id="plot-canvas" className={styles.plotCanvas} width={200} height={200}></canvas>
            <div className={styles.plotLegend} aria-hidden>
              <div className={styles.plotLegendItem}><span className={styles.plotSwatch} style={{ background: '#f07a86' }}></span><span>PSA 10</span></div>
              <div className={styles.plotLegendItem}><span className={styles.plotSwatch} style={{ background: '#ff9aa6' }}></span><span>PSA 9</span></div>
              <div className={styles.plotLegendItem}><span className={styles.plotSwatch} style={{ background: '#ffc2cc' }}></span><span>PSA 8</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
