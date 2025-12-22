'use client';

import React from 'react';
import { Grid3X3, DollarSign, Store, Plus, X, CheckCircle, AlertCircle, Eye, Edit } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { LessorTab, RevenueEntry, GridStore, Product } from './page';

interface LessorDashboardProps {
  lessorTab: LessorTab;
  setLessorTab: (tab: LessorTab) => void;
  selectedLessorId: string;
  revenueEntries: RevenueEntry[];
  toggleCollected: (id: string) => void;
  products: Product[];
  showProductModal: boolean;
  setShowProductModal: (show: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  productForm: { name: string; description: string; price: number; gridId: string; };
  setProductForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: number; gridId: string; }>>;
  handleCreateProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleSaveProduct: () => void;
  getFilteredGrids: () => GridStore[];
  getFilteredProducts: () => Product[];
  mockGridStores: GridStore[];
}

export default function LessorDashboard({
  lessorTab,
  setLessorTab,
  selectedLessorId,
  revenueEntries,
  toggleCollected,
  products,
  showProductModal,
  setShowProductModal,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  handleCreateProduct,
  handleEditProduct,
  handleSaveProduct,
  getFilteredGrids,
  getFilteredProducts,
  mockGridStores,
}: LessorDashboardProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Lessor Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          {[
            { key: 'grid-management', label: t.gridStoreAdmin.tabs.gridManagement, icon: Grid3X3 },
            { key: 'revenue-management', label: t.gridStoreAdmin.tabs.revenueManagement, icon: DollarSign },
            { key: 'product-management', label: 'Product Management', icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = lessorTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setLessorTab(tab.key as LessorTab)}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Management Tab (Lessor) */}
      {lessorTab === 'grid-management' && (
        <>
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
                {t.gridStoreAdmin.dashboard.myAssignedGrids}
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
                          <button
                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title={t.gridStoreAdmin.dashboard.table.view}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
                    <button
                      className="w-full px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t.gridStoreAdmin.dashboard.table.view}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Revenue Management Tab (Lessor) */}
      {lessorTab === 'revenue-management' && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {t.gridStoreAdmin.revenueManagement.title}
            </h3>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.date}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.type}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.gridNumber}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.item}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.amount}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.collected}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.revenueManagement.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {revenueEntries.filter(entry => entry.handlerRole === 'lessor' && entry.handlerId === selectedLessorId).map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white">{entry.date}</span></td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.type === 'grid-rent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}> 
                        {entry.type === 'grid-rent' ? t.gridStoreAdmin.revenueManagement.table.typeGridRent : t.gridStoreAdmin.revenueManagement.table.typeItemSale}
                      </span>
                    </td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{entry.gridNumber}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{entry.itemName || '-'}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${entry.amount}</span></td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.collected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {entry.collected ? t.gridStoreAdmin.revenueManagement.table.yes : t.gridStoreAdmin.revenueManagement.table.no}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCollected(entry.id)}
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
            {revenueEntries.filter(entry => entry.handlerRole === 'lessor' && entry.handlerId === selectedLessorId).map((entry) => (
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
                  {entry.itemName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.revenueManagement.table.item}:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{entry.itemName}</span>
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
                    onClick={() => toggleCollected(entry.id)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${entry.collected ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    {entry.collected ? t.gridStoreAdmin.revenueManagement.table.markUncollected : t.gridStoreAdmin.revenueManagement.table.markCollected}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Product Management Tab (Lessor) */}
      {lessorTab === 'product-management' && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Product Management
            </h3>
            <button
              onClick={handleCreateProduct}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Grid</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProducts().map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">{product.name}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.description}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.gridNumber}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${product.price}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {getFilteredProducts().map((product) => (
              <div key={product.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{product.name}</h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{product.gridNumber}</div>
                  </div>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">${product.price}</span>
                </div>
                <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Description:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.description}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="w-full px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Product Management Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Grid
                </label>
                <select
                  value={productForm.gridId}
                  onChange={(e) => setProductForm({ ...productForm, gridId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">Select Grid</option>
                  {mockGridStores.filter(grid => grid.lessorId === selectedLessorId).map((grid) => (
                    <option key={grid.id} value={grid.id}>
                      {grid.gridNumber} - {grid.locationName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t.gridStoreAdmin.modal.cancel}
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}