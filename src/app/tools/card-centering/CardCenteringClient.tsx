"use client";
import React, { useEffect } from 'react';
import styles from './card-centering.module.css';

type GradeZone = 'PSA10' | 'PSA9' | 'PSA8' | 'Below';

interface GradeResult {
  overall: GradeZone;
  lr: number; // left percentage
  tb: number; // top percentage
  lrZone: GradeZone;
  tbZone: GradeZone;
}

const ZONE_META: Record<GradeZone, { label: string; short: string; color: string; hint: string }> = {
  PSA10: { label: 'PSA 10', short: 'Gem Mint', color: '#22c55e', hint: 'Centering within 55/45 — Gem Mint range.' },
  PSA9: { label: 'PSA 9', short: 'Mint', color: '#f59e0b', hint: 'Centering within 60/40 — Mint range.' },
  PSA8: { label: 'PSA 8', short: 'NM-MT', color: '#fb923c', hint: 'Centering within 65/35 — Near Mint–Mint range.' },
  Below: { label: '< PSA 8', short: 'Off-center', color: '#ef4444', hint: 'Centering exceeds 65/35 — likely below PSA 8.' },
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
  const resetRef = React.useRef<(() => void) | null>(null);
  const fitRef = React.useRef<(() => void) | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const redrawRef = React.useRef<(() => void) | null>(null);
  const loupesOnRef = React.useRef(true);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [grade, setGrade] = React.useState<GradeResult | null>(null);
  const [adjustOpen, setAdjustOpen] = React.useState(true);
  const [loupesOn, setLoupesOn] = React.useState(true);

  useEffect(() => {
    loupesOnRef.current = loupesOn;
    redrawRef.current?.();
  }, [loupesOn]);

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
    // Per-corner adjustable reference offset (screen px relative to the edge corner)
    const refOff: Record<string, { x: number; y: number }> = {
      tl: { x: 0, y: 0 }, tr: { x: 0, y: 0 }, bl: { x: 0, y: 0 }, br: { x: 0, y: 0 },
    };

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
    // Edge (blue) lines get two buttons offset to either side of center so they
    // never sit under the centered border (pink) button.
    const edgeOff = isCoarsePointer ? 56 : 46;

    // Pull colors from the site's style guide CSS variables when available
    const rootStyles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    // Outer = physical card edge (blue), Inner = design/art border (brand pink), Active = high-vis yellow
    const colorOuter = '#3b82f6';
    const colorInner = (rootStyles?.getPropertyValue('--color-primary-500') || '#f07a86').trim();

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

      (['tl', 'tr', 'bl', 'br'] as const).forEach((k) => { refOff[k] = { x: 0, y: 0 }; });
      loupeMag = 2.6;

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

      // Subtle highlight of the margin band between card edge and art border
      ctx.save();
      ctx.beginPath();
      ctx.rect(oxL, oyT, oxW, oxH);
      ctx.rect(ixL, iyT, ixR - ixL, iyB - iyT);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      try { ctx.fill('evenodd'); } catch { ctx.fill(); }
      ctx.restore();

      // Card edge (outer) frame + corner brackets — blue
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = colorOuter;
      ctx.strokeRect(oxL, oyT, oxW, oxH);
      drawCorners(oxL, oyT, oxW, oxH, colorOuter);

      // Art border (inner) frame — pink
      ctx.lineWidth = 2;
      ctx.strokeStyle = colorInner;
      ctx.strokeRect(ixL, iyT, ixR - ixL, iyB - iyT);

      // Identification labels
      drawLabel(oxL, oyT, 'EDGE', colorOuter);
      drawLabel(ixL, iyT, 'BORDER', colorInner);

      // Draggable handles (outer first, inner rendered on top).
      // Edge (blue) lines show two buttons offset from center; border (pink) keeps one centered.
      drawGuide('h', outerGuides.top, colorOuter, dragging === 'outerTop', [-edgeOff, edgeOff]);
      drawGuide('h', outerGuides.bottom, colorOuter, dragging === 'outerBottom', [-edgeOff, edgeOff]);
      drawGuide('v', outerGuides.left, colorOuter, dragging === 'outerLeft', [-edgeOff, edgeOff]);
      drawGuide('v', outerGuides.right, colorOuter, dragging === 'outerRight', [-edgeOff, edgeOff]);

      drawGuide('h', innerGuides.top, colorInner, dragging === 'innerTop', [0]);
      drawGuide('h', innerGuides.bottom, colorInner, dragging === 'innerBottom', [0]);
      drawGuide('v', innerGuides.left, colorInner, dragging === 'innerLeft', [0]);
      drawGuide('v', innerGuides.right, colorInner, dragging === 'innerRight', [0]);

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

    function drawCorners(x: number, y: number, w: number, h: number, color: string) {
      const len = 22;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len); ctx.stroke();
      ctx.restore();
    }

    function drawLabel(x: number, y: number, text: string, color: string) {
      ctx.save();
      ctx.font = '700 9px Inter, ui-sans-serif, system-ui, sans-serif';
      const padX = 5;
      const tw = ctx.measureText(text).width;
      const w = tw + padX * 2;
      const h = 14;
      const ly = y - h - 5;
      roundRectPath(x, ly, w, h, 4);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = '#0b0c0d';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, x + padX, ly + h / 2 + 0.5);
      ctx.restore();
    }

    function drawHandle(px: number, py: number, color: string, active: boolean, vertical: boolean) {
      const long = active ? (isCoarsePointer ? 46 : 38) : (isCoarsePointer ? 38 : 30);
      const short = active ? 18 : 15;
      const w = vertical ? short : long;
      const h = vertical ? long : short;
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = active ? 16 : 9;
      roundRectPath(px - w / 2, py - h / 2, w, h, short / 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      roundRectPath(px - w / 2, py - h / 2, w, h, short / 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        if (vertical) ctx.arc(px, py + i * 5, 1.5, 0, Math.PI * 2);
        else ctx.arc(px + i * 5, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawGuide(orientation: 'h' | 'v', coord: number, color: string, active: boolean, offsets: number[]) {
      if (orientation === 'h') {
        const y = centerY + coord;
        if (active) {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 7]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(overlayEl.width, y);
          ctx.stroke();
          ctx.restore();
        }
        offsets.forEach((o) => drawHandle(centerX + o, y, color, active, false));
      } else {
        const x = centerX + coord;
        if (active) {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 7]);
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, overlayEl.height);
          ctx.stroke();
          ctx.restore();
        }
        offsets.forEach((o) => drawHandle(x, centerY + o, color, active, true));
      }
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
          const z = parseFloat(controls.zoom.value) || 1;
          const r = ((parseFloat(controls.rotate.value) || 0) * Math.PI) / 180;
          const px = parseInt(controls.panX.value || '0');
          const py = parseInt(controls.panY.value || '0');
          lctx.save();
          lctx.translate(R, R);
          lctx.scale(loupeMag, loupeMag);
          lctx.translate(-S.x, -S.y);
          lctx.translate(centerX + px, centerY + py);
          lctx.rotate(r);
          lctx.scale(z, z);
          lctx.drawImage(imgEl, -bw / 2, -bh / 2, bw, bh);
          lctx.restore();
        } else {
          lctx.fillStyle = 'rgba(255,255,255,0.25)';
          lctx.font = '600 11px Inter, ui-sans-serif, system-ui, sans-serif';
          lctx.textAlign = 'center';
          lctx.textBaseline = 'middle';
          lctx.fillText('No image', R, R);
        }

        // Edge guide cross (axis-aligned) anchored at the loupe center
        lctx.save();
        lctx.strokeStyle = colorOuter;
        lctx.globalAlpha = 0.85;
        lctx.lineWidth = 1.5;
        lctx.setLineDash([]);
        lctx.beginPath();
        lctx.moveTo(0, R); lctx.lineTo(size, R);
        lctx.moveTo(R, 0); lctx.lineTo(R, size);
        lctx.stroke();
        lctx.restore();

        // Adjustable reference reticle
        const mx = R + refOff[key].x * loupeMag;
        const my = R + refOff[key].y * loupeMag;
        if (refOff[key].x !== 0 || refOff[key].y !== 0) {
          lctx.save();
          lctx.strokeStyle = 'rgba(255,255,255,0.5)';
          lctx.setLineDash([3, 3]);
          lctx.lineWidth = 1;
          lctx.beginPath();
          lctx.moveTo(R, R); lctx.lineTo(mx, my);
          lctx.stroke();
          lctx.restore();
        }
        lctx.save();
        lctx.strokeStyle = '#fde047';
        lctx.fillStyle = '#fde047';
        lctx.lineWidth = 2;
        lctx.setLineDash([]);
        lctx.beginPath(); lctx.arc(mx, my, 8, 0, Math.PI * 2); lctx.stroke();
        lctx.beginPath();
        lctx.moveTo(mx - 12, my); lctx.lineTo(mx - 3, my);
        lctx.moveTo(mx + 3, my); lctx.lineTo(mx + 12, my);
        lctx.moveTo(mx, my - 12); lctx.lineTo(mx, my - 3);
        lctx.moveTo(mx, my + 3); lctx.lineTo(mx, my + 12);
        lctx.stroke();
        lctx.beginPath(); lctx.arc(mx, my, 1.6, 0, Math.PI * 2); lctx.fill();
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
        const d = Math.round(Math.hypot(refOff[key].x, refOff[key].y));
        loupeChip(lctx, `Δ ${d}px`, R, size - 11, d === 0 ? '#9ca3af' : '#fde047');
        if (key === 'tl') loupeChip(lctx, `${loupeMag.toFixed(1)}×`, size - 18, 12, '#e5e7eb');
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

      setGrade({
        overall: overallZone,
        lr: lrPercentL,
        tb: tbPercentT,
        lrZone,
        tbZone,
      });

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

      // Pick the NEAREST guide within the hit area rather than the first match.
      // This avoids grabbing the wrong line when the blue/pink guides sit close together.
      // Inner (pink) guides are given a small bias so they win ties — they're drawn on top.
      const candidates: { name: string; dist: number; bias: number }[] = [
        { name: 'innerTop', dist: Math.abs(yRel - innerGuides.top), bias: 2 },
        { name: 'innerBottom', dist: Math.abs(yRel - innerGuides.bottom), bias: 2 },
        { name: 'innerLeft', dist: Math.abs(xRel - innerGuides.left), bias: 2 },
        { name: 'innerRight', dist: Math.abs(xRel - innerGuides.right), bias: 2 },
        { name: 'outerTop', dist: Math.abs(yRel - outerGuides.top), bias: 0 },
        { name: 'outerBottom', dist: Math.abs(yRel - outerGuides.bottom), bias: 0 },
        { name: 'outerLeft', dist: Math.abs(xRel - outerGuides.left), bias: 0 },
        { name: 'outerRight', dist: Math.abs(xRel - outerGuides.right), bias: 0 },
      ];

      let best: { name: string; score: number } | null = null;
      for (const c of candidates) {
        if (c.dist > hitArea) continue;
        const score = c.dist - c.bias;
        if (!best || score < best.score) best = { name: c.name, score };
      }
      if (best) dragging = best.name;

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

    // --- Loupe reticle interaction ---
    function setRefFromEvent(key: string, e: any) {
      const el = loupeEls[key as 'tl' | 'tr' | 'bl' | 'br'];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pos = getPointerPos(e);
      const size = el.clientWidth;
      const lx = pos.clientX - rect.left - size / 2;
      const ly = pos.clientY - rect.top - size / 2;
      refOff[key] = { x: lx / loupeMag, y: ly / loupeMag };
      drawLoupes();
    }
    const loupeBindings: Array<{ el: HTMLCanvasElement; type: string; fn: any }> = [];
    (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
      const el = loupeEls[key];
      if (!el) return;
      const down = (e: any) => { e.preventDefault(); e.stopPropagation(); loupeDrag = key; setRefFromEvent(key, e); };
      const dbl = () => { refOff[key] = { x: 0, y: 0 }; drawLoupes(); };
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
  const zoneMeta = zone ? ZONE_META[zone] : null;
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
            <p className={styles.emptyTitle}>Upload a card to start</p>
            <button className={styles.emptyBtn} onClick={() => fileInputRef.current?.click()}>Choose image</button>
          </div>
        )}

        {/* Floating top bar: grade + actions */}
        <div className={styles.topBar}>
          <div
            className={styles.gradePill}
            style={{ ['--zone-color' as any]: zoneMeta?.color ?? 'rgba(148,163,184,0.7)' }}
          >
            <span className={styles.gradePillLabel}>{zoneMeta?.label ?? '—'}</span>
            <span className={styles.gradePillSub}>{zoneMeta?.short ?? 'Align guides'}</span>
            <div className={styles.gradePillRatios}>
              <span data-status={grade?.lrZone}>L·R {fmt(grade?.lr)}/{fmt(grade ? 100 - grade.lr : undefined)}</span>
              <span data-status={grade?.tbZone}>T·B {fmt(grade?.tb)}/{fmt(grade ? 100 - grade.tb : undefined)}</span>
            </div>
          </div>

          <div className={styles.topActions}>
            <button className={`${styles.iconBtn} ${loupesOn ? styles.iconBtnOn : ''}`} title="Corner magnifiers" aria-label="Toggle corner magnifiers" aria-pressed={loupesOn} onClick={() => setLoupesOn((v) => !v)}><MagnifierIcon /></button>
            <button className={styles.iconBtn} title="Upload image" aria-label="Upload image" onClick={() => fileInputRef.current?.click()}><UploadIcon /></button>
            <button className={styles.iconBtn} title="Fit to view" aria-label="Fit to view" onClick={() => fitRef.current?.()}><FitIcon /></button>
            <button className={styles.iconBtn} title="Reset" aria-label="Reset" onClick={() => resetRef.current?.()}><ResetIcon /></button>
          </div>
        </div>

        {/* Floating, collapsible adjustments sheet */}
        <div className={styles.adjustSheet} data-open={adjustOpen}>
          <div className={styles.sheetGrabber} onClick={() => setAdjustOpen((v) => !v)} />
          <button className={styles.adjustToggle} onClick={() => setAdjustOpen((v) => !v)} aria-expanded={adjustOpen}>
            <span className={styles.adjustToggleLeft}><SlidersIcon /> Adjust image</span>
            <ChevronIcon className={styles.chevron} />
          </button>

          <div className={styles.adjustBody}>
            <div className={styles.sliderGrid}>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="zoom" className={styles.controlLabel}><ZoomIcon /> Zoom</label><span id="zoom-val" className={styles.sliderValue}>1.0</span></div>
                <input className={styles.rangeSlider} aria-label="Zoom" type="range" id="zoom" min="0.1" max="3" step="0.01" defaultValue="1" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="rotate" className={styles.controlLabel}><RotateIcon /> Rotate</label><span id="rot-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label="Rotation" type="range" id="rotate" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="tiltY" className={styles.controlLabel}><TiltHIcon /> H-Tilt</label><span id="tiltY-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label="Horizontal tilt" type="range" id="tiltY" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
              <div className={styles.controlRow}>
                <div className={styles.controlHeader}><label htmlFor="tiltX" className={styles.controlLabel}><TiltVIcon /> V-Tilt</label><span id="tiltX-val" className={styles.sliderValue}>0°</span></div>
                <input className={styles.rangeSlider} aria-label="Vertical tilt" type="range" id="tiltX" min="-45" max="45" step="0.05" defaultValue="0" />
              </div>
            </div>

            <div className={styles.mapRow}>
              <canvas id="plot-canvas" className={styles.plotCanvas} width={160} height={160}></canvas>
              <div className={styles.mapLegend}>
                <span><i className={styles.dotEdge} /> Blue = card edge</span>
                <span><i className={styles.dotBorder} /> Pink = art border</span>
              </div>
            </div>
          </div>
        </div>

        {/* Off-screen inputs driven programmatically */}
        <input type="file" id="upload" ref={fileInputRef} className={styles.srOnly} accept="image/*" aria-label="Upload card image" />
        <input aria-hidden="true" type="range" id="panX" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
        <input aria-hidden="true" type="range" id="panY" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
      </div>
    </div>
  );
}
