'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { User } from '@auth0/auth0-react';
import {
  Plus, Pencil, Trash2, X, Loader2, LogOut,
  List, Package, Search, AlertCircle,
  Check, RefreshCw, LayoutGrid, Folder, FolderOpen,
  FolderPlus, Globe, ChevronRight, ChevronDown, Settings,
} from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import HeroStamp from '@/components/ui/HeroStamp';
import { WorkspaceNotice } from './WorkspaceNotice';
import type { CollectorCard, Portfolio, Currency } from '../types';
import { GradePill, MemberBadge, type MemberLevel } from './shared';
import { sumBuyPriceInPreferred } from '@/lib/collection/currency';
import { PortfolioShareToolbar } from './PortfolioShareToolbar';
import { CollectionLoadingSkeleton } from './CollectionLoadingSkeleton';
import { CollectionAnimeEnter } from './CollectionAnimeEnter';
import { CollectionAnimeStagger } from './CollectionAnimeStagger';
import { CollectionWorkspaceChrome, CollectionChromeDots } from './CollectionWorkspaceChrome';
import { getMembershipLimits } from '@/lib/collection/membership';
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
  onCreatePortfolio: (name: string, isPublic: boolean) => Promise<string | void>;
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
const portfolioIconBtn =
  'inline-flex items-center justify-center w-7 h-7 border border-border-default transition-[background-color,color,opacity,filter] focus-visible:outline-none focus-visible:border-accent-secondary focus-visible:shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent-secondary)_25%,transparent)]';
const portfolioIconBtnConfirm = `${portfolioIconBtn} bg-accent-primary text-accent-structural hover:brightness-110 disabled:opacity-40`;
const portfolioIconBtnNeutral = `${portfolioIconBtn} bg-surface-raised text-text-muted hover:text-text-primary`;
const portfolioIconBtnDanger = `${portfolioIconBtn} bg-surface-raised text-text-muted hover:border-accent-danger/30 hover:bg-accent-danger/10 hover:text-accent-danger`;

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
  const [newPortfolioForSale, setNewPortfolioForSale] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingForSale, setEditingForSale] = useState(false);
  const [portfolioActionLoading, setPortfolioActionLoading] = useState(false);
  const [addingCardKey, setAddingCardKey] = useState<string | null>(null);
  const [removingCardId, setRemovingCardId] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
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
  const activePortfolioForSale = Boolean(activePortfolio?.isPublic);
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

  const limits = getMembershipLimits(memberLevel);
  const storedCount = cards.length;
  const portfoliosCount = portfolios.length;
  const storedPct = Math.min(100, Math.round((storedCount / Math.max(1, limits.cards)) * 100));
  const portfoliosPct = Math.min(100, Math.round((portfoliosCount / Math.max(1, limits.portfolios)) * 100));
  const { t } = useLanguage();

  const heroTagline = activePortfolio?.name ?? t.collection.title;
  const heroMuted = activePortfolio
    ? [
        t.collection.landing.preview.cardCount.replace('{n}', String(baseCards.length)),
        activePortfolio.isPublic ? t.collection.portfolio.publicForSale : null,
      ].filter(Boolean).join(' · ')
    : `${storedCount}/${limits.cards} ${t.collection.dropdown.stored} · ${portfoliosCount}/${limits.portfolios} ${t.collection.dropdown.portfolios}`;

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

  const handleCreatePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    setPortfolioActionLoading(true);
    try {
      await onCreatePortfolio(newPortfolioName.trim(), newPortfolioForSale);
      setNewPortfolioName('');
      setNewPortfolioForSale(false);
      setCreatingPortfolio(false);
    } finally { setPortfolioActionLoading(false); }
  };

  const handleUpdatePortfolio = async () => {
    if (!editingPortfolioId || !editingName.trim()) return;
    setPortfolioActionLoading(true);
    try {
      await onUpdatePortfolio(editingPortfolioId, editingName.trim(), editingForSale);
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
    setActivePortfolioId(id); setShowAddPicker(false); setSearch(''); setDeleteId(null);
    if (id) {
      const p = portfolios.find(pf => pf.id === id);
      if (p && p.cardIds.length === 0 && p.count > 0) {
        onLoadPortfolioCards(id);
      }
    }
  };

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
          <label className="flex items-center gap-1.5 text-text-muted text-xs cursor-pointer select-none mb-2">
            <input
              type="checkbox"
              checked={editingForSale}
              onChange={e => setEditingForSale(e.target.checked)}
              className="w-3 h-3 accent-accent-secondary"
            />
            {t.collection.portfolio.publicForSale}
          </label>
          {editingForSale && (
            <p className="text-text-muted text-xs leading-snug mb-2">{t.collection.portfolio.publicForSaleHint}</p>
          )}
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={handleUpdatePortfolio} disabled={portfolioActionLoading} aria-label={t.collection.actions.confirm} className={portfolioIconBtnConfirm}>
              {portfolioActionLoading ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <Check className="w-3 h-3" aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => setEditingPortfolioId(null)} aria-label={t.common.cancel} className={portfolioIconBtnNeutral}><X className="w-3 h-3" aria-hidden="true" /></button>
          </div>
        </div>
      );
    }
    return (
      <div className={`group flex items-stretch mb-px ${isActive ? 'bg-surface-raised' : ''}`}>
        <button
          type="button"
          onClick={() => selectPortfolio(p.id)}
          className={`flex-1 min-w-0 flex items-center gap-2 px-3 py-2 transition-[color,background-color,border-color] duration-150 text-left ${isActive ? navActive : navIdle}`}
        >
          {isActive ? <FolderOpen className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" aria-hidden="true" /> : <Folder className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" aria-hidden="true" />}
          <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
          {p.isPublic && <Globe className="w-3 h-3 text-accent-secondary flex-shrink-0" aria-hidden="true" />}
          <span className={`text-xs font-tabular flex-shrink-0 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}>{p.count}</span>
        </button>
        <div className="hidden group-hover:flex items-center gap-0.5 pr-1 flex-shrink-0">
          <button type="button" onClick={() => { setEditingPortfolioId(p.id); setEditingName(p.name); setEditingForSale(p.isPublic); }} className={portfolioIconBtnNeutral} title={t.collection.account.rename} aria-label={t.collection.account.rename}><Pencil className="w-3 h-3" aria-hidden="true" /></button>
          <button type="button" onClick={() => handleDeletePortfolio(p.id)} className={portfolioIconBtnDanger} title={t.collection.account.delete} aria-label={t.collection.account.delete}><Trash2 className="w-3 h-3" aria-hidden="true" /></button>
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
      <div className="collection-action-pills flex-shrink-0">
        <button type="button" onClick={handleDelete} disabled={deleting} className="collection-action-pill collection-action-pill--primary disabled:opacity-40">{deleting ? '…' : t.collection.actions.confirm}</button>
        <button type="button" onClick={() => setDeleteId(null)} className="collection-action-pill">{t.common.cancel}</button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip overflow-y-visible">

      <CollectionWorkspaceChrome
        layout="sidebar"
        leading={(
          <>
            <CollectionChromeDots />
            <h1 className="text-text-primary font-semibold text-xs sm:text-sm flex items-center gap-1 min-w-0">
              {activePortfolio ? (
                <>
                  <button type="button" onClick={() => selectPortfolio(null)} className="text-text-muted font-normal hover:text-text-primary transition-colors whitespace-nowrap">{t.collection.title}</button>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{activePortfolio.name}</span>
                </>
              ) : t.collection.title}
            </h1>
          </>
        )}
        trailing={(
          <>
            <button type="button" onClick={onRefresh} disabled={loading} className="collection-action-pill btn-icon" title={t.collection.account.refresh} aria-label={t.collection.account.refresh}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative z-40">
              <button
                ref={accountBtnRef}
                type="button"
                onClick={() => setShowPlan(v => !v)}
                className={`collection-action-pill collection-account-trigger min-h-11 ${showPlan ? 'collection-action-pill--active' : ''}`}
                aria-expanded={showPlan}
                aria-haspopup="true"
                aria-label={user?.email ?? userName}
              >
                <span className="collection-account-trigger__avatar" aria-hidden="true">
                  {user?.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.picture} alt="" />
                  ) : (
                    <span className="collection-account-trigger__initial">{userName[0]?.toUpperCase()}</span>
                  )}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted flex-shrink-0 transition-transform duration-150 ${showPlan ? 'rotate-180' : ''}`} aria-hidden="true" />
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
                  <button type="button" onClick={() => { /* TODO: upgrade flow */ }} className="collection-action-pill collection-action-pill--primary collection-action-pill--block w-full mb-3">{t.collection.dropdown.upgrade}</button>
                  <LocalLink
                    href="/collection/settings/"
                    onClick={() => setShowPlan(false)}
                    className="collection-action-pill collection-action-pill--block w-full mb-3"
                  >
                    <Settings className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {t.collection.account.settings}
                  </LocalLink>
                  <button
                    type="button"
                    onClick={() => { setShowPlan(false); onLogout(); }}
                    className="collection-action-pill collection-action-pill--block w-full"
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
              className="hidden md:inline-flex collection-action-pill"
              title={t.collection.account.signOut}
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.collection.account.signOut}</span>
            </button>
          </>
        )}
      />

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
            <div className="collection-filter-pills collection-filter-pills--scroll" role="tablist" aria-label={t.collection.portfolio.title}>
              <button
                type="button"
                role="tab"
                aria-selected={!activePortfolioId}
                onClick={() => selectPortfolio(null)}
                className="collection-filter-pill"
                aria-pressed={!activePortfolioId}
              >
                <LayoutGrid className="w-3.5 h-3.5 inline-block mr-1 align-[-2px]" aria-hidden="true" />
                {t.collection.filters.all}
                <span className={`ml-1 font-tabular ${!activePortfolioId ? '' : 'opacity-70'}`}>{cards.length}</span>
              </button>
              {portfolios.map(p => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={activePortfolioId === p.id}
                  onClick={() => selectPortfolio(p.id)}
                  className="collection-filter-pill"
                  aria-pressed={activePortfolioId === p.id}
                >
                  <Folder className="w-3.5 h-3.5 inline-block mr-1 align-[-2px]" aria-hidden="true" />
                  <span className="truncate max-w-[5.5rem]">{p.name}</span>
                  <span className={`ml-1 font-tabular ${activePortfolioId === p.id ? '' : 'opacity-70'}`}>{p.cardIds?.length ?? 0}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCreatingPortfolio(true)}
                className="collection-filter-pill collection-filter-pill--dashed"
              >
                <FolderPlus className="w-3 h-3 inline-block mr-1 align-[-2px]" aria-hidden="true" />
                {t.collection.portfolio.new}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────────── */}
      <div className="workspace-canvas container-tool py-6 md:flex md:gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 flex-shrink-0 self-start sticky top-[calc(4rem+3.25rem)] lg:top-[calc(5rem+3.25rem)] panel p-0">
          <div className="px-3 py-2 border-b border-border-default bg-surface-raised">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-text-muted">{t.collection.portfolio.title}</span>
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
                  onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); if (e.key === 'Escape') { setCreatingPortfolio(false); setNewPortfolioName(''); setNewPortfolioForSale(false); } }}
                  placeholder={t.collection.portfolio.namePlaceholder}
                  className="w-full bg-transparent text-text-primary text-xs font-medium mb-2 placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-1 rounded-sm"
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-text-muted text-xs cursor-pointer select-none min-w-0">
                    <input type="checkbox" checked={newPortfolioForSale} onChange={e => setNewPortfolioForSale(e.target.checked)} className="w-3 h-3 accent-accent-secondary flex-shrink-0" />
                    <span className="truncate">{t.collection.portfolio.publicForSale}</span>
                  </label>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button type="button" onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} aria-label={t.collection.actions.confirm} className={portfolioIconBtnConfirm}>
                      {portfolioActionLoading ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <Check className="w-3 h-3" aria-hidden="true" />}
                    </button>
                    <button type="button" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); setNewPortfolioForSale(false); }} aria-label={t.common.cancel} className={portfolioIconBtnNeutral}><X className="w-3 h-3" aria-hidden="true" /></button>
                  </div>
                </div>
                {newPortfolioForSale && (
                  <p className="text-text-muted text-xs mt-2 leading-snug">{t.collection.portfolio.publicForSaleHint}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCreatingPortfolio(true)}
                className="collection-action-pill w-full justify-center border-dashed"
              >
                <FolderPlus className="w-3.5 h-3.5" aria-hidden="true" />
                {t.collection.portfolio.newPortfolio}
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <CollectionAnimeEnter className="mb-5">
            <HeroStamp
              decorative={false}
              layout="dashboard"
              className="collection-hero"
              titleAddon={memberLevel ? <MemberBadge level={memberLevel} /> : undefined}
              lines={{
                brand: t.collection.landing.badge,
                tagline: heroTagline,
                muted: heroMuted,
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
          </CollectionAnimeEnter>

          <CollectionAnimeEnter delay={40}>
          {/* Toolbar */}
          <div className="collection-toolbar">
            <div className="collection-toolbar__head">
              <span className="collection-toolbar__label">{t.collection.stats.sectionTitle}</span>
              <div className="collection-toolbar__actions">
                <span className="collection-toolbar__count">
                  <strong>{filtered.length}</strong> / {baseCards.length}
                </span>
                <button
                  type="button"
                  onClick={onOpenNew}
                  className="collection-action-pill collection-action-pill--primary"
                  aria-label={t.collection.toolbar.addCard}
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.collection.toolbar.addCard}</span>
                </button>
                {activePortfolio && (
                  <button
                    type="button"
                    onClick={() => setShowAddPicker(v => !v)}
                    className={`collection-action-pill ${showAddPicker ? 'collection-action-pill--active' : ''}`}
                    aria-pressed={showAddPicker}
                    aria-label={showAddPicker ? t.collection.toolbar.close : t.collection.toolbar.addCards}
                  >
                    <FolderPlus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">{showAddPicker ? t.collection.toolbar.close : t.collection.toolbar.addCards}</span>
                  </button>
                )}
              </div>
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
              <PortfolioShareToolbar
                portfolioId={activePortfolio.id}
                portfolioName={activePortfolio.name}
                isPublicForSale={activePortfolioForSale}
                cards={baseCards}
                memberLevel={memberLevel}
                ownerName={userName}
              />
            )}
          </div>
          </CollectionAnimeEnter>

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
                        className="collection-action-pill disabled:opacity-40 flex-shrink-0"
                        aria-label={t.collection.toolbar.addCards}
                      >
                        {addingCardKey === activePortfolio.id + card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" aria-hidden="true" />Add</>}
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
            <CollectionLoadingSkeleton
              variant={displayMode === 'grid' ? 'vault' : 'ledger'}
              rows={displayMode === 'grid' ? 8 : 7}
              label={t.common.loading}
            />
          )}

          {/* Portfolio panel — re-enter on portfolio switch */}
          {!loading && (
            <CollectionAnimeEnter
              enterKey={activePortfolioId ?? 'all'}
              className="collection-portfolio-panel"
            >
          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center panel">
              <div className="w-14 h-14 border border-border-strong flex items-center justify-center mb-4 bg-surface-raised">
                {activePortfolio ? <Folder className="w-6 h-6 text-text-muted" aria-hidden="true" /> : <Package className="w-6 h-6 text-text-muted" aria-hidden="true" />}
              </div>
              <p className="text-text-secondary text-sm mb-1">{search ? t.collection.empty.noCardsFound : activePortfolio ? t.collection.empty.portfolioEmpty.replace('{name}', activePortfolio.name) : t.collection.empty.noCardsYet}</p>
              <p className="text-text-muted text-xs mb-6">{search ? t.collection.empty.tryDifferentSearch : activePortfolio ? t.collection.empty.addCardsUsingButton : t.collection.empty.addYourFirstCard}</p>
              {!search && !activePortfolio && (
                <button type="button" onClick={onOpenNew} className="collection-action-pill collection-action-pill--primary">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  {t.collection.toolbar.addFirstCard}
                </button>
              )}
              {!search && activePortfolio && (
                <button type="button" onClick={() => setShowAddPicker(true)} className="collection-action-pill">
                  <FolderPlus className="w-4 h-4" aria-hidden="true" />
                  {t.collection.toolbar.pickCardsToAdd}
                </button>
              )}
            </div>
          )}

          {/* LIST VIEW — spec ledger */}
          {filtered.length > 0 && displayMode === 'list' && (
            <CollectionAnimeStagger
              className="collection-ledger"
              animateKey={`${activePortfolioId ?? 'all'}-${filterSold}-${search}`}
            >
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
                    data-collection-animate
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
                    <div className="collection-ledger__spec-strip">
                      <div className="collection-ledger__spec-field">
                        <span className="collection-ledger__spec-label">{t.collection.table.grade}</span>
                        <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      </div>
                      <div className="collection-ledger__spec-field">
                        <span className="collection-ledger__spec-label">{t.collection.table.buyPrice}</span>
                        <CardPriceBlock card={card} showList={false} />
                      </div>
                      <div className="collection-ledger__spec-field">
                        <span className="collection-ledger__spec-label">{t.collection.table.list}</span>
                        {card.listPrice != null ? (
                          <span className={`collection-ledger__list-value ${card.sold ? 'collection-price--sold' : ''}`}>
                            <span className="collection-price-buy__currency">{card.listCurrency}</span>
                            {card.listPrice.toLocaleString()}
                          </span>
                        ) : (
                          <span className="collection-ledger__list-empty" aria-hidden="true">—</span>
                        )}
                      </div>
                      <div className="collection-ledger__spec-field">
                        <span className="collection-ledger__spec-label">{t.collection.table.status}</span>
                        <CardStatusBadge sold={card.sold} onClick={() => onToggleSold(card)} />
                      </div>
                    </div>
                    {rowConfirm && <DeleteConfirmRow />}
                  </div>
                );
              })}
            </CollectionAnimeStagger>
          )}

          {/* GRID VIEW — slab vault */}
          {filtered.length > 0 && displayMode === 'grid' && (
            <CollectionAnimeStagger
              className="collection-vault"
              animateKey={`${activePortfolioId ?? 'all'}-${filterSold}-${search}`}
            >
              {filtered.map((card) => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                const rowConfirm = deleteId === card.id && !activePortfolio;
                return (
                  <article
                    key={card.id}
                    data-collection-animate
                    className={`collection-vault-card ${gradeTierClass(card.grade)}`}
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
                      <button type="button" onClick={() => onOpenEdit(card)} className="collection-action-pill flex-1 justify-center">
                        <Pencil className="w-3 h-3 shrink-0" aria-hidden="true" /> {t.collection.account.edit}
                      </button>
                      {activePortfolio ? (
                        <button type="button" onClick={() => handleRemoveCard(card.id)} disabled={removingCardId === card.id} className="collection-action-pill flex-1 justify-center disabled:opacity-40 hover:border-accent-danger/40 hover:text-accent-danger">
                          {removingCardId === card.id ? <Loader2 className="w-3 h-3 shrink-0 animate-spin" /> : <><X className="w-3 h-3 shrink-0" aria-hidden="true" />{t.collection.toolbar.remove}</>}
                        </button>
                      ) : (
                        <button type="button" onClick={() => setDeleteId(card.id)} className="collection-action-pill flex-1 justify-center hover:border-accent-danger/40 hover:text-accent-danger">
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
            </CollectionAnimeStagger>
          )}
            </CollectionAnimeEnter>
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
              <input type="checkbox" checked={newPortfolioForSale} onChange={e => setNewPortfolioForSale(e.target.checked)} className="w-4 h-4 accent-accent-secondary" />
              {t.collection.portfolio.publicForSale}
            </label>
            {newPortfolioForSale && (
              <p className="text-text-muted text-xs mb-5 leading-snug">{t.collection.portfolio.publicForSaleHint}</p>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="collection-action-pill flex-1 justify-center">{t.common.cancel}</button>
              <button type="button" onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="collection-action-pill collection-action-pill--primary flex-1 justify-center disabled:opacity-40">
                {portfolioActionLoading ? t.collection.portfolio.creating : t.collection.portfolio.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
