'use client';

import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Package, LogIn, TrendingUp, Shield, ScanLine,
  DollarSign, ArrowRight, Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ICONS = [Package, TrendingUp, Shield, ScanLine, DollarSign, ArrowRight];

export default function CollectionLandingClient() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { t } = useLanguage();

  const rawTitle = t.collection.title ?? '';
  const hasSpace = rawTitle.includes(' ');
  let titleFirst = rawTitle;
  let titleRest = '';
  if (hasSpace) {
    const parts = rawTitle.split(' ');
    titleFirst = parts[0];
    titleRest = parts.slice(1).join(' ');
  } else if (rawTitle.length > 1) {
    titleFirst = rawTitle.slice(0, 2);
    titleRest = rawTitle.slice(2);
  }

  function goToAuth() {
    if (isAuthenticated) {
      window.location.href = '/collection/list';
    } else {
      loginWithRedirect({ appState: { returnTo: '/collection/list' } });
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e2e]">
      {/* ── Hero ── */}
      <section className="relative py-28 md:py-36 overflow-hidden border-b border-white/[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(155,126,191,0.07),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B7EBF]/40 to-transparent" />

        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.06] tracking-tight mb-6">
            {hasSpace ? (
              <>
                {titleFirst} <span className="text-[#9B7EBF]">{titleRest}</span>
              </>
            ) : (
              <>
                {titleFirst}{titleRest && <span className="text-[#9B7EBF]">{titleRest}</span>}
              </>
            )}
          </h1>
          <p className="text-[#6b7280] text-lg max-w-lg mx-auto leading-relaxed mb-10">
            {t.collection.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToAuth}
              disabled={isLoading}
              className="inline-flex items-center gap-3 bg-[#9B7EBF] hover:bg-[#AF97D3] disabled:opacity-50 text-[#1e1e2e] font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(155,126,191,0.3)] active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAuthenticated ? (
                <>
                  <Package className="w-4 h-4" />
                  {t.collection.openCollection}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t.collection.signIn}
                </>
              )}
            </button>

            {!isAuthenticated && !isLoading && (
              <Link
                href="/collection/auth"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                {t.collection.learnAboutSignIn}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.collection.features.map(({ title, body }, idx) => {
              const Icon = ICONS[idx] ?? Package;
              return (
                <div
                  key={title}
                  className="p-7 border border-white/[0.06] hover:border-[#9B7EBF]/20 hover:bg-[#9B7EBF]/[0.02] transition-all duration-300 rounded-sm"
                >
                  <div className="w-10 h-10 rounded-xl border border-[#9B7EBF]/25 bg-[#9B7EBF]/8 flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-[#9B7EBF]" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="border-t border-white/[0.05] py-16 text-center">
        <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-6">{t.collection.cta.prompt}</p>
        <button
          onClick={goToAuth}
          disabled={isLoading}
          className="inline-flex items-center gap-3 border border-[#9B7EBF]/35 hover:border-[#9B7EBF] hover:bg-[#9B7EBF]/5 text-[#9B7EBF] text-sm uppercase tracking-[0.15em] font-bold px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-40"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {isAuthenticated ? t.collection.openCollection : t.collection.cta.buttonSignIn}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <p className="text-white/40 text-[10px] mt-4">{t.collection.cta.poweredBy}</p>
      </section>
    </div>
  );
}
