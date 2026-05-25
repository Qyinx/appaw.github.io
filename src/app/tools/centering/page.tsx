"use client"

import React, { useEffect, useRef, useState } from "react"

type Rect = { x: number; y: number; w: number; h: number }

type Ratios = {
  leftGap: number
  rightGap: number
  topGap: number
  bottomGap: number
  leftPercent: number
  rightPercent: number
  topPercent: number
  bottomPercent: number
  worst: number
  grade: string
}

// Palette (from style-guide)
const PRIMARY_500 = "#9B7EBF"
const PRIMARY_400 = "#b79ad8"
const PRIMARY_50 = "#f6f3fb"
const SECONDARY_500 = "#6FC3FF"
const SUCCESS = "#10B981"
const AMBER_400 = "#F59E0B"

function hexToRgb(hex: string) {
  const sanitized = hex.replace('#', '')
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function ProportionBar({ value, color = PRIMARY_400 }: { value: number | null | undefined; color?: string }) {
  const pct = value == null ? 50 : Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="relative w-full h-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 rounded-full bg-gray-200" />
        </div>

        {/* center marker */}
        <div className="absolute left-1/2 top-1 bottom-1 transform -translate-x-1/2 flex items-center pointer-events-none">
          <div className="h-6 border-l border-gray-300 opacity-60" />
        </div>

        {/* dot */}
        <div
          className="absolute top-0 left-0 h-full flex items-center"
          aria-hidden
        >
          <div style={{ left: `${pct}%` }} className="relative w-full">
            <div
              style={{ left: `${pct}%`, transform: 'translate(-50%, 0)', background: color, boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}
              className="absolute -mt-1 w-3 h-3 rounded-full border-2 border-white"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <div>0%</div>
        <div>50%</div>
        <div>100%</div>
      </div>
    </div>
  )
}

function ProportionScatter({ xPercent, yPercent, size = 160, dotColor = PRIMARY_400, zoom = 1 }: { xPercent?: number | null; yPercent?: number | null; size?: number; dotColor?: string; zoom?: number }) {
  // Use a deterministic id to avoid hydration mismatch
  const gradId = 'ps-grad'
  const glowId = 'ps-glow'
  const w = Math.round(size)
  const h = Math.round(size)
  const xp = xPercent == null ? 50 : Math.max(0, Math.min(100, xPercent))
  const yp = yPercent == null ? 50 : Math.max(0, Math.min(100, yPercent))
  const cx = (xp / 100) * w
  const cy = (1 - yp / 100) * h
  // grading thresholds (max deviation from 50%)
  const t10 = 5
  const t9 = 10
  const t8 = 15

  const rectFor = (t: number) => {
    const left = ((50 - t) / 100) * w
    const top = (1 - (50 + t) / 100) * h
    const sizePx = (2 * t) / 100 * w
    return { x: left, y: top, w: sizePx, h: sizePx }
  }

  const r10 = rectFor(t10)
  const r9 = rectFor(t9)
  const r8 = rectFor(t8)

  const successRgb = hexToRgb(SUCCESS)
  const primaryRgb = hexToRgb(PRIMARY_400)
  const amberRgb = hexToRgb(AMBER_400)

  // compute viewBox centered on middle when zoom > 1
  const z = Math.max(1, zoom || 1)
  const vbw = w / z
  const vbh = h / z
  const vbx = (w - vbw) / 2
  const vby = (h - vbh) / 2
  const viewBox = `${vbx} ${vby} ${vbw} ${vbh}`

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full overflow-hidden" style={{ aspectRatio: '1' }}>
      <svg viewBox={viewBox} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" className="rounded border bg-white">
        <defs>
          <linearGradient id={gradId} x1="0%" x2="100%">
            <stop offset="0%" stopColor={dotColor} stopOpacity="0.98" />
            <stop offset="100%" stopColor={PRIMARY_500} stopOpacity="0.86" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* graded squares (largest first) */}
        <rect x={r8.x} y={r8.y} width={r8.w} height={r8.h} fill={`rgba(${amberRgb.r},${amberRgb.g},${amberRgb.b},0.08)`} stroke={`rgba(${amberRgb.r},${amberRgb.g},${amberRgb.b},0.16)`} rx={4} />
        <rect x={r9.x} y={r9.y} width={r9.w} height={r9.h} fill={`rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.09)`} stroke={`rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.16)`} rx={4} />
        <rect x={r10.x} y={r10.y} width={r10.w} height={r10.h} fill={`rgba(${successRgb.r},${successRgb.g},${successRgb.b},0.14)`} stroke={`rgba(${successRgb.r},${successRgb.g},${successRgb.b},0.22)`} rx={4} />

        {/* gridlines */}
        {[25, 50, 75].map((p) => (
          <line key={`vx-${p}`} x1={(p / 100) * w} y1={0} x2={(p / 100) * w} y2={h} stroke="#eef2f7" strokeWidth={1} />
        ))}
        {[25, 50, 75].map((p) => (
          <line key={`hy-${p}`} x1={0} y1={(1 - p / 100) * h} x2={w} y2={(1 - p / 100) * h} stroke="#eef2f7" strokeWidth={1} />
        ))}

        <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke="#e6e9f6" strokeDasharray="3 3" strokeWidth={1} />
        <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="#e6e9f6" strokeDasharray="3 3" strokeWidth={1} />

        {/* crosshair for current measurement */}
        <line x1={cx} y1={0} x2={cx} y2={h} stroke={dotColor} strokeOpacity={0.12} strokeWidth={1} />
        <line x1={0} y1={cy} x2={w} y2={cy} stroke={dotColor} strokeOpacity={0.12} strokeWidth={1} />

        <circle cx={cx} cy={cy} r={8} fill={`url(#${gradId})`} stroke="#fff" strokeWidth={2} filter={`url(#${glowId})`} />
      </svg>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-gray-700 justify-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: `rgba(${successRgb.r},${successRgb.g},${successRgb.b},0.9)` }} />
          <span>Potential 10 (≤{t10}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: `rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.9)` }} />
          <span>Potential 9 (≤{t9}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: `rgba(${amberRgb.r},${amberRgb.g},${amberRgb.b},0.9)` }} />
          <span>Potential 8 (≤{t8}%)</span>
        </div>
      </div>
    </div>
  )
}

// Revamped SVG-styled knob (radial ticks, active arc glow, keyboard + pointer support)
function Knob({ value, onChange, min = -30, max = 30, size = 64 }: { value: number; onChange: (n: number) => void; min?: number; max?: number; size?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)

  const ARC = 270 // degrees covered by the dial
  const tickCount = 72

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true
      try { (e.target as Element).setPointerCapture(e.pointerId) } catch {}
      setByCoords(e.clientX, e.clientY)
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return
      setByCoords(e.clientX, e.clientY)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current) return
      dragging.current = false
      try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // touch fallbacks
    const onTouchStart = (ev: TouchEvent) => { setByCoords(ev.touches[0].clientX, ev.touches[0].clientY); dragging.current = true }
    const onTouchMove = (ev: TouchEvent) => { if (dragging.current) setByCoords(ev.touches[0].clientX, ev.touches[0].clientY) }
    const onTouchEnd = () => { dragging.current = false }
    el.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max])

  function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

  // Ensure SSR/CSR output matches: format SVG numbers to fixed precision strings
  function svgNum(n: number) { return n.toFixed(2) }

  function setByCoords(clientX: number, clientY: number) {
    const el = ref.current!
    const rect = el.getBoundingClientRect()
    const CX = rect.width / 2
    const CY = rect.height / 2
    const x = clientX - rect.left
    const y = clientY - rect.top
    const r = Math.atan2(y - CY, x - CX)
    let deg = (r * 180) / Math.PI + 90
    if (deg > 180) deg = deg - 360
    const half = ARC / 2
    if (deg < -half) deg = -half
    if (deg > half) deg = half
    const fraction = (deg + half) / ARC
    const nv = min + fraction * (max - min)
    onChange(Number(nv.toFixed(1)))
  }

  const fraction = clamp01((value - min) / (max - min || 1))
  const pointerAngle = -ARC / 2 + fraction * ARC

  const svgSize = 120
  const center = svgSize / 2
  const baseRadius = 46

  // build arc path from start -> pointerAngle
  const startDeg = -ARC / 2
  const startRad = (startDeg - 90) * (Math.PI / 180)
  const endRad = (pointerAngle - 90) * (Math.PI / 180)
  const startX = center + baseRadius * Math.cos(startRad)
  const startY = center + baseRadius * Math.sin(startRad)
  const endX = center + baseRadius * Math.cos(endRad)
  const endY = center + baseRadius * Math.sin(endRad)
  const arcLenRad = (pointerAngle - startDeg) * (Math.PI / 180)
  const largeArcFlag = arcLenRad > Math.PI ? 1 : 0
  const arcPath = `M ${svgNum(startX)} ${svgNum(startY)} A ${svgNum(baseRadius)} ${svgNum(baseRadius)} 0 ${largeArcFlag} 1 ${svgNum(endX)} ${svgNum(endY)}`

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className="volume-button-knob"
      style={{ width: size, height: size }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(min, value - 0.5))
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(max, value + 0.5))
      }}
    >
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width={size} height={size}>
        <defs>
          <radialGradient id="knobGrad" cx="50%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.02" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={PRIMARY_400} stopOpacity="0.95" />
            <stop offset="100%" stopColor={PRIMARY_500} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* base circle */}
        <circle cx={svgNum(center)} cy={svgNum(center)} r={svgNum(baseRadius)} fill="url(#knobGrad)" stroke="#f2f2f2" strokeOpacity={0.02} strokeWidth={8} />

        {/* active arc glow */}
        <path d={arcPath} stroke="url(#arcGrad)" strokeWidth={8} strokeLinecap="round" fill="none" filter="url(#glow)" opacity={fraction > 0 ? 1 : 0} />

        {/* ticks */}
        <g>
          {Array.from({ length: tickCount + 1 }).map((_, i) => {
            const tFrac = i / tickCount
            const tickDeg = -ARC / 2 + tFrac * ARC
            const isActive = tickDeg <= pointerAngle
            const innerR = baseRadius - (i % 6 === 0 ? 14 : 10)
            const outerR = baseRadius - 2
            const angRad = (tickDeg - 90) * (Math.PI / 180)
            const x1 = svgNum(center + innerR * Math.cos(angRad))
            const y1 = svgNum(center + innerR * Math.sin(angRad))
            const x2 = svgNum(center + outerR * Math.cos(angRad))
            const y2 = svgNum(center + outerR * Math.sin(angRad))
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? PRIMARY_400 : 'rgba(255,255,255,0.08)'}
                strokeWidth={isActive ? (i % 6 === 0 ? 2.6 : 1.6) : (i % 6 === 0 ? 1.4 : 0.8)}
                strokeLinecap="round"
              />
            )
          })}
        </g>

        {/* pointer knob indicator */}
        <g style={{ transform: `rotate(${pointerAngle}deg)`, transformOrigin: `${center}px ${center}px` }}>
          <rect x={svgNum(center - 4)} y={svgNum(center - baseRadius + 8)} width={svgNum(8)} height={svgNum(baseRadius - 16)} rx={svgNum(4)} fill={PRIMARY_500} />
        </g>
      </svg>
    </div>
  )
}

function GradeVisualizer({ ratios }: { ratios: Ratios | null }) {
  // Triangular visualizer: apex (top) = best (0% worst). Larger worst moves down toward base.
  const maxT = 15
  const thresholds = [
    { key: 'Potential 10', label: 'Gem Mint', t: 5, color: SUCCESS },
    { key: 'Potential 9', label: 'Mint', t: 10, color: PRIMARY_400 },
    { key: 'Potential 8', label: 'Near Mint', t: 15, color: AMBER_400 },
  ]

  const worst = Math.min(ratios?.worst ?? maxT, maxT)
  const leftP = ratios?.leftPercent ?? 50
  const topP = ratios?.topPercent ?? 50

  const w = 220
  const h = 160

  // normalized vertical position inside triangle (0 = apex/best, 1 = base/worst)
  const norm = worst / maxT
  const y = norm * h

  // left/right bias mapped -1..1
  const hx = (leftP - 50) / 50

  // compute horizontal bounds for given y inside the isosceles triangle
  const leftBound = (w / 2) * (1 - y / h)
  const rightBound = w - leftBound
  const x = leftBound + ((hx + 1) / 2) * (rightBound - leftBound)

  // Use a deterministic id to avoid hydration mismatch
  const gradId = 'tg-grad'

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="rounded bg-white border" style={{ aspectRatio: `${w}/${h}` }}>
        <defs>
          <linearGradient id={gradId} x1="0%" x2="100%">
            <stop offset="0%" stopColor={PRIMARY_400} stopOpacity="1" />
            <stop offset="100%" stopColor={PRIMARY_500} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* nested threshold triangles (largest outer) */}
        {thresholds.slice().reverse().map((t, i) => {
          const s = t.t / maxT
          const ty = s * h
          const l = (w / 2) * (1 - ty / h)
          const r = w - l
          const points = `${w/2},0 ${l},${ty} ${r},${ty}`
          const rgb = hexToRgb(t.color)
          return (
            <polygon key={t.key} points={points} fill={`rgba(${rgb.r},${rgb.g},${rgb.b},0.08)`} stroke={`rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`} />
          )
        })}

        {/* guide lines */}
        <line x1={w/2} y1={0} x2={w/2} y2={h} stroke="#e6e9f6" strokeDasharray="4 4" strokeWidth={1} />

        {/* dot position */}
        <circle cx={x} cy={y} r={8} fill={`url(#${gradId})`} stroke="#fff" strokeWidth={2} />
      </svg>

      <div className="mt-2 text-sm text-gray-700 text-center">Triangle: top = best (0% deviation). Dot moves down as worst increases; horizontal offset shows L/R bias.</div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-700 justify-center">
        {thresholds.map((t) => {
          const rgb = hexToRgb(t.color)
          return (
            <div key={t.key} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.9)` }} />
              <span>{t.label} (≤{t.t}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CenteringToolPage() {
    // Helper: center the canvas in its scroll container, optionally preserving center on zoom
    function centerCanvasInView(preserveCenter = false, prevScale = 1) {
      if (!canvasRef.current || !canvasWrapperRef.current) return;
      const canvas = canvasRef.current;
      const wrapper = canvasWrapperRef.current;
      if (preserveCenter) {
        // Get current scroll center as a fraction
        const centerX = wrapper.scrollLeft + wrapper.clientWidth / 2;
        const centerY = wrapper.scrollTop + wrapper.clientHeight / 2;
        const fracX = centerX / (canvas.clientWidth || 1);
        const fracY = centerY / (canvas.clientHeight || 1);
        // After zoom, scroll to keep the same center
        setTimeout(() => {
          const newCenterX = fracX * (canvas.clientWidth || 1);
          const newCenterY = fracY * (canvas.clientHeight || 1);
          wrapper.scrollLeft = Math.max(0, newCenterX - wrapper.clientWidth / 2);
          wrapper.scrollTop = Math.max(0, newCenterY - wrapper.clientHeight / 2);
        }, 0);
      } else {
        // Default: center canvas
        const scrollLeft = Math.max(0, (canvas.clientWidth || 0) / 2 - wrapper.clientWidth / 2);
        const scrollTop = Math.max(0, (canvas.clientHeight || 0) / 2 - wrapper.clientHeight / 2);
        wrapper.scrollLeft = scrollLeft;
        wrapper.scrollTop = scrollTop;
      }
    }
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [angle, setAngle] = useState<number>(0)
  const [scale, setScale] = useState<number>(1)
  // Debounced state for smooth UI
  const [debouncedAngle, setDebouncedAngle] = useState(angle)
  const [debouncedScale, setDebouncedScale] = useState(scale)

  // Debounce effect for angle
  useEffect(() => {
    const t = setTimeout(() => setDebouncedAngle(angle), 16)
    return () => clearTimeout(t)
  }, [angle])
  // Debounce effect for scale
  useEffect(() => {
    const t = setTimeout(() => setDebouncedScale(scale), 16)
    return () => clearTimeout(t)
  }, [scale])

  // fixed scatter size (users cannot tune)
  const SCATTER_SIZE = 240

  const [outerRect, setOuterRect] = useState<Rect | null>(null)
  const [innerRect, setInnerRect] = useState<Rect | null>(null)

  const draggingRef = useRef<null | {
    target: "outer" | "inner"
    action: "move" | "handle"
    handle?: string
    startX: number
    startY: number
    orig: Rect
  }>(null)

  // Helper: load image from file
  function loadFile(file: File | null) {
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setImageSrc(url)
      // initialize after load
      initCanvasAndRects(img)
    }
    img.src = url
  }

  function initCanvasAndRects(img: HTMLImageElement) {
    const canvas = canvasRef.current!
    if (!canvas) return

    // Determine scaled display size
    const MAX_WIDTH = 820
    let scaledW = img.naturalWidth
    let scaledH = img.naturalHeight
    if (scaledW > MAX_WIDTH) {
      const s = MAX_WIDTH / scaledW
      scaledW = Math.round(scaledW * s)
      scaledH = Math.round(scaledH * s)
    }

    const rad = (angle * Math.PI) / 180
    const rotatedW = Math.abs(scaledW * Math.cos(rad)) + Math.abs(scaledH * Math.sin(rad))
    const rotatedH = Math.abs(scaledW * Math.sin(rad)) + Math.abs(scaledH * Math.cos(rad))

    // Use devicePixelRatio and visual scale to size internal bitmap for sharpness
    const displayW = Math.max(300, Math.round(rotatedW))
    const displayH = Math.max(200, Math.round(rotatedH))
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const pxScale = dpr * scale
    canvas.width = Math.round(displayW * pxScale)
    canvas.height = Math.round(displayH * pxScale)
    // CSS size should reflect visual zoom (display size * scale)
    canvas.style.width = `${displayW * scale}px`
    canvas.style.height = `${displayH * scale}px`

    // image top-left inside canvas (centered) in display units
    const imgLeft = (displayW - scaledW) / 2
    const imgTop = (displayH - scaledH) / 2

    // Set outerRect to 80% of the image size, centered
    const outerW = scaledW * 0.8
    const outerH = scaledH * 0.8
    const oRect: Rect = {
      x: imgLeft + (scaledW - outerW) / 2,
      y: imgTop + (scaledH - outerH) / 2,
      w: Math.max(20, outerW),
      h: Math.max(20, outerH),
    }
    // Set innerRect to 76% of outerRect, centered inside outerRect (as before)
    const iRect: Rect = {
      x: oRect.x + oRect.w * 0.12,
      y: oRect.y + oRect.h * 0.12,
      w: oRect.w * 0.76,
      h: oRect.h * 0.76,
    }
    setOuterRect(oRect)
    setInnerRect(iRect)
    draw(img, oRect, iRect)
  }

  // Draw image (with rotation) and overlays
  function draw(img?: HTMLImageElement | null, oRect?: Rect | null, iRect?: Rect | null) {

    const canvas = canvasRef.current
    if (!canvas) return
    if (!imgRef.current) return
    const image = img || imgRef.current

    // compute scaled dims used at init
    const MAX_WIDTH = 820
    let scaledW = image.naturalWidth
    let scaledH = image.naturalHeight
    if (scaledW > MAX_WIDTH) {
      const s = MAX_WIDTH / scaledW
      scaledW = Math.round(scaledW * s)
      scaledH = Math.round(scaledH * s)
    }

    const rad = (angle * Math.PI) / 180
    const rotatedW = Math.abs(scaledW * Math.cos(rad)) + Math.abs(scaledH * Math.sin(rad))
    const rotatedH = Math.abs(scaledW * Math.sin(rad)) + Math.abs(scaledH * Math.cos(rad))

    // ensure canvas internal pixel size uses dpr * scale for sharpness
    const displayW = Math.max(300, Math.round(rotatedW))
    const displayH = Math.max(200, Math.round(rotatedH))
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const pxScale = dpr * scale
    if (canvas.width !== Math.round(displayW * pxScale) || canvas.height !== Math.round(displayH * pxScale)) {
      canvas.width = Math.round(displayW * pxScale)
      canvas.height = Math.round(displayH * pxScale)
      canvas.style.width = `${displayW * scale}px`
      canvas.style.height = `${displayH * scale}px`
    }

    const ctx = canvas.getContext("2d")!
    // map drawing commands: 1 unit = 1 display pixel; transform scales to device pixels
    ctx.setTransform(pxScale, 0, 0, pxScale, 0, 0)
    ctx.clearRect(0, 0, displayW, displayH)

    // Always center the image on the canvas (in display units)
    ctx.save()
    ctx.translate(displayW / 2, displayH / 2)
    ctx.rotate(rad)
    ctx.drawImage(image, -scaledW / 2, -scaledH / 2, scaledW, scaledH)
    ctx.restore()

    // Draw grid background (overlay, always visible)
    const gridSize = 32
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.strokeStyle = "#e5e7ef"
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    ctx.restore()

    // draw overlay rectangles - use current state when parameters not provided
    const outer = oRect || outerRect
    const inner = iRect || innerRect
    if (outer) drawRect(ctx, outer, PRIMARY_500, "Outer")
    if (inner) drawRect(ctx, inner, SECONDARY_500, "Inner")

    // keep a fixed preview viewport (wrapper) and let overflow be hidden
    // (we center the canvas inside it via flex + transform origin)
  }

  function drawRect(ctx: CanvasRenderingContext2D, r: Rect, color: string, label?: string) {
    ctx.save()
    // fill with subtle tint
    const { r: R, g: G, b: B } = hexToRgb(color)
    ctx.fillStyle = `rgba(${R}, ${G}, ${B}, 0.07)`
    ctx.fillRect(r.x, r.y, r.w, r.h)

    // stronger border
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(r.x, r.y, r.w, r.h)

    // handles (larger, with border)
    const hs = 10
    const handles = [
      [r.x, r.y],
      [r.x + r.w / 2, r.y],
      [r.x + r.w, r.y],
      [r.x + r.w, r.y + r.h / 2],
      [r.x + r.w, r.y + r.h],
      [r.x + r.w / 2, r.y + r.h],
      [r.x, r.y + r.h],
      [r.x, r.y + r.h / 2],
    ]
    ctx.fillStyle = color
    for (const [x, y] of handles) {
      ctx.fillRect(x - hs / 2, y - hs / 2, hs, hs)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.strokeRect(x - hs / 2, y - hs / 2, hs, hs)
    }

    if (label) {
      ctx.fillStyle = color
      ctx.font = "12px Inter, ui-sans-serif, system-ui"
      ctx.fillText(label, r.x + 6, r.y - 8)
    }

    ctx.restore()
  }

  // Event helpers
  useEffect(() => {
    // redraw when debounced angle or scale or rects change
    if (!imgRef.current) return;
    draw();
    // Only center after image load or zoom, not on every rect update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAngle, outerRect, innerRect, imageSrc, debouncedScale]);

  // Drag & resize handlers using pointer events
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function getPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      // bounding rect is scaled by CSS size (includes visual scale)
      // Convert client coordinates → display units by dividing by visual scale
      return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale }
    }

    function hitHandle(r: Rect, x: number, y: number) {
      if (!r) return null
      const hs = 10
      const pts: { name: string; x: number; y: number }[] = [
        { name: "nw", x: r.x, y: r.y },
        { name: "n", x: r.x + r.w / 2, y: r.y },
        { name: "ne", x: r.x + r.w, y: r.y },
        { name: "e", x: r.x + r.w, y: r.y + r.h / 2 },
        { name: "se", x: r.x + r.w, y: r.y + r.h },
        { name: "s", x: r.x + r.w / 2, y: r.y + r.h },
        { name: "sw", x: r.x, y: r.y + r.h },
        { name: "w", x: r.x, y: r.y + r.h / 2 },
      ]
      for (const p of pts) {
        if (Math.abs(p.x - x) < hs && Math.abs(p.y - y) < hs) return p.name
      }
      return null
    }

    function insideRect(r: Rect, x: number, y: number) {
      return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h
    }

    function onPointerDown(e: PointerEvent) {
      if (!outerRect || !innerRect) return
      const p = getPos(e)
      // check inner first (priority)
      const ih = hitHandle(innerRect, p.x, p.y)
      if (ih) {
        draggingRef.current = { target: "inner", action: "handle", handle: ih, startX: p.x, startY: p.y, orig: { ...innerRect } }
        ;(e.target as Element).setPointerCapture(e.pointerId)
        return
      }
      const oh = hitHandle(outerRect, p.x, p.y)
      if (oh) {
        draggingRef.current = { target: "outer", action: "handle", handle: oh, startX: p.x, startY: p.y, orig: { ...outerRect } }
        ;(e.target as Element).setPointerCapture(e.pointerId)
        return
      }
      if (insideRect(innerRect, p.x, p.y)) {
        draggingRef.current = { target: "inner", action: "move", startX: p.x, startY: p.y, orig: { ...innerRect } }
        ;(e.target as Element).setPointerCapture(e.pointerId)
        return
      }
      if (insideRect(outerRect, p.x, p.y)) {
        draggingRef.current = { target: "outer", action: "move", startX: p.x, startY: p.y, orig: { ...outerRect } }
        ;(e.target as Element).setPointerCapture(e.pointerId)
        return
      }
    }

    function clampRect(r: Rect) {
      const minSize = 8
      const cw = canvas!.width
      const ch = canvas!.height
      let x = Math.max(0, Math.min(r.x, cw - minSize))
      let y = Math.max(0, Math.min(r.y, ch - minSize))
      let w = Math.max(minSize, Math.min(r.w, cw - x))
      let h = Math.max(minSize, Math.min(r.h, ch - y))
      return { x, y, w, h }
    }

    // Ensure an inner rect stays fully inside an outer rect and not larger than it
    function clampInnerToOuter(inner: Rect | null, outer: Rect | null) {
      if (!inner) return null
      if (!outer) return inner
      const minSize = 8
      let x = inner.x
      let y = inner.y
      let w = Math.min(inner.w, outer.w)
      let h = Math.min(inner.h, outer.h)

      // enforce minimum size but not exceed outer
      w = Math.max(minSize, Math.min(w, outer.w))
      h = Math.max(minSize, Math.min(h, outer.h))

      // snap position so inner stays inside outer
      x = Math.max(outer.x, Math.min(x, outer.x + outer.w - w))
      y = Math.max(outer.y, Math.min(y, outer.y + outer.h - h))

      // final safety: if inner is somehow larger, fit to outer
      if (w > outer.w) { w = outer.w; x = outer.x }
      if (h > outer.h) { h = outer.h; y = outer.y }

      return { x, y, w, h }
    }

    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current) return
      const d = draggingRef.current
      const p = getPos(e)
      const dx = p.x - d.startX
      const dy = p.y - d.startY

      if (d.target === "outer") {
        const orig = d.orig
        let nr: Rect = { ...orig }
        if (d.action === "move") {
          nr.x = orig.x + dx
          nr.y = orig.y + dy
        } else if (d.action === "handle") {
          nr = applyHandleResize(orig, d.handle || "", dx, dy)
        }
        const clampedOuter = clampRect(nr)
        setOuterRect(clampedOuter)
        // ensure inner stays inside the new outer
        setInnerRect((prev) => clampInnerToOuter(prev, clampedOuter))
      } else if (d.target === "inner") {
        const orig = d.orig
        let nr: Rect = { ...orig }
        if (d.action === "move") {
          nr.x = orig.x + dx
          nr.y = orig.y + dy
        } else if (d.action === "handle") {
          nr = applyHandleResize(orig, d.handle || "", dx, dy)
        }
        // clamp to canvas then to outer bounds
        const clamped = clampRect(nr)
        setInnerRect(clampInnerToOuter(clamped, outerRect))
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (draggingRef.current) {
        try {
          ;(e.target as Element).releasePointerCapture(e.pointerId)
        } catch {}
      }
      draggingRef.current = null
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerRect, innerRect, imageSrc, angle, scale])

  function applyHandleResize(orig: Rect, handle: string, dx: number, dy: number) {
    const r = { ...orig }
    switch (handle) {
      case "nw":
        r.x = orig.x + dx
        r.y = orig.y + dy
        r.w = orig.w - dx
        r.h = orig.h - dy
        break
      case "n":
        r.y = orig.y + dy
        r.h = orig.h - dy
        break
      case "ne":
        r.y = orig.y + dy
        r.w = orig.w + dx
        r.h = orig.h - dy
        break
      case "e":
        r.w = orig.w + dx
        break
      case "se":
        r.w = orig.w + dx
        r.h = orig.h + dy
        break
      case "s":
        r.h = orig.h + dy
        break
      case "sw":
        r.x = orig.x + dx
        r.w = orig.w - dx
        r.h = orig.h + dy
        break
      case "w":
        r.x = orig.x + dx
        r.w = orig.w - dx
        break
    }
    return r
  }

  // Ratios & grading
  function computeRatios() {
    if (!outerRect || !innerRect) return null
    const leftGap = innerRect.x - outerRect.x
    const rightGap = outerRect.x + outerRect.w - (innerRect.x + innerRect.w)
    const topGap = innerRect.y - outerRect.y
    const bottomGap = outerRect.y + outerRect.h - (innerRect.y + innerRect.h)

    const horizontalTotal = leftGap + rightGap
    const verticalTotal = topGap + bottomGap

    const leftPercent = horizontalTotal > 0 ? (leftGap / horizontalTotal) * 100 : 50
    const rightPercent = horizontalTotal > 0 ? (rightGap / horizontalTotal) * 100 : 50
    const topPercent = verticalTotal > 0 ? (topGap / verticalTotal) * 100 : 50
    const bottomPercent = verticalTotal > 0 ? (bottomGap / verticalTotal) * 100 : 50

    const hDiff = Math.abs(leftPercent - 50)
    const vDiff = Math.abs(topPercent - 50)
    const worst = Math.max(hDiff, vDiff)

    let grade = "Below 8"
    if (worst <= 5) grade = "Potential 10"
    else if (worst <= 10) grade = "Potential 9"
    else if (worst <= 15) grade = "Potential 8"

    return {
      leftGap: Math.round(leftGap),
      rightGap: Math.round(rightGap),
      topGap: Math.round(topGap),
      bottomGap: Math.round(bottomGap),
      leftPercent: +leftPercent.toFixed(1),
      rightPercent: +rightPercent.toFixed(1),
      topPercent: +topPercent.toFixed(1),
      bottomPercent: +bottomPercent.toFixed(1),
      worst: +worst.toFixed(1),
      grade,
    }
  }

  // UI actions
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    loadFile(f || null)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    loadFile(f || null)
  }

  function handleReset() {
    if (!imgRef.current) return;
    setAngle(0);
    initCanvasAndRects(imgRef.current);
    setTimeout(() => centerCanvasInView(false), 0);
  }

  // Initialize when imageSrc set
  useEffect(() => {
    if (!imageSrc) return;
    if (!imgRef.current) return;
    initCanvasAndRects(imgRef.current);
    // Center after image load
    setTimeout(() => centerCanvasInView(false), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  const ratios = computeRatios()

  // automatic log-based zoom for near-center (focus on critical high-grade area)
  const scatterAutoZoom = (() => {
    if (!ratios) return 1
    const worst = Math.max(Math.abs(ratios.leftPercent - 50), Math.abs(ratios.topPercent - 50))
    const threshold = 10 // zoom when deviation <= 10% (includes Potential 9 and 10)
    const maxZoom = 4
    if (worst <= threshold) {
      const normalized = (threshold - worst) / threshold // 0..1
      const z = 1 + (Math.log10(1 + 9 * normalized) / Math.log10(10)) * (maxZoom - 1)
      return Math.max(1, Math.min(maxZoom, Number(z.toFixed(3))))
    }
    return 1
  })()
  // helper: color for grade badge
  const gradeBadgeColor = ratios
    ? ratios.grade.includes('10')
      ? SUCCESS
      : ratios.grade.includes('9')
      ? PRIMARY_400
      : ratios.grade.includes('8')
      ? AMBER_400
      : '#CBD5E1'
    : '#CBD5E1'

  function handleAngleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAngle(Number(e.target.value))
  }

  function handleScaleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const prevScale = scale;
    const newScale = Number(e.target.value);
    setScale(newScale);
    // After scale changes, preserve center
    setTimeout(() => centerCanvasInView(true, prevScale), 0);
  }

  function handleAutoCenter() {
    if (!outerRect || !innerRect) return
    const cx = outerRect.x + outerRect.w / 2
    const cy = outerRect.y + outerRect.h / 2
    const nx = cx - innerRect.w / 2
    const ny = cy - innerRect.h / 2
    setInnerRect((prev) => prev ? { ...prev, x: nx, y: ny } : prev)
  }

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Card Centering Analyzer</h1>
            <p className="text-xs sm:text-sm text-white/40 mt-0.5">Upload · Straighten · Measure</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 hidden sm:inline">Estimated</span>
            <div
              className="px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg"
              style={{ background: gradeBadgeColor }}
            >
              {ratios ? ratios.grade : '—'}
            </div>
            <span className="text-xs text-white/40 font-mono">{ratios ? `${ratios.worst}%` : ''}</span>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-5 lg:gap-6">

          {/* ═══ Sidebar / Controls ═══ */}
          <aside className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 lg:sticky lg:top-6 lg:self-start order-2 lg:order-1 space-y-5">

            {/* Upload row */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition-colors"
                style={{ background: PRIMARY_500 }}
              >
                Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              <button onClick={handleReset} className="px-3 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-colors">Reset</button>
              <button onClick={() => setScale(1)} className="px-3 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-colors">Fit</button>
              <span className="ml-auto text-xs text-white/30 hidden sm:inline">or drag & drop</span>
            </div>

            <hr className="border-white/[0.06]" />

            {/* Rotation */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Rotation</span>
                <span className="ml-auto font-mono text-xs text-white/40">{debouncedAngle.toFixed(2)}°</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Knob value={angle} onChange={(v) => setAngle(v)} min={-30} max={30} size={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <input type="range" min={-30} max={30} step={0.01} value={angle} onChange={handleAngleInputChange} className="w-full accent-[#b79ad8]" />
                  <div className="mt-2 flex items-center gap-2">
                    <input aria-label="Angle" className="w-16 px-2 py-1 rounded-md border border-white/10 bg-white/[0.04] text-white text-sm text-center" type="number" step={0.01} value={angle} onChange={handleAngleInputChange} />
                    <button onClick={() => setAngle(0)} className="px-2 py-1 rounded-md border border-white/10 text-white/50 text-xs hover:text-white transition-colors">0°</button>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-white/[0.06]" />

            {/* Zoom */}
            <div>
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Visual Zoom</span>
                <span className="ml-auto text-xs text-white/30">visual only</span>
              </div>
              <input type="range" min={0.4} max={2.5} step={0.01} value={scale} onChange={handleScaleInputChange} className="w-full accent-[#b79ad8]" />
              <div className="mt-2 flex items-center gap-2">
                <input aria-label="Scale" className="w-16 px-2 py-1 rounded-md border border-white/10 bg-white/[0.04] text-white text-sm text-center" type="number" step={0.01} min={0.4} max={2.5} value={scale} onChange={handleScaleInputChange} />
                <button onClick={() => setScale(1)} className="ml-auto px-2 py-1 rounded-md border border-white/10 text-white/50 text-xs hover:text-white transition-colors">Reset</button>
              </div>
            </div>

            <hr className="border-white/[0.06]" />

            {/* Quick Measurements */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Measurements</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div className="text-white/40">L / R</div>
                <div className="text-white font-medium text-right">{ratios ? `${ratios.leftPercent}% / ${ratios.rightPercent}%` : '—'}</div>
                <div className="text-white/40">T / B</div>
                <div className="text-white font-medium text-right">{ratios ? `${ratios.topPercent}% / ${ratios.bottomPercent}%` : '—'}</div>
                <div className="text-white/40">Gaps</div>
                <div className="text-white font-medium text-right">{ratios ? `${ratios.leftGap}px / ${ratios.rightGap}px` : '—'}</div>
                <div className="text-white/40">Worst</div>
                <div className="text-white font-medium text-right">{ratios ? `${ratios.worst}%` : '—'}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={handleAutoCenter} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 text-xs hover:text-white hover:border-white/20 transition-colors">Auto center</button>
                <button onClick={() => { if (imgRef.current) initCanvasAndRects(imgRef.current) }} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 text-xs hover:text-white hover:border-white/20 transition-colors">Re-fit rects</button>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-[11px] leading-relaxed text-white/25">Upload an image, straighten with the knob, then drag the outer (purple) box to the card edge and inner (cyan) box to the printed border. Values update live.</p>
          </aside>

          {/* ═══ Main content ═══ */}
          <main className="order-1 lg:order-2 space-y-5">

            {/* Canvas preview */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-3 sm:p-4">
              <div
                ref={canvasWrapperRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="rounded-xl border border-white/[0.08] bg-[#f8f8fa] flex items-center justify-center overflow-auto"
                style={{ minWidth: 600, minHeight: 500, maxWidth: '100%', maxHeight: 600 }}
              >
                <canvas
                  ref={canvasRef}
                  className="block touch-none"
                  style={{
                    width: canvasRef.current ? canvasRef.current.width * scale : undefined,
                    height: canvasRef.current ? canvasRef.current.height * scale : undefined,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
              {!imageSrc && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
                    style={{ background: PRIMARY_500 }}
                  >
                    Choose a card image to start
                  </button>
                  <p className="text-xs text-white/30 mt-2">or drag & drop onto the canvas</p>
                </div>
              )}
            </div>

            {/* Visualizations — side by side on md+, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4">
                <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Centering Plot</div>
                <div className="w-full max-w-[280px] mx-auto">
                  <ProportionScatter xPercent={ratios?.leftPercent} yPercent={ratios?.topPercent} dotColor={PRIMARY_400} size={SCATTER_SIZE} zoom={scatterAutoZoom} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4">
                <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Grading Triangle</div>
                <div className="w-full max-w-[280px] mx-auto">
                  <GradeVisualizer ratios={ratios} />
                </div>
              </div>
            </div>

            {/* Detailed values */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4">
              <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Detailed Values</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Left gap', value: ratios ? `${ratios.leftGap}px` : '—' },
                  { label: 'Right gap', value: ratios ? `${ratios.rightGap}px` : '—' },
                  { label: 'Top gap', value: ratios ? `${ratios.topGap}px` : '—' },
                  { label: 'Bottom gap', value: ratios ? `${ratios.bottomGap}px` : '—' },
                ].map((d) => (
                  <div key={d.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
                    <div className="text-[11px] text-white/35 mb-0.5">{d.label}</div>
                    <div className="text-sm font-semibold text-white">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
