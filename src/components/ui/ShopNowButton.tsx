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
  buttonClassName?: string;
  /** Size of the chevron icon, default "w-4 h-4" */
  chevronSize?: string;
  /** Optional click handler for analytics or custom actions */
  onClick?: () => void;
}

const DEFAULT_BUTTON_CLASS =
  'btn btn-primary inline-flex items-center gap-2';

export default function ShopNowButton({
  label,
  shopOptions,
  whatsappMessage,
  buttonClassName = DEFAULT_BUTTON_CLASS,
  chevronSize = 'w-4 h-4',
  onClick,
}: ShopNowButtonProps) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const waUrl = whatsappMessage
    ? `${WA_BASE}?text=${encodeURIComponent(whatsappMessage)}`
    : WA_BASE;

  const reposition = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const panelWidth = Math.min(288, window.innerWidth - 16);
    setDropdownStyle({
      position: 'fixed',
      top: r.bottom + 10,
      left: Math.max(8, Math.min(r.left, window.innerWidth - panelWidth - 8)),
      width: panelWidth,
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

  const panel = (
    <div
      data-shopnow-panel
      style={dropdownStyle}
      className="panel overflow-hidden shadow-[var(--shadow-panel)] max-w-[calc(100vw-1rem)]"
    >
      <div className="px-5 pt-4 pb-2 border-b border-border-default">
        <p className="text-text-muted text-xs uppercase tracking-[0.2em] font-mono">
          Choose where to buy
        </p>
      </div>

      <a
        href={ETSY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 min-h-11 hover:bg-surface-raised transition-colors group touch-manipulation"
      >
        <div className="w-9 h-9 border border-[#F1641E]/30 bg-[#F1641E]/10 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faEtsy} className="w-4 h-4 text-[#F1641E]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-semibold leading-tight group-hover:text-accent-brand transition-colors">
            {shopOptions.buyOnEtsy}
          </p>
          <p className="text-text-muted text-xs mt-0.5">{shopOptions.buyOnEtsyDesc}</p>
        </div>
      </a>

      <a
        href={CAROUSELL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 min-h-11 hover:bg-surface-raised transition-colors group touch-manipulation"
      >
        <div className="w-9 h-9 border border-[#FF2636]/30 bg-[#FF2636]/10 flex items-center justify-center flex-shrink-0">
          <CarousellIcon className="h-5 w-auto" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-semibold leading-tight group-hover:text-accent-brand transition-colors">
            {shopOptions.buyOnCarousell}
          </p>
          <p className="text-text-muted text-xs mt-0.5">{shopOptions.buyOnCarousellDesc}</p>
        </div>
      </a>

      <div className="mx-5 border-t border-border-default my-1" />

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="flex items-center gap-4 px-5 py-3.5 mb-1 min-h-11 hover:bg-[#25D366]/[0.08] transition-colors group touch-manipulation"
      >
        <div className="w-9 h-9 border border-[#25D366]/30 bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-semibold leading-tight group-hover:text-[#25D366] transition-colors">
            {shopOptions.orderWhatsApp}
          </p>
          <p className="text-text-muted text-xs mt-0.5">{shopOptions.orderWhatsAppDesc}</p>
        </div>
      </a>
    </div>
  );

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          if (typeof onClick === 'function') onClick();
          setOpen(o => !o);
        }}
        className={buttonClassName}
      >
        <span>{label}</span>
        <ChevronDown
          className={`${chevronSize} flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && typeof document !== 'undefined' && createPortal(panel, document.body)}
    </div>
  );
}
