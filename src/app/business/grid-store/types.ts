export type Role = 'admin' | 'lessor' | 'cashier' | 'lessee';
export type UserRole = 'lessor' | 'cashier' | 'unassigned' | 'lessee' | 'admin' | string;
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
  name?: string;
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
  gridNumber?: string;
  locationName?: string;
  itemId?: string; // API response field
  userId?: string | number; // User who created the item
  version?: number; // API version field
  isActive?: boolean; // Item status
  created?: string; // Creation timestamp
  notes?: string; // Description from API
  guid?: string; // Unique guid from API
  gridName?: string; // Grid name from nested grid
  storeId?: string; // Store id from nested grid.store
  storeName?: string; // Store name from nested grid.store
  storeLocation?: string; // Store location from nested grid.store
}
