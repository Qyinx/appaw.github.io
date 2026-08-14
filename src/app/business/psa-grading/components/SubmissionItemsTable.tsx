'use client';

import React, { useState } from 'react';
import type { GradingSubmissionItem } from '@/lib/grading/types';
import WorkspaceLightbox, {
  type WorkspaceLightboxImage,
} from '@/components/ui/WorkspaceLightbox';

type TableCopy = {
  title: string;
  description: string;
  certNumber: string;
  grade: string;
  pending: string;
  image?: string;
  viewImage?: string;
  closePreview?: string;
  frontLabel?: string;
  backLabel?: string;
  openCertLookup?: string;
};

type Props = {
  items: GradingSubmissionItem[];
  copy: TableCopy;
  showTitle?: boolean;
  /** When false, hide intake grade until PSA confirms (gradesReady). */
  gradesReady?: boolean;
};

type PreviewState = {
  alt: string;
  images: WorkspaceLightboxImage[];
};

/** PSA seq 1 = front; prefer it for thumbnails. */
function frontImageUrl(item: GradingSubmissionItem): string | null {
  return (
    item.images?.find((img) => img.seq === 1)?.url ??
    item.images?.find((img) => img.seq === 0)?.url ??
    item.images?.[0]?.url ??
    null
  );
}

function labelForSeq(
  seq: number,
  copy: TableCopy,
  index: number,
  total: number,
): string {
  if (seq === 1) return copy.frontLabel ?? 'Front';
  // PSA often uses seq 2 for back; some payloads use seq 0 as the other side.
  if (seq === 2 || seq === 0) {
    if (total === 1) return copy.frontLabel ?? 'Front';
    return copy.backLabel ?? 'Back';
  }
  if (total === 2) {
    return index === 0
      ? (copy.frontLabel ?? 'Front')
      : (copy.backLabel ?? 'Back');
  }
  return `${copy.image ?? 'Image'} ${index + 1}`;
}

function itemLightboxImages(
  item: GradingSubmissionItem,
  copy: TableCopy,
): WorkspaceLightboxImage[] {
  const sorted = [...(item.images ?? [])].sort((a, b) => {
    const rank = (seq: number) => (seq === 1 ? 0 : seq === 2 || seq === 0 ? 1 : seq + 10);
    return rank(a.seq) - rank(b.seq) || a.seq - b.seq;
  });
  return sorted.map((img, index) => {
    const label = labelForSeq(img.seq, copy, index, sorted.length);
    return {
      src: img.url,
      alt: `${item.description} — ${label}`,
      label,
    };
  });
}

function psaCertUrl(certNumber: string): string {
  const cert = certNumber.replace(/\s/g, '');
  return `https://www.psacard.com/cert/${encodeURIComponent(cert)}/psa`;
}

function CertNumberCell({
  certNumber,
  pending,
  openLabelTemplate,
  className = '',
}: {
  certNumber: string | null;
  pending: string;
  openLabelTemplate?: string;
  className?: string;
}) {
  if (!certNumber) {
    return (
      <span className={`font-mono tabular-nums text-text-secondary ${className}`.trim()}>
        {pending}
      </span>
    );
  }

  const ariaLabel = (openLabelTemplate ?? 'Open PSA cert {cert} in a new tab').replace(
    '{cert}',
    certNumber,
  );

  return (
    <a
      href={psaCertUrl(certNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono tabular-nums text-accent-secondary hover:underline inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/50 ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {certNumber}
    </a>
  );
}

function ThumbButton({
  url,
  viewLabel,
  onOpen,
}: {
  url: string;
  viewLabel: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grading-track-thumb group inline-flex items-center justify-center shrink-0 size-14 p-1 border border-border-default bg-surface-raised cursor-pointer transition-[border-color,transform,opacity] duration-150 ease-out hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/50 active:scale-[0.97]"
      aria-label={viewLabel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        width={40}
        height={56}
        className="h-full w-full object-cover pointer-events-none"
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}

function ThumbSlot({
  url,
  viewLabel,
  onOpen,
}: {
  url: string | null;
  viewLabel: string;
  onOpen: () => void;
}) {
  if (url) {
    return <ThumbButton url={url} viewLabel={viewLabel} onOpen={onOpen} />;
  }
  return (
    <div
      className="grading-track-thumb grading-track-thumb--empty shrink-0 size-14 border border-border-default bg-surface-raised inline-flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="text-text-muted text-xs">—</span>
    </div>
  );
}

export default function SubmissionItemsTable({
  items,
  copy,
  showTitle = true,
  gradesReady = true,
}: Props) {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const viewLabelFor = (name: string) =>
    (copy.viewImage ?? 'View image for {name}').replace('{name}', name);

  const openItem = (item: GradingSubmissionItem) => {
    const images = itemLightboxImages(item, copy);
    if (!images.length) return;
    setPreview({ alt: item.description, images });
  };

  return (
    <div>
      {showTitle && (
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">{copy.title}</h3>
      )}

      <ul className="grading-track-item-list">
        {items.map((item) => {
          const url = frontImageUrl(item);
          const displayGrade = gradesReady ? item.grade : null;
          return (
            <li key={item.id} data-result-row className="grading-track-item-card">
              <ThumbSlot
                url={url}
                viewLabel={viewLabelFor(item.description)}
                onOpen={() => openItem(item)}
              />
              <div className="grading-track-item-card__body min-w-0">
                <p className="grading-track-item-card__title text-text-primary font-medium text-sm leading-snug text-pretty">
                  {item.description}
                </p>
                <dl className="grading-track-item-card__specs">
                  <div className="grading-track-item-card__spec">
                    <dt>{copy.certNumber}</dt>
                    <dd>
                      <CertNumberCell
                        certNumber={item.certNumber}
                        pending={copy.pending}
                        openLabelTemplate={copy.openCertLookup}
                        className="min-h-11 py-1"
                      />
                    </dd>
                  </div>
                  <div className="grading-track-item-card__spec">
                    <dt>{copy.grade}</dt>
                    <dd className="font-mono tabular-nums text-text-primary">
                      {displayGrade ?? copy.pending}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          );
        })}
      </ul>

      {preview && (
        <WorkspaceLightbox
          alt={preview.alt}
          images={preview.images}
          onClose={() => setPreview(null)}
          closeLabel={copy.closePreview ?? 'Close preview'}
        />
      )}
    </div>
  );
}
