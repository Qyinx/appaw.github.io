"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { User, UserRole } from '@/app/business/grid-store/types';
import { graphqlFetch } from '@/lib/graphql';

interface Props {
  onCreate: () => void;
  onEdit: (user: User) => void;
  shouldFetch?: boolean;
  isAdmin?: boolean;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

// Cache for user data
let cachedUsers: User[] | null = null;

export default function UserManagement({ onCreate, onEdit, shouldFetch = true, isAdmin = false }: Props) {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>(cachedUsers || []);
  const [loading, setLoading] = useState(!cachedUsers && shouldFetch && isAdmin);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('UserManagement useEffect - isAdmin:', isAdmin, 'shouldFetch:', shouldFetch, 'hasFetched:', hasFetched.current, 'cachedUsers:', cachedUsers);
    
    // Fetch users only if admin, shouldFetch is true and we haven't already fetched
    if (isAdmin && shouldFetch && !hasFetched.current) {
      console.log('Triggering fetchUsers');
      hasFetched.current = true;
      fetchUsers();
    } else if (!shouldFetch || !isAdmin) {
      hasFetched.current = false;
      setUsers([]);
      cachedUsers = [];
      setLoading(false);
      setError(null);
    }
  }, [shouldFetch, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = `
        query {
          users(limit: 20) {
            users {
              id
              name
              roles
              mail
              phone
              created
            }
            total
            limit
            nextAfterId
          }
        }
      `;

      const result = await graphqlFetch<{ 
        users: { 
          users: Array<{
            id: string;
            name: string;
            roles: string[];
            mail: string;
            phone?: string;
            created: string;
          }>;
          total: number;
          limit: number;
          nextAfterId?: string;
        } 
      }>(query);

      if (result.errors) {
        const msg = result.errors[0]?.message || 'Failed to fetch users';
        if (msg.toLowerCase().includes('insufficient permissions')) {
          // Gracefully handle lack of admin scope
          setError('You need admin access to list users. Showing no users.');
          setUsers([]);
          cachedUsers = [];
          return;
        }
        throw new Error(msg);
      }

      if (result.data?.users?.users) {
        // Map API response to User type - show all users with their original roles
        const mappedUsers: User[] = result.data.users.users
          .map(user => {
            // Use the first role from the roles array, or 'unassigned' if no roles
            const role = user.roles.length > 0 ? user.roles[0] : 'unassigned';
            
            return {
              id: user.id,
              name: user.name,
              email: user.mail,
              role: role as UserRole,
              assignedGrids: 0, // Not provided by API
              phone: user.phone
            };
          });
        
        console.log('Fetched users from API:', result.data.users.users.length);
        console.log('Mapped users for display:', mappedUsers.length);
        console.log('Users:', mappedUsers);
        
        setUsers(mappedUsers);
        // Update cache
        cachedUsers = mappedUsers;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const mutation = `
        mutation {
          updateUser(id: "${editingUser.id}", name: "${formData.name}", mail: "${formData.email}", phone: "${formData.phone}") {
            id
            name
            mail
            phone
            roles
            created
          }
        }
      `;

      const result = await graphqlFetch<{
        updateUser: {
          id: string;
          name: string;
          mail: string;
          phone?: string;
          roles: string[];
          created: string;
        }
      }>(mutation);
      
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to update user');
      }

      if (result.data?.updateUser) {
        // Update the user in the list - only if role is lessor or cashier
        if (result.data.updateUser.roles[0] !== 'lessor' && result.data.updateUser.roles[0] !== 'cashier') {
          throw new Error('Invalid user role');
        }

        const updatedUser: User = {
          id: result.data.updateUser.id,
          name: result.data.updateUser.name,
          email: result.data.updateUser.mail,
          role: result.data.updateUser.roles[0] as 'lessor' | 'cashier',
          assignedGrids: editingUser.assignedGrids,
          phone: result.data.updateUser.phone
        };

        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        cachedUsers = updatedUsers;

        // Reset form and close modal
        setFormData({ name: '', email: '', phone: '' });
        setEditingUser(null);
        setShowEditModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const mutation = `
        mutation {
              createUser(name: "${formData.name}", mail: "${formData.email}", phone: "${formData.phone}") {
            id
            name
            mail
            phone
            created
          }
        }
      `;

      const result = await graphqlFetch<{
        createUser: {
          id: string;
          name: string;
          mail: string;
          phone?: string;
          created: string;
        }
      }>(mutation);

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create user');
      }

      if (result.data?.createUser) {
        // Refetch to get server-assigned roles
        cachedUsers = null;
        await fetchUsers();

        // Reset form and close modal
        setFormData({ name: '', email: '', phone: '' });
        setShowCreateModal(false);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Card className="p-4 md:p-6" hover={false}>
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600 dark:text-slate-400">Loading users...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="p-4 md:p-6" hover={false}>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="text-red-600 dark:text-red-400">{error}</div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-4 md:p-6" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.gridStoreAdmin.userManagement.title}
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">{t.gridStoreAdmin.userManagement.addUser}</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.userManagement.table.name}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.userManagement.table.email}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.userManagement.table.role}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.userManagement.table.assignedGrids}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.userManagement.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{user.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">{user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'lessor'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : user.role === 'cashier'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : user.role === 'admin'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : user.role === 'lessee'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                        : 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400'
                    }`}>
                      {user.role === 'lessor'
                        ? t.gridStoreAdmin.roles.lessor.title
                        : user.role === 'cashier'
                        ? t.gridStoreAdmin.roles.cashier.title
                        : user.role === 'admin'
                        ? 'Admin'
                        : user.role === 'lessee'
                        ? 'Lessee'
                        : 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">
                      {user.assignedGrids || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title={t.gridStoreAdmin.userManagement.table.edit}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title={t.gridStoreAdmin.userManagement.table.delete}
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
          {users.map((user) => (
            <div key={user.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">ID: {user.id}</div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">{user.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  user.role === 'lessor'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : user.role === 'cashier'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    : user.role === 'admin'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : user.role === 'lessee'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    : 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400'
                }`}>
                  {user.role === 'lessor'
                    ? t.gridStoreAdmin.roles.lessor.title
                    : user.role === 'cashier'
                    ? t.gridStoreAdmin.roles.cashier.title
                    : user.role === 'admin'
                    ? 'Admin'
                    : user.role === 'lessee'
                    ? 'Lessee'
                    : 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t.gridStoreAdmin.userManagement.table.assignedGrids}: <span className="font-medium text-slate-900 dark:text-white">{user.assignedGrids || 0}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.userManagement.addUser}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError(null);
                  setFormData({ name: '', email: '', phone: '' });
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError(null);
                    setFormData({ name: '', email: '', phone: '' });
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
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setFormError(null);
                  setFormData({ name: '', email: '', phone: '' });
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setFormError(null);
                    setFormData({ name: '', email: '', phone: '' });
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
                  {submitting ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
