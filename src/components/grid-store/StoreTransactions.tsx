"use client";

import React, { useState, useEffect, useRef } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import RevenueManagement from './RevenueManagement';
import type { RevenueEntry, GridStore, Lessor } from '@/app/business/grid-store/administration/page';

interface StoreTransaction {
  orderId: string;
  trxType: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  notes: string;
  isCollected: boolean;
  created: string;
  fromUser: { id: string; name: string };
  toUser: { id: string; name: string };
}

interface StoreTransactionsResponse {
  transactions: StoreTransaction[];
  total: number;
  limit: number;
  nextAfterId: string | null;
  previousBeforeId: string | null;
}

interface StoreTransactionsProps {
  revenueEntries: RevenueEntry[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  revenueForm: {
    date: string;
    type: 'grid-rent' | 'item-sale';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  };
  setRevenueForm: React.Dispatch<React.SetStateAction<{
    date: string;
    type: 'grid-rent' | 'item-sale';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  }>>;
  gridStores: GridStore[];
  lessors: Lessor[];
  onOpenModal?: () => void;
  onSave: () => void;
  onToggleCollected: (id: string) => void;
  canAddRecord?: boolean;
}

let cachedStoreTransactions: RevenueEntry[] | null = null;

export default function StoreTransactions({
  revenueEntries,
  showModal,
  setShowModal,
  revenueForm,
  setRevenueForm,
  gridStores,
  lessors,
  onOpenModal,
  onSave,
  onToggleCollected,
  canAddRecord = true,
}: StoreTransactionsProps) {
  const [storeEntries, setStoreEntries] = useState<RevenueEntry[]>(cachedStoreTransactions || []);
  const [loading, setLoading] = useState(!cachedStoreTransactions);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchStoreTransactions = async () => {
    if (hasFetched.current || cachedStoreTransactions) return;

    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const query = `
        query {
          storeTransactions(limit: 20) {
            transactions {
              orderId
              trxType
              fromUserId
              toUserId
              amount
              notes
              isCollected
              created
              fromUser {
                id
                name
              }
              toUser {
                id
                name
              }
            }
            total
            limit
            nextAfterId
            previousBeforeId
          }
        }
      `;

      const result = await graphqlFetch<{ storeTransactions: StoreTransactionsResponse }>(query);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to fetch store transactions');
      }

      if (result.data?.storeTransactions?.transactions) {
        const mapped: RevenueEntry[] = result.data.storeTransactions.transactions.map((trx) => ({
          id: trx.orderId,
          date: new Date(trx.created).toLocaleDateString(),
          type: 'grid-rent' as 'grid-rent' | 'item-sale',
          gridId: '',
          gridNumber: trx.orderId,
          handlerName: trx.fromUser.name,
          handlerRole: 'lessor' as 'lessor' | 'cashier',
          handlerId: trx.fromUserId,
          itemName: trx.toUser.name,
          trxType: trx.trxType,
          notes: trx.notes,
          amount: trx.amount,
          collected: trx.isCollected,
          locationName: '',
        }));

        setStoreEntries(mapped);
        cachedStoreTransactions = mapped;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store transactions');
      console.error('Error fetching store transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreTransactions();
  }, []);

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      <RevenueManagement
        title="Store Transactions"
        revenueEntries={storeEntries}
        filteredEntries={storeEntries}
        showModal={showModal}
        setShowModal={setShowModal}
        revenueForm={revenueForm}
        setRevenueForm={setRevenueForm}
        gridStores={gridStores}
        lessors={lessors}
        cashiers={[]}
        onOpenModal={onOpenModal}
        onSave={onSave}
        onToggleCollected={onToggleCollected}
        canAddRecord={canAddRecord}
        typeOptions={['grid-rent']}
        handlerRoleOptions={['lessor']}
        itemHeaderLabel="Transaction Details"
        handlerHeaderLabel="Payer"
        showGridNumber={false}
        showGridNumber={false}
      />
    </>
  );
}
