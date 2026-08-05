'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createIntake,
  listBatches,
  MIN_CUSTOMER_PHONE_SEARCH,
  searchCustomersByPhone,
} from '@/lib/grading/admin-api';
import {
  isCardNameFilled,
  partitionItemsByCardNameFill,
  splitItemsByCardNameFill,
} from '@/lib/grading/admin-draft-utils';
import type { AdminBatch, AdminGradingCustomer, AdminIntakeItemDraft } from '@/lib/grading/admin-types';
import { parseServicePlanLabel } from '@/lib/grading/admin-types';
import { isValidBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import { getPsaDefaultTotalCost } from '@/lib/grading/psa-pricing';
import AdminCardComposer, { type CardComposerValue } from '../components/AdminCardComposer';
import AdminPendingCards from '../components/AdminPendingCards';
import BatchReferencePicker from '../components/BatchReferencePicker';
import { formatHkd } from '@/lib/grading/admin-format';

const CUSTOMER_SEARCH_DEBOUNCE_MS = 350;

type IntakeCardDraft = AdminIntakeItemDraft & { localId: string };

function defaultTotalForBatch(batchReferenceCode: string): number | null {
  const plan = parseServicePlanLabel(batchReferenceCode);
  return plan === '—' ? null : getPsaDefaultTotalCost(plan);
}

function emptyCard(defaultTotal: number | null = null): IntakeCardDraft {
  return {
    localId: crypto.randomUUID(),
    cardName: '',
    isPaid: false,
    totalCost: defaultTotal,
    receivedCost: null,
    psaUpgraded: false,
  };
}

function settleIntakeCards(items: IntakeCardDraft[]): IntakeCardDraft[] {
  return partitionItemsByCardNameFill(items);
}

export default function GradingIntakeClient() {
  const router = useRouter();
  const [batchReferenceCode, setBatchReferenceCode] = useState('');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const listBottomRef = useRef<HTMLDivElement>(null);
  const scrollAfterCommitRef = useRef(false);

  const planDefaultTotal = useMemo(
    () => defaultTotalForBatch(batchReferenceCode),
    [batchReferenceCode],
  );

  const { pending: pendingItems, filled: filledItems } = useMemo(
    () => splitItemsByCardNameFill(items),
    [items],
  );

  const totalSum = useMemo(
    () => filledItems.reduce((sum, card) => sum + (card.totalCost ?? 0), 0),
    [filledItems],
  );

  useEffect(() => {
    setBatchesLoading(true);
    void listBatches()
      .then(setBatchOptions)
      .catch(() => setBatchOptions([]))
      .finally(() => setBatchesLoading(false));
  }, []);

  useEffect(() => {
    setItems((prev) =>
      prev.map((card) => {
        if (isCardNameFilled(card.cardName)) return card;
        if (card.totalCost != null) return card;
        return { ...card, totalCost: planDefaultTotal };
      }),
    );
  }, [planDefaultTotal]);

  useEffect(() => {
    if (!scrollAfterCommitRef.current) return;
    scrollAfterCommitRef.current = false;
    listBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [items]);

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
    setSelectedCustomerId(null);
    setCustomerSearchAttempted(false);
    const handle = window.setTimeout(() => {
      void runCustomerSearch(phoneNumber);
    }, CUSTOMER_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [phoneNumber, runCustomerSearch]);

  const applyCustomer = (customer: AdminGradingCustomer) => {
    setCustomerName(customer.customerName);
    setPhoneNumber(customer.phoneNumber);
    setSelectedCustomerId(customer.id);
    setCustomerMatches([]);
    setCustomerSearchError('');
  };

  const updateCard = (localId: string, patch: Partial<AdminIntakeItemDraft>) => {
    setItems((prev) =>
      prev.map((card) => (card.localId === localId ? { ...card, ...patch } : card)),
    );
  };

  const handleCommitComposer = (value: CardComposerValue) => {
    const card: IntakeCardDraft = {
      localId: crypto.randomUUID(),
      cardName: value.cardName,
      isPaid: value.isPaid,
      totalCost: value.totalCost,
      receivedCost: value.receivedCost,
      psaUpgraded: value.psaUpgraded,
    };
    scrollAfterCommitRef.current = true;
    setItems((prev) => settleIntakeCards([...prev, card]));
  };

  const handleAddBlanks = (count: number) => {
    setItems((prev) => {
      const { pending, filled } = splitItemsByCardNameFill(prev);
      const blanks = Array.from({ length: count }, () => emptyCard(planDefaultTotal));
      return settleIntakeCards([...pending, ...blanks, ...filled]);
    });
  };

  const handlePendingBlur = () => {
    setItems((prev) => settleIntakeCards(prev));
  };

  const removeCard = (localId: string) => {
    setItems((prev) => settleIntakeCards(prev.filter((card) => card.localId !== localId)));
  };

  const save = async () => {
    setError('');
    setMessage('');

    if (!isValidBatchReferenceCode(batchReferenceCode)) {
      setError('Valid batch reference required: BAT-YYYY-MM-PLAN-R.');
      return;
    }
    if (!customerName.trim() || !phoneNumber.trim()) {
      setError('Customer name and phone are required.');
      return;
    }
    if (pendingItems.length > 0) {
      setError('Name or remove blank drafts before saving.');
      return;
    }
    if (filledItems.length === 0) {
      setError('Add at least one named card.');
      return;
    }

    setLoading(true);
    try {
      const result = await createIntake({
        batchReferenceCode: batchReferenceCode.trim().toUpperCase(),
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        items: filledItems.map((card) => ({
          cardName: card.cardName.trim(),
          isPaid: card.isPaid,
          totalCost: card.totalCost,
          receivedCost: card.receivedCost,
          psaUpgraded: card.psaUpgraded,
        })),
      });
      setMessage(`Customer order saved. ID: ${result.customerOrder.id}`);
      setItems([]);
      setCustomerName('');
      setPhoneNumber('');
      setCustomerMatches([]);
      setSelectedCustomerId(null);
      setTimeout(() => router.push('/admin/psa-grading'), 700);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = phoneNumber.replace(/\D/g, '').length;
  const showCustomerSearchHint = phoneDigits > 0 && phoneDigits < MIN_CUSTOMER_PHONE_SEARCH;

  return (
    <div className="space-y-6 max-w-4xl pb-40">
      <div>
        <h2 className="text-xl font-semibold">New intake</h2>
        <p className="text-sm text-text-muted mt-1">
          Create a customer order under one PSA batch. Use the bottom composer to add cards — drafts float at top until named.
        </p>
      </div>

      <section className="panel p-5 space-y-5">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Reference ID in PSA Batches
            </label>
            <BatchReferencePicker
              batches={batchOptions}
              value={batchReferenceCode}
              onChange={setBatchReferenceCode}
              loading={batchesLoading}
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Customer name
            </label>
            <input
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomerId(null);
              }}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Phone number
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setSelectedCustomerId(null);
                }}
                placeholder="+852… or 92851189"
                className="flex-1 min-w-[200px] border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
              />
              <button
                type="button"
                className="btn btn-secondary min-h-[44px]"
                onClick={() => void runCustomerSearch(phoneNumber)}
                disabled={customerSearchLoading || phoneDigits < MIN_CUSTOMER_PHONE_SEARCH}
              >
                {customerSearchLoading ? 'Searching…' : 'Search customer'}
              </button>
            </div>
            {showCustomerSearchHint && (
              <p className="text-xs text-text-muted mt-1">
                Enter at least {MIN_CUSTOMER_PHONE_SEARCH} digits to search existing customers.
              </p>
            )}
            {selectedCustomerId && (
              <p className="text-xs text-accent-success mt-1">Existing customer selected — name and phone filled.</p>
            )}
            {customerSearchError && (
              <p className="text-xs text-accent-danger mt-1">{customerSearchError}</p>
            )}
            {!customerSearchLoading && customerMatches.length > 0 && (
              <div className="mt-3 border border-border-default bg-surface-bg">
                <p className="text-xs text-text-secondary uppercase tracking-wide px-3 py-2 border-b border-border-default">
                  Matching customers ({customerMatches.length})
                </p>
                <ul className="divide-y divide-border-default/70">
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
            {!customerSearchLoading &&
              customerSearchAttempted &&
              phoneDigits >= MIN_CUSTOMER_PHONE_SEARCH &&
              customerMatches.length === 0 &&
              !customerSearchError &&
              !selectedCustomerId && (
                <p className="text-xs text-text-muted mt-1">No existing customer for this phone — new intake.</p>
              )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs text-text-secondary uppercase tracking-wide">
              Cards ({filledItems.length} named
              {pendingItems.length > 0 ? `, ${pendingItems.length} draft` : ''})
            </p>
            {filledItems.length > 0 && (
              <p className="text-xs font-mono tabular-nums text-text-secondary">
                Total {formatHkd(totalSum)}
              </p>
            )}
          </div>

          <AdminPendingCards
            items={pendingItems.map((card) => ({
              id: card.localId,
              cardName: card.cardName,
              isPaid: card.isPaid,
              totalCost: card.totalCost,
              receivedCost: card.receivedCost,
              psaUpgraded: card.psaUpgraded,
            }))}
            disabled={loading}
            onUpdate={(id, patch) => updateCard(id, patch)}
            onRemove={removeCard}
            onRowBlur={() => handlePendingBlur()}
          />

          {filledItems.length === 0 && pendingItems.length === 0 ? (
            <p className="text-sm text-text-muted border border-dashed border-border-default px-4 py-8 text-center">
              No cards yet — use the composer below to add the first one.
            </p>
          ) : (
            <ul className="space-y-2" aria-label="Settled cards">
              {filledItems.map((card, index) => (
                <li
                  key={card.localId}
                  className="grid gap-2 md:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto_auto_auto] items-center border border-border-default/60 bg-surface-bg px-3 py-2.5"
                >
                  <span className="font-mono text-xs text-text-muted tabular-nums w-6">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-primary truncate" title={card.cardName}>
                    {card.cardName}
                  </span>
                  <span className={`text-xs ${card.isPaid ? 'text-accent-success' : 'text-text-muted'}`}>
                    {card.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-right">
                    {card.totalCost == null ? '—' : formatHkd(card.totalCost)}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-right text-text-secondary">
                    {card.receivedCost == null ? '—' : formatHkd(card.receivedCost)}
                  </span>
                  <span className={`text-xs ${card.psaUpgraded ? 'text-accent-warn' : 'text-text-muted'}`}>
                    {card.psaUpgraded ? 'Up' : '—'}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-accent-danger min-h-[44px] px-2"
                    onClick={() => removeCard(card.localId)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div ref={listBottomRef} aria-hidden="true" className="h-0 scroll-mb-48" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            className="btn btn-primary min-h-[44px]"
            onClick={() => void save()}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save intake'}
          </button>
          <Link href="/admin/psa-grading" className="btn btn-secondary min-h-[44px]">
            Cancel
          </Link>
        </div>
      </section>

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

      <AdminCardComposer
        defaultTotalCost={planDefaultTotal}
        disabled={loading}
        onCommit={handleCommitComposer}
        onAddBlanks={handleAddBlanks}
      />
    </div>
  );
}
