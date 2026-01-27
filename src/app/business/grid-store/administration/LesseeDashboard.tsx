"use client";

import React from 'react';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MyRentGrids from '@/components/grid-store/MyRentGrids';
import CustomerTransactions from '@/components/grid-store/CustomerTransactions';
import AdminTransactions from '@/components/grid-store/AdminTransactions';
import StoreTransactions from '@/components/grid-store/StoreTransactions';
import ProductManagement from '@/components/grid-store/ProductManagement';
import { graphqlFetch } from '@/lib/graphql';
import type { Tab, RevenueEntry, GridStore, Lessee, Product } from '../types';

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
  const rentedGrids = React.useMemo(() => getFilteredGrids(), [selectedLesseeId, mockGridStores]);
  const lesseePayments = revenueEntries.filter(
    (e) => e.type === 'grid-rent' && selectedLessee?.rentedGridIds.includes(e.gridId)
  );
  const [lesseeGridOptions, setLesseeGridOptions] = React.useState<GridStore[]>([]);
  const [rentStats, setRentStats] = React.useState({ totalDue: 0, totalPaid: 0 });
  const [transactionSubTab, setTransactionSubTab] = React.useState<'customer' | 'store'>('customer');

  // Sync grid options from memoized rentedGrids
  React.useEffect(() => {
    setLesseeGridOptions(rentedGrids);
  }, [rentedGrids]);

  const totalRentDue = rentStats.totalDue;
  const totalRentPaid = rentStats.totalPaid;

  return (
    <>
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
            {tab === 'product-management' && t.gridStoreAdmin.dashboard.productManagement}
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.gridStoreAdmin.dashboard.rentPaymentSummary}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.rentPaymentSummaryDesc}</p>
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
              {t.gridStoreAdmin.dashboard.customerTransactions}
            </button>
            <button
              onClick={() => setTransactionSubTab('store')}
              className={`px-4 py-3 font-medium transition-colors ${
                transactionSubTab === 'store'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.gridStoreAdmin.dashboard.storeTransactions}
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
                amount: '',
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
        <ProductManagement
          products={products}
          onCreateProduct={handleCreateProduct}
          onEditProduct={handleEditProduct}
          showProductModal={showProductModal}
          setShowProductModal={setShowProductModal}
          productForm={productForm}
          setProductForm={setProductForm}
          handleSaveProduct={handleSaveProduct}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          lesseeGridOptions={lesseeGridOptions}
        />
      )}

      {/* Product modal and code modal are handled inside ProductManagement */}
    </>
  );
}
