'use client';

import React from 'react';
import { DollarSign, QrCode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import GridTransactions from '@/components/grid-store/GridTransactions';
import ItemPaymentScanner from '@/components/grid-store/ItemPaymentScanner';
import { Card } from '@/components/ui';
import type { RevenueEntry, GridStore, Cashier, Tab } from '../types';

interface CashierDashboardProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  getFilteredGrids: () => GridStore[];
  selectedCashierId: string;
  mockCashiers: Cashier[];
  revenueEntries: RevenueEntry[];
  showRevenueModal: boolean;
  activeRevenueModal: 'store' | 'grid' | null;
  closeRevenueModal: (show?: boolean) => void;
  revenueForm: {
    date: string;
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: string;
    collected: boolean;
  };
  setRevenueForm: React.Dispatch<React.SetStateAction<{
    date: string;
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: string;
    collected: boolean;
  }>>;
  saveRevenue: () => void;
  toggleCollected: (id: string) => void;
  openGridTransactionModal: () => void;
  mockGridStores: GridStore[];
  isAdmin?: boolean;
}

export default function CashierDashboard({ 
  currentTab,
  onTabChange,
  getFilteredGrids, 
  selectedCashierId, 
  mockCashiers,
  revenueEntries,
  showRevenueModal,
  activeRevenueModal,
  closeRevenueModal,
  revenueForm,
  setRevenueForm,
  saveRevenue,
  toggleCollected,
  openGridTransactionModal,
  mockGridStores,
  isAdmin = false,
}: CashierDashboardProps) {
  const { t } = useLanguage();
  const cashier = mockCashiers.find((c) => c.id === selectedCashierId);

  const tabs = [
    { key: 'revenue-management', label: t.gridStoreAdmin.tabs.revenueManagement || 'Revenue Management', icon: DollarSign },
    { key: 'item-payment', label: 'Item Payment', icon: QrCode },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as Tab)}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Revenue Management Tab */}
      {currentTab === 'revenue-management' && (
        <GridTransactions
          revenueEntries={revenueEntries}
          showModal={showRevenueModal && activeRevenueModal === 'grid'}
          setShowModal={closeRevenueModal}
          revenueForm={revenueForm}
          setRevenueForm={setRevenueForm}
          gridStores={mockGridStores}
          cashiers={mockCashiers}
          onOpenModal={openGridTransactionModal}
          onSave={saveRevenue}
          onToggleCollected={toggleCollected}
          canAddRecord={false}
        />
      )}

      {/* Item Payment Tab */}
      {currentTab === 'item-payment' && (
        <ItemPaymentScanner 
          cashierId={selectedCashierId}
          cashierName={cashier?.name || ''}
        />
      )}
    </>
  );
}
