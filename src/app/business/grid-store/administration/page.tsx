'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Users, CreditCard, Store, Grid3X3, UserPlus, Eye, DollarSign, Calendar, CheckCircle, AlertCircle, Edit, Trash2, Plus, X, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { graphqlFetch } from '@/lib/graphql';
import GridManagement from '@/components/grid-store/GridManagement';
import UserManagement from '@/components/grid-store/UserManagement';
import AdminDashboard from './AdminDashboard';
import LessorDashboard from './LessorDashboard';
import CashierDashboard from './CashierDashboard';
import LesseeDashboard from './LesseeDashboard';
import AdminHeader from './AdminHeader';

export type Role = 'admin' | 'lessor' | 'cashier' | 'lessee';
export type UserRole = 'lessor' | 'cashier';
export type Tab = 'user-management' | 'grid-management' | 'revenue-management' | 'store-management' | 'product-management' | 'my-grids' | 'payment-history' | 'item-payment';

// Tab availability by role
export const tabsByRole: Record<Role, Tab[]> = {
  admin: ['user-management', 'grid-management', 'revenue-management', 'store-management'],
  lessor: ['grid-management', 'revenue-management'],
  cashier: ['item-payment', 'revenue-management'],
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

export interface Store {
  id: string;
  name: string;
  type: string;
  location: string;
  isActive: boolean;
  created: string;
  ownerName: string;
  ownerId: string;
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
  storeId?: string; // Store the lessor owns
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
  type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
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
  fromUser?: { id: string | number; name: string };
  toUser?: { id: string | number; name: string };
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
  const [storeTransactionRefresh, setStoreTransactionRefresh] = useState(0);
  const [revenueForm, setRevenueForm] = useState({
    date: '',
    type: 'grid-rent' as 'grid-rent' | 'item-sale' | 'grid-income' | 'others',
    gridId: '',
    handlerRole: 'lessor' as 'lessor' | 'cashier',
    handlerId: '',
    itemName: '',
    amount: '',
    collected: false,
  });

  // Product Management State
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, gridId: '' });

  // Delegate User ID State (for admin's grid requests)
  const [delegateUserId, setDelegateUserId] = useState<string>('');

  const [loggedUser, setLoggedUser] = useState<{ name?: string; roles?: string[] | string; id?: string; sub?: string; user_id?: string } | null>(null);
  const [authUserId, setAuthUserId] = useState<string>('');
  
  // Fetched users from API
  const [fetchedLessors, setFetchedLessors] = useState<Lessor[]>(mockLessors);
  const [fetchedCashiers, setFetchedCashiers] = useState<Cashier[]>(mockCashiers);
  const [fetchedLessees, setFetchedLessees] = useState<Lessee[]>(mockLessees);
  const [lessorStores, setLessorStores] = useState<Store[]>([]); // Stores owned by selected lessor

  // Track if initial load is complete to prevent URL changes from re-initializing state
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth0_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setLoggedUser(parsed);
        const candidateId = parsed.id || parsed.user_id || parsed.sub || parsed.userId || '';
        if (candidateId) setAuthUserId(candidateId.toString());
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

        const response = await fetch('/api/graphql', {
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
              storeId: '', // Will be populated when fetching stores
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
          if (authUserId && lessors.some((l) => l.id === authUserId)) {
            setSelectedLessorId(authUserId);
          } else if (lessors.length > 0) {
            setSelectedLessorId(lessors[0].id);
          }
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

  // Fetch lessor's stores from API
  useEffect(() => {
    if (currentRole !== 'lessor' || !selectedLessorId) return;

    const fetchLessorStores = async () => {
      try {
        const token = localStorage.getItem('auth0_token');
        if (!token) return;

        const query = `
          query {
            stores(userId: "${selectedLessorId}", limit: 10) {
              stores {
                id
                name
                type
                location
                isActive
                created
                ownerName
                ownerId
              }
              total
              limit
              nextAfterId
              previousBeforeId
            }
          }
        `;

        const result = await graphqlFetch<{ stores: { stores: Store[] } }>(query);

        if (result.errors) {
          console.error('Failed to fetch lessor stores:', result.errors);
          return;
        }

        if (result.data?.stores?.stores) {
          setLessorStores(result.data.stores.stores);
          // Update lessor with storeId from first store
          if (result.data?.stores?.stores && result.data.stores.stores.length > 0) {
            setFetchedLessors(prev => 
              prev.map(l => 
                l.id === selectedLessorId 
                  ? { ...l, storeId: result.data!.stores!.stores[0].id }
                  : l
              )
            );
          }
        }
      } catch (error) {
        console.error('Error fetching lessor stores:', error);
      }
    };

    fetchLessorStores();
  }, [selectedLessorId, currentRole]);

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

  // Fetch store transactions from API
  useEffect(() => {
    const fetchStoreTransactions = async () => {
      try {
        const query = `
          query {
            storeTransactions(limit: 20) {
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
            }
          }
        `;
        const result = await graphqlFetch(query);
        if (result.data?.storeTransactions?.transactions) {
          const entries: RevenueEntry[] = result.data.storeTransactions.transactions.map((transaction: any) => ({
            id: transaction.orderId,
            date: transaction.created ? transaction.created.slice(0, 10) : new Date().toISOString().slice(0, 10),
            type: 'grid-rent' as const,
            gridId: '',
            gridNumber: '',
            trxType: transaction.trxType,
            amount: transaction.amount,
            collected: transaction.isCollected,
            notes: transaction.notes,
            fromUser: transaction.fromUser,
            toUser: transaction.toUser,
          }));
          setRevenueEntries(entries);
        }
      } catch (error) {
        console.error('Error fetching store transactions:', error);
      }
    };
    
    if (isInitialized) {
      fetchStoreTransactions();
    }
  }, [isInitialized]);

  // Wrapper functions to update state and URL without server requests
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    
    // Get available tabs for this role
    const availableTabs = tabsByRole[role];
    const newTab = availableTabs[0]; // Default to first tab for this role
    setCurrentTab(newTab);

    // When switching to lessor, prefer the authenticated user id if available
    if (role === 'lessor' && authUserId) {
      setSelectedLessorId(authUserId);
    }
    
    // Update URL using History API (no server request)
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role);
    params.set('tab', newTab);
    if (role === 'lessor' && authUserId) params.set('lessorId', authUserId);
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

  const saveRevenue = async () => {
    try {
      // Validate amount is provided
      const amount = parseFloat(revenueForm.amount as any);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      // Determine trxType based on store/grid transaction and form type
      let trxType = '';
      if (activeRevenueModal === 'store') {
        // Store Transaction Types
        if (revenueForm.type === 'grid-rent') trxType = 'settlement_to_lessor'; // Company Store Rent (Admin → Lessor)
        else if (revenueForm.type === 'item-sale') trxType = 'rent_payment'; // Lessee Grid Rent (Lessee → Admin)
        else if (revenueForm.type === 'grid-income') trxType = 'settlement_to_lessee'; // Grid Income (Admin → Lessee)
        else if (revenueForm.type === 'others') trxType = 'others';
      } else {
        // Grid Transaction Types
        if (revenueForm.type === 'grid-rent') trxType = 'rent_payment'; // Lessee Rent Grid
        else if (revenueForm.type === 'item-sale') trxType = 'settlement_to_lessee'; // Grid Income from sales
        else if (revenueForm.type === 'others') trxType = 'others';
      }

      // Convert user IDs to numbers
      // For Store Transactions: Logic depends on transaction type
      // For Grid Transactions: the selected user is the Payer (fromUserId)
      let fromUserId = 0;
      let toUserId = 0;
      
      if (activeRevenueModal === 'store') {
        if (revenueForm.type === 'item-sale') {
          // Lessee Grid Rent (Lessee → Admin): selected user is payer (Lessee)
          fromUserId = parseInt(revenueForm.handlerId) || 0;
          toUserId = 1; // Admin
        } else if (revenueForm.type === 'grid-rent' || revenueForm.type === 'grid-income') {
          // Company Store Rent & Grid Income (Admin → Lessor/Lessee): Admin is payer
          fromUserId = 1; // Admin
          toUserId = parseInt(revenueForm.handlerId) || 0;
        } else {
          // Others: Admin is payer by default
          fromUserId = 1;
          toUserId = parseInt(revenueForm.handlerId) || 0;
        }
      } else {
        // Grid Transaction: selected user is the payer, recipient varies by type
        fromUserId = parseInt(revenueForm.handlerId) || 0;
        // For grid transactions, toUserId should be determined based on transaction type
        // but for now we'll use the handlerId as well
        toUserId = parseInt(revenueForm.handlerId) || 0;
      }

      const mutation = `
        mutation {
          createStoreTransaction(
            trxType: "${trxType}",
            fromUserId: ${fromUserId},
            toUserId: ${toUserId},
            amount: ${amount},
            notes: "${revenueForm.itemName.replace(/"/g, '\\"')}",
            isCollected: ${revenueForm.collected}
          ) {
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
        }
      `;

      const result = await graphqlFetch(mutation);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        alert('Error saving transaction: ' + (result.errors[0]?.message || 'Unknown error'));
        return;
      }

      if (result.data?.createStoreTransaction) {
        const transaction = result.data.createStoreTransaction;
        const newEntry: RevenueEntry = {
          id: transaction.orderId,
          date: revenueForm.date || new Date().toISOString().slice(0, 10),
          type: revenueForm.type,
          gridId: revenueForm.gridId,
          gridNumber: revenueForm.gridId, // Will update if grid is needed
          handlerName: transaction.fromUser?.name || '',
          handlerRole: revenueForm.handlerRole,
          handlerId: revenueForm.handlerId,
          itemName: revenueForm.itemName,
          amount: amount,
          collected: revenueForm.collected,
          notes: revenueForm.itemName,
          trxType: transaction.trxType,
          fromUser: transaction.fromUser,
          toUser: transaction.toUser,
        };
        setRevenueEntries(prev => [newEntry, ...prev]);
        setShowRevenueModal(false);
        setActiveRevenueModal(null);
        // Trigger refresh for StoreTransactions component
        setStoreTransactionRefresh(prev => prev + 1);
        // Reset form
        setRevenueForm({
          date: '',
          type: 'grid-rent',
          gridId: '',
          handlerRole: 'lessor',
          handlerId: '',
          itemName: '',
          amount: '' as any,
          collected: false,
        });
      }
    } catch (error) {
      console.error('Error saving revenue:', error);
      alert('Error saving transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getFilteredGrids = () => {
    if (currentRole === 'admin') {
      return mockGridStores;
    } else if (currentRole === 'lessor') {
      const selectedLessor = fetchedLessors.find(l => l.id === selectedLessorId);
      return mockGridStores.filter(grid => 
        grid.lessorId === selectedLessorId && 
        (!selectedLessor?.storeId || grid.storeId === selectedLessor.storeId)
      );
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

  return (
    <div className="flex flex-col">

      {/* Role Selector & Header Section */}
      <AdminHeader
        isAdmin={hasAdminPrivileges || false}
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
              storeTransactionRefresh={storeTransactionRefresh}
              selectedLessorId={selectedLessorId}
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
              currentTab={currentTab}
              onTabChange={handleTabChange}
              getFilteredGrids={getFilteredGrids}
              selectedCashierId={selectedCashierId}
              mockCashiers={mockCashiers}
              revenueEntries={revenueEntries}
              showRevenueModal={showRevenueModal}
              activeRevenueModal={activeRevenueModal}
              closeRevenueModal={closeRevenueModal}
              revenueForm={revenueForm}
              setRevenueForm={setRevenueForm}
              saveRevenue={saveRevenue}
              toggleCollected={toggleCollected}
              openGridTransactionModal={openGridTransactionModal}
              mockGridStores={mockGridStores}
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

      {/* Revenue Record Modal */}
      {showRevenueModal && activeRevenueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeRevenueModal === 'store' ? 'Add Store Transaction' : 'Add Grid Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowRevenueModal(false);
                  setActiveRevenueModal(null);
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              saveRevenue();
            }}>
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={revenueForm.date}
                  onChange={(e) => setRevenueForm({...revenueForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                {activeRevenueModal === 'store' ? (
                  // Store Transaction - Admin can add multiple types
                  currentRole === 'admin' ? (
                    <select
                      value={revenueForm.type}
                      onChange={(e) => setRevenueForm({...revenueForm, type: e.target.value as 'grid-rent' | 'item-sale' | 'grid-income' | 'others', handlerId: ''})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="item-sale">Lessee Grid Rent (Lessee → Admin)</option>
                      <option value="grid-rent">Company Store Rent (Admin → Lessor)</option>
                      <option value="grid-income">Grid Income (Admin → Lessee)</option>
                      <option value="others">Others (Anyone → Anyone)</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Store Transactions (Admin Only)
                    </div>
                  )
                ) : (
                  // Grid Transaction - Grid Rent and Item Sale
                  <select
                    value={revenueForm.type}
                    onChange={(e) => setRevenueForm({...revenueForm, type: e.target.value as 'grid-rent' | 'item-sale'})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="grid-rent">Grid Rent</option>
                    <option value="item-sale">Item Sale</option>
                  </select>
                )}
              </div>

              {/* Grid Selection - Only for Grid Transactions */}
              {activeRevenueModal === 'grid' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Grid
                  </label>
                  <select
                    value={revenueForm.gridId}
                    onChange={(e) => setRevenueForm({...revenueForm, gridId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  >
                    <option value="">Select a grid</option>
                    {mockGridStores.map((grid) => (
                      <option key={grid.id} value={grid.id}>
                        {grid.gridNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient Selection - Dynamic based on transaction type */}
              {activeRevenueModal === 'store' ? (
                <>
                  {/* Company Store Rent (Admin → Lessor) - Recipient is Lessor */}
                  {revenueForm.type === 'grid-rent' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Recipient (Lessor)
                      </label>
                      <select
                        value={revenueForm.handlerId}
                        onChange={(e) => setRevenueForm({...revenueForm, handlerId: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">Select Lessor</option>
                        {fetchedLessors.map((lessor) => (
                          <option key={lessor.id} value={lessor.id}>
                            {lessor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Lessee Grid Rent (Lessee → Admin) - Payer is Lessee */}
                  {revenueForm.type === 'item-sale' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Payer (Lessee)
                      </label>
                      <select
                        value={revenueForm.handlerId}
                        onChange={(e) => setRevenueForm({...revenueForm, handlerId: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">Select Lessee</option>
                        {fetchedLessees.map((lessee) => (
                          <option key={lessee.id} value={lessee.id}>
                            {lessee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Grid Income (Admin → Lessee) - Recipient is Lessee */}
                  {revenueForm.type === 'grid-income' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Recipient (Lessee)
                      </label>
                      <select
                        value={revenueForm.handlerId}
                        onChange={(e) => setRevenueForm({...revenueForm, handlerId: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      >
                        <option value="">Select Lessee</option>
                        {fetchedLessees.map((lessee) => (
                          <option key={lessee.id} value={lessee.id}>
                            {lessee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Others - Recipient can be anyone */}
                  {revenueForm.type === 'others' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Recipient
                      </label>
                      <select
                        value={revenueForm.handlerRole}
                        onChange={(e) => setRevenueForm({...revenueForm, handlerRole: e.target.value as 'lessor' | 'cashier', handlerId: ''})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="lessor">Lessor</option>
                        <option value="cashier">Cashier</option>
                      </select>
                      <select
                        value={revenueForm.handlerId}
                        onChange={(e) => setRevenueForm({...revenueForm, handlerId: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white mt-2"
                        required
                      >
                        <option value="">Select {revenueForm.handlerRole}</option>
                        {revenueForm.handlerRole === 'lessor' ? (
                          fetchedLessors.map((lessor) => (
                            <option key={lessor.id} value={lessor.id}>
                              {lessor.name}
                            </option>
                          ))
                        ) : (
                          fetchedCashiers.map((cashier) => (
                            <option key={cashier.id} value={cashier.id}>
                              {cashier.name}
                            </option>
                          ))
                        )}
                      </select>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 mt-3">
                        Recipient (Any)
                      </label>
                      <input
                        type="text"
                        placeholder="Recipient name or ID"
                        value={revenueForm.itemName}
                        onChange={(e) => setRevenueForm({...revenueForm, itemName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  )}
                </>
              ) : (
                // Grid Transaction - Normal Handler handling
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Handler Role
                  </label>
                  <select
                    value={revenueForm.handlerRole}
                    onChange={(e) => setRevenueForm({...revenueForm, handlerRole: e.target.value as 'lessor' | 'cashier', handlerId: ''})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="lessor">Lessor</option>
                    <option value="cashier">Cashier</option>
                  </select>
                  <select
                    value={revenueForm.handlerId}
                    onChange={(e) => setRevenueForm({...revenueForm, handlerId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white mt-2"
                    required
                  >
                    <option value="">Select {revenueForm.handlerRole}</option>
                    {revenueForm.handlerRole === 'lessor' ? (
                      fetchedLessors.map((lessor) => (
                        <option key={lessor.id} value={lessor.id}>
                          {lessor.name}
                        </option>
                      ))
                    ) : (
                      fetchedCashiers.map((cashier) => (
                        <option key={cashier.id} value={cashier.id}>
                          {cashier.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* Item Name (for grid transaction item-sale only) */}
              {activeRevenueModal === 'grid' && revenueForm.type === 'item-sale' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={revenueForm.itemName}
                    onChange={(e) => setRevenueForm({...revenueForm, itemName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={revenueForm.amount}
                  onChange={(e) => setRevenueForm({...revenueForm, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Notes - Only for Store Transactions */}
              {activeRevenueModal === 'store' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg text-sm text-slate-700 dark:text-slate-300">
                      {revenueForm.type === 'grid-rent' && 'Company Store Rent: '}
                      {revenueForm.type === 'item-sale' && 'Lessee Grid Rent: '}
                      {revenueForm.type === 'grid-income' && 'Grid Income: '}
                      {revenueForm.type === 'others' && 'Others: '}
                    </div>
                    <input
                      type="text"
                      value={revenueForm.itemName}
                      onChange={(e) => setRevenueForm({...revenueForm, itemName: e.target.value})}
                      placeholder="Enter notes..."
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Collected Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="collected"
                  checked={revenueForm.collected}
                  onChange={(e) => setRevenueForm({...revenueForm, collected: e.target.checked})}
                  className="w-4 h-4 border-slate-300 rounded"
                />
                <label htmlFor="collected" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Mark as Collected
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRevenueModal(false);
                    setActiveRevenueModal(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Add Record
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
