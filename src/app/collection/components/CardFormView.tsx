'use client';

import React, { useState, useRef, type ChangeEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  X, Loader2, List,
  AlertCircle, Check, Camera, ScanLine, Sparkles, Folder, ImagePlus, ZoomIn, Eye, EyeOff,
} from 'lucide-react';
import {
  type CardFormState,
  type Language,
  type GradingCompany,
  type Portfolio,
  COMPANIES, CURRENCIES, LANGUAGES, CURRENT_YEAR,
  emptyForm,
} from '../types';
import { inp, lbl, Section, Toggle, compressImage } from './shared';

export interface CardFormViewProps {
  initial: CardFormState | null;
  isEdit: boolean;
  onBack: () => void;
  onSave: (form: CardFormState, portfolioIds: string[]) => Promise<void>;
  onScan: (file: File) => Promise<Partial<CardFormState>>;
  onLoadImages?: () => Promise<{ frontImage?: string; backImage?: string } | undefined>;
  saving: boolean;
  saveMsg?: string | null;
  portfolios: Portfolio[];
  initialPortfolioIds: string[];
}

export function CardFormView({ initial, isEdit, onBack, onSave, onScan, onLoadImages, saving, saveMsg, portfolios, initialPortfolioIds }: CardFormViewProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<CardFormState>(initial ?? emptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>(initialPortfolioIds);

  const togglePortfolio = (id: string) =>
    setSelectedPortfolioIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const set = <K extends keyof CardFormState>(key: K, value: CardFormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  /* ── Card photo upload ── */
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef  = useRef<HTMLInputElement>(null);
  const [photoZoom, setPhotoZoom] = useState<string | null>(null);
  const [photosCollapsed, setPhotosCollapsed] = useState<boolean>(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>, side: 'frontImage' | 'backImage') {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const { base64, mimeType } = await compressImage(file, 1200, 0.82);
    set(side, `data:${mimeType};base64,${base64}`);
  }

  /* ── AI label scan (add-only) ── */
  const scanRef = useRef<HTMLInputElement>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [scanMsg, setScanMsg] = useState('');

  async function handleScanFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setScanState('scanning');
    setScanMsg('');
    try {
      const data = await onScan(file);
      setForm(prev => ({ ...prev, ...data }));
      setScanState('done');
      setScanMsg(t.collection.form.scan.doneMsg);
    } catch (err) {
      setScanState('error');
      setScanMsg(err instanceof Error ? err.message : t.collection.form.scan.scanFailed);
    }
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push(t.collection.form.errors.nameRequired);
    if (form.buyPrice && isNaN(+form.buyPrice)) errs.push(t.collection.form.errors.buyPriceInvalid);
    if (!form.year || isNaN(+form.year)) errs.push(t.collection.form.errors.yearInvalid);
    if (!form.grade || isNaN(+form.grade)) errs.push(t.collection.form.errors.gradeInvalid);
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    await onSave(form, selectedPortfolioIds);
  }

  return (
    <div className="min-h-dvh bg-surface-bg overflow-x-clip">
      {/* Sticky header */}
      <div className="sticky top-16 md:top-20 z-20 bg-surface-bg/95 border-b border-border-default">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors">
            <List className="w-4 h-4" />
            <span>{t.common.back}</span>
          </button>
          <h2 className="text-text-primary font-semibold text-sm">{isEdit ? t.collection.form.editTitle : t.collection.form.addTitle}</h2>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>

      {/* Toast popup for save messages */}
      {saveMsg && (
        <div className="fixed top-24 right-6 z-50">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/90 text-[#0f1720] shadow-lg border border-emerald-700">
            <Check className="w-4 h-4 text-[#0f1720]" />
            <div className="text-sm font-medium">{saveMsg}</div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Card photos moved to the end and collapsed by default. See below. */}

        {/* Photo zoom lightbox */}
        {photoZoom && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPhotoZoom(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoZoom} alt="Card photo" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-zoom-out" onClick={e => e.stopPropagation()} />
            <button type="button" onClick={() => setPhotoZoom(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ── AI LABEL SCAN (add-only) ── Different purpose: auto-fills form fields, not a photo record */}
        {!isEdit && (
          <div className="mb-6">
            {/* Idle: compact callout bar */}
            {scanState === 'idle' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-link/[0.07] border border-accent-link/20">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Sparkles className="w-4 h-4 text-accent-link flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-text-primary text-sm font-medium">{t.collection.form.scan.title}</p>
                    <p className="text-text-muted text-xs truncate">{t.collection.form.scan.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scanRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-link hover:brightness-110 text-surface-bg text-xs font-bold transition-colors flex-shrink-0"
                >
                  <ScanLine className="w-3.5 h-3.5" />{t.collection.form.scan.scanButton}
                </button>
              </div>
            )}

            {/* Scanning: slim progress bar */}
            {scanState === 'scanning' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-link/[0.07] border border-accent-link/20">
                <Loader2 className="w-4 h-4 text-accent-link animate-spin flex-shrink-0" />
                <p className="text-text-secondary text-sm flex-1">{t.collection.form.scan.analysing}</p>
              </div>
            )}

            {/* Done: dismissible success bar */}
            {scanState === 'done' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-400 text-sm flex-1">{t.collection.form.scan.doneMsg}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => { setScanState('idle'); scanRef.current?.click(); }} className="text-emerald-400/70 hover:text-emerald-300 text-xs underline-offset-2 hover:underline transition-colors">
                    {t.collection.form.scan.rescan}
                  </button>
                  <button type="button" onClick={() => setScanState('idle')} className="p-1 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Error: retry bar */}
            {scanState === 'error' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400/80 text-sm flex-1">{scanMsg}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => { setScanState('idle'); scanRef.current?.click(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition-colors">
                    <Camera className="w-3 h-3" />{t.collection.form.scan.tryAgain}
                  </button>
                  <button type="button" onClick={() => setScanState('idle')} className="p-1 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <input ref={scanRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanFile} />
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/25 p-4">
            <p className="text-red-400 text-xs font-bold mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />{t.collection.form.fixFollowing}
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((e, i) => <li key={i} className="text-red-400/80 text-xs">{e}</li>)}
            </ul>
          </div>
        )}

        {/* ── BASIC INFO ── */}
        <Section title={t.collection.form.basicInfo}>
          <div className="space-y-3">
            <div>
              <label className={lbl}>{t.collection.form.name} *</label>
              <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder={t.collection.form.namePlaceholder} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={lbl}>{t.collection.form.year} *</label>
                <input className={inp} type="number" min="1990" max={CURRENT_YEAR + 1} value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={lbl}>{t.collection.form.setName}</label>
                <input className={inp} value={form.set ?? ''} onChange={e => set('set', e.target.value)} placeholder="e.g. SM8b - Ultra Shiny" />
              </div>
              <div>
                <label className={lbl}>{t.collection.form.cardNumber}</label>
                <input className={inp} value={form.number ?? ''} onChange={e => set('number', e.target.value)} placeholder="e.g. 240/150" />
              </div>
            </div>
            <div>
              <label className={lbl}>{t.collection.form.language}</label>
              <select className={inp} value={form.language} onChange={e => set('language', e.target.value as Language)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* ── GRADING ── */}
        <Section title={t.collection.form.grading}>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {COMPANIES.map(co => {
                // Brand-accurate colours per grading company
                const active: Record<string, { bg: string; border: string; color: string }> = {
                  PSA: { bg: 'rgba(238,4,3,0.88)',    border: '#EE0403', color: '#ffffff' }, // PSA red/white
                  BGS: { bg: 'rgba(22,22,25,0.95)',  border: '#B6975B', color: '#B6975B' }, // BGS dark/gold
                  CGC: { bg: 'rgba(201,0,0,0.85)',   border: '#C90000', color: '#ffffff' }, // CGC red/white
                  TAG: { bg: 'rgba(30,31,31,0.95)',   border: '#ffffff', color: '#ffffff' }, // TAG black/white
                };
                const isActive = form.company === co;
                const style = isActive ? {
                  backgroundColor: active[co]?.bg,
                  borderColor:     active[co]?.border,
                  color:           active[co]?.color,
                } : undefined;
                return (
                  <button
                    key={co}
                    type="button"
                    onClick={() => {
                      set('company', co);
                      if (co === 'PSA' || co === 'TAG') set('isBlackLabel', false);
                    }}
                    style={style}
                    className={`py-2 rounded-lg text-sm font-bold border transition-[color,background-color,border-color,opacity,transform] ${
                      isActive
                        ? 'border-transparent'
                        : 'bg-surface-raised border-border-default text-text-muted hover:text-text-primary/70'
                    }`}
                  >
                    {co}
                  </button>
                );
              })}
            </div>
            {(form.company === 'BGS' || form.company === 'CGC') && (
              <Toggle
                value={form.isBlackLabel ?? false}
                onChange={v => set('isBlackLabel', v)}
                label={t.collection.form.blackLabel}
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{t.collection.form.grade} *</label>
                <input className={inp} type="number" min="1" max="10" step="0.5" value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="10" />
              </div>
              <div>
                <label className={lbl}>{t.collection.form.certNumber}</label>
                <input className={inp} value={form.certNumber ?? ''} onChange={e => set('certNumber', e.target.value)} placeholder="e.g. 82345678" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── PRICING ── */}
        <Section title={t.collection.form.pricing}>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Buy Price <span className="text-text-muted font-normal normal-case tracking-normal">(optional)</span></label>
              <div className="flex gap-2">
                <select
                  className="bg-surface-raised border border-border-default rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-link/50 transition-colors"
                  value={form.buyCurrency}
                  onChange={e => set('buyCurrency', e.target.value as typeof form.buyCurrency)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min="0" className={`${inp} flex-1`} placeholder="0" value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={lbl}>
                List / Sell Price
                <span className="text-text-muted font-normal normal-case tracking-normal ml-1.5">(optional)</span>
              </label>
              <div className="flex gap-2">
                <select
                  className="bg-surface-raised border border-border-default rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-link/50 transition-colors"
                  value={form.listCurrency ?? 'HKD'}
                  onChange={e => set('listCurrency', e.target.value as typeof form.listCurrency)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min="0" className={`${inp} flex-1`} placeholder="0" value={form.listPrice} onChange={e => set('listPrice', e.target.value)} />
              </div>
            </div>
            <Toggle value={form.sold} onChange={v => set('sold', v)} label={t.collection.form.markAsSold} />
          </div>
        </Section>

        {/* ── PORTFOLIOS ── */}
        {/* Collapsed Card Photos placed before Portfolios (collapsed by default) */}
        <Section title={t.collection.form.photosTitle} subtitle={t.collection.form.photosSubtitle} extra={(
          <Toggle
            value={!photosCollapsed}
            onChange={async v => {
              const willExpand = v;
              if (willExpand && onLoadImages) {
                setLoadingPhotos(true);
                try {
                  const imgs = await onLoadImages();
                  if (imgs) {
                    if (imgs.frontImage) set('frontImage', imgs.frontImage);
                    if (imgs.backImage) set('backImage', imgs.backImage);
                  }
                } finally { setLoadingPhotos(false); }
              }
              setPhotosCollapsed(!v);
            }}
            label={<span className="flex items-center gap-2">{loadingPhotos ? <Loader2 className="w-4 h-4 animate-spin" /> : (photosCollapsed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}{t.collection.form.photos}</span>}
          />
        )}>
          {!photosCollapsed && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {(['frontImage', 'backImage'] as const).map(side => {
                const label = side === 'frontImage' ? t.collection.form.front : t.collection.form.back;
                const ref   = side === 'frontImage' ? frontRef : backRef;
                const value = form[side];
                return (
                  <div key={side} className="flex flex-col gap-2">
                    <p className={lbl}>{label}</p>
                    {value ? (
                      <div className="relative rounded-xl overflow-hidden border border-border-default aspect-[3/4] bg-black/40 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button type="button" onClick={() => setPhotoZoom(value)} className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-text-primary transition-colors"><ZoomIn className="w-4 h-4" /></button>
                          <button type="button" onClick={() => ref.current?.click()} className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-text-primary transition-colors"><Camera className="w-4 h-4" /></button>
                          <button type="button" onClick={() => set(side, undefined)} className="p-2 rounded-full bg-black/60 hover:bg-red-500/80 text-text-primary transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => ref.current?.click()} className="flex flex-col items-center justify-center gap-2 aspect-[3/4] rounded-xl border-2 border-dashed border-border-default hover:border-border-strong bg-white/[0.02] hover:bg-surface-raised text-text-muted hover:text-text-primary/60 transition-[color,background-color,border-color,opacity,transform]">
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-xs font-medium">{t.collection.form.addPrefix} {label}</span>
                      </button>
                    )}
                    <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhotoChange(e, side)} />
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {portfolios.length > 0 && (
          <Section title={t.collection.portfolio.title}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {portfolios.map(p => {
                const selected = selectedPortfolioIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePortfolio(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-[color,background-color,border-color,opacity,transform] text-left ${
                      selected
                        ? 'bg-accent-link/15 border-accent-link/40 text-text-primary'
                        : 'bg-surface-raised border-border-default text-text-muted hover:text-text-primary hover:border-border-strong'
                    }`}
                  >
                    <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-accent-link' : 'text-text-muted'}`} />
                    <span className="truncate">{p.name}</span>
                    {selected && <Check className="w-3 h-3 text-accent-link ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button onClick={onBack} className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary text-sm transition-colors">
            {t.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent-link hover:brightness-110 text-surface-bg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? t.collection.form.saving : (isEdit ? t.collection.form.updateCard : t.collection.form.addCard)}
          </button>
        </div>
      </div>
    </div>
  );
}
