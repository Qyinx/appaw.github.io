'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { User } from '@auth0/auth0-react';
import {
  Plus, Pencil, Trash2, X, Loader2, LogOut,
  List, Package, DollarSign, Search, AlertCircle,
  Check, RefreshCw, LayoutGrid, Folder, FolderOpen,
  FolderPlus, Globe, ChevronRight,
} from 'lucide-react';
import type { CollectorCard, Portfolio } from '../types';
import { GradePill, MemberBadge, type MemberLevel } from './shared';

interface CollectionListViewProps {
  cards: CollectorCard[];
  loading: boolean;
  apiError: string | null;
  saveMsg: string;
  user: User | undefined;
  userName: string;
  memberLevel?: MemberLevel;
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

export function CollectionListView({
  cards, loading, apiError, saveMsg,
  user, userName, memberLevel,
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
  const planMenuRef = useRef<HTMLDivElement | null>(null);
  const accountBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (planMenuRef.current && planMenuRef.current.contains(t)) return;
      if (accountBtnRef.current && accountBtnRef.current.contains(t)) return;
      setShowPlan(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

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
  const totalBuy = baseCards.reduce((s, c) => s + c.buyPrice, 0);
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
  const { t } = useLanguage();

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
    setActivePortfolioId(id); setShowAddPicker(false); setSearch(''); setDeleteId(null);
    // Lazy-load card IDs from detail API if not yet populated
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
        <div className="px-3 py-2.5 bg-surface-raised rounded-xl border border-accent-link/30 mb-1">
              <input autoFocus value={editingName} onChange={e => setEditingName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUpdatePortfolio(); if (e.key === 'Escape') setEditingPortfolioId(null); }}
            className="w-full bg-transparent text-text-primary text-xs font-medium mb-2 placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-1 rounded-sm"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-text-muted text-[10px] cursor-pointer select-none">
              <input type="checkbox" checked={editingPublic} onChange={e => setEditingPublic(e.target.checked)} className="w-3 h-3 rounded accent-accent-link" />
              {t.collection.portfolio.public}
            </label>
            <div className="flex items-center gap-1">
              <button onClick={handleUpdatePortfolio} disabled={portfolioActionLoading} className="p-1 rounded bg-accent-link text-surface-bg hover:bg-accent-link/30 transition-colors disabled:opacity-40">
                {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
              </button>
              <button onClick={() => setEditingPortfolioId(null)} className="p-1 rounded bg-surface-raised text-text-muted hover:text-text-primary transition-colors"><X className="w-2.5 h-2.5" /></button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-[color,background-color,border-color,opacity,transform] duration-150 mb-0.5 ${isActive ? 'bg-accent-link/15 text-text-primary' : 'hover:bg-surface-raised text-text-secondary hover:text-text-primary'}`} onClick={() => selectPortfolio(p.id)}>
        {isActive ? <FolderOpen className="w-3.5 h-3.5 text-accent-link flex-shrink-0" /> : <Folder className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />}
        <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
        {p.isPublic && <Globe className="w-3 h-3 text-text-muted flex-shrink-0" />}
        <span className={`text-xs tabular-nums flex-shrink-0 ${isActive ? 'text-accent-link' : 'text-text-muted'}`}>{p.count}</span>
        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); setEditingPortfolioId(p.id); setEditingName(p.name); setEditingPublic(p.isPublic); }} className="p-1 rounded hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors" title={t.collection.account.rename}><Pencil className="w-2.5 h-2.5" /></button>
          <button onClick={e => { e.stopPropagation(); handleDeletePortfolio(p.id); }} className="p-1 rounded hover:bg-red-500/15 text-text-muted hover:text-red-400 transition-colors" title={t.collection.account.delete}><Trash2 className="w-2.5 h-2.5" /></button>
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
        <div className="flex items-center gap-1">
          <button onClick={handleDelete} disabled={deleting} className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-40">
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setDeleteId(null)} className="p-1.5 rounded bg-surface-raised text-text-muted transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <button onClick={() => onOpenEdit(card)} className="p-1.5 rounded bg-surface-raised hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors" title={t.collection.account.edit}>
          <Pencil className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </button>
        {activePortfolio ? (
          <button onClick={() => handleRemoveCard(card.id)} disabled={isRemoving} className="flex items-center gap-1 px-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors text-[10px] font-medium disabled:opacity-40" title={t.collection.toolbar.remove}>
            {isRemoving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3" />{!compact && t.collection.toolbar.remove}</>}
          </button>
        ) : (
          <button onClick={() => setDeleteId(card.id)} className="p-1.5 rounded bg-surface-raised hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors" title={t.collection.account.delete}>
            <Trash2 className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </button>
        )}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-dvh bg-surface-bg collection-page overflow-x-clip page-blueprint">

      {/* ── Sticky top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-20 bg-surface-bg/95 border-b border-border-default">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 py-2 sm:py-0 collection-topbar-inner">
          <h1 className="sr-sm-visible text-text-primary font-bold text-xs sm:text-sm flex items-center gap-1 min-w-0">
            {activePortfolio ? (
              <>
                <button onClick={() => selectPortfolio(null)} className="text-text-muted font-normal hover:text-text-primary transition-colors whitespace-nowrap">{t.collection.title}</button>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                <span className="truncate">{activePortfolio.name}</span>
              </>
            ) : t.collection.title}
          </h1>
          <div className="flex items-center gap-1 sm:gap-3 sm:flex-shrink-0 w-full sm:w-auto justify-end">
            {saveMsg && <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs"><Check className="w-3.5 h-3.5" />{saveMsg}</span>}
            <button onClick={onRefresh} disabled={loading} className="min-w-11 min-h-11 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40" title={t.collection.account.refresh} aria-label={t.collection.account.refresh}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onOpenNew} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-link text-surface-bg text-xs font-bold hover:bg-accent-link/30 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span className="ml-1 inline-block max-w-[6.5rem] truncate">{t.collection.toolbar.addCard}</span>
            </button>
            <div className="relative">
              <button ref={accountBtnRef} onClick={() => setShowPlan(v => !v)} className="flex items-center gap-2 border border-border-default rounded-full pl-1 pr-2.5 py-1 min-h-11 bg-surface-panel" aria-expanded={showPlan} aria-haspopup="true">
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={userName} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-accent-link/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-link text-[10px] font-bold">{userName[0]?.toUpperCase()}</span>
                  </div>
                )}
                {memberLevel && <MemberBadge level={memberLevel} />}
              </button>

              {showPlan && (
                <div ref={planMenuRef} className="absolute right-0 mt-2 w-80 panel collection-plan-menu z-50">
                  <div className="flex items-center gap-3 mb-3">
                    {user?.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.picture} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent-link/20 flex items-center justify-center">
                        <span className="text-accent-link font-bold">{userName[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-text-primary text-sm font-semibold truncate">{user?.email ?? userName}</div>
                        {memberLevel && <MemberBadge level={memberLevel} />}
                      </div>
                      <div className="text-text-muted text-xs mt-0.5">{memberLevel ? memberLevel : t.collection.dropdown.planFree}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1"> 
                      <span>{t.collection.dropdown.stored}</span>
                      <span className="tabular-nums">{storedCount}/{limits.cards}</span>
                    </div>
                    <div className="w-full bg-surface-raised h-2 rounded overflow-hidden mb-2">
                      <div className={`h-2 ${storedPct >= 90 ? 'bg-red-400' : storedPct >= 70 ? 'bg-amber-400' : 'bg-accent-link'}`} style={{ width: `${storedPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1"> 
                      <span>{t.collection.dropdown.portfolios}</span>
                      <span className="tabular-nums">{portfoliosCount}/{limits.portfolios}</span>
                    </div>
                    <div className="w-full bg-surface-raised h-2 rounded overflow-hidden">
                      <div className={`h-2 ${portfoliosPct >= 90 ? 'bg-red-400' : portfoliosPct >= 70 ? 'bg-amber-400' : 'bg-accent-link'}`} style={{ width: `${portfoliosPct}%` }} />
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-text-secondary text-sm">{t.collection.dropdown.upgradeDesc}</p>
                  </div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-medium">{t.collection.portfolio.title}</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { /* TODO: upgrade flow */ }} className="flex-1 px-3 py-2 bg-accent-link text-[#0f1213] rounded-lg text-sm font-bold">{t.collection.dropdown.upgrade}</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={onLogout} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors" title="Sign out"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* ── Mobile portfolio tabs (compact, scrollable) ───────────────────────── */}
      <div className="md:hidden bg-surface-bg/95 border-b border-white/[0.05]">
        <div className="collection-portfolio-scroll">
          <div className="collection-portfolio-inner">
            <button onClick={() => selectPortfolio(null)} className={`collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${!activePortfolioId ? 'bg-accent-link/15 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="ml-1">{t.collection.filters.all}</span>
              <span className={`ml-2 text-[10px] tabular-nums ${!activePortfolioId ? 'text-accent-link' : 'text-text-muted'}`}>{cards.length}</span>
            </button>
            {portfolios.map(p => (
              <button key={p.id} onClick={() => selectPortfolio(p.id)} className={`collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activePortfolioId === p.id ? 'bg-accent-link/15 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                <Folder className="w-3.5 h-3.5" />
                <span className="truncate ml-1">{p.name}</span>
                <span className={`ml-2 text-[10px] tabular-nums ${activePortfolioId === p.id ? 'text-accent-link' : 'text-text-muted'}`}>{p.cardIds?.length ?? 0}</span>
              </button>
            ))}
            <button onClick={() => setCreatingPortfolio(true)} className="collection-portfolio-item flex-shrink-0 min-w-[6.5rem] flex items-center gap-1 px-3 py-1 rounded-lg text-xs text-text-muted hover:text-text-primary border border-dashed border-border-default hover:border-border-strong transition-colors whitespace-nowrap">
              <FolderPlus className="w-3 h-3" /> <span className="ml-1">{t.collection.portfolio.new}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:flex md:gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 gap-0.5 self-start sticky top-[calc(5rem+3.5rem)]">
          <button onClick={() => selectPortfolio(null)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-[color,background-color,border-color,opacity,transform] duration-150 ${!activePortfolioId ? 'bg-accent-link/15 text-text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised font-medium'}`}>
            <LayoutGrid className={`w-3.5 h-3.5 flex-shrink-0 ${!activePortfolioId ? 'text-accent-link' : 'text-text-muted'}`} />
            <span className="flex-1 text-sm text-left">All Cards</span>
            <span className={`text-xs tabular-nums ${!activePortfolioId ? 'text-accent-link' : 'text-text-muted'}`}>{cards.length}</span>
          </button>

          {portfolios.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 px-3 mb-1.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-medium">Portfolios</p>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>
              {portfolios.map(p => <SidebarPortfolioItem key={p.id} p={p} />)}
            </div>
          )}

          <div className="mt-3">
            {creatingPortfolio ? (
              <div className="px-3 py-2.5 bg-surface-raised rounded-xl border border-accent-link/25">
                <input autoFocus value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); if (e.key === 'Escape') { setCreatingPortfolio(false); setNewPortfolioName(''); } }}
                  placeholder="Portfolio name…" className="w-full bg-transparent text-text-primary text-xs font-medium mb-2 placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-1 rounded-sm"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-text-muted text-[10px] cursor-pointer select-none">
                    <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-3 h-3 rounded accent-accent-link" /> Public
                  </label>
                  <div className="flex items-center gap-1">
                    <button onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="p-1 rounded bg-accent-link text-surface-bg hover:bg-accent-link/30 transition-colors disabled:opacity-40">
                      {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
                    </button>
                    <button onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="p-1 rounded bg-surface-raised text-text-muted hover:text-text-primary transition-colors"><X className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setCreatingPortfolio(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-raised transition-[color,background-color,border-color,opacity,transform] duration-150 text-xs border border-dashed border-border-default hover:border-border-strong">
                    <FolderPlus className="w-3.5 h-3.5" />{t.collection.portfolio.newPortfolio}
                  </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
            {[{ label: t.collection.stats.total, value: baseCards.length, color: 'text-text-primary' }, { label: t.collection.stats.active, value: available, color: 'text-emerald-400' }, { label: t.collection.stats.sold, value: soldCount, color: 'text-red-400' }].map(s => (
              <div key={s.label} className="bg-surface-raised border border-border-default rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-text-secondary text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
            <div className="hidden sm:block bg-surface-raised border border-border-default rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-accent-link">{totalBuy.toLocaleString()}</p>
              <p className="text-text-secondary text-xs uppercase tracking-widest mt-0.5 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" />Buy (HKD)</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              <input className="w-full bg-surface-raised border border-border-default rounded-lg pl-9 pr-3 py-1.5 sm:py-2 text-text-primary text-xs sm:text-sm placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg transition-colors" placeholder={t.collection.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="bg-surface-raised border border-border-default rounded-lg px-3 py-2 text-text-primary text-sm focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg transition-colors" value={filterSold} onChange={e => setFilterSold(e.target.value as typeof filterSold)}>
              <option value="all">{t.collection.filters.all}</option>
              <option value="active">{t.collection.filters.active}</option>
              <option value="sold">{t.collection.filters.sold}</option>
            </select>
            <div className="flex bg-surface-raised border border-border-default rounded-lg p-0.5 gap-0.5">
              <button type="button" onClick={() => setDisplayMode('list')} className={`p-1.5 rounded transition ${displayMode === 'list' ? 'bg-accent-link text-surface-bg' : 'text-text-muted hover:text-text-primary'}`} title="List"><List className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDisplayMode('grid')} className={`p-1.5 rounded transition ${displayMode === 'grid' ? 'bg-accent-link text-surface-bg' : 'text-text-muted hover:text-text-primary'}`} title="Grid"><LayoutGrid className="w-3.5 h-3.5" /></button>
            </div>
            {activePortfolio && (
              <button onClick={() => setShowAddPicker(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-[color,background-color,border-color,opacity,transform] ${showAddPicker ? 'bg-accent-link/15 border-accent-link/40 text-accent-link' : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'}`}>
                <FolderPlus className="w-3.5 h-3.5" />{showAddPicker ? t.collection.toolbar.close : t.collection.toolbar.addCards}
              </button>
            )}
          </div>

          {/* Add Cards Picker */}
          {activePortfolio && showAddPicker && (
            <div className="mb-4 rounded-xl border border-accent-link/20 bg-accent-link/[0.04] overflow-hidden">
              <div className="px-4 py-3 border-b border-accent-link/15 flex items-center justify-between">
                <p className="text-accent-link text-xs font-semibold">{t.collection.portfolio.addTo.replace('{name}', activePortfolio.name)}</p>
                <span className="text-text-muted text-[10px]">{t.collection.portfolio.available.replace('{n}', String(pickerCards.length))}</span>
              </div>
              {pickerCards.length === 0 ? (
                <p className="text-text-muted text-xs text-center py-6">{t.collection.empty.addCardsUsingButton}</p>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-52 overflow-y-auto">
                  {pickerCards.map(card => (
                    <div key={card.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-raised transition-colors">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-xs font-medium truncate">{card.name}</p>
                        <p className="text-text-muted text-[10px]">{[card.year, card.set].filter(Boolean).join(' · ')}</p>
                      </div>
                      <button onClick={() => handleAddCard(activePortfolio.id, card.id)} disabled={addingCardKey === activePortfolio.id + card.id} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-link/15 text-accent-link text-[10px] font-bold hover:bg-accent-link/30 transition-colors disabled:opacity-40 flex-shrink-0">
                        {addingCardKey === activePortfolio.id + card.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Plus className="w-3 h-3" />Add</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" /><p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          {/* Loading */}
          {loading && <div className="flex items-center justify-center py-16 gap-2 text-text-muted"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">{t.common.loading}</span></div>}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 panel flex items-center justify-center mb-4">
                {activePortfolio ? <Folder className="w-6 h-6 text-text-muted" /> : <Package className="w-6 h-6 text-text-muted" />}
              </div>
              <p className="text-text-muted text-sm mb-1">{search ? t.collection.empty.noCardsFound : activePortfolio ? t.collection.empty.portfolioEmpty.replace('{name}', activePortfolio.name) : t.collection.empty.noCardsYet}</p>
              <p className="text-text-muted text-xs mb-6">{search ? t.collection.empty.tryDifferentSearch : activePortfolio ? t.collection.empty.addCardsUsingButton : t.collection.empty.addYourFirstCard}</p>
              {!search && !activePortfolio && <button onClick={onOpenNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-link/15 border border-accent-link/30 text-accent-link text-sm font-medium hover:bg-accent-link/25 transition-[color,background-color,border-color,opacity,transform]"><Plus className="w-4 h-4" />{t.collection.toolbar.addFirstCard}</button>}
              {!search && activePortfolio && <button onClick={() => setShowAddPicker(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-link/15 border border-accent-link/30 text-accent-link text-sm font-medium hover:bg-accent-link/25 transition-[color,background-color,border-color,opacity,transform]"><FolderPlus className="w-4 h-4" />{t.collection.toolbar.pickCardsToAdd}</button>}
            </div>
          )}

          {/* LIST VIEW */}
          {!loading && filtered.length > 0 && displayMode === 'list' && (
            <div className="rounded-xl border border-border-default overflow-hidden">
              <div className="hidden sm:grid gap-3 items-center px-4 py-2.5 bg-surface-raised border-b border-white/[0.04]" style={{ gridTemplateColumns: activePortfolio ? '1fr 130px 100px 80px 110px' : '1fr 130px 100px 80px 80px' }}>
                  {[t.collection.table.card, t.collection.table.grade, t.collection.table.buyPrice, t.collection.table.status, t.collection.table.actions].map(h => <p key={h} className="text-text-muted text-[10px] uppercase tracking-widest">{h}</p>)}
                </div>
              {filtered.map(card => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                return (
                  <div key={card.id} className={`border-b border-white/[0.04] last:border-b-0 transition-colors ${deleteId === card.id ? 'bg-red-500/5' : 'hover:bg-surface-raised'}`}>
                    <div className="hidden sm:grid gap-3 items-center px-4 py-3" style={{ gridTemplateColumns: activePortfolio ? '1fr 130px 100px 80px 110px' : '1fr 130px 100px 80px 80px' }}>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${card.sold ? 'text-text-muted line-through' : 'text-text-primary'}`}>{card.name}</p>
                        <p className="text-text-muted text-xs truncate mt-0.5">{[card.year, card.set, card.number, card.language].filter(Boolean).join(' · ')}</p>
                        {card.certNumber && <p className="text-text-muted text-[10px] truncate mt-0.5">Cert {card.certNumber}</p>}
                        {memberships.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {memberships.map(p => <span key={p.id} className="inline-flex items-center gap-0.5 text-[9px] text-accent-link/60 bg-accent-link/8 px-1.5 py-0.5 rounded-full border border-accent-link/15"><Folder className="w-2 h-2" />{p.name}</span>)}
                          </div>
                        )}
                      </div>
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <div>
                        <p className={`text-sm font-bold ${card.sold ? 'text-text-muted line-through' : 'text-accent-link'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</p>
                        {card.listPrice && <p className="text-text-muted text-[10px]">List: {card.listCurrency} {card.listPrice.toLocaleString()}</p>}
                      </div>
                      <button onClick={() => onToggleSold(card)} className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-[color,background-color,border-color,opacity,transform] uppercase tracking-wider ${card.sold ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {card.sold ? 'Sold' : 'Active'}
                      </button>
                      <CardActions card={card} />
                    </div>
                    <div className="sm:hidden flex items-center gap-3 px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${card.sold ? 'text-text-muted line-through' : 'text-text-primary'}`}>{card.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                          <span className={`text-xs font-bold ${card.sold ? 'text-text-muted line-through' : 'text-accent-link'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <CardActions card={card} compact />
                    </div>
                    {deleteId === card.id && !activePortfolio && (
                      <div className="sm:hidden flex items-center gap-2 px-3 pb-2">
                        <p className="text-red-400 text-xs flex-1">Delete &ldquo;{card.name}&rdquo;?</p>
                        <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold disabled:opacity-40">{deleting ? '…' : 'Confirm'}</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-surface-raised text-text-muted text-xs">Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* GRID VIEW */}
          {!loading && filtered.length > 0 && displayMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(card => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                return (
                  <div key={card.id} className="bg-surface-raised border border-border-default rounded-xl p-4 hover:border-white/[0.12] transition-colors flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <span onClick={() => onToggleSold(card)} className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider cursor-pointer ${card.sold ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {card.sold ? 'Sold' : 'Active'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold leading-snug ${card.sold ? 'text-text-muted line-through' : 'text-text-primary'}`}>{card.name}</p>
                      <p className="text-text-muted text-xs mt-1 line-clamp-1">{[card.year, card.set].filter(Boolean).join(' · ')}</p>
                      {card.certNumber && <p className="text-text-muted text-[10px] mt-0.5">Cert #{card.certNumber}</p>}
                      {memberships.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {memberships.map(p => <span key={p.id} className="inline-flex items-center gap-0.5 text-[9px] text-accent-link/60 bg-accent-link/8 px-1.5 py-0.5 rounded-full border border-accent-link/15"><Folder className="w-2 h-2" />{p.name}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between">
                      <div>
                        <p className="text-text-muted text-[10px] uppercase tracking-widest">{t.collection.table.buyPrice}</p>
                        <p className={`text-sm font-bold ${card.sold ? 'text-text-muted line-through' : 'text-accent-link'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</p>
                      </div>
                      {card.listPrice && <div className="text-right"><p className="text-text-muted text-[10px] uppercase tracking-widest">{t.collection.table.list}</p><p className="text-text-secondary text-sm font-medium">{card.listCurrency} {card.listPrice.toLocaleString()}</p></div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onOpenEdit(card)} className="flex-1 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors text-xs font-medium flex items-center justify-center gap-1.5"><Pencil className="w-3 h-3" /> {t.collection.account.edit}</button>
                      {activePortfolio ? (
                        <button onClick={() => handleRemoveCard(card.id)} disabled={removingCardId === card.id} className="flex-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-40">
                          {removingCardId === card.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3" />{t.collection.toolbar.remove}</>}
                        </button>
                      ) : (
                        <button onClick={() => setDeleteId(card.id)} className="flex-1 py-1.5 rounded-lg bg-surface-raised hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors text-xs font-medium flex items-center justify-center gap-1.5"><Trash2 className="w-3 h-3" /> {t.collection.account.delete}</button>
                      )}
                    </div>
                    {deleteId === card.id && !activePortfolio && (
                      <div className="flex items-center gap-2 border-t border-white/[0.04] pt-2">
                        <p className="text-red-400 text-xs flex-1">{t.collection.actions.confirmDeleteCard}</p>
                        <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold disabled:opacity-40">{deleting ? '…' : t.collection.actions.confirm}</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-surface-raised text-text-muted text-xs">{t.common.cancel}</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile: create portfolio bottom sheet */}
      {creatingPortfolio && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-50 flex items-end pb-[env(safe-area-inset-bottom)]" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }}>
          <div className="w-full bg-surface-panel border-t border-border-default p-6 min-w-0" onClick={e => e.stopPropagation()}>
            <h3 className="text-text-primary font-bold text-sm mb-4">{t.collection.portfolio.newPortfolio}</h3>
            <input autoFocus value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); }}
              placeholder={t.collection.portfolio.namePlaceholder} className="w-full bg-surface-raised border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-muted focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg mb-3"
            />
            <label className="flex items-center gap-2 text-text-secondary text-sm cursor-pointer mb-5 select-none">
              <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-4 h-4 rounded accent-accent-link" />
              {t.collection.portfolio.makePublic}
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="flex-1 py-2.5 rounded-xl bg-surface-raised text-text-secondary text-sm font-medium">{t.common.cancel}</button>
              <button onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="btn btn-primary flex-1 min-h-11 disabled:opacity-40">
                {portfolioActionLoading ? t.collection.portfolio.creating : t.collection.portfolio.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
