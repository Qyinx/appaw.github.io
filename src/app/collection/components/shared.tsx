'use client';

import React from 'react';
import type { GradingCompany, Currency } from '../types';
import { normalizePreferredCurrency } from '@/lib/collection/currency';

/* ─── Member level ────────────────────────────────────────────────────────── */

export type MemberLevel = 'Foil' | 'Prism' | 'Aurora';
const MEMBER_LEVELS: MemberLevel[] = ['Foil', 'Prism', 'Aurora'];

export function getMemberLevel(): MemberLevel | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('auth0_user');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const candidate = parsed.memberLevel
      ?? (Array.isArray(parsed.roles) ? parsed.roles.find((r: string) => MEMBER_LEVELS.includes(r as MemberLevel)) : undefined);
    return MEMBER_LEVELS.includes(candidate as MemberLevel) ? (candidate as MemberLevel) : undefined;
  } catch { return undefined; }
}

export function getPreferredCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD';
  try {
    const raw = localStorage.getItem('auth0_user');
    if (!raw) return 'USD';
    const parsed = JSON.parse(raw);
    return normalizePreferredCurrency(parsed.preferredCurrency);
  } catch { return 'USD'; }
}

const LEVEL_STYLES: Record<MemberLevel, { background: string; shadow: string; border: string; icon: string }> = {
  Foil:   { background: 'linear-gradient(135deg,#B8B8B8 0%,#E4E4E4 45%,#A0A0A0 55%,#CACACA 100%)', shadow: '0 0 10px rgba(200,200,200,0.3)',  border: 'rgba(220,220,220,0.45)', icon: '✦' },
  Prism:  { background: 'linear-gradient(135deg,var(--accent-primary) 0%,var(--accent-secondary) 40%,#7BAFD4 70%,var(--accent-primary) 100%)', shadow: '0 0 12px rgba(139,152,251,0.35)', border: 'rgba(139,152,251,0.55)', icon: '◈' },
  Aurora: { background: 'linear-gradient(135deg,#5EC9A0 0%,var(--accent-secondary) 45%,var(--accent-primary) 85%,#5EC9A0 100%)', shadow: '0 0 14px rgba(94,201,160,0.35)',  border: 'rgba(94,201,160,0.5)',   icon: '✧' },
};

export function MemberBadge({ level }: { level: MemberLevel }) {
  const s = LEVEL_STYLES[level];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.1em] text-surface-bg flex-shrink-0"
      style={{ background: s.background, boxShadow: s.shadow, border: `1px solid ${s.border}` }}
    >
      <span className="text-[9px]">{s.icon}</span>{level}
    </span>
  );
}

/* ─── Style constants ─────────────────────────────────────────────────────── */

export const inp = 'w-full bg-surface-raised border border-border-default px-3 py-2.5 min-h-11 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg focus:border-accent-secondary transition-[border-color,box-shadow] cursor-pointer';
export const lbl = 'text-text-secondary text-xs uppercase tracking-widest mb-1 block font-mono';

/* ─── Shared UI components ────────────────────────────────────────────────── */

export function GradePill({ company, grade, isBlackLabel }: { company: GradingCompany; grade: number; isBlackLabel?: boolean }) {
  const gradeColor = grade >= 10 ? 'text-amber-300 border-amber-400/40 bg-amber-400/10'
    : grade >= 9 ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
    : grade >= 7 ? 'text-blue-400 border-blue-400/40 bg-blue-400/10'
    : 'text-text-muted border-border-default bg-surface-raised';
  const coStyle: React.CSSProperties =
    company === 'PSA' ? { backgroundColor: '#EE0403', color: '#ffffff' }
    : company === 'BGS' ? { backgroundColor: '#161619', color: '#B6975B', border: '1px solid #B6975B' }
    : company === 'CGC' ? { backgroundColor: '#C90000', color: '#ffffff' }
    : /* TAG */           { backgroundColor: '#1E1F1F', color: '#ffffff', border: '1px solid #ffffff' };
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={coStyle}>{company}</span>
      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${gradeColor}`}>{grade}</span>
      {isBlackLabel && (
        <span className="text-[9px] font-black px-1 py-0.5 rounded bg-black border border-white/30 text-white/90 tracking-tight">BL</span>
      )}
    </div>
  );
}

export function Section({ title, subtitle, children, extra }: { title: string; subtitle?: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-accent-primary text-xs uppercase tracking-[0.2em] font-semibold font-mono">{title}</p>
            <div className="hidden sm:block flex-1 h-px bg-border-default min-w-[1rem]" />
          </div>
          {subtitle && <p className="text-text-muted text-xs mt-1 normal-case tracking-normal leading-relaxed">{subtitle}</p>}
        </div>
        {extra && (
          <div className="flex-shrink-0 w-full sm:w-auto sm:max-w-[55%] sm:justify-end flex sm:justify-end border-t border-border-default pt-3 sm:border-t-0 sm:pt-0">
            {extra}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export function Toggle({ value, onChange, label, id }: { value: boolean; onChange: (v: boolean) => void; label: React.ReactNode; id?: string }) {
  const autoId = React.useId();
  const switchId = id ?? autoId;

  return (
    <div className="flex items-center justify-between gap-4 min-h-11 w-full touch-manipulation">
      <label htmlFor={switchId} className={`text-sm leading-snug min-w-0 flex-1 cursor-pointer ${value ? 'text-text-primary' : 'text-text-secondary'}`}>
        {label}
      </label>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={value}
        data-state={value ? 'checked' : 'unchecked'}
        onClick={() => onChange(!value)}
        className="switch"
      >
        <span className="switch__thumb" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ─── Image compression utility ──────────────────────────────────────────── */

export function compressImage(
  file: File,
  maxPx = 1024,
  quality = 0.75,
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}
