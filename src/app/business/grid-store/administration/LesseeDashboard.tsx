"use client";

import React from 'react';
import { DollarSign, CreditCard, Edit, Plus, X, QrCode, BarChart3 as BarcodeIcon, Download, AlertCircle, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import MyRentGrids from '@/components/grid-store/MyRentGrids';
import CustomerTransactions from '@/components/grid-store/CustomerTransactions';
import AdminTransactions from '@/components/grid-store/AdminTransactions';
import StoreTransactions from '@/components/grid-store/StoreTransactions';
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
  mockGridStores: GridStore[];
  isAdmin?: boolean;
  isInitialized?: boolean;
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
  mockGridStores,
  isAdmin = false,
  isInitialized = false
}: LesseeDashboardProps) {
  const { t } = useLanguage();
  const selectedLessee = mockLessees.find((l) => l.id === selectedLesseeId);
  const rentedGrids = getFilteredGrids();
  const lesseePayments = revenueEntries.filter(
    (e) => e.type === 'grid-rent' && selectedLessee?.rentedGridIds.includes(e.gridId)
  );
  const [lesseeGridOptions, setLesseeGridOptions] = React.useState<GridStore[]>([]);
  const [showCodeModal, setShowCodeModal] = React.useState(false);
  const [selectedProductForCode, setSelectedProductForCode] = React.useState<Product | null>(null);
  const [codeType, setCodeType] = React.useState<'qr' | 'barcode'>('qr');
  const [codeSize, setCodeSize] = React.useState<number>(256);
  const qrRef = React.useRef<HTMLDivElement>(null);
  const [rentStats, setRentStats] = React.useState({ totalDue: 0, totalPaid: 0 });
  const [transactionSubTab, setTransactionSubTab] = React.useState<'customer' | 'store'>('customer');

  const downloadCode = () => {
    if (codeType === 'qr') {
      // QR download via canvas
      const svg = qrRef.current?.querySelector('svg') as SVGSVGElement | null;
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${selectedProductForCode?.name || 'qr'}-qr.png`;
          link.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
    } else {
      // Barcode download via SVG
      const svg = document.querySelector('svg[data-testid="barcode"]') as SVGSVGElement | null;
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `${selectedProductForCode?.name || 'barcode'}-barcode.png`;
          link.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
    }
  };

  const totalRentDue = rentStats.totalDue;
  const totalRentPaid = rentStats.totalPaid;

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
        <MyRentGrids 
          grids={rentedGrids} 
          showStats={true} 
          showActions={false}
          isAdmin={isAdmin}
          lesseeId={selectedLesseeId}
          onGridsLoaded={(gs) => setLesseeGridOptions(gs)}
        />
      )}

      {currentTab === 'payment-history' && (
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-300 via-amber-200 to-green-300 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
          <div className="relative overflow-hidden p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 dark:border-slate-700/50">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rent Payment Summary</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Overview of rent due, paid, and outstanding balance</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Rent Due */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl border border-red-100 dark:border-red-800/30">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.gridStoreAdmin.dashboard.totalRentDue || 'Total Rent Due'}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    ${totalRentDue}
                  </p>
                </div>
              </div>

              {/* Total Rent Paid */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-100 dark:border-green-800/30">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.gridStoreAdmin.dashboard.totalRentPaid || 'Total Rent Paid'}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    ${totalRentPaid}
                  </p>
                </div>
              </div>

              {/* Outstanding Balance */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.gridStoreAdmin.dashboard.outstandingBalance || 'Outstanding Balance'}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                    ${totalRentDue - totalRentPaid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'payment-history' && (
        <div className="space-y-6">
          {/* Transaction Sub-tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTransactionSubTab('customer')}
              className={`px-4 py-3 font-medium transition-colors ${
                transactionSubTab === 'customer'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Customer Transactions
            </button>
            <button
              onClick={() => setTransactionSubTab('store')}
              className={`px-4 py-3 font-medium transition-colors ${
                transactionSubTab === 'store'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Store Transactions
            </button>
          </div>

          {/* Customer Transactions View */}
          {transactionSubTab === 'customer' && (
            <CustomerTransactions isInitialized={isInitialized} />
          )}

          {/* Store Transactions View */}
          {transactionSubTab === 'store' && (
            <StoreTransactions
              revenueEntries={revenueEntries}
              showModal={false}
              setShowModal={() => {}}
              revenueForm={{
                date: new Date().toISOString().split('T')[0],
                type: 'grid-rent',
                gridId: '',
                handlerRole: 'lessor',
                handlerId: '',
                itemName: '',
                amount: 0,
                collected: false,
              }}
              setRevenueForm={() => {}}
              gridStores={mockGridStores}
              lessors={[]}
              onOpenModal={() => {}}
              onSave={() => {}}
              onToggleCollected={() => {}}
              canAddRecord={false}
              onRentStatsChange={setRentStats}
            />
          )}
        </div>
      )}

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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Item ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Grid</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Store</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Version</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300 text-sm">{product.itemId || '-'}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">{product.name}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.description}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.gridNumber}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.storeName || '-'}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-700 dark:text-slate-300">{product.version ?? '-'}</span></td>
                    <td className="py-3 px-4"><span className="text-slate-900 dark:text-white font-medium">${product.price}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProductForCode(product);
                            setCodeType('qr');
                            setCodeSize(256);
                            setShowCodeModal(true);
                          }}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="QR / Barcode"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
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
            {products.map((product) => (
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
                    <span className="text-slate-600 dark:text-slate-400">Item ID:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.itemId || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Description:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.description}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Store:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.storeName || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Version:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.version ?? '-'}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedProductForCode(product);
                        setCodeType('qr');
                        setCodeSize(256);
                        setShowCodeModal(true);
                      }}
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Code</span>
                    </button>
                    <button onClick={() => handleEditProduct(product)} className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Grid Selection - Required field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Grid <span className="text-red-500">*</span></label>
                {lesseeGridOptions.length === 0 && (
                  <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Loading your rented grids... If grids don't appear, make sure you have rented grids in the "My Grids" section.
                    </p>
                  </div>
                )}
                <select 
                  value={productForm.gridId} 
                  onChange={(e) => setProductForm({ ...productForm, gridId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                >
                  <option value="">-- Select a Grid --</option>
                  {lesseeGridOptions.length > 0 ? (
                    lesseeGridOptions.map((grid) => (
                      <option key={grid.id} value={grid.id}>
                        Grid {grid.gridNumber || String(grid.id)}
                      </option>
                    ))
                  ) : (
                    <option disabled>No rented grids found</option>
                  )}
                </select>
                {lesseeGridOptions.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    📌 You need to rent a grid first to add products to it.
                  </p>
                )}
              </div>

              {/* Product Name - Required field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  placeholder="e.g., Vintage Watch, Collectible Card" 
                />
              </div>

              {/* Description - Optional field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description <span className="text-slate-500">(Optional)</span></label>
                <textarea 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} 
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  rows={3}
                  placeholder="Add details about your product..."
                />
              </div>

              {/* Price - Required field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-slate-500 dark:text-slate-400">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} 
                    className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowProductModal(false)} 
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProduct} 
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!productForm.gridId || !productForm.name.trim()}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCodeModal && selectedProductForCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR / Barcode</h3>
              <button onClick={() => setShowCodeModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              <div className="font-medium">{selectedProductForCode.name}</div>
              <div className="break-all">GUID: {selectedProductForCode.guid || selectedProductForCode.id}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="codeType" checked={codeType==='qr'} onChange={()=>setCodeType('qr')} />
                    <span className="flex items-center gap-1"><QrCode className="w-4 h-4"/> QR</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="codeType" checked={codeType==='barcode'} onChange={()=>setCodeType('barcode')} />
                    <span className="flex items-center gap-1"><BarcodeIcon className="w-4 h-4"/> Barcode</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Size</label>
                <input type="range" min={64} max={1024} step={16} value={codeSize} onChange={(e)=>setCodeSize(parseInt(e.target.value))} className="w-full"/>
                <div className="text-xs text-slate-500 mt-1">{codeSize}px</div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-4 flex items-center justify-center mb-4 min-h-[300px]">
              {selectedProductForCode.guid ? (
                codeType === 'qr' ? (
                  <div ref={qrRef}>
                    <QRCode
                      value={selectedProductForCode.guid}
                      size={Math.min(codeSize, 300)}
                      level="H"
                    />
                  </div>
                ) : (
                  <Barcode
                    value={selectedProductForCode.guid}
                    format="CODE128"
                    width={2}
                    height={Math.max(50, codeSize / 4)}
                    displayValue={true}
                  />
                )
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-300">No GUID available for this item.</div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={downloadCode}
                disabled={!selectedProductForCode.guid}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4"/>
                Download
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
