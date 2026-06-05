"use client";
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './card-centering.module.css';

type GradeZone = 'PSA10' | 'PSA9' | 'PSA8' | 'Below';

interface GradeResult {
  overall: GradeZone;
  lr: number; // left percentage
  tb: number; // top percentage
  lrZone: GradeZone;
  tbZone: GradeZone;
}

const ZONE_COLORS: Record<GradeZone, string> = {
  PSA10: '#22c55e',
  PSA9: '#f59e0b',
  PSA8: '#fb923c',
  Below: '#ef4444',
};

const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const UploadIcon = () => (
  <svg {...ICON_PROPS}><path d="M12 16V4" /><path d="m6 10 6-6 6 6" /><path d="M4 20h16" /></svg>
);
const FitIcon = () => (
  <svg {...ICON_PROPS}><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
);
const ResetIcon = () => (
  <svg {...ICON_PROPS}><path d="M3 2v6h6" /><path d="M3.51 15a9 9 0 1 0 .49-9.51L3 8" /></svg>
);
const SlidersIcon = () => (
  <svg {...ICON_PROPS} width={16} height={16}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
);
const ChevronIcon = ({ className }: { className?: string }) => (
  <svg {...ICON_PROPS} className={className}><path d="m6 9 6 6 6-6" /></svg>
);
const ZoomIcon = () => (
  <svg {...ICON_PROPS} width={14} height={14}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);
const RotateIcon = () => (
  <svg {...ICON_PROPS} width={14} height={14}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v5h-5" /></svg>
);
const TiltHIcon = () => (
  <svg {...ICON_PROPS} width={14} height={14}><line x1="2" y1="12" x2="22" y2="12" /><polyline points="6 8 2 12 6 16" /><polyline points="18 8 22 12 18 16" /></svg>
);
const TiltVIcon = () => (
  <svg {...ICON_PROPS} width={14} height={14}><line x1="12" y1="2" x2="12" y2="22" /><polyline points="8 6 12 2 16 6" /><polyline points="8 18 12 22 16 18" /></svg>
);
const MagnifierIcon = () => (
  <svg {...ICON_PROPS}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);

export default function CardCenteringClient() {
  const { t } = useLanguage();
  const tool = t.centeringPage.tool;
  const toolLabelsRef = React.useRef(tool);
  toolLabelsRef.current = tool;

  const resetRef = React.useRef<(() => void) | null>(null);
  const fitRef = React.useRef<(() => void) | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const redrawRef = React.useRef<(() => void) | null>(null);
  const loupesOnRef = React.useRef(true);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [grade, setGrade] = React.useState<GradeResult | null>(null);
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [loupesOn, setLoupesOn] = React.useState(true);
  const [guideMode, setGuideMode] = React.useState<'edge' | 'border' | 'both'>('both');
  const guideModeRef = React.useRef(guideMode);

  useEffect(() => {
    loupesOnRef.current = loupesOn;
    redrawRef.current?.();
  }, [loupesOn]);

  useEffect(() => {
    guideModeRef.current = guideMode;
    redrawRef.current?.();
  }, [guideMode]);

  useEffect(() => {
    redrawRef.current?.();
  }, [t]);

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

    // Corner magnifier ("loupe") canvases — may be absent in older markup
    const loupeEls: Record<'tl' | 'tr' | 'bl' | 'br', HTMLCanvasElement | null> = {
      tl: document.getElementById('loupe-tl') as HTMLCanvasElement | null,
      tr: document.getElementById('loupe-tr') as HTMLCanvasElement | null,
      bl: document.getElementById('loupe-bl') as HTMLCanvasElement | null,
      br: document.getElementById('loupe-br') as HTMLCanvasElement | null,
    };
    let loupeMag = 2.6;
    let loupeDrag: string | null = null;
    // Shared reference ring radius (in card-base px), comparable across all four corners.
    // 0 = no reference ring set (concentric measurement rings are always shown).
    let refRadius = 0;

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
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    let initialPinchDistance: number | null = null;
    let initialZoom = 1;

    let overlayRaf = 0;
    let gradeRaf = 0;
    let pendingGrade: GradeResult | null = null;
    const handleDisplay: Record<string, { x: number; y: number }> = {};
    const HANDLE_SLIDE = 0.18;
    const HANDLE_SNAP_PX = 0.45;

    const isCoarsePointer = typeof window !== 'undefined' && (window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : ('ontouchstart' in window));
    const handleRadius = isCoarsePointer ? 54 : 46;

    // Pull colors from the site's style guide CSS variables when available
    const rootStyles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    // Outer = physical card edge (blue), Inner = design/art border (brand pink), Active = high-vis yellow
    const colorOuter = '#3b82f6';
    const colorInner = (rootStyles?.getPropertyValue('--color-primary-500') || '#f07a86').trim();
    const colorOuterFill = 'rgba(59, 130, 246, 0.07)';

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
      fillTrack(controls.zoom);
      fillTrack(controls.rotate);
      fillTrack(controls.tiltX);
      fillTrack(controls.tiltY);
      drawOverlay();
    }

    function fillTrack(el: HTMLInputElement) {
      if (!el) return;
      const min = parseFloat(el.min || '0');
      const max = parseFloat(el.max || '100');
      const val = parseFloat(el.value || '0');
      const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
      el.style.background = `linear-gradient(90deg, var(--color-primary-500, #f07a86) ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
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

      refRadius = 0;
      loupeMag = 2.6;

      for (const key of Object.keys(handleDisplay)) delete handleDisplay[key];

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
    redrawRef.current = () => drawOverlay();

    Object.values(controls).forEach((ctrl: any) => ctrl.addEventListener('input', updateTransform));

    function smoothstep(t: number) {
      const x = Math.max(0, Math.min(1, t));
      return x * x * (3 - 2 * x);
    }

    function staggerMix(gapPx: number, closeGap: number) {
      const start = closeGap * 1.35;
      const t = 1 - Math.max(0, Math.min(1, gapPx / start));
      return smoothstep(t);
    }

    function scheduleDrawOverlay() {
      if (overlayRaf) return;
      overlayRaf = requestAnimationFrame(() => {
        overlayRaf = 0;
        drawOverlay();
      });
    }

    function flushGrade() {
      gradeRaf = 0;
      if (pendingGrade) {
        setGrade(pendingGrade);
        pendingGrade = null;
      }
    }

    function scheduleGrade(result: GradeResult) {
      pendingGrade = result;
      if (!gradeRaf) gradeRaf = requestAnimationFrame(flushGrade);
    }

    function captureDragOffset(name: string, mouseX: number, mouseY: number) {
      dragOffsetX = 0;
      dragOffsetY = 0;
      const oyT = centerY + outerGuides.top;
      const oyB = centerY + outerGuides.bottom;
      const oxL = centerX + outerGuides.left;
      const oxR = centerX + outerGuides.right;
      const iyT = centerY + innerGuides.top;
      const iyB = centerY + innerGuides.bottom;
      const ixL = centerX + innerGuides.left;
      const ixR = centerX + innerGuides.right;

      switch (name) {
        case 'outerTop': dragOffsetY = mouseY - oyT; break;
        case 'outerBottom': dragOffsetY = mouseY - oyB; break;
        case 'innerTop': dragOffsetY = mouseY - iyT; break;
        case 'innerBottom': dragOffsetY = mouseY - iyB; break;
        case 'outerLeft': dragOffsetX = mouseX - oxL; break;
        case 'outerRight': dragOffsetX = mouseX - oxR; break;
        case 'innerLeft': dragOffsetX = mouseX - ixL; break;
        case 'innerRight': dragOffsetX = mouseX - ixR; break;
      }
    }

    function isGuideDrag() {
      return dragging !== null && dragging !== 'image' && dragging !== 'pinch';
    }

    function drawOverlay() {
      ctx.clearRect(0, 0, overlayEl.width, overlayEl.height);

      // --- Background: fine grey alignment grid ---
      const grid = 34;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let x = centerX % grid; x < overlayEl.width; x += grid) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, overlayEl.height);
      }
      for (let y = centerY % grid; y < overlayEl.height; y += grid) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(overlayEl.width, y + 0.5);
      }
      ctx.stroke();
      ctx.restore();

      // Tiled diagonal "Appaw Store" watermark
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-Math.PI / 10);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.font = '700 20px Inter, ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const wmSpan = Math.max(overlayEl.width, overlayEl.height);
      for (let gx = -wmSpan; gx <= wmSpan; gx += 230) {
        for (let gy = -wmSpan; gy <= wmSpan; gy += 130) {
          ctx.fillText('Appaw Store', gx, gy);
        }
      }
      ctx.restore();

      // Quarter guides (25% / 75%)
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      [overlayEl.width * 0.25, overlayEl.width * 0.75].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, overlayEl.height);
        ctx.stroke();
      });
      [overlayEl.height * 0.25, overlayEl.height * 0.75].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(overlayEl.width, y);
        ctx.stroke();
      });
      ctx.restore();

      // Strong center cross
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, overlayEl.height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(overlayEl.width, centerY);
      ctx.stroke();
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

      const mode = guideModeRef.current;
      const outerAlpha = mode === 'border' ? 0.32 : 1;
      const innerAlpha = mode === 'edge' ? 0.32 : 1;

      // Tinted margin band between card edge and art border
      ctx.save();
      ctx.globalAlpha = Math.max(outerAlpha, innerAlpha) * 0.9;
      ctx.beginPath();
      roundRectPath(oxL, oyT, oxW, oxH, Math.min(10, oxW * 0.022, oxH * 0.016));
      roundRectPath(ixL, iyT, ixR - ixL, iyB - iyT, Math.min(8, (ixR - ixL) * 0.02, (iyB - iyT) * 0.016));
      ctx.fillStyle = colorOuterFill;
      try { ctx.fill('evenodd'); } catch { ctx.fill(); }
      ctx.restore();

      // Card edge (outer) — rounded glow frame
      drawModernFrame(oxL, oyT, oxW, oxH, colorOuter, outerAlpha, mode === 'edge' || mode === 'both');

      // Art border (inner) — rounded glow frame
      drawModernFrame(ixL, iyT, ixR - ixL, iyB - iyT, colorInner, innerAlpha, mode === 'border' || mode === 'both');

      // Identification labels (only for active layers)
      if (mode === 'edge' || mode === 'both') drawLabel(oxL, oyT, toolLabelsRef.current.canvasEdge, colorOuter);
      if (mode === 'border' || mode === 'both') drawLabel(ixL, iyT, toolLabelsRef.current.canvasBorder, colorInner);

      // Draggable handles — slide smoothly when stagger position changes
      resolveHandles().forEach((h) => {
        const isOuter = h.name.startsWith('outer');
        const color = isOuter ? colorOuter : colorInner;
        const active = dragging === h.name;
        if (active) drawActiveEdgeHighlight(h.name, color);
        drawHandle(h.x, h.y, h.anchorX, h.anchorY, color, active, h.vertical);
      });

      drawLoupes();
      calculateCentering();
    }

    function roundRectPath(x: number, y: number, w: number, h: number, r: number) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    function drawModernFrame(x: number, y: number, w: number, h: number, color: string, alpha: number, emphasized: boolean) {
      if (w < 4 || h < 4) return;
      const radius = Math.min(10, w * 0.022, h * 0.016);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Soft color glow
      ctx.shadowColor = color;
      ctx.shadowBlur = emphasized ? 20 : 12;
      ctx.strokeStyle = color;
      ctx.lineWidth = emphasized ? 1.75 : 1.25;
      roundRectPath(x, y, w, h, radius);
      ctx.stroke();

      // Hairline highlight for depth
      ctx.shadowBlur = 0;
      ctx.globalAlpha = alpha * 0.3;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      roundRectPath(x + 0.5, y + 0.5, Math.max(0, w - 1), Math.max(0, h - 1), Math.max(0, radius - 0.5));
      ctx.stroke();

      ctx.restore();
    }

    function drawActiveEdgeHighlight(name: string, color: string) {
      const oxL = centerX + outerGuides.left;
      const oxR = centerX + outerGuides.right;
      const oyT = centerY + outerGuides.top;
      const oyB = centerY + outerGuides.bottom;
      const ixL = centerX + innerGuides.left;
      const ixR = centerX + innerGuides.right;
      const iyT = centerY + innerGuides.top;
      const iyB = centerY + innerGuides.bottom;

      let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      const span = 72;

      switch (name) {
        case 'outerTop': x1 = (oxL + oxR) / 2 - span; y1 = oyT; x2 = (oxL + oxR) / 2 + span; y2 = oyT; break;
        case 'outerBottom': x1 = (oxL + oxR) / 2 - span; y1 = oyB; x2 = (oxL + oxR) / 2 + span; y2 = oyB; break;
        case 'outerLeft': x1 = oxL; y1 = (oyT + oyB) / 2 - span; x2 = oxL; y2 = (oyT + oyB) / 2 + span; break;
        case 'outerRight': x1 = oxR; y1 = (oyT + oyB) / 2 - span; x2 = oxR; y2 = (oyT + oyB) / 2 + span; break;
        case 'innerTop': x1 = (ixL + ixR) / 2 - span; y1 = iyT; x2 = (ixL + ixR) / 2 + span; y2 = iyT; break;
        case 'innerBottom': x1 = (ixL + ixR) / 2 - span; y1 = iyB; x2 = (ixL + ixR) / 2 + span; y2 = iyB; break;
        case 'innerLeft': x1 = ixL; y1 = (iyT + iyB) / 2 - span; x2 = ixL; y2 = (iyT + iyB) / 2 + span; break;
        case 'innerRight': x1 = ixR; y1 = (iyT + iyB) / 2 - span; x2 = ixR; y2 = (iyT + iyB) / 2 + span; break;
        default: return;
      }

      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    function drawLabel(x: number, y: number, text: string, color: string) {
      ctx.save();
      ctx.font = '600 10px Inter, ui-sans-serif, system-ui, sans-serif';
      const dotR = 3;
      const gap = 6;
      const padX = 8;
      const tw = ctx.measureText(text).width;
      const w = tw + padX * 2 + dotR * 2 + gap;
      const h = 18;
      const ly = y - h - 7;

      roundRectPath(x, ly, w, h, 9);
      ctx.fillStyle = 'rgba(11, 12, 13, 0.78)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + padX + dotR, ly + h / 2, dotR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, x + padX + dotR * 2 + gap, ly + h / 2 + 0.5);
      ctx.restore();
    }

    function drawHandle(
      px: number,
      py: number,
      anchorX: number,
      anchorY: number,
      color: string,
      active: boolean,
      vertical: boolean,
    ) {
      const outerR = active ? (isCoarsePointer ? 16 : 14) : (isCoarsePointer ? 14 : 12);
      const innerR = outerR - 3;
      const stemLen = Math.hypot(px - anchorX, py - anchorY);

      ctx.save();

      // Connector stem from guide line to handle
      if (stemLen > 3) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = active ? 0.75 : 0.4;
        ctx.lineWidth = active ? 2 : 1.25;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      ctx.shadowColor = color;
      ctx.shadowBlur = active ? 20 : 10;

      // Glass halo
      ctx.beginPath();
      ctx.arc(px, py, outerR + 4, 0, Math.PI * 2);
      ctx.fillStyle = active ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.07)';
      ctx.globalAlpha = 1;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(px, py, outerR, 0, Math.PI * 2);
      ctx.fillStyle = active ? color : 'rgba(11, 12, 13, 0.82)';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = active ? 2.5 : 2;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Grip marks
      ctx.strokeStyle = active ? 'rgba(255, 255, 255, 0.95)' : color;
      ctx.lineWidth = 1.35;
      ctx.lineCap = 'round';
      const grip = innerR * 0.45;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        if (vertical) {
          ctx.moveTo(px, py + i * grip - grip * 0.35);
          ctx.lineTo(px, py + i * grip + grip * 0.35);
        } else {
          ctx.moveTo(px + i * grip - grip * 0.35, py);
          ctx.lineTo(px + i * grip + grip * 0.35, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    type HandleDef = { name: string; x: number; y: number; anchorX: number; anchorY: number; vertical: boolean };

    function computeHandleTargets(): HandleDef[] {
      const mode = guideModeRef.current;
      const both = mode === 'both';
      const showOuter = mode === 'edge' || both;
      const showInner = mode === 'border' || both;

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
      const ixW = ixR - ixL;
      const ixH = iyB - iyT;

      const list: HandleDef[] = [];
      const perpOff = isCoarsePointer ? 24 : 20;
      const closeGap = isCoarsePointer ? 58 : 46;

      const place = (
        name: string,
        anchorX: number,
        anchorY: number,
        vertical: boolean,
        normal: { x: number; y: number },
        mix: number,
      ) => {
        const p = perpOff * mix;
        const x = both ? anchorX + normal.x * p : anchorX;
        const y = both ? anchorY + normal.y * p : anchorY;
        list.push({ name, x, y, anchorX, anchorY, vertical });
      };

      const topMix = both ? staggerMix(Math.abs(iyT - oyT), closeGap) : 0;
      const bottomMix = both ? staggerMix(Math.abs(iyB - oyB), closeGap) : 0;
      const leftMix = both ? staggerMix(Math.abs(ixL - oxL), closeGap) : 0;
      const rightMix = both ? staggerMix(Math.abs(ixR - oxR), closeGap) : 0;

      // Top — outer sits above, inner below; stagger blends in smoothly when close
      if (showOuter) {
        const ratio = 0.5 + (0.36 - 0.5) * topMix;
        place('outerTop', oxL + oxW * ratio, oyT, false, { x: 0, y: -1 }, topMix);
      }
      if (showInner) {
        const ratio = 0.5 + (0.64 - 0.5) * topMix;
        place('innerTop', ixL + ixW * ratio, iyT, false, { x: 0, y: 1 }, topMix);
      }

      // Bottom — outer below, inner above
      if (showOuter) {
        const ratio = 0.5 + (0.36 - 0.5) * bottomMix;
        place('outerBottom', oxL + oxW * ratio, oyB, false, { x: 0, y: 1 }, bottomMix);
      }
      if (showInner) {
        const ratio = 0.5 + (0.64 - 0.5) * bottomMix;
        place('innerBottom', ixL + ixW * ratio, iyB, false, { x: 0, y: -1 }, bottomMix);
      }

      // Left — outer left, inner right
      if (showOuter) {
        const ratio = 0.5 + (0.36 - 0.5) * leftMix;
        place('outerLeft', oxL, oyT + oxH * ratio, true, { x: -1, y: 0 }, leftMix);
      }
      if (showInner) {
        const ratio = 0.5 + (0.64 - 0.5) * leftMix;
        place('innerLeft', ixL, iyT + ixH * ratio, true, { x: 1, y: 0 }, leftMix);
      }

      // Right — outer right, inner left
      if (showOuter) {
        const ratio = 0.5 + (0.36 - 0.5) * rightMix;
        place('outerRight', oxR, oyT + oxH * ratio, true, { x: 1, y: 0 }, rightMix);
      }
      if (showInner) {
        const ratio = 0.5 + (0.64 - 0.5) * rightMix;
        place('innerRight', ixR, iyT + ixH * ratio, true, { x: -1, y: 0 }, rightMix);
      }

      return list;
    }

    function resolveHandles(): HandleDef[] {
      const targets = computeHandleTargets();
      let animating = false;

      for (const t of targets) {
        const prev = handleDisplay[t.name];
        if (!prev) {
          handleDisplay[t.name] = { x: t.x, y: t.y };
          continue;
        }

        // Handle being dragged tracks its target immediately
        if (dragging === t.name) {
          handleDisplay[t.name] = { x: t.x, y: t.y };
          continue;
        }

        const dx = t.x - prev.x;
        const dy = t.y - prev.y;
        if (Math.hypot(dx, dy) > HANDLE_SNAP_PX) {
          handleDisplay[t.name] = {
            x: prev.x + dx * HANDLE_SLIDE,
            y: prev.y + dy * HANDLE_SLIDE,
          };
          animating = true;
        } else {
          handleDisplay[t.name] = { x: t.x, y: t.y };
        }
      }

      for (const key of Object.keys(handleDisplay)) {
        if (!targets.some((t) => t.name === key)) delete handleDisplay[key];
      }

      if (animating && !overlayRaf) scheduleDrawOverlay();

      return targets.map((t) => {
        const d = handleDisplay[t.name];
        return { ...t, x: d?.x ?? t.x, y: d?.y ?? t.y };
      });
    }

    function pickHandleAt(mouseX: number, mouseY: number): string | null {
      let best: { name: string; dist: number } | null = null;
      for (const h of resolveHandles()) {
        const dist = Math.hypot(mouseX - h.x, mouseY - h.y);
        if (dist > handleRadius) continue;
        // Prefer the handle whose anchor is closer when two overlap
        const anchorDist = Math.hypot(mouseX - h.anchorX, mouseY - h.anchorY);
        const score = dist + anchorDist * 0.15;
        if (!best || score < best.dist) best = { name: h.name, dist: score };
      }
      return best?.name ?? null;
    }

    // ---------- Corner magnifiers (loupes) ----------
    function loupeCorner(key: string) {
      switch (key) {
        case 'tl': return { x: centerX + outerGuides.left, y: centerY + outerGuides.top };
        case 'tr': return { x: centerX + outerGuides.right, y: centerY + outerGuides.top };
        case 'bl': return { x: centerX + outerGuides.left, y: centerY + outerGuides.bottom };
        default: return { x: centerX + outerGuides.right, y: centerY + outerGuides.bottom };
      }
    }

    function loupeChip(lctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, color: string) {
      lctx.save();
      lctx.font = '700 9px Inter, ui-sans-serif, system-ui, sans-serif';
      const tw = lctx.measureText(text).width;
      const w = tw + 10;
      const h = 15;
      const x = cx - w / 2;
      const y = cy - h / 2;
      const rr = 5;
      lctx.beginPath();
      lctx.moveTo(x + rr, y);
      lctx.arcTo(x + w, y, x + w, y + h, rr);
      lctx.arcTo(x + w, y + h, x, y + h, rr);
      lctx.arcTo(x, y + h, x, y, rr);
      lctx.arcTo(x, y, x + w, y, rr);
      lctx.closePath();
      lctx.fillStyle = 'rgba(0,0,0,0.62)';
      lctx.fill();
      lctx.fillStyle = color;
      lctx.textAlign = 'center';
      lctx.textBaseline = 'middle';
      lctx.fillText(text, cx, cy + 0.5);
      lctx.restore();
    }

    function drawLoupes() {
      if (!loupesOnRef.current) return;

      // Read the live transform once — shared by every loupe this frame.
      const z = parseFloat(controls.zoom.value) || 1;
      const rz = ((parseFloat(controls.rotate.value) || 0) * Math.PI) / 180;
      // Same effective 3D angles the wrapper uses (see updateTransform).
      const ax = ((parseFloat(controls.tiltX.value) || 0) * Math.PI) / 180;
      const ay = ((-(parseFloat(controls.tiltY.value) || 0)) * Math.PI) / 180;
      const px = parseInt(controls.panX.value || '0');
      const py = parseInt(controls.panY.value || '0');
      const persp = 1000; // matches `perspective: 1000px` on the workspace container

      // Project a base-image point (relative to the image centre, in CSS px)
      // to overlay/screen coords, replicating the CSS perspective transform.
      const project = (bx: number, by: number) => {
        let x = bx, y = by, zc = 0;
        // rotateY(ay)
        let nx = x * Math.cos(ay) + zc * Math.sin(ay);
        let nz = -x * Math.sin(ay) + zc * Math.cos(ay);
        x = nx; zc = nz;
        // rotateX(ax)
        let ny = y * Math.cos(ax) - zc * Math.sin(ax);
        nz = y * Math.sin(ax) + zc * Math.cos(ax);
        y = ny; zc = nz;
        // rotateZ(rz)
        nx = x * Math.cos(rz) - y * Math.sin(rz);
        ny = x * Math.sin(rz) + y * Math.cos(rz);
        x = nx; y = ny;
        // scale(z)
        x *= z; y *= z;
        // translate(px,py)
        x += px; y += py;
        // perspective divide
        const s = persp / (persp - zc);
        return { x: centerX + x * s, y: centerY + y * s };
      };

      (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
        const el = loupeEls[key];
        if (!el) return;
        const size = el.clientWidth;
        if (size < 8) return;
        const dpr = window.devicePixelRatio || 1;
        const target = Math.round(size * dpr);
        if (el.width !== target) { el.width = target; el.height = target; }
        const lctx = el.getContext('2d');
        if (!lctx) return;
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.clearRect(0, 0, size, size);
        const R = size / 2;
        const m = loupeMag;

        lctx.save();
        lctx.beginPath();
        lctx.arc(R, R, R, 0, Math.PI * 2);
        lctx.clip();
        lctx.fillStyle = '#0b0c0d';
        lctx.fillRect(0, 0, size, size);

        const S = loupeCorner(key);

        if (imgEl.src && imgEl.complete && imgEl.naturalWidth > 0) {
          const bw = imgEl.offsetWidth || imgEl.naturalWidth;
          const bh = imgEl.offsetHeight || imgEl.naturalHeight;

          // Linearise the (perspective) projection about the image centre…
          const O = project(0, 0);
          const Ux = project(1, 0);
          const Uy = project(0, 1);
          const lx = { x: Ux.x - O.x, y: Ux.y - O.y };
          const ly = { x: Uy.x - O.x, y: Uy.y - O.y };
          const det = lx.x * ly.y - ly.x * lx.y;
          // …then refine the linearisation around the base point that maps to S
          // so the magnified area stays correct under tilt at every corner.
          let aa = lx.x, ab = lx.y, ac = ly.x, ad = ly.y;
          let t0x = O.x, t0y = O.y;
          if (Math.abs(det) > 1e-6) {
            const inv = 1 / det;
            const sx = S.x - O.x, sy = S.y - O.y;
            const p0x = (ly.y * sx - ly.x * sy) * inv;
            const p0y = (-lx.y * sx + lx.x * sy) * inv;
            const e = 0.5;
            const Px = project(p0x, p0y);
            const Jx1 = project(p0x + e, p0y), Jx0 = project(p0x - e, p0y);
            const Jy1 = project(p0x, p0y + e), Jy0 = project(p0x, p0y - e);
            aa = (Jx1.x - Jx0.x) / (2 * e); ab = (Jx1.y - Jx0.y) / (2 * e);
            ac = (Jy1.x - Jy0.x) / (2 * e); ad = (Jy1.y - Jy0.y) / (2 * e);
            t0x = Px.x - (aa * p0x + ac * p0y);
            t0y = Px.y - (ab * p0x + ad * p0y);
          }

          lctx.save();
          // loupePixel = R + (screen - S) * m, with screen = (t0) + J * base
          lctx.setTransform(dpr, 0, 0, dpr, dpr * (R + (t0x - S.x) * m), dpr * (R + (t0y - S.y) * m));
          lctx.transform(aa * m, ab * m, ac * m, ad * m, 0, 0);
          lctx.drawImage(imgEl, -bw / 2, -bh / 2, bw, bh);
          lctx.restore();
        } else {
          lctx.fillStyle = 'rgba(255,255,255,0.25)';
          lctx.font = '600 11px Inter, ui-sans-serif, system-ui, sans-serif';
          lctx.textAlign = 'center';
          lctx.textBaseline = 'middle';
          lctx.fillText(toolLabelsRef.current.noImage, R, R);
        }

        // Edge guide cross (axis-aligned) anchored at the loupe centre = card corner
        lctx.save();
        lctx.strokeStyle = colorOuter;
        lctx.globalAlpha = 0.7;
        lctx.lineWidth = 1.25;
        lctx.setLineDash([]);
        lctx.beginPath();
        lctx.moveTo(0, R); lctx.lineTo(size, R);
        lctx.moveTo(R, 0); lctx.lineTo(R, size);
        lctx.stroke();
        lctx.restore();

        // ----- Shared concentric reference target (identical scale in all 4 loupes) -----
        // base px -> loupe px. Same for every corner, so rings are directly comparable.
        const baseToLoupe = m * z;
        const visibleBase = R / baseToLoupe;
        const niceSteps = [1, 2, 5, 10, 20, 50, 100, 200];
        const ringStep = niceSteps.find((s) => s * baseToLoupe >= 16) ?? 200;

        lctx.save();
        lctx.translate(R, R);
        lctx.strokeStyle = 'rgba(255,255,255,0.16)';
        lctx.lineWidth = 1;
        lctx.setLineDash([2, 3]);
        for (let k = 1; k * ringStep <= visibleBase + ringStep; k++) {
          const rr = k * ringStep * baseToLoupe;
          if (rr > R) break;
          lctx.beginPath();
          lctx.arc(0, 0, rr, 0, Math.PI * 2);
          lctx.stroke();
        }
        lctx.setLineDash([]);
        // centre dot = corner tip
        lctx.fillStyle = '#fde047';
        lctx.beginPath();
        lctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        lctx.fill();
        // shared adjustable reference ring
        if (refRadius > 0) {
          const rr = refRadius * baseToLoupe;
          lctx.strokeStyle = '#fde047';
          lctx.lineWidth = 1.75;
          lctx.beginPath();
          lctx.arc(0, 0, rr, 0, Math.PI * 2);
          lctx.stroke();
        }
        lctx.restore();

        lctx.restore(); // end clip

        // Rim
        lctx.save();
        lctx.strokeStyle = 'rgba(255,255,255,0.18)';
        lctx.lineWidth = 2;
        lctx.beginPath();
        lctx.arc(R, R, R - 1, 0, Math.PI * 2);
        lctx.stroke();
        lctx.restore();

        // Labels
        loupeChip(lctx, key.toUpperCase(), 16, 12, '#bfdbfe');
        if (refRadius > 0) {
          loupeChip(lctx, `ref ${Math.round(refRadius)}px`, R, size - 11, '#fde047');
        } else {
          loupeChip(lctx, `\u25CB ${ringStep}px`, R, size - 11, '#9ca3af');
        }
        if (key === 'tl') loupeChip(lctx, `${loupeMag.toFixed(1)}\u00d7`, size - 18, 12, '#e5e7eb');
      });
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

      // Axis-aligned PSA thresholds (percent ranges)
      const PSA = {
        PSA10: { min: 45, max: 55 },
        PSA9: { min: 40, max: 60 },
        PSA8: { min: 35, max: 65 },
      };

      function axisZone(percent: number): GradeZone {
        if (percent >= PSA.PSA10.min && percent <= PSA.PSA10.max) return 'PSA10';
        if (percent >= PSA.PSA9.min && percent <= PSA.PSA9.max) return 'PSA9';
        if (percent >= PSA.PSA8.min && percent <= PSA.PSA8.max) return 'PSA8';
        return 'Below';
      }

      const lrZone = axisZone(lrPercentL);
      const tbZone = axisZone(tbPercentT);

      // Combined zone: the stricter (worst) axis determines the overall grade
      let overallZone: GradeZone = 'Below';
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

      const result: GradeResult = {
        overall: overallZone,
        lr: lrPercentL,
        tb: tbPercentT,
        lrZone,
        tbZone,
      };

      if (isGuideDrag()) scheduleGrade(result);
      else setGrade(result);

      drawPlot(lrPercentL, tbPercentT, overallZone);
    }

    function drawPlot(lr: number, tb: number, overallZone: string) {
      // Hi-DPI support
      const dpr = window.devicePixelRatio || 1;
      const rect = plotCanvasEl.getBoundingClientRect();
      const cw = rect.width || plotCanvasEl.clientWidth;
      const ch = rect.height || plotCanvasEl.clientHeight;
      if (cw < 8 || ch < 8) return;
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
      const plotLabels = toolLabelsRef.current.plotLabels;
      let zoneLabel = overallZone === 'PSA10' ? plotLabels.PSA10 : overallZone === 'PSA9' ? plotLabels.PSA9 : overallZone === 'PSA8' ? plotLabels.PSA8 : plotLabels.below;

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

      // Label (top-right) — zone only; L/R T/B shown in grade pill
      plotCtx.fillStyle = 'rgba(255,255,255,0.95)';
      plotCtx.font = '12px Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue"';
      plotCtx.textAlign = 'right';
      plotCtx.fillText(`${zoneLabel}`, cw - 8, 16);
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

      const handleHit = pickHandleAt(mouseX, mouseY);
      if (handleHit) {
        dragging = handleHit;
        captureDragOffset(handleHit, mouseX, mouseY);
      }

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

        let relY = mouseY - centerY - dragOffsetY;
        let relX = mouseX - centerX - dragOffsetX;
        const gap = 10;

        if (dragging === 'innerTop') innerGuides.top = Math.max(outerGuides.top + gap, Math.min(relY, innerGuides.bottom - gap));
        if (dragging === 'innerBottom') innerGuides.bottom = Math.min(outerGuides.bottom - gap, Math.max(relY, innerGuides.top + gap));
        if (dragging === 'innerLeft') innerGuides.left = Math.max(outerGuides.left + gap, Math.min(relX, innerGuides.right - gap));
        if (dragging === 'innerRight') innerGuides.right = Math.min(outerGuides.right - gap, Math.max(relX, innerGuides.left + gap));

        if (dragging === 'outerTop') outerGuides.top = Math.min(relY, innerGuides.top - gap);
        if (dragging === 'outerBottom') outerGuides.bottom = Math.max(relY, innerGuides.bottom + gap);
        if (dragging === 'outerLeft') outerGuides.left = Math.min(relX, innerGuides.left - gap);
        if (dragging === 'outerRight') outerGuides.right = Math.max(relX, innerGuides.right + gap);

        scheduleDrawOverlay();
      }
    }

    function pointerUp(e: any) {
      if (e && e.touches && e.touches.length === 1 && dragging === 'pinch') {
        dragging = null;
        try { document.body.style.overflow = ''; } catch {}
        return;
      }

      if (!e || !e.touches || e.touches.length === 0) {
        dragOffsetX = 0;
        dragOffsetY = 0;
        dragging = null;
        overlayEl.style.cursor = 'grab';
        flushGrade();
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

    // --- Loupe reference-ring interaction ---
    function setRefFromEvent(key: string, e: any) {
      const el = loupeEls[key as 'tl' | 'tr' | 'bl' | 'br'];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pos = getPointerPos(e);
      const size = el.clientWidth;
      const lx = pos.clientX - rect.left - size / 2;
      const ly = pos.clientY - rect.top - size / 2;
      const z = parseFloat(controls.zoom.value) || 1;
      const baseToLoupe = loupeMag * z;
      // distance from corner tip (loupe centre) in card-base px — shared by all loupes
      refRadius = Math.max(0, Math.hypot(lx, ly) / baseToLoupe);
      drawLoupes();
    }
    const loupeBindings: Array<{ el: HTMLCanvasElement; type: string; fn: any }> = [];
    (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
      const el = loupeEls[key];
      if (!el) return;
      const down = (e: any) => { e.preventDefault(); e.stopPropagation(); loupeDrag = key; setRefFromEvent(key, e); };
      const dbl = () => { refRadius = 0; drawLoupes(); };
      const wheel = (e: any) => {
        e.preventDefault();
        const dir = e.deltaY > 0 ? -1 : 1;
        loupeMag = Math.min(5, Math.max(1.5, +(loupeMag + dir * 0.2).toFixed(2)));
        drawLoupes();
      };
      el.addEventListener('mousedown', down);
      el.addEventListener('touchstart', down, { passive: false } as any);
      el.addEventListener('dblclick', dbl);
      el.addEventListener('wheel', wheel, { passive: false } as any);
      loupeBindings.push({ el, type: 'mousedown', fn: down });
      loupeBindings.push({ el, type: 'touchstart', fn: down });
      loupeBindings.push({ el, type: 'dblclick', fn: dbl });
      loupeBindings.push({ el, type: 'wheel', fn: wheel });
    });
    const loupeMoveGlobal = (e: any) => { if (!loupeDrag) return; e.preventDefault(); setRefFromEvent(loupeDrag, e); };
    const loupeUpGlobal = () => { loupeDrag = null; };
    window.addEventListener('mousemove', loupeMoveGlobal, { passive: false });
    window.addEventListener('mouseup', loupeUpGlobal);
    window.addEventListener('touchmove', loupeMoveGlobal, { passive: false });
    window.addEventListener('touchend', loupeUpGlobal);

    // Initialization
    setTimeout(() => {
      resizeCanvas();
      updateTransform();
    }, 60);

    // cleanup
    return () => {
      if (overlayRaf) cancelAnimationFrame(overlayRaf);
      if (gradeRaf) cancelAnimationFrame(gradeRaf);
      resetRef.current = null;
      fitRef.current = null;
      redrawRef.current = null;
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
      loupeBindings.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      window.removeEventListener('mousemove', loupeMoveGlobal as any);
      window.removeEventListener('mouseup', loupeUpGlobal);
      window.removeEventListener('touchmove', loupeMoveGlobal as any);
      window.removeEventListener('touchend', loupeUpGlobal);
      try { document.body.style.overflow = ''; } catch {}
    };
  }, []);

  const zone = grade?.overall ?? null;
  const zoneCopy = zone ? tool.zones[zone] : null;
  const zoneMeta = zone ? { ...zoneCopy!, color: ZONE_COLORS[zone] } : null;
  const fmt = (n?: number) => (typeof n === 'number' ? n.toFixed(1) : '—');

  return (
    <div className={styles.wrapper}>
      <div className={styles.workspaceContainer} id="workspace">
        <div id="image-wrapper" className={styles.imageWrapper}>
          <img id="card-image" className={styles.cardImage} alt="" style={{ display: 'none' }} />
        </div>
        <canvas id="overlay-canvas" className={styles.overlayCanvas}></canvas>

        {/* Corner magnifiers */}
        <canvas id="loupe-tl" width={116} height={116} className={`${styles.loupe} ${styles.loupeTL} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-tr" width={116} height={116} className={`${styles.loupe} ${styles.loupeTR} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-bl" width={116} height={116} className={`${styles.loupe} ${styles.loupeBL} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-br" width={116} height={116} className={`${styles.loupe} ${styles.loupeBR} ${loupesOn ? '' : styles.loupeHidden}`} />

        {!fileName && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎴</div>
            <p className={styles.emptyTitle}>{tool.emptyTitle}</p>
            <button className={styles.emptyBtn} onClick={() => fileInputRef.current?.click()}>{tool.chooseImage}</button>
          </div>
        )}

        {/* Floating top bar: grade (center) + actions (right) */}
        <div className={styles.topBar}>
          <div
            className={styles.gradePill}
            style={{ ['--zone-color' as any]: zoneMeta?.color ?? 'rgba(148,163,184,0.7)' }}
          >
            <div className={styles.gradePillMain}>
              <span className={styles.gradePillLabel}>{zoneMeta?.label ?? '—'}</span>
              <span className={styles.gradePillSub}>{zoneMeta?.short ?? tool.alignGuides}</span>
            </div>
            <div className={styles.gradePillRatios}>
              <span data-status={grade?.lrZone}>{tool.lrLabel} {fmt(grade?.lr)}/{fmt(grade ? 100 - grade.lr : undefined)}</span>
              <span data-status={grade?.tbZone}>{tool.tbLabel} {fmt(grade?.tb)}/{fmt(grade ? 100 - grade.tb : undefined)}</span>
            </div>
          </div>

          <div className={styles.topActions}>
            <button className={`${styles.iconBtn} ${loupesOn ? styles.iconBtnOn : ''}`} title={tool.cornerMagnifiers} aria-label={tool.cornerMagnifiersToggle} aria-pressed={loupesOn} onClick={() => setLoupesOn((v) => !v)}><MagnifierIcon /></button>
            <button className={styles.iconBtn} title={tool.uploadImage} aria-label={tool.uploadImage} onClick={() => fileInputRef.current?.click()}><UploadIcon /></button>
            <button className={styles.iconBtn} title={tool.fitToView} aria-label={tool.fitToView} onClick={() => fitRef.current?.()}><FitIcon /></button>
            <button className={styles.iconBtn} title={tool.reset} aria-label={tool.reset} onClick={() => resetRef.current?.()}><ResetIcon /></button>
          </div>
        </div>

        {/* Guide layer switcher — focus on edge or border one at a time */}
        <div className={styles.guideModeBar} role="toolbar" aria-label={tool.guideModeLabel}>
          {(['edge', 'border', 'both'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={styles.guideModeBtn}
              data-active={guideMode === mode}
              data-mode={mode}
              aria-pressed={guideMode === mode}
              onClick={() => setGuideMode(mode)}
            >
              <span className={mode === 'edge' ? styles.guideDotEdge : mode === 'border' ? styles.guideDotBorder : styles.guideDotBoth} />
              {mode === 'edge' ? tool.guideModeEdge : mode === 'border' ? tool.guideModeBorder : tool.guideModeBoth}
            </button>
          ))}
        </div>

        {/* Compact side dock for image adjustments — collapsed by default */}
        <aside className={styles.adjustDock} data-open={adjustOpen}>
          <button
            type="button"
            className={styles.adjustDockToggle}
            onClick={() => setAdjustOpen((v) => !v)}
            aria-expanded={adjustOpen}
          >
            <span className={styles.adjustDockToggleLeft}>
              <SlidersIcon />
              <span className={styles.adjustDockLabel}>{tool.adjustImage}</span>
            </span>
            <ChevronIcon className={styles.chevron} />
          </button>

          <div className={styles.adjustDockBody}>
            <div className={styles.sliderStack}>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="zoom" className={styles.controlLabel}><ZoomIcon /> {tool.zoom}</label><span id="zoom-val" className={styles.sliderValue}>1.0</span></div>
                <input className={styles.rangeSlider} aria-label={tool.zoom} type="range" id="zoom" min="0.1" max="3" step="0.01" defaultValue="1" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="rotate" className={styles.controlLabel}><RotateIcon /> {tool.rotate}</label><span id="rot-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label={tool.rotation} type="range" id="rotate" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="tiltY" className={styles.controlLabel}><TiltHIcon /> {tool.hTilt}</label><span id="tiltY-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label={tool.horizontalTilt} type="range" id="tiltY" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="tiltX" className={styles.controlLabel}><TiltVIcon /> {tool.vTilt}</label><span id="tiltX-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label={tool.verticalTilt} type="range" id="tiltX" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
            </div>

            <div className={styles.mapRow}>
              <canvas id="plot-canvas" className={styles.plotCanvas} width={160} height={160}></canvas>
              <div className={styles.mapLegend}>
                <span><i className={styles.dotEdge} /> {tool.mapLegendEdge}</span>
                <span><i className={styles.dotBorder} /> {tool.mapLegendBorder}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Off-screen inputs driven programmatically */}
        <input type="file" id="upload" ref={fileInputRef} className={styles.srOnly} accept="image/*" aria-label={tool.uploadCardImage} />
        <input aria-hidden="true" type="range" id="panX" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
        <input aria-hidden="true" type="range" id="panY" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
      </div>
    </div>
  );
}
