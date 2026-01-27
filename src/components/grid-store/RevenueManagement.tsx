'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { RevenueEntry, GridStore, Lessor, Cashier } from '@/app/business/grid-store/administration/page';

interface RevenueManagementProps {
  revenueEntries: RevenueEntry[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  revenueForm: {
    date: string;
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  };
  setRevenueForm: React.Dispatch<React.SetStateAction<{
    date: string;
    type: 'grid-rent' | 'item-sale' | 'grid-income' | 'others';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  }>>;
  gridStores: GridStore[];
  lessors: Lessor[];
  cashiers: Cashier[];
  onOpenModal?: () => void;
  onSave: () => void;
  onToggleCollected: (id: string) => void;
  canAddRecord?: boolean;
  filteredEntries?: RevenueEntry[];
  title?: string;
  typeOptions?: Array<'grid-rent' | 'item-sale'>;
  handlerRoleOptions?: Array<'lessor' | 'cashier'>;
  itemHeaderLabel?: string;
  handlerHeaderLabel?: string;
  showGridNumber?: boolean;
  showPayerRecipient?: boolean;
  showType?: boolean;
  showOrderNo?: boolean;
}

export default function RevenueManagement({
  revenueEntries,
  showModal,
  setShowModal,
  revenueForm,
  setRevenueForm,
  gridStores,
  lessors,
  cashiers,
  onOpenModal,
  onSave,
  onToggleCollected,
  canAddRecord = true,
  filteredEntries,
  title,
  typeOptions = ['grid-rent', 'item-sale'],
  handlerRoleOptions = ['lessor', 'cashier'],
  itemHeaderLabel,
  handlerHeaderLabel,
  showGridNumber = true,
  showPayerRecipient = false,
  showType = true,
  showOrderNo = false,
}: RevenueManagementProps) {
  const { t } = useLanguage();
  const displayedEntries = filteredEntries || revenueEntries;
  const headerTitle = title || t.gridStoreAdmin.revenueManagement.title;
  const currentTypeValue = typeOptions.includes(revenueForm.type) ? revenueForm.type : typeOptions[0];
  const currentHandlerRole = handlerRoleOptions.includes(revenueForm.handlerRole) ? revenueForm.handlerRole : handlerRoleOptions[0];
  const itemLabel = itemHeaderLabel || t.gridStoreAdmin.revenueManagement.table.item;
  const handlerLabel = handlerHeaderLabel || t.gridStoreAdmin.revenueManagement.table.handler;

  return (
    <div>
      {/* Header Card */}
      <div className="relative group mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-cyan-200 to-green-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition duration-500 animate-pulse pointer-events-none"></div>
        <div className="relative overflow-hidden p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900">{headerTitle}</h3>
                <p className="text-xs text-slate-600">View all transaction records</p>
              </div>
            </div>
            {canAddRecord && onOpenModal && (
              <button
                onClick={onOpenModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t.gridStoreAdmin.revenueManagement.addRecord}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="relative">
        <div className="overflow-x-auto shadow-lg rounded-3xl border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-cyan-500">
                {showOrderNo && (
                  <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">Order No.</th>
                )}
                <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.date}</th>
                {showType && (
                  <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.type}</th>
                )}
                {showGridNumber && (
                  <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.gridNumber}</th>
                )}
                {showPayerRecipient ? (
                  <>
                    <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">Payer</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">Recipient</th>
                  </>
                ) : (
                  <>
                    {canAddRecord && (
                      <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{handlerLabel}</th>
                    )}
                    <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">Notes</th>
                  </>
                )}
                <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.amount}</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.collected}</th>
                {canAddRecord && (
                  <th className="text-left py-4 px-6 text-xs font-bold text-white uppercase tracking-wider">{t.gridStoreAdmin.revenueManagement.table.actions}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                  {showOrderNo && (
                    <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 text-xs font-mono font-bold text-slate-700">{entry.id}</span></td>
                  )}
                  <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{entry.date}</span></td>
                  {showType && (
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        entry.trxType === 'rent_payment' ? 'bg-blue-100 text-blue-700' :
                        entry.trxType === 'settlement_to_lessor' ? 'bg-green-100 text-green-700' :
                        entry.trxType === 'settlement_to_lessee' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {entry.trxType === 'rent_payment' ? 'Lessee Rent Grid' :
                         entry.trxType === 'settlement_to_lessor' ? 'Store Income' :
                         entry.trxType === 'settlement_to_lessee' ? 'Grid Sales' :
                         'Others'}
                      </span>
                    </td>
                  )}
                  {showGridNumber && (
                    <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{entry.gridNumber}</span></td>
                  )}
                  {showPayerRecipient ? (
                    <>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900">{entry.fromUser?.name || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900">{entry.toUser?.name || '-'}</span>
                      </td>
                    </>
                  ) : (
                    <>
                      {canAddRecord && (
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-900">
                            {entry.handlerName ? `${entry.handlerName}` : '-'}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{entry.notes || entry.itemName || '-'}</span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${entry.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        entry.collected
                          ? 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                          : 'bg-orange-100 border border-orange-300 text-orange-700'
                      }`}
                    >
                      {entry.collected ? 'Yes' : 'No'}
                    </div>
                  </td>
                  {canAddRecord && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleCollected(entry.id)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors font-semibold ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {entry.collected ? 'Mark Pending' : 'Mark Collected'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {displayedEntries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-600">No transactions yet</div>
        </div>
      )}

      {/* Revenue Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.gridStoreAdmin.revenueManagement.modal.title}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.date}</label>
                <input type="date" value={revenueForm.date} onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.type}</label>
                <select
                  value={currentTypeValue}
                  onChange={(e) => setRevenueForm({ ...revenueForm, type: e.target.value as 'grid-rent' | 'item-sale' })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  disabled={typeOptions.length === 1}
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'grid-rent'
                        ? t.gridStoreAdmin.revenueManagement.table.typeGridRent
                        : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.grid}</label>
                  <select value={revenueForm.gridId} onChange={(e) => setRevenueForm({ ...revenueForm, gridId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option value="">{t.gridStoreAdmin.revenueManagement.modal.selectGrid}</option>
                  {gridStores.map((g) => (
                    <option key={g.id} value={g.id}>{g.gridNumber} - {g.locationName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.handlerRole}</label>
                  <select
                    value={currentHandlerRole}
                    onChange={(e) => setRevenueForm({ ...revenueForm, handlerRole: e.target.value as 'lessor' | 'cashier', handlerId: '' })}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    disabled={handlerRoleOptions.length === 1}
                  >
                    {handlerRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.handler}</label>
                  <select value={revenueForm.handlerId} onChange={(e) => setRevenueForm({ ...revenueForm, handlerId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                    <option value="">{t.gridStoreAdmin.revenueManagement.modal.selectHandler}</option>
                    {(currentHandlerRole === 'lessor' ? lessors : cashiers).map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {currentTypeValue === 'item-sale' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.itemName}</label>
                  <input type="text" value={revenueForm.itemName} onChange={(e) => setRevenueForm({ ...revenueForm, itemName: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.revenueManagement.modal.amount}</label>
                  <input type="number" value={revenueForm.amount} onChange={(e) => setRevenueForm({ ...revenueForm, amount: Number(e.target.value) })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <input id="collected" type="checkbox" checked={revenueForm.collected} onChange={(e) => setRevenueForm({ ...revenueForm, collected: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="collected" className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.modal.collected}</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {t.gridStoreAdmin.revenueManagement.modal.cancel}
              </button>
              <button onClick={onSave} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                {t.gridStoreAdmin.revenueManagement.modal.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
