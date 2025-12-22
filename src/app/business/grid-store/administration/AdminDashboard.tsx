'use client';

import React from 'react';
import { Users, Grid3X3, DollarSign, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';
import type { AdminTab, RevenueEntry, GridStore, Lessor, Cashier, Location } from './page';

interface AdminDashboardProps {
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  revenueEntries: RevenueEntry[];
  setRevenueEntries: React.Dispatch<React.SetStateAction<RevenueEntry[]>>;
  showRevenueModal: boolean;
  setShowRevenueModal: (show: boolean) => void;
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
  mockGridStores: GridStore[];
  mockLessors: Lessor[];
  mockCashiers: Cashier[];
  mockLocations: Location[];
  getAllUsers: () => { id: string; name: string; email: string; role: 'lessor' | 'cashier'; phone?: string; assignedGrids?: number; locationId?: string; locationName?: string; }[];
  handleCreateUser: () => void;
  handleEditUser: (user: any) => void;
  openRevenueModal: () => void;
  saveRevenue: () => void;
  toggleCollected: (id: string) => void;
  showAssignModal: boolean;
  setShowAssignModal: (show: boolean) => void;
  selectedGridForAssign: string | null;
  setSelectedGridForAssign: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLessorForAssign: string;
  setSelectedLessorForAssign: React.Dispatch<React.SetStateAction<string>>;
  confirmAssign: () => void;
  showUserModal: boolean;
  setShowUserModal: (show: boolean) => void;
  editingUser: any;
  setEditingUser: React.Dispatch<React.SetStateAction<any>>;
  userForm: { name: string; email: string; phone: string; role: 'lessor' | 'cashier'; locationId: string; };
  setUserForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; phone: string; role: 'lessor' | 'cashier'; locationId: string; }>>;
  handleSaveUser: () => void;
  showGridModal: boolean;
  setShowGridModal: (show: boolean) => void;
  editingGrid: GridStore | null;
  setEditingGrid: React.Dispatch<React.SetStateAction<GridStore | null>>;
  gridForm: { gridNumber: string; size: string; gridPrice: number; startDate: string; lessorId: string; locationId: string; };
  setGridForm: React.Dispatch<React.SetStateAction<{ gridNumber: string; size: string; gridPrice: number; startDate: string; lessorId: string; locationId: string; }>>;
  handleCreateGrid: () => void;
  handleEditGrid: (grid: GridStore) => void;
  handleSaveGrid: () => void;
}

export default function AdminDashboard({
  adminTab,
  setAdminTab,
  revenueEntries,
  setRevenueEntries,
  showRevenueModal,
  setShowRevenueModal,
  revenueForm,
  setRevenueForm,
  mockGridStores,
  mockLessors,
  mockCashiers,
  mockLocations,
  getAllUsers,
  handleCreateUser,
  handleEditUser,
  openRevenueModal,
  saveRevenue,
  toggleCollected,
  showAssignModal,
  setShowAssignModal,
  selectedGridForAssign,
  setSelectedGridForAssign,
  selectedLessorForAssign,
  setSelectedLessorForAssign,
  confirmAssign,
  showUserModal,
  setShowUserModal,
  editingUser,
  setEditingUser,
  userForm,
  setUserForm,
  handleSaveUser,
  showGridModal,
  setShowGridModal,
  editingGrid,
  setEditingGrid,
  gridForm,
  setGridForm,
  handleCreateGrid,
  handleEditGrid,
  handleSaveGrid,
}: AdminDashboardProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Admin Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          {[
            { key: 'user-management', label: t.gridStoreAdmin.tabs.userManagement, icon: Users },
            { key: 'grid-management', label: t.gridStoreAdmin.tabs.gridManagement, icon: Grid3X3 },
            { key: 'revenue-management', label: t.gridStoreAdmin.tabs.revenueManagement, icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setAdminTab(tab.key as AdminTab)}
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

      {/* User Management Tab (Admin Only) */}
      {adminTab === 'user-management' && (
        <UserManagement users={getAllUsers()} onCreate={handleCreateUser} onEdit={handleEditUser} />
      )}

      {/* Grid Management Tab (Admin Only) */}
      {adminTab === 'grid-management' && (
        <GridManagement role="admin" grids={mockGridStores} lessors={mockLessors} locations={mockLocations} />
      )}

      {/* Revenue Management Tab (Admin Only) */}
      {adminTab === 'revenue-management' && (
        <div>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.revenueManagement.title}
              </h3>
              <button
                onClick={openRevenueModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t.gridStoreAdmin.revenueManagement.addRecord}
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.date}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.type}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.gridNumber}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.handler}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.item}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.amount}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.collected}</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-3 px-4"><span className="text-slate-900 dark:text-white">{entry.date}</span></td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === 'grid-rent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}> 
                          {entry.type === 'grid-rent' ? t.gridStoreAdmin.revenueManagement.table.typeGridRent : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                        </span>
                      </td>
                      <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{entry.gridNumber}</span></td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300">
                          {entry.handlerName ? `${entry.handlerName} (${entry.handlerRole === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title})` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{entry.itemName || '-'}</span></td>
                      <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${entry.amount}</span></td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.collected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                          {entry.collected ? t.gridStoreAdmin.revenueManagement.table.yes : t.gridStoreAdmin.revenueManagement.table.no}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleCollected(entry.id)}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        >
                          {entry.collected ? t.gridStoreAdmin.revenueManagement.table.markUncollected : t.gridStoreAdmin.revenueManagement.table.markCollected}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {revenueEntries.map((entry) => (
                <div key={entry.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{entry.gridNumber}</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{entry.date}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${entry.type === 'grid-rent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}> 
                      {entry.type === 'grid-rent' ? t.gridStoreAdmin.revenueManagement.table.typeGridRent : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                    </span>
                  </div>
                  <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                    {entry.handlerName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.handler}:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{`${entry.handlerName} (${entry.handlerRole === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title})`}</span>
                      </div>
                    )}
                    {entry.itemName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.item}:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{entry.itemName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.amount}:</span>
                      <span className="font-bold text-slate-900 dark:text-white">${entry.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.collected}:</span>
                      <span className={`font-medium ${entry.collected ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>{entry.collected ? t.gridStoreAdmin.revenueManagement.table.yes : t.gridStoreAdmin.revenueManagement.table.no}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => toggleCollected(entry.id)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {entry.collected ? t.gridStoreAdmin.revenueManagement.table.markUncollected : t.gridStoreAdmin.revenueManagement.table.markCollected}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Revenue Modal */}
          {showRevenueModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t.gridStoreAdmin.revenueManagement.modal.title}
                  </h3>
                  <button onClick={() => setShowRevenueModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.date}</label>
                    <input type="date" value={revenueForm.date} onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.type}</label>
                    <select value={revenueForm.type} onChange={(e) => setRevenueForm({ ...revenueForm, type: e.target.value as 'grid-rent' | 'item-sale' })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                      <option value="grid-rent">{t.gridStoreAdmin.revenueManagement.table.typeGridRent}</option>
                      <option value="item-sale">{t.gridStoreAdmin.revenueManagement.table.typeItemSale}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.grid}</label>
                    <select value={revenueForm.gridId} onChange={(e) => setRevenueForm({ ...revenueForm, gridId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                      <option value="">{t.gridStoreAdmin.revenueManagement.modal.selectGrid}</option>
                      {mockGridStores.map((g) => (
                        <option key={g.id} value={g.id}>{g.gridNumber} - {g.locationName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.handlerRole}</label>
                      <select value={revenueForm.handlerRole} onChange={(e) => setRevenueForm({ ...revenueForm, handlerRole: e.target.value as 'lessor' | 'cashier', handlerId: '' })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                        <option value="lessor">{t.gridStoreAdmin.roles.lessor.title}</option>
                        <option value="cashier">{t.gridStoreAdmin.roles.cashier.title}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.handler}</label>
                      <select value={revenueForm.handlerId} onChange={(e) => setRevenueForm({ ...revenueForm, handlerId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                        <option value="">{t.gridStoreAdmin.revenueManagement.modal.selectHandler}</option>
                        {(revenueForm.handlerRole === 'lessor' ? mockLessors : mockCashiers).map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {revenueForm.type === 'item-sale' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.itemName}</label>
                      <input type="text" value={revenueForm.itemName} onChange={(e) => setRevenueForm({ ...revenueForm, itemName: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.amount}</label>
                      <input type="number" value={revenueForm.amount} onChange={(e) => setRevenueForm({ ...revenueForm, amount: Number(e.target.value) })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="collected" type="checkbox" checked={revenueForm.collected} onChange={(e) => setRevenueForm({ ...revenueForm, collected: e.target.checked })} className="w-4 h-4" />
                      <label htmlFor="collected" className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.modal.collected}</label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowRevenueModal(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    {t.gridStoreAdmin.revenueManagement.modal.cancel}
                  </button>
                  <button onClick={saveRevenue} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    {t.gridStoreAdmin.revenueManagement.modal.create}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {t.gridStoreAdmin.modal.assignTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t.gridStoreAdmin.modal.assignDescription}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.gridStoreAdmin.modal.selectLessor}
              </label>
              <select
                value={selectedLessorForAssign}
                onChange={(e) => setSelectedLessorForAssign(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="">{t.gridStoreAdmin.modal.selectPlaceholder}</option>
                {mockLessors.map((lessor) => (
                  <option key={lessor.id} value={lessor.id}>
                    {lessor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t.gridStoreAdmin.modal.cancel}
              </button>
              <button
                onClick={confirmAssign}
                disabled={!selectedLessorForAssign}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.gridStoreAdmin.modal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingUser ? t.gridStoreAdmin.userModal.editTitle : t.gridStoreAdmin.userModal.createTitle}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.userModal.name}
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder={t.gridStoreAdmin.userModal.namePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.userModal.email}
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder={t.gridStoreAdmin.userModal.emailPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.userModal.phone}
                </label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder={t.gridStoreAdmin.userModal.phonePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.userModal.role}
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'lessor' | 'cashier' })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="lessor">{t.gridStoreAdmin.roles.lessor.title}</option>
                  <option value="cashier">{t.gridStoreAdmin.roles.cashier.title}</option>
                </select>
              </div>

              {userForm.role === 'cashier' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t.gridStoreAdmin.userModal.location}
                  </label>
                  <select
                    value={userForm.locationId}
                    onChange={(e) => setUserForm({ ...userForm, locationId: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="">{t.gridStoreAdmin.userModal.selectLocation}</option>
                    {mockLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t.gridStoreAdmin.modal.cancel}
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingUser ? t.gridStoreAdmin.userModal.update : t.gridStoreAdmin.userModal.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Management Modal */}
      {showGridModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingGrid ? t.gridStoreAdmin.gridModal.editTitle : t.gridStoreAdmin.gridModal.createTitle}
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.gridNumber}
                </label>
                <input
                  type="text"
                  value={gridForm.gridNumber}
                  onChange={(e) => setGridForm({ ...gridForm, gridNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder={t.gridStoreAdmin.gridModal.gridNumberPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.size}
                </label>
                <select
                  value={gridForm.size}
                  onChange={(e) => setGridForm({ ...gridForm, size: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Small">{t.gridStoreAdmin.gridModal.sizeSmall}</option>
                  <option value="Medium">{t.gridStoreAdmin.gridModal.sizeMedium}</option>
                  <option value="Large">{t.gridStoreAdmin.gridModal.sizeLarge}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.price}
                </label>
                <input
                  type="number"
                  value={gridForm.gridPrice}
                  onChange={(e) => setGridForm({ ...gridForm, gridPrice: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder={t.gridStoreAdmin.gridModal.pricePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.startDate}
                </label>
                <input
                  type="date"
                  value={gridForm.startDate}
                  onChange={(e) => setGridForm({ ...gridForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.assignLessor}
                </label>
                <select
                  value={gridForm.lessorId}
                  onChange={(e) => setGridForm({ ...gridForm, lessorId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">{t.gridStoreAdmin.gridModal.selectLessor}</option>
                  {mockLessors.map((lessor) => (
                    <option key={lessor.id} value={lessor.id}>
                      {lessor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.gridStoreAdmin.gridModal.assignLocation}
                </label>
                <select
                  value={gridForm.locationId}
                  onChange={(e) => setGridForm({ ...gridForm, locationId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">{t.gridStoreAdmin.gridModal.selectLocation}</option>
                  {mockLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGridModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t.gridStoreAdmin.modal.cancel}
              </button>
              <button
                onClick={handleSaveGrid}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingGrid ? t.gridStoreAdmin.gridModal.update : t.gridStoreAdmin.gridModal.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}