'use client';

import React from 'react';
import type { GradingCompany } from '../types';

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

const LEVEL_STYLES: Record<MemberLevel, { background: string; shadow: string; border: string; icon: string }> = {
  Foil:   { background: 'linear-gradient(135deg,#B8B8B8 0%,#E4E4E4 45%,#A0A0A0 55%,#CACACA 100%)', shadow: '0 0 10px rgba(200,200,200,0.3)',  border: 'rgba(220,220,220,0.45)', icon: '✦' },
  Prism:  { background: 'linear-gradient(135deg,#D4899A 0%,#9B7EBF 40%,#7BAFD4 70%,#D4899A 100%)', shadow: '0 0 12px rgba(155,126,191,0.45)', border: 'rgba(155,126,191,0.55)', icon: '◈' },
  Aurora: { background: 'linear-gradient(135deg,#5EC9A0 0%,#9B7EBF 45%,#D4899A 85%,#5EC9A0 100%)', shadow: '0 0 14px rgba(94,201,160,0.45)',  border: 'rgba(94,201,160,0.5)',   icon: '✧' },
};

export function MemberBadge({ level }: { level: MemberLevel }) {
  const s = LEVEL_STYLES[level];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] text-[#1e1e2e] flex-shrink-0"
      style={{ background: s.background, boxShadow: s.shadow, border: `1px solid ${s.border}` }}
    >
      <span className="text-[9px]">{s.icon}</span>{level}
    </span>
  );
}

/* ─── Style constants ─────────────────────────────────────────────────────── */

export const inp = 'w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#9B7EBF]/50 transition-colors cursor-pointer';
export const lbl = 'text-white/60 text-xs uppercase tracking-widest mb-1 block';

/* ─── Shared UI components ────────────────────────────────────────────────── */

export function GradePill({ company, grade, isBlackLabel }: { company: GradingCompany; grade: number; isBlackLabel?: boolean }) {
  const gradeColor = grade >= 10 ? 'text-amber-300 border-amber-400/40 bg-amber-400/10'
    : grade >= 9 ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
    : grade >= 7 ? 'text-blue-400 border-blue-400/40 bg-blue-400/10'
    : 'text-white/50 border-white/20 bg-white/5';
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
      <div className="flex items-center gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-[#9B7EBF] text-[10px] uppercase tracking-[0.2em] font-semibold">{title}</p>
          {subtitle && <p className="text-white/30 text-[10px] mt-0.5 normal-case tracking-normal">{subtitle}</p>}
        </div>
        {extra && <div className="ml-2 flex-shrink-0">{extra}</div>}
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>
      {children}
    </div>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!value);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={handleKey}
      onClick={() => onChange(!value)}
      className="flex items-center gap-2.5 group cursor-pointer"
    >
      <div className={`relative w-9 h-5 rounded-full transition-all duration-300 ${value ? 'bg-[#9B7EBF]' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </div>
      <span className={`text-xs transition-colors ${value ? 'text-white' : 'text-white/40'} group-hover:text-white/70`}>{label}</span>
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
