'use client';

import React from 'react';
import { DollarSign, CreditCard, Edit, Plus, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import MyGrids from '@/components/grid-store/MyGrids';
import PaymentHistory from '@/components/grid-store/PaymentHistory';
import type { Tab, RevenueEntry, GridStore, Lessee, Product } from './page';

interface LesseeDashboardProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedLesseeId: string;
  getFilteredGrids: () => GridStore[];
  revenueEntries: RevenueEntry[];
  toggleCollected: (id: string) => void;
  mockLessees: Lessee[];
  products: Product[];
  handleCreateProduct: () => void;
  handleEditProduct: (product: Product) => void;
  showProductModal: boolean;
  setShowProductModal: (show: boolean) => void;
  productForm: { name: string; description: string; price: number; gridId: string };
  setProductForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: number; gridId: string }>>;
  handleSaveProduct: () => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  getLesseeProducts: () => Product[];
  mockGridStores: GridStore[];
  isAdmin?: boolean;
  delegateUserId?: string;
  onDelegateUserIdChange?: (userId: string) => void;
}

export default function LesseeDashboard({
  currentTab,
  onTabChange,
  selectedLesseeId,
  getFilteredGrids,
  revenueEntries,
  toggleCollected,
  mockLessees,
  products,
  handleCreateProduct,
  handleEditProduct,
  showProductModal,
  setShowProductModal,
  productForm,
  setProductForm,
  handleSaveProduct,
  editingProduct,
  setEditingProduct,
  getLesseeProducts,
  mockGridStores,
  isAdmin = false,
  delegateUserId = '',
  onDelegateUserIdChange
}: LesseeDashboardProps) {
  const { t } = useLanguage();
  const selectedLessee = mockLessees.find((l) => l.id === selectedLesseeId);
  const rentedGrids = getFilteredGrids();
  const lesseePayments = revenueEntries.filter(
    (e) => e.type === 'grid-rent' && selectedLessee?.rentedGridIds.includes(e.gridId)
  );

  const totalRentDue = rentedGrids.reduce((sum, grid) => sum + (grid.monthlyRent || 0), 0);
  const totalRentPaid = lesseePayments.filter((p) => p.collected).reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <div className="mb-8 p-4 md:p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.currentLessee || 'Current Lessee'}</h3>
            <p className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">{selectedLessee?.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedLessee?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.phone || 'Phone'}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLessee?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        {(['my-grids', 'payment-history', 'product-management'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              currentTab === tab
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'my-grids' && (t.gridStoreAdmin.dashboard.myGrids || 'My Grids')}
            {tab === 'payment-history' && (t.gridStoreAdmin.dashboard.paymentHistory || 'Payment History')}
            {tab === 'product-management' && 'Product Management'}
          </button>
        ))}
      </div>

      {currentTab === 'my-grids' && (
        <MyGrids 
          grids={rentedGrids} 
          showStats={true} 
          showActions={false}
          isAdmin={isAdmin}
          delegateUserId={delegateUserId}
          onDelegateUserIdChange={onDelegateUserIdChange}
        />
      )}

      {currentTab === 'payment-history' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{t.gridStoreAdmin.dashboard.totalRentDue || 'Total Rent Due'}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">${totalRentDue}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{t.gridStoreAdmin.dashboard.totalRentPaid || 'Total Rent Paid'}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">${totalRentPaid}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{t.gridStoreAdmin.dashboard.outstandingBalance || 'Outstanding'}</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">${totalRentDue - totalRentPaid}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {currentTab === 'payment-history' && <PaymentHistory payments={lesseePayments} />}

      {currentTab === 'product-management' && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Product Management</h3>
            <button
              onClick={handleCreateProduct}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

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
                {getLesseeProducts().map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">{product.name}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.description}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.gridNumber}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${product.price}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProduct(product)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {getLesseeProducts().map((product) => (
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
                  <button onClick={() => handleEditProduct(product)} className="w-full px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price</label>
                <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grid</label>
                <select value={productForm.gridId} onChange={(e) => setProductForm({ ...productForm, gridId: e.target.value })} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
                  <option value="">Select Grid</option>
                  {mockGridStores.filter((grid) => selectedLesseeId && selectedLessee?.rentedGridIds.includes(grid.id)).map((grid) => (
                    <option key={grid.id} value={grid.id}>{grid.gridNumber} - {grid.locationName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{t.gridStoreAdmin.modal.cancel}</button>
              <button onClick={handleSaveProduct} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">{editingProduct ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
