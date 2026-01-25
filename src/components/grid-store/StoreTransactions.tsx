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
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  };
  setRevenueForm: React.Dispatch<React.SetStateAction<{
    date: string;
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
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
  refreshTrigger?: number;
  onRentStatsChange?: (stats: { totalDue: number; totalPaid: number }) => void;
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
  refreshTrigger,
  onRentStatsChange,
}: StoreTransactionsProps) {
  const [storeEntries, setStoreEntries] = useState<RevenueEntry[]>(cachedStoreTransactions || []);
  const [loading, setLoading] = useState(!cachedStoreTransactions);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchStoreTransactions = async () => {

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
        const mapped: RevenueEntry[] = result.data.storeTransactions.transactions.map((trx) => {
          // Map trxType to RevenueEntry type
          let entryType: 'grid-rent' | 'item-sale' | 'grid-income' | 'others' = 'others';
          if (trx.trxType === 'rent_payment') entryType = 'grid-rent';
          else if (trx.trxType === 'settlement_to_lessee') entryType = 'grid-income';
          else if (trx.trxType === 'settlement_to_lessor') entryType = 'grid-rent';
          
          return {
            id: trx.orderId,
            date: new Date(trx.created).toLocaleDateString(),
            type: entryType,
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
            fromUser: trx.fromUser,
            toUser: trx.toUser,
          };
        });

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

  // Refetch when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      // Clear cache and refetch
      cachedStoreTransactions = null;
      hasFetched.current = false;
      fetchStoreTransactions();
    }
  }, [refreshTrigger]);

  // Update rent stats when storeEntries changes
  useEffect(() => {
    if (onRentStatsChange && storeEntries.length > 0) {
      const rentTransactions = storeEntries.filter(entry => entry.trxType === 'rent_payment');
      const totalDue = rentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalPaid = rentTransactions.filter(tx => tx.collected).reduce((sum, tx) => sum + tx.amount, 0);
      onRentStatsChange({ totalDue, totalPaid });
    }
  }, [storeEntries, onRentStatsChange]);

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
        showModal={false}
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
        handlerHeaderLabel="Recipient"
        showGridNumber={false}
        showPayerRecipient={true}
      />
    </>
  );
}
