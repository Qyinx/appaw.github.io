'use client';

import React, { useState, useRef, type ChangeEvent } from 'react';
import {
  X, Loader2, List,
  AlertCircle, Check, Camera, ScanLine, Sparkles, Folder, ImagePlus, ZoomIn,
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
  saving: boolean;
  saveMsg?: string | null;
  portfolios: Portfolio[];
  initialPortfolioIds: string[];
}

export function CardFormView({ initial, isEdit, onBack, onSave, onScan, saving, saveMsg, portfolios, initialPortfolioIds }: CardFormViewProps) {
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
      setScanMsg('Fields auto-filled — please review before saving.');
    } catch (err) {
      setScanState('error');
      setScanMsg(err instanceof Error ? err.message : 'Scan failed. Please fill in manually.');
    }
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Card name is required');
    if (form.buyPrice && isNaN(+form.buyPrice)) errs.push('Buy price must be a valid number');
    if (!form.year || isNaN(+form.year)) errs.push('Valid year is required');
    if (!form.grade || isNaN(+form.grade)) errs.push('Valid grade is required');
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    await onSave(form, selectedPortfolioIds);
  }

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      {/* Sticky header */}
      <div className="sticky top-16 md:top-20 z-20 bg-[#1e1e2e]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <List className="w-4 h-4" />
            <span>Back to list</span>
          </button>
          <h2 className="text-white font-semibold text-sm">{isEdit ? 'Edit Card' : 'Add New Card'}</h2>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white text-xs transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#9B7EBF] hover:bg-[#AF97D3] text-[#1e1e2e] text-xs font-bold transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Add Card')}
            </button>
          </div>
        </div>
      </div>

      {/* Save success toast */}
      {saveMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/90 backdrop-blur text-white text-sm font-medium shadow-lg pointer-events-none">
          <Check className="w-4 h-4 shrink-0" />
          {saveMsg}
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* ── CARD PHOTOS ── Always first: this is the primary visual record */}
        <Section title="Card Photos" subtitle="Front & back photos stored with this card">
          <div className="grid grid-cols-2 gap-4">
            {(['frontImage', 'backImage'] as const).map(side => {
              const label = side === 'frontImage' ? 'Front' : 'Back';
              const ref   = side === 'frontImage' ? frontRef : backRef;
              const value = form[side];
              return (
                <div key={side} className="flex flex-col gap-2">
                  <p className={lbl}>{label}</p>
                  {value ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[3/4] bg-black/40 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={value} alt={label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setPhotoZoom(value)}
                          className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => set(side, undefined)}
                          className="p-2 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => ref.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04] text-white/30 hover:text-white/60 transition-all"
                    >
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-xs font-medium">Add {label}</span>
                    </button>
                  )}
                  <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhotoChange(e, side)} />
                </div>
              );
            })}
          </div>
        </Section>

        {/* Photo zoom lightbox */}
        {photoZoom && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPhotoZoom(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoZoom} alt="Card photo" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-zoom-out" onClick={e => e.stopPropagation()} />
            <button type="button" onClick={() => setPhotoZoom(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ── AI LABEL SCAN (add-only) ── Different purpose: auto-fills form fields, not a photo record */}
        {!isEdit && (
          <div className="mb-6">
            {/* Idle: compact callout bar */}
            {scanState === 'idle' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#9B7EBF]/[0.07] border border-[#9B7EBF]/20">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#9B7EBF] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white/80 text-sm font-medium">Auto-fill from grading label</p>
                    <p className="text-white/40 text-xs truncate">Scan the PSA / BGS / CGC label to fill fields automatically</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scanRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9B7EBF] hover:bg-[#AF97D3] text-[#1e1e2e] text-xs font-bold transition-colors flex-shrink-0"
                >
                  <ScanLine className="w-3.5 h-3.5" />Scan Label
                </button>
              </div>
            )}

            {/* Scanning: slim progress bar */}
            {scanState === 'scanning' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#9B7EBF]/[0.07] border border-[#9B7EBF]/20">
                <Loader2 className="w-4 h-4 text-[#9B7EBF] animate-spin flex-shrink-0" />
                <p className="text-white/60 text-sm flex-1">Analysing grading label…</p>
              </div>
            )}

            {/* Done: dismissible success bar */}
            {scanState === 'done' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-emerald-400 text-sm flex-1">{scanMsg}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => { setScanState('idle'); scanRef.current?.click(); }} className="text-emerald-400/70 hover:text-emerald-300 text-xs underline-offset-2 hover:underline transition-colors">
                    Rescan
                  </button>
                  <button type="button" onClick={() => setScanState('idle')} className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors">
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
                    <Camera className="w-3 h-3" />Try Again
                  </button>
                  <button type="button" onClick={() => setScanState('idle')} className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors">
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
              <AlertCircle className="w-3.5 h-3.5" />Please fix the following:
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {errors.map((e, i) => <li key={i} className="text-red-400/80 text-xs">{e}</li>)}
            </ul>
          </div>
        )}

        {/* ── BASIC INFO ── */}
        <Section title="Basic Info">
          <div className="space-y-3">
            <div>
              <label className={lbl}>Card Name *</label>
              <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Charizard VMAX" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={lbl}>Year *</label>
                <input className={inp} type="number" min="1990" max={CURRENT_YEAR + 1} value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Set Name</label>
                <input className={inp} value={form.set ?? ''} onChange={e => set('set', e.target.value)} placeholder="e.g. SM8b - Ultra Shiny" />
              </div>
              <div>
                <label className={lbl}>Card Number</label>
                <input className={inp} value={form.number ?? ''} onChange={e => set('number', e.target.value)} placeholder="e.g. 240/150" />
              </div>
            </div>
            <div>
              <label className={lbl}>Language</label>
              <select className={inp} value={form.language} onChange={e => set('language', e.target.value as Language)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* ── GRADING ── */}
        <Section title="Grading">
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
                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                      isActive
                        ? 'border-transparent'
                        : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70'
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
                label="Black Label (perfect 10 sub-grades)"
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Grade *</label>
                <input className={inp} type="number" min="1" max="10" step="0.5" value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="10" />
              </div>
              <div>
                <label className={lbl}>Cert / Slab Number</label>
                <input className={inp} value={form.certNumber ?? ''} onChange={e => set('certNumber', e.target.value)} placeholder="e.g. 82345678" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── PRICING ── */}
        <Section title="Pricing">
          <div className="space-y-3">
            <div>
              <label className={lbl}>Buy Price <span className="text-white/40 font-normal normal-case tracking-normal">(optional)</span></label>
              <div className="flex gap-2">
                <select
                  className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9B7EBF]/50 transition-colors"
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
                <span className="text-white/40 font-normal normal-case tracking-normal ml-1.5">(optional)</span>
              </label>
              <div className="flex gap-2">
                <select
                  className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9B7EBF]/50 transition-colors"
                  value={form.listCurrency ?? 'HKD'}
                  onChange={e => set('listCurrency', e.target.value as typeof form.listCurrency)}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" min="0" className={`${inp} flex-1`} placeholder="0" value={form.listPrice} onChange={e => set('listPrice', e.target.value)} />
              </div>
            </div>
            <Toggle value={form.sold} onChange={v => set('sold', v)} label="Mark as Sold" />
          </div>
        </Section>

        {/* ── PORTFOLIOS ── */}
        {portfolios.length > 0 && (
          <Section title="Portfolios">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {portfolios.map(p => {
                const selected = selectedPortfolioIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePortfolio(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all text-left ${
                      selected
                        ? 'bg-[#9B7EBF]/15 border-[#9B7EBF]/40 text-white'
                        : 'bg-white/[0.03] border-white/10 text-white/45 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-[#9B7EBF]' : 'text-white/30'}`} />
                    <span className="truncate">{p.name}</span>
                    {selected && <Check className="w-3 h-3 text-[#9B7EBF] ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button onClick={onBack} className="px-4 py-2 rounded-lg text-white/40 hover:text-white text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#9B7EBF] hover:bg-[#AF97D3] text-[#1e1e2e] text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving…' : (isEdit ? 'Update Card' : 'Add Card')}
          </button>
        </div>
      </div>
    </div>
  );
}
