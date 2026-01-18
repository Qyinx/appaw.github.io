'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Users, CreditCard, Store, Grid3X3, UserPlus, Eye, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Trash2, Plus, X, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';
import AdminDashboard from './AdminDashboard';
import LessorDashboard from './LessorDashboard';
import CashierDashboard from './CashierDashboard';
import LesseeDashboard from './LesseeDashboard';
import AdminHeader from './AdminHeader';

export type Role = 'admin' | 'lessor' | 'cashier' | 'lessee';
export type UserRole = 'lessor' | 'cashier';
export type Tab = 'user-management' | 'grid-management' | 'revenue-management' | 'store-management' | 'product-management' | 'my-grids' | 'payment-history';

// Tab availability by role
export const tabsByRole: Record<Role, Tab[]> = {
  admin: ['user-management', 'grid-management', 'revenue-management', 'store-management'],
  lessor: ['grid-management', 'revenue-management'],
  cashier: ['my-grids'],
  lessee: ['my-grids', 'payment-history', 'product-management'],
};

// Deprecated - kept for backward compatibility
export type AdminTab = 'user-management' | 'grid-management' | 'revenue-management' | 'store-management';
export type LessorTab = 'grid-management' | 'revenue-management' | 'product-management';
export type LesseeTab = 'my-grids' | 'payment-history';

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface GridStore {
  id: string;
  storeId?: string;
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

export interface Lessee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rentedGridIds: string[];
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
  trxType?: string;
  notes?: string;
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

const mockLocations: Location[] = [];

const mockGridStores: GridStore[] = [];

const mockLessors: Lessor[] = [];

const mockCashiers: Cashier[] = [];

const mockLessees: Lessee[] = [];

const mockProducts: Product[] = [];

const initialRevenueEntries: RevenueEntry[] = [];

export default function GridStoreAdministrationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize from URL params
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [currentTab, setCurrentTab] = useState<Tab>('user-management');
  const [selectedLessorId, setSelectedLessorId] = useState<string>('L1');
  const [selectedCashierId, setSelectedCashierId] = useState<string>('C1');
  const [selectedLesseeId, setSelectedLesseeId] = useState<string>('LE1');
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
  const [activeRevenueModal, setActiveRevenueModal] = useState<'store' | 'grid' | null>(null);
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

  // Delegate User ID State (for admin's grid requests)
  const [delegateUserId, setDelegateUserId] = useState<string>('');

  const [loggedUser, setLoggedUser] = useState<{ name?: string; roles?: string[] | string } | null>(null);
  
  // Fetched users from API
  const [fetchedLessors, setFetchedLessors] = useState<Lessor[]>(mockLessors);
  const [fetchedCashiers, setFetchedCashiers] = useState<Cashier[]>(mockCashiers);
  const [fetchedLessees, setFetchedLessees] = useState<Lessee[]>(mockLessees);

  // Track if initial load is complete to prevent URL changes from re-initializing state
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth0_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setLoggedUser(parsed);
      }
    } catch (error) {
      console.warn('Failed to parse stored user', error);
    }
  }, []);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth0_token');
        if (!token) return;

        const response = await fetch('http://localhost:8787/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                users {
                  users {
                    id
                    name
                    mail
                    phone
                    roles
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.data?.users?.users) {
          const allUsers = result.data.users.users;
          
          // Filter users by role
          const lessors: Lessor[] = allUsers
            .filter((u: any) => u.roles.includes('lessor'))
            .map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.mail,
              assignedGrids: 0, // Could fetch this from grid data
            }));

          const lessees: Lessee[] = allUsers
            .filter((u: any) => u.roles.includes('lessee') || u.roles.includes('customer'))
            .map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.mail,
              phone: u.phone,
              rentedGridIds: [],
            }));

          const cashiers: Cashier[] = allUsers
            .filter((u: any) => u.roles.includes('cashier'))
            .map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.mail,
              locationId: '', // Would need location data from user
              locationName: '',
            }));

          if (lessors.length > 0) setFetchedLessors(lessors);
          if (lessees.length > 0) setFetchedLessees(lessees);
          if (cashiers.length > 0) setFetchedCashiers(cashiers);

          // Set initial selections
          if (lessors.length > 0) setSelectedLessorId(lessors[0].id);
          if (cashiers.length > 0) setSelectedCashierId(cashiers[0].id);
          if (lessees.length > 0) setSelectedLesseeId(lessees[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Keep using mock data as fallback
      }
    };

    fetchUsers();
  }, []);

  // Initialize state from URL parameters ONLY on first load
  useEffect(() => {
    if (isInitialized) return; // Skip if already initialized
    
    const role = (searchParams.get('role') as Role) || 'admin';
    const tabParam = searchParams.get('tab') as Tab | null;
    
    // Get available tabs for the role
    const availableTabs = tabsByRole[role];
    
    // Use provided tab if it's available for this role, otherwise use first tab
    let tab = tabParam && availableTabs.includes(tabParam) ? tabParam : availableTabs[0];
    
    setCurrentRole(role);
    setCurrentTab(tab);
    
    if (searchParams.has('lessorId')) {
      setSelectedLessorId(searchParams.get('lessorId') || 'L1');
    }
    if (searchParams.has('cashierId')) {
      setSelectedCashierId(searchParams.get('cashierId') || 'C1');
    }
    if (searchParams.has('lesseeId')) {
      setSelectedLesseeId(searchParams.get('lesseeId') || 'LE1');
    }
    
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Wrapper functions to update state and URL without server requests
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    
    // Get available tabs for this role
    const availableTabs = tabsByRole[role];
    const newTab = availableTabs[0]; // Default to first tab for this role
    setCurrentTab(newTab);
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role);
    params.set('tab', newTab);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleLessorIdChange = (id: string) => {
    setSelectedLessorId(id);
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('lessorId', id);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleCashierIdChange = (id: string) => {
    setSelectedCashierId(id);
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('cashierId', id);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleLesseeIdChange = (id: string) => {
    setSelectedLesseeId(id);
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('lesseeId', id);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const handleLogout = () => {
    // Clear JWT and user data from localStorage
    localStorage.removeItem('auth0_token');
    localStorage.removeItem('auth0_user');
    setLoggedUser(null);
    
    // Redirect to login page or home
    router.push('/');
  };

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

  const openStoreTransactionModal = () => {
    setRevenueForm({ date: '', type: 'grid-rent', gridId: '', handlerRole: 'lessor', handlerId: selectedLessorId || '', itemName: '', amount: 0, collected: false });
    setActiveRevenueModal('store');
    setShowRevenueModal(true);
  };

  const openGridTransactionModal = () => {
    setRevenueForm({ date: '', type: 'item-sale', gridId: '', handlerRole: 'cashier', handlerId: selectedCashierId || '', itemName: '', amount: 0, collected: false });
    setActiveRevenueModal('grid');
    setShowRevenueModal(true);
  };

  const closeRevenueModal = (_show?: boolean) => {
    setShowRevenueModal(false);
    setActiveRevenueModal(null);
  };

  const saveRevenue = () => {
    const grid = mockGridStores.find(g => g.id === revenueForm.gridId);
    if (!grid) {
      setShowRevenueModal(false);
      setActiveRevenueModal(null);
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
    setActiveRevenueModal(null);
  };

  const getFilteredGrids = () => {
    if (currentRole === 'admin') {
      return mockGridStores;
    } else if (currentRole === 'lessor') {
      return mockGridStores.filter(grid => grid.lessorId === selectedLessorId);
    } else if (currentRole === 'cashier') {
      // Cashier sees all grids in their assigned location
      const selectedCashier = mockCashiers.find(c => c.id === selectedCashierId);
      return mockGridStores.filter(grid => grid.locationId === selectedCashier?.locationId && grid.status === 'rented');
    } else {
      // Lessee sees only their rented grids
      const selectedLessee = mockLessees.find(l => l.id === selectedLesseeId);
      return mockGridStores.filter(grid => selectedLessee?.rentedGridIds.includes(grid.id));
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

  const getLesseeProducts = () => {
    const selectedLessee = mockLessees.find(l => l.id === selectedLesseeId);
    const lesseeGridIds = selectedLessee?.rentedGridIds || [];
    return mockProducts.filter(product => lesseeGridIds.includes(product.gridId));
  };

  // Keep the role switcher visible when the viewer has admin privileges, even when viewing other roles
  const hasAdminPrivileges =
    currentRole === 'admin' ||
    (loggedUser && (Array.isArray(loggedUser.roles) ? loggedUser.roles.includes('admin') : loggedUser.roles === 'admin'));

  console.log('DEBUG: currentRole =', currentRole, 'isInitialized =', isInitialized, 'loggedUser =', loggedUser);

  return (
    <div className="flex flex-col">

      {/* Role Selector & Header Section */}
      <AdminHeader
        isAdmin={hasAdminPrivileges}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        loggedUser={loggedUser}
        onLogout={handleLogout}
        selectedLessorId={selectedLessorId}
        onLessorIdChange={handleLessorIdChange}
        selectedCashierId={selectedCashierId}
        onCashierIdChange={handleCashierIdChange}
        selectedLesseeId={selectedLesseeId}
        onLesseeIdChange={handleLesseeIdChange}
        fetchedLessors={fetchedLessors}
        fetchedCashiers={fetchedCashiers}
        fetchedLessees={fetchedLessees}
      />

      {/* Dashboard Content */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="container-custom">
          {/* Admin Dashboard */}
          {currentRole === 'admin' && (
            <AdminDashboard
              currentTab={currentTab}
              onTabChange={handleTabChange}
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
              openStoreTransactionModal={openStoreTransactionModal}
              openGridTransactionModal={openGridTransactionModal}
              activeRevenueModal={activeRevenueModal}
              closeRevenueModal={closeRevenueModal}
              showRevenueModal={showRevenueModal}
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
              currentTab={currentTab}
              onTabChange={handleTabChange}
              selectedLessorId={selectedLessorId}
              getFilteredGrids={getFilteredGrids}
              revenueEntries={revenueEntries}
              toggleCollected={toggleCollected}
              mockGridStores={mockGridStores}
              isAdmin={false}
              delegateUserId={delegateUserId}
              onDelegateUserIdChange={setDelegateUserId}
            />
          )}

          {/* Cashier Dashboard */}
          {currentRole === 'cashier' && (
            <CashierDashboard
              getFilteredGrids={getFilteredGrids}
              selectedCashierId={selectedCashierId}
              mockCashiers={mockCashiers}
              isAdmin={false}
              delegateUserId={delegateUserId}
              onDelegateUserIdChange={setDelegateUserId}
            />
          )}

          {/* Lessee Dashboard */}
          {currentRole === 'lessee' && (
            <LesseeDashboard
              currentTab={currentTab}
              onTabChange={handleTabChange}
              selectedLesseeId={selectedLesseeId}
              getFilteredGrids={getFilteredGrids}
              revenueEntries={revenueEntries}
              toggleCollected={toggleCollected}
              mockLessees={mockLessees}
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
              getLesseeProducts={getLesseeProducts}
              mockGridStores={mockGridStores}
              isAdmin={false}
              delegateUserId={delegateUserId}
              onDelegateUserIdChange={setDelegateUserId}
            />
          )}

        </div>
      </section>

    </div>
  );
}
