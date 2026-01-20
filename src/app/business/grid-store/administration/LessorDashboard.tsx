'use client';

import React from 'react';
import { Grid3X3, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import MyGrids from '@/components/grid-store/MyGrids';
import StoreTransactions from '@/components/grid-store/StoreTransactions';
import GridTransactions from '@/components/grid-store/GridTransactions';
import type { Tab, RevenueEntry, GridStore, Product } from './page';

interface LessorDashboardProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedLessorId: string;
  getFilteredGrids: () => GridStore[];
  revenueEntries: RevenueEntry[];
  toggleCollected: (id: string) => void;
  mockGridStores: GridStore[];
  isAdmin?: boolean;
  delegateUserId?: string;
  onDelegateUserIdChange?: (userId: string) => void;
}

export default function LessorDashboard({
  currentTab,
  onTabChange,
  selectedLessorId,
  getFilteredGrids,
  revenueEntries,
  toggleCollected,
  mockGridStores,
  isAdmin = false,
  delegateUserId = '',
  onDelegateUserIdChange
}: LessorDashboardProps) {
  const { t } = useLanguage();
  const filteredRevenueEntries = revenueEntries.filter(
    (entry) => entry.handlerRole === 'lessor' && entry.handlerId === selectedLessorId
  );

  const tabs: Array<{ key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'grid-management', label: t.gridStoreAdmin.tabs.gridManagement, icon: Grid3X3 },
    { key: 'revenue-management', label: t.gridStoreAdmin.tabs.revenueManagement, icon: DollarSign },
  ];

  return (
    <>
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
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
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

      {currentTab === 'grid-management' && (
        <MyGrids 
          grids={getFilteredGrids()} 
          showStats={true} 
          showActions={true}
          ownerId={selectedLessorId}
          isAdmin={isAdmin}
          delegateUserId={delegateUserId}
          onDelegateUserIdChange={onDelegateUserIdChange}
        />
      )}

      {currentTab === 'revenue-management' && (
        <div className="space-y-8">
          <StoreTransactions
            revenueEntries={filteredRevenueEntries}
            showModal={false}
            setShowModal={() => {}}
            revenueForm={{
              date: '',
              type: 'grid-rent',
              gridId: '',
              handlerRole: 'lessor',
              handlerId: selectedLessorId,
              itemName: '',
              amount: 0,
              collected: false,
            }}
            setRevenueForm={() => {}}
            gridStores={mockGridStores}
            lessors={[]}
            onSave={() => {}}
            onToggleCollected={toggleCollected}
            canAddRecord={false}
            onOpenModal={undefined}
          />

          <GridTransactions
            revenueEntries={filteredRevenueEntries}
            showModal={false}
            setShowModal={() => {}}
            revenueForm={{
              date: '',
              type: 'grid-rent',
              gridId: '',
              handlerRole: 'lessor',
              handlerId: selectedLessorId,
              itemName: '',
              amount: 0,
              collected: false,
            }}
            setRevenueForm={() => {}}
            gridStores={mockGridStores}
            cashiers={[]}
            onOpenModal={undefined}
            onSave={() => {}}
            onToggleCollected={toggleCollected}
            canAddRecord={false}
          />
        </div>
      )}
    </>
  );
}
