export type Role = 'admin' | 'lessor' | 'cashier';
export type UserRole = 'lessor' | 'cashier' | 'unassigned';
export type AdminTab = 'user-management' | 'grid-management' | 'revenue-management';

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
  itemName?: string;
  amount: number;
  collected: boolean;
  locationName?: string;
}
