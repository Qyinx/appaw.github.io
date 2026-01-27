"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { graphqlFetch } from '@/lib/graphql';

interface GridData {
  id: string;
  storeId: string;
  name: string;
  isActive: boolean;
  created: string;
  currentRent?: {
    lesseeUserId: string;
    lesseeName: string;
    startDate: string;
    endDate: string;
  } | null;
}

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

interface RentData {
  gridId: string;
  lesseeUserId: string;
  startDate: string;
  endDate: string;
  notes: string;
  created: string;
}

interface GridFormData {
  gridName: string;
  storeId: string;
}

interface RentFormData {
  gridId: string;
  lesseeUserId: string;
  startDate: string;
  endDate: string;
  notes: string;
}

// Cache for grid data
let cachedGrids: GridData[] | null = null;

interface Props {
  storeId?: string;
}

export default function GridManagement({ storeId }: Props) {
  const { t } = useLanguage();
  const [grids, setGrids] = useState<GridData[]>(cachedGrids || []);
  const [loading, setLoading] = useState(!cachedGrids);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [stores, setStores] = useState<StoreData[]>([]);
  const [storesLoading, setStoresLoading] = useState<boolean>(true);
  const [storesError, setStoresError] = useState<string | null>(null);
  const hasFetchedStores = useRef(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(storeId || '');
  
  const [showGridModal, setShowGridModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [gridForm, setGridForm] = useState<GridFormData>({ gridName: '', storeId: selectedStoreId || storeId || '' });
  const [rentForm, setRentForm] = useState<RentFormData>({ gridId: '', lesseeUserId: '', startDate: '', endDate: '', notes: '' });
  const [editingRent, setEditingRent] = useState<RentData | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = async () => {
    try {
      if (hasFetchedStores.current) return;
      hasFetchedStores.current = true;

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

      // Default to first active store, else first store
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

  const fetchGrids = async (storeFilter?: string) => {
    if (!storeFilter) {
      setGrids([]);
      return;
    }

    // Prevent re-fetch loop when cached for the same store
    if (hasFetched.current && cachedGrids && cachedGrids.every((g) => g.storeId === storeFilter)) {
      setGrids(cachedGrids.filter((g) => g.storeId === storeFilter));
      return;
    }

    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const query = `
        query {
          grids {
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

      const result = await graphqlFetch<{ grids: GridData[] }>(query);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to fetch grids');
      }

      const allGrids = result.data?.grids || [];
      const filtered = allGrids.filter((g) => g.storeId === storeFilter);
      setGrids(filtered);
      cachedGrids = allGrids;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grids');
      console.error('Error fetching grids:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchGrids(selectedStoreId);
  }, [selectedStoreId]);

  const handleCreateGrid = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const mutation = `
        mutation CreateGrids($input: [GridInput!]!) {
          createGrids(grids: $input) {
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

      const variables = {
        input: [
          {
            storeId: gridForm.storeId || selectedStoreId,
            name: gridForm.gridName,
          },
        ],
      } as { input: Array<{ storeId?: string; name: string }> };

      if (!variables.input[0].storeId) {
        throw new Error('Please select a store before creating a grid.');
      }

      const result = await graphqlFetch<{ createGrids: GridData[] }>(mutation, variables);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create grid');
      }

      if (result.data?.createGrids && result.data.createGrids.length > 0) {
        const updatedGrids = [...grids, ...result.data.createGrids];
        setGrids(updatedGrids.filter((g) => g.storeId === (selectedStoreId || gridForm.storeId)));
        cachedGrids = updatedGrids;
        setGridForm({ gridName: '', storeId: selectedStoreId || storeId || '' });
        setShowGridModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create grid');
      console.error('Error creating grid:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const mutation = `
        mutation {
          createRent(
            gridId: "${rentForm.gridId}",
            lesseeUserId: "${rentForm.lesseeUserId}",
            startDate: "${rentForm.startDate}",
            endDate: "${rentForm.endDate}",
            notes: "${rentForm.notes}"
          ) {
            gridId
            lesseeUserId
            startDate
            endDate
            created
            notes
          }
        }
      `;

      const result = await graphqlFetch<{ createRent: RentData }>(mutation);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create rent');
      }

      if (result.data?.createRent) {
        setRentForm({ gridId: '', lesseeUserId: '', startDate: '', endDate: '', notes: '' });
        setShowRentModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create rent');
      console.error('Error creating rent:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const mutation = `
        mutation {
          updateRent(
            gridId: "${rentForm.gridId}",
            lesseeUserId: "${rentForm.lesseeUserId}",
            startDate: "${rentForm.startDate}",
            endDate: "${rentForm.endDate}",
            notes: "${rentForm.notes}"
          ) {
            gridId
            lesseeUserId
            startDate
            endDate
            created
            notes
          }
        }
      `;

      const result = await graphqlFetch<{ updateRent: RentData }>(mutation);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to update rent');
      }

      if (result.data?.updateRent) {
        setRentForm({ gridId: '', lesseeUserId: '', startDate: '', endDate: '', notes: '' });
        setEditingRent(null);
        setShowRentModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update rent');
      console.error('Error updating rent:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="p-4 md:p-6" hover={false}>
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Select Store</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Manage grids by store</p>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Grid Management
          </h3>
          <button
            onClick={() => {
              setGridForm({ gridName: '', storeId: selectedStoreId || storeId || '' });
              setShowGridModal(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center"
            disabled={!selectedStoreId}
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Add Grid</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading grids...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && grids.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 text-slate-400 mx-auto mb-4">📦</div>
            <p className="text-slate-600 dark:text-slate-400">No grids found. Create your first grid to get started.</p>
          </div>
        )}

        {!loading && !error && grids.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Grid</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Store</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Current Rent</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Rental Period</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grids.map((grid) => (
                    <tr key={grid.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{grid.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{grid.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{grid.storeId}</td>
                      <td className="py-4 px-4">
                        {grid.currentRent ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-white text-sm">{grid.currentRent.lesseeName}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">ID: {grid.currentRent.lesseeUserId}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400 italic">Available</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {grid.currentRent ? (
                          <div className="flex flex-col text-xs">
                            <span className="text-slate-600 dark:text-slate-400">{new Date(grid.currentRent.startDate).toLocaleDateString()}</span>
                            <span className="text-slate-600 dark:text-slate-400">to {new Date(grid.currentRent.endDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          grid.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400'
                        }`}>
                          {grid.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingRent(null);
                              setRentForm({ gridId: grid.id, lesseeUserId: '', startDate: '', endDate: '', notes: '' });
                              setShowRentModal(true);
                            }}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Add/Edit Rent"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Grid"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Grid"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {grids.map((grid) => (
                <Card key={grid.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" hover={false}>
                  <div className="space-y-4">
                    {/* Grid Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
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

                    {/* Store Info */}
                    <div className="text-sm">
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">Store</span>
                      <p className="text-slate-900 dark:text-white font-medium">{grid.storeId}</p>
                    </div>

                    {/* Current Rent Info */}
                    {grid.currentRent ? (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-3 border border-blue-200 dark:border-blue-800/50">
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
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/50">
                        <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">📋 Available for Rent</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          setEditingRent(null);
                          setRentForm({ gridId: grid.id, lesseeUserId: '', startDate: '', endDate: '', notes: '' });
                          setShowRentModal(true);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100/60 dark:hover:bg-green-900/40 transition-colors font-medium border border-green-200 dark:border-green-800/50"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Rent
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-colors font-medium border border-blue-200 dark:border-blue-800/50">
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100/60 dark:hover:bg-red-900/40 transition-colors font-medium border border-red-200 dark:border-red-800/50">
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Create Grid Modal */}
      {showGridModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Add Grid
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrid} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Grid Name *
                </label>
                <input
                  type="text"
                  value={gridForm.gridName}
                  onChange={(e) => setGridForm({ ...gridForm, gridName: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Grid A-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Store ID *
                </label>
                <input
                  type="text"
                  value={gridForm.storeId}
                  onChange={(e) => setGridForm({ ...gridForm, storeId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter store ID"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGridModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Grid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rent Management Modal */}
      {showRentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingRent ? 'Update Rent' : 'Create Rent'}
              </h3>
              <button
                onClick={() => {
                  setShowRentModal(false);
                  setEditingRent(null);
                  setRentForm({ gridId: '', lesseeUserId: '', startDate: '', endDate: '', notes: '' });
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingRent ? handleUpdateRent : handleCreateRent} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Grid ID *
                </label>
                <input
                  type="text"
                  value={rentForm.gridId}
                  onChange={(e) => setRentForm({ ...rentForm, gridId: e.target.value })}
                  required
                  disabled={!!editingRent}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter grid ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Lessee User ID *
                </label>
                <input
                  type="text"
                  value={rentForm.lesseeUserId}
                  onChange={(e) => setRentForm({ ...rentForm, lesseeUserId: e.target.value })}
                  required
                  disabled={!!editingRent}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter lessee user ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={rentForm.startDate}
                  onChange={(e) => setRentForm({ ...rentForm, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={rentForm.endDate}
                  onChange={(e) => setRentForm({ ...rentForm, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={rentForm.notes}
                  onChange={(e) => setRentForm({ ...rentForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rental notes"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRentModal(false);
                    setEditingRent(null);
                    setRentForm({ gridId: '', lesseeUserId: '', startDate: '', endDate: '', notes: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingRent ? 'Update Rent' : 'Create Rent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}