'use client';

import React, { useCallback, useState } from 'react';
import { Download, Link2, Loader2, Share2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import type { CollectorCard } from '@/app/collection/types';
import type { MemberLevel } from '@/app/collection/components/shared';
import { getMembershipFeatures } from '@/lib/collection/membership';
import {
  buildFacebookShareUrl,
  buildPortfolioShareMessage,
  buildPublicPortfolioUrl,
  buildWhatsAppShareUrl,
  copyTextToClipboard,
  shareViaWebApi,
} from '@/lib/collection/portfolioShare';
import {
  cardsToCollageInput,
  downloadBlob,
  generatePortfolioCollage,
} from '@/lib/collection/portfolioCollage';

interface PortfolioShareToolbarProps {
  portfolioId: string;
  portfolioName: string;
  isPublicForSale: boolean;
  cards: CollectorCard[];
  memberLevel?: MemberLevel;
  ownerName?: string;
}

export function PortfolioShareToolbar({
  portfolioId,
  portfolioName,
  isPublicForSale,
  cards,
  memberLevel,
  ownerName,
}: PortfolioShareToolbarProps) {
  const { t, language } = useLanguage();
  const features = getMembershipFeatures(memberLevel);
  const [linkCopied, setLinkCopied] = useState(false);
  const [collageLoading, setCollageLoading] = useState(false);
  const [collageError, setCollageError] = useState<string | null>(null);

  const activeCount = cards.filter(c => !c.sold).length;
  const shareUrl = buildPublicPortfolioUrl(portfolioId, language);
  const shareMessage = buildPortfolioShareMessage({
    portfolioName,
    activeCount,
    url: shareUrl,
    ownerName,
  });

  const flashCopied = useCallback(() => {
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (await copyTextToClipboard(shareUrl)) flashCopied();
  }, [shareUrl, flashCopied]);

  const handleFacebook = useCallback(() => {
    window.open(buildFacebookShareUrl(shareUrl), '_blank', 'noopener,noreferrer,width=600,height=400');
  }, [shareUrl]);

  const handleWhatsApp = useCallback(() => {
    window.open(buildWhatsAppShareUrl(shareMessage), '_blank', 'noopener,noreferrer');
  }, [shareMessage]);

  const handleNativeShare = useCallback(async () => {
    const ok = await shareViaWebApi({
      title: portfolioName,
      text: shareMessage,
      url: shareUrl,
    });
    if (!ok) await handleCopyLink();
  }, [portfolioName, shareMessage, shareUrl, handleCopyLink]);

  const handleDownloadCollage = useCallback(async () => {
    if (features.collageExport === 'none') return;
    setCollageLoading(true);
    setCollageError(null);
    try {
      const blob = await generatePortfolioCollage(cardsToCollageInput(cards), {
        portfolioName,
        ownerName,
        portfolioUrl: shareUrl,
        activeOnly: true,
        watermark: features.collageExport,
      });
      if (!blob) {
        setCollageError(t.collection.wts.collageEmpty);
        return;
      }
      const slug = portfolioName.replace(/[^\w\-]+/g, '-').slice(0, 40);
      downloadBlob(blob, `${slug || 'portfolio'}-for-sale.png`);
    } catch {
      setCollageError(t.collection.wts.collageFailed);
    } finally {
      setCollageLoading(false);
    }
  }, [cards, features.collageExport, ownerName, portfolioName, shareUrl, t.collection.wts]);

  if (!isPublicForSale) return null;

  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border-default">
      <p className="collection-toolbar__label-text">
        {t.collection.wts.shareLabel}
      </p>

      <div className="collection-action-pills" role="group" aria-label={t.collection.wts.shareLabel}>
        <button
          type="button"
          onClick={handleCopyLink}
          className={`collection-action-pill ${linkCopied ? 'collection-action-pill--success' : ''}`}
          aria-pressed={linkCopied}
        >
          <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {linkCopied ? t.collection.portfolio.linkCopied : t.collection.portfolio.shareLink}
        </button>

        {features.shareButtons ? (
          <>
            <button type="button" onClick={handleFacebook} className="collection-action-pill" aria-label={t.collection.wts.shareFacebook}>
              <FontAwesomeIcon icon={faFacebook} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {t.collection.wts.shareFacebook}
            </button>
            <button type="button" onClick={handleWhatsApp} className="collection-action-pill" aria-label={t.collection.wts.shareWhatsApp}>
              <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {t.collection.wts.shareWhatsApp}
            </button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button type="button" onClick={handleNativeShare} className="collection-action-pill" aria-label={t.collection.wts.shareNative}>
                <Share2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {t.collection.wts.shareNative}
              </button>
            )}
          </>
        ) : (
          <p className="text-text-muted text-xs self-center px-1 min-h-[2.75rem] flex items-center">{t.collection.wts.upgradeForShare}</p>
        )}

        {features.collageExport !== 'none' && (
          <button
            type="button"
            onClick={handleDownloadCollage}
            disabled={collageLoading || cards.length === 0}
            className="collection-action-pill"
            aria-label={features.collageExport === 'watermarked'
              ? t.collection.wts.downloadCollageWatermarked
              : t.collection.wts.downloadCollage}
          >
            {collageLoading ? (
              <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
            {features.collageExport === 'watermarked'
              ? t.collection.wts.downloadCollageWatermarked
              : t.collection.wts.downloadCollage}
          </button>
        )}
      </div>

      {collageError && (
        <p className="text-accent-danger text-xs" role="alert">{collageError}</p>
      )}

      {features.contactOnPublic && (
        <LocalLink href="/collection/settings/" className="collection-action-pill w-fit">
          {t.collection.settings.manageContact}
        </LocalLink>
      )}
    </div>
  );
}
