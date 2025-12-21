"use client";
import React, { useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { GridStore, Lessor, Location, Role } from '@/app/business/grid-store/types';

interface Props {
  role: Role;
  grids: GridStore[];
  lessors: Lessor[];
  locations: Location[];
}

export default function GridManagement({ role, grids, lessors, locations }: Props) {
  const { t } = useLanguage();
  const [showGridModal, setShowGridModal] = useState(false);
  const [gridForm, setGridForm] = useState({ gridNumber: '', size: 'Small', gridPrice: 0, startDate: '', lessorId: '', locationId: '' });
  const [editingGrid, setEditingGrid] = useState<GridStore | null>(null);

  const handleCreateGrid = () => {
    setEditingGrid(null);
    setGridForm({ gridNumber: '', size: 'Small', gridPrice: 0, startDate: '', lessorId: '', locationId: '' });
    setShowGridModal(true);
  };

  const handleEditGrid = (grid: GridStore) => {
    setEditingGrid(grid);
    setGridForm({ gridNumber: grid.gridNumber, size: grid.size, gridPrice: grid.gridPrice || 0, startDate: grid.startDate || '', lessorId: grid.lessorId || '', locationId: grid.locationId || '' });
    setShowGridModal(true);
  };

  const handleSaveGrid = () => {
    // Placeholder save handler
    setShowGridModal(false);
  };

  return (
    <div>
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.gridStoreAdmin.gridManagement.title}
          </h3>
          {role === 'admin' && (
            <button onClick={handleCreateGrid} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">{t.gridStoreAdmin.gridManagement.addGrid}</span>
            </button>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.gridNumber}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.size}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.price}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.status}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.startDate}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.lessor}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.location}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.gridManagement.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {grids.map((grid) => (
                <tr key={grid.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4"><span className="font-medium text-slate-900 dark:text-white">{grid.gridNumber}</span></td>
                  <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{grid.size}</span></td>
                  <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${grid.gridPrice || 0}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${grid.status === 'rented' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                      {grid.status === 'rented' ? t.gridStoreAdmin.gridManagement.table.statusRented : t.gridStoreAdmin.gridManagement.table.statusAvailable}
                    </span>
                  </td>
                  <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{grid.startDate || '-'}</span></td>
                  <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{grid.lessorName || '-'}</span></td>
                  <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{grid.locationName || '-'}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEditGrid(grid)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title={t.gridStoreAdmin.gridManagement.table.edit}><Edit className="w-4 h-4" /></button>
                      {role === 'admin' && (
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title={t.gridStoreAdmin.gridManagement.table.delete}><Trash2 className="w-4 h-4" /></button>
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
          {grids.map((grid) => (
            <div key={grid.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{grid.gridNumber}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{grid.size}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">${grid.gridPrice || 0}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${grid.status === 'rented' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                  {grid.status === 'rented' ? t.gridStoreAdmin.gridManagement.table.statusRented : t.gridStoreAdmin.gridManagement.table.statusAvailable}
                </span>
              </div>
              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                {grid.lessorName && (
                  <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.gridManagement.table.lessor}:</span><span className="font-medium text-slate-900 dark:text-white">{grid.lessorName}</span></div>
                )}
                {grid.locationName && (
                  <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.gridManagement.table.location}:</span><span className="font-medium text-slate-900 dark:text-white">{grid.locationName}</span></div>
                )}
                {grid.startDate && (
                  <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.gridManagement.table.startDate}:</span><span className="font-medium text-slate-900 dark:text-white">{grid.startDate}</span></div>
                )}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => handleEditGrid(grid)} className="flex-1 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2 justify-center">
                  <Edit className="w-4 h-4" />
                  <span>{t.gridStoreAdmin.gridManagement.table.edit}</span>
                </button>
                {role === 'admin' && (
                  <button className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid Management Modal */}
      {showGridModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingGrid ? t.gridStoreAdmin.gridModal.editTitle : t.gridStoreAdmin.gridModal.createTitle}
              </h3>
              <button onClick={() => setShowGridModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.gridNumber}</label>
                <input type="text" value={gridForm.gridNumber} onChange={(e) => setGridForm({ ...gridForm, gridNumber: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" placeholder={t.gridStoreAdmin.gridModal.gridNumberPlaceholder} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.size}</label>
                <select value={gridForm.size} onChange={(e) => setGridForm({ ...gridForm, size: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option value="Small">{t.gridStoreAdmin.gridModal.sizeSmall}</option>
                  <option value="Medium">{t.gridStoreAdmin.gridModal.sizeMedium}</option>
                  <option value="Large">{t.gridStoreAdmin.gridModal.sizeLarge}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.price}</label>
                <input type="number" value={gridForm.gridPrice} onChange={(e) => setGridForm({ ...gridForm, gridPrice: Number(e.target.value) })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" placeholder={t.gridStoreAdmin.gridModal.pricePlaceholder} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.startDate}</label>
                <input type="date" value={gridForm.startDate} onChange={(e) => setGridForm({ ...gridForm, startDate: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.assignLessor}</label>
                <select value={gridForm.lessorId} onChange={(e) => setGridForm({ ...gridForm, lessorId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option value="">{t.gridStoreAdmin.gridModal.selectLessor}</option>
                  {lessors.map((lessor) => (
                    <option key={lessor.id} value={lessor.id}>{lessor.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.gridModal.assignLocation}</label>
                <select value={gridForm.locationId} onChange={(e) => setGridForm({ ...gridForm, locationId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option value="">{t.gridStoreAdmin.gridModal.selectLocation}</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name} - {location.address}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowGridModal(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t.gridStoreAdmin.modal.cancel}</button>
              <button onClick={handleSaveGrid} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{editingGrid ? t.gridStoreAdmin.gridModal.update : t.gridStoreAdmin.gridModal.create}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
