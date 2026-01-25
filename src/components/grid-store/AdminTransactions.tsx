'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { graphqlFetch } from '@/lib/graphql';

interface StoreTransaction {
  orderId: string;
  trxType: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  notes: string | null;
  isCollected: boolean;
  created: string;
  fromUser: {
    id: string;
    name: string;
  };
  toUser: {
    id: string;
    name: string;
  };
}

interface StoreTransactionsResponse {
  storeTransactions: {
    transactions: StoreTransaction[];
    total: number;
    limit: number;
    nextAfterId: string | null;
    previousBeforeId: string | null;
  };
}

interface AdminTransactionsProps {
  isInitialized?: boolean;
  onRentStatsChange?: (stats: { totalDue: number; totalPaid: number }) => void;
  isAdmin?: boolean;
}

export default function AdminTransactions({ isInitialized = false, onRentStatsChange, isAdmin = false }: AdminTransactionsProps) {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<StoreTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [nextAfterId, setNextAfterId] = useState<string | null>(null);
  const [previousBeforeId, setPreviousBeforeId] = useState<string | null>(null);
  const [currentAfterId, setCurrentAfterId] = useState<string | null>(null);
  const [currentBeforeId, setCurrentBeforeId] = useState<string | null>(null);

  const fetchTransactions = async (afterId?: string | null, beforeId?: string | null) => {
    try {
      setLoading(true);
      let queryParams = `limit: ${limit}`;
      if (afterId) {
        queryParams += `, afterId: "${afterId}"`;
      }
      if (beforeId) {
        queryParams += `, beforeId: "${beforeId}"`;
      }

      const query = `
        query { 
          storeTransactions(${queryParams}) { 
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

      const result = await graphqlFetch<StoreTransactionsResponse>(query);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      if (result.data?.storeTransactions) {
        const { transactions: txns, total: totalCount, limit: pageLimit, nextAfterId: nextId, previousBeforeId: prevId } = result.data.storeTransactions;
        setTransactions(txns);
        setTotal(totalCount);
        setLimit(pageLimit);
        setNextAfterId(nextId);
        setPreviousBeforeId(prevId);
      }
    } catch (error) {
      console.error('Error fetching store transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized || !isAdmin) return;
    fetchTransactions();
  }, [isInitialized, isAdmin]);

  // Fetch all rent payment transactions to calculate totals
  useEffect(() => {
    if (!isInitialized || !onRentStatsChange || !isAdmin) return;

    const fetchAllRentTransactions = async () => {
      try {
        const query = `
          query { 
            storeTransactions(limit: 1000) { 
              transactions {
                trxType
                amount
                isCollected
              }
            } 
          }
        `;

        const result = await graphqlFetch<StoreTransactionsResponse>(query);

        if (result.data?.storeTransactions) {
          const rentTransactions = result.data.storeTransactions.transactions.filter(
            tx => tx.trxType === 'rent_payment'
          );
          
          const totalDue = rentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
          const totalPaid = rentTransactions.filter(tx => tx.isCollected).reduce((sum, tx) => sum + tx.amount, 0);
          
          onRentStatsChange({ totalDue, totalPaid });
        }
      } catch (error) {
        console.error('Error fetching rent statistics:', error);
      }
    };

    fetchAllRentTransactions();
  }, [isInitialized, onRentStatsChange]);

  const handleNextPage = () => {
    if (nextAfterId) {
      setCurrentAfterId(nextAfterId);
      setCurrentBeforeId(null);
      fetchTransactions(nextAfterId, null);
    }
  };

  const handlePreviousPage = () => {
    if (previousBeforeId) {
      setCurrentBeforeId(previousBeforeId);
      setCurrentAfterId(null);
      fetchTransactions(null, previousBeforeId);
    }
  };

  const handleFirstPage = () => {
    setCurrentAfterId(null);
    setCurrentBeforeId(null);
    fetchTransactions();
  };

  const currentPage = currentAfterId || currentBeforeId ? Math.floor(((total - (transactions.length || limit)) / limit)) + 1 : 1;
  const totalPages = Math.ceil(total / limit);

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'rent_payment':
        return 'Rent Payment';
      case 'income_received':
        return 'Income Received';
      case 'others':
        return 'Other';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <Card className="overflow-hidden" hover={false}>
      <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Administrative Transactions
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Rent payments, income received, and other administrative transactions
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                Order ID
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.date}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                Type
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                From
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                To
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                Notes
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.amount}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.collected}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 md:px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {transaction.orderId}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(transaction.created).toLocaleDateString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-900 dark:text-white">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {getTransactionTypeLabel(transaction.trxType)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {transaction.fromUser?.name || '-'}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {transaction.toUser?.name || '-'}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {transaction.notes || '-'}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.isCollected
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {transaction.isCollected ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {transaction.isCollected ? (t.gridStoreAdmin.dashboard.table.yes || 'Yes') : (t.gridStoreAdmin.dashboard.table.no || 'No')}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No administrative transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {transactions.length > 0 ? 1 : 0}-{transactions.length} of {total} transactions
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFirstPage}
            disabled={currentAfterId === null && currentBeforeId === null}
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            First
          </button>
          <button
            onClick={handlePreviousPage}
            disabled={!previousBeforeId}
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 rounded-lg">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={!nextAfterId}
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}
