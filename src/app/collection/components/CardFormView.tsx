'use client';

import React, { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  X, Loader2, ArrowLeft,
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
import HeroStamp from '@/components/ui/HeroStamp';
import { WorkspaceNotice } from './WorkspaceNotice';
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

const GRADE_CO_STYLES: Record<GradingCompany, React.CSSProperties> = {
  PSA: { backgroundColor: '#EE0403', borderColor: '#EE0403', color: '#ffffff' },
  BGS: { backgroundColor: '#161619', borderColor: '#B6975B', color: '#B6975B' },
  CGC: { backgroundColor: '#C90000', borderColor: '#C90000', color: '#ffffff' },
  TAG: { backgroundColor: '#1E1F1F', borderColor: '#ffffff', color: '#ffffff' },
};

export function CardFormView({
  initial, isEdit, onBack, onSave, onScan, onLoadImages,
  saving, saveMsg, portfolios, initialPortfolioIds,
}: CardFormViewProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<CardFormState>(initial ?? emptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<string[]>(initialPortfolioIds);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  const [photoZoom, setPhotoZoom] = useState<string | null>(null);
  const [photosCollapsed, setPhotosCollapsed] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [scanMsg, setScanMsg] = useState('');

  const pageTitle = isEdit ? t.collection.form.editTitle : t.collection.form.addTitle;
  const saveLabel = saving
    ? t.collection.form.saving
    : (isEdit ? t.collection.form.updateCard : t.collection.form.addCard);

  const togglePortfolio = (id: string) =>
    setSelectedPortfolioIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const set = <K extends keyof CardFormState>(key: K, value: CardFormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>, side: 'frontImage' | 'backImage') {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const { base64, mimeType } = await compressImage(file, 1200, 0.82);
    set(side, `data:${mimeType};base64,${base64}`);
  }

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

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      errorSummaryRef.current?.focus();
      nameInputRef.current?.focus();
      return;
    }
    setErrors([]);
    await onSave(form, selectedPortfolioIds);
  }

  const selectCls =
    'bg-surface-panel border border-border-default px-3 py-2 min-h-11 text-text-primary text-sm focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg transition-[border-color,box-shadow]';

  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip overflow-y-visible">

      {/* Sticky workspace chrome */}
      <div className="workspace-chrome sticky top-16 md:top-20 z-30 border-b border-border-default shadow-[0_1px_0_var(--border-default)]">
        <div className="container-tool max-w-3xl flex items-center justify-between gap-2 py-2 min-h-[2.75rem]">
          <button type="button" onClick={onBack} className="btn btn-ghost text-sm min-h-11 px-2 flex-shrink-0">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t.common.back}</span>
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
              <div className="w-2 h-2 bg-accent-primary" />
              <div className="w-2 h-2 bg-border-strong" />
              <div className="w-2 h-2 bg-border-strong" />
            </div>
            <h1 className="text-text-primary font-semibold text-sm truncate">{pageTitle}</h1>
          </div>

          <button
            type="submit"
            form="card-form"
            disabled={saving}
            className="hidden md:inline-flex btn btn-primary text-xs min-h-11 px-3 flex-shrink-0 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Check className="w-3.5 h-3.5" aria-hidden="true" />}
            {saveLabel}
          </button>
        </div>
      </div>

      {saveMsg && (
        <WorkspaceNotice
          message={saveMsg}
          tone="success"
          specLabel="SAVED"
          anchor="bottom"
          className="workspace-notice-host--above-footer"
        />
      )}

      <div className="workspace-canvas container-tool max-w-3xl py-6 md:py-8 pb-28 md:pb-8">
        <HeroStamp
          decorative={false}
          className="mb-6"
          lines={{
            brand: t.collection.landing.badge,
            tagline: pageTitle,
            muted: isEdit ? t.collection.form.basicInfo : t.collection.form.scan.subtitle,
          }}
        />

        <form id="card-form" onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Label scan — add only */}
          {!isEdit && (
            <div className="space-y-3">
              {scanState === 'idle' && (
                <div className="panel flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-l-[3px] border-l-accent-secondary">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Sparkles className="w-4 h-4 text-accent-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-text-primary text-sm font-medium">{t.collection.form.scan.title}</p>
                      <p className="text-text-muted text-xs leading-relaxed mt-0.5">{t.collection.form.scan.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => scanRef.current?.click()}
                    className="btn btn-primary text-xs min-h-11 w-full sm:w-auto px-4 flex-shrink-0"
                  >
                    <ScanLine className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.collection.form.scan.scanButton}
                  </button>
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="panel flex items-center gap-3 px-4 py-3 border-l-[3px] border-l-accent-secondary" aria-live="polite">
                  <Loader2 className="w-4 h-4 text-accent-secondary animate-spin flex-shrink-0" aria-hidden="true" />
                  <p className="text-text-secondary text-sm flex-1 font-mono">{t.collection.form.scan.analysing}</p>
                </div>
              )}

              {scanState === 'done' && (
                <div className="panel flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-l-[3px] border-l-accent-success">
                  <p className="text-accent-success text-sm flex-1">{t.collection.form.scan.doneMsg}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button type="button" onClick={() => { setScanState('idle'); scanRef.current?.click(); }} className="btn btn-secondary text-xs min-h-11 px-3">
                      {t.collection.form.scan.rescan}
                    </button>
                    <button type="button" onClick={() => setScanState('idle')} aria-label={t.common.cancel} className="btn btn-ghost btn-icon">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {scanState === 'error' && (
                <div className="panel flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-l-[3px] border-l-accent-danger" role="alert">
                  <p className="text-accent-danger text-sm flex-1">{scanMsg}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button type="button" onClick={() => { setScanState('idle'); scanRef.current?.click(); }} className="btn btn-secondary text-xs min-h-11 px-3">
                      <Camera className="w-3 h-3" aria-hidden="true" />
                      {t.collection.form.scan.tryAgain}
                    </button>
                    <button type="button" onClick={() => setScanState('idle')} aria-label={t.common.cancel} className="btn btn-ghost btn-icon">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <input ref={scanRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanFile} />
            </div>
          )}

          {errors.length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              className="panel border-l-[3px] border-l-accent-danger p-4 outline-none"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-accent-danger text-xs font-bold mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {t.collection.form.fixFollowing}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((e, i) => <li key={i} className="text-accent-danger/90 text-xs">{e}</li>)}
              </ul>
            </div>
          )}

          <Section title={t.collection.form.basicInfo}>
            <div className="panel p-4 space-y-3">
              <div>
                <label htmlFor="card-name" className={lbl}>{t.collection.form.name} *</label>
                <input
                  ref={nameInputRef}
                  id="card-name"
                  className={inp}
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder={t.collection.form.namePlaceholder}
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="card-year" className={lbl}>{t.collection.form.year} *</label>
                  <input id="card-year" className={inp} type="number" inputMode="numeric" min="1990" max={CURRENT_YEAR + 1} value={form.year} onChange={e => set('year', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="card-set" className={lbl}>{t.collection.form.setName}</label>
                  <input id="card-set" className={inp} value={form.set ?? ''} onChange={e => set('set', e.target.value)} placeholder="e.g. SM8b - Ultra Shiny" spellCheck={false} />
                </div>
                <div>
                  <label htmlFor="card-number" className={lbl}>{t.collection.form.cardNumber}</label>
                  <input id="card-number" className={inp} value={form.number ?? ''} onChange={e => set('number', e.target.value)} placeholder="e.g. 240/150" spellCheck={false} />
                </div>
              </div>
              <div>
                <label htmlFor="card-language" className={lbl}>{t.collection.form.language}</label>
                <select id="card-language" className={inp} style={{ backgroundColor: 'var(--surface-panel)', color: 'var(--text-primary)' }} value={form.language} onChange={e => set('language', e.target.value as Language)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </Section>

          <Section title={t.collection.form.grading}>
            <div className="panel p-4 space-y-3">
              <fieldset>
                <legend className="sr-only">{t.collection.form.grading}</legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COMPANIES.map(co => {
                    const isActive = form.company === co;
                    return (
                      <button
                        key={co}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          set('company', co);
                          if (co === 'PSA' || co === 'TAG') set('isBlackLabel', false);
                        }}
                        style={isActive ? GRADE_CO_STYLES[co] : undefined}
                        className={`min-h-11 py-2 text-sm font-bold border transition-[color,background-color,border-color,box-shadow,filter] active:brightness-95 ${
                          isActive
                            ? 'ring-2 ring-accent-secondary ring-offset-2 ring-offset-surface-panel shadow-[0_2px_0_rgba(15,20,25,0.12)]'
                            : 'bg-surface-panel border-border-default text-text-muted hover:text-text-primary hover:border-border-strong hover:bg-surface-raised active:bg-surface-raised active:text-text-primary'
                        }`}
                      >
                        {co}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {(form.company === 'BGS' || form.company === 'CGC') && (
                <Toggle
                  value={form.isBlackLabel ?? false}
                  onChange={v => set('isBlackLabel', v)}
                  label={t.collection.form.blackLabel}
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="card-grade" className={lbl}>{t.collection.form.grade} *</label>
                  <input id="card-grade" className={`${inp} font-tabular`} type="number" inputMode="decimal" min="1" max="10" step="0.5" value={form.grade} onChange={e => set('grade', e.target.value)} placeholder="10" />
                </div>
                <div>
                  <label htmlFor="card-cert" className={lbl}>{t.collection.form.certNumber}</label>
                  <input id="card-cert" className={`${inp} font-mono`} value={form.certNumber ?? ''} onChange={e => set('certNumber', e.target.value)} placeholder="e.g. 82345678" spellCheck={false} autoComplete="off" />
                </div>
              </div>
            </div>
          </Section>

          <Section title={t.collection.form.pricing}>
            <div className="panel p-4 space-y-3">
              <div>
                <label htmlFor="card-buy-price" className={lbl}>{t.collection.form.buyPriceOptional}</label>
                <div className="flex gap-2">
                  <label htmlFor="card-buy-currency" className="sr-only">{t.collection.form.buyPrice}</label>
                  <select
                    id="card-buy-currency"
                    className={selectCls}
                    style={{ backgroundColor: 'var(--surface-panel)', color: 'var(--text-primary)' }}
                    value={form.buyCurrency}
                    onChange={e => set('buyCurrency', e.target.value as typeof form.buyCurrency)}
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input id="card-buy-price" type="number" inputMode="decimal" min="0" className={`${inp} flex-1 font-tabular`} placeholder="0" value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="card-list-price" className={lbl}>
                  {t.collection.form.listPrice}
                  <span className="text-text-muted font-normal normal-case tracking-normal ml-1.5">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <label htmlFor="card-list-currency" className="sr-only">{t.collection.form.listPrice}</label>
                  <select
                    id="card-list-currency"
                    className={selectCls}
                    style={{ backgroundColor: 'var(--surface-panel)', color: 'var(--text-primary)' }}
                    value={form.listCurrency ?? 'HKD'}
                    onChange={e => set('listCurrency', e.target.value as typeof form.listCurrency)}
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input id="card-list-price" type="number" inputMode="decimal" min="0" className={`${inp} flex-1 font-tabular`} placeholder="0" value={form.listPrice} onChange={e => set('listPrice', e.target.value)} />
                </div>
              </div>
              <Toggle value={form.sold} onChange={v => set('sold', v)} label={t.collection.form.markAsSold} />
            </div>
          </Section>

          <Section
            title={t.collection.form.photosTitle}
            subtitle={t.collection.form.photosSubtitle}
          >
            <div className="panel overflow-hidden">
              <div className="px-4 py-3 border-b border-border-default bg-surface-raised">
                <Toggle
                  id="toggle-card-photos"
                  value={!photosCollapsed}
                  onChange={async v => {
                    if (v && onLoadImages) {
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
                  label={(
                    <span className="inline-flex items-center gap-2">
                      {loadingPhotos ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : (photosCollapsed ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />)}
                      {t.collection.form.photos}
                    </span>
                  )}
                />
              </div>
              {!photosCollapsed && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['frontImage', 'backImage'] as const).map(side => {
                  const label = side === 'frontImage' ? t.collection.form.front : t.collection.form.back;
                  const ref = side === 'frontImage' ? frontRef : backRef;
                  const value = form[side];
                  const inputId = side === 'frontImage' ? 'card-photo-front' : 'card-photo-back';
                  return (
                    <div key={side} className="flex flex-col gap-2">
                      <p className={lbl} id={`${inputId}-label`}>{label}</p>
                      {value ? (
                        <div className="relative overflow-hidden border border-border-default aspect-[3/4] bg-surface-raised group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={value} alt={label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-accent-structural/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => setPhotoZoom(value)} aria-label="Zoom" className="btn btn-secondary btn-icon min-w-11 min-h-11"><ZoomIn className="w-4 h-4" aria-hidden="true" /></button>
                            <button type="button" onClick={() => ref.current?.click()} aria-label="Replace photo" className="btn btn-secondary btn-icon min-w-11 min-h-11"><Camera className="w-4 h-4" aria-hidden="true" /></button>
                            <button type="button" onClick={() => set(side, undefined)} aria-label="Remove photo" className="btn btn-destructive btn-icon min-w-11 min-h-11"><X className="w-4 h-4" aria-hidden="true" /></button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          aria-labelledby={`${inputId}-label`}
                          className="flex flex-col items-center justify-center gap-2 aspect-[3/4] min-h-[12rem] border-2 border-dashed border-border-default hover:border-border-strong bg-surface-panel hover:bg-surface-raised text-text-muted hover:text-text-primary transition-[color,background-color,border-color] w-full touch-manipulation"
                        >
                          <ImagePlus className="w-6 h-6" aria-hidden="true" />
                          <span className="text-xs font-medium">{t.collection.form.addPrefix} {label}</span>
                        </button>
                      )}
                      <input ref={ref} id={inputId} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handlePhotoChange(e, side)} />
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </Section>

          {portfolios.length > 0 && (
            <Section title={t.collection.portfolio.title}>
              <div className="panel p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {portfolios.map(p => {
                  const selected = selectedPortfolioIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => togglePortfolio(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 border text-sm font-medium transition-[color,background-color,border-color] text-left min-h-11 touch-manipulation ${
                        selected
                          ? 'bg-surface-raised border-accent-primary text-text-primary border-l-[3px]'
                          : 'bg-surface-panel border-border-default text-text-muted hover:text-text-primary hover:border-border-strong'
                      }`}
                    >
                      <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-accent-primary' : 'text-text-muted'}`} aria-hidden="true" />
                      <span className="truncate">{p.name}</span>
                      {selected && <Check className="w-3 h-3 text-accent-primary ml-auto flex-shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Desktop footer actions */}
          <div className="hidden md:flex items-center justify-end gap-3 pt-2 border-t border-border-default">
            <button type="button" onClick={onBack} className="btn btn-secondary min-h-11">
              {t.common.cancel}
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary min-h-11 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
              {saveLabel}
            </button>
          </div>
        </form>
      </div>

      {/* Mobile sticky action bar */}
      <div className="workspace-chrome md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border-default pb-[env(safe-area-inset-bottom)]">
        <div className="container-tool max-w-3xl flex gap-2 p-3">
          <button type="button" onClick={onBack} className="btn btn-secondary flex-1 min-h-11">
            {t.common.cancel}
          </button>
          <button type="submit" form="card-form" disabled={saving} className="btn btn-primary flex-[1.4] min-h-11 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
            {saveLabel}
          </button>
        </div>
      </div>

      {/* Photo lightbox */}
      {photoZoom && (
        <div className="workspace-lightbox fixed inset-0 flex items-center justify-center p-4 overscroll-contain" role="dialog" aria-modal="true" aria-label="Card photo preview">
          <button
            type="button"
            className="absolute inset-0 bg-accent-structural/90"
            aria-label={t.common.cancel}
            onClick={() => setPhotoZoom(null)}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoZoom} alt="" className="relative z-[61] max-w-full max-h-full object-contain border border-border-strong" />
          <button type="button" onClick={() => setPhotoZoom(null)} aria-label={t.common.cancel} className="absolute top-4 right-4 z-[61] btn btn-secondary btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
