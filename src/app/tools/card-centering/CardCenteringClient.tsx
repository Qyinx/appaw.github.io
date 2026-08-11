"use client";
import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import { compressImage } from '@/lib/compress-image';
import {
  BELOW_TIER_ID,
  getPlotZoneRects,
  getTiers,
  measureFromGuides,
  scoreCentering,
  GRADING_COMPANIES,
  bakeReliefImageBitmap,
  cssImageFilter,
  IMAGE_FILTER_MODES,
  RELIEF_FILTER_ID,
  RELIEF_LOUPE_PENDING_FILTER,
  releaseReliefBitmap,
  scheduleReliefBake,
  type CenteringScore,
  type GradingCompany,
  type ImageFilterMode,
  type QualityTier,
} from '@/lib/centering';
import styles from './card-centering.module.css';
import { useCenteringGuide, useCenteringGuideRef } from './CenteringGuideContext';
import { isInnerHandle, isOuterHandle, centeringHowToSteps } from './centering-guide';
import { useCenteringToolMotion } from './useCenteringToolMotion';

type PhotoMode = 'raw' | 'slab';
type VerdictKey = 'regradeCandidate' | 'borderlineRegrade' | 'holdGrade' | 'downgradeRisk';
type UploadState = 'idle' | 'loading' | 'error';

function verdictForQuality(quality: QualityTier): VerdictKey {
  if (quality === 'excellent') return 'regradeCandidate';
  if (quality === 'good') return 'borderlineRegrade';
  if (quality === 'fair') return 'holdGrade';
  return 'downgradeRisk';
}

function axisQuality(company: GradingCompany, zoneId: string): QualityTier {
  if (zoneId === BELOW_TIER_ID) return 'poor';
  return getTiers(company, 'front').find((t) => t.id === zoneId)?.quality ?? 'poor';
}

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

const UploadImageIcon = () => (
  <svg {...ICON_PROPS} width={18} height={18}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const EmptyCardSchematic = () => (
  <svg
    className={styles.emptySchematic}
    viewBox="0 0 96 132"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="94" height="130" stroke="var(--tool-border)" strokeWidth="1" fill="var(--tool-bg)" />
    <path d="M8 8h10v1H8zm70 0h10v1H78zM8 123h10v1H8zm70 0h10v1H78z" fill="var(--tool-text-muted)" opacity="0.45" />
    <rect x="14" y="18" width="68" height="96" stroke="var(--tool-guide-edge)" strokeWidth="1.5" />
    <rect x="22" y="28" width="52" height="76" stroke="var(--tool-guide-border)" strokeWidth="1.5" />
    <path
      d="M14 18h68M14 114h68M14 18v96M82 18v96"
      stroke="var(--tool-guide-edge)"
      strokeWidth="1.5"
      strokeDasharray="3 4"
      opacity="0.35"
    />
    <path
      d="M22 28h52M22 104h52M22 28v76M74 28v76"
      stroke="var(--tool-guide-border)"
      strokeWidth="1.5"
      strokeDasharray="3 4"
      opacity="0.35"
    />
    <line x1="48" y1="24" x2="48" y2="108" stroke="var(--tool-text-muted)" strokeWidth="0.75" opacity="0.2" />
    <line x1="28" y1="66" x2="68" y2="66" stroke="var(--tool-text-muted)" strokeWidth="0.75" opacity="0.2" />
    <circle cx="14" cy="18" r="2.25" fill="var(--accent-warn)" />
    <circle cx="82" cy="18" r="2.25" fill="var(--accent-warn)" />
    <circle cx="14" cy="114" r="2.25" fill="var(--accent-warn)" />
    <circle cx="82" cy="114" r="2.25" fill="var(--accent-warn)" />
    <rect x="36" y="52" width="24" height="28" rx="1" fill="var(--tool-raised)" stroke="var(--tool-border-subtle)" />
    <path d="M42 74h12" stroke="var(--tool-text-muted)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M42 68h8" stroke="var(--tool-text-muted)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
  </svg>
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
const CornerLoupeIcon = () => (
  <svg {...ICON_PROPS} width={16} height={16}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  </svg>
);
const ResetViewIcon = () => (
  <svg {...ICON_PROPS} width={16} height={16}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);
const WorkspaceToolsIcon = () => (
  <svg {...ICON_PROPS} width={16} height={16} aria-hidden="true">
    <rect x="3" y="3" width="5" height="18" rx="0.5" />
    <line x1="12" y1="6" x2="21" y2="6" />
    <line x1="12" y1="12" x2="21" y2="12" />
    <line x1="12" y1="18" x2="18" y2="18" />
  </svg>
);

const FILTER_DOT_CLASS: Record<ImageFilterMode, keyof typeof styles> = {
  off: 'filterDotNormal',
  contrast: 'filterDotContrast',
  invert: 'filterDotInvert',
  relief: 'filterDotRelief',
};

function BlemishFilterBar({
  active,
  onSelect,
  ariaLabel,
  labels,
  barClassName,
  iconsOnly = false,
}: {
  active: ImageFilterMode;
  onSelect: (mode: ImageFilterMode) => void;
  ariaLabel: string;
  labels: Record<ImageFilterMode, string>;
  barClassName: string;
  iconsOnly?: boolean;
}) {
  return (
    <div className={barClassName} role="toolbar" aria-label={ariaLabel}>
      {IMAGE_FILTER_MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          className={`${styles.guideModeBtn} ${styles.filterModeBtn}${iconsOnly ? ` ${styles.filterModeBtnIconOnly}` : ''}`}
          data-active={active === mode}
          data-filter-mode={mode}
          aria-pressed={active === mode}
          aria-label={labels[mode]}
          title={labels[mode]}
          onClick={() => onSelect(mode)}
        >
          <span className={styles[FILTER_DOT_CLASS[mode]]} aria-hidden="true" />
          {!iconsOnly ? <span className={styles.guideModeBtnLabel}>{labels[mode]}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default function CardCenteringClient() {
  const { t } = useLanguage();
  const tool = t.centeringPage.tool;
  const seo = t.centeringPage.seo;
  const howToSteps = centeringHowToSteps(t.centeringPage.content.steps);
  const guide = useCenteringGuide();
  const guideRef = useCenteringGuideRef();
  const toolLabelsRef = React.useRef(tool);
  toolLabelsRef.current = tool;

  const resetRef = React.useRef<(() => void) | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const imageReadyRef = React.useRef(false);
  const redrawRef = React.useRef<(() => void) | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [imageReady, setImageReady] = React.useState(false);
  const [uploadState, setUploadState] = React.useState<UploadState>('idle');
  const [grade, setGrade] = React.useState<CenteringScore | null>(null);
  const [adjustOpen, setAdjustOpen] = React.useState(false);
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [loupesOn, setLoupesOn] = React.useState(false);
  const [loupeMagUi, setLoupeMagUi] = React.useState(2.6);
  const loupeMagRef = React.useRef(2.6);
  const setLoupeMagUiRef = React.useRef(setLoupeMagUi);
  setLoupeMagUiRef.current = setLoupeMagUi;
  const dismissChromeRef = React.useRef<() => void>(() => {});

  const LOUPE_MAG_MIN = 1.5;
  const LOUPE_MAG_MAX = 5;
  const LOUPE_MAG_STEP = 0.2;

  const applyLoupeMag = React.useCallback((next: number) => {
    const clamped = Math.min(LOUPE_MAG_MAX, Math.max(LOUPE_MAG_MIN, +next.toFixed(2)));
    if (clamped === loupeMagRef.current) return;
    loupeMagRef.current = clamped;
    setLoupeMagUi(clamped);
    redrawRef.current?.();
  }, []);
  const [showHandlePulse, setShowHandlePulse] = React.useState(false);
  const [outerAligned, setOuterAligned] = React.useState(false);
  const [innerAligned, setInnerAligned] = React.useState(false);
  const [imageEpoch, setImageEpoch] = React.useState(0);
  const uploadCallbacksRef = React.useRef({
    setUploadState,
    setImageReady,
    setFileName,
    setShowHandlePulse,
    setOuterAligned,
    setInnerAligned,
    setImageEpoch,
  });
  uploadCallbacksRef.current = {
    setUploadState,
    setImageReady,
    setFileName,
    setShowHandlePulse,
    setOuterAligned,
    setInnerAligned,
    setImageEpoch,
  };
  imageReadyRef.current = imageReady;
  const loupesOnRef = React.useRef(loupesOn);
  const [guideMode, setGuideMode] = React.useState<'edge' | 'border' | 'both'>('both');
  const [photoMode, setPhotoMode] = React.useState<PhotoMode>('raw');
  const [imageFilterMode, setImageFilterMode] = React.useState<ImageFilterMode>('off');
  const [gradingCompany, setGradingCompany] = React.useState<GradingCompany>('PSA');
  const guideModeRef = React.useRef(guideMode);
  const imageFilterRef = React.useRef(imageFilterMode);
  const gradingCompanyRef = React.useRef(gradingCompany);
  /** One-shot emboss bitmap for loupes — never reconvolve in RAF. */
  const reliefBitmapRef = React.useRef<ImageBitmap | null>(null);
  const reliefBakeGenRef = React.useRef(0);
  const cancelReliefBakeRef = React.useRef<(() => void) | null>(null);
  const emptyPlateRef = React.useRef<HTMLDivElement | null>(null);
  const adjustDockRef = React.useRef<HTMLElement | null>(null);
  const gradePillRef = React.useRef<HTMLDivElement | null>(null);

  const CARD_FACE = 'front' as const;

  useEffect(() => {
    loupesOnRef.current = loupesOn;
    redrawRef.current?.();
  }, [loupesOn]);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) setLoupesOn(false);
  }, []);

  dismissChromeRef.current = () => {
    setAdjustOpen(false);
    setSetupOpen(false);
  };

  useEffect(() => {
    if (!adjustOpen && !setupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissChromeRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [adjustOpen, setupOpen]);

  useEffect(() => {
    if (grade) guideRef.current.onGradeCalculated();
  }, [grade, guideRef]);

  useEffect(() => {
    if (guide.guideDismissed) return;
    if (guide.activeStep === 2) setGuideMode('both');
  }, [guide.activeStep, guide.guideDismissed]);

  useEffect(() => {
    if (guide.guideDismissed) return;
    if (guide.activeStep === 2) {
      setShowHandlePulse(true);
      const timer = window.setTimeout(() => setShowHandlePulse(false), 3000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [guide.activeStep, guide.guideDismissed]);

  useEffect(() => {
    if (guide.guideDismissed || guide.activeStep !== 1 || !imageReady) return;
    setSetupOpen(false);
    setAdjustOpen(true);
  }, [guide.activeStep, guide.guideDismissed, imageReady]);

  useEffect(() => {
    if (guide.guideDismissed || guide.activeStep !== 2 || !imageReady) return;
    setAdjustOpen(false);
    setSetupOpen(false);
  }, [guide.activeStep, guide.guideDismissed, imageReady]);

  useEffect(() => {
    guideModeRef.current = guideMode;
    redrawRef.current?.();
  }, [guideMode]);

  useEffect(() => {
    imageFilterRef.current = imageFilterMode;
    redrawRef.current?.();
  }, [imageFilterMode]);

  const invalidateReliefBake = React.useCallback(() => {
    cancelReliefBakeRef.current?.();
    cancelReliefBakeRef.current = null;
    reliefBakeGenRef.current += 1;
    releaseReliefBitmap(reliefBitmapRef.current);
    reliefBitmapRef.current = null;
  }, []);

  const invalidateReliefBakeRef = React.useRef(invalidateReliefBake);
  invalidateReliefBakeRef.current = invalidateReliefBake;

  // Bake relief bitmap once when filter=relief and image is ready (idle, not RAF).
  useEffect(() => {
    if (imageFilterMode !== 'relief' || !imageReady) return;

    if (reliefBitmapRef.current) {
      redrawRef.current?.();
      return;
    }

    const img = document.getElementById('card-image') as HTMLImageElement | null;
    if (!img?.naturalWidth || !img.complete) return;

    const gen = reliefBakeGenRef.current;
    cancelReliefBakeRef.current?.();
    cancelReliefBakeRef.current = scheduleReliefBake(() => {
      void (async () => {
        try {
          const bitmap = await bakeReliefImageBitmap(img);
          if (gen !== reliefBakeGenRef.current) {
            releaseReliefBitmap(bitmap);
            return;
          }
          releaseReliefBitmap(reliefBitmapRef.current);
          reliefBitmapRef.current = bitmap;
          redrawRef.current?.();
        } catch {
          /* loupe falls back to pending CSS filter */
        }
      })();
    });

    return () => {
      cancelReliefBakeRef.current?.();
      cancelReliefBakeRef.current = null;
    };
  }, [imageFilterMode, imageReady, imageEpoch]);

  useEffect(() => {
    return () => {
      invalidateReliefBakeRef.current();
    };
  }, []);

  useEffect(() => {
    gradingCompanyRef.current = gradingCompany;
    redrawRef.current?.();
  }, [gradingCompany]);

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
    let loupeDrag: string | null = null;
    // Shared corner fillet radius (card-base px), comparable across all four loupes.
    const DEFAULT_FILLET_RADIUS = 14;
    let refRadius = DEFAULT_FILLET_RADIUS;

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
    const PERSPECTIVE = 1000;

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
    let initialPinchAngle = 0;
    let initialZoom = 1;
    let initialRotate = 0;
    let pendingPinchZoom: number | null = null;
    let pendingPinchRotate: number | null = null;
    let pinchRaf = 0;
    let pinchSample: { x1: number; y1: number; x2: number; y2: number } | null = null;
    let pendingTouch: { id: number; startX: number; startY: number } | null = null;
    const TOUCH_PAN_SLOP = 10;
    let lastWorkspaceW = 0;
    let lastWorkspaceH = 0;

    let overlayRaf = 0;
    let gradeRaf = 0;
    let pendingGrade: CenteringScore | null = null;
    const handleDisplay: Record<string, { x: number; y: number }> = {};
    const HANDLE_SLIDE = 0.18;
    const HANDLE_SNAP_PX = 0.45;
    type HandleDef = { name: string; x: number; y: number; anchorX: number; anchorY: number; vertical: boolean };

    const isCoarsePointer = typeof window !== 'undefined' && (window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : ('ontouchstart' in window));
    /* Coarse: knob-sized hit. Line hits stay tighter so pans are not stolen — except outer rescue pick. */
    const lineHitRadius = isCoarsePointer ? 22 : 28;
    const outerLineHitRadius = isCoarsePointer ? 28 : 32;

    function getHandleRadius() {
      if (!isCoarsePointer) return 46;
      // Short phones: larger grab so outer knobs stay usable after chrome clamp.
      return overlayEl.height < 560 ? 58 : 52;
    }

    /** Keep knobs clear of setup chip / grade pill / bottom action bar on touch. */
    function getChromeSafeInsets() {
      if (!isCoarsePointer) return { top: 6, right: 6, bottom: 6, left: 6 };
      // Action bar ~48px + home indicator; setup chip ~32–40px.
      return {
        top: 40,
        right: 12,
        bottom: 64,
        left: 12,
      };
    }

    function clampHandleToSafeArea(h: HandleDef): HandleDef {
      const inset = getChromeSafeInsets();
      const maxX = Math.max(inset.left + 8, overlayEl.width - inset.right);
      const maxY = Math.max(inset.top + 8, overlayEl.height - inset.bottom);
      return {
        ...h,
        x: Math.min(maxX, Math.max(inset.left, h.x)),
        y: Math.min(maxY, Math.max(inset.top, h.y)),
      };
    }

    // Pull colors from semantic site tokens (style.md §2)
    const rootStyles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
    const colorOuter = (rootStyles?.getPropertyValue('--accent-secondary') || '#5B6FD6').trim();
    const colorInner = (rootStyles?.getPropertyValue('--accent-primary') || '#E85D6F').trim();
    const outerRgb = colorOuter.match(/^#([0-9a-f]{6})$/i);
    const colorOuterFill = outerRgb
      ? `rgba(${parseInt(outerRgb[1].slice(0, 2), 16)}, ${parseInt(outerRgb[1].slice(2, 4), 16)}, ${parseInt(outerRgb[1].slice(4, 6), 16)}, 0.07)`
      : 'rgba(91, 111, 214, 0.07)';

    let bgCache: HTMLCanvasElement | null = null;
    let bgCacheW = 0;
    let bgCacheH = 0;
    let plotW = 0;
    let plotH = 0;
    let plotDpr = 0;
    let lastGradeSnapshot: CenteringScore | null = null;
    let resizeRaf = 0;
    let transformRaf = 0;
    let transformSliderActive = false;
    let activeTransformId: string | null = null;
    const loupeSizeCache: Partial<Record<'tl' | 'tr' | 'bl' | 'br', number>> = {};
    let lastGradeCalcMs = 0;
    const MOBILE_GRADE_INTERVAL_MS = 90;
    const plotDprCap = isCoarsePointer ? Math.min(window.devicePixelRatio || 1, 2) : window.devicePixelRatio || 1;
    let panRaf = 0;
    let panPointer: { x: number; y: number } | null = null;
    let panSession: { z: number; r: number; tx: number; ty: number } | null = null;
    let pendingPanX = 0;
    let pendingPanY = 0;
    let lastTransformReadoutMs = 0;
    const TRANSFORM_READOUT_MS = isCoarsePointer ? 120 : 0;
    const workspaceShellEl = workspaceEl.parentElement;

    const zoomValEl = document.getElementById('zoom-val');
    const rotValEl = document.getElementById('rot-val');
    const tiltXValEl = document.getElementById('tiltX-val');
    const tiltYValEl = document.getElementById('tiltY-val');

    function gradesEqual(a: CenteringScore, b: CenteringScore) {
      return (
        a.company === b.company &&
        a.face === b.face &&
        a.overall === b.overall &&
        a.lrZone === b.lrZone &&
        a.tbZone === b.tbZone &&
        Math.abs(a.lr - b.lr) < 0.05 &&
        Math.abs(a.tb - b.tb) < 0.05
      );
    }

    function rebuildBgCache() {
      if (!bgCache) bgCache = document.createElement('canvas');
      bgCache.width = overlayEl.width;
      bgCache.height = overlayEl.height;
      bgCacheW = overlayEl.width;
      bgCacheH = overlayEl.height;

      const bctx = bgCache.getContext('2d');
      if (!bctx) return;

      const cx = centerX;
      const cy = centerY;
      const w = overlayEl.width;
      const h = overlayEl.height;
      const compact = w < 768 || isCoarsePointer;

      bctx.clearRect(0, 0, w, h);

      const grid = compact ? 40 : 34;
      bctx.save();
      bctx.strokeStyle = 'rgba(255,255,255,0.10)';
      bctx.lineWidth = 1;
      bctx.setLineDash([]);
      bctx.beginPath();
      for (let x = cx % grid; x < w; x += grid) {
        bctx.moveTo(x + 0.5, 0);
        bctx.lineTo(x + 0.5, h);
      }
      for (let y = cy % grid; y < h; y += grid) {
        bctx.moveTo(0, y + 0.5);
        bctx.lineTo(w, y + 0.5);
      }
      bctx.stroke();
      bctx.restore();

      if (!compact) {
        bctx.save();
        bctx.translate(cx, cy);
        bctx.rotate(-Math.PI / 10);
        bctx.fillStyle = 'rgba(255,255,255,0.04)';
        bctx.font = '700 20px Inter, ui-sans-serif, system-ui, sans-serif';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        const wmSpan = Math.max(w, h);
        for (let gx = -wmSpan; gx <= wmSpan; gx += 230) {
          for (let gy = -wmSpan; gy <= wmSpan; gy += 130) {
            bctx.fillText('Appaw Store', gx, gy);
          }
        }
        bctx.restore();
      } else {
        bctx.save();
        bctx.translate(cx, cy);
        bctx.rotate(-Math.PI / 10);
        bctx.fillStyle = 'rgba(255,255,255,0.05)';
        bctx.font = '700 12px Inter, ui-sans-serif, system-ui, sans-serif';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        const wmSpan = Math.max(w, h);
        for (let gx = -wmSpan; gx <= wmSpan; gx += 140) {
          for (let gy = -wmSpan; gy <= wmSpan; gy += 78) {
            bctx.fillText('Appaw Store', gx, gy);
          }
        }
        bctx.restore();
      }

      bctx.save();
      bctx.strokeStyle = 'rgba(255,255,255,0.07)';
      bctx.lineWidth = 1;
      bctx.setLineDash([4, 6]);
      [w * 0.25, w * 0.75].forEach((x) => {
        bctx.beginPath();
        bctx.moveTo(x, 0);
        bctx.lineTo(x, h);
        bctx.stroke();
      });
      [h * 0.25, h * 0.75].forEach((y) => {
        bctx.beginPath();
        bctx.moveTo(0, y);
        bctx.lineTo(w, y);
        bctx.stroke();
      });
      bctx.restore();

      bctx.save();
      bctx.strokeStyle = 'rgba(255,255,255,0.14)';
      bctx.lineWidth = 1.4;
      bctx.setLineDash([]);
      bctx.beginPath();
      bctx.moveTo(cx, 0);
      bctx.lineTo(cx, h);
      bctx.moveTo(0, cy);
      bctx.lineTo(w, cy);
      bctx.stroke();
      bctx.restore();
    }

    function resizeCanvas() {
      const w = workspaceEl.clientWidth;
      const h = workspaceEl.clientHeight;
      if (Math.abs(w - lastWorkspaceW) < 1 && Math.abs(h - lastWorkspaceH) < 1) return;
      lastWorkspaceW = w;
      lastWorkspaceH = h;
      overlayEl.width = w;
      overlayEl.height = h;
      centerX = overlayEl.width / 2;
      centerY = overlayEl.height / 2;
      plotW = 0;
      plotH = 0;
      rebuildBgCache();
      if (imgEl.naturalWidth && imgEl.style.display !== 'none') {
        fitGuidesToImage();
      }
      scheduleDrawOverlay();
    }

    function onResize() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resizeCanvas();
      });
    }
    window.addEventListener('resize', onResize);

    const uploadHandler = async (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      const cb = uploadCallbacksRef.current;
      cb.setUploadState('loading');
      invalidateReliefBakeRef.current();

      try {
        const { base64, mimeType } = await compressImage(file, 2048, 0.85);
        await new Promise<void>((resolve, reject) => {
          imgEl.onload = () => resolve();
          imgEl.onerror = () => reject(new Error('decode'));
          imgEl.src = `data:${mimeType};base64,${base64}`;
          imgEl.style.display = 'block';
        });

        Object.values(controls).forEach((ctrl: HTMLInputElement) => {
          ctrl.value = ctrl.defaultValue;
        });
        fitToImage();
        cb.setFileName(file.name);
        cb.setImageReady(true);
        cb.setOuterAligned(false);
        cb.setInnerAligned(false);
        cb.setUploadState('idle');
        cb.setImageEpoch((n: number) => n + 1);

        guideRef.current.onImageReady();

        cb.setShowHandlePulse(true);
        window.setTimeout(() => cb.setShowHandlePulse(false), 3000);
      } catch {
        if (imageReadyRef.current) {
          cb.setUploadState('idle');
        } else {
          cb.setUploadState('error');
        }
      } finally {
        input.value = '';
      }
    };
    uploadEl.addEventListener('change', uploadHandler);

    function isOverlayFastMode() {
      return dragging === 'image' || dragging === 'pinch' || transformSliderActive;
    }

    function shouldRedrawOverlayForTransform() {
      return loupesOnRef.current;
    }

    function shouldCalculateGradeNow() {
      if (!isCoarsePointer || !isGuideDrag()) return true;
      const now = performance.now();
      if (now - lastGradeCalcMs < MOBILE_GRADE_INTERVAL_MS) return false;
      lastGradeCalcMs = now;
      return true;
    }

    function setImageDragVisual(active: boolean) {
      if (active) {
        imgWrapperEl.dataset.dragging = 'true';
        workspaceShellEl?.setAttribute('data-transforming', 'true');
      } else {
        delete imgWrapperEl.dataset.dragging;
        workspaceShellEl?.removeAttribute('data-transforming');
      }
    }

    function applyPanTransform(px: number, py: number) {
      imgWrapperEl.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    }

    function applyImageTransform(z: number, r: number, tx: number, ty: number) {
      imgEl.style.transform =
        `translateZ(0) scale(${z}) rotateZ(${r}deg) rotateX(${tx}deg) rotateY(${-ty}deg)`;
    }

    function applyFullTransform(px?: number, py?: number) {
      const { z, r, tx, ty, px: controlPx, py: controlPy } = readTransformState();
      applyPanTransform(px ?? controlPx, py ?? controlPy);
      applyImageTransform(z, r, tx, ty);
    }

    function beginImagePan(clientX: number, clientY: number) {
      dismissChromeRef.current();
      setImageDragVisual(true);
      const { z, r, tx, ty, px, py } = readTransformState();
      panSession = { z, r, tx, ty };
      pendingPanX = px;
      pendingPanY = py;
      lastPointerX = clientX;
      lastPointerY = clientY;
    }

    function applyPanFrame(clientX: number, clientY: number) {
      if (!panSession) return;
      pendingPanX += clientX - lastPointerX;
      pendingPanY += clientY - lastPointerY;
      lastPointerX = clientX;
      lastPointerY = clientY;
      applyPanTransform(pendingPanX, pendingPanY);
    }

    function schedulePanFrame(clientX: number, clientY: number) {
      panPointer = { x: clientX, y: clientY };
      if (panRaf) return;
      panRaf = requestAnimationFrame(() => {
        panRaf = 0;
        if (!panPointer) return;
        applyPanFrame(panPointer.x, panPointer.y);
      });
    }

    function commitPan() {
      if (panRaf) {
        cancelAnimationFrame(panRaf);
        panRaf = 0;
      }
      if (panPointer && panSession) {
        applyPanFrame(panPointer.x, panPointer.y);
      }
      panPointer = null;
      if (panSession) {
        controls.panX.value = String(Math.round(pendingPanX));
        controls.panY.value = String(Math.round(pendingPanY));
      }
      panSession = null;
    }

    function syncTransformReadout(
      id: string,
      z: number,
      r: number,
      tx: number,
      ty: number,
      live = false,
    ) {
      if (live && TRANSFORM_READOUT_MS > 0) {
        const now = performance.now();
        if (now - lastTransformReadoutMs < TRANSFORM_READOUT_MS) return;
        lastTransformReadoutMs = now;
      }

      if (id === 'zoom' && zoomValEl) zoomValEl.textContent = z.toFixed(2);
      if (id === 'rotate' && rotValEl) rotValEl.textContent = r.toFixed(2) + '°';
      if (id === 'tiltX' && tiltXValEl) tiltXValEl.textContent = tx.toFixed(2) + '°';
      if (id === 'tiltY' && tiltYValEl) tiltYValEl.textContent = ty.toFixed(2) + '°';
      if (!live && controls[id]) fillTrack(controls[id]);
    }

    function updateTransformFast(activeId?: string | null) {
      const { z, r, tx, ty } = readTransformState();
      applyImageTransform(z, r, tx, ty);
      if (activeId) syncTransformReadout(activeId, z, r, tx, ty, true);
    }

    function scheduleTransformUpdate(id: string) {
      transformSliderActive = true;
      activeTransformId = id;
      if (transformRaf) return;
      transformRaf = requestAnimationFrame(() => {
        transformRaf = 0;
        updateTransformFast(activeTransformId);
      });
    }

    function maybeCompleteAdjustGuideStep() {
      const g = guideRef.current;
      if (g.activeStep === 1 && !g.guideDismissed) {
        g.onImageAdjusted();
      }
    }

    function commitTransformSlider() {
      if (!transformSliderActive && !transformRaf) return;
      if (transformRaf) {
        cancelAnimationFrame(transformRaf);
        transformRaf = 0;
      }
      transformSliderActive = false;
      activeTransformId = null;
      lastTransformReadoutMs = 0;
      setImageDragVisual(false);
      updateTransform();
      maybeCompleteAdjustGuideStep();
    }

    function updateTransform() {
      const { z, r, tx, ty } = readTransformState();

      if (zoomValEl) zoomValEl.textContent = z.toFixed(2);
      if (rotValEl) rotValEl.textContent = r.toFixed(2) + '°';
      if (tiltXValEl) tiltXValEl.textContent = tx.toFixed(2) + '°';
      if (tiltYValEl) tiltYValEl.textContent = ty.toFixed(2) + '°';

      applyFullTransform();
      fillTrack(controls.zoom);
      fillTrack(controls.rotate);
      fillTrack(controls.tiltX);
      fillTrack(controls.tiltY);
      if (shouldRedrawOverlayForTransform()) scheduleDrawOverlay();
    }

    function fillTrack(el: HTMLInputElement) {
      if (!el) return;
      const min = parseFloat(el.min || '0');
      const max = parseFloat(el.max || '100');
      const val = parseFloat(el.value || '0');
      const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
      el.style.background = `linear-gradient(90deg, var(--accent-primary) ${pct}%, var(--tool-overlay-active) ${pct}%)`;
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

      if (imgEl.naturalWidth && imgEl.style.display !== 'none') {
        fitGuidesToImage();
      }

      refRadius = DEFAULT_FILLET_RADIUS;
      loupeMagRef.current = 2.6;
      setLoupeMagUiRef.current(2.6);
      lastGradeSnapshot = null;
      setGrade(null);
      setImageDragVisual(false);
      applyPanTransform(0, 0);

      for (const key of Object.keys(handleDisplay)) delete handleDisplay[key];

      updateTransform();
    }

    function getImageDisplaySize() {
      const rect = imgEl.getBoundingClientRect();
      if (rect.width > 1 && rect.height > 1) {
        return { w: rect.width, h: rect.height };
      }
      const iw = imgEl.naturalWidth || imgEl.width || 1;
      const ih = imgEl.naturalHeight || imgEl.height || 1;
      const maxW = workspaceEl.clientWidth * 0.94;
      const maxH = workspaceEl.clientHeight * 0.9;
      const layoutScale = Math.min(maxW / iw, maxH / ih, 1);
      return { w: iw * layoutScale, h: ih * layoutScale };
    }

    const guideInsetY =
      Math.abs(DEFAULTS.inner.top - DEFAULTS.outer.top) / (DEFAULTS.outer.bottom - DEFAULTS.outer.top);
    const guideInsetX =
      Math.abs(DEFAULTS.inner.left - DEFAULTS.outer.left) / (DEFAULTS.outer.right - DEFAULTS.outer.left);

    function fitGuidesToImage() {
      if (!imgEl.naturalWidth || imgEl.style.display === 'none') return;

      const overlayRect = overlayEl.getBoundingClientRect();
      if (overlayRect.width < 1 || overlayRect.height < 1) return;

      const rect = imgEl.getBoundingClientRect();
      const scaleX = overlayEl.width / overlayRect.width;
      const scaleY = overlayEl.height / overlayRect.height;

      const left = (rect.left - overlayRect.left) * scaleX;
      const top = (rect.top - overlayRect.top) * scaleY;
      const right = (rect.right - overlayRect.left) * scaleX;
      const bottom = (rect.bottom - overlayRect.top) * scaleY;

      if (right - left < 48 || bottom - top < 48) return;

      outerGuides.left = left - centerX;
      outerGuides.right = right - centerX;
      outerGuides.top = top - centerY;
      outerGuides.bottom = bottom - centerY;

      const oxH = outerGuides.bottom - outerGuides.top;
      const oxW = outerGuides.right - outerGuides.left;

      innerGuides.top = outerGuides.top + oxH * guideInsetY;
      innerGuides.bottom = outerGuides.bottom - oxH * guideInsetY;
      innerGuides.left = outerGuides.left + oxW * guideInsetX;
      innerGuides.right = outerGuides.right - oxW * guideInsetX;

      for (const key of Object.keys(handleDisplay)) delete handleDisplay[key];
    }

    function scheduleFitGuidesToImage() {
      requestAnimationFrame(() => {
        fitGuidesToImage();
        scheduleDrawOverlay();
      });
    }

    function fitToImage() {
      // Fit using CSS layout size at zoom=1 — naturalWidth ignores max-width/max-height on .cardImage
      if (!imgEl || !overlayEl || !imgEl.naturalWidth) return;

      const { r, tx, ty } = readTransformState();
      applyImageTransform(1, r, tx, ty);
      applyPanTransform(0, 0);

      const { w: dw, h: dh } = getImageDisplaySize();
      const targetW = overlayEl.clientWidth * 0.92;
      const targetH = overlayEl.clientHeight * 0.9;
      const scale = Math.max(0.1, Math.min(Math.min(targetW / dw, targetH / dh), 3));
      controls.zoom.value = String(scale);
      controls.panX.value = '0';
      controls.panY.value = '0';
      updateTransform();
      scheduleFitGuidesToImage();
    }

    // expose controls to the component-level buttons via refs
    resetRef.current = resetAll;
    redrawRef.current = () => scheduleDrawOverlay();

    const sliderBindings: Array<{ el: HTMLInputElement; type: string; fn: EventListener }> = [];
    (['zoom', 'rotate', 'tiltX', 'tiltY'] as const).forEach((id) => {
      const el = controls[id];
      if (!el) return;
      const onInput = () => scheduleTransformUpdate(id);
      const onBegin = () => {
        transformSliderActive = true;
        activeTransformId = id;
        setImageDragVisual(true);
      };
      const onCommit = () => commitTransformSlider();
      el.addEventListener('input', onInput);
      el.addEventListener('pointerdown', onBegin);
      el.addEventListener('pointerup', onCommit);
      el.addEventListener('pointercancel', onCommit);
      el.addEventListener('change', onCommit);
      sliderBindings.push({ el, type: 'input', fn: onInput });
      sliderBindings.push({ el, type: 'pointerdown', fn: onBegin });
      sliderBindings.push({ el, type: 'pointerup', fn: onCommit });
      sliderBindings.push({ el, type: 'pointercancel', fn: onCommit });
      sliderBindings.push({ el, type: 'change', fn: onCommit });
    });

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
      if (transformSliderActive || dragging === 'pinch' || dragging === 'image') return;
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

    function scheduleGrade(result: CenteringScore) {
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
      if (bgCacheW !== overlayEl.width || bgCacheH !== overlayEl.height) rebuildBgCache();
      ctx.clearRect(0, 0, overlayEl.width, overlayEl.height);
      if (bgCache) ctx.drawImage(bgCache, 0, 0);

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
      const fastDraw = isOverlayFastMode();
      const liteDraw = fastDraw || isCoarsePointer;
      drawModernFrame(oxL, oyT, oxW, oxH, colorOuter, outerAlpha, mode === 'edge' || mode === 'both', liteDraw);

      // Art border (inner) — rounded glow frame
      drawModernFrame(ixL, iyT, ixR - ixL, iyB - iyT, colorInner, innerAlpha, mode === 'border' || mode === 'both', liteDraw);

      // Identification labels (desktop only — low value on small touch screens)
      if (!liteDraw) {
        if (mode === 'edge' || mode === 'both') drawLabel(oxL, oyT, toolLabelsRef.current.canvasEdge, colorOuter);
        if (mode === 'border' || mode === 'both') drawLabel(ixL, iyT, toolLabelsRef.current.canvasBorder, colorInner);
      }

      // Draggable handles — slide smoothly when stagger position changes
      const handles = resolveHandles();
      handles.forEach((h) => {
        const isOuter = h.name.startsWith('outer');
        const color = isOuter ? colorOuter : colorInner;
        const active = dragging === h.name;
        if (active) drawActiveEdgeHighlight(h.name, color);
        drawHandle(h.x, h.y, h.anchorX, h.anchorY, color, active, h.vertical);
      });

      if (!fastDraw) {
        drawLoupes();
        if (shouldCalculateGradeNow()) calculateCentering();
      }
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

    function drawModernFrame(x: number, y: number, w: number, h: number, color: string, alpha: number, emphasized: boolean, lite = false) {
      if (w < 4 || h < 4) return;
      const radius = Math.min(10, w * 0.022, h * 0.016);

      ctx.save();
      ctx.globalAlpha = alpha;

      if (!lite) {
        ctx.shadowColor = color;
        ctx.shadowBlur = emphasized ? 20 : 12;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lite ? 1.25 : emphasized ? 1.75 : 1.25;
      roundRectPath(x, y, w, h, radius);
      ctx.stroke();

      if (!lite) {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        roundRectPath(x + 0.5, y + 0.5, Math.max(0, w - 1), Math.max(0, h - 1), Math.max(0, radius - 0.5));
        ctx.stroke();
      }

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
      ctx.font = '600 12px var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
      const dotR = 3;
      const gap = 6;
      const padX = 8;
      const tw = ctx.measureText(text).width;
      const w = tw + padX * 2 + dotR * 2 + gap;
      const h = 18;
      const ly = y - h - 7;

      roundRectPath(x, ly, w, h, 9);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + padX + dotR, ly + h / 2, dotR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(17, 24, 39, 0.92)';
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
      const outerR = active ? (isCoarsePointer ? 18 : 14) : (isCoarsePointer ? 16 : 12);
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
      ctx.fillStyle = active ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)';
      ctx.globalAlpha = 1;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(px, py, outerR, 0, Math.PI * 2);
      ctx.fillStyle = active ? color : 'rgba(255, 255, 255, 0.95)';
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
      const shortViewport = isCoarsePointer && overlayEl.height < 560;
      const perpOff = isCoarsePointer ? (shortViewport ? 26 : 32) : 20;
      const closeGap = isCoarsePointer ? (shortViewport ? 48 : 58) : 46;

      const place = (
        name: string,
        anchorX: number,
        anchorY: number,
        vertical: boolean,
        normal: { x: number; y: number },
        mix: number,
      ) => {
        if (!both) {
          list.push({ name, x: anchorX, y: anchorY, anchorX, anchorY, vertical });
          return;
        }

        let nx = normal.x;
        let ny = normal.y;
        // On touch screens keep outer knobs inside the workspace (not under chrome / off-screen).
        if (isCoarsePointer && name.startsWith('outer')) {
          nx = -nx;
          ny = -ny;
        }

        const p = perpOff * mix;
        list.push({
          name,
          x: anchorX + nx * p,
          y: anchorY + ny * p,
          anchorX,
          anchorY,
          vertical,
        });
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

      // Touch: pull knobs out from under chrome so blue/pink frames stay draggable on small screens.
      return isCoarsePointer ? list.map(clampHandleToSafeArea) : list;
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
        if (isCoarsePointer || Math.hypot(dx, dy) <= HANDLE_SNAP_PX) {
          handleDisplay[t.name] = { x: t.x, y: t.y };
          continue;
        }
        handleDisplay[t.name] = {
          x: prev.x + dx * HANDLE_SLIDE,
          y: prev.y + dy * HANDLE_SLIDE,
        };
        animating = true;
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

    function distanceToSegment(
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }

    function guideSegmentForHandle(name: string) {
      const oxL = centerX + outerGuides.left;
      const oxR = centerX + outerGuides.right;
      const oyT = centerY + outerGuides.top;
      const oyB = centerY + outerGuides.bottom;
      const ixL = centerX + innerGuides.left;
      const ixR = centerX + innerGuides.right;
      const iyT = centerY + innerGuides.top;
      const iyB = centerY + innerGuides.bottom;

      switch (name) {
        case 'outerTop':
          return { x1: oxL, y1: oyT, x2: oxR, y2: oyT };
        case 'outerBottom':
          return { x1: oxL, y1: oyB, x2: oxR, y2: oyB };
        case 'outerLeft':
          return { x1: oxL, y1: oyT, x2: oxL, y2: oyB };
        case 'outerRight':
          return { x1: oxR, y1: oyT, x2: oxR, y2: oyB };
        case 'innerTop':
          return { x1: ixL, y1: iyT, x2: ixR, y2: iyT };
        case 'innerBottom':
          return { x1: ixL, y1: iyB, x2: ixR, y2: iyB };
        case 'innerLeft':
          return { x1: ixL, y1: iyT, x2: ixL, y2: iyB };
        case 'innerRight':
          return { x1: ixR, y1: iyT, x2: ixR, y2: iyB };
        default:
          return null;
      }
    }

    function guideMarginBand(px: number, py: number): 'outside' | 'margin' | 'inside' {
      const oxL = centerX + outerGuides.left;
      const oxR = centerX + outerGuides.right;
      const oyT = centerY + outerGuides.top;
      const oyB = centerY + outerGuides.bottom;
      const ixL = centerX + innerGuides.left;
      const ixR = centerX + innerGuides.right;
      const iyT = centerY + innerGuides.top;
      const iyB = centerY + innerGuides.bottom;

      if (px < oxL || px > oxR || py < oyT || py > oyB) return 'outside';
      if (px >= ixL && px <= ixR && py >= iyT && py <= iyB) return 'inside';
      return 'margin';
    }

    function handlePickScore(
      name: string,
      mouseX: number,
      mouseY: number,
      dist: number,
      anchorDist = 0,
    ) {
      let score = dist + anchorDist * 0.12;
      if (!isCoarsePointer) return score;

      const band = guideMarginBand(mouseX, mouseY);
      const isOuter = name.startsWith('outer');
      if (band === 'margin') {
        if (isOuter) score *= 0.45;
        else score *= 1.35;
      } else if (band === 'inside' && !isOuter) {
        score *= 0.82;
      } else if (band === 'outside' && isOuter) {
        score *= 0.75;
      }
      return score;
    }

    function beginHandleDrag(handleHit: string, e: any, mouseX: number, mouseY: number) {
      if (e.touches) e.preventDefault();
      dismissChromeRef.current();
      pendingTouch = null;
      dragging = handleHit;
      if (isOuterHandle(handleHit)) {
        uploadCallbacksRef.current.setOuterAligned(true);
      } else if (isInnerHandle(handleHit)) {
        uploadCallbacksRef.current.setInnerAligned(true);
      }
      guideRef.current.onHandleDrag(handleHit);
      captureDragOffset(handleHit, mouseX, mouseY);
      try { document.body.style.overflow = 'hidden'; } catch {}
      scheduleDrawOverlay();
    }

    function pickHandleAt(mouseX: number, mouseY: number, opts?: { knobsOnly?: boolean }): string | null {
      const handles = resolveHandles();
      const knobR = getHandleRadius();
      let best: { name: string; dist: number } | null = null;
      for (const h of handles) {
        const dist = Math.hypot(mouseX - h.x, mouseY - h.y);
        if (dist > knobR) continue;
        const anchorDist = Math.hypot(mouseX - h.anchorX, mouseY - h.anchorY);
        const score = handlePickScore(h.name, mouseX, mouseY, dist, anchorDist);
        if (!best || score < best.dist) best = { name: h.name, dist: score };
      }
      if (best) return best.name;
      if (opts?.knobsOnly) return null;

      let lineBest: { name: string; dist: number } | null = null;
      for (const h of handles) {
        const seg = guideSegmentForHandle(h.name);
        if (!seg) continue;
        const dist = distanceToSegment(mouseX, mouseY, seg.x1, seg.y1, seg.x2, seg.y2);
        const hitLimit = h.name.startsWith('outer') ? outerLineHitRadius : lineHitRadius;
        if (dist > hitLimit) continue;
        const score = handlePickScore(h.name, mouseX, mouseY, dist);
        if (!lineBest || score < lineBest.dist) lineBest = { name: h.name, dist: score };
      }
      return lineBest?.name ?? null;
    }

    /**
     * Touch rescue: outer (blue) frame often sits under chrome or off the knob.
     * Allow a tight line grab only for outer edges, and only outside / in the margin
     * so center pans are not stolen.
     */
    function pickOuterLineAt(mouseX: number, mouseY: number): string | null {
      if (!isCoarsePointer) return null;
      const mode = guideModeRef.current;
      if (mode === 'border') return null;

      const band = guideMarginBand(mouseX, mouseY);
      if (band === 'inside') return null;

      const names = ['outerTop', 'outerBottom', 'outerLeft', 'outerRight'] as const;
      let best: { name: string; dist: number } | null = null;
      for (const name of names) {
        const seg = guideSegmentForHandle(name);
        if (!seg) continue;
        const dist = distanceToSegment(mouseX, mouseY, seg.x1, seg.y1, seg.x2, seg.y2);
        if (dist > outerLineHitRadius) continue;
        const score = handlePickScore(name, mouseX, mouseY, dist);
        if (!best || score < best.dist) best = { name, dist: score };
      }
      return best?.name ?? null;
    }

    function pickOuterHandleNearEdge(_mouseX: number, _mouseY: number): string | null {
      /* Broad edge-band grab retired — stole pans on touch. Use pickOuterLineAt instead. */
      return null;
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

    type LoupeCorner = 'tl' | 'tr' | 'bl' | 'br';

    function loupeCornerMeta(key: LoupeCorner) {
      switch (key) {
        case 'tl':
          return { sx: 1, sy: 1, arcStart: Math.PI, arcEnd: Math.PI * 1.5 };
        case 'tr':
          return { sx: -1, sy: 1, arcStart: Math.PI * 1.5, arcEnd: Math.PI * 2 };
        case 'bl':
          return { sx: 1, sy: -1, arcStart: Math.PI * 0.5, arcEnd: Math.PI };
        default:
          return { sx: -1, sy: -1, arcStart: 0, arcEnd: Math.PI * 0.5 };
      }
    }

    function filletRadiusFromPointer(key: LoupeCorner, lx: number, ly: number) {
      const { sx, sy } = loupeCornerMeta(key);
      return Math.max(0, Math.max(sx * lx, sy * ly));
    }

    function drawLoupeFilletGuides(
      lctx: CanvasRenderingContext2D,
      key: LoupeCorner,
      R: number,
      baseToLoupe: number,
      ringStep: number,
      edgeColor: string,
    ) {
      const { sx, sy, arcStart, arcEnd } = loupeCornerMeta(key);
      const visibleBase = R / baseToLoupe;
      // Blue edge legs always span to the loupe rim (clip handles the circle)
      const edgeLen = R;
      const filletBase = refRadius > 0 ? refRadius : DEFAULT_FILLET_RADIUS;

      lctx.save();
      lctx.translate(R, R);

      // Straight edge legs from the corner tip (card extends inward along +sx / +sy)
      // Dark under-stroke + bright edge so lines stay readable on light/dark card art
      lctx.setLineDash([]);
      lctx.lineCap = 'round';
      lctx.lineJoin = 'round';
      lctx.globalAlpha = 1;
      lctx.strokeStyle = 'rgba(0, 0, 0, 0.72)';
      lctx.lineWidth = isCoarsePointer ? 4.5 : 3.75;
      lctx.beginPath();
      lctx.moveTo(0, 0);
      lctx.lineTo(sx * edgeLen, 0);
      lctx.moveTo(0, 0);
      lctx.lineTo(0, sy * edgeLen);
      lctx.stroke();
      lctx.strokeStyle = edgeColor;
      lctx.shadowColor = edgeColor;
      lctx.shadowBlur = isCoarsePointer ? 8 : 6;
      lctx.lineWidth = isCoarsePointer ? 2.75 : 2.35;
      lctx.beginPath();
      lctx.moveTo(0, 0);
      lctx.lineTo(sx * edgeLen, 0);
      lctx.moveTo(0, 0);
      lctx.lineTo(0, sy * edgeLen);
      lctx.stroke();
      lctx.shadowBlur = 0;

      // Stepped quarter-arc guides — same fillet R in every loupe
      lctx.strokeStyle = 'rgba(255,255,255,0.28)';
      lctx.lineWidth = 1.15;
      lctx.setLineDash([2, 3]);
      for (let k = 1; k * ringStep <= visibleBase + ringStep; k++) {
        const rr = k * ringStep * baseToLoupe;
        if (rr > R * 1.45) break;
        lctx.beginPath();
        lctx.arc(sx * rr, sy * rr, rr, arcStart, arcEnd);
        lctx.stroke();
      }
      lctx.setLineDash([]);

      // Corner tip
      lctx.fillStyle = '#fde047';
      lctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
      lctx.lineWidth = 1.25;
      lctx.beginPath();
      lctx.arc(0, 0, isCoarsePointer ? 3.25 : 2.75, 0, Math.PI * 2);
      lctx.fill();
      lctx.stroke();

      // Yellow fillet always shown (default radius until user drags)
      {
        const rr = filletBase * baseToLoupe;
        const cx = sx * rr;
        const cy = sy * rr;

        // Tangent marks where the curve meets each straight edge
        lctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
        lctx.lineWidth = 1.15;
        lctx.beginPath();
        lctx.moveTo(0, cy);
        lctx.lineTo(cx, cy);
        lctx.moveTo(cx, 0);
        lctx.lineTo(cx, cy);
        lctx.stroke();

        // Fillet centre (shared R is distance from each edge)
        lctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
        lctx.beginPath();
        lctx.arc(cx, cy, 2.4, 0, Math.PI * 2);
        lctx.fill();

        // Adjustable corner-radius arc
        lctx.shadowColor = '#fde047';
        lctx.shadowBlur = 7;
        lctx.strokeStyle = '#fde047';
        lctx.lineWidth = 2.15;
        lctx.beginPath();
        lctx.arc(cx, cy, rr, arcStart, arcEnd);
        lctx.stroke();
        lctx.shadowBlur = 0;

        lctx.strokeStyle = 'rgba(255,255,255,0.32)';
        lctx.lineWidth = 0.75;
        lctx.beginPath();
        lctx.arc(cx, cy, rr, arcStart, arcEnd);
        lctx.stroke();
      }

      lctx.restore();
    }

    function drawLoupes() {
      if (!loupesOnRef.current) return;

      // Read the live transform once — shared by every loupe this frame.
      const z = parseFloat(controls.zoom.value) || 1;
      const rz = ((parseFloat(controls.rotate.value) || 0) * Math.PI) / 180;
      // Same effective 3D angles the card image uses (see updateTransform).
      const ax = ((parseFloat(controls.tiltX.value) || 0) * Math.PI) / 180;
      const ay = ((-(parseFloat(controls.tiltY.value) || 0)) * Math.PI) / 180;
      const px = parseInt(controls.panX.value || '0');
      const py = parseInt(controls.panY.value || '0');
      const persp = PERSPECTIVE;
      const imgReady = !!(imgEl.src && imgEl.complete && imgEl.naturalWidth > 0);
      const imgBw = imgReady ? (imgEl.offsetWidth || imgEl.naturalWidth) : 0;
      const imgBh = imgReady ? (imgEl.offsetHeight || imgEl.naturalHeight) : 0;
      const m = loupeMagRef.current;

      const project = (bx: number, by: number) => {
        let x = bx, y = by, zc = 0;
        let nx = x * Math.cos(ay) + zc * Math.sin(ay);
        let nz = -x * Math.sin(ay) + zc * Math.cos(ay);
        x = nx; zc = nz;
        let ny = y * Math.cos(ax) - zc * Math.sin(ax);
        nz = y * Math.sin(ax) + zc * Math.cos(ax);
        y = ny; zc = nz;
        nx = x * Math.cos(rz) - y * Math.sin(rz);
        ny = x * Math.sin(rz) + y * Math.cos(rz);
        x = nx; y = ny;
        x *= z; y *= z;
        x += px; y += py;
        const s = persp / (persp - zc);
        return { x: centerX + x * s, y: centerY + y * s };
      };

      // Leader lines: loupe center → card corner (same overlay pass; CSS loupes sit above)
      const overlayRect = overlayEl.getBoundingClientRect();
      if (overlayRect.width > 1 && overlayRect.height > 1) {
        const scaleX = overlayEl.width / overlayRect.width;
        const scaleY = overlayEl.height / overlayRect.height;
        const dash = isCoarsePointer ? ([5, 5] as number[]) : ([4, 4] as number[]);
        const lineW = isCoarsePointer ? 2 : 1.35;
        const tipR = isCoarsePointer ? 3.5 : 2.5;
        ctx.save();
        (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
          const el = loupeEls[key];
          if (!el) return;
          const lr = el.getBoundingClientRect();
          if (lr.width < 8) return;
          const fromX = (lr.left + lr.width / 2 - overlayRect.left) * scaleX;
          const fromY = (lr.top + lr.height / 2 - overlayRect.top) * scaleY;
          const S = loupeCorner(key);
          const dx = S.x - fromX;
          const dy = S.y - fromY;
          const len = Math.hypot(dx, dy);
          if (len < 12) return;
          const insetFrom = Math.min(lr.width * 0.42 * scaleX, len * 0.22);
          const insetTo = Math.min(10, len * 0.08);
          const ux = dx / len;
          const uy = dy / len;
          ctx.strokeStyle = colorOuter;
          ctx.globalAlpha = isCoarsePointer ? 0.72 : 0.55;
          ctx.lineWidth = lineW;
          ctx.lineCap = 'round';
          ctx.setLineDash(dash);
          ctx.beginPath();
          ctx.moveTo(fromX + ux * insetFrom, fromY + uy * insetFrom);
          ctx.lineTo(S.x - ux * insetTo, S.y - uy * insetTo);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(S.x, S.y, tipR, 0, Math.PI * 2);
          ctx.fillStyle = colorOuter;
          ctx.globalAlpha = isCoarsePointer ? 0.9 : 0.75;
          ctx.fill();
        });
        ctx.restore();
      }

      (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
        const el = loupeEls[key];
        if (!el) return;
        const size = el.clientWidth;
        if (size < 8) return;
        const dpr = window.devicePixelRatio || 1;
        if (loupeSizeCache[key] !== size) {
          loupeSizeCache[key] = size;
          const target = Math.round(size * dpr);
          el.width = target;
          el.height = target;
        }
        const lctx = el.getContext('2d');
        if (!lctx) return;
        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.clearRect(0, 0, size, size);
        const R = size / 2;

        lctx.save();
        lctx.beginPath();
        lctx.arc(R, R, R, 0, Math.PI * 2);
        lctx.clip();
        lctx.fillStyle = '#FBFAF6';
        lctx.fillRect(0, 0, size, size);

        const S = loupeCorner(key);

        if (imgReady) {
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
          const filterMode = imageFilterRef.current;
          // Relief: draw one-shot baked bitmap (no per-frame convolution / fragile canvas url()).
          if (filterMode === 'relief') {
            const baked = reliefBitmapRef.current;
            if (baked) {
              lctx.filter = 'none';
              lctx.drawImage(baked, -imgBw / 2, -imgBh / 2, imgBw, imgBh);
            } else {
              lctx.filter = RELIEF_LOUPE_PENDING_FILTER;
              lctx.drawImage(imgEl, -imgBw / 2, -imgBh / 2, imgBw, imgBh);
            }
          } else {
            const loupeFilter = cssImageFilter(filterMode);
            if (loupeFilter !== 'none') lctx.filter = loupeFilter;
            lctx.drawImage(imgEl, -imgBw / 2, -imgBh / 2, imgBw, imgBh);
          }
          lctx.restore();
        } else {
          lctx.fillStyle = 'rgba(255,255,255,0.25)';
          lctx.font = '600 12px var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
          lctx.textAlign = 'center';
          lctx.textBaseline = 'middle';
          lctx.fillText(toolLabelsRef.current.noImage, R, R);
        }

        // Corner fillet guides — quarter arcs aligned to each card corner
        const baseToLoupe = m * z;
        const niceSteps = [1, 2, 5, 10, 20, 50, 100, 200];
        const ringStep = niceSteps.find((s) => s * baseToLoupe >= 16) ?? 200;
        drawLoupeFilletGuides(lctx, key, R, baseToLoupe, ringStep, colorOuter);

        lctx.restore(); // end clip

        // Rim
        lctx.save();
        lctx.strokeStyle = 'rgba(255,255,255,0.18)';
        lctx.lineWidth = 2;
        lctx.beginPath();
        lctx.arc(R, R, R - 1, 0, Math.PI * 2);
        lctx.stroke();
        lctx.restore();
      });
    }

    function calculateCentering() {
      const measurement = measureFromGuides(outerGuides, innerGuides);
      const result = scoreCentering(
        measurement,
        gradingCompanyRef.current,
        CARD_FACE,
      );

      if (!lastGradeSnapshot || !gradesEqual(lastGradeSnapshot, result)) {
        lastGradeSnapshot = result;
        if (isGuideDrag()) scheduleGrade(result);
        else setGrade(result);
        drawPlot(result.lr, result.tb, result);
      }
    }

    function drawPlot(lr: number, tb: number, score: CenteringScore) {
      const dpr = plotDprCap;
      const cw = plotCanvasEl.clientWidth;
      const ch = plotCanvasEl.clientHeight;
      if (cw < 8 || ch < 8) return;
      if (plotW !== cw || plotH !== ch || plotDpr !== dpr) {
        plotW = cw;
        plotH = ch;
        plotDpr = dpr;
        plotCanvasEl.width = Math.round(cw * dpr);
        plotCanvasEl.height = Math.round(ch * dpr);
        plotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
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


      // Draw axis-aligned grade zones for selected company
      const zones = getPlotZoneRects(score.company, score.face);

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
      const companyZones = toolLabelsRef.current.zones[score.company];
      const zoneCopy = companyZones[score.overall as keyof typeof companyZones];
      const zoneLabel = zoneCopy?.label ?? score.overall;

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

    function getAngle(t1: Touch, t2: Touch) {
      return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
    }

    function normalizeAngleDelta(deltaRad: number) {
      let d = deltaRad;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    function readTransformState() {
      const z = parseFloat(controls.zoom.value);
      const r = parseFloat(controls.rotate.value);
      const tx = parseFloat(controls.tiltX.value);
      const ty = parseFloat(controls.tiltY.value);
      const px = parseInt(controls.panX.value || '0', 10);
      const py = parseInt(controls.panY.value || '0', 10);
      return { z, r, tx, ty, px, py };
    }

    function applyImageTransformFast(z: number, r: number) {
      const { tx, ty } = readTransformState();
      applyImageTransform(z, r, tx, ty);
      pendingPinchZoom = z;
      pendingPinchRotate = r;
    }

    function beginPinch(touches: TouchList) {
      dismissChromeRef.current();
      setImageDragVisual(true);
      dragging = 'pinch';
      initialPinchDistance = getDistance(touches[0], touches[1]);
      initialPinchAngle = getAngle(touches[0], touches[1]);
      initialZoom = parseFloat(controls.zoom.value);
      initialRotate = parseFloat(controls.rotate.value);
      pendingPinchZoom = initialZoom;
      pendingPinchRotate = initialRotate;
      try { document.body.style.overflow = 'hidden'; } catch {}
    }

    function applyPinchFrame(x1: number, y1: number, x2: number, y2: number) {
      const scaleChange = Math.hypot(x2 - x1, y2 - y1) / (initialPinchDistance || 1);
      const z = Math.max(0.1, Math.min(3, initialZoom * scaleChange));
      /* Coarse: pinch = zoom only — accidental rotate is hard to undo. */
      if (isCoarsePointer) {
        applyImageTransformFast(z, initialRotate);
        return;
      }
      const deltaRad = normalizeAngleDelta(Math.atan2(y2 - y1, x2 - x1) - initialPinchAngle);
      const r = Math.max(-20, Math.min(20, initialRotate + deltaRad * (180 / Math.PI)));
      applyImageTransformFast(z, r);
    }

    function schedulePinchFrame(t1: Touch, t2: Touch) {
      pinchSample = { x1: t1.clientX, y1: t1.clientY, x2: t2.clientX, y2: t2.clientY };
      if (pinchRaf) return;
      pinchRaf = requestAnimationFrame(() => {
        pinchRaf = 0;
        if (!pinchSample) return;
        const { x1, y1, x2, y2 } = pinchSample;
        applyPinchFrame(x1, y1, x2, y2);
      });
    }

    function commitPinch() {
      if (pinchRaf) {
        cancelAnimationFrame(pinchRaf);
        pinchRaf = 0;
      }
      pinchSample = null;
      if (pendingPinchZoom != null) controls.zoom.value = String(pendingPinchZoom);
      if (pendingPinchRotate != null) controls.rotate.value = String(pendingPinchRotate);
      pendingPinchZoom = null;
      pendingPinchRotate = null;
      setImageDragVisual(false);
      updateTransform();
    }

    function getPointerPos(e: any) {
      if (e.touches && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    }

    function findTouch(touches: TouchList, id: number) {
      return Array.from(touches).find((t) => t.identifier === id);
    }

    function pointerDown(e: any) {
      if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        pendingTouch = null;
        beginPinch(e.touches);
        return;
      }

      const pos = getPointerPos(e);
      const rect = overlayEl.getBoundingClientRect();
      const mouseX = pos.clientX - rect.left;
      const mouseY = pos.clientY - rect.top;
      const touchPath = !!(e.touches && e.touches.length === 1);

      const handleHit = touchPath
        ? (pickHandleAt(mouseX, mouseY, { knobsOnly: true }) ?? pickOuterLineAt(mouseX, mouseY))
        : (pickHandleAt(mouseX, mouseY) ?? pickOuterHandleNearEdge(mouseX, mouseY));
      if (handleHit) {
        beginHandleDrag(handleHit, e, mouseX, mouseY);
        return;
      }

      if (touchPath) {
        const t = e.touches[0];
        pendingTouch = { id: t.identifier, startX: t.clientX, startY: t.clientY };
        lastPointerX = t.clientX;
        lastPointerY = t.clientY;
        return;
      }

      dragging = 'image';
      beginImagePan(pos.clientX, pos.clientY);
      overlayEl.style.cursor = 'grabbing';
      try { document.body.style.overflow = 'hidden'; } catch {}
    }

    function pointerMove(e: any) {
      if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        pendingTouch = null;
        if (dragging !== 'pinch') beginPinch(e.touches);
        schedulePinchFrame(e.touches[0], e.touches[1]);
        return;
      }

      if (pendingTouch && e.touches) {
        const t = findTouch(e.touches, pendingTouch.id);
        if (t) {
          const dx = t.clientX - pendingTouch.startX;
          const dy = t.clientY - pendingTouch.startY;
          if (Math.hypot(dx, dy) < TOUCH_PAN_SLOP) return;

          const rect = overlayEl.getBoundingClientRect();
          const touchX = t.clientX - rect.left;
          const touchY = t.clientY - rect.top;
          /* After slop: knob first, then outer blue line rescue — never inner lines (steal pans). */
          const deferredHandle =
            pickHandleAt(touchX, touchY, { knobsOnly: true }) ?? pickOuterLineAt(touchX, touchY);
          if (deferredHandle) {
            beginHandleDrag(deferredHandle, e, touchX, touchY);
            return;
          }

          e.preventDefault();
          pendingTouch = null;
          dragging = 'image';
          overlayEl.style.cursor = 'grabbing';
          try { document.body.style.overflow = 'hidden'; } catch {}
          beginImagePan(t.clientX, t.clientY);
        }
      }

      if (!dragging) return;
      e.preventDefault();

      const pos = getPointerPos(e);

      if (dragging === 'image') {
        schedulePanFrame(pos.clientX, pos.clientY);
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
      pendingTouch = null;

      if (dragging === 'pinch') {
        if (e?.touches && e.touches.length === 1) {
          commitPinch();
          dragging = null;
          try { document.body.style.overflow = ''; } catch {}
          return;
        }
        if (!e?.touches || e.touches.length === 0) {
          commitPinch();
        }
      }

      if (!e || !e.touches || e.touches.length === 0) {
        const wasImageDrag = dragging === 'image';
        const wasGuideDrag = isGuideDrag();
        dragOffsetX = 0;
        dragOffsetY = 0;
        dragging = null;
        overlayEl.style.cursor = 'grab';
        if (wasImageDrag) {
          commitPan();
          setImageDragVisual(false);
          updateTransform();
        } else if (wasGuideDrag && isCoarsePointer) {
          lastGradeCalcMs = 0;
          scheduleDrawOverlay();
        } else {
          flushGrade();
          scheduleDrawOverlay();
        }
        try { document.body.style.overflow = ''; } catch {}
      }
    }

    const toolRoot = document.getElementById('centering-analyzer');

    const blockSelection = (e: Event) => e.preventDefault();

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('button, a, label, [role="button"], input, textarea, select');
    };

    const workspaceTouchCapture = (e: TouchEvent) => {
      if (isInteractiveTarget(e.target)) return;
      if (e.touches.length >= 2) e.preventDefault();
    };

    const clearToolSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const node = sel.anchorNode;
      if (!node) return;
      const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
      if (el && toolRoot?.contains(el)) {
        sel.removeAllRanges();
      }
    };

    overlayEl.addEventListener('mousedown', pointerDown as any);
    window.addEventListener('mousemove', pointerMove as any, { passive: false });
    window.addEventListener('mouseup', pointerUp as any);

    workspaceEl.addEventListener('touchstart', workspaceTouchCapture, { passive: false, capture: true });
    workspaceEl.addEventListener('selectstart', blockSelection, true);
    workspaceEl.addEventListener('contextmenu', blockSelection, true);
    workspaceEl.addEventListener('dragstart', blockSelection, true);
    toolRoot?.addEventListener('selectstart', blockSelection, true);
    toolRoot?.addEventListener('contextmenu', blockSelection, true);
    document.addEventListener('selectionchange', clearToolSelection);

    overlayEl.addEventListener('touchstart', pointerDown as any, { passive: false });
    window.addEventListener('touchmove', pointerMove as any, { passive: false });
    window.addEventListener('touchend', pointerUp as any);
    window.addEventListener('touchcancel', pointerUp as any);

    // --- Loupe corner-radius arc interaction ---
    function setRefFromEvent(key: string, e: any) {
      const el = loupeEls[key as LoupeCorner];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pos = getPointerPos(e);
      const size = el.clientWidth;
      const lx = pos.clientX - rect.left - size / 2;
      const ly = pos.clientY - rect.top - size / 2;
      const z = parseFloat(controls.zoom.value) || 1;
      const baseToLoupe = loupeMagRef.current * z;
      // Fillet radius = inset along either card edge from the corner tip
      refRadius = filletRadiusFromPointer(key as LoupeCorner, lx, ly) / baseToLoupe;
      scheduleDrawOverlay();
    }
    const loupeBindings: Array<{ el: HTMLCanvasElement; type: string; fn: any }> = [];
    (['tl', 'tr', 'bl', 'br'] as const).forEach((key) => {
      const el = loupeEls[key];
      if (!el) return;
      const down = (e: any) => { e.preventDefault(); e.stopPropagation(); loupeDrag = key; setRefFromEvent(key, e); };
      const dbl = () => { refRadius = DEFAULT_FILLET_RADIUS; drawLoupes(); };
      const wheel = (e: any) => {
        e.preventDefault();
        const dir = e.deltaY > 0 ? -1 : 1;
        const next = Math.min(5, Math.max(1.5, +(loupeMagRef.current + dir * 0.2).toFixed(2)));
        loupeMagRef.current = next;
        setLoupeMagUiRef.current(next);
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
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (pinchRaf) cancelAnimationFrame(pinchRaf);
      if (transformRaf) cancelAnimationFrame(transformRaf);
      if (panRaf) cancelAnimationFrame(panRaf);
      resetRef.current = null;
      redrawRef.current = null;
      window.removeEventListener('resize', onResize);
      uploadEl.removeEventListener('change', uploadHandler);
      sliderBindings.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      overlayEl.removeEventListener('mousedown', pointerDown as any);
      window.removeEventListener('mousemove', pointerMove as any);
      window.removeEventListener('mouseup', pointerUp as any);
      workspaceEl.removeEventListener('touchstart', workspaceTouchCapture, true);
      workspaceEl.removeEventListener('selectstart', blockSelection, true);
      workspaceEl.removeEventListener('contextmenu', blockSelection, true);
      workspaceEl.removeEventListener('dragstart', blockSelection, true);
      toolRoot?.removeEventListener('selectstart', blockSelection, true);
      toolRoot?.removeEventListener('contextmenu', blockSelection, true);
      document.removeEventListener('selectionchange', clearToolSelection);
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

  const displayScore = grade
    ? scoreCentering({ lr: grade.lr, tb: grade.tb }, gradingCompany, CARD_FACE)
    : null;
  const zone = displayScore?.overall ?? null;
  const zoneCopy =
    displayScore && zone
      ? tool.zones[gradingCompany][zone as keyof (typeof tool.zones)[typeof gradingCompany]]
      : null;
  const verdictKey = displayScore && photoMode === 'slab' ? verdictForQuality(displayScore.quality) : null;
  const verdictCopy = verdictKey ? tool.verdicts[verdictKey] : null;
  const fmt = (n?: number) => (typeof n === 'number' ? n.toFixed(1) : '—');
  const imageFilterLabels: Record<ImageFilterMode, string> = {
    off: tool.imageFilterOff,
    contrast: tool.imageFilterContrast,
    invert: tool.imageFilterInvert,
    relief: tool.imageFilterRelief,
  };
  const imageFilterHints: Record<ImageFilterMode, string> = {
    off: tool.imageFilterOffHint,
    contrast: tool.imageFilterContrastHint,
    invert: tool.imageFilterInvertHint,
    relief: tool.imageFilterReliefHint,
  };
  const imageFilterLabel = imageFilterLabels[imageFilterMode];
  const isUploading = uploadState === 'loading';
  const guideActive = !guide.guideDismissed;
  const showEmptyPlate = !imageReady && uploadState !== 'loading';
  const showGradePillMotion = Boolean(displayScore) || Boolean(photoMode === 'slab' && verdictCopy);
  const gradePillSub =
    zoneCopy?.short ??
    (displayScore
      ? displayScore.overall
      : guideActive && imageReady && guide.activeStep < 3
        ? (howToSteps[guide.activeStep]?.name ?? tool.alignGuides)
        : imageReady && !outerAligned && !innerAligned
          ? tool.dragHandlesHint
          : tool.alignGuides);

  useCenteringToolMotion({
    emptyPlateRef,
    adjustDockRef,
    gradePillRef,
    adjustOpen,
    showGradePill: showGradePillMotion,
    showEmpty: showEmptyPlate,
  });

  const triggerUpload = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const toggleAdjustSheet = () => {
    setAdjustOpen((open) => {
      if (!open) setSetupOpen(false);
      return !open;
    });
  };

  const toggleSetupSheet = () => {
    setSetupOpen((open) => {
      if (!open) setAdjustOpen(false);
      return !open;
    });
  };

  const closeChromeSheets = () => {
    setAdjustOpen(false);
    setSetupOpen(false);
  };

  useSubHeader({
    variant: 'tool',
    layout: 'bar',
    width: 'wide',
    leading: (
      <div className="flex items-stretch min-w-0">
        <LocalLink
          href="/"
          className="hidden md:inline-flex items-center gap-2 px-3 sm:px-3.5 text-xs uppercase tracking-[0.12em] text-[var(--tool-text-muted)] hover:text-[var(--tool-text)] transition-colors min-h-[44px] shrink-0 border-r border-[var(--tool-border)]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{seo.breadcrumbHome}</span>
        </LocalLink>
        <span className={styles.toolInstrumentLabel}>
          <span className={styles.toolInstrumentTitle}>{tool.workspaceTitle}</span>
          <span className={styles.toolInstrumentBrand} translate="no">
            {tool.workspaceBrand}
          </span>
        </span>
      </div>
    ),
    trailing: (
      <div ref={gradePillRef} className={styles.gradePillStack}>
        {photoMode === 'raw' ? (
          <div
            className={`${styles.gradePill} ${styles.gradePillHeader}`}
            data-quality={displayScore?.quality ?? undefined}
            data-tier={displayScore?.overall ?? undefined}
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            <div className={styles.gradePillMain}>
              <span className={styles.gradePillLabel}>{zoneCopy?.label ?? '—'}</span>
              <span className={styles.gradePillSub}>{gradePillSub}</span>
            </div>
            <div className={styles.gradePillRatios}>
              <span data-quality={displayScore ? axisQuality(gradingCompany, displayScore.lrZone) : undefined}>
                {tool.lrLabel} {fmt(displayScore?.lr)}/{fmt(displayScore ? 100 - displayScore.lr : undefined)}
              </span>
              <span data-quality={displayScore ? axisQuality(gradingCompany, displayScore.tbZone) : undefined}>
                {tool.tbLabel} {fmt(displayScore?.tb)}/{fmt(displayScore ? 100 - displayScore.tb : undefined)}
              </span>
            </div>
          </div>
        ) : null}
        {photoMode === 'slab' && verdictCopy ? (
          <div
            className={`${styles.verdictStrip} ${styles.verdictStripStandalone}`}
            data-verdict={verdictKey ?? undefined}
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            <span className={styles.verdictLabel}>{verdictCopy.label}</span>
            <span className={styles.verdictHint}>{verdictCopy.hint}</span>
          </div>
        ) : null}
        {photoMode === 'slab' && !grade ? (
          <p className={styles.reholderNote}>{tool.reholderNote}</p>
        ) : null}
      </div>
    ),
  });

  return (
    <div className={styles.wrapper}>
      {/* GPU emboss for main <img data-filter="relief">; loupes use baked bitmap. */}
      <svg
        aria-hidden="true"
        focusable="false"
        width={0}
        height={0}
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter
            id={RELIEF_FILTER_ID}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feColorMatrix type="saturate" values="0" result="gray" />
            <feConvolveMatrix
              in="gray"
              order="3"
              kernelMatrix="-2 -1 0 -1 1 1 0 1 2"
              divisor="1"
              bias="0.5"
              preserveAlpha="true"
              result="emboss"
            />
            <feComponentTransfer in="emboss">
              <feFuncR type="linear" slope="1.35" intercept="-0.1" />
              <feFuncG type="linear" slope="1.35" intercept="-0.1" />
              <feFuncB type="linear" slope="1.35" intercept="-0.1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <section
        id="centering-analyzer"
        className={styles.toolInstrument}
        aria-label={`${tool.workspaceTitle} — ${tool.workspaceBrand}`}
      >
        <div
          className={`${styles.workspaceShell}${imageReady ? ` ${styles.workspaceShellReady}` : ''}`}
          data-setup-open={setupOpen ? 'true' : 'false'}
          data-adjust-open={adjustOpen ? 'true' : 'false'}
        >
        <div className={`${styles.workspaceContainer}${imageReady ? ` ${styles.workspaceContainerReady}` : ''}`} id="workspace">
          <div className={styles.workspaceAtmosphere} aria-hidden="true" />
        <div id="image-wrapper" className={styles.imageWrapper}>
          <img
            id="card-image"
            className={styles.cardImage}
            alt={fileName ? `${tool.uploadCardImage}: ${fileName}` : ''}
            style={{ display: 'none' }}
            data-filter={imageFilterMode === 'off' ? undefined : imageFilterMode}
          />
        </div>
        <canvas
          id="overlay-canvas"
          className={`${styles.overlayCanvas}${imageReady ? ` ${styles.overlayCanvasReady}` : ''}${showHandlePulse ? ` ${styles.overlayCanvasPulse}` : ''}`}
        ></canvas>

        {/* Corner magnifiers */}
        <canvas id="loupe-tl" width={116} height={116} className={`${styles.loupe} ${styles.loupeTL} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-tr" width={116} height={116} className={`${styles.loupe} ${styles.loupeTR} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-bl" width={116} height={116} className={`${styles.loupe} ${styles.loupeBL} ${loupesOn ? '' : styles.loupeHidden}`} />
        <canvas id="loupe-br" width={116} height={116} className={`${styles.loupe} ${styles.loupeBR} ${loupesOn ? '' : styles.loupeHidden}`} />

        {!imageReady && uploadState === 'loading' && (
          <div className={styles.uploadOverlay} role="status" aria-live="polite" aria-busy="true">
            <div className={styles.uploadOverlayPlate}>
              <span className={styles.uploadSpinner} aria-hidden="true" />
              <p className={styles.uploadOverlayText}>{tool.processingPhoto}</p>
            </div>
          </div>
        )}

        {!imageReady && uploadState === 'error' && (
          <div className={styles.uploadOverlay} role="alert">
            <div className={styles.uploadOverlayPlate}>
              <p className={styles.uploadOverlayText}>{tool.uploadFailed}</p>
              <button type="button" className={styles.uploadRetryBtn} onClick={triggerUpload}>
                {tool.tryAgain}
              </button>
            </div>
          </div>
        )}

        {!imageReady && uploadState !== 'loading' && (
          guideActive && guide.activeStep === 0 ? (
            <div className={styles.emptyUploadCenter}>
              <div ref={emptyPlateRef} className={styles.emptyUploadPlate}>
                <div className={styles.emptyPlateMarks} aria-hidden="true" />
                <EmptyCardSchematic />
                <p className={styles.emptyUploadStep}>
                  <span className={styles.emptyUploadStepIndex}>01</span>
                  <span>{howToSteps[0]?.name}</span>
                </p>
                <button
                  type="button"
                  className={`${styles.emptyUploadCta} ${styles.emptyUploadCtaGuide}`}
                  disabled={isUploading}
                  onClick={triggerUpload}
                >
                  <span className={styles.emptyUploadCtaIcon} aria-hidden="true">
                    <UploadImageIcon />
                  </span>
                  <span className={styles.emptyUploadCtaCopy}>
                    <span className={styles.emptyUploadCtaLabel}>{tool.chooseImage}</span>
                    <span className={styles.emptyUploadCtaMeta}>JPG · PNG · WEBP</span>
                  </span>
                </button>
              </div>
            </div>
          ) : (
          <div className={styles.emptyState}>
            <div ref={emptyPlateRef} className={styles.emptyPlate}>
              <div className={styles.emptyPlateMarks} aria-hidden="true" />
              <p className={styles.emptyBadge}>{tool.emptyBadge}</p>
              <EmptyCardSchematic />
              <p className={styles.emptyTitle}>{tool.emptyTitle}</p>
              <p className={styles.emptyHint}>{tool.emptyHint}</p>
              <button
                type="button"
                className={styles.emptyUploadCta}
                disabled={isUploading}
                onClick={triggerUpload}
              >
                <span className={styles.emptyUploadCtaIcon} aria-hidden="true">
                  <UploadImageIcon />
                </span>
                <span className={styles.emptyUploadCtaCopy}>
                  <span className={styles.emptyUploadCtaLabel}>{tool.chooseImage}</span>
                  <span className={styles.emptyUploadCtaMeta}>JPG · PNG · WEBP</span>
                </span>
              </button>
            </div>
          </div>
          )
        )}

        {/* Setup chip — top-left */}
        <div className={styles.setupChip} data-open={setupOpen ? 'true' : 'false'}>
          <button
            type="button"
            className={styles.setupChipBtn}
            data-active={setupOpen ? 'true' : 'false'}
            aria-expanded={setupOpen}
            aria-controls="setup-sheet"
            aria-label={setupOpen ? tool.setupCollapse : tool.setupExpand}
            title={setupOpen ? tool.setupCollapse : tool.setupExpand}
            onClick={toggleSetupSheet}
          >
            <span className={styles.setupChipGlyph} aria-hidden="true">
              <WorkspaceToolsIcon />
            </span>
            <span className={styles.setupChipMeta}>
              <span className={styles.setupChipMode}>
                {photoMode === 'raw' ? tool.toolbarPhotoRaw : tool.toolbarPhotoSlab}
              </span>
              {photoMode === 'raw' ? (
                <span className={styles.setupChipCompany} data-company={gradingCompany}>
                  {gradingCompany}
                </span>
              ) : null}
            </span>
          </button>
        </div>

        {/* Off-screen inputs driven programmatically */}
        <input type="file" id="upload" ref={fileInputRef} className={styles.srOnly} accept="image/*" aria-label={tool.uploadCardImage} />
        <input aria-hidden="true" type="range" id="panX" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
        <input aria-hidden="true" type="range" id="panY" min="-1500" max="1500" step="1" defaultValue="0" className={styles.srOnly} />
        </div>

        {/* Bottom action bar — always visible; actions enable after upload */}
        <div className={styles.actionBar} role="toolbar" aria-label={tool.workspaceTitle}>
          <div className={styles.actionBarLoupeGroup}>
            {imageReady && loupesOn && !adjustOpen && !setupOpen ? (
              <div className={styles.loupeMagChip} role="group" aria-label={tool.loupeZoomLabel}>
                <button
                  type="button"
                  className={styles.loupeMagBtn}
                  aria-label={tool.loupeZoomOut}
                  title={tool.loupeZoomOut}
                  disabled={loupeMagUi <= LOUPE_MAG_MIN}
                  onClick={() => applyLoupeMag(loupeMagRef.current - LOUPE_MAG_STEP)}
                >
                  −
                </button>
                <span className={styles.loupeMagValue} aria-live="polite">
                  {loupeMagUi.toFixed(1)}×
                </span>
                <button
                  type="button"
                  className={styles.loupeMagBtn}
                  aria-label={tool.loupeZoomIn}
                  title={tool.loupeZoomIn}
                  disabled={loupeMagUi >= LOUPE_MAG_MAX}
                  onClick={() => applyLoupeMag(loupeMagRef.current + LOUPE_MAG_STEP)}
                >
                  +
                </button>
              </div>
            ) : null}
            <button
              type="button"
              className={styles.actionBarBtn}
              data-active={loupesOn ? 'true' : 'false'}
              aria-pressed={loupesOn}
              aria-label={tool.cornerMagnifiersToggle}
              title={tool.cornerMagnifiersToggle}
              disabled={!imageReady}
              onClick={() => setLoupesOn((v) => !v)}
            >
              <CornerLoupeIcon />
              <span className={styles.actionBarBtnLabel}>{tool.toolbarLoupe}</span>
            </button>
          </div>
          <button
            type="button"
            className={`${styles.actionBarBtn} ${styles.actionBarAdjust}${guideActive && guide.activeStep === 1 ? ` ${styles.actionBarAdjustGuide}` : ''}`}
            data-active={adjustOpen ? 'true' : 'false'}
            aria-expanded={adjustOpen}
            aria-controls="adjust-sheet"
            aria-label={tool.adjustImage}
            title={tool.adjustImage}
            disabled={!imageReady}
            onClick={toggleAdjustSheet}
          >
            <SlidersIcon />
            <span className={styles.actionBarBtnLabel}>{tool.adjustImage}</span>
          </button>
          <button
            type="button"
            className={styles.actionBarBtn}
            aria-label={tool.reset}
            title={tool.reset}
            disabled={!imageReady}
            onClick={() => resetRef.current?.()}
          >
            <ResetViewIcon />
            <span className={styles.actionBarBtnLabel}>{tool.toolbarReset}</span>
          </button>
        </div>

        {/* Shared scrim for setup / adjust sheets */}
        {imageReady && (setupOpen || adjustOpen) ? (
          <button
            type="button"
            className={styles.chromeScrim}
            aria-label={adjustOpen ? tool.closeAdjustPanel : tool.closeSetupPanel}
            onClick={closeChromeSheets}
          />
        ) : null}

        {/* Setup sheet — Raw/Slab, company, guides */}
        <div
          id="setup-sheet"
          className={`${styles.setupSheet}${setupOpen ? ` ${styles.chromeSheetOpen}` : ''}`}
          data-open={setupOpen ? 'true' : 'false'}
          aria-hidden={!setupOpen}
        >
          <aside className={styles.chromeSheetPanel} aria-label={tool.setupTitle}>
            <div className={styles.chromeSheetHeader}>
              <span className={styles.chromeSheetTitle}>{tool.setupTitle}</span>
              <button
                type="button"
                className={styles.chromeSheetClose}
                aria-label={tool.closeSetupPanel}
                onClick={closeChromeSheets}
              >
                <ChevronIcon className={styles.chevron} />
              </button>
            </div>
            <div className={styles.chromeSheetBody}>
              <div className={styles.setupSection} role="group" aria-label={tool.photoModeLabel}>
                <p className={styles.setupSectionLabel}>{tool.photoModeLabel}</p>
                <div className={styles.photoModeBar}>
                  {(['raw', 'slab'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={styles.photoModeBtn}
                      data-active={photoMode === mode}
                      aria-pressed={photoMode === mode}
                      onClick={() => setPhotoMode(mode)}
                    >
                      <span className={styles.photoModeBtnLong}>
                        {mode === 'raw' ? tool.photoModeRaw : tool.photoModeSlab}
                      </span>
                      <span className={styles.photoModeBtnShort}>
                        {mode === 'raw' ? tool.toolbarPhotoRaw : tool.toolbarPhotoSlab}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {photoMode === 'raw' ? (
                <div className={styles.setupSection} role="group" aria-label={tool.gradingCompanyLabel}>
                  <p className={styles.setupSectionLabel}>{tool.gradingCompanyLabel}</p>
                  <div className={styles.setupCompanyRow} id="grading-company-list">
                    {GRADING_COMPANIES.map((company) => (
                      <button
                        key={company}
                        type="button"
                        className={styles.setupCompanyBtn}
                        data-active={gradingCompany === company}
                        data-company={company}
                        aria-pressed={gradingCompany === company}
                        onClick={() => setGradingCompany(company)}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.setupSection} role="group" aria-label={tool.guideModeLabel}>
                <p className={styles.setupSectionLabel}>{tool.guideModeLabel}</p>
                <div className={styles.guideModeBar}>
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
                      <span className={styles.guideModeBtnLabel}>
                        {mode === 'edge' ? tool.guideModeEdge : mode === 'border' ? tool.guideModeBorder : tool.guideModeBoth}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Adjust sheet — always mounted so canvas controls stay in DOM */}
        <div
          id="adjust-sheet"
          className={`${styles.adjustSheet}${!imageReady ? ` ${styles.adjustSheetDormant}` : ''}${adjustOpen ? ` ${styles.chromeSheetOpen}` : ''}${guideActive && guide.activeStep === 1 ? ` ${styles.adjustSheetGuideActive}` : ''}`}
          data-open={adjustOpen ? 'true' : 'false'}
          aria-hidden={!adjustOpen}
        >
          <aside
            ref={adjustDockRef}
            className={styles.chromeSheetPanel}
            aria-label={tool.adjustImage}
          >
            <div className={styles.chromeSheetHeader}>
              <span className={styles.chromeSheetTitle}>
                <SlidersIcon />
                {tool.adjustImage}
              </span>
              <button
                type="button"
                className={styles.chromeSheetClose}
                aria-label={tool.closeAdjustPanel}
                onClick={closeChromeSheets}
              >
                <ChevronIcon className={styles.chevron} />
              </button>
            </div>

            <div className={styles.chromeSheetBody}>
              {imageReady ? (
                <div className={styles.filterModeDock}>
                  <p className={styles.filterModeDockLabel}>{tool.imageFilterLabel}</p>
                  <BlemishFilterBar
                    active={imageFilterMode}
                    onSelect={setImageFilterMode}
                    ariaLabel={tool.imageFilterLabel}
                    labels={imageFilterLabels}
                    barClassName={styles.filterModeBarLabeled}
                  />
                  <p className={styles.filterModeDockHint} aria-live="polite">
                    {imageFilterHints[imageFilterMode]}
                  </p>
                </div>
              ) : null}
              <div className={styles.sliderStack}>
                <div className={styles.controlRow}>
                  <div className={styles.controlHeader}><label htmlFor="zoom" className={styles.controlLabel}><ZoomIcon /> {tool.zoom}</label><span id="zoom-val" className={styles.sliderValue}>1.0</span></div>
                  <input className={styles.rangeSlider} aria-label={tool.zoom} type="range" id="zoom" min="0.1" max="3" step="0.01" defaultValue="1" />
                </div>
                <div className={styles.controlRow}>
                  <div className={styles.controlHeader}><label htmlFor="rotate" className={styles.controlLabel}><RotateIcon /> {tool.rotate}</label><span id="rot-val" className={styles.sliderValue}>0°</span></div>
                  <input className={styles.rangeSlider} aria-label={tool.rotation} type="range" id="rotate" min="-20" max="20" step="0.15" defaultValue="0" />
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
        </div>
        </div>
      </section>
    </div>
  );
}
