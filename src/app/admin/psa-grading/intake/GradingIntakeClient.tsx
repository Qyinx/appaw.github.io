'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { createIntake, listBatches } from '@/lib/grading/admin-api';
import type { AdminBatch, AdminIntakeItemDraft } from '@/lib/grading/admin-types';
import { isValidBatchReferenceCode } from '@/lib/grading/batch-reference-code';
import { parseCostInput } from '@/lib/grading/admin-utils';
import BatchReferenceLink from '../components/BatchReferenceLink';

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
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState<AdminIntakeItemDraft[]>([emptyCard()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void listBatches().then(setBatchOptions).catch(() => setBatchOptions([]));
  }, []);

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
      setTimeout(() => router.push('/admin/psa-grading'), 700);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold">New intake</h2>
        <p className="text-sm text-text-muted mt-1">
          Create a customer order under one PSA batch. Customer Order ID is assigned automatically on save.
        </p>
      </div>

      <section className="border border-border-default bg-surface-panel p-5 space-y-5">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Reference ID in PSA Batches
            </label>
            <input
              list="batch-reference-options"
              value={batchReferenceCode}
              onChange={(e) => setBatchReferenceCode(e.target.value)}
              placeholder="BAT-2026-07-EXP-3"
              className="w-full border border-border-default bg-surface-bg px-3 py-2 font-mono min-h-[44px]"
            />
            <datalist id="batch-reference-options">
              {batchOptions.map((batch) => (
                <option key={batch.id} value={batch.referenceCode} />
              ))}
            </datalist>
            {batchReferenceCode.trim() && (
              <p className="text-xs mt-1">
                Links to <BatchReferenceLink referenceCode={batchReferenceCode.trim()} />
              </p>
            )}
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Customer name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary uppercase tracking-wide block mb-1">
              Phone number
            </label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+852..."
              className="w-full border border-border-default bg-surface-bg px-3 py-2 min-h-[44px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Cards</p>
          {items.map((card, cardIndex) => (
            <div
              key={`card-${cardIndex}`}
              className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto_auto] items-center border border-border-default/60 p-3 bg-surface-bg"
            >
              <input
                value={card.cardName}
                onChange={(e) => updateCard(cardIndex, { cardName: e.target.value })}
                placeholder="Card name"
                className="border border-border-default bg-surface-panel px-3 py-2 text-sm min-h-[40px]"
              />
              <label className="flex items-center gap-2 text-xs whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={card.isPaid}
                  onChange={(e) => updateCard(cardIndex, { isPaid: e.target.checked })}
                />
                Paid
              </label>
              <input
                type="number"
                min={0}
                value={card.totalCost ?? ''}
                onChange={(e) => updateCard(cardIndex, { totalCost: parseCostInput(e.target.value) })}
                placeholder="Total"
                className="w-24 border border-border-default bg-surface-panel px-2 py-2 text-sm font-mono"
              />
              <input
                type="number"
                min={0}
                value={card.receivedCost ?? ''}
                onChange={(e) => updateCard(cardIndex, { receivedCost: parseCostInput(e.target.value) })}
                placeholder="Received"
                className="w-24 border border-border-default bg-surface-panel px-2 py-2 text-sm font-mono"
              />
              <label className="flex items-center gap-2 text-xs whitespace-nowrap">
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
            {loading ? 'Saving...' : 'Save intake'}
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
