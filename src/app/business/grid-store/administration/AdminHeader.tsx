'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Role, Lessor, Cashier, Lessee } from '../types';
import SelectRoleHeader from './SelectRoleHeader';

interface AdminHeaderProps {
  isAdmin: boolean;
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

export default function AdminHeader({
  isAdmin,
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
}: AdminHeaderProps) {
  const { t } = useLanguage();

  if (!isAdmin && !loggedUser) {
    return null;
  }

  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="container-custom">
        {/* Admin role selector (always available for admins, even when simulating other roles) */}
        {isAdmin && (
          <SelectRoleHeader
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            loggedUser={loggedUser}
            onLogout={onLogout}
            selectedLessorId={selectedLessorId}
            onLessorIdChange={onLessorIdChange}
            selectedCashierId={selectedCashierId}
            onCashierIdChange={onCashierIdChange}
            selectedLesseeId={selectedLesseeId}
            onLesseeIdChange={onLesseeIdChange}
            fetchedLessors={fetchedLessors}
            fetchedCashiers={fetchedCashiers}
            fetchedLessees={fetchedLessees}
          />
        )}

        {/* Non-admin user header */}
        {!isAdmin && loggedUser && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
      </div>
    </section>
  );
}
