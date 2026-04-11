'use client';

import React, {
  useState, useEffect, useRef, ChangeEvent, useCallback,
} from 'react';
import {
  Plus, Pencil, Trash2, Check, X, Lock, Loader2, ImageIcon,
  Eye, EyeOff, ArrowLeft, AlertCircle, Layers, ShieldOff,
  ExternalLink, RefreshCw, Save, Download, Link2, Clipboard,
} from 'lucide-react';
import type { TradingCard, BundleCard, GradingCompany } from '@/types/trading-card';

/* ──────────────────────────────────────────────────────────────────────────────
   CONFIG — SHA-256 hash of the admin password (not the password itself).
   To change the password:
   *   node -e "console.log(require('crypto').createHash('sha256').update('YOUR_NEW_PASS').digest('hex'))"
   Then paste the output below. The plaintext password is never stored in source.
   ────────────────────────────────────────────────────────────────────────────── */
const ADMIN_PASS_HASH = '1ec632420c732749f44e917b30c0b27a7f8e9d2ce502ec2236df52608af88f2f';

/** Hash a string with SHA-256 using the browser Web Crypto API. */
async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ──────────────────────────────────────────────────────────────────────────────
   FORM TYPES  (strings for inputs, converted on save)
   ────────────────────────────────────────────────────────────────────────────── */
type BF = {
  name: string; image: string; imageBack: string;
  company: GradingCompany; grade: string;
  isBlackLabel: boolean; certNumber: string;
  set: string; number: string; year: string;
};

type CF = {
  id: string; name: string; year: string;
  company: GradingCompany; grade: string; isBlackLabel: boolean;
  image: string; imageBack: string;
  set: string; number: string; certNumber: string;
  price: string; currency: string; language: string;
  notes: string; sold: boolean;
  isBundle: boolean; bundleCards: BF[];
  createdAt: string;
};

const COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'CGC'];
const CURRENCIES = ['HKD', 'USD', 'JPY', 'TWD', 'SGD'];
const LANGUAGES = ['Japanese', 'English', 'Chinese', 'Korean', 'Other'];

function emptyBF(): BF {
  return { name: '', image: '', imageBack: '', company: 'PSA', grade: '10', isBlackLabel: false, certNumber: '', set: '', number: '', year: '' };
}

function emptyCF(): CF {
  return {
    id: crypto.randomUUID(), name: '', year: String(new Date().getFullYear()),
    company: 'PSA', grade: '10', isBlackLabel: false,
    image: '', imageBack: '', set: '', number: '', certNumber: '',
    price: '', currency: 'HKD', language: 'Japanese', notes: '',
    sold: false, isBundle: false, bundleCards: [],
    createdAt: new Date().toISOString(),
  };
}

function cardToCF(c: TradingCard): CF {
  return {
    id: c.id, name: c.name, year: String(c.year), company: c.company,
    grade: String(c.grade), isBlackLabel: c.isBlackLabel ?? false,
    image: c.image ?? '', imageBack: c.imageBack ?? '',
    set: c.set ?? '', number: c.number ?? '', certNumber: c.certNumber ?? '',
    price: String(c.price), currency: c.currency, language: c.language ?? 'Japanese',
    notes: c.notes ?? '', sold: c.sold ?? false,
    isBundle: !!(c.bundleCards?.length),
    bundleCards: (c.bundleCards ?? []).map(b => ({
      name: b.name, image: b.image, imageBack: b.imageBack ?? '',
      company: b.company, grade: String(b.grade),
      isBlackLabel: b.isBlackLabel ?? false, certNumber: b.certNumber ?? '',
      set: b.set ?? '', number: b.number ?? '', year: b.year ? String(b.year) : '',
    })),
    createdAt: c.createdAt ?? new Date().toISOString(),
  };
}

function cfToCard(f: CF): TradingCard {
  const now = new Date().toISOString();
  const c: TradingCard = {
    id: f.id, name: f.name.trim(), year: +f.year,
    company: f.company, grade: +f.grade,
    price: +f.price, currency: f.currency, sold: f.sold,
    createdAt: f.createdAt || now,
    updatedAt: now,
  };
  if (f.isBlackLabel) c.isBlackLabel = true;
  if (f.image) c.image = f.image;
  if (f.imageBack) c.imageBack = f.imageBack;
  if (f.set) c.set = f.set;
  if (f.number) c.number = f.number;
  if (f.certNumber) c.certNumber = f.certNumber;
  if (f.language) c.language = f.language;
  if (f.notes) c.notes = f.notes;
  if (f.isBundle && f.bundleCards.length) {
    c.bundleCards = f.bundleCards.map(b => {
      const bc: BundleCard = { name: b.name, image: b.image, company: b.company, grade: +b.grade };
      if (b.imageBack) bc.imageBack = b.imageBack;
      if (b.isBlackLabel) bc.isBlackLabel = true;
      if (b.certNumber) bc.certNumber = b.certNumber;
      if (b.set) bc.set = b.set;
      if (b.number) bc.number = b.number;
      if (b.year) bc.year = +b.year;
      return bc;
    });
  }
  return c;
}

/* ──────────────────────────────────────────────────────────────────────────────
   SHARED STYLE CONSTANTS
   ────────────────────────────────────────────────────────────────────────────── */
const inp = 'w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#d4a843]/50 transition-colors';
const lbl = 'text-white/40 text-[10px] uppercase tracking-widest mb-1 block';

/* ──────────────────────────────────────────────────────────────────────────────
   IMAGE UPLOAD FIELD
   ────────────────────────────────────────────────────────────────────────────── */
function ImageField({ label, path, preview, uploading, onFile }: {
  label: string; path: string; preview?: string;
  uploading?: boolean; onFile: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const src = preview || path;
  return (
    <div className="flex flex-col gap-1.5 flex-shrink-0">
      <p className={lbl}>{label}</p>
      <div
        onClick={() => ref.current?.click()}
        className="relative w-[88px] h-[117px] rounded-lg border-2 border-dashed border-white/10 hover:border-[#d4a843]/40 bg-white/[0.02] cursor-pointer transition-all overflow-hidden flex items-center justify-center group"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="w-full h-full object-contain p-1.5" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 group-hover:opacity-80 transition-opacity">
            <ImageIcon className="w-5 h-5 text-white/20" />
            <span className="text-[9px] text-white/20 text-center leading-tight">Click to<br />upload</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
        {path && !uploading && (
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500/90 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        {src && !uploading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-[9px] text-white font-medium bg-black/60 px-2 py-0.5 rounded">Change</span>
          </div>
        )}
      </div>
      {path && (
        <p className="text-white/20 text-[8px] truncate max-w-[88px]" title={path}>
          {path.split('/').pop()}
        </p>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   SECTION HEADER
   ────────────────────────────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[#d4a843] text-[10px] uppercase tracking-[0.2em] font-semibold">{title}</p>
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   TOGGLE
   ────────────────────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-2.5 group"
    >
      <div className={`relative w-9 h-5 rounded-full transition-all duration-300 ${value ? 'bg-[#d4a843]' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </div>
      <span className={`text-xs transition-colors ${value ? 'text-white' : 'text-white/40'} group-hover:text-white/70`}>{label}</span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   GRADE BADGE COLORS (simplified for admin display)
   ────────────────────────────────────────────────────────────────────────────── */
function GradePill({ company, grade, isBlackLabel }: { company: string; grade: number; isBlackLabel?: boolean }) {
  const color = grade >= 10 ? 'text-amber-300 border-amber-400/40 bg-amber-400/10'
    : grade >= 9 ? 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
    : grade >= 7 ? 'text-blue-400 border-blue-400/40 bg-blue-400/10'
    : 'text-white/50 border-white/20 bg-white/5';
  const coBg = company === 'PSA' ? 'bg-red-700 text-white'
    : company === 'BGS' ? 'bg-blue-700 text-white'
    : 'bg-purple-700 text-white';
  return (
    <div className="flex items-center gap-1">
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${coBg}`}>{company}</span>
      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${color}`}>
        {isBlackLabel && <span className="text-[7px] text-[#d4a843] mr-0.5">BL</span>}
        {grade}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────────────────────── */
export default function AdminClient() {
  /* ─── Auth ─── */
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authErr, setAuthErr] = useState(false);

  /* ─── Data ─── */
  const [cards, setCards] = useState<TradingCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataError, setDataError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  /* ─── View ─── */
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CF>(emptyCF());
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [fetchingPsa, setFetchingPsa] = useState<string | null>(null); // 'main' | 'bundle-0' | null
  const [psaManual, setPsaManual] = useState<{ target: string; frontUrl: string; backUrl: string } | null>(null);

  /* ─── Session check ─── */
  useEffect(() => {
    if (sessionStorage.getItem('aaw-adm') === '1') setAuthed(true);
  }, []);

  /* ─── Load cards ─── */
  useEffect(() => {
    if (authed) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function load() {
    setLoading(true); setDataError('');
    try {
      // Read directly from the public JSON file (no API route needed)
      const res = await fetch(`/data/trade-card.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('Could not load trade-card.json');
      setCards(await res.json());
    } catch (e) {
      setDataError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function persist(updated: TradingCard[], msg = 'Saved ✓') {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: updated }),
      });
      if (!res.ok) throw new Error('Save failed');
      setCards(updated);
      setSaveMsg(msg);
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (e) {
      setDataError(String(e));
    } finally {
      setSaving(false);
    }
  }

  /* ─── Auth ─── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const hash = await sha256(pw);
    if (hash === ADMIN_PASS_HASH) {
      sessionStorage.setItem('aaw-adm', '1');
      setAuthed(true);
    } else {
      setAuthErr(true);
      setTimeout(() => setAuthErr(false), 1800);
    }
  }

  /* ─── Form helpers ─── */
  const setF = useCallback(<K extends keyof CF>(k: K, v: CF[K]) =>
    setForm(f => ({ ...f, [k]: v })), []);

  const setBF = useCallback(<K extends keyof BF>(idx: number, k: K, v: BF[K]) =>
    setForm(f => ({ ...f, bundleCards: f.bundleCards.map((b, i) => i === idx ? { ...b, [k]: v } : b) })), []);

  function openNew() {
    setEditId(null);
    setForm(emptyCF());
    setPreviews({});
    setFormErrors([]);
    setPsaManual(null);
    setView('form');
  }

  function openEdit(card: TradingCard) {
    setEditId(card.id);
    setForm(cardToCF(card));
    setPreviews({});
    setFormErrors([]);
    setPsaManual(null);
    setView('form');
  }

  /* ─── Image upload ─── */
  async function uploadFile(file: File, side: string, cardId: string): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('cardId', cardId);
    fd.append('side', side);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const { path, error } = await res.json();
    if (error) throw new Error(error);
    return path as string;
  }

  function makeImageHandler(
    side: string,
    setter: (path: string) => void,
  ) {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      setPreviews(p => ({ ...p, [side]: preview }));
      setUploading(u => ({ ...u, [side]: true }));
      try {
        const path = await uploadFile(file, side, form.id);
        setter(path);
      } catch (err) {
        setDataError(String(err));
      } finally {
        setUploading(u => ({ ...u, [side]: false }));
      }
    };
  }

  /* ─── PSA image fetch ─── */
  async function fetchPsaImages(
    certNumber: string,
    target: 'main' | `bundle-${number}`,
  ) {
    if (!certNumber.trim()) {
      setDataError('Enter a PSA cert number first');
      setTimeout(() => setDataError(''), 3000);
      return;
    }
    setFetchingPsa(target);
    try {
      const res = await fetch('/api/admin/psa-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certNumber: certNumber.trim(), cardId: form.id }),
      });
      const data = await res.json();

      // If blocked by PSA, show manual paste panel
      if (res.status === 403 || data.error === 'blocked') {
        setPsaManual({ target, frontUrl: '', backUrl: '' });
        return;
      }
      if (!res.ok) throw new Error(data.message || data.error || 'Fetch failed');

      applyPsaResult(data, target);
      setSaveMsg('PSA images fetched ✓');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setDataError(String(e));
      setTimeout(() => setDataError(''), 5000);
    } finally {
      setFetchingPsa(null);
    }
  }

  /** Download images from manually pasted URLs */
  async function downloadPsaUrls() {
    if (!psaManual) return;
    const urls = [psaManual.frontUrl, psaManual.backUrl].filter(u => u.trim());
    if (urls.length === 0) {
      setDataError('Paste at least the front image URL');
      setTimeout(() => setDataError(''), 3000);
      return;
    }
    const target = psaManual.target as 'main' | `bundle-${number}`;
    setFetchingPsa(target);
    try {
      const res = await fetch('/api/admin/psa-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: form.id, urls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Download failed');

      applyPsaResult(data, target);
      setPsaManual(null);
      setSaveMsg('PSA images downloaded ✓');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setDataError(String(e));
      setTimeout(() => setDataError(''), 5000);
    } finally {
      setFetchingPsa(null);
    }
  }

  function applyPsaResult(data: { front?: string; back?: string }, target: string) {
    if (target === 'main') {
      if (data.front) setF('image', data.front);
      if (data.back) setF('imageBack', data.back);
    } else {
      const idx = parseInt(target.split('-')[1], 10);
      if (data.front) setBF(idx, 'image', data.front);
      if (data.back) setBF(idx, 'imageBack', data.back);
    }
  }

  /* ─── Save ─── */
  function validateForm(): string[] {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Card name is required');
    if (!form.price || isNaN(+form.price)) errs.push('Valid price is required');
    if (!form.year || isNaN(+form.year)) errs.push('Valid year is required');
    if (!form.grade || isNaN(+form.grade)) errs.push('Valid grade is required');
    if (form.isBundle && form.bundleCards.length === 0) errs.push('Bundle must have at least one card');
    if (form.isBundle) {
      form.bundleCards.forEach((b, i) => {
        if (!b.name.trim()) errs.push(`Bundle card ${i + 1}: name is required`);
        if (!b.image) errs.push(`Bundle card ${i + 1}: front image is required`);
      });
    }
    return errs;
  }

  async function handleSave() {
    const errs = validateForm();
    if (errs.length) { setFormErrors(errs); return; }
    setFormErrors([]);
    const card = cfToCard(form);
    const updated = editId
      ? cards.map(c => c.id === editId ? card : c)
      : [...cards, card];
    await persist(updated, editId ? 'Card updated ✓' : 'Card added ✓');
    setView('list');
  }

  /* ─── Delete ─── */
  async function handleDelete() {
    if (!deleteId) return;
    await persist(cards.filter(c => c.id !== deleteId), 'Card deleted ✓');
    setDeleteId(null);
  }

  /* ─── Toggle sold ─── */
  async function toggleSold(card: TradingCard) {
    const now = new Date().toISOString();
    await persist(
      cards.map(c => c.id === card.id ? { ...c, sold: !c.sold, updatedAt: now } : c),
      card.sold ? 'Marked available ✓' : 'Marked as sold ✓',
    );
  }

  /* ════════════════════════════════════════════════════════════
     PASSWORD GATE
     ════════════════════════════════════════════════════════════ */
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#09090f] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/25 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#d4a843]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base">Card Admin</h1>
              <p className="text-white/30 text-xs">Enter password to manage inventory</p>
            </div>
          </div>
          <div className="relative mb-4">
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`${inp} pr-10 ${authErr ? 'border-red-500/50 text-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {authErr && <p className="text-red-400 text-xs mb-3 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" />Incorrect password</p>}
          <button type="submit" className="w-full py-2.5 rounded-xl bg-[#d4a843] text-[#09090f] text-sm font-bold hover:bg-[#e5bc5a] transition-colors">
            Unlock
          </button>
          <p className="text-white/15 text-[10px] text-center mt-4">
            Only works in development mode (npm run dev)
          </p>
        </form>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     FORM VIEW
     ════════════════════════════════════════════════════════════ */
  if (view === 'form') {
    return (
      <div className="min-h-screen bg-[#09090f]">
        {/* Header */}
        <div className="sticky top-16 md:top-20 z-20 bg-[#09090f]/95 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to list</span>
            </button>
            <h2 className="text-white font-semibold text-sm">
              {editId ? 'Edit Card' : 'Add New Card'}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setView('list')} className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white text-xs transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] text-xs font-bold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving…' : 'Save Card'}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Validation errors */}
          {formErrors.length > 0 && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/25 p-4">
              <p className="text-red-400 text-xs font-bold mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />Please fix the following:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {formErrors.map((e, i) => <li key={i} className="text-red-400/80 text-xs">{e}</li>)}
              </ul>
            </div>
          )}

          {/* ID (read-only for existing cards) */}
          <div className="mb-7 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className={lbl}>Card ID (UUID)</p>
            <p className="text-white/30 text-xs font-mono break-all">{form.id}</p>
            <p className="text-white/15 text-[10px] mt-1">This becomes the URL: /business/card-trading/{form.id}/</p>
            {editId && (
              <div className="flex gap-4 mt-2 pt-2 border-t border-white/[0.04]">
                {form.createdAt && (
                  <div>
                    <p className={lbl}>Created</p>
                    <p className="text-white/25 text-[10px]">{new Date(form.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── BASIC INFO ── */}
          <Section title="Basic Info">
            <div className="space-y-3">
              <div>
                <label className={lbl}>Card Name *</label>
                <input className={inp} value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Charizard VMAX" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={lbl}>Year *</label>
                  <input className={inp} type="number" min="1996" max="2099" value={form.year} onChange={e => setF('year', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={lbl}>Set Name</label>
                  <input className={inp} value={form.set} onChange={e => setF('set', e.target.value)} placeholder="e.g. Obsidian Flames" />
                </div>
                <div>
                  <label className={lbl}>Card Number</label>
                  <input className={inp} value={form.number} onChange={e => setF('number', e.target.value)} placeholder="e.g. 211/197" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Language</label>
                  <select className={inp} value={form.language} onChange={e => setF('language', e.target.value)}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Currency *</label>
                  <select className={inp} value={form.currency} onChange={e => setF('currency', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={lbl}>Notes <span className="text-white/20 font-normal normal-case tracking-normal">(internal — not shown publicly)</span></label>
                <textarea
                  className={`${inp} resize-none`} rows={3}
                  value={form.notes} onChange={e => setF('notes', e.target.value)}
                  placeholder="Internal seller notes, trade terms, condition remarks…"
                />
              </div>
            </div>
          </Section>

          {/* ── GRADING ── */}
          <Section title="Grading">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {COMPANIES.map(co => (
                  <button key={co} type="button"
                    onClick={() => setF('company', co)}
                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${form.company === co
                      ? co === 'PSA' ? 'bg-red-700/80 border-red-600 text-white'
                        : co === 'BGS' ? 'bg-blue-700/80 border-blue-600 text-white'
                        : 'bg-purple-700/80 border-purple-600 text-white'
                      : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70'
                    }`}
                  >{co}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Grade *</label>
                  <input className={inp} type="number" min="1" max="10" step="0.5" value={form.grade} onChange={e => setF('grade', e.target.value)} placeholder="10" />
                </div>
                <div>
                  <label className={lbl}>Cert / Slab Number</label>
                  <div className="flex gap-1.5">
                    <input className={`${inp} flex-1`} value={form.certNumber} onChange={e => setF('certNumber', e.target.value)} placeholder="e.g. 82345678" />
                    {form.company === 'PSA' && form.certNumber.trim() && (
                      <button
                        type="button"
                        disabled={fetchingPsa === 'main'}
                        onClick={() => fetchPsaImages(form.certNumber, 'main')}
                        title="Fetch front & back images from PSA"
                        className="flex items-center gap-1.5 px-3 rounded-lg border border-red-700/40 bg-red-700/15 text-red-300 hover:bg-red-700/30 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        {fetchingPsa === 'main'
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Download className="w-3.5 h-3.5" />
                        }
                        PSA
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* PSA Manual Paste Panel (shown when auto-fetch is blocked) */}
              {psaManual && psaManual.target === 'main' && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-300 text-xs font-semibold">PSA blocked automatic fetch</p>
                        <p className="text-white/40 text-[10px] mt-0.5 leading-relaxed">
                          Open the cert page below, right-click each card image → <strong className="text-white/60">Copy image address</strong>, then paste below.
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setPsaManual(null)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <a
                    href={`https://www.psacard.com/cert/${form.certNumber}/psa`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700/20 border border-red-700/30 text-red-300 hover:bg-red-700/30 text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open PSA Cert #{form.certNumber}
                  </a>

                  <div className="space-y-2">
                    <div>
                      <label className={lbl}>Front Image URL *</label>
                      <div className="flex gap-1.5">
                        <input
                          className={`${inp} flex-1`}
                          placeholder="https://d1htnxwo4o0jhw.cloudfront.net/cert/…/…jpg"
                          value={psaManual.frontUrl}
                          onChange={e => setPsaManual(p => p ? { ...p, frontUrl: e.target.value } : p)}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              setPsaManual(p => p ? { ...p, frontUrl: text } : p);
                            } catch { /* clipboard blocked */ }
                          }}
                          title="Paste from clipboard"
                          className="px-2 rounded-lg border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                        >
                          <Clipboard className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Back Image URL <span className="text-white/20 font-normal normal-case tracking-normal">(optional)</span></label>
                      <div className="flex gap-1.5">
                        <input
                          className={`${inp} flex-1`}
                          placeholder="https://d1htnxwo4o0jhw.cloudfront.net/cert/…/…jpg"
                          value={psaManual.backUrl}
                          onChange={e => setPsaManual(p => p ? { ...p, backUrl: e.target.value } : p)}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              setPsaManual(p => p ? { ...p, backUrl: text } : p);
                            } catch { /* clipboard blocked */ }
                          }}
                          title="Paste from clipboard"
                          className="px-2 rounded-lg border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                        >
                          <Clipboard className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!psaManual.frontUrl.trim() || fetchingPsa === 'main'}
                    onClick={downloadPsaUrls}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4a843]/20 border border-[#d4a843]/30 text-[#d4a843] hover:bg-[#d4a843]/30 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    {fetchingPsa === 'main'
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Download className="w-3.5 h-3.5" />
                    }
                    Download & Save Images
                  </button>
                </div>
              )}

              <Toggle value={form.isBlackLabel} onChange={v => setF('isBlackLabel', v)} label="PSA Black Label (perfect sub-grades)" />
            </div>
          </Section>

          {/* ── PRICING & STATUS ── */}
          <Section title="Pricing & Status">
            <div className="space-y-3">
              <div>
                <label className={lbl}>Price * ({form.currency})</label>
                <input className={inp} type="number" min="0" value={form.price} onChange={e => setF('price', e.target.value)} placeholder="e.g. 18000" />
              </div>
              <Toggle value={form.sold} onChange={v => setF('sold', v)} label="Mark as Sold (disables WhatsApp CTA, shows sold ribbon)" />
            </div>
          </Section>

          {/* ── IMAGES ── */}
          <Section title="Card Images">
            <p className="text-white/30 text-xs mb-4">
              Images are saved to <code className="text-white/50 bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">public/images/trade/{form.id}/</code>
            </p>
            <div className="flex gap-6">
              <ImageField
                label="Front *"
                path={form.image}
                preview={previews['front']}
                uploading={uploading['front']}
                onFile={makeImageHandler('front', p => setF('image', p))}
              />
              <ImageField
                label="Back (enables flip)"
                path={form.imageBack}
                preview={previews['back']}
                uploading={uploading['back']}
                onFile={makeImageHandler('back', p => setF('imageBack', p))}
              />
            </div>
          </Section>

          {/* ── BUNDLE / SET ── */}
          <Section title="Bundle / Set">
            <Toggle
              value={form.isBundle}
              onChange={v => setF('isBundle', v)}
              label="List as a Bundle / Complete Set (multiple cards sold together)"
            />
            {form.isBundle && (
              <div className="mt-4 space-y-4">
                <p className="text-white/30 text-xs">
                  The price above is the total set price. Add each card in the set below.
                </p>
                {form.bundleCards.map((b, idx) => (
                  <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white/50 text-xs font-semibold">Card #{idx + 1}</p>
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, bundleCards: f.bundleCards.filter((_, i) => i !== idx) }))}
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className={lbl}>Card Name *</label>
                      <input className={inp} value={b.name} onChange={e => setBF(idx, 'name', e.target.value)} placeholder="e.g. Jolteon VMAX" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className={lbl}>Year</label>
                        <input className={inp} type="number" min="1996" max="2099" value={b.year} onChange={e => setBF(idx, 'year', e.target.value)} placeholder={String(new Date().getFullYear())} />
                      </div>
                      <div className="col-span-2">
                        <label className={lbl}>Set Name</label>
                        <input className={inp} value={b.set} onChange={e => setBF(idx, 'set', e.target.value)} placeholder="e.g. Obsidian Flames" />
                      </div>
                      <div>
                        <label className={lbl}>Card Number</label>
                        <input className={inp} value={b.number} onChange={e => setBF(idx, 'number', e.target.value)} placeholder="e.g. 211/197" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {COMPANIES.map(co => (
                        <button key={co} type="button"
                          onClick={() => setBF(idx, 'company', co)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${b.company === co
                            ? co === 'PSA' ? 'bg-red-700/80 border-red-600 text-white'
                              : co === 'BGS' ? 'bg-blue-700/80 border-blue-600 text-white'
                              : 'bg-purple-700/80 border-purple-600 text-white'
                            : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70'
                          }`}
                        >{co}</button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>Grade *</label>
                        <input className={inp} type="number" min="1" max="10" step="0.5" value={b.grade} onChange={e => setBF(idx, 'grade', e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Cert #</label>
                        <div className="flex gap-1.5">
                          <input className={`${inp} flex-1`} value={b.certNumber} onChange={e => setBF(idx, 'certNumber', e.target.value)} placeholder="e.g. 22222222" />
                          {b.company === 'PSA' && b.certNumber.trim() && (
                            <button
                              type="button"
                              disabled={fetchingPsa === `bundle-${idx}`}
                              onClick={() => fetchPsaImages(b.certNumber, `bundle-${idx}`)}
                              title="Fetch images from PSA"
                              className="flex items-center gap-1 px-2.5 rounded-lg border border-red-700/40 bg-red-700/15 text-red-300 hover:bg-red-700/30 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                              {fetchingPsa === `bundle-${idx}`
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Download className="w-3 h-3" />
                              }
                              PSA
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <Toggle value={b.isBlackLabel} onChange={v => setBF(idx, 'isBlackLabel', v)} label="Black Label" />

                    <div className="flex gap-4 pt-1">
                      <ImageField
                        label="Front *"
                        path={b.image}
                        preview={previews[`b${idx}-front`]}
                        uploading={uploading[`b${idx}-front`]}
                        onFile={makeImageHandler(`bundle-${idx}-front`, p => setBF(idx, 'image', p))}
                      />
                      <ImageField
                        label="Back"
                        path={b.imageBack ?? ''}
                        preview={previews[`b${idx}-back`]}
                        uploading={uploading[`b${idx}-back`]}
                        onFile={makeImageHandler(`bundle-${idx}-back`, p => setBF(idx, 'imageBack', p))}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, bundleCards: [...f.bundleCards, emptyBF()] }))}
                  className="flex items-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-white/10 hover:border-[#d4a843]/30 text-white/30 hover:text-[#d4a843] text-xs font-medium transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />Add Card to Bundle
                </button>
              </div>
            )}
          </Section>

          {/* Footer actions (also at bottom for long forms) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button onClick={() => setView('list')} className="px-4 py-2 rounded-lg text-white/40 hover:text-white text-sm transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#d4a843] hover:bg-[#e5bc5a] text-[#09090f] text-sm font-bold transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : (editId ? 'Update Card' : 'Add Card')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     LIST VIEW
     ════════════════════════════════════════════════════════════ */
  const available = cards.filter(c => !c.sold).length;
  const sold = cards.filter(c => c.sold).length;

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Header */}
      <div className="sticky top-16 md:top-20 z-20 bg-[#09090f]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-bold text-sm">Card Inventory Admin</h1>
            <a href="/business/card-trading/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-white/25 hover:text-[#d4a843] text-[10px] transition-colors">
              <ExternalLink className="w-3 h-3" />View Store
            </a>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                <Check className="w-3.5 h-3.5" />{saveMsg}
              </span>
            )}
            <button onClick={load} disabled={loading} className="p-1.5 rounded-lg text-white/30 hover:text-white transition-colors disabled:opacity-40">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4a843] text-[#09090f] text-xs font-bold hover:bg-[#e5bc5a] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />Add Card
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total', value: cards.length, color: 'text-white' },
            { label: 'Available', value: available, color: 'text-emerald-400' },
            { label: 'Sold', value: sold, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {dataError && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/25 p-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-sm font-medium">Error</p>
              <p className="text-red-400/70 text-xs mt-0.5">{dataError}</p>
              <p className="text-white/30 text-[10px] mt-1">Saving requires <code className="text-white/50">npm run dev</code> — the write API is unavailable in static export.</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-white/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading cards…</span>
          </div>
        )}

        {/* Card table */}
        {!loading && cards.length > 0 && (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[72px_1fr_140px_100px_80px_80px] gap-3 items-center px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Image</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Card</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Grade</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Price</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Status</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Actions</p>
            </div>

            {/* Rows */}
            {cards.map((card, i) => {
              const isBundle = !!(card.bundleCards?.length);
              const imgSrc = card.image || card.bundleCards?.[0]?.image || '';
              const isDeleting = deleteId === card.id;
              return (
                <div key={card.id} className={`border-b border-white/[0.04] last:border-b-0 transition-colors ${isDeleting ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'}`}>
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[72px_1fr_140px_100px_80px_80px] gap-3 items-center px-4 py-3">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-16 rounded-md overflow-hidden bg-white/[0.03] border border-white/[0.06] flex-shrink-0">
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc.replace('/images/', '/images-optimized/')}
                          alt={card.name}
                          className={`w-full h-full object-contain p-0.5 ${card.sold ? 'opacity-30 grayscale' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white/10" />
                        </div>
                      )}
                      {card.sold && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShieldOff className="w-4 h-4 text-red-400/70" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className={`text-sm font-medium truncate ${card.sold ? 'text-white/30 line-through' : 'text-white'}`}>{card.name}</p>
                        {isBundle && <Layers className="w-3 h-3 text-[#d4a843] flex-shrink-0" />}
                      </div>
                      <p className="text-white/25 text-[10px] truncate">
                        {card.year}{card.set ? ` · ${card.set}` : ''}
                        {card.updatedAt && (
                          <span className="ml-1.5 text-white/15">
                            · updated {new Date(card.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </span>
                        )}
                        {!card.updatedAt && card.createdAt && (
                          <span className="ml-1.5 text-white/15">
                            · added {new Date(card.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Grade */}
                    <div>
                      <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                    </div>

                    {/* Price */}
                    <p className={`text-sm font-bold ${card.sold ? 'text-white/25 line-through' : 'text-[#d4a843]'}`}>
                      {card.currency} {card.price.toLocaleString()}
                    </p>

                    {/* Sold toggle */}
                    <button
                      onClick={() => toggleSold(card)}
                      disabled={saving}
                      className={`text-[9px] font-bold px-2 py-1 rounded-md border transition-all ${
                        card.sold
                          ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
                          : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                      } uppercase tracking-wider disabled:opacity-40`}
                      title={card.sold ? 'Click to mark available' : 'Click to mark sold'}
                    >
                      {card.sold ? 'Sold' : 'Available'}
                    </button>

                    {/* Actions */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1">
                        <button onClick={handleDelete} disabled={saving} className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-40">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(null)} className="p-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-white/40 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(card)} className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(card.id)} className="p-1.5 rounded bg-white/[0.04] hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <a href={`/business/card-trading/${card.id}/`} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-[#d4a843] transition-colors" title="Preview">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Bundle sub-card rows */}
                  {isBundle && card.bundleCards && card.bundleCards.length > 0 && (
                    <div className="border-t border-white/[0.03]">
                      {/* main card as first row */}
                      {[{ name: card.name, company: card.company, grade: card.grade, isBlackLabel: card.isBlackLabel, set: card.set, number: card.number }, ...card.bundleCards].map((bc, idx) => (
                        <div key={idx} className="hidden sm:flex items-center gap-3 pl-[88px] pr-4 py-1.5 border-b border-white/[0.03] last:border-b-0 bg-white/[0.01]">
                          <span className="text-white/15 text-[9px] font-mono w-3 text-center flex-shrink-0">{idx + 1}</span>
                          <span className="text-white/40 text-[10px] flex-1 truncate">{bc.name}</span>
                          {(bc.set || bc.number) && (
                            <span className="text-white/20 text-[9px] truncate max-w-[160px]">{[bc.set, bc.number].filter(Boolean).join(' · ')}</span>
                          )}
                          <GradePill company={bc.company} grade={bc.grade} isBlackLabel={bc.isBlackLabel} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mobile row */}
                  <div className="sm:hidden flex items-center gap-3 px-4 py-3">
                    <div className="relative w-10 h-14 rounded bg-white/[0.03] border border-white/[0.06] flex-shrink-0 overflow-hidden">
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc.replace('/images/', '/images-optimized/')} alt="" className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <ImageIcon className="w-3 h-3 text-white/10 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${card.sold ? 'text-white/30 line-through' : 'text-white'}`}>{card.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <GradePill company={card.company} grade={card.grade} isBlackLabel={card.isBlackLabel} />
                        <span className={`text-xs font-bold ${card.sold ? 'text-white/25 line-through' : 'text-[#d4a843]'}`}>
                          {card.currency} {card.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(card)} className="p-1.5 rounded bg-white/[0.04] text-white/40 hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(card.id)} className="p-1.5 rounded bg-white/[0.04] text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirm (mobile) */}
                  {isDeleting && (
                    <div className="sm:hidden flex items-center gap-2 px-4 pb-3">
                      <p className="text-red-400 text-xs flex-1">Delete &ldquo;{card.name}&rdquo;?</p>
                      <button onClick={handleDelete} disabled={saving} className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">Confirm</button>
                      <button onClick={() => setDeleteId(null)} className="px-3 py-1 rounded bg-white/[0.06] text-white/40 text-xs">Cancel</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && cards.length === 0 && !dataError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
              <Layers className="w-7 h-7 text-white/15" />
            </div>
            <p className="text-white/30 text-sm mb-1">No cards yet</p>
            <p className="text-white/15 text-xs mb-6">Add your first card to get started</p>
            <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#d4a843] text-sm font-medium hover:bg-[#d4a843]/25 transition-all">
              <Plus className="w-4 h-4" />Add First Card
            </button>
          </div>
        )}

        <p className="text-white/10 text-[10px] text-center mt-8">
          Admin panel · dev mode only · not indexed by search engines
        </p>
      </div>
    </div>
  );
}
