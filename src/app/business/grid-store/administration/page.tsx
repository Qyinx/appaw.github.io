'use client';

import React, { useState } from 'react';
import { Shield, Users, CreditCard, Store, Grid3X3, UserPlus, Eye, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Trash2, Plus, X, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';
import AdminDashboard from './AdminDashboard';
import LessorDashboard from './LessorDashboard';
import CashierDashboard from './CashierDashboard';

// Mock data for demonstration
export type Role = 'admin' | 'lessor' | 'cashier';
export type UserRole = 'lessor' | 'cashier';
export type AdminTab = 'user-management' | 'grid-management' | 'revenue-management';
export type LessorTab = 'grid-management' | 'revenue-management' | 'product-management';

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface GridStore {
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  assignedGrids?: number;
  locationId?: string; // For cashiers
  locationName?: string;
}

export interface Lessor {
  id: string;
  name: string;
  email: string;
  assignedGrids: number;
}

export interface Cashier {
  id: string;
  name: string;
  email: string;
  locationId: string;
  locationName: string;
}

export interface RevenueEntry {
  id: string;
  date: string;
  type: 'grid-rent' | 'item-sale';
  gridId: string;
  gridNumber: string;
  handlerName?: string;
  handlerRole?: 'lessor' | 'cashier';
  handlerId?: string;
  itemName?: string;
  amount: number;
  collected: boolean;
  locationName?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  gridId: string;
  gridNumber: string;
  locationName: string;
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

const mockProducts: Product[] = [
  { id: 'P1', name: 'PSA 10 Charizard', description: 'Graded Pokemon card', price: 3200, gridId: '1', gridNumber: 'A-01', locationName: 'Hung Hom Store' },
  { id: 'P2', name: 'Vintage Toy Set', description: 'Collectible toys', price: 880, gridId: '6', gridNumber: 'B-03', locationName: 'Mong Kok Store' },
  { id: 'P3', name: 'Rare Comic Book', description: 'Limited edition comic', price: 1500, gridId: '4', gridNumber: 'B-01', locationName: 'Mong Kok Store' },
];

const initialRevenueEntries: RevenueEntry[] = [
  // Grid Rent entries (paid by lessor)
  { id: 'R1', date: '2025-01-01', type: 'grid-rent', gridId: '1', gridNumber: 'A-01', handlerName: 'John Doe', handlerRole: 'lessor', handlerId: 'L1', amount: 1500, collected: true, locationName: 'Hung Hom Store' },
  { id: 'R2', date: '2025-02-01', type: 'grid-rent', gridId: '3', gridNumber: 'A-03', handlerName: 'Jane Smith', handlerRole: 'lessor', handlerId: 'L2', amount: 1500, collected: false, locationName: 'Hung Hom Store' },
  { id: 'R3', date: '2025-01-15', type: 'grid-rent', gridId: '4', gridNumber: 'B-01', handlerName: 'John Doe', handlerRole: 'lessor', handlerId: 'L1', amount: 2500, collected: true, locationName: 'Mong Kok Store' },
  // Item Sales entries (sold by cashier)
  { id: 'S1', date: '2025-01-10', type: 'item-sale', gridId: '1', gridNumber: 'A-01', handlerName: 'Emily Wong', handlerRole: 'cashier', handlerId: 'C1', itemName: 'PSA 10 Charizard', amount: 3200, collected: true, locationName: 'Hung Hom Store' },
  { id: 'S2', date: '2025-03-05', type: 'item-sale', gridId: '6', gridNumber: 'B-03', handlerName: 'David Lee', handlerRole: 'cashier', handlerId: 'C2', itemName: 'Vintage Toy Set', amount: 880, collected: false, locationName: 'Mong Kok Store' },
];

export default function GridStoreAdministrationPage() {
  const { t } = useLanguage();
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('user-management');
  const [lessorTab, setLessorTab] = useState<LessorTab>('grid-management');
  const [selectedLessorId, setSelectedLessorId] = useState<string>('L1');
  const [selectedCashierId, setSelectedCashierId] = useState<string>('C1');
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

  // Product Management State
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, gridId: '' });

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

  // Product Management Functions
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: 0, gridId: '' });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, description: product.description, price: product.price, gridId: product.gridId });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    console.log('Saving product:', productForm);
    setShowProductModal(false);
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
      handlerId: revenueForm.handlerId,
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
      const selectedCashier = mockCashiers.find(c => c.id === selectedCashierId);
      return mockGridStores.filter(grid => grid.locationId === selectedCashier?.locationId && grid.status === 'rented');
    }
  };

  const getAllUsers = (): User[] => {
    return [
      ...mockLessors.map(l => ({ ...l, role: 'lessor' as UserRole })),
      ...mockCashiers.map(c => ({ ...c, role: 'cashier' as UserRole }))
    ];
  };

  const getFilteredProducts = () => {
    const lessorGrids = mockGridStores.filter(grid => grid.lessorId === selectedLessorId);
    return mockProducts.filter(product => lessorGrids.some(grid => grid.id === product.gridId));
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
                {t.gridStoreAdmin.dashboard.viewingAs}
              </label>
              <select
                value={selectedCashierId}
                onChange={(e) => setSelectedCashierId(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              >
                {mockCashiers.map((cashier) => (
                  <option key={cashier.id} value={cashier.id}>
                    {cashier.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {mockCashiers.find(c => c.id === selectedCashierId)?.locationName}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container-custom">
          {/* Admin Dashboard */}
          {currentRole === 'admin' && (
            <AdminDashboard
              adminTab={adminTab}
              setAdminTab={setAdminTab}
              getAllUsers={getAllUsers}
              handleCreateUser={handleCreateUser}
              handleEditUser={handleEditUser}
              mockGridStores={mockGridStores}
              mockLessors={mockLessors}
              mockCashiers={mockCashiers}
              mockLocations={mockLocations}
              revenueEntries={revenueEntries}
              setRevenueEntries={setRevenueEntries}
              toggleCollected={toggleCollected}
              showAssignModal={showAssignModal}
              setShowAssignModal={setShowAssignModal}
              openRevenueModal={openRevenueModal}
              showRevenueModal={showRevenueModal}
              setShowRevenueModal={setShowRevenueModal}
              revenueForm={revenueForm}
              setRevenueForm={setRevenueForm}
              saveRevenue={saveRevenue}
              showUserModal={showUserModal}
              setShowUserModal={setShowUserModal}
              userForm={userForm}
              setUserForm={setUserForm}
              handleSaveUser={handleSaveUser}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              showGridModal={showGridModal}
              setShowGridModal={setShowGridModal}
              gridForm={gridForm}
              setGridForm={setGridForm}
              handleSaveGrid={handleSaveGrid}
              editingGrid={editingGrid}
              setEditingGrid={setEditingGrid}
              handleCreateGrid={handleCreateGrid}
              handleEditGrid={handleEditGrid}
              selectedGridForAssign={selectedGridForAssign}
              setSelectedGridForAssign={setSelectedGridForAssign}
              selectedLessorForAssign={selectedLessorForAssign}
              setSelectedLessorForAssign={setSelectedLessorForAssign}
              confirmAssign={confirmAssign}
            />
          )}

          {/* Lessor Dashboard */}
          {currentRole === 'lessor' && (
            <LessorDashboard
              lessorTab={lessorTab}
              setLessorTab={setLessorTab}
              selectedLessorId={selectedLessorId}
              getFilteredGrids={getFilteredGrids}
              revenueEntries={revenueEntries}
              toggleCollected={toggleCollected}
              products={products}
              handleCreateProduct={handleCreateProduct}
              handleEditProduct={handleEditProduct}
              showProductModal={showProductModal}
              setShowProductModal={setShowProductModal}
              productForm={productForm}
              setProductForm={setProductForm}
              handleSaveProduct={handleSaveProduct}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              getFilteredProducts={getFilteredProducts}
              mockGridStores={mockGridStores}
            />
          )}

          {/* Cashier Dashboard */}
          {currentRole === 'cashier' && (
            <CashierDashboard
              getFilteredGrids={getFilteredGrids}
              selectedCashierId={selectedCashierId}
              mockCashiers={mockCashiers}
            />
          )}



        </div>
      </section>

    </div>
  );
}
