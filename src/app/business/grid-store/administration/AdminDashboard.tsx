'use client';

import React from 'react';
import { Grid3X3, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';
import StoreTransactions from '@/components/grid-store/StoreTransactions';
import GridTransactions from '@/components/grid-store/GridTransactions';
import StoreManagement from '@/components/grid-store/StoreManagement';
import type {
  AdminTab,
  RevenueEntry,
  GridStore,
  Lessor,
  Cashier,
  Location,
  User,
  Tab,
} from './page';

interface AdminDashboardProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  getAllUsers: () => User[];
  handleCreateUser: () => void;
  handleEditUser: (user: User) => void;
  mockGridStores: GridStore[];
  mockLessors: Lessor[];
  mockCashiers: Cashier[];
  mockLocations: Location[];
  revenueEntries: RevenueEntry[];
  setRevenueEntries: React.Dispatch<React.SetStateAction<RevenueEntry[]>>;
  toggleCollected: (id: string) => void;
  showAssignModal: boolean;
  setShowAssignModal: (show: boolean) => void;
  openStoreTransactionModal: () => void;
  openGridTransactionModal: () => void;
  activeRevenueModal: 'store' | 'grid' | null;
  closeRevenueModal: (show?: boolean) => void;
  showRevenueModal: boolean;
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
  saveRevenue: () => void;
  showUserModal: boolean;
  setShowUserModal: (show: boolean) => void;
  userForm: { name: string; email: string; phone: string; role: 'lessor' | 'cashier'; locationId: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string; role: 'lessor' | 'cashier'; locationId: string }>>;
  handleSaveUser: () => void;
  editingUser: User | null;
  setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
  showGridModal: boolean;
  setShowGridModal: (show: boolean) => void;
  gridForm: { gridNumber: string; size: string; gridPrice: number; startDate: string; lessorId: string; locationId: string };
  setGridForm: React.Dispatch<React.SetStateAction<{ gridNumber: string; size: string; gridPrice: number; startDate: string; lessorId: string; locationId: string }>>;
  handleSaveGrid: () => void;
  editingGrid: GridStore | null;
  setEditingGrid: React.Dispatch<React.SetStateAction<GridStore | null>>;
  handleCreateGrid: () => void;
  handleEditGrid: (grid: GridStore) => void;
  selectedGridForAssign: string | null;
  setSelectedGridForAssign: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLessorForAssign: string;
  setSelectedLessorForAssign: React.Dispatch<React.SetStateAction<string>>;
  confirmAssign: () => void;
}

export default function AdminDashboard({
  currentTab,
  onTabChange,
  getAllUsers,
  handleCreateUser,
  handleEditUser,
  mockGridStores,
  mockLessors,
  mockCashiers,
  mockLocations,
  revenueEntries,
  toggleCollected,
  openStoreTransactionModal,
  openGridTransactionModal,
  activeRevenueModal,
  closeRevenueModal,
  showRevenueModal,
  revenueForm,
  setRevenueForm,
  saveRevenue,
}: AdminDashboardProps) {
  const { t } = useLanguage();

  const tabs: Array<{ key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'user-management', label: t.gridStoreAdmin.tabs.userManagement, icon: Users },
    { key: 'grid-management', label: t.gridStoreAdmin.tabs.gridManagement, icon: Grid3X3 },
    { key: 'revenue-management', label: t.gridStoreAdmin.tabs.revenueManagement, icon: DollarSign },
    { key: 'store-management', label: 'Store Management', icon: Grid3X3 },
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

      {currentTab === 'user-management' && (
        <UserManagement onCreate={handleCreateUser} onEdit={handleEditUser} shouldFetch={true} />
      )}

      {currentTab === 'grid-management' && (
        <GridManagement />
      )}

      {currentTab === 'revenue-management' && (
        <div className="space-y-8">
          <StoreTransactions
            revenueEntries={revenueEntries}
            showModal={showRevenueModal && activeRevenueModal === 'store'}
            setShowModal={closeRevenueModal}
            revenueForm={revenueForm}
            setRevenueForm={setRevenueForm}
            gridStores={mockGridStores}
            lessors={mockLessors}
            onOpenModal={openStoreTransactionModal}
            onSave={saveRevenue}
            onToggleCollected={toggleCollected}
            canAddRecord={true}
          />

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
            canAddRecord={true}
          />
        </div>
      )}

      {currentTab === 'store-management' && (
        <StoreManagement />
      )}
    </>
  );
}
