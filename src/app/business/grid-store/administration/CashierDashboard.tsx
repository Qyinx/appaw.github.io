'use client';

import React from 'react';
import { Grid3X3, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { GridStore, Cashier } from './page';

interface CashierDashboardProps {
  getFilteredGrids: () => GridStore[];
  selectedCashierId: string;
  mockCashiers: Cashier[];
}

export default function CashierDashboard({ getFilteredGrids, selectedCashierId, mockCashiers }: CashierDashboardProps) {
  const { t } = useLanguage();
  const selectedCashier = mockCashiers.find(c => c.id === selectedCashierId);

  return (
    <>
      {/* Cashier Location Display */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.gridStoreAdmin.dashboard.currentCashier}
            </h3>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedCashier?.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.gridStoreAdmin.dashboard.location}
            </p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {selectedCashier?.locationName}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                {t.gridStoreAdmin.dashboard.stats.totalGrids}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {getFilteredGrids().length}
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
                {getFilteredGrids().filter(g => g.status === 'rented').length}
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
                {getFilteredGrids().filter(g => g.status === 'available').length}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">
                {t.gridStoreAdmin.dashboard.stats.revenue}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                ${getFilteredGrids().reduce((sum, g) => sum + (g.monthlyRent || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grid Management Table */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            {t.gridStoreAdmin.dashboard.gridsToProcess}
          </h3>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.gridNumber}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.size}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.status}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.tenant}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.rent}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t.gridStoreAdmin.dashboard.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredGrids().map((grid) => (
                <tr key={grid.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 dark:text-white">{grid.gridNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">{grid.size}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      grid.status === 'rented'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {grid.status === 'rented' ? t.gridStoreAdmin.dashboard.table.statusRented : t.gridStoreAdmin.dashboard.table.statusAvailable}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 dark:text-slate-300">
                      {grid.tenant || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-900 dark:text-white font-medium">
                      {grid.monthlyRent ? `$${grid.monthlyRent}` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {grid.status === 'rented' && (
                        <button
                          className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          Process Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {getFilteredGrids().map((grid) => (
            <div key={grid.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{grid.gridNumber}</h4>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{grid.size}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  grid.status === 'rented'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }`}>
                  {grid.status === 'rented' ? t.gridStoreAdmin.dashboard.table.statusRented : t.gridStoreAdmin.dashboard.table.statusAvailable}
                </span>
              </div>
              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                {grid.tenant && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.table.tenant}:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{grid.tenant}</span>
                  </div>
                )}
                {grid.monthlyRent && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.table.rent}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">${grid.monthlyRent}</span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                {grid.status === 'rented' && (
                  <button
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Process Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}