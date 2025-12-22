'use client';

import React, { useState } from 'react';
import { Shield, Users, CreditCard, Store, Grid3X3, UserPlus, Eye, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Trash2, Plus, X, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';

// Mock data for demonstration
type Role = 'admin' | 'lessor' | 'cashier';
type UserRole = 'lessor' | 'cashier';
type AdminTab = 'user-management' | 'grid-management' | 'revenue-management';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface GridStore {
  id: string;
  gridNumber: string;
  size: string;
  status: 'available' | 'rented';
  lessorId?: string;
  lessorName?: string;
  tenant?: string;
  monthlyRent?: number;
  gridPrice?: number;
  startDate?: string;
  endDate?: string;
  locationId?: string;
  locationName?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  assignedGrids?: number;
  locationId?: string; // For cashiers
  locationName?: string;
}

interface Lessor {
  id: string;
  name: string;
  email: string;
  assignedGrids: number;
}

interface Cashier {
  id: string;
  name: string;
  email: string;
  locationId: string;
  locationName: string;
}

interface RevenueEntry {
  id: string;
  date: string;
  type: 'grid-rent' | 'item-sale';
  gridId: string;
  gridNumber: string;
  handlerName?: string;
  handlerRole?: 'lessor' | 'cashier';
  itemName?: string;
  amount: number;
  collected: boolean;
  locationName?: string;
}

const mockLocations: Location[] = [
  { id: 'LOC1', name: 'Hung Hom Store', address: 'Shop G1B, 3/F, Kaiser Estate Phase 2, Hung Hom' },
  { id: 'LOC2', name: 'Mong Kok Store', address: 'Shop 123, Mong Kok, Kowloon' },
];

const mockGridStores: GridStore[] = [
  { id: '1', gridNumber: 'A-01', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L1', lessorName: 'John Doe', tenant: 'Card Collection Shop', monthlyRent: 1500, startDate: '2025-01-01', endDate: '2025-12-31', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '2', gridNumber: 'A-02', size: 'Medium', gridPrice: 2000, status: 'available', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '3', gridNumber: 'A-03', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L2', lessorName: 'Jane Smith', tenant: 'Vintage Toys', monthlyRent: 1500, startDate: '2025-02-01', endDate: '2025-07-31', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '4', gridNumber: 'B-01', size: 'Large', gridPrice: 2500, status: 'rented', lessorId: 'L1', lessorName: 'John Doe', tenant: 'Pokemon Center', monthlyRent: 2500, startDate: '2025-01-15', endDate: '2026-01-14', locationId: 'LOC2', locationName: 'Mong Kok Store' },
  { id: '5', gridNumber: 'B-02', size: 'Medium', gridPrice: 2000, status: 'available', locationId: 'LOC2', locationName: 'Mong Kok Store' },
  { id: '6', gridNumber: 'B-03', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L3', lessorName: 'Mike Johnson', tenant: 'Hobby Store', monthlyRent: 1500, startDate: '2025-03-01', endDate: '2025-08-31', locationId: 'LOC2', locationName: 'Mong Kok Store' },
];

const mockLessors: Lessor[] = [
  { id: 'L1', name: 'John Doe', email: 'john@example.com', assignedGrids: 2 },
  { id: 'L2', name: 'Jane Smith', email: 'jane@example.com', assignedGrids: 1 },
  { id: 'L3', name: 'Mike Johnson', email: 'mike@example.com', assignedGrids: 1 },
];

const mockCashiers: Cashier[] = [
  { id: 'C1', name: 'Emily Wong', email: 'emily@example.com', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: 'C2', name: 'David Lee', email: 'david@example.com', locationId: 'LOC2', locationName: 'Mong Kok Store' },
];

const initialRevenueEntries: RevenueEntry[] = [
  // Grid Rent entries (paid by lessor)
  { id: 'R1', date: '2025-01-01', type: 'grid-rent', gridId: '1', gridNumber: 'A-01', handlerName: 'John Doe', handlerRole: 'lessor', amount: 1500, collected: true, locationName: 'Hung Hom Store' },
  { id: 'R2', date: '2025-02-01', type: 'grid-rent', gridId: '3', gridNumber: 'A-03', handlerName: 'Jane Smith', handlerRole: 'lessor', amount: 1500, collected: false, locationName: 'Hung Hom Store' },
  { id: 'R3', date: '2025-01-15', type: 'grid-rent', gridId: '4', gridNumber: 'B-01', handlerName: 'John Doe', handlerRole: 'lessor', amount: 2500, collected: true, locationName: 'Mong Kok Store' },
  // Item Sales entries (sold by cashier)
  { id: 'S1', date: '2025-01-10', type: 'item-sale', gridId: '1', gridNumber: 'A-01', handlerName: 'Emily Wong', handlerRole: 'cashier', itemName: 'PSA 10 Charizard', amount: 3200, collected: true, locationName: 'Hung Hom Store' },
  { id: 'S2', date: '2025-03-05', type: 'item-sale', gridId: '6', gridNumber: 'B-03', handlerName: 'David Lee', handlerRole: 'cashier', itemName: 'Vintage Toy Set', amount: 880, collected: false, locationName: 'Mong Kok Store' },
];

export default function GridStoreAdministrationPage() {
  const { t } = useLanguage();
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('user-management');
  const [selectedLessorId, setSelectedLessorId] = useState<string>('L1');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('LOC1');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGridForAssign, setSelectedGridForAssign] = useState<string | null>(null);
  const [selectedLessorForAssign, setSelectedLessorForAssign] = useState<string>('');
  
  // User Management States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'lessor' as UserRole, locationId: '' });
  
  // Grid Management States
  const [showGridModal, setShowGridModal] = useState(false);
  const [editingGrid, setEditingGrid] = useState<GridStore | null>(null);
  const [gridForm, setGridForm] = useState({ 
    gridNumber: '', 
    size: 'Small', 
    gridPrice: 0,
    startDate: '',
    lessorId: '', 
    locationId: '' 
  });

  // Revenue Management State
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>(initialRevenueEntries);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueForm, setRevenueForm] = useState({
    date: '',
    type: 'grid-rent' as 'grid-rent' | 'item-sale',
    gridId: '',
    handlerRole: 'lessor' as 'lessor' | 'cashier',
    handlerId: '',
    itemName: '',
    amount: 0,
    collected: false,
  });

  const handleAssignGrid = (gridId: string) => {
    setSelectedGridForAssign(gridId);
    setShowAssignModal(true);
  };

  const confirmAssign = () => {
    console.log(`Assigning grid ${selectedGridForAssign} to lessor ${selectedLessorForAssign}`);
    setShowAssignModal(false);
    setSelectedGridForAssign(null);
    setSelectedLessorForAssign('');
  };

  // User Management Functions
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', phone: '', role: 'lessor', locationId: '' });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, locationId: user.locationId || '' });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    console.log('Saving user:', userForm);
    setShowUserModal(false);
  };

  // Grid Management Functions
  const handleCreateGrid = () => {
    setEditingGrid(null);
    setGridForm({ gridNumber: '', size: 'Small', gridPrice: 0, startDate: '', lessorId: '', locationId: '' });
    setShowGridModal(true);
  };

  const handleEditGrid = (grid: GridStore) => {
    setEditingGrid(grid);
    setGridForm({ 
      gridNumber: grid.gridNumber, 
      size: grid.size, 
      gridPrice: grid.gridPrice || 0,
      startDate: grid.startDate || '',
      lessorId: grid.lessorId || '', 
      locationId: grid.locationId || '' 
    });
    setShowGridModal(true);
  };

  const handleSaveGrid = () => {
    console.log('Saving grid:', gridForm);
    setShowGridModal(false);
  };

  const toggleCollected = (id: string) => {
    setRevenueEntries(prev => prev.map(e => e.id === id ? { ...e, collected: !e.collected } : e));
  };

  const openRevenueModal = () => {
    setRevenueForm({ date: '', type: 'grid-rent', gridId: '', handlerRole: 'lessor', handlerId: '', itemName: '', amount: 0, collected: false });
    setShowRevenueModal(true);
  };

  const saveRevenue = () => {
    const grid = mockGridStores.find(g => g.id === revenueForm.gridId);
    if (!grid) {
      setShowRevenueModal(false);
      return;
    }
    let handlerName = '';
    if (revenueForm.handlerRole === 'lessor') {
      const h = mockLessors.find(l => l.id === revenueForm.handlerId);
      handlerName = h?.name || '';
    } else {
      const h = mockCashiers.find(c => c.id === revenueForm.handlerId);
      handlerName = h?.name || '';
    }
    const newEntry: RevenueEntry = {
      id: `${Date.now()}`,
      date: revenueForm.date || new Date().toISOString().slice(0, 10),
      type: revenueForm.type,
      gridId: grid.id,
      gridNumber: grid.gridNumber,
      handlerName,
      handlerRole: revenueForm.handlerRole,
      itemName: revenueForm.type === 'item-sale' ? revenueForm.itemName : undefined,
      amount: revenueForm.amount,
      collected: revenueForm.collected,
      locationName: grid.locationName,
    };
    setRevenueEntries(prev => [newEntry, ...prev]);
    setShowRevenueModal(false);
  };

  const getFilteredGrids = () => {
    if (currentRole === 'admin') {
      return mockGridStores;
    } else if (currentRole === 'lessor') {
      return mockGridStores.filter(grid => grid.lessorId === selectedLessorId);
    } else {
      // Cashier sees all grids in their assigned location
      return mockGridStores.filter(grid => grid.locationId === selectedLocationId && grid.status === 'rented');
    }
  };

  const getAllUsers = (): User[] => {
    return [
      ...mockLessors.map(l => ({ ...l, role: 'lessor' as UserRole })),
      ...mockCashiers.map(c => ({ ...c, role: 'cashier' as UserRole }))
    ];
  };

  return (
    <div className="flex flex-col">

      {/* Role Selector, Should only be visible to admins */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container-custom">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {t.gridStoreAdmin.dashboard.selectRole}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.gridStoreAdmin.dashboard.demoMode}
              </p>
            </div>
            <div className="flex gap-3">
              {(['admin', 'lessor', 'cashier'] as Role[]).map((role) => {
                const isActive = currentRole === role;
                const roleConfig = {
                  admin: { icon: Shield, color: 'blue' },
                  lessor: { icon: Users, color: 'green' },
                  cashier: { icon: CreditCard, color: 'purple' },
                };
                const Icon = roleConfig[role].icon;
                const color = roleConfig[role].color;

                return (
                  <button
                    key={role}
                    onClick={() => setCurrentRole(role)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? `bg-${color}-500 text-white shadow-lg`
                        : `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.gridStoreAdmin.roles[role].title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional filters for lessor/cashier */}
          {currentRole === 'lessor' && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.gridStoreAdmin.dashboard.viewingAs}
              </label>
              <select
                value={selectedLessorId}
                onChange={(e) => setSelectedLessorId(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                {mockLessors.map((lessor) => (
                  <option key={lessor.id} value={lessor.id}>
                    {lessor.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentRole === 'cashier' && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.gridStoreAdmin.dashboard.viewingLocation}
              </label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                {mockLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {mockLocations.find(l => l.id === selectedLocationId)?.address}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container-custom">
          {/* Admin Tabs */}
          {currentRole === 'admin' && (
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
          )}

          {/* User Management Tab (Admin Only) */}
          {currentRole === 'admin' && adminTab === 'user-management' && (
            <UserManagement users={getAllUsers()} onCreate={handleCreateUser} onEdit={handleEditUser} />
          )}

          {/* Grid Management Tab (Admin Only) */}
          {currentRole === 'admin' && adminTab === 'grid-management' && (
            <GridManagement role={currentRole} grids={mockGridStores} lessors={mockLessors} locations={mockLocations} />
          )}

          {/* Revenue Management Tab (Admin Only) */}
          {currentRole === 'admin' && adminTab === 'revenue-management' && (
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
                        <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
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

          {/* Stats Cards for Lessor/Cashier */}
          {currentRole !== 'admin' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {t.gridStoreAdmin.dashboard.stats.totalGrids}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {getFilteredGrids().length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Grid3X3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {t.gridStoreAdmin.dashboard.stats.rented}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {getFilteredGrids().filter(g => g.status === 'rented').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {t.gridStoreAdmin.dashboard.stats.available}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {getFilteredGrids().filter(g => g.status === 'available').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6 col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {t.gridStoreAdmin.dashboard.stats.revenue}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        ${getFilteredGrids().reduce((sum, g) => sum + (g.monthlyRent || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Grid Management Table */}
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    {currentRole === 'lessor' && t.gridStoreAdmin.dashboard.myAssignedGrids}
                    {currentRole === 'cashier' && t.gridStoreAdmin.dashboard.gridsToProcess}
                  </h3>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.gridNumber}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.size}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.status}
                        </th>
                        {currentRole !== 'cashier' && (
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t.gridStoreAdmin.dashboard.table.lessor}
                          </th>
                        )}
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.tenant}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.rent}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.gridStoreAdmin.dashboard.table.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                  {getFilteredGrids().map((grid) => (
                    <tr key={grid.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900 dark:text-white">{grid.gridNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300">{grid.size}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          grid.status === 'rented'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {grid.status === 'rented' ? t.gridStoreAdmin.dashboard.table.statusRented : t.gridStoreAdmin.dashboard.table.statusAvailable}
                        </span>
                      </td>
                      {currentRole !== 'cashier' && (
                        <td className="py-3 px-4">
                          <span className="text-slate-700 dark:text-slate-300">
                            {grid.lessorName || '-'}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300">
                          {grid.tenant || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-900 dark:text-white font-medium">
                          {grid.monthlyRent ? `$${grid.monthlyRent}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {currentRole === 'lessor' && (
                            <button
                              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title={t.gridStoreAdmin.dashboard.table.view}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {currentRole === 'cashier' && grid.status === 'rented' && (
                            <button
                              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              {t.gridStoreAdmin.dashboard.table.processPayment}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {getFilteredGrids().map((grid) => (
                    <div key={grid.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{grid.gridNumber}</h4>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{grid.size}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          grid.status === 'rented'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {grid.status === 'rented' ? t.gridStoreAdmin.dashboard.table.statusRented : t.gridStoreAdmin.dashboard.table.statusAvailable}
                        </span>
                      </div>
                      <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                        {currentRole !== 'cashier' && grid.lessorName && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.table.lessor}:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{grid.lessorName}</span>
                          </div>
                        )}
                        {grid.tenant && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.table.tenant}:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{grid.tenant}</span>
                          </div>
                        )}
                        {grid.monthlyRent && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.table.rent}:</span>
                            <span className="font-bold text-slate-900 dark:text-white">${grid.monthlyRent}</span>
                          </div>
                        )}
                      </div>
                      {(currentRole === 'lessor' || (currentRole === 'cashier' && grid.status === 'rented')) && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                          {currentRole === 'lessor' && (
                            <button
                              className="w-full px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center"
                            >
                              <Eye className="w-4 h-4" />
                              <span>{t.gridStoreAdmin.dashboard.table.view}</span>
                            </button>
                          )}
                          {currentRole === 'cashier' && grid.status === 'rented' && (
                            <button
                              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              {t.gridStoreAdmin.dashboard.table.processPayment}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </section>

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
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
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
    </div>
  );
}