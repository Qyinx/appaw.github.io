"use client";
import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { User } from '@/app/business/grid-store/types';

interface Props {
  users: User[];
  onCreate: () => void;
  onEdit: (user: User) => void;
}

export default function UserManagement({ users, onCreate, onEdit }: Props) {
  const { t } = useLanguage();
  return (
    <div>
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.gridStoreAdmin.userManagement.title}
          </h3>
          <button
            onClick={onCreate}
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
                    <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">{user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'lessor'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    }`}>
                      {user.role === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title}
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
                        onClick={() => onEdit(user)}
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
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">{user.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  user.role === 'lessor'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                }`}>
                  {user.role === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t.gridStoreAdmin.userManagement.table.assignedGrids}: <span className="font-medium text-slate-900 dark:text-white">{user.assignedGrids || 0}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
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
    </div>
  );
}
