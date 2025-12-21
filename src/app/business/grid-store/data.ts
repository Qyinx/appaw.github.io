import { Location, GridStore, Lessor, Cashier, RevenueEntry } from './types';

export const mockLocations: Location[] = [
  { id: 'LOC1', name: 'Hung Hom Store', address: 'Shop G1B, 3/F, Kaiser Estate Phase 2, Hung Hom' },
  { id: 'LOC2', name: 'Mong Kok Store', address: 'Shop 123, Mong Kok, Kowloon' },
];

export const mockGridStores: GridStore[] = [
  { id: '1', gridNumber: 'A-01', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L1', lessorName: 'John Doe', tenant: 'Card Collection Shop', monthlyRent: 1500, startDate: '2025-01-01', endDate: '2025-12-31', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '2', gridNumber: 'A-02', size: 'Medium', gridPrice: 2000, status: 'available', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '3', gridNumber: 'A-03', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L2', lessorName: 'Jane Smith', tenant: 'Vintage Toys', monthlyRent: 1500, startDate: '2025-02-01', endDate: '2025-07-31', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: '4', gridNumber: 'B-01', size: 'Large', gridPrice: 2500, status: 'rented', lessorId: 'L1', lessorName: 'John Doe', tenant: 'Pokemon Center', monthlyRent: 2500, startDate: '2025-01-15', endDate: '2026-01-14', locationId: 'LOC2', locationName: 'Mong Kok Store' },
  { id: '5', gridNumber: 'B-02', size: 'Medium', gridPrice: 2000, status: 'available', locationId: 'LOC2', locationName: 'Mong Kok Store' },
  { id: '6', gridNumber: 'B-03', size: 'Small', gridPrice: 1500, status: 'rented', lessorId: 'L3', lessorName: 'Mike Johnson', tenant: 'Hobby Store', monthlyRent: 1500, startDate: '2025-03-01', endDate: '2025-08-31', locationId: 'LOC2', locationName: 'Mong Kok Store' },
];

export const mockLessors: Lessor[] = [
  { id: 'L1', name: 'John Doe', email: 'john@example.com', assignedGrids: 2 },
  { id: 'L2', name: 'Jane Smith', email: 'jane@example.com', assignedGrids: 1 },
  { id: 'L3', name: 'Mike Johnson', email: 'mike@example.com', assignedGrids: 1 },
];

export const mockCashiers: Cashier[] = [
  { id: 'C1', name: 'Emily Wong', email: 'emily@example.com', locationId: 'LOC1', locationName: 'Hung Hom Store' },
  { id: 'C2', name: 'David Lee', email: 'david@example.com', locationId: 'LOC2', locationName: 'Mong Kok Store' },
];

export const initialRevenueEntries: RevenueEntry[] = [
  { id: 'R1', date: '2025-01-01', type: 'grid-rent', gridId: '1', gridNumber: 'A-01', handlerName: 'John Doe', handlerRole: 'lessor', amount: 1500, collected: true, locationName: 'Hung Hom Store' },
  { id: 'R2', date: '2025-02-01', type: 'grid-rent', gridId: '3', gridNumber: 'A-03', handlerName: 'Jane Smith', handlerRole: 'lessor', amount: 1500, collected: false, locationName: 'Hung Hom Store' },
  { id: 'R3', date: '2025-01-15', type: 'grid-rent', gridId: '4', gridNumber: 'B-01', handlerName: 'John Doe', handlerRole: 'lessor', amount: 2500, collected: true, locationName: 'Mong Kok Store' },
  { id: 'S1', date: '2025-01-10', type: 'item-sale', gridId: '1', gridNumber: 'A-01', handlerName: 'Emily Wong', handlerRole: 'cashier', itemName: 'PSA 10 Charizard', amount: 3200, collected: true, locationName: 'Hung Hom Store' },
  { id: 'S2', date: '2025-03-05', type: 'item-sale', gridId: '6', gridNumber: 'B-03', handlerName: 'David Lee', handlerRole: 'cashier', itemName: 'Vintage Toy Set', amount: 880, collected: false, locationName: 'Mong Kok Store' },
];
