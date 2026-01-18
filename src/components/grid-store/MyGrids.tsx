'use client';

import React, { useEffect, useState } from 'react';
import { Grid3X3, CheckCircle, AlertCircle, DollarSign, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { GridStore } from '@/app/business/grid-store/administration/page';
import { graphqlFetch } from '@/lib/graphql';

interface StoreData {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: string;
  location: string;
  isActive: boolean;
  created: string;
}

interface MyGridsProps {
  grids: GridStore[];
  showStats?: boolean;
  showActions?: boolean;
  onViewGrid?: (grid: GridStore) => void;
  isAdmin?: boolean;
  delegateUserId?: string;
  onDelegateUserIdChange?: (userId: string) => void;
}

export default function MyGrids({ 
  grids, 
  showStats = true, 
  showActions = false,
  onViewGrid,
  isAdmin = false,
  delegateUserId = '',
  onDelegateUserIdChange
}: MyGridsProps) {
  const { t } = useLanguage();

  const [stores, setStores] = useState<StoreData[]>([]);
  const [storesLoading, setStoresLoading] = useState<boolean>(false);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  const [assignedGrids, setAssignedGrids] = useState<GridStore[]>([]);
  const [gridsLoading, setGridsLoading] = useState<boolean>(false);
  const [gridsError, setGridsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setStoresLoading(true);
        setStoresError(null);

        const query = `
          query {
            stores(limit: 20) {
              stores {
                id
                name
                ownerId
                ownerName
                type
                location
                isActive
                created
              }
              total
              limit
              nextAfterId
            }
          }
        `;

        const result = await graphqlFetch<{ stores: { stores: StoreData[] } }>(query);

        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to fetch stores');
        }

        const storeList = result.data?.stores?.stores || [];
        setStores(storeList);

        if (!selectedStoreId && storeList.length > 0) {
          const firstActive = storeList.find((s) => s.isActive) || storeList[0];
          setSelectedStoreId(firstActive.id);
        }
      } catch (err) {
        setStoresError(err instanceof Error ? err.message : 'Failed to fetch stores');
        console.error('Error fetching stores:', err);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchStores();
  }, [selectedStoreId]);

  useEffect(() => {
    const fetchGridsForStore = async () => {
      if (!selectedStoreId) {
        setAssignedGrids([]);
        return;
      }

      try {
        setGridsLoading(true);
        setGridsError(null);

        const query = `
          query {
            grids(storeId: "${selectedStoreId}") {
              id
              storeId
              name
              isActive
              created
              currentRent {
                lesseeUserId
                lesseeName
                startDate
                endDate
              }
            }
          }
        `;

        const result = await graphqlFetch<{ grids: any[] }>(query);

        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to fetch grids');
        }

        const fetchedGrids = result.data?.grids || [];
        setAssignedGrids(fetchedGrids);
      } catch (err) {
        setGridsError(err instanceof Error ? err.message : 'Failed to fetch grids');
        console.error('Error fetching grids:', err);
      } finally {
        setGridsLoading(false);
      }
    };

    fetchGridsForStore();
  }, [selectedStoreId]);

  // Use fetched assigned grids from API, or fall back to prop grids if not fetching
  const displayGrids = assignedGrids.length > 0 ? assignedGrids : grids;

  return (
    <div className="space-y-6">
      {/* Store Selector */}
      <Card className="p-4 md:p-6" hover={false}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.selectRole || 'Select Store'}</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">My Assigned Grids</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {storesLoading && <span>Loading stores...</span>}
              {storesError && <span className="text-red-500">{storesError}</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="" disabled>
                {storesLoading ? 'Loading stores...' : 'Select a store'}
              </option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isActive ? '' : '(Inactive)'}
                </option>
              ))}
            </select>

            {selectedStoreId && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {stores.find((s) => s.id === selectedStoreId)?.location || ''}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="p-4 md:p-6" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {t.gridStoreAdmin.dashboard.stats.totalGrids}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {displayGrids.length}
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
                  {displayGrids.filter((g: any) => g.currentRent).length}
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
                  {displayGrids.filter((g: any) => !g.currentRent).length}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 col-span-2 lg:col-span-1" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {t.gridStoreAdmin.dashboard.stats.revenue}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  ${displayGrids.reduce((sum, g) => sum + (g.monthlyRent || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Grid Management Table */}
      <Card className="p-4 md:p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            {t.gridStoreAdmin.dashboard.myAssignedGrids || t.gridStoreAdmin.dashboard.gridsToProcess || 'My Grids'}
          </h3>
        </div>

        {isAdmin && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Delegate User ID
            </label>
            <input
              type="text"
              value={delegateUserId}
              onChange={(e) => onDelegateUserIdChange?.(e.target.value)}
              placeholder="Enter user ID to delegate to"
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-blue-300 dark:border-blue-600 rounded-lg text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Leave empty for no delegation
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Grid Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Current Lessee
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Rental Period
                </th>
                {showActions && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t.gridStoreAdmin.dashboard.table.actions}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayGrids.map((grid: any) => (
                <tr key={grid.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{grid.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{grid.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      grid.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400'
                    }`}>
                      {grid.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {grid.currentRent ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{grid.currentRent.lesseeName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">ID: {grid.currentRent.lesseeUserId}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">Available</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {grid.currentRent ? (
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{new Date(grid.currentRent.startDate).toLocaleDateString()}</span>
                        <span className="text-slate-600 dark:text-slate-400">to {new Date(grid.currentRent.endDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  {showActions && (
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewGrid && onViewGrid(grid)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title={t.gridStoreAdmin.dashboard.table.view}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {displayGrids.map((grid: any) => (
            <div key={grid.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">{grid.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {grid.id}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  grid.isActive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400'
                }`}>
                  {grid.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Current Lessee Info */}
              {grid.currentRent ? (
                <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-3 border border-blue-200 dark:border-blue-800/50 mb-3">
                  <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2">Currently Rented</h5>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Lessee</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{grid.currentRent.lesseeName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{grid.currentRent.lesseeUserId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200 dark:border-blue-800/50">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">From</p>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{new Date(grid.currentRent.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">To</p>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{new Date(grid.currentRent.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/50 mb-3">
                  <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">📋 Available for Rent</p>
                </div>
              )}

              {/* Action Buttons */}
              {showActions && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => onViewGrid && onViewGrid(grid)}
                    className="w-full px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.gridStoreAdmin.dashboard.table.view}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
