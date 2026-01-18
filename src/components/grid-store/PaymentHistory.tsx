'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { RevenueEntry } from '@/app/business/grid-store/administration/page';

interface PaymentHistoryProps {
  payments: RevenueEntry[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden" hover={false}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.date}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.gridNumber}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.amount}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.dashboard.table.collected}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {payment.date}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {payment.gridNumber}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    ${payment.amount}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        payment.collected
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {payment.collected ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {payment.collected ? (t.gridStoreAdmin.dashboard.table.yes || 'Yes') : (t.gridStoreAdmin.dashboard.table.no || 'No')}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  {t.gridStoreAdmin.dashboard.noPaymentHistory || 'No payment history'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
