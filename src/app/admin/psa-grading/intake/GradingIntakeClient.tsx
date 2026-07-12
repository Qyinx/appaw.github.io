'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  createIntake,
  listBatches,
  MIN_CUSTOMER_PHONE_SEARCH,
  searchCustomersByPhone,
} from '@/lib/grading/admin-api';
import type { AdminBatch, AdminGradingCustomer, AdminIntakeItemDraft } from '@/lib/grading/admin-types';
import { isValidBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import { parseCostInput } from '@/lib/grading/admin-utils';
import BatchReferencePicker from '../components/BatchReferencePicker';

const CUSTOMER_SEARCH_DEBOUNCE_MS = 350;

function emptyCard(): AdminIntakeItemDraft {
  return {
    cardName: '',
    isPaid: false,
    totalCost: null,
    receivedCost: null,
    psaUpgraded: false,
  };
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
  const [items, setItems] = useState<AdminIntakeItemDraft[]>([emptyCard()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setBatchesLoading(true);
    void listBatches()
      .then(setBatchOptions)
      .catch(() => setBatchOptions([]))
      .finally(() => setBatchesLoading(false));
  }, []);

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

  const updateCard = (cardIndex: number, patch: Partial<AdminIntakeItemDraft>) => {
    setItems((prev) => prev.map((card, i) => (i === cardIndex ? { ...card, ...patch } : card)));
  };

  const addCard = () => setItems((prev) => [...prev, emptyCard()]);
  const removeCard = (cardIndex: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== cardIndex)));
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

    setLoading(true);
    try {
      const result = await createIntake({
        batchReferenceCode: batchReferenceCode.trim().toUpperCase(),
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        items: items
          .filter((card) => card.cardName.trim())
          .map((card) => ({
            cardName: card.cardName.trim(),
            isPaid: card.isPaid,
            totalCost: card.totalCost,
            receivedCost: card.receivedCost,
            psaUpgraded: card.psaUpgraded,
          })),
      });
      setMessage(`Customer order saved. ID: ${result.customerOrder.id}`);
      setItems([emptyCard()]);
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold">New intake</h2>
        <p className="text-sm text-text-muted mt-1">
          Create a customer order under one PSA batch. Customer Order ID is assigned automatically on save.
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

        <div className="space-y-2">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Cards</p>
          {items.map((card, cardIndex) => (
            <div
              key={`card-${cardIndex}`}
              className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto_auto] items-end border border-border-default/60 p-3 bg-surface-bg"
            >
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1 md:sr-only">
                  Card name
                </label>
                <input
                  value={card.cardName}
                  onChange={(e) => updateCard(cardIndex, { cardName: e.target.value })}
                  placeholder="Card name…"
                  className="border border-border-default bg-surface-panel px-3 py-2 text-sm min-h-[40px] w-full"
                />
              </div>
              <label className="flex items-center gap-2 text-xs whitespace-nowrap min-h-[40px]">
                <input
                  type="checkbox"
                  checked={card.isPaid}
                  onChange={(e) => updateCard(cardIndex, { isPaid: e.target.checked })}
                />
                Paid
              </label>
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                  Total
                </label>
                <input
                  type="number"
                  min={0}
                  value={card.totalCost ?? ''}
                  onChange={(e) => updateCard(cardIndex, { totalCost: parseCostInput(e.target.value) })}
                  placeholder="Total…"
                  className="w-24 border border-border-strong bg-surface-raised px-2.5 py-1.5 text-sm font-mono font-tabular text-right min-h-[40px]"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
                  Received
                </label>
                <input
                  type="number"
                  min={0}
                  value={card.receivedCost ?? ''}
                  onChange={(e) => updateCard(cardIndex, { receivedCost: parseCostInput(e.target.value) })}
                  placeholder="Received…"
                  className="w-24 border border-border-strong bg-surface-raised px-2.5 py-1.5 text-sm font-mono font-tabular text-right min-h-[40px]"
                />
              </div>
              <label className="flex items-center gap-2 text-xs whitespace-nowrap min-h-[40px]">
                <input
                  type="checkbox"
                  checked={card.psaUpgraded}
                  onChange={(e) => updateCard(cardIndex, { psaUpgraded: e.target.checked })}
                />
                PSA up
              </label>
              {items.length > 1 && (
                <button
                  type="button"
                  className="text-xs text-accent-danger"
                  onClick={() => removeCard(cardIndex)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary text-sm" onClick={addCard}>
            Add card
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={loading}>
            {loading ? 'Saving…' : 'Save intake'}
          </button>
          <Link href="/admin/psa-grading" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </section>

      {message && <p className="text-accent-success text-sm">{message}</p>}
      {error && <p className="text-accent-danger text-sm">{error}</p>}
    </div>
  );
}
