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
    type: 'grid-rent' | 'item-sale';
    gridId: string;
    handlerRole: 'lessor' | 'cashier';
    handlerId: string;
    itemName: string;
    amount: number;
    collected: boolean;
  };
  setRevenueForm: React.Dispatch<React.SetStateAction<{
    date: string;
    type: 'grid-rent' | 'item-sale';
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
      <Card className="p-4 md:p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            {headerTitle}
          </h3>
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

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.date}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.type}</th>
                {showGridNumber && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.gridNumber}</th>
                )}
                {canAddRecord && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{handlerLabel}</th>
                )}
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{itemLabel}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.amount}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.collected}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {displayedEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-4"><span className="text-slate-900 dark:text-white">{entry.date}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === 'grid-rent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                      {entry.type === 'grid-rent' ? t.gridStoreAdmin.revenueManagement.table.typeGridRent : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                    </span>
                  </td>
                  {showGridNumber && (
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{entry.gridNumber}</span></td>
                  )}
                  {canAddRecord && (
                    <td className="py-3 px-4">
                      <span className="text-slate-700 dark:text-slate-300">
                        {entry.handlerName ? `${entry.handlerName} (${entry.handlerRole === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title})` : '-'}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {entry.handlerName && <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{entry.handlerName}</span>}
                      {entry.trxType && <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">{entry.trxType}</span>}
                      {entry.notes && <span className="text-xs text-slate-500 dark:text-slate-500 italic">{entry.notes}</span>}
                      {entry.itemName && <span className="text-xs text-slate-600 dark:text-slate-400">To: {entry.itemName}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${entry.amount}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.collected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                      {entry.collected ? t.gridStoreAdmin.revenueManagement.table.yes : t.gridStoreAdmin.revenueManagement.table.no}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleCollected(entry.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {entry.collected ? t.gridStoreAdmin.revenueManagement.table.markUncollected : t.gridStoreAdmin.revenueManagement.table.markCollected}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {displayedEntries.map((entry) => (
            <div key={entry.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{entry.gridNumber}</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{entry.date}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${entry.type === 'grid-rent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                  {entry.type === 'grid-rent' ? t.gridStoreAdmin.revenueManagement.table.typeGridRent : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                </span>
              </div>
              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                {canAddRecord && entry.handlerName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.handler}:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{`${entry.handlerName} (${entry.handlerRole === 'lessor' ? t.gridStoreAdmin.roles.lessor.title : t.gridStoreAdmin.roles.cashier.title})`}</span>
                  </div>
                )}
                {canAddRecord && entry.handlerName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.handler}:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{entry.handlerName}</span>
                  </div>
                )}
                {entry.trxType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Type:</span>
                    <span className="font-medium text-slate-900 dark:text-white uppercase text-xs">{entry.trxType}</span>
                  </div>
                )}
                {entry.itemName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">To:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{entry.itemName}</span>
                  </div>
                )}
                {entry.notes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Notes:</span>
                    <span className="text-slate-900 dark:text-white text-xs italic">{entry.notes}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.amount}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${entry.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.collected}:</span>
                  <span className={`font-medium ${entry.collected ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>{entry.collected ? t.gridStoreAdmin.revenueManagement.table.yes : t.gridStoreAdmin.revenueManagement.table.no}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => onToggleCollected(entry.id)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {entry.collected ? t.gridStoreAdmin.revenueManagement.table.markUncollected : t.gridStoreAdmin.revenueManagement.table.markCollected}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
