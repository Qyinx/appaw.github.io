'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import MyGrids from '@/components/grid-store/MyGrids';
import type { GridStore, Cashier } from './page';

interface CashierDashboardProps {
  getFilteredGrids: () => GridStore[];
  selectedCashierId: string;
  mockCashiers: Cashier[];
  isAdmin?: boolean;
  delegateUserId?: string;
  onDelegateUserIdChange?: (userId: string) => void;
}

export default function CashierDashboard({ 
  getFilteredGrids, 
  selectedCashierId, 
  mockCashiers,
  isAdmin = false,
  delegateUserId = '',
  onDelegateUserIdChange
}: CashierDashboardProps) {
  const { t } = useLanguage();
  const cashier = mockCashiers.find((c) => c.id === selectedCashierId);

  return (
    <>
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.currentCashier || 'Current Cashier'}</h3>
            <p className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">{cashier?.name}</p>
          </div>
          <div className="text-right text-sm text-slate-600 dark:text-slate-400">
            {cashier?.locationName}
          </div>
        </div>
      </div>

      <MyGrids 
        grids={getFilteredGrids()} 
        showStats={true} 
        showActions={false}
        isAdmin={isAdmin}
        delegateUserId={delegateUserId}
        onDelegateUserIdChange={onDelegateUserIdChange}
      />
    </>
  );
}
