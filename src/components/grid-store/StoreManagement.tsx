"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Store, Plus, Edit, Trash2, Users, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { graphqlFetch } from '@/lib/graphql';

interface StoreData {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: 'Lessor' | 'Lessee';
  location: string;
  isActive: boolean;
  created: string;
}

interface StoresResponse {
  stores: StoreData[];
  total: number;
  limit: number;
  nextAfterId: string | null;
}

interface StoreFormData {
  name: string;
  type: 'Lessor' | 'Lessee';
  location: string;
  userId: string;
}

// Cache for store data
let cachedStores: StoreData[] | null = null;

interface StoreManagementProps {
  // Props will be added as the component is developed
}

export default function StoreManagement({}: StoreManagementProps) {
  const { t } = useLanguage();
  const [stores, setStores] = useState<StoreData[]>(cachedStores || []);
  const [loading, setLoading] = useState(!cachedStores);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [nextAfterId, setNextAfterId] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    type: 'Lessor',
    location: '',
    userId: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = async () => {
    if (hasFetched.current || cachedStores) return;

    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

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

      const result = await graphqlFetch<{ stores: StoresResponse }>(query);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to fetch stores');
      }

      if (result.data?.stores) {
        const fetchedStores = result.data.stores.stores;
        setStores(fetchedStores);
        setTotal(result.data.stores.total);
        setLimit(result.data.stores.limit);
        setNextAfterId(result.data.stores.nextAfterId);
        cachedStores = fetchedStores;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const locationValue = formData.type === 'Lessee' ? '------' : formData.location;
      
      const mutation = `
        mutation {
          createStore(
            name: "${formData.name}",
            type: "${formData.type}",
            location: "${locationValue}",
            userId: "${formData.userId}"
          ) {
            id
            name
            ownerId
            ownerName
            type
            location
            isActive
            created
          }
        }
      `;

      const result = await graphqlFetch<{
        createStore: StoreData
      }>(mutation);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create store');
      }

      if (result.data?.createStore) {
        // Add new store to the list
        const updatedStores = [...stores, result.data.createStore];
        setStores(updatedStores);
        cachedStores = updatedStores;

        // Reset form and close modal
        setFormData({ name: '', type: 'Lessor', location: '', userId: '' });
        setShowCreateModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create store');
      console.error('Error creating store:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="p-4 md:p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Store Management
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Add Store</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading stores...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && stores.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No stores found. Create your first store to get started.</p>
          </div>
        )}

        {!loading && !error && stores.length > 0 && (
          <>
            {/* Pagination Info */}
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Showing {stores.length} of {total} stores
              {nextAfterId && (
                <span className="ml-2">(More available)</span>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Owner</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{store.id}</td>
                      <td className="py-3 px-4 text-sm text-slate-900 dark:text-white font-medium">{store.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{store.ownerName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          store.type === 'Lessor'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                        }`}>
                          {store.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{store.location}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          store.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400'
                        }`}>
                          {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(store.created).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                            title="Manage Users"
                          >
                            <Users className="w-4 h-4" />
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
              {stores.map((store) => (
                <Card key={store.id} className="p-4" hover={false}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{store.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">ID: {store.id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.type === 'Lessor'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                      }`}>
                        {store.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Owner:</span>
                        <p className="text-slate-900 dark:text-white">{store.ownerName}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Location:</span>
                        <p className="text-slate-900 dark:text-white">{store.location}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Status:</span>
                        <p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            store.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-400'
                          }`}>
                            {store.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 dark:text-slate-400">Created:</span>
                        <p className="text-slate-900 dark:text-white">{new Date(store.created).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        Users
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Create Store Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Add Store
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError(null);
                  setFormData({ name: '', type: 'Lessor', location: '', userId: '' });
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Store Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Lessor' | 'Lessee' })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Lessor">Lessor</option>
                  <option value="Lessee">Lessee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location {formData.type === 'Lessor' && '*'}
                </label>
                <input
                  type="text"
                  value={formData.type === 'Lessee' ? '------' : formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required={formData.type === 'Lessor'}
                  disabled={formData.type === 'Lessee'}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={formData.type === 'Lessee' ? '------' : 'Enter location'}
                />
                {formData.type === 'Lessee' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Location is not required for Lessee stores
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Owner User ID *
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user ID"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  The ID of the user who will own this store
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError(null);
                    setFormData({ name: '', type: 'Lessor', location: '', userId: '' });
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
                  {submitting ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
