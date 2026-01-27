'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Role, Lessor, Cashier, Lessee } from '../types';

interface ViewingAsSelectorProps {
  currentRole: Role;
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

export default function ViewingAsSelector({
  currentRole,
  selectedLessorId,
  onLessorIdChange,
  selectedCashierId,
  onCashierIdChange,
  selectedLesseeId,
  onLesseeIdChange,
  fetchedLessors,
  fetchedCashiers,
  fetchedLessees,
}: ViewingAsSelectorProps) {
  const { t } = useLanguage();

  return (
    <>
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
