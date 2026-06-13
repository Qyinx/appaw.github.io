'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { User } from '@auth0/auth0-react';
import {
  Plus, Pencil, Trash2, X, Loader2, LogOut,
  List, Package, Search, AlertCircle,
  Check, RefreshCw, LayoutGrid, Folder, FolderOpen,
  FolderPlus, Globe, ChevronRight, Link2,
} from 'lucide-react';
import HeroStamp from '@/components/ui/HeroStamp';
import { localizedHref } from '@/lib/i18n-routing';
import { WorkspaceNotice } from './WorkspaceNotice';
import type { CollectorCard, Portfolio, Currency } from '../types';
import { GradePill, MemberBadge, type MemberLevel } from './shared';
import { sumBuyPriceInPreferred } from '@/lib/collection/currency';
import {
  CardMetaBlock,
  CardPriceBlock,
  CardStatusBadge,
  CardThumbnail,
  gradeTierClass,
} from './CollectionCardDisplay';

interface CollectionListViewProps {
  cards: CollectorCard[];
  loading: boolean;
  apiError: string | null;
  saveMsg: string;
  user: User | undefined;
  userName: string;
  memberLevel?: MemberLevel;
  preferredCurrency: Currency;
  portfolios: Portfolio[];
  onOpenNew: () => void;
  onOpenEdit: (card: CollectorCard) => void;
  onRefresh: () => void;
  onDeleteCard: (id: string) => Promise<void>;
  onToggleSold: (card: CollectorCard) => Promise<void>;
  onLogout: () => void;
  onCreatePortfolio: (name: string, isPublic: boolean) => Promise<void>;
  onUpdatePortfolio: (id: string, name: string, isPublic: boolean) => Promise<void>;
  onDeletePortfolio: (id: string) => Promise<void>;
  onAddCardToPortfolio: (portfolioId: string, cardId: string) => Promise<void>;
  onRemoveCardFromPortfolio: (portfolioId: string, cardId: string) => Promise<void>;
  onLoadPortfolioCards: (portfolioId: string) => Promise<void>;
}

const navActive =
  'border-l-[3px] border-accent-primary bg-surface-raised text-text-primary font-semibold';
const navIdle =
  'border-l-[3px] border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised font-medium';

export function CollectionListView({
  cards, loading, apiError, saveMsg,
  user, userName, memberLevel,
  preferredCurrency,
  portfolios,
  onOpenNew, onOpenEdit, onRefresh,
  onDeleteCard, onToggleSold, onLogout,
  onCreatePortfolio, onUpdatePortfolio, onDeletePortfolio,
  onAddCardToPortfolio, onRemoveCardFromPortfolio,
  onLoadPortfolioCards,
}: CollectionListViewProps) {

  /* ── Card list state ─────────────────────────────────────────────────────── */
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [filterSold, setFilterSold] = useState<'all' | 'active' | 'sold'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Portfolio state ─────────────────────────────────────────────────────── */
  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [creatingPortfolio, setCreatingPortfolio] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioPublic, setNewPortfolioPublic] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPublic, setEditingPublic] = useState(false);
  const [portfolioActionLoading, setPortfolioActionLoading] = useState(false);
  const [addingCardKey, setAddingCardKey] = useState<string | null>(null);
  const [removingCardId, setRemovingCardId] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const planMenuRef = useRef<HTMLDivElement | null>(null);
  const accountBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!showPlan) return;

    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (planMenuRef.current?.contains(t)) return;
      if (accountBtnRef.current?.contains(t)) return;
      setShowPlan(false);
    }

    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowPlan(false);
    }

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [showPlan]);

  /* ── Derived ─────────────────────────────────────────────────────────────── */
  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) ?? null;
  const baseCards = activePortfolio ? cards.filter(c => activePortfolio.cardIds.includes(c.id)) : cards;
  const filtered = baseCards.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q)
      || (c.set ?? '').toLowerCase().includes(q) || (c.certNumber ?? '').includes(q);
    const matchSold = filterSold === 'all' ? true : filterSold === 'sold' ? c.sold : !c.sold;
    return matchSearch && matchSold;
  });
  const available = baseCards.filter(c => !c.sold).length;
  const soldCount = baseCards.filter(c => c.sold).length;
  const { total: totalBuy, partial: buyTotalPartial } = sumBuyPriceInPreferred(baseCards);
  const pickerCards = activePortfolio ? cards.filter(c => !activePortfolio.cardIds.includes(c.id)) : [];
  const cardPortfolios = (cardId: string) => portfolios.filter(p => p.cardIds.includes(cardId));

  function getLimits(level?: MemberLevel) {
    if (level === 'Foil') return { cards: 200, portfolios: 5 };
    if (level === 'Prism') return { cards: 1000, portfolios: 20 };
    if (level === 'Aurora') return { cards: 5000, portfolios: 100 };
    return { cards: 50, portfolios: 2 };
  }

  const limits = getLimits(memberLevel);
  const storedCount = cards.length;
  const portfoliosCount = portfolios.length;
  const storedPct = Math.min(100, Math.round((storedCount / Math.max(1, limits.cards)) * 100));
  const portfoliosPct = Math.min(100, Math.round((portfoliosCount / Math.max(1, limits.portfolios)) * 100));
  const { t, language } = useLanguage();

  const workspaceMuted = activePortfolio?.name ?? '';

  const buyTotalLabel = t.collection.stats.buyTotal.replace('{currency}', preferredCurrency);
  const buyTotalValue = totalBuy == null
    ? '—'
    : buyTotalPartial
      ? `${totalBuy.toLocaleString()}*`
      : totalBuy.toLocaleString();

  const statRows = [
    { label: t.collection.stats.total, value: String(baseCards.length), tone: 'text-text-primary' },
    { label: t.collection.stats.active, value: String(available), tone: 'text-accent-success' },
    { label: t.collection.stats.sold, value: String(soldCount), tone: 'text-accent-danger' },
    { label: buyTotalLabel, value: buyTotalValue, tone: 'text-accent-secondary font-tabular' },
  ];

  /* ── Card handlers ───────────────────────────────────────────────────────── */
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    await onDeleteCard(deleteId);
    setDeleting(false);
    setDeleteId(null);
  }, [deleteId, onDeleteCard]);

  const handleRemoveCard = useCallback(async (cardId: string) => {
    if (!activePortfolioId) return;
    setRemovingCardId(cardId);
    try { await onRemoveCardFromPortfolio(activePortfolioId, cardId); }
    finally { setRemovingCardId(null); }
  }, [activePortfolioId, onRemoveCardFromPortfolio]);

  const handleAddCard = useCallback(async (portfolioId: string, cardId: string) => {
    const key = portfolioId + cardId;
    setAddingCardKey(key);
    try { await onAddCardToPortfolio(portfolioId, cardId); }
    finally { setAddingCardKey(null); }
  }, [onAddCardToPortfolio]);

  /* ── Portfolio handlers ──────────────────────────────────────────────────── */
  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    setPortfolioActionLoading(true);
    try {
      await onCreatePortfolio(newPortfolioName.trim(), newPortfolioPublic);
      setNewPortfolioName(''); setNewPortfolioPublic(false); setCreatingPortfolio(false);
    } finally { setPortfolioActionLoading(false); }
  };

  const handleUpdatePortfolio = async () => {
    if (!editingPortfolioId || !editingName.trim()) return;
    setPortfolioActionLoading(true);
    try {
      await onUpdatePortfolio(editingPortfolioId, editingName.trim(), editingPublic);
      setEditingPortfolioId(null);
    } finally { setPortfolioActionLoading(false); }
  };

  const handleDeletePortfolio = async (id: string) => {
    setPortfolioActionLoading(true);
    try {
      await onDeletePortfolio(id);
      if (activePortfolioId === id) setActivePortfolioId(null);
    } finally { setPortfolioActionLoading(false); }
  };

  const selectPortfolio = (id: string | null) => {
    setActivePortfolioId(id); setShowAddPicker(false); setSearch(''); setDeleteId(null); setLinkCopied(false);
    if (id) {
      const p = portfolios.find(pf => pf.id === id);
      if (p && p.cardIds.length === 0 && p.count > 0) {
        onLoadPortfolioCards(id);
      }
    }
  };

  const handleCopyShareLink = useCallback(async () => {
    if (!activePortfolio) return;
    const url = `${window.location.origin}${localizedHref(`/collection/p/${activePortfolio.id}`, language)}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [activePortfolio, language]);

  /* ── Sidebar portfolio item ──────────────────────────────────────────────── */
  const SidebarPortfolioItem = ({ p }: { p: Portfolio }) => {
    const isActive = activePortfolioId === p.id;
    const isEditing = editingPortfolioId === p.id;
    if (isEditing) {
      return (
        <div className="px-3 py-2.5 panel-raised mb-1 border-l-[3px] border-accent-secondary">
          <input
            autoFocus
            value={editingName}
            onChange={e => setEditingName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUpdatePortfolio(); if (e.key === 'Escape') setEditingPortfolioId(null); }}
            className="w-full bg-transparent text-text-primary text-xs font-medium mb-2 placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-1 rounded-sm"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-text-muted text-xs cursor-pointer select-none">
              <input type="checkbox" checked={editingPublic} onChange={e => setEditingPublic(e.target.checked)} className="w-3 h-3 accent-accent-secondary" />
              {t.collection.portfolio.public}
            </label>
            <div className="flex items-center gap-1">
              <button type="button" onClick={handleUpdatePortfolio} disabled={portfolioActionLoading} aria-label={t.collection.actions.confirm} className="p-1 border border-border-default bg-accent-secondary text-surface-bg hover:brightness-110 transition-[background-color,opacity] disabled:opacity-40">
                {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
              </button>
              <button type="button" onClick={() => setEditingPortfolioId(null)} aria-label={t.common.cancel} className="p-1 border border-border-default bg-surface-raised text-text-muted hover:text-text-primary transition-colors"><X className="w-2.5 h-2.5" /></button>
            </div>
          </div>
          {editingPublic && (
            <p className="text-text-muted text-[10px] mt-2 leading-snug">{t.collection.portfolio.publicShareHint}</p>
          )}
        </div>
      );
    }
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPortfolio(p.id); } }}
        className={`group flex items-center gap-2 px-3 py-2 cursor-pointer transition-[color,background-color,border-color] duration-150 mb-px ${isActive ? navActive : navIdle}`}
        onClick={() => selectPortfolio(p.id)}
      >
        {isActive ? <FolderOpen className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" aria-hidden="true" /> : <Folder className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" aria-hidden="true" />}
        <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
        {p.isPublic && <Globe className="w-3 h-3 text-text-muted flex-shrink-0" aria-hidden="true" />}
        <span className={`text-xs font-tabular flex-shrink-0 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}>{p.count}</span>
        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
          <button type="button" onClick={e => { e.stopPropagation(); setEditingPortfolioId(p.id); setEditingName(p.name); setEditingPublic(p.isPublic); }} className="p-1 border border-transparent hover:border-border-default hover:bg-surface-panel text-text-muted hover:text-text-primary transition-[color,background-color,border-color]" title={t.collection.account.rename} aria-label={t.collection.account.rename}><Pencil className="w-2.5 h-2.5" /></button>
          <button type="button" onClick={e => { e.stopPropagation(); handleDeletePortfolio(p.id); }} className="p-1 border border-transparent hover:border-accent-danger/30 hover:bg-accent-danger/10 text-text-muted hover:text-accent-danger transition-[color,background-color,border-color]" title={t.collection.account.delete} aria-label={t.collection.account.delete}><Trash2 className="w-2.5 h-2.5" /></button>
        </div>
      </div>
    );
  };

  /* ── Inline card actions ─────────────────────────────────────────────────── */
  const CardActions = ({ card, compact = false }: { card: CollectorCard; compact?: boolean }) => {
    const isDeleting = deleteId === card.id;
    const isRemoving = removingCardId === card.id;
    if (isDeleting && !activePortfolio) {
      return (
        <div className="collection-card-actions">
          <button type="button" onClick={handleDelete} disabled={deleting} aria-label={t.collection.actions.confirm} className="collection-card-actions__btn collection-card-actions__btn--danger disabled:opacity-40">
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={() => setDeleteId(null)} aria-label={t.common.cancel} className="collection-card-actions__btn"><X className="w-3.5 h-3.5" /></button>
        </div>
      );
    }
    return (
      <div className="collection-card-actions">
        <button type="button" onClick={() => onOpenEdit(card)} className="collection-card-actions__btn" title={t.collection.account.edit} aria-label={t.collection.account.edit}>
          <Pencil className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </button>
        {activePortfolio ? (
          <button type="button" onClick={() => handleRemoveCard(card.id)} disabled={isRemoving} className="collection-card-actions__btn--remove disabled:opacity-40" title={t.collection.toolbar.remove} aria-label={t.collection.toolbar.remove}>
            {isRemoving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3" aria-hidden="true" />{!compact && t.collection.toolbar.remove}</>}
          </button>
        ) : (
          <button type="button" onClick={() => setDeleteId(card.id)} className="collection-card-actions__btn collection-card-actions__btn--danger" title={t.collection.account.delete} aria-label={t.collection.account.delete}>
            <Trash2 className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </button>
        )}
      </div>
    );
  };

  const DeleteConfirmRow = ({ className = '' }: { className?: string }) => (
    <div className={`collection-ledger__confirm ${className}`}>
      <p className="text-accent-danger text-xs flex-1">{t.collection.actions.confirmDeleteCard}</p>
      <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-destructive text-xs min-h-0 px-3 py-1 disabled:opacity-40">{deleting ? '…' : t.collection.actions.confirm}</button>
      <button type="button" onClick={() => setDeleteId(null)} className="btn btn-secondary text-xs min-h-0 px-3 py-1">{t.common.cancel}</button>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip overflow-y-visible">

      {/* ── Workspace chrome bar ─────────────────────────────────────────────── */}
      <div className="workspace-chrome sticky top-16 md:top-20 z-30 border-b border-border-default shadow-[0_1px_0_var(--border-default)] overflow-visible">
        <div className="container-tool flex flex-row items-center justify-between gap-2 py-2 collection-topbar-inner min-h-[2.75rem] overflow-visible">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
              <div className="w-2 h-2 bg-accent-primary" />
              <div className="w-2 h-2 bg-border-strong" />
              <div className="w-2 h-2 bg-border-strong" />
            </div>
            <h1 className="text-text-primary font-semibold text-xs sm:text-sm flex items-center gap-1 min-w-0">
              {activePortfolio ? (
                <>
                  <button type="button" onClick={() => selectPortfolio(null)} className="text-text-muted font-normal hover:text-text-primary transition-colors whitespace-nowrap">{t.collection.title}</button>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{activePortfolio.name}</span>
                </>
              ) : t.collection.title}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button type="button" onClick={onRefresh} disabled={loading} className="btn btn-ghost btn-icon" title={t.collection.account.refresh} aria-label={t.collection.account.refresh}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={onOpenNew} className="btn btn-primary text-xs min-h-11 px-3">
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="max-w-[6.5rem] truncate">{t.collection.toolbar.addCard}</span>
            </button>

            <div className="relative z-40">
              <button
                ref={accountBtnRef}
                type="button"
                onClick={() => setShowPlan(v => !v)}
                className={`flex items-center gap-2 border pl-1 pr-2.5 py-1 min-h-11 bg-surface-panel hover:bg-surface-raised transition-[background-color,border-color] ${showPlan ? 'border-accent-secondary' : 'border-border-strong'}`}
                aria-expanded={showPlan}
                aria-haspopup="true"
                aria-label={user?.email ?? userName}
              >
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt="" className="w-6 h-6 object-cover flex-shrink-0 border border-border-default" />
                ) : (
                  <div className="w-6 h-6 border border-border-default bg-accent-primary/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-primary text-[10px] font-bold">{userName[0]?.toUpperCase()}</span>
                  </div>
                )}
                {memberLevel && <MemberBadge level={memberLevel} />}
              </button>

              {showPlan && (
                <div
                  ref={planMenuRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={t.collection.dropdown.planFree}
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 max-w-[calc(100vw-1rem)] panel collection-plan-menu p-4 shadow-[0_8px_24px_rgba(15,20,25,0.12)]"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-default">
                    {user?.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.picture} alt="" className="w-10 h-10 object-cover border border-border-default" />
                    ) : (
                      <div className="w-10 h-10 border border-border-default bg-accent-primary/15 flex items-center justify-center">
                        <span className="text-accent-primary font-bold">{userName[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-text-primary text-sm font-semibold truncate">{user?.email ?? userName}</div>
                        {memberLevel && <MemberBadge level={memberLevel} />}
                      </div>
                      <div className="text-text-muted text-xs mt-0.5 font-mono">{memberLevel ? memberLevel : t.collection.dropdown.planFree}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="spec-row px-0 !py-2">
                      <span className="spec-row__label">{t.collection.dropdown.stored}</span>
                      <span className="spec-row__value font-tabular">{storedCount}/{limits.cards}</span>
                    </div>
                    <div className="w-full bg-surface-raised h-1 border border-border-default mb-3" role="progressbar" aria-valuenow={storedPct} aria-valuemin={0} aria-valuemax={100} aria-label={t.collection.dropdown.stored}>
                      <div className={`h-full transition-[width] duration-300 ${storedPct >= 90 ? 'bg-accent-danger' : storedPct >= 70 ? 'bg-accent-warn' : 'bg-accent-secondary'}`} style={{ width: `${storedPct}%` }} />
                    </div>
                    <div className="spec-row px-0 !py-2">
                      <span className="spec-row__label">{t.collection.dropdown.portfolios}</span>
                      <span className="spec-row__value font-tabular">{portfoliosCount}/{limits.portfolios}</span>
                    </div>
                    <div className="w-full bg-surface-raised h-1 border border-border-default" role="progressbar" aria-valuenow={portfoliosPct} aria-valuemin={0} aria-valuemax={100} aria-label={t.collection.dropdown.portfolios}>
                      <div className={`h-full transition-[width] duration-300 ${portfoliosPct >= 90 ? 'bg-accent-danger' : portfoliosPct >= 70 ? 'bg-accent-warn' : 'bg-accent-secondary'}`} style={{ width: `${portfoliosPct}%` }} />
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm mb-3">{t.collection.dropdown.upgradeDesc}</p>
                  <button type="button" onClick={() => { /* TODO: upgrade flow */ }} className="btn btn-primary w-full min-h-11 mb-3">{t.collection.dropdown.upgrade}</button>
                  <button
                    type="button"
                    onClick={() => { setShowPlan(false); onLogout(); }}
                    className="btn btn-secondary w-full min-h-11"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.collection.account.signOut}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="hidden md:inline-flex btn btn-secondary text-xs min-h-11 px-3"
              title={t.collection.account.signOut}
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.collection.account.signOut}</span>
            </button>
          </div>
        </div>
      </div>

      {saveMsg && (
        <WorkspaceNotice
          message={saveMsg}
          tone={saveMsg.toLowerCase().includes('error') || saveMsg.toLowerCase().includes('fail') ? 'error' : 'success'}
          specLabel={saveMsg.toLowerCase().includes('error') || saveMsg.toLowerCase().includes('fail') ? 'ERR' : 'SAVED'}
          anchor="bottom"
        />
      )}

      {/* ── Mobile portfolio tabs ────────────────────────────────────────────── */}
      <div className="workspace-mobile-tabs md:hidden bg-surface-panel border-b border-border-default">
        <div className="collection-portfolio-scroll">
          <div className="collection-portfolio-inner">
            <button
              type="button"
              onClick={() => selectPortfolio(null)}
              className={`collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-[color,background-color,border-color] ${!activePortfolioId ? 'border-accent-primary bg-surface-raised text-text-primary' : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.collection.filters.all}</span>
              <span className={`ml-auto text-[10px] font-tabular ${!activePortfolioId ? 'text-accent-primary' : 'text-text-muted'}`}>{cards.length}</span>
            </button>
            {portfolios.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPortfolio(p.id)}
                className={`collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-[color,background-color,border-color] ${activePortfolioId === p.id ? 'border-accent-primary bg-surface-raised text-text-primary' : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'}`}
              >
                <Folder className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="truncate">{p.name}</span>
                <span className={`ml-auto text-[10px] font-tabular ${activePortfolioId === p.id ? 'text-accent-primary' : 'text-text-muted'}`}>{p.cardIds?.length ?? 0}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCreatingPortfolio(true)}
              className="collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1 px-3 py-1.5 text-xs text-text-muted hover:text-text-primary border border-dashed border-border-default hover:border-border-strong transition-[color,border-color] whitespace-nowrap"
            >
              <FolderPlus className="w-3 h-3" aria-hidden="true" />
              <span>{t.collection.portfolio.new}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────────── */}
      <div className="workspace-canvas container-tool py-6 md:flex md:gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 self-start sticky top-[calc(4rem+3.25rem)] lg:top-[calc(5rem+3.25rem)] panel p-0">
          <div className="px-3 py-2 border-b border-border-default bg-surface-raised">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-muted">{t.collection.portfolio.title}</span>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => selectPortfolio(null)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 transition-[color,background-color,border-color] duration-150 ${!activePortfolioId ? navActive : navIdle}`}
            >
              <LayoutGrid className={`w-3.5 h-3.5 flex-shrink-0 ${!activePortfolioId ? 'text-accent-primary' : 'text-text-muted'}`} aria-hidden="true" />
              <span className="flex-1 text-sm text-left">{t.collection.filters.all}</span>
              <span className={`text-xs font-tabular ${!activePortfolioId ? 'text-accent-primary' : 'text-text-muted'}`}>{cards.length}</span>
            </button>

            {portfolios.map(p => <SidebarPortfolioItem key={p.id} p={p} />)}
          </div>

          <div className="mt-auto border-t border-border-default p-2">
            {creatingPortfolio ? (
              <div className="px-2 py-2 panel-raised border-l-[3px] border-accent-secondary">
                <input
                  autoFocus
                  value={newPortfolioName}
                  onChange={e => setNewPortfolioName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); if (e.key === 'Escape') { setCreatingPortfolio(false); setNewPortfolioName(''); } }}
                  placeholder={t.collection.portfolio.namePlaceholder}
                  className="w-full bg-transparent text-text-primary text-xs font-medium mb-2 placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-1 rounded-sm"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-text-muted text-xs cursor-pointer select-none">
                    <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-3 h-3 accent-accent-secondary" />
                    {t.collection.portfolio.public}
                  </label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="p-1 border border-border-default bg-accent-secondary text-surface-bg hover:brightness-110 transition-[opacity,filter] disabled:opacity-40">
                      {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
                    </button>
                    <button type="button" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="p-1 border border-border-default bg-surface-raised text-text-muted hover:text-text-primary transition-colors"><X className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
                {newPortfolioPublic && (
                  <p className="text-text-muted text-[10px] mt-2 leading-snug px-2">{t.collection.portfolio.publicShareHint}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCreatingPortfolio(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-text-muted hover:text-text-primary hover:bg-surface-raised transition-[color,background-color] text-xs border border-dashed border-border-default hover:border-border-strong"
              >
                <FolderPlus className="w-3.5 h-3.5" aria-hidden="true" />
                {t.collection.portfolio.newPortfolio}
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <HeroStamp
            decorative={false}
            layout="dashboard"
            className="mb-5"
            lines={{
              brand: t.collection.landing.badge,
              tagline: t.collection.title,
              muted: workspaceMuted,
            }}
          >
            <div className="hero-stamp__stats" aria-label={t.collection.stats.sectionTitle}>
              {statRows.map(row => (
                <div key={row.label} className="hero-stamp__stat">
                  <span className="hero-stamp__stat-label">{row.label}</span>
                  <span className={`hero-stamp__stat-value ${row.tone}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </HeroStamp>

          {/* Toolbar */}
          <div className="collection-toolbar">
            <div className="collection-toolbar__head">
              <span className="collection-toolbar__label">{t.collection.stats.sectionTitle}</span>
              <span className="collection-toolbar__count">
                <strong>{filtered.length}</strong> / {baseCards.length}
              </span>
            </div>
            <div className="collection-toolbar__row">
              <div className="collection-toolbar__search">
                <Search className="collection-toolbar__search-icon" aria-hidden="true" />
                <label htmlFor="collection-search" className="sr-only">{t.collection.searchPlaceholder}</label>
                <input
                  id="collection-search"
                  className="collection-toolbar__input"
                  placeholder={t.collection.searchPlaceholder}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="collection-filter-pills" role="group" aria-label={t.collection.filters.all}>
                {([
                  ['all', t.collection.filters.all],
                  ['active', t.collection.filters.active],
                  ['sold', t.collection.filters.sold],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className="collection-filter-pill"
                    aria-pressed={filterSold === value}
                    onClick={() => setFilterSold(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="collection-view-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setDisplayMode('list')}
                  className="collection-view-toggle__btn"
                  title="List view"
                  aria-label="List view"
                  aria-pressed={displayMode === 'list'}
                >
                  <List className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="collection-view-toggle__label">Ledger</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('grid')}
                  className="collection-view-toggle__btn"
                  title="Grid view"
                  aria-label="Grid view"
                  aria-pressed={displayMode === 'grid'}
                >
                  <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="collection-view-toggle__label">Vault</span>
                </button>
              </div>
            </div>
            {activePortfolio && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-default">
                {activePortfolio.isPublic && (
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`btn min-h-11 text-xs ${linkCopied ? 'btn-secondary border-accent-success text-accent-success' : 'btn-secondary'}`}
                    title={t.collection.portfolio.shareLink}
                  >
                    <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {linkCopied ? t.collection.portfolio.linkCopied : t.collection.portfolio.shareLink}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAddPicker(v => !v)}
                  className={`btn min-h-11 text-xs ${showAddPicker ? 'btn-secondary border-accent-secondary text-accent-secondary' : 'btn-secondary'}`}
                >
                  <FolderPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  {showAddPicker ? t.collection.toolbar.close : t.collection.toolbar.addCards}
                </button>
              </div>
            )}
          </div>

          {/* Add Cards Picker */}
          {activePortfolio && showAddPicker && (
            <div className="mb-4 panel overflow-hidden border-l-[3px] border-l-accent-secondary">
              <div className="px-4 py-3 border-b border-border-default bg-surface-raised flex items-center justify-between">
                <p className="text-accent-secondary text-xs font-semibold font-mono uppercase tracking-wider">{t.collection.portfolio.addTo.replace('{name}', activePortfolio.name)}</p>
                <span className="text-text-muted text-xs font-tabular">{t.collection.portfolio.available.replace('{n}', String(pickerCards.length))}</span>
              </div>
              {pickerCards.length === 0 ? (
                <p className="text-text-muted text-xs text-center py-6">{t.collection.empty.addCardsUsingButton}</p>
              ) : (
                <div className="divide-y divide-border-default max-h-52 overflow-y-auto overscroll-contain">
                  {pickerCards.map(card => (
                    <div key={card.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-raised transition-[background-color]">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-xs font-medium truncate">{card.name}</p>
                        <p className="text-text-muted text-xs font-mono">{[card.year, card.set].filter(Boolean).join(' · ')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddCard(activePortfolio.id, card.id)}
                        disabled={addingCardKey === activePortfolio.id + card.id}
                        className="btn btn-secondary text-[10px] px-2.5 py-1 min-h-0 disabled:opacity-40 flex-shrink-0"
                      >
                        {addingCardKey === activePortfolio.id + card.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Plus className="w-3 h-3" aria-hidden="true" />Add</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 panel border-l-[3px] border-l-accent-danger px-4 py-3" role="alert">
              <AlertCircle className="w-4 h-4 text-accent-danger flex-shrink-0" aria-hidden="true" />
              <p className="text-accent-danger text-sm">{apiError}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-text-muted" aria-live="polite">
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span className="text-sm font-mono">{t.common.loading}</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center panel">
              <div className="w-14 h-14 border border-border-strong flex items-center justify-center mb-4 bg-surface-raised">
                {activePortfolio ? <Folder className="w-6 h-6 text-text-muted" aria-hidden="true" /> : <Package className="w-6 h-6 text-text-muted" aria-hidden="true" />}
              </div>
              <p className="text-text-secondary text-sm mb-1">{search ? t.collection.empty.noCardsFound : activePortfolio ? t.collection.empty.portfolioEmpty.replace('{name}', activePortfolio.name) : t.collection.empty.noCardsYet}</p>
              <p className="text-text-muted text-xs mb-6">{search ? t.collection.empty.tryDifferentSearch : activePortfolio ? t.collection.empty.addCardsUsingButton : t.collection.empty.addYourFirstCard}</p>
              {!search && !activePortfolio && (
                <button type="button" onClick={onOpenNew} className="btn btn-primary">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  {t.collection.toolbar.addFirstCard}
                </button>
              )}
              {!search && activePortfolio && (
                <button type="button" onClick={() => setShowAddPicker(true)} className="btn btn-secondary">
                  <FolderPlus className="w-4 h-4" aria-hidden="true" />
                  {t.collection.toolbar.pickCardsToAdd}
                </button>
              )}
            </div>
          )}

          {/* LIST VIEW — spec ledger */}
          {!loading && filtered.length > 0 && displayMode === 'list' && (
            <div className="collection-ledger">
              <div className={`collection-ledger__header ${activePortfolio ? 'collection-ledger__header--portfolio' : ''}`}>
                <span className="collection-ledger__header-cell" aria-hidden="true" />
                <span className="collection-ledger__header-cell">#</span>
                <span className="collection-ledger__header-cell">{t.collection.table.card}</span>
                <span className="collection-ledger__header-cell">{t.collection.table.grade}</span>
                <span className="collection-ledger__header-cell">{t.collection.table.buyPrice}</span>
                <span className="collection-ledger__header-cell">{t.collection.table.list}</span>
                <span className="collection-ledger__header-cell">{t.collection.table.status}</span>
                <span className="collection-ledger__header-cell">{t.collection.table.actions}</span>
              </div>
              {filtered.map((card, index) => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                const tierClass = gradeTierClass(card.grade);
                const rowConfirm = deleteId === card.id && !activePortfolio;
                return (
                  <div
                    key={card.id}
                    className={`collection-ledger__row ${tierClass} ${activePortfolio ? 'collection-ledger__row--portfolio' : ''} ${rowConfirm ? 'collection-ledger__row--confirm' : ''}`}
                  >
                    <div className="collection-ledger__thumb">
                      <CardThumbnail card={card} size="md" />
                    </div>
                    <span className="collection-ledger__index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="collection-ledger__cell collection-ledger__cell--meta">
                      <CardMetaBlock card={card} memberships={memberships} />
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--grade">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--buy">
                      <CardPriceBlock card={card} showList={false} />
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--list">
                      {card.listPrice != null ? (
                        <span className={`collection-ledger__list-value ${card.sold ? 'collection-price--sold' : ''}`}>
                          <span className="collection-price-buy__currency">{card.listCurrency}</span>
                          {card.listPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className="collection-ledger__list-empty" aria-hidden="true">—</span>
                      )}
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--status">
                      <CardStatusBadge sold={card.sold} onClick={() => onToggleSold(card)} />
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--actions">
                      <CardActions card={card} />
                    </div>
                    <div className="collection-ledger__cell collection-ledger__cell--mobile-extra">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <CardPriceBlock card={card} />
                      <CardStatusBadge sold={card.sold} onClick={() => onToggleSold(card)} />
                    </div>
                    {rowConfirm && <DeleteConfirmRow />}
                  </div>
                );
              })}
            </div>
          )}

          {/* GRID VIEW — slab vault */}
          {!loading && filtered.length > 0 && displayMode === 'grid' && (
            <div className="collection-vault">
              {filtered.map((card, index) => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                const rowConfirm = deleteId === card.id && !activePortfolio;
                return (
                  <article
                    key={card.id}
                    className={`collection-vault-card ${gradeTierClass(card.grade)}`}
                    style={{ '--vault-index': index } as React.CSSProperties}
                  >
                    <div className="collection-vault-card__media">
                      <div className="collection-vault-card__badges">
                        <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                        <CardStatusBadge sold={card.sold} onClick={() => onToggleSold(card)} />
                      </div>
                      <CardThumbnail card={card} size="lg" />
                    </div>
                    <div className="collection-vault-card__body">
                      <CardMetaBlock card={card} memberships={memberships} />
                    </div>
                    <div className="collection-vault-card__specs">
                      <div className="collection-vault-card__spec-row">
                        <span className="collection-vault-card__spec-label">{t.collection.table.buyPrice}</span>
                        <span className={`collection-vault-card__spec-value ${card.sold ? 'collection-vault-card__spec-value--sold' : ''}`}>
                          {card.buyCurrency} {card.buyPrice.toLocaleString()}
                        </span>
                      </div>
                      {card.listPrice != null && (
                        <div className="collection-vault-card__spec-row">
                          <span className="collection-vault-card__spec-label">{t.collection.table.list}</span>
                          <span className="collection-vault-card__spec-value text-text-secondary">
                            {card.listCurrency} {card.listPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="collection-vault-card__actions">
                      <button type="button" onClick={() => onOpenEdit(card)} className="btn btn-secondary flex-1 text-xs min-h-11 py-1.5">
                        <Pencil className="w-3 h-3 shrink-0" aria-hidden="true" /> {t.collection.account.edit}
                      </button>
                      {activePortfolio ? (
                        <button type="button" onClick={() => handleRemoveCard(card.id)} disabled={removingCardId === card.id} className="btn btn-destructive flex-1 text-xs min-h-11 py-1.5 disabled:opacity-40">
                          {removingCardId === card.id ? <Loader2 className="w-3 h-3 shrink-0 animate-spin" /> : <><X className="w-3 h-3 shrink-0" aria-hidden="true" />{t.collection.toolbar.remove}</>}
                        </button>
                      ) : (
                        <button type="button" onClick={() => setDeleteId(card.id)} className="btn btn-secondary flex-1 text-xs min-h-11 py-1.5 hover:border-accent-danger/40 hover:text-accent-danger">
                          <Trash2 className="w-3 h-3 shrink-0" aria-hidden="true" /> {t.collection.account.delete}
                        </button>
                      )}
                    </div>
                    {rowConfirm && (
                      <div className="collection-vault-card__confirm">
                        <DeleteConfirmRow />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile: create portfolio bottom sheet */}
      {creatingPortfolio && (
        <div className="md:hidden fixed inset-0 z-[60] flex items-end pb-[env(safe-area-inset-bottom)] overscroll-contain" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-accent-structural/60"
            aria-label={t.common.cancel}
            onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }}
          />
          <div className="relative z-[61] w-full panel border-b-0 p-6 min-w-0" role="dialog" aria-modal="true" aria-labelledby="new-portfolio-title">
            <h3 id="new-portfolio-title" className="text-text-primary font-bold text-sm mb-4">{t.collection.portfolio.newPortfolio}</h3>
            <label htmlFor="new-portfolio-name" className="sr-only">{t.collection.portfolio.namePlaceholder}</label>
            <input
              id="new-portfolio-name"
              autoFocus
              value={newPortfolioName}
              onChange={e => setNewPortfolioName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); }}
              placeholder={t.collection.portfolio.namePlaceholder}
              className="w-full bg-surface-raised border border-border-default px-4 py-3 min-h-11 text-text-primary text-sm placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg mb-3"
            />
            <label className="flex items-center gap-2 text-text-secondary text-sm cursor-pointer mb-3 select-none">
              <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-4 h-4 accent-accent-secondary" />
              {t.collection.portfolio.makePublic}
            </label>
            {newPortfolioPublic && (
              <p className="text-text-muted text-xs mb-5 leading-snug">{t.collection.portfolio.publicShareHint}</p>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="btn btn-secondary flex-1 min-h-11">{t.common.cancel}</button>
              <button type="button" onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="btn btn-primary flex-1 min-h-11 disabled:opacity-40">
                {portfolioActionLoading ? t.collection.portfolio.creating : t.collection.portfolio.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
