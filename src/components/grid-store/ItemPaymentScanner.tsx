'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Scan, CheckCircle2, XCircle, Camera, Clock, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui';
import { graphqlFetch } from '@/lib/graphql';

interface ItemPaymentScannerProps {
  cashierId: string;
  cashierName: string;
}

interface ScannedItem {
  itemId: string;
  guid: string;
  name: string;
  gridId: string;
  price: number;
  userId: string;
  isActive: boolean;
  created: string;
  notes?: string;
  timestamp: string;
  quantity: number;
  cartItemId: string;
}

interface ProcessedItem extends ScannedItem {
  processedAt: string;
  status: 'completed';
}

interface ItemByGuidResponse {
  itemByGuid: {
    itemId: string;
    gridId: string;
    userId: string;
    version: number;
    name: string;
    price: number;
    isActive: boolean;
    created: string;
    notes?: string;
    guid: string;
  };
}

interface CreateGridTransactionResponse {
  createGridTransaction: {
    orderId: string;
    gridId: string;
    itemId: string;
    itemVersion: string;
    itemName: string;
    trxPrice: number;
    cashierId: string;
    isCollected: boolean;
    created: string;
  };
}

export default function ItemPaymentScanner({ cashierId, cashierName }: ItemPaymentScannerProps) {
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cartItems, setCartItems] = useState<ScannedItem[]>([]);
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  const handleScan = async (scannedText?: string | React.MouseEvent | React.KeyboardEvent) => {
    const guidToScan = typeof scannedText === 'string'
      ? scannedText.trim()
      : qrCodeInput.trim();

    if (!guidToScan) {
      setError('Please enter a QR code');
      return;
    }

    setScanning(true);
    setError(null);
    setSuccess(false);

    try {
      const query = `
        query($guid: String!) {
          itemByGuid(guid: $guid) {
            itemId
            gridId
            userId
            version
            name
            price
            isActive
            created
            notes
            guid
          }
        }
      `;

      const response = await graphqlFetch<ItemByGuidResponse>(query, {
        guid: guidToScan,
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to fetch item');
      }

      if (!response.data?.itemByGuid) {
        throw new Error('Item not found');
      }

      const item = response.data.itemByGuid;

      if (!item.isActive) {
        throw new Error('This item is not active');
      }

      setCartItems((prev) => {
        const existing = prev.find((ci) => ci.guid === item.guid);
        if (existing) {
          return prev.map((ci) =>
            ci.guid === item.guid ? { ...ci, quantity: ci.quantity + 1 } : ci
          );
        }

        const scannedItem: ScannedItem = {
          itemId: item.itemId,
          guid: item.guid,
          name: item.name,
          gridId: item.gridId,
          price: item.price,
          userId: item.userId,
          isActive: item.isActive,
          created: item.created,
          notes: item.notes,
          timestamp: new Date().toISOString(),
          quantity: 1,
          cartItemId: `${item.guid}-${Date.now()}-${Math.random()}`,
        };

        return [...prev, scannedItem];
      });

      setQrCodeInput('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan item');
    } finally {
      setScanning(false);
    }
  };

  const handleProcessPayment = async () => {
    if (cartItems.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      const mutation = `
        mutation CreateGridTransaction($items: [GridTransactionItemInput!]!, $isCollected: Boolean) {
          createGridTransaction(items: $items, isCollected: $isCollected) {
            orderId
            gridId
            itemId
            itemVersion
            itemName
            trxPrice
            cashierId
            isCollected
            created
          }
        }
      `;

      const variables = {
        items: cartItems.map((item) => ({ guid: item.guid, qty: item.quantity })),
        isCollected: true,
      };

      const response = await graphqlFetch<CreateGridTransactionResponse>(mutation, variables);

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'Failed to process payment');
      }

      if (!response.data?.createGridTransaction) {
        throw new Error('Payment did not complete');
      }

      const processedAt = response.data.createGridTransaction.created || new Date().toISOString();

      const processedBatch: ProcessedItem[] = cartItems.map((item) => ({
        ...item,
        processedAt,
        status: 'completed',
      }));

      setProcessedItems(processedBatch);
      setCartItems([]);
      setQrCodeInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenScanner = async () => {
    setShowScanner(true);
    setError(null);
    setCameraError(null);

    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        const boxSize = Math.max(180, Math.min(260, window.innerWidth - 120));
        const config = {
          fps: 10,
          qrbox: { width: boxSize, height: boxSize },
          aspectRatio: 1.0,
        };

        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (!isScanning.current) {
              isScanning.current = true;
              setQrCodeInput(decodedText);
              handleCloseScanner();
              setTimeout(() => handleScan(decodedText), 80);
            }
          },
          () => {}
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start camera';
        setCameraError(errorMsg);
        console.error('Camera error:', err);
      }
    }, 80);
  };

  const handleCloseScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    scannerRef.current = null;
    isScanning.current = false;
    setShowScanner(false);
    setCameraError(null);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setQrCodeInput('');
    setError(null);
    setSuccess(false);
  };

  const handleIncrementQuantity = (guid: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.guid === guid ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrementQuantity = (guid: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.guid === guid ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (guid: string) => {
    setCartItems((prev) => prev.filter((item) => item.guid !== guid));
  };

  const handleDeleteProcessedItem = (guid: string) => {
    setProcessedItems((prev) => prev.filter((item) => item.guid !== guid));
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Item Payment</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Scan or enter an item to add it to the cart.</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Cashier: <span className="font-semibold text-slate-800 dark:text-slate-200">{cashierName}</span></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">QR / GUID</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter or scan item GUID"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={scanning || processing}
                />
                <div className="flex w-full sm:w-auto gap-2">
                  <button
                    onClick={handleOpenScanner}
                    disabled={scanning || processing}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                    title="Open Camera Scanner"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Camera className="w-5 h-5" />
                      <span className="hidden md:inline">Camera</span>
                    </div>
                  </button>
                  <button
                    onClick={handleScan}
                    disabled={scanning || processing || !qrCodeInput.trim()}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Scan className="w-5 h-5" />
                    {scanning ? 'Scanning…' : 'Add'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                <XCircle className="w-5 h-5 mt-0.5" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                <CheckCircle2 className="w-5 h-5 mt-0.5" />
                <div className="text-sm">Added to cart</div>
              </div>
            )}

            <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/40">
              Tip: Use camera for quicker entry. Items with the same GUID are grouped; scan again to increase quantity.
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                <ShoppingCart className="w-5 h-5 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cart</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button
              onClick={handleClearCart}
              disabled={processing || cartItems.length === 0}
              className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 dark:text-slate-400">
              <ShoppingCart className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">No items yet. Scan or enter an item to begin.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.guid}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.gridId}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 break-all">GUID: {item.guid}</div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">${item.price.toFixed(2)} each</div>
                        {item.notes && (
                          <div className="text-xs text-slate-500 dark:text-slate-500 truncate">{item.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.guid)}
                        disabled={processing}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 bg-slate-50 dark:bg-slate-800/60">
                        <button
                          onClick={() => handleDecrementQuantity(item.guid)}
                          disabled={processing}
                          className="p-1 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="min-w-[32px] text-center text-sm font-semibold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrementQuantity(item.guid)}
                          disabled={processing}
                          className="p-1 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="ml-auto text-sm font-semibold text-slate-900 dark:text-white">
                        ${ (item.price * item.quantity).toFixed(2) }
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={processing || cartItems.length === 0}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Pay ${cartTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </Card>
      </div>

      {processedItems.length > 0 && (
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Processed ({processedItems.length})</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400">Today</div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {processedItems.map((item) => (
              <div
                key={`${item.guid}-${item.processedAt}`}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Grid:</span>{' '}
                        <span className="text-slate-900 dark:text-white font-medium">{item.gridId}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">User:</span>{' '}
                        <span className="text-slate-900 dark:text-white font-medium">{item.userId}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Qty:</span>{' '}
                        <span className="text-slate-900 dark:text-white font-medium">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Line Total:</span>{' '}
                        <span className="text-green-600 dark:text-green-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{formatDateTime(item.processedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProcessedItem(item.guid)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-300">Total processed</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              ${processedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </span>
          </div>
        </Card>
      )}

      {showScanner && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm sm:max-w-lg">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan QR Code</h3>
                <button
                  onClick={handleCloseScanner}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Close Scanner"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <div id="qr-reader" className="w-full h-64 sm:h-72"></div>
              </div>
              {cameraError && (
                <div className="mt-4 flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold mb-1">Camera Access Error</p>
                    <p>{cameraError}</p>
                    <p className="mt-2 text-xs">Please ensure camera permissions are granted and no other app is using the camera.</p>
                  </div>
                </div>
              )}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Position the QR code within the frame. The scanner will automatically detect and process it.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
