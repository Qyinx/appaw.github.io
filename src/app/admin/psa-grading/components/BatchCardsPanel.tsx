'use client';

import React, { useEffect, useState } from 'react';
import CustomerOrderLink from './CustomerOrderLink';
import { formatHkd } from '@/lib/grading/admin-format';
import { uploadIntakeItemImages, getOpsToken, resolveOpsImageUrl } from '@/lib/grading/admin-api';
import type { AdminItem, AdminItemImage } from '@/lib/grading/admin-types';
import { parseCostInput } from '@/lib/grading/admin-utils';
import { compressImage } from '@/lib/compress-image';

type Props = {
  items: AdminItem[];
  disabled?: boolean;
  onUpdateItem: (itemId: string, patch: Partial<AdminItem>) => void;
  onImagesSaved: (itemId: string, images: AdminItemImage[]) => void;
};

type Side = 'front' | 'back';

const fieldClass =
  'h-8 w-full border border-border-default bg-surface-bg px-2 text-sm text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link';

const headClass =
  'sticky top-0 z-[1] bg-surface-panel px-2 py-1.5 text-left text-xs font-medium text-text-secondary';

const COL_COUNT = 10;

function imageForSeq(images: AdminItemImage[], seq: number): AdminItemImage | undefined {
  return images.find((image) => image.seq === seq);
}

function sideMark(side: Side): string {
  return side === 'front' ? 'F' : 'B';
}

function OpsThumb({ url, label }: { url: string; label: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';
    const token = getOpsToken();
    void fetch(resolveOpsImageUrl(url), {
      headers: token ? { 'X-Ops-Key': token } : {},
    })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (!blob || cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (!src) {
    return <span className="inline-block h-10 w-8 border border-dashed border-border-default bg-surface-raised" />;
  }

  return (
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="block">
      {/* Blob from an ops-authenticated image fetch. next/image cannot load blob: URLs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-10 w-8 border border-border-default object-cover bg-surface-bg" />
    </a>
  );
}

function groupByOrder(items: AdminItem[]) {
  const groups: Array<{
    orderId: number;
    customerName: string;
    phoneNumber: string;
    cards: Array<{ item: AdminItem; seq: number }>;
  }> = [];
  items.forEach((item, index) => {
    let group = groups.find((entry) => entry.orderId === item.customerOrderId);
    if (!group) {
      group = {
        orderId: item.customerOrderId,
        customerName: item.customerName,
        phoneNumber: item.phoneNumber,
        cards: [],
      };
      groups.push(group);
    }
    group.cards.push({ item, seq: index + 1 });
  });
  return groups;
}

export default function BatchCardsPanel({ items, disabled = false, onUpdateItem, onImagesSaved }: Props) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const groups = groupByOrder(items);
  const total = items.reduce((sum, item) => sum + (item.totalCost ?? 0), 0);
  const received = items.reduce((sum, item) => sum + (item.receivedCost ?? 0), 0);

  const addPhoto = async (item: AdminItem, side: Side, file: File) => {
    const key = `${item.id}:${side}`;
    setPhotoError('');
    setBusyKey(key);
    try {
      const compressed = await compressImage(file, 1600, 0.8);
      const images = await uploadIntakeItemImages(item.customerOrderId, item.id, [
        { seq: side === 'back' ? 0 : 1, contentType: compressed.mimeType, data: compressed.base64 },
      ]);
      onImagesSaved(item.id, images);
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyKey(null);
    }
  };

  if (!items.length) {
    return <p className="text-sm text-text-muted">No cards in this batch yet.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-muted">
        Click an empty F or B under Raw to add that photo. Graded photos stay as imported.
      </p>
      {photoError && <p className="text-sm text-accent-danger">{photoError}</p>}
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[60rem] table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className={`${headClass} w-8`}>#</th>
              <th className={headClass}>Card</th>
              <th className={`${headClass} w-28`}>Cert</th>
              <th className={`${headClass} w-32`}>Grade</th>
              <th className={`${headClass} w-24 text-right`}>Total</th>
              <th className={`${headClass} w-24 text-right`}>Received</th>
              <th className={`${headClass} w-12 text-center`}>Paid</th>
              <th className={`${headClass} w-20 text-center`} title="PSA upgraded">
                Upgraded
              </th>
              <th className={`${headClass} w-20`}>
                Raw <span className="font-normal text-text-muted">F·B</span>
              </th>
              <th className={`${headClass} w-20`}>
                Graded <span className="font-normal text-text-muted">F·B</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group.orderId}>
                <tr className={groupIndex === 0 ? undefined : 'border-t border-border-default'}>
                  <td
                    colSpan={COL_COUNT}
                    className={`bg-surface-raised px-2 pb-1 ${groupIndex === 0 ? 'pt-2' : 'pt-3'}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <h3 className="text-sm font-semibold text-text-primary">{group.customerName}</h3>
                      <span className="font-mono text-xs text-text-muted">{group.phoneNumber}</span>
                      <CustomerOrderLink orderId={group.orderId} />
                      <span className="text-xs text-text-muted">{group.cards.length} cards</span>
                    </div>
                  </td>
                </tr>
                {group.cards.map(({ item, seq }) => {
                  const images = item.rawImages ?? [];
                  const graded = item.images ?? [];
                  const name = item.cardName.trim() || `card ${seq}`;
                  return (
                    <tr key={item.id} className="border-b border-border-default/70">
                      <td className="px-2 py-1 font-mono text-xs tabular-nums text-text-muted">{seq}</td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={item.cardName}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { cardName: e.target.value })}
                          aria-label={`Card name ${seq}`}
                          className={fieldClass}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.certNumber ?? ''}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { certNumber: e.target.value || null })}
                          aria-label={`Cert ${name}`}
                          className={`${fieldClass} font-mono`}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={item.grade ?? ''}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { grade: e.target.value || null })}
                          aria-label={`Grade ${name}`}
                          className={`${fieldClass} font-mono`}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={item.totalCost ?? ''}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { totalCost: parseCostInput(e.target.value) })}
                          aria-label={`Total ${name}`}
                          className={`${fieldClass} text-right font-mono`}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          min={0}
                          value={item.receivedCost ?? ''}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { receivedCost: parseCostInput(e.target.value) })}
                          aria-label={`Received ${name}`}
                          className={`${fieldClass} text-right font-mono`}
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={item.isPaid}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { isPaid: e.target.checked })}
                          aria-label={`Paid ${name}`}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={item.psaUpgraded}
                          disabled={disabled}
                          onChange={(e) => onUpdateItem(item.id, { psaUpgraded: e.target.checked })}
                          aria-label={`PSA upgraded ${name}`}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex gap-1">
                          <PhotoSide
                            side="front"
                            image={imageForSeq(images, 1)}
                            busy={busyKey === `${item.id}:front`}
                            disabled={disabled || busyKey !== null}
                            onFile={(file) => void addPhoto(item, 'front', file)}
                          />
                          <PhotoSide
                            side="back"
                            image={imageForSeq(images, 0)}
                            busy={busyKey === `${item.id}:back`}
                            disabled={disabled || busyKey !== null}
                            onFile={(file) => void addPhoto(item, 'back', file)}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex gap-1">
                          <GradedSide side="front" image={imageForSeq(graded, 1)} />
                          <GradedSide side="back" image={imageForSeq(graded, 0)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-default">
              <td colSpan={4} className="sticky bottom-0 bg-surface-panel px-2 py-1.5 text-right text-xs text-text-secondary">
                Batch
              </td>
              <td className="sticky bottom-0 bg-surface-panel px-2 py-1.5 text-right font-mono text-sm tabular-nums text-text-primary">
                {formatHkd(total)}
              </td>
              <td className="sticky bottom-0 bg-surface-panel px-2 py-1.5 text-right font-mono text-sm tabular-nums text-text-primary">
                {formatHkd(received)}
              </td>
              <td colSpan={4} className="sticky bottom-0 bg-surface-panel" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function GradedSide({ side, image }: { side: Side; image?: AdminItemImage }) {
  const label = `Graded ${side}`;
  if (!image?.url) {
    return (
      <span
        role="img"
        aria-label={`No ${label.toLowerCase()}`}
        title={`No ${label.toLowerCase()}`}
        className="inline-block h-10 w-8 border border-dashed border-border-default/70 bg-surface-raised"
      />
    );
  }
  return <OpsThumb url={image.url} label={label} />;
}

function PhotoSide({
  side,
  image,
  busy,
  disabled,
  onFile,
}: {
  side: Side;
  image?: AdminItemImage;
  busy: boolean;
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  const label = `Raw ${side}`;
  if (image?.url) {
    return <OpsThumb url={image.url} label={label} />;
  }

  return (
    <label
      title={busy ? 'Saving…' : `Add ${label.toLowerCase()}`}
      className={`inline-flex h-10 w-8 items-center justify-center border border-dashed border-border-default bg-surface-bg text-xs font-medium text-text-secondary focus-within:ring-2 focus-within:ring-accent-link ${
        disabled ? 'pointer-events-none opacity-45' : 'cursor-pointer hover:border-border-strong hover:bg-surface-raised'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        aria-label={busy ? `Saving ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onFile(file);
        }}
      />
      {busy ? '…' : sideMark(side)}
    </label>
  );
}
