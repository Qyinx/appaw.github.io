'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  createIntake,
  listBatches,
  MIN_CUSTOMER_PHONE_SEARCH,
  readIntakeCard,
  searchCustomersByPhone,
  uploadIntakeItemImages,
} from '@/lib/grading/admin-api';
import type { AdminBatch, AdminGradingCustomer, AdminIntakeItemDraft } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { parseCostInput, sortBatchesByStage } from '@/lib/grading/admin-utils';
import { isValidBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import { formatHkd } from '@/lib/grading/admin-format';
import { getPsaDefaultTotalCost } from '@/lib/grading/psa-pricing';
import { isReholderPlan } from '@/lib/grading/plan-accent';
import { compressImage } from '@/lib/compress-image';
import BatchReferencePicker from '../components/BatchReferencePicker';

const CUSTOMER_SEARCH_DEBOUNCE_MS = 350;
const FLASH_MS = 650;

const fieldClass =
  'w-full border border-border-strong bg-surface-bg px-3 py-2.5 text-sm min-h-[44px] text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-link';

const labelClass = 'text-xs text-text-secondary uppercase tracking-wide block mb-1';

type CardSide = 'front' | 'back';

type CardSidePhoto = {
  previewUrl: string;
  base64: string;
  mimeType: string;
};

type CardPhotos = Record<CardSide, CardSidePhoto | null>;

const emptyPhotos = (): CardPhotos => ({ front: null, back: null });

type IntakeCardDraft = AdminIntakeItemDraft & {
  localId: string;
  front: CardSidePhoto | null;
  back: CardSidePhoto | null;
};

function releasePhoto(photo: CardSidePhoto | null) {
  if (photo) URL.revokeObjectURL(photo.previewUrl);
}

function defaultTotalForBatch(batchReferenceCode: string): number | null {
  const plan = parseServicePlanLabel(batchReferenceCode);
  return plan === '—' ? null : getPsaDefaultTotalCost(plan);
}

function blankDraft(totalCost: number | null): AdminIntakeItemDraft {
  return {
    cardName: '',
    certNumber: null,
    grade: null,
    isPaid: false,
    totalCost,
    receivedCost: null,
    psaUpgraded: false,
  };
}

function namedDraftCard(
  draft: AdminIntakeItemDraft,
  localId: string,
  showCertFields: boolean,
): IntakeCardDraft | null {
  const cardName = draft.cardName.trim();
  if (!cardName) return null;
  return {
    localId,
    cardName,
    certNumber: showCertFields ? draft.certNumber?.trim() || null : null,
    grade: showCertFields ? draft.grade?.trim() || null : null,
    isPaid: draft.isPaid,
    totalCost: draft.totalCost,
    receivedCost: draft.receivedCost,
    psaUpgraded: draft.psaUpgraded,
    front: null,
    back: null,
  };
}

export default function GradingIntakeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchFromQuery = (searchParams.get('batch') ?? '').trim().toUpperCase();
  const [batchReferenceCode, setBatchReferenceCode] = useState(batchFromQuery);
  const [batchOptions, setBatchOptions] = useState<AdminBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerMatches, setCustomerMatches] = useState<AdminGradingCustomer[]>([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchError, setCustomerSearchError] = useState('');
  const [customerSearchAttempted, setCustomerSearchAttempted] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [items, setItems] = useState<IntakeCardDraft[]>([]);
  const [draft, setDraft] = useState<AdminIntakeItemDraft>(() => blankDraft(defaultTotalForBatch(batchFromQuery)));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [flashedId, setFlashedId] = useState<string | null>(null);
  const [flashHot, setFlashHot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<CardPhotos>(emptyPhotos);
  const [photoReading, setPhotoReading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const totalTouchedRef = useRef(false);
  const batchWasValidRef = useRef(isValidBatchReferenceCode(batchFromQuery));
  const appliedPhoneRef = useRef<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const photoInputRefs = useRef<Record<CardSide, HTMLInputElement | null>>({ front: null, back: null });
  const photosRef = useRef(photos);
  const itemsRef = useRef(items);

  const nameId = useId();
  const certId = useId();
  const gradeId = useId();
  const totalId = useId();
  const receivedId = useId();
  const customerNameId = useId();
  const phoneId = useId();
  const photoId = useId();

  const planDefaultTotal = useMemo(
    () => defaultTotalForBatch(batchReferenceCode),
    [batchReferenceCode],
  );

  const showCertFields = useMemo(() => {
    const plan = parseServicePlanLabel(batchReferenceCode);
    return plan !== '—' && isReholderPlan(plan);
  }, [batchReferenceCode]);

  const cardsToSubmit = useMemo(() => {
    const pending = namedDraftCard(draft, editingId ?? 'draft', showCertFields);
    const withPhotos = pending
      ? { ...pending, front: photos.front, back: photos.back }
      : null;
    if (editingId) {
      if (!withPhotos) return [];
      return items.map((card) => (card.localId === editingId ? { ...withPhotos, localId: editingId } : card));
    }
    if (!withPhotos) return items;
    return [...items, withPhotos];
  }, [draft, editingId, items, photos, showCertFields]);

  const totalSum = useMemo(
    () => cardsToSubmit.reduce((sum, card) => sum + (card.totalCost ?? 0), 0),
    [cardsToSubmit],
  );

  const missingReason = useMemo(() => {
    if (!batchReferenceCode.trim()) return 'Choose a batch.';
    if (!isValidBatchReferenceCode(batchReferenceCode)) return 'Enter a valid batch reference.';
    if (!customerName.trim()) return 'Enter the customer name.';
    if (!phoneNumber.trim()) return 'Enter the phone number.';
    if (editingId && !draft.cardName.trim()) return 'Enter the card name.';
    if (cardsToSubmit.length === 0) return 'Enter the card name.';
    return '';
  }, [batchReferenceCode, cardsToSubmit.length, customerName, draft.cardName, editingId, phoneNumber]);

  useEffect(() => {
    let cancelled = false;
    void listBatches()
      .then((batches) => {
        if (!cancelled) setBatchOptions(sortBatchesByStage(batches));
      })
      .catch(() => {
        if (!cancelled) setBatchOptions([]);
      })
      .finally(() => {
        if (!cancelled) setBatchesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isValidBatchReferenceCode(batchFromQuery)) return;
    phoneRef.current?.focus();
  }, [batchFromQuery]);

  useEffect(() => {
    const valid = isValidBatchReferenceCode(batchReferenceCode);
    const becameValid = valid && !batchWasValidRef.current;
    batchWasValidRef.current = valid;
    if (!becameValid || customerName.trim() || phoneNumber.trim()) return;
    phoneRef.current?.focus();
  }, [batchReferenceCode, customerName, phoneNumber]);

  useEffect(() => {
    photosRef.current = photos;
    itemsRef.current = items;
  }, [photos, items]);

  useEffect(
    () => () => {
      if (flashTimerRef.current != null) window.clearTimeout(flashTimerRef.current);
      releasePhoto(photosRef.current.front);
      releasePhoto(photosRef.current.back);
      for (const card of itemsRef.current) {
        releasePhoto(card.front);
        releasePhoto(card.back);
      }
    },
    [],
  );

  const runCustomerSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    const digitCount = trimmed.replace(/\D/g, '').length;
    if (digitCount < MIN_CUSTOMER_PHONE_SEARCH) {
      setCustomerMatches([]);
      setCustomerSearchError('');
      setCustomerSearchAttempted(false);
      setCustomerSearchLoading(false);
      return;
    }

    setCustomerSearchLoading(true);
    setCustomerSearchError('');
    try {
      const matches = await searchCustomersByPhone(trimmed);
      setCustomerMatches(matches);
      setCustomerSearchAttempted(true);
    } catch (e) {
      setCustomerMatches([]);
      setCustomerSearchAttempted(true);
      setCustomerSearchError(e instanceof Error ? e.message : String(e));
    } finally {
      setCustomerSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appliedPhoneRef.current !== null && appliedPhoneRef.current === phoneNumber) {
      appliedPhoneRef.current = null;
      return;
    }
    appliedPhoneRef.current = null;
    setSelectedCustomerId(null);
    setCustomerSearchAttempted(false);
    const handle = window.setTimeout(() => {
      void runCustomerSearch(phoneNumber);
    }, CUSTOMER_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [phoneNumber, runCustomerSearch]);

  const onBatchChange = (code: string) => {
    setBatchReferenceCode(code);
    const plan = parseServicePlanLabel(code);
    if (plan === '—') return;
    const nextTotal = getPsaDefaultTotalCost(plan);
    const reholder = isReholderPlan(plan);
    setDraft((prev) => {
      const totalCost = editingId || totalTouchedRef.current ? prev.totalCost : nextTotal;
      return {
        ...prev,
        totalCost,
        certNumber: reholder ? prev.certNumber : null,
        grade: reholder ? prev.grade : null,
      };
    });
    if (!reholder) {
      setItems((prev) =>
        prev.some((card) => card.certNumber || card.grade)
          ? prev.map((card) => ({ ...card, certNumber: null, grade: null }))
          : prev,
      );
    }
  };

  const flashCard = (localId: string) => {
    setFlashedId(localId);
    setFlashHot(true);
    if (flashTimerRef.current != null) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setFlashHot(false), FLASH_MS);
  };

  const focusCardName = (select = false) => {
    requestAnimationFrame(() => {
      nameRef.current?.focus();
      if (select) nameRef.current?.select();
    });
  };

  const applyCustomer = (customer: AdminGradingCustomer) => {
    appliedPhoneRef.current = customer.phoneNumber;
    setCustomerName(customer.customerName);
    setPhoneNumber(customer.phoneNumber);
    setSelectedCustomerId(customer.id);
    setCustomerMatches([]);
    setCustomerSearchError('');
    focusCardName();
  };

  const clearPhotoInputs = () => {
    photoInputRefs.current.front && (photoInputRefs.current.front.value = '');
    photoInputRefs.current.back && (photoInputRefs.current.back.value = '');
  };

  const resetDraft = (release = true) => {
    if (release) {
      releasePhoto(photos.front);
      releasePhoto(photos.back);
    }
    totalTouchedRef.current = false;
    setEditingId(null);
    setDraft(blankDraft(planDefaultTotal));
    setPhotos(emptyPhotos());
    setPhotoError('');
    clearPhotoInputs();
  };

  const onPhoto = async (side: CardSide, file: File) => {
    setPhotoError('');
    setPhotoReading(true);
    try {
      const compressed = await compressImage(file, 1600, 0.8);
      const previewUrl = URL.createObjectURL(file);
      setPhotos((prev) => {
        releasePhoto(prev[side]);
        return { ...prev, [side]: { previewUrl, base64: compressed.base64, mimeType: compressed.mimeType } };
      });
      const result = await readIntakeCard(compressed.base64, compressed.mimeType);
      const cardName = result.cardName.trim();
      if (!cardName) {
        setPhotoError('Could not read a card name from this photo. It will still be saved.');
        return;
      }
      setDraft((prev) => ({ ...prev, cardName }));
      focusCardName(true);
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : String(e));
    } finally {
      setPhotoReading(false);
    }
  };

  const queueCard = () => {
    if (loading || photoReading) return;
    const namedBase = namedDraftCard(draft, editingId ?? crypto.randomUUID(), showCertFields);
    if (!namedBase) {
      focusCardName();
      return;
    }
    const named: IntakeCardDraft = { ...namedBase, front: photos.front, back: photos.back };
    setItems((prev) => {
      if (editingId) return prev.map((card) => (card.localId === editingId ? named : card));
      return [...prev, named];
    });
    flashCard(named.localId);
    resetDraft(false);
    focusCardName();
  };

  const editCard = (card: IntakeCardDraft) => {
    if (loading) return;
    if (editingId && editingId !== card.localId) {
      const current = namedDraftCard(draft, editingId, showCertFields);
      if (current) {
        const saved: IntakeCardDraft = { ...current, front: photos.front, back: photos.back };
        setItems((prev) => prev.map((item) => (item.localId === editingId ? saved : item)));
        flashCard(saved.localId);
      }
    } else {
      releasePhoto(photos.front);
      releasePhoto(photos.back);
    }
    totalTouchedRef.current = true;
    setEditingId(card.localId);
    setPhotos({ front: card.front, back: card.back });
    setPhotoError('');
    clearPhotoInputs();
    setDraft({
      cardName: card.cardName,
      certNumber: card.certNumber ?? null,
      grade: card.grade ?? null,
      isPaid: card.isPaid,
      totalCost: card.totalCost,
      receivedCost: card.receivedCost,
      psaUpgraded: card.psaUpgraded,
    });
    focusCardName(true);
  };

  const removeCard = (localId: string) => {
    setItems((prev) => {
      const target = prev.find((card) => card.localId === localId);
      if (target && editingId !== localId) {
        releasePhoto(target.front);
        releasePhoto(target.back);
      }
      return prev.filter((card) => card.localId !== localId);
    });
    if (editingId === localId) resetDraft();
  };

  const save = async () => {
    if (photoReading || missingReason || loading) {
      if (!draft.cardName.trim()) focusCardName();
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await createIntake({
        batchReferenceCode: batchReferenceCode.trim().toUpperCase(),
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        items: cardsToSubmit.map((card) => ({
          cardName: card.cardName.trim(),
          certNumber: card.certNumber?.trim() || null,
          grade: card.grade?.trim() || null,
          isPaid: card.isPaid,
          totalCost: card.totalCost,
          receivedCost: card.receivedCost,
          psaUpgraded: card.psaUpgraded,
        })),
      });
      const photoFailures: string[] = [];
      const createdItems = result.items ?? [];
      for (let index = 0; index < cardsToSubmit.length; index += 1) {
        const card = cardsToSubmit[index];
        const images = [
          card.front ? { seq: 1, contentType: card.front.mimeType, data: card.front.base64 } : null,
          card.back ? { seq: 0, contentType: card.back.mimeType, data: card.back.base64 } : null,
        ].filter((image) => image !== null);
        if (images.length === 0) continue;
        const created = createdItems[index];
        if (!created?.id) {
          photoFailures.push(card.cardName);
          continue;
        }
        try {
          await uploadIntakeItemImages(result.customerOrder.id, created.id, images);
        } catch {
          photoFailures.push(card.cardName);
        }
      }
      if (photoFailures.length > 0) {
        setError(
          `Order ${result.customerOrder.id} was saved, but photos did not store for ${photoFailures.join(', ')}.`,
        );
      } else {
        setMessage(`Customer order saved. ID: ${result.customerOrder.id}`);
      }
      for (const card of cardsToSubmit) {
        releasePhoto(card.front);
        releasePhoto(card.back);
      }
      setItems([]);
      resetDraft(false);
      setCustomerName('');
      setPhoneNumber('');
      setCustomerMatches([]);
      setSelectedCustomerId(null);
      setTimeout(() => router.push('/admin/psa-grading'), photoFailures.length > 0 ? 2500 : 700);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const onCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (event.metaKey || event.ctrlKey) {
      void save();
      return;
    }
    queueCard();
  };

  const onPhoneKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (customerMatches.length === 1) applyCustomer(customerMatches[0]);
  };

  const phoneDigits = phoneNumber.replace(/\D/g, '').length;
  const showCustomerSearchHint = phoneDigits > 0 && phoneDigits < MIN_CUSTOMER_PHONE_SEARCH;
  const draftNamed = Boolean(draft.cardName.trim());

  return (
    <div className="grid w-full min-w-0 gap-6 md:h-[calc(100dvh-var(--site-header-height)-var(--site-subheader-height,0px)-3.75rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,24rem)] md:grid-rows-[auto_minmax(0,1fr)]">
      <header className="md:col-span-2">
        <h2 className="text-xl font-semibold text-text-primary">New intake</h2>
        <p className="text-sm text-text-muted mt-2 max-w-[65ch]">
          One customer, one batch. Type the card, then save. Enter queues another card.
        </p>
      </header>

      <div className="min-h-0 min-w-0 space-y-6 md:overflow-y-auto md:pr-1">
      <section className="panel w-full p-5 space-y-4" aria-label="Customer">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="intake-batch">
              Reference ID in PSA Batches
            </label>
            <BatchReferencePicker
              id="intake-batch"
              batches={batchOptions}
              value={batchReferenceCode}
              onChange={onBatchChange}
              loading={batchesLoading}
              autoFocus={!batchFromQuery}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={customerNameId}>
              Customer name
            </label>
            <input
              id={customerNameId}
              value={customerName}
              disabled={loading}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomerId(null);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
                e.preventDefault();
                phoneRef.current?.focus();
              }}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={phoneId}>
              Phone number
            </label>
            <input
              ref={phoneRef}
              id={phoneId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phoneNumber}
              disabled={loading}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setSelectedCustomerId(null);
              }}
              onKeyDown={onPhoneKeyDown}
              placeholder="+852… or 92851189"
              className={fieldClass}
            />
            {showCustomerSearchHint && (
              <p className="text-xs text-text-muted mt-1">
                Enter at least {MIN_CUSTOMER_PHONE_SEARCH} digits to find an existing customer.
              </p>
            )}
            {customerSearchLoading && (
              <p className="text-xs text-text-muted mt-1">Searching…</p>
            )}
            {selectedCustomerId && (
              <p className="text-xs text-accent-success mt-1">Existing customer selected.</p>
            )}
            {customerSearchError && (
              <p className="text-xs text-accent-danger mt-1">{customerSearchError}</p>
            )}
            {!customerSearchLoading &&
              customerSearchAttempted &&
              phoneDigits >= MIN_CUSTOMER_PHONE_SEARCH &&
              customerMatches.length === 0 &&
              !customerSearchError &&
              !selectedCustomerId && (
                <p className="text-xs text-text-muted mt-1">No existing customer for this phone.</p>
              )}
          </div>
        </div>

        {!customerSearchLoading && customerMatches.length > 0 && (
          <div className="border border-border-default bg-surface-bg">
            <p className="text-xs text-text-secondary uppercase tracking-wide px-3 py-2 border-b border-border-default">
              Matching customers ({customerMatches.length})
              {customerMatches.length === 1 ? ' — Enter to use' : ''}
            </p>
            <ul className="max-h-[8.25rem] overflow-y-auto divide-y divide-border-default/70">
              {customerMatches.map((customer) => (
                <li key={customer.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 hover:bg-surface-raised transition-colors flex flex-wrap items-center justify-between gap-2 min-h-[44px]"
                    onClick={() => applyCustomer(customer)}
                  >
                    <span className="font-medium text-text-primary">{customer.customerName}</span>
                    <span className="font-mono text-xs text-text-secondary">{customer.phoneNumber}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="panel p-5 space-y-4" aria-label="This card" onKeyDown={onCardKeyDown}>
        <h3 className="text-base font-semibold text-text-primary">
          {editingId ? 'Edit card' : 'This card'}
        </h3>
        {showCertFields && (
          <p className="text-sm text-text-muted">Cert from the slab. Grade can wait.</p>
        )}

        <div>
          <label htmlFor={nameId} className={labelClass}>
            Card name
          </label>
          <input
            ref={nameRef}
            id={nameId}
            type="text"
            value={draft.cardName}
            disabled={loading || photoReading}
            autoComplete="off"
            onChange={(e) => setDraft((prev) => ({ ...prev, cardName: e.target.value }))}
            placeholder={photoReading ? 'Reading card…' : 'Type the name, then Save'}
            className={`${fieldClass} text-base`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {(['front', 'back'] as const).map((side) => (
              <div key={side} className="flex items-center gap-2">
                <input
                  ref={(node) => {
                    photoInputRefs.current[side] = node;
                  }}
                  id={`${photoId}-${side}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={loading || photoReading}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.stopPropagation();
                  }}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) void onPhoto(side, file);
                  }}
                />
                <label
                  htmlFor={`${photoId}-${side}`}
                  className={`btn btn-secondary min-h-[44px] ${loading || photoReading ? 'pointer-events-none opacity-45' : 'cursor-pointer'}`}
                >
                  {side === 'front' ? 'Front' : 'Back'}
                </label>
                {photos[side] && (
                  <>
                    {/* Blob preview of a photo just picked. next/image cannot load blob: URLs. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[side].previewUrl}
                      alt=""
                      className="h-11 w-11 border border-border-default object-cover"
                    />
                  </>
                )}
              </div>
            ))}
            {photoReading && <p className="text-sm text-text-muted">Reading card…</p>}
            {photoError && <p className="text-sm text-accent-danger">{photoError}</p>}
          </div>
        </div>

        {showCertFields && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={certId} className={labelClass}>
                Cert #
              </label>
              <input
                id={certId}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={draft.certNumber ?? ''}
                disabled={loading}
                onChange={(e) => setDraft((prev) => ({ ...prev, certNumber: e.target.value || null }))}
                placeholder="e.g. 82345678"
                className={`${fieldClass} font-mono`}
              />
            </div>
            <div>
              <label htmlFor={gradeId} className={labelClass}>
                Grade
              </label>
              <input
                id={gradeId}
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={draft.grade ?? ''}
                disabled={loading}
                onChange={(e) => setDraft((prev) => ({ ...prev, grade: e.target.value || null }))}
                placeholder="e.g. 10"
                className={`${fieldClass} font-mono`}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={totalId} className={labelClass}>
              Total
            </label>
            <input
              id={totalId}
              type="number"
              min={0}
              disabled={loading}
              value={draft.totalCost ?? ''}
              onChange={(e) => {
                totalTouchedRef.current = true;
                setDraft((prev) => ({ ...prev, totalCost: parseCostInput(e.target.value) }));
              }}
              className={`${fieldClass} font-mono text-right`}
            />
          </div>
          <div>
            <label htmlFor={receivedId} className={labelClass}>
              Received
            </label>
            <input
              id={receivedId}
              type="number"
              min={0}
              disabled={loading}
              value={draft.receivedCost ?? ''}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, receivedCost: parseCostInput(e.target.value) }))
              }
              className={`${fieldClass} font-mono text-right`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <label className="flex items-center gap-2 text-sm min-h-[44px]">
            <input
              type="checkbox"
              checked={draft.isPaid}
              disabled={loading}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  isPaid: e.target.checked,
                  receivedCost:
                    e.target.checked && prev.totalCost != null ? prev.totalCost : prev.receivedCost,
                }))
              }
              className="w-4 h-4"
            />
            Paid
          </label>
          <label className="flex items-center gap-2 text-sm min-h-[44px]">
            <input
              type="checkbox"
              checked={draft.psaUpgraded}
              disabled={loading}
              onChange={(e) => setDraft((prev) => ({ ...prev, psaUpgraded: e.target.checked }))}
              className="w-4 h-4"
            />
            PSA upgraded
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-secondary min-h-[44px]"
            onClick={queueCard}
            disabled={loading || photoReading || !draftNamed}
          >
            {editingId ? 'Update card' : 'Next card'}
          </button>
        </div>
      </section>
      </div>

      <section
        className="panel flex w-full min-h-0 min-w-0 flex-col p-5 md:overflow-hidden"
        aria-label="Cards on this order"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-text-primary" aria-live="polite">
            Cards ({cardsToSubmit.length})
          </h3>
          {cardsToSubmit.length > 0 && (
            <p className="text-sm font-mono tabular-nums text-text-secondary">
              Total {formatHkd(totalSum)}
            </p>
          )}
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
        {cardsToSubmit.length === 0 ? (
          <p className="text-sm text-text-muted">This card shows here as you type.</p>
        ) : (
          <ul className="space-y-2">
            {cardsToSubmit.map((card, index) => {
              const live = card.localId === 'draft';
              const hot = flashHot && flashedId === card.localId;
              const row = (
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-text-muted tabular-nums w-6">{index + 1}</span>
                  <span className="min-w-0 flex-1 basis-40">
                          <span className="block text-sm text-text-primary truncate" title={card.cardName}>
                            {card.cardName}
                          </span>
                          {(card.front || card.back) && (
                            <span className="block text-xs text-text-muted">
                              {[card.front ? 'Front' : '', card.back ? 'Back' : ''].filter(Boolean).join(' · ')}
                            </span>
                          )}
                    {showCertFields && (card.certNumber || card.grade) && (
                      <span className="block text-xs font-mono text-text-secondary truncate">
                        {[card.certNumber, card.grade].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </span>
                  <span className={`text-xs ${card.isPaid ? 'text-accent-success' : 'text-text-muted'}`}>
                    {card.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  {card.totalCost != null && (
                    <span className="font-mono text-sm tabular-nums">{formatHkd(card.totalCost)}</span>
                  )}
                  {card.receivedCost != null && (
                    <span className="font-mono text-sm tabular-nums text-text-secondary">
                      {formatHkd(card.receivedCost)}
                    </span>
                  )}
                  {card.psaUpgraded && <span className="text-xs text-accent-warn">Up</span>}
                </span>
              );
              return (
                <li
                  key={card.localId}
                  className={`border transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    editingId === card.localId ? 'border-accent-link' : 'border-border-default'
                  } ${hot ? 'bg-accent-brand/20' : 'bg-surface-bg'}`}
                >
                  <div className="flex items-stretch">
                    {live ? (
                      <div className="flex-1 min-w-0 px-3 py-2.5 min-h-[44px]">{row}</div>
                    ) : (
                      <button
                        type="button"
                        className="flex-1 min-w-0 text-left px-3 py-2.5 min-h-[44px] hover:bg-surface-raised/60"
                        onClick={() => {
                          if (card.localId === editingId) return;
                          const queued = items.find((item) => item.localId === card.localId);
                          if (queued) editCard(queued);
                        }}
                        disabled={loading}
                      >
                        {row}
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-3 text-xs text-accent-danger min-h-[44px] shrink-0"
                      onClick={() => {
                        if (live) {
                          setDraft((prev) => ({ ...prev, cardName: '' }));
                          focusCardName();
                          return;
                        }
                        removeCard(card.localId);
                      }}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        </div>

        <div className="mt-3 shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-default pt-3">
          <button
            type="button"
            className="btn btn-primary min-h-[44px]"
            onClick={() => void save()}
            disabled={loading || photoReading || Boolean(missingReason)}
          >
            {loading ? 'Saving…' : 'Save intake'}
          </button>
          <Link
            href="/admin/psa-grading"
            className="inline-flex items-center min-h-[44px] px-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </Link>
          {missingReason && !loading && (
            <p className="text-sm text-text-muted">{missingReason}</p>
          )}
        </div>

        {message && (
          <p role="status" aria-live="polite" className="text-accent-success text-sm">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" aria-live="assertive" className="text-accent-danger text-sm">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
