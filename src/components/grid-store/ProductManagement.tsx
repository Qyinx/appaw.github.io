"use client";

import React from 'react';
import { Plus, QrCode, BarChart3 as BarcodeIcon, Edit, X, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import type { GridStore, Product } from '@/app/business/grid-store/types';

interface ProductManagementProps {
  products: Product[];
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  showProductModal: boolean;
  setShowProductModal: (show: boolean) => void;
  productForm: { name: string; description: string; price: number; gridId: string };
  setProductForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: number; gridId: string }>>;
  handleSaveProduct: () => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  lesseeGridOptions: GridStore[];
}

export default function ProductManagement({
  products,
  onCreateProduct,
  onEditProduct,
  showProductModal,
  setShowProductModal,
  productForm,
  setProductForm,
  handleSaveProduct,
  editingProduct,
  setEditingProduct,
  lesseeGridOptions,
}: ProductManagementProps) {
  const { t } = useLanguage();
  const [showCodeModal, setShowCodeModal] = React.useState(false);
  const [selectedProductForCode, setSelectedProductForCode] = React.useState<Product | null>(null);
  const [codeType, setCodeType] = React.useState<'qr' | 'barcode'>('qr');
  const [codeSize, setCodeSize] = React.useState<number>(256);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const downloadCode = () => {
    if (codeType === 'qr') {
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

  return (
    <>
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{t.gridStoreAdmin.dashboard.productManagement}</h3>
          <button
            onClick={onCreateProduct}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t.gridStoreAdmin.dashboard.addProduct}
          </button>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.itemId}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.productName}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.description}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.grid}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.store}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.version}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.table.amount}</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{t.gridStoreAdmin.dashboard.table.actions}</th>
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
                        title={t.gridStoreAdmin.dashboard.qrBarcode}
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditProduct(product)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title={t.gridStoreAdmin.dashboard.edit}>
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
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.itemId}:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.itemId || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.description}:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.store}:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{product.storeName || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t.gridStoreAdmin.dashboard.version}:</span>
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
                    <span>{t.gridStoreAdmin.dashboard.code}</span>
                  </button>
                  <button onClick={() => onEditProduct(product)} className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors flex items-center gap-2 justify-center">
                    <Edit className="w-4 h-4" />
                    <span>{t.gridStoreAdmin.dashboard.edit}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingProduct ? t.gridStoreAdmin.dashboard.editProduct : t.gridStoreAdmin.dashboard.createNewProduct}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.selectGrid} <span className="text-red-500">*</span></label>
                {lesseeGridOptions.length === 0 && (
                  <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      {t.gridStoreAdmin.dashboard.loadingGrids}
                    </p>
                  </div>
                )}
                <select
                  value={productForm.gridId}
                  onChange={(e) => setProductForm({ ...productForm, gridId: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                >
                  <option value="">{t.gridStoreAdmin.dashboard.selectGridPlaceholder}</option>
                  {lesseeGridOptions.length > 0 ? (
                    lesseeGridOptions.map((grid) => (
                      <option key={grid.id} value={grid.id}>
                        {grid.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>{t.gridStoreAdmin.dashboard.noRentedGridsFound}</option>
                  )}
                </select>
                {lesseeGridOptions.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    📌 {t.gridStoreAdmin.dashboard.needRentGridFirst}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.productName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  placeholder={t.gridStoreAdmin.dashboard.productNamePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.descriptionOptional}</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  rows={3}
                  placeholder={t.gridStoreAdmin.dashboard.descriptionPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.price} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-slate-500 dark:text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                    placeholder={t.gridStoreAdmin.dashboard.pricePlaceholder}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                {t.gridStoreAdmin.dashboard.cancel}
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!productForm.gridId || !productForm.name.trim()}
              >
                {editingProduct ? t.gridStoreAdmin.dashboard.updateProduct : t.gridStoreAdmin.dashboard.createNewProduct}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCodeModal && selectedProductForCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.gridStoreAdmin.dashboard.qrBarcode}</h3>
              <button onClick={() => setShowCodeModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              <div className="font-medium">{selectedProductForCode.name}</div>
              <div className="break-all">{t.gridStoreAdmin.dashboard.guid} {selectedProductForCode.guid || selectedProductForCode.id}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.codeType}</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="codeType" checked={codeType==='qr'} onChange={()=>setCodeType('qr')} />
                    <span className="flex items-center gap-1"><QrCode className="w-4 h-4"/> {t.gridStoreAdmin.dashboard.qr}</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="codeType" checked={codeType==='barcode'} onChange={()=>setCodeType('barcode')} />
                    <span className="flex items-center gap-1"><BarcodeIcon className="w-4 h-4"/> {t.gridStoreAdmin.dashboard.barcode}</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.gridStoreAdmin.dashboard.codeSize}</label>
                <input type="range" min={64} max={1024} step={16} value={codeSize} onChange={(e)=>setCodeSize(parseInt(e.target.value))} className="w-full"/>
                <div className="text-xs text-slate-500 mt-1">{codeSize}{t.gridStoreAdmin.dashboard.px}</div>
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
                <div className="text-sm text-slate-600 dark:text-slate-300">{t.gridStoreAdmin.dashboard.noGuidAvailable}</div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={downloadCode}
                disabled={!selectedProductForCode.guid}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4"/>
                {t.gridStoreAdmin.dashboard.download}
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {t.gridStoreAdmin.dashboard.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
