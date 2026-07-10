'use client';

import React from 'react';
import { Globe, Lock, Package } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';

export function PublicPortfolioNotFound() {
  const { t, language } = useLanguage();

  useSubHeader({
    leading: (
      <>
        <Lock className="w-3.5 h-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
        <h1 className="text-text-primary font-semibold text-xs sm:text-sm">
          {language === 'zh' ? '無法查看組合' : 'Portfolio unavailable'}
        </h1>
      </>
    ),
  });

  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip">
      <div className="workspace-canvas container-tool py-6">
        <div className="flex flex-col items-center justify-center py-20 text-center panel max-w-md mx-auto">
          <div className="w-14 h-14 border border-border-strong flex items-center justify-center mb-4 bg-surface-raised">
            <Package className="w-6 h-6 text-text-muted" aria-hidden="true" />
          </div>
          <p className="text-text-secondary text-sm mb-1">
            {language === 'zh'
              ? '找不到這個組合，或它已設為私人。'
              : 'This portfolio was not found or is no longer public.'}
          </p>
          <p className="text-text-muted text-xs mb-6">
            {language === 'zh'
              ? '請向擁有者確認連結是否正確，或組合是否已公開分享。'
              : 'Check the link with the owner, or ask them to enable public sharing.'}
          </p>
          <LocalLink href="/collection/" className="btn btn-secondary min-h-11">
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            {t.collection.openCollection}
          </LocalLink>
        </div>
      </div>
    </div>
  );
}

export function PublicPortfolioError({ message }: { message: string }) {
  const { language } = useLanguage();
  return (
    <div className="min-h-dvh bg-surface-bg flex items-center justify-center p-4">
      <div className="panel p-6 max-w-md text-center">
        <p className="text-accent-danger text-sm mb-2">
          {language === 'zh' ? '無法載入組合' : 'Could not load portfolio'}
        </p>
        <p className="text-text-muted text-xs">{message}</p>
      </div>
    </div>
  );
}
