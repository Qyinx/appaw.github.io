import React from 'react';
import { Shield, Users, CreditCard, Store, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Role, Lessor, Cashier, Lessee } from './page';

interface SelectRoleHeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  loggedUser: { name?: string; roles?: string[] | string } | null;
  onLogout: () => void;
  selectedLessorId: string;
  onLessorIdChange: (id: string) => void;
  selectedCashierId: string;
  onCashierIdChange: (id: string) => void;
  selectedLesseeId: string;
  onLesseeIdChange: (id: string) => void;
  fetchedLessors: Lessor[];
  fetchedCashiers: Cashier[];
  fetchedLessees: Lessee[];
}

export default function SelectRoleHeader({
  currentRole,
  onRoleChange,
  loggedUser,
  onLogout,
  selectedLessorId,
  onLessorIdChange,
  selectedCashierId,
  onCashierIdChange,
  selectedLesseeId,
  onLesseeIdChange,
  fetchedLessors,
  fetchedCashiers,
  fetchedLessees,
}: SelectRoleHeaderProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {t.gridStoreAdmin.dashboard.selectRole}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.gridStoreAdmin.dashboard.demoMode}
          </p>
        </div>
        <div className="flex gap-3">
          {(['admin', 'lessor', 'cashier', 'lessee'] as Role[]).map((role) => {
            const roleConfig = {
              admin: { icon: Shield, activeClass: 'bg-blue-500', hoverClass: 'hover:bg-slate-200' },
              lessor: { icon: Users, activeClass: 'bg-green-500', hoverClass: 'hover:bg-slate-200' },
              cashier: { icon: CreditCard, activeClass: 'bg-purple-500', hoverClass: 'hover:bg-slate-200' },
              lessee: { icon: Store, activeClass: 'bg-orange-500', hoverClass: 'hover:bg-slate-200' },
            };
            const Icon = roleConfig[role].icon;
            const { activeClass } = roleConfig[role];
            const isActive = currentRole === role;

            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? `${activeClass} text-white shadow-lg`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.gridStoreAdmin.roles[role].title}
              </button>
            );
          })}
        </div>
      </div>

      {loggedUser && (
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold">
              {t.auth.status.loggedInAs}: {loggedUser.name || t.auth.status.notAvailable}
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              {t.auth.status.roles}: {Array.isArray(loggedUser.roles) ? loggedUser.roles.join(', ') : loggedUser.roles || t.auth.status.notAvailable}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 w-fit"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Viewing As dropdown for lessor */}
      {currentRole === 'lessor' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.gridStoreAdmin.dashboard.viewingAs}
          </label>
          <select
            value={selectedLessorId}
            onChange={(e) => onLessorIdChange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
          >
            {fetchedLessors.map((lessor) => (
              <option key={lessor.id} value={lessor.id}>
                {lessor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Viewing As dropdown for cashier */}
      {currentRole === 'cashier' && (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.gridStoreAdmin.dashboard.viewingAs}
          </label>
          <select
            value={selectedCashierId}
            onChange={(e) => onCashierIdChange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
          >
            {fetchedCashiers.map((cashier) => (
              <option key={cashier.id} value={cashier.id}>
                {cashier.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {fetchedCashiers.find((c) => c.id === selectedCashierId)?.locationName}
          </p>
        </div>
      )}

      {/* Viewing As dropdown for lessee */}
      {currentRole === 'lessee' && (
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t.gridStoreAdmin.dashboard.viewingAs}
          </label>
          <select
            value={selectedLesseeId}
            onChange={(e) => onLesseeIdChange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
          >
            {fetchedLessees.map((lessee) => (
              <option key={lessee.id} value={lessee.id}>
                {lessee.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {fetchedLessees.find((l) => l.id === selectedLesseeId)?.email}
          </p>
        </div>
      )}
    </>
  );
}
