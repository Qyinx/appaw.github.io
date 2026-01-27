"use client";

import React, { useState, useEffect, useRef } from 'react';
import { graphqlFetch } from '@/lib/graphql';
import RevenueManagement from './RevenueManagement';
import type { RevenueEntry, GridStore, Cashier } from '@/app/business/grid-store/administration/page';

interface GridTransaction {
  orderId: string;
  gridId: string;
  itemId: string;
  itemVersion: string;
  itemName: string;
  trxPrice: number;
  cashierId: string;
  isCollected: boolean;
  created: string;
  cashier: { id: string; name: string };
  grid: {
    id: string;
    name: string;
    storeId: string;
  } | null;
  store: {
    id: string;
    name: string;
  } | null;
}

interface GridTransactionsResponse {
  transactions: GridTransaction[];
  total: number;
  limit: number;
  nextAfterId: string | null;
  previousBeforeId: string | null;
}

interface GridTransactionsProps {
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
  cashiers: Cashier[];
  onOpenModal?: () => void;
  onSave: () => void;
  onToggleCollected: (id: string) => void;
  canAddRecord?: boolean;
}

let cachedGridTransactions: RevenueEntry[] | null = null;

export default function GridTransactions({
  revenueEntries,
  showModal,
  setShowModal,
  revenueForm,
  setRevenueForm,
  gridStores,
  cashiers,
  onOpenModal,
  onSave,
  onToggleCollected,
  canAddRecord = true,
}: GridTransactionsProps) {
  const [gridEntries, setGridEntries] = useState<RevenueEntry[]>(cachedGridTransactions || []);
  const [loading, setLoading] = useState(!cachedGridTransactions);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchGridTransactions = async () => {
    if (hasFetched.current || cachedGridTransactions) return;

    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const query = `
        query {
          gridTransactions(limit: 20) {
            transactions {
              orderId
              gridId
              itemId
              itemVersion
              itemName
              trxPrice
              cashierId
              isCollected
              created
              grid {
                id
                name
                storeId
              }
              store {
                id
                name
              }
              cashier {
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

      const result = await graphqlFetch<{ gridTransactions: GridTransactionsResponse }>(query);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to fetch grid transactions');
      }

      if (result.data?.gridTransactions?.transactions) {
        const mapped: RevenueEntry[] = result.data.gridTransactions.transactions.map((trx) => {
          const createdDate = new Date(trx.created);
          const formattedDate = createdDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          
          return {
            id: trx.orderId,
            date: formattedDate,
            type: 'item-sale' as 'grid-rent' | 'item-sale',
            gridId: trx.gridId,
            gridNumber: trx.grid && trx.store ? `${trx.grid.name} (${trx.store.name})` : trx.gridId,
            handlerName: trx.cashier.name,
            handlerRole: 'cashier' as 'lessor' | 'cashier',
            handlerId: trx.cashierId,
            itemName: trx.itemName,
            amount: trx.trxPrice,
            collected: trx.isCollected,
            locationName: trx.store?.name || '',
          };
        });

        setGridEntries(mapped);
        cachedGridTransactions = mapped;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grid transactions');
      console.error('Error fetching grid transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGridTransactions();
  }, []);

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      <RevenueManagement
        title="Grid Transactions"
        revenueEntries={gridEntries}
        filteredEntries={gridEntries}
        showModal={showModal}
        setShowModal={setShowModal}
        revenueForm={revenueForm}
        setRevenueForm={setRevenueForm}
        gridStores={gridStores}
        lessors={[]}
        cashiers={cashiers}
        onOpenModal={onOpenModal}
        onSave={onSave}
        onToggleCollected={onToggleCollected}
        canAddRecord={canAddRecord}
        showType={false}
        showOrderNo={true}
        typeOptions={['item-sale']}
        handlerRoleOptions={['cashier']}
        itemHeaderLabel="Item Details"
        handlerHeaderLabel="Cashier"
      />
    </>
  );
}
