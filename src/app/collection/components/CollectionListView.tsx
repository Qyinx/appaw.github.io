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
        <div className="px-3 py-2.5 bg-white/[0.04] rounded-xl border border-[#9B7EBF]/30 mb-1">
          <input autoFocus value={editingName} onChange={e => setEditingName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUpdatePortfolio(); if (e.key === 'Escape') setEditingPortfolioId(null); }}
            className="w-full bg-transparent text-white text-xs font-medium outline-none mb-2 placeholder-white/25"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-white/40 text-[10px] cursor-pointer select-none">
              <input type="checkbox" checked={editingPublic} onChange={e => setEditingPublic(e.target.checked)} className="w-3 h-3 rounded accent-[#9B7EBF]" />
              Public
            </label>
            <div className="flex items-center gap-1">
              <button onClick={handleUpdatePortfolio} disabled={portfolioActionLoading} className="p-1 rounded bg-[#9B7EBF] text-[#1e1e2e] hover:bg-[#AF97D3] transition-colors disabled:opacity-40">
                {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
              </button>
              <button onClick={() => setEditingPortfolioId(null)} className="p-1 rounded bg-white/[0.06] text-white/40 hover:text-white transition-colors"><X className="w-2.5 h-2.5" /></button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 mb-0.5 ${isActive ? 'bg-[#9B7EBF]/15 text-white' : 'hover:bg-white/[0.04] text-white/55 hover:text-white'}`} onClick={() => selectPortfolio(p.id)}>
        {isActive ? <FolderOpen className="w-3.5 h-3.5 text-[#9B7EBF] flex-shrink-0" /> : <Folder className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />}
        <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
        {p.isPublic && <Globe className="w-3 h-3 text-white/25 flex-shrink-0" />}
        <span className={`text-xs tabular-nums flex-shrink-0 ${isActive ? 'text-[#9B7EBF]' : 'text-white/25'}`}>{p.count}</span>
        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); setEditingPortfolioId(p.id); setEditingName(p.name); setEditingPublic(p.isPublic); }} className="p-1 rounded hover:bg-white/10 text-white/35 hover:text-white transition-colors" title="Rename"><Pencil className="w-2.5 h-2.5" /></button>
          <button onClick={e => { e.stopPropagation(); handleDeletePortfolio(p.id); }} className="p-1 rounded hover:bg-red-500/15 text-white/35 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-2.5 h-2.5" /></button>
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
          <button onClick={() => setDeleteId(null)} className="p-1.5 rounded bg-white/[0.06] text-white/40 transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <button onClick={() => onOpenEdit(card)} className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors" title="Edit">
          <Pencil className={compact ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </button>
        {activePortfolio ? (
          <button onClick={() => handleRemoveCard(card.id)} disabled={isRemoving} className="flex items-center gap-1 px-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors text-[10px] font-medium disabled:opacity-40" title="Remove from portfolio">
            {isRemoving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3" />{!compact && 'Remove'}</>}
          </button>
        ) : (
          <button onClick={() => setDeleteId(card.id)} className="p-1.5 rounded bg-white/[0.04] hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors" title="Delete">
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
    <div className="min-h-screen bg-[#1e1e2e]">

      {/* ── Sticky top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-20 bg-[#1e1e2e]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <h1 className="text-white font-bold text-sm flex items-center gap-1.5 min-w-0">
            {activePortfolio ? (
              <>
                <button onClick={() => selectPortfolio(null)} className="text-white/40 font-normal hover:text-white transition-colors whitespace-nowrap">My Collection</button>
                <ChevronRight className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                <span className="truncate">{activePortfolio.name}</span>
              </>
            ) : 'My Collection'}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {saveMsg && <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs"><Check className="w-3.5 h-3.5" />{saveMsg}</span>}
            <button onClick={onRefresh} disabled={loading} className="p-1.5 rounded-lg text-white/50 hover:text-white transition-colors disabled:opacity-40" title="Refresh">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onOpenNew} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9B7EBF] text-[#1e1e2e] text-xs font-bold hover:bg-[#AF97D3] transition-colors">
              <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">Add Card</span>
            </button>
            <div className="relative">
              <button ref={accountBtnRef} onClick={() => setShowPlan(v => !v)} className="flex items-center gap-2 border border-white/[0.07] rounded-full pl-1 pr-2.5 py-1 bg-transparent">
                {user?.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={userName} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#9B7EBF]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#9B7EBF] text-[10px] font-bold">{userName[0]?.toUpperCase()}</span>
                  </div>
                )}
                <span className="text-white/50 text-xs hidden sm:block max-w-[90px] truncate">{user?.email ?? userName}</span>
                {memberLevel && <MemberBadge level={memberLevel} />}
              </button>

              {showPlan && (
                <div ref={planMenuRef} className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-[#0b0c0d] to-[#070708] border border-white/[0.04] rounded-xl p-4 shadow-2xl z-50">
                  <div className="flex items-center gap-3 mb-3">
                    {user?.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.picture} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#9B7EBF]/20 flex items-center justify-center">
                        <span className="text-[#9B7EBF] font-bold">{userName[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-white text-sm font-semibold truncate">{user?.email ?? userName}</div>
                        {memberLevel && <MemberBadge level={memberLevel} />}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{memberLevel ? `${memberLevel} ${t.collection.dropdown.planSuffix}` : t.collection.dropdown.planFree}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1"> 
                      <span>{t.collection.dropdown.stored}</span>
                      <span className="tabular-nums">{storedCount}/{limits.cards}</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-2 rounded overflow-hidden mb-2">
                      <div className={`h-2 ${storedPct >= 90 ? 'bg-red-400' : storedPct >= 70 ? 'bg-amber-400' : 'bg-[#9B7EBF]'}`} style={{ width: `${storedPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1"> 
                      <span>{t.collection.dropdown.portfolios}</span>
                      <span className="tabular-nums">{portfoliosCount}/{limits.portfolios}</span>
                    </div>
                    <div className="w-full bg-white/[0.03] h-2 rounded overflow-hidden">
                      <div className={`h-2 ${portfoliosPct >= 90 ? 'bg-red-400' : portfoliosPct >= 70 ? 'bg-amber-400' : 'bg-[#9B7EBF]'}`} style={{ width: `${portfoliosPct}%` }} />
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-white/60 text-sm">{t.collection.dropdown.upgradeDesc}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => { /* TODO: upgrade flow */ }} className="flex-1 px-3 py-2 bg-[#9B7EBF] text-[#0f1213] rounded-lg text-sm font-bold">{t.collection.dropdown.upgrade}</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={onLogout} className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors" title="Sign out"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* ── Mobile portfolio tabs ────────────────────────────────────────────── */}
      <div className="md:hidden bg-[#1e1e2e]/90 backdrop-blur-md border-b border-white/[0.05] overflow-x-auto">
        <div className="flex items-center gap-1 px-4 py-2 w-max">
          <button onClick={() => selectPortfolio(null)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!activePortfolioId ? 'bg-[#9B7EBF]/15 text-white' : 'text-white/50 hover:text-white'}`}>
            <LayoutGrid className="w-3.5 h-3.5" />All
            <span className={`text-xs tabular-nums ${!activePortfolioId ? 'text-[#9B7EBF]' : 'text-white/30'}`}>{cards.length}</span>
          </button>
          {portfolios.map(p => (
            <button key={p.id} onClick={() => selectPortfolio(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activePortfolioId === p.id ? 'bg-[#9B7EBF]/15 text-white' : 'text-white/50 hover:text-white'}`}>
              <Folder className="w-3.5 h-3.5" />
              <span className="truncate">{p.name}</span>
              <span className={`text-xs tabular-nums ${activePortfolioId === p.id ? 'text-[#9B7EBF]' : 'text-white/30'}`}>{p.cardIds?.length ?? 0}</span>
            </button>
          ))}
          <button onClick={() => setCreatingPortfolio(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white border border-dashed border-white/15 hover:border-white/30 transition-colors whitespace-nowrap">
            <FolderPlus className="w-3 h-3" /> New
          </button>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:flex md:gap-6">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 gap-0.5 self-start sticky top-[calc(5rem+3.5rem)]">
          <button onClick={() => selectPortfolio(null)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-150 ${!activePortfolioId ? 'bg-[#9B7EBF]/15 text-white font-semibold' : 'text-white/55 hover:text-white hover:bg-white/[0.04] font-medium'}`}>
            <LayoutGrid className={`w-3.5 h-3.5 flex-shrink-0 ${!activePortfolioId ? 'text-[#9B7EBF]' : 'text-white/40'}`} />
            <span className="flex-1 text-sm text-left">All Cards</span>
            <span className={`text-xs tabular-nums ${!activePortfolioId ? 'text-[#9B7EBF]' : 'text-white/25'}`}>{cards.length}</span>
          </button>

          {portfolios.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 px-3 mb-1.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-medium">Portfolios</p>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>
              {portfolios.map(p => <SidebarPortfolioItem key={p.id} p={p} />)}
            </div>
          )}

          <div className="mt-3">
            {creatingPortfolio ? (
              <div className="px-3 py-2.5 bg-white/[0.04] rounded-xl border border-[#9B7EBF]/25">
                <input autoFocus value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); if (e.key === 'Escape') { setCreatingPortfolio(false); setNewPortfolioName(''); } }}
                  placeholder="Portfolio name…" className="w-full bg-transparent text-white text-xs font-medium outline-none mb-2 placeholder-white/25"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-white/40 text-[10px] cursor-pointer select-none">
                    <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-3 h-3 rounded accent-[#9B7EBF]" /> Public
                  </label>
                  <div className="flex items-center gap-1">
                    <button onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="p-1 rounded bg-[#9B7EBF] text-[#1e1e2e] hover:bg-[#AF97D3] transition-colors disabled:opacity-40">
                      {portfolioActionLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
                    </button>
                    <button onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="p-1 rounded bg-white/[0.06] text-white/40 hover:text-white transition-colors"><X className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setCreatingPortfolio(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] transition-all duration-150 text-xs border border-dashed border-white/10 hover:border-white/20">
                <FolderPlus className="w-3.5 h-3.5" />New Portfolio
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
            {[{ label: 'Total', value: baseCards.length, color: 'text-white' }, { label: 'Active', value: available, color: 'text-emerald-400' }, { label: 'Sold', value: soldCount, color: 'text-red-400' }].map(s => (
              <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
            <div className="hidden sm:block bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#9B7EBF]">{totalBuy.toLocaleString()}</p>
              <p className="text-white/50 text-xs uppercase tracking-widest mt-0.5 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" />Buy (HKD)</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              <input className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#9B7EBF]/50 transition-colors" placeholder="Search by name, set, cert no…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9B7EBF]/50 transition-colors" value={filterSold} onChange={e => setFilterSold(e.target.value as typeof filterSold)}>
              <option value="all">All Cards</option>
              <option value="active">Active Only</option>
              <option value="sold">Sold Only</option>
            </select>
            <div className="flex bg-white/[0.04] border border-white/10 rounded-lg p-0.5 gap-0.5">
              <button type="button" onClick={() => setDisplayMode('list')} className={`p-1.5 rounded transition ${displayMode === 'list' ? 'bg-[#9B7EBF] text-[#1e1e2e]' : 'text-white/40 hover:text-white'}`} title="List"><List className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDisplayMode('grid')} className={`p-1.5 rounded transition ${displayMode === 'grid' ? 'bg-[#9B7EBF] text-[#1e1e2e]' : 'text-white/40 hover:text-white'}`} title="Grid"><LayoutGrid className="w-3.5 h-3.5" /></button>
            </div>
            {activePortfolio && (
              <button onClick={() => setShowAddPicker(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${showAddPicker ? 'bg-[#9B7EBF]/15 border-[#9B7EBF]/40 text-[#9B7EBF]' : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'}`}>
                <FolderPlus className="w-3.5 h-3.5" />{showAddPicker ? 'Close' : 'Add Cards'}
              </button>
            )}
          </div>

          {/* Add Cards Picker */}
          {activePortfolio && showAddPicker && (
            <div className="mb-4 rounded-xl border border-[#9B7EBF]/20 bg-[#9B7EBF]/[0.04] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#9B7EBF]/15 flex items-center justify-between">
                <p className="text-[#9B7EBF] text-xs font-semibold">Add cards to &ldquo;{activePortfolio.name}&rdquo;</p>
                <span className="text-white/30 text-[10px]">{pickerCards.length} available</span>
              </div>
              {pickerCards.length === 0 ? (
                <p className="text-white/30 text-xs text-center py-6">All cards are already in this portfolio</p>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-52 overflow-y-auto">
                  {pickerCards.map(card => (
                    <div key={card.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{card.name}</p>
                        <p className="text-white/30 text-[10px]">{[card.year, card.set].filter(Boolean).join(' · ')}</p>
                      </div>
                      <button onClick={() => handleAddCard(activePortfolio.id, card.id)} disabled={addingCardKey === activePortfolio.id + card.id} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#9B7EBF]/15 text-[#9B7EBF] text-[10px] font-bold hover:bg-[#9B7EBF]/30 transition-colors disabled:opacity-40 flex-shrink-0">
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
          {loading && <div className="flex items-center justify-center py-16 gap-2 text-white/40"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div>}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                {activePortfolio ? <Folder className="w-6 h-6 text-white/30" /> : <Package className="w-6 h-6 text-white/30" />}
              </div>
              <p className="text-white/40 text-sm mb-1">{search ? 'No cards found' : activePortfolio ? `"${activePortfolio.name}" is empty` : 'No cards yet'}</p>
              <p className="text-white/30 text-xs mb-6">{search ? 'Try a different search term' : activePortfolio ? 'Add cards using the button above' : 'Add your first card to get started'}</p>
              {!search && !activePortfolio && <button onClick={onOpenNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9B7EBF]/15 border border-[#9B7EBF]/30 text-[#9B7EBF] text-sm font-medium hover:bg-[#9B7EBF]/25 transition-all"><Plus className="w-4 h-4" />Add First Card</button>}
              {!search && activePortfolio && <button onClick={() => setShowAddPicker(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9B7EBF]/15 border border-[#9B7EBF]/30 text-[#9B7EBF] text-sm font-medium hover:bg-[#9B7EBF]/25 transition-all"><FolderPlus className="w-4 h-4" />Pick Cards to Add</button>}
            </div>
          )}

          {/* LIST VIEW */}
          {!loading && filtered.length > 0 && displayMode === 'list' && (
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="hidden sm:grid gap-3 items-center px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]" style={{ gridTemplateColumns: activePortfolio ? '1fr 130px 100px 80px 110px' : '1fr 130px 100px 80px 80px' }}>
                {['Card', 'Grade', 'Buy Price', 'Status', 'Actions'].map(h => <p key={h} className="text-white/40 text-[10px] uppercase tracking-widest">{h}</p>)}
              </div>
              {filtered.map(card => {
                const memberships = !activePortfolio ? cardPortfolios(card.id) : [];
                return (
                  <div key={card.id} className={`border-b border-white/[0.04] last:border-b-0 transition-colors ${deleteId === card.id ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'}`}>
                    <div className="hidden sm:grid gap-3 items-center px-4 py-3" style={{ gridTemplateColumns: activePortfolio ? '1fr 130px 100px 80px 110px' : '1fr 130px 100px 80px 80px' }}>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${card.sold ? 'text-white/35 line-through' : 'text-white'}`}>{card.name}</p>
                        <p className="text-white/35 text-xs truncate mt-0.5">{[card.year, card.set, card.number, card.language].filter(Boolean).join(' · ')}</p>
                        {card.certNumber && <p className="text-white/25 text-[10px] truncate mt-0.5">Cert {card.certNumber}</p>}
                        {memberships.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {memberships.map(p => <span key={p.id} className="inline-flex items-center gap-0.5 text-[9px] text-[#9B7EBF]/60 bg-[#9B7EBF]/8 px-1.5 py-0.5 rounded-full border border-[#9B7EBF]/15"><Folder className="w-2 h-2" />{p.name}</span>)}
                          </div>
                        )}
                      </div>
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <div>
                        <p className={`text-sm font-bold ${card.sold ? 'text-white/35 line-through' : 'text-[#9B7EBF]'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</p>
                        {card.listPrice && <p className="text-white/35 text-[10px]">List: {card.listCurrency} {card.listPrice.toLocaleString()}</p>}
                      </div>
                      <button onClick={() => onToggleSold(card)} className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all uppercase tracking-wider ${card.sold ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {card.sold ? 'Sold' : 'Active'}
                      </button>
                      <CardActions card={card} />
                    </div>
                    <div className="sm:hidden flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${card.sold ? 'text-white/35 line-through' : 'text-white'}`}>{card.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                          <span className={`text-xs font-bold ${card.sold ? 'text-white/35 line-through' : 'text-[#9B7EBF]'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <CardActions card={card} compact />
                    </div>
                    {deleteId === card.id && !activePortfolio && (
                      <div className="sm:hidden flex items-center gap-2 px-4 pb-3">
                        <p className="text-red-400 text-xs flex-1">Delete &ldquo;{card.name}&rdquo;?</p>
                        <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold disabled:opacity-40">{deleting ? '…' : 'Confirm'}</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-white/[0.06] text-white/40 text-xs">Cancel</button>
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
                  <div key={card.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                      <span onClick={() => onToggleSold(card)} className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider cursor-pointer ${card.sold ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {card.sold ? 'Sold' : 'Active'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold leading-snug ${card.sold ? 'text-white/35 line-through' : 'text-white'}`}>{card.name}</p>
                      <p className="text-white/35 text-xs mt-1 line-clamp-1">{[card.year, card.set].filter(Boolean).join(' · ')}</p>
                      {card.certNumber && <p className="text-white/30 text-[10px] mt-0.5">Cert #{card.certNumber}</p>}
                      {memberships.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {memberships.map(p => <span key={p.id} className="inline-flex items-center gap-0.5 text-[9px] text-[#9B7EBF]/60 bg-[#9B7EBF]/8 px-1.5 py-0.5 rounded-full border border-[#9B7EBF]/15"><Folder className="w-2 h-2" />{p.name}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between">
                      <div>
                        <p className="text-white/35 text-[10px] uppercase tracking-widest">Buy</p>
                        <p className={`text-sm font-bold ${card.sold ? 'text-white/35 line-through' : 'text-[#9B7EBF]'}`}>{card.buyCurrency} {card.buyPrice.toLocaleString()}</p>
                      </div>
                      {card.listPrice && <div className="text-right"><p className="text-white/35 text-[10px] uppercase tracking-widest">List</p><p className="text-white/50 text-sm font-medium">{card.listCurrency} {card.listPrice.toLocaleString()}</p></div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onOpenEdit(card)} className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-1.5"><Pencil className="w-3 h-3" /> Edit</button>
                      {activePortfolio ? (
                        <button onClick={() => handleRemoveCard(card.id)} disabled={removingCardId === card.id} className="flex-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-40">
                          {removingCardId === card.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3" />Remove</>}
                        </button>
                      ) : (
                        <button onClick={() => setDeleteId(card.id)} className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors text-xs font-medium flex items-center justify-center gap-1.5"><Trash2 className="w-3 h-3" /> Delete</button>
                      )}
                    </div>
                    {deleteId === card.id && !activePortfolio && (
                      <div className="flex items-center gap-2 border-t border-white/[0.04] pt-2">
                        <p className="text-red-400 text-xs flex-1">Delete this card?</p>
                        <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold disabled:opacity-40">{deleting ? '…' : 'Confirm'}</button>
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-white/[0.06] text-white/40 text-xs">Cancel</button>
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
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end" onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }}>
          <div className="w-full bg-[#1e1e2e] border-t border-white/10 rounded-t-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-sm mb-4">New Portfolio</h3>
            <input autoFocus value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreatePortfolio(); }}
              placeholder="Portfolio name…" className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#9B7EBF]/50 mb-3"
            />
            <label className="flex items-center gap-2 text-white/50 text-sm cursor-pointer mb-5 select-none">
              <input type="checkbox" checked={newPortfolioPublic} onChange={e => setNewPortfolioPublic(e.target.checked)} className="w-4 h-4 rounded accent-[#9B7EBF]" />
              Make this portfolio public
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setCreatingPortfolio(false); setNewPortfolioName(''); }} className="flex-1 py-2.5 rounded-xl bg-white/[0.06] text-white/60 text-sm font-medium">Cancel</button>
              <button onClick={handleCreatePortfolio} disabled={portfolioActionLoading || !newPortfolioName.trim()} className="flex-1 py-2.5 rounded-xl bg-[#9B7EBF] text-[#1e1e2e] text-sm font-bold hover:bg-[#AF97D3] transition-colors disabled:opacity-40">
                {portfolioActionLoading ? 'Creating…' : 'Create Portfolio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
