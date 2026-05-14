'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faEtsy } from '@fortawesome/free-brands-svg-icons';
import CarousellIcon from './CarousellIcon';

const ETSY_URL      = 'https://appawstore.etsy.com/';
const CAROUSELL_URL = 'https://www.carousell.com.hk/u/appaw.store/';
const WA_BASE       = 'https://wa.me/85292851189';

export interface ShopOptionsLabels {
  buyOnEtsy: string;
  buyOnEtsyDesc: string;
  buyOnCarousell: string;
  buyOnCarousellDesc: string;
  orderWhatsApp: string;
  orderWhatsAppDesc: string;
}

interface ShopNowButtonProps {
  label: string;
  shopOptions: ShopOptionsLabels;
  /** Pre-filled WhatsApp message */
  whatsappMessage?: string;
  /** Tailwind classes applied to the trigger <button> */
  buttonClassName: string;
  /** Size of the chevron icon, default "w-4 h-4" */
  chevronSize?: string;
}

export default function ShopNowButton({
  label,
  shopOptions,
  whatsappMessage,
  buttonClassName,
  chevronSize = 'w-4 h-4',
}: ShopNowButtonProps) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const waUrl = whatsappMessage
    ? `${WA_BASE}?text=${encodeURIComponent(whatsappMessage)}`
    : WA_BASE;

  /* Recompute portal position whenever dropdown opens or window resizes/scrolls */
  const reposition = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: r.bottom + 10,
      left: r.left,
      width: 288,           // w-72
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener('scroll', reposition, { passive: true, capture: true });
    window.addEventListener('resize', reposition, { passive: true });
    return () => {
      window.removeEventListener('scroll', reposition, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', reposition);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      if (
        rootRef.current && !rootRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('[data-shopnow-panel]')
      ) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Panel rendered via portal so no parent overflow/stacking context can clip it */
  const panel = (
    <div
      data-shopnow-panel
      style={dropdownStyle}
      className="bg-[#111116] border border-[#D4899A]/20 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,137,154,0.06)]"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">
          Choose where to buy
        </p>
      </div>

      {/* Etsy */}
      <a
        href={ETSY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.04] transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-[#F1641E]/10 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faEtsy} className="w-4 h-4 text-[#F1641E]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight group-hover:text-[#D4899A] transition-colors">
            {shopOptions.buyOnEtsy}
          </p>
          <p className="text-white/35 text-xs mt-0.5">{shopOptions.buyOnEtsyDesc}</p>
        </div>
      </a>

      {/* Carousell */}
      <a
        href={CAROUSELL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.04] transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-[#FF2636]/10 flex items-center justify-center flex-shrink-0">
          <CarousellIcon className="h-5 w-auto" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight group-hover:text-[#D4899A] transition-colors">
            {shopOptions.buyOnCarousell}
          </p>
          <p className="text-white/35 text-xs mt-0.5">{shopOptions.buyOnCarousellDesc}</p>
        </div>
      </a>

      {/* Divider */}
      <div className="mx-5 border-t border-white/[0.06] my-1" />

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 mb-1 hover:bg-[#25D366]/[0.05] transition-colors group"
      >
        <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight group-hover:text-[#25D366] transition-colors">
            {shopOptions.orderWhatsApp}
          </p>
          <p className="text-white/35 text-xs mt-0.5">{shopOptions.orderWhatsAppDesc}</p>
        </div>
      </a>
    </div>
  );

  return (
    <div ref={rootRef} className="relative inline-flex">

      {/* ── Trigger ── */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className={buttonClassName}
      >
        <span>{label}</span>
        <ChevronDown
          className={`${chevronSize} flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Portal dropdown — escapes all overflow/stacking contexts ── */}
      {open && typeof document !== 'undefined' && createPortal(panel, document.body)}
    </div>
  );
}
