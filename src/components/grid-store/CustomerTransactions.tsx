'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { CheckCircle, AlertCircle, TrendingUp, DollarSign, ShoppingCart, Package, ChevronsLeft, ChevronLeft, ChevronRight, ArrowDownCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { graphqlFetch } from '@/lib/graphql';
import * as d3 from 'd3';

interface GridTransaction {
  orderId: string;
  gridId: string;
  itemId: string;
  itemVersion: number;
  itemName: string;
  trxPrice: number;
  cashierId: string;
  isCollected: boolean;
  created: string;
  grid: {
    id: string;
    name: string;
    storeId: string;
  };
  store: {
    id: string;
    name: string;
  };
  cashier: {
    id: string;
    name: string;
  };
}

interface GridTransactionsResponse {
  gridTransactions: {
    transactions: GridTransaction[];
    total: number;
    limit: number;
    nextAfterId: string | null;
    previousBeforeId: string | null;
  };
}

interface TransactionSummary {
  year: number;
  month: number;
  collectedTotalPrice: number;
  collectedTotalItems: number;
  uncollectedTotalPrice: number;
  uncollectedTotalItems: number;
}

interface GridTransactionSummaryResponse {
  gridTransactionSummary: TransactionSummary[];
  storeTransactionSummary: StoreTransactionSummary[];
}

interface StoreTransactionSummary {
  year: number;
  month: number;
  sentCollectedAmount: number;
  sentUncollectedAmount: number;
  receivedCollectedAmount: number;
  receivedUncollectedAmount: number;
}

interface CustomerTransactionsProps {
  isInitialized?: boolean;
}

export default function CustomerTransactions({ isInitialized = false }: CustomerTransactionsProps) {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<GridTransaction[]>([]);
  const [summaryData, setSummaryData] = useState<TransactionSummary[]>([]);
  const [adminSummaryData, setAdminSummaryData] = useState<StoreTransactionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [nextAfterId, setNextAfterId] = useState<string | null>(null);
  const [previousBeforeId, setPreviousBeforeId] = useState<string | null>(null);
  const [currentAfterId, setCurrentAfterId] = useState<string | null>(null);
  const [currentBeforeId, setCurrentBeforeId] = useState<string | null>(null);
  const [showTransactionsTable, setShowTransactionsTable] = useState(false);
  const hasFetched = useRef(false);

  const fetchTransactions = async (afterId?: string | null, beforeId?: string | null) => {
    try {
      setLoading(true);
      let queryParams = `limit: ${limit}`;
      if (afterId) {
        queryParams += `, nextAfterId: "${afterId}"`;
      }
      if (beforeId) {
        queryParams += `, previousBeforeId: "${beforeId}"`;
      }

      const query = `
        query { 
          gridTransactions(${queryParams}) { 
            transactions {
              orderId 
              gridId 
              itemId 
              itemVersion
              itemName
              trxPrice 
              cashierId 
              isCollected 
              created
              grid {
                id
                name
                storeId
              }
              store {
                id
                name
              }
              cashier {
                id
                name
              }
            }
            total
            limit
            nextAfterId
            previousBeforeId
          } 
        }
      `;

      const result = await graphqlFetch<GridTransactionsResponse>(query);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      if (result.data?.gridTransactions) {
        const { transactions: txns, total: totalCount, limit: pageLimit, nextAfterId: nextId, previousBeforeId: prevId } = result.data.gridTransactions;
        setTransactions(txns);
        setTotal(totalCount);
        setLimit(pageLimit);
        setNextAfterId(nextId);
        setPreviousBeforeId(prevId);
      }
    } catch (error) {
      console.error('Error fetching grid transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized || hasFetched.current) return;
    hasFetched.current = true;
    fetchTransactions();
    fetchTransactionSummaries();
  }, [isInitialized]);

  const fetchTransactionSummaries = async () => {
    try {
      // Calculate the date range for the past 12 months
      const now = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);

      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endYear = now.getFullYear();
      const endMonth = now.getMonth() + 1;

      // Combined query for both grid and store transaction summaries
      const query = `
        query { 
          gridTransactionSummary(startYear: ${startYear}, startMonth: ${startMonth}, endYear: ${endYear}, endMonth: ${endMonth}) {
            year
            month
            collectedTotalPrice
            collectedTotalItems
            uncollectedTotalPrice
            uncollectedTotalItems
          }
          storeTransactionSummary(startYear: ${startYear}, startMonth: ${startMonth}, endYear: ${endYear}, endMonth: ${endMonth}) {
            year
            month
            sentCollectedAmount
            sentUncollectedAmount
            receivedCollectedAmount
            receivedUncollectedAmount
          }
        }
      `;

      const result = await graphqlFetch<GridTransactionSummaryResponse>(query);

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        return;
      }

      if (result.data?.gridTransactionSummary) {
        setSummaryData(result.data.gridTransactionSummary);
      }

      if (result.data?.storeTransactionSummary) {
        setAdminSummaryData(result.data.storeTransactionSummary);
      }
    } catch (error) {
      console.error('Error fetching transaction summaries:', error);
    }
  };

  const handleNextPage = useCallback(() => {
    if (nextAfterId) {
      setCurrentAfterId(nextAfterId);
      setCurrentBeforeId(null);
      fetchTransactions(nextAfterId, null);
    }
  }, [nextAfterId, fetchTransactions]);

  const handlePreviousPage = useCallback(() => {
    if (previousBeforeId) {
      setCurrentBeforeId(previousBeforeId);
      setCurrentAfterId(null);
      fetchTransactions(null, previousBeforeId);
    }
  }, [previousBeforeId, fetchTransactions]);

  const handleFirstPage = useCallback(() => {
    setCurrentAfterId(null);
    setCurrentBeforeId(null);
    fetchTransactions();
  }, [fetchTransactions]);

  const currentPage = currentAfterId || currentBeforeId ? Math.floor(((total - (transactions.length || limit)) / limit)) + 1 : 1;
  const totalPages = Math.ceil(total / limit);
  
  const chartRef = useRef<SVGSVGElement>(null);

  // Calculate statistics from summary data
  const stats = useMemo(() => ({
    totalRevenue: summaryData.reduce((sum, s) => sum + s.collectedTotalPrice, 0),
    collectedCount: summaryData.reduce((sum, s) => sum + s.collectedTotalItems, 0),
    pendingCount: summaryData.reduce((sum, s) => sum + s.uncollectedTotalItems, 0),
    averageValue: summaryData.length > 0 ? summaryData.reduce((sum, s) => sum + s.collectedTotalPrice, 0) / summaryData.filter(s => s.collectedTotalPrice > 0).length : 0,
    totalReceived: adminSummaryData.reduce((sum, s) => sum + s.receivedCollectedAmount + s.receivedUncollectedAmount, 0),
    receivedCollected: adminSummaryData.reduce((sum, s) => sum + s.receivedCollectedAmount, 0),
    receivedUncollected: adminSummaryData.reduce((sum, s) => sum + s.receivedUncollectedAmount, 0)
  }), [summaryData, adminSummaryData]);

  // Draw chart when summary data changes
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    if (summaryData.length === 0) {
      // Show empty state message in chart
      svg.append('text')
        .attr('x', 300)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#64748b')
        .text('No data available');
      return;
    }

    const width = 1200;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Generate last 12 months display labels
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        date: monthKey,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    }

    // Map summary data to chart format
    const summaryMap = new Map(
      summaryData.map(s => [`${s.year}-${String(s.month).padStart(2, '0')}`, s])
    );

    // Map admin summary data to chart format
    const adminSummaryMap = new Map(
      adminSummaryData.map(s => [`${s.year}-${String(s.month).padStart(2, '0')}`, s])
    );

    // Fill in data for all months from summary data
    const data = months.map(month => {
      const summary = summaryMap.get(month.date);
      const adminSummary = adminSummaryMap.get(month.date);
      return {
        date: month.date,
        displayDate: month.displayDate,
        revenue: summary?.collectedTotalPrice || 0,
        expenses: (adminSummary?.sentCollectedAmount || 0) + (adminSummary?.sentUncollectedAmount || 0),
        collected: summary?.collectedTotalItems || 0,
        uncollected: summary?.uncollectedTotalItems || 0
      };
    });

    const g = svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.displayDate))
      .range([0, innerWidth])
      .padding(0.1);

    const maxValue = Math.max(
      d3.max(data, (d: any) => d.revenue) || 0,
      d3.max(data, (d: any) => d.expenses) || 0
    );

    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([innerHeight, 0]);

    // Define gradients with modern styling
    const defs = svg.append('defs');

    // Add blur filter for modern glow effect
    const filter = defs.append('filter')
      .attr('id', 'glow');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    filter.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'coloredBlur');

    filter.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Revenue gradient - subtle multi-color wave effect
    const revenueGradient = defs
      .append('linearGradient')
      .attr('id', 'revenueGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    revenueGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fbbf24')
      .attr('stop-opacity', 0.15);

    revenueGradient.append('stop')
      .attr('offset', '25%')
      .attr('stop-color', '#c084fc')
      .attr('stop-opacity', 0.1);

    revenueGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#60a5fa')
      .attr('stop-opacity', 0.08);

    revenueGradient.append('stop')
      .attr('offset', '75%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.1);

    revenueGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.05);


    revenueGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.3);

    revenueGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.1);

    // Expenses gradient - pink/rose tones
    const expensesGradient = defs
      .append('linearGradient')
      .attr('id', 'expensesGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    expensesGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff6b9d')
      .attr('stop-opacity', 0.12);

    expensesGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#ff6b9d')
      .attr('stop-opacity', 0.06);

    expensesGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff6b9d')
      .attr('stop-opacity', 0.02);

    // Create line functions with smooth curve
    const revenueLine = d3.line<typeof data[0]>()
      .x((d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .y((d: any) => yScale(d.revenue))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Create expenses line function
    const expensesLine = d3.line<typeof data[0]>()
      .x((d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .y((d: any) => yScale(d.expenses))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Create area functions with smooth curve for wave effect
    const revenueArea = d3.area<typeof data[0]>()
      .x((d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d: any) => yScale(d.revenue))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Create expenses area function
    const expensesArea = d3.area<typeof data[0]>()
      .x((d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d: any) => yScale(d.expenses))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Add revenue gradient area with wave effect
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#revenueGradient)')
      .attr('d', revenueArea)
      .style('opacity', 0)
      .transition()
      .duration(1200)
      .style('opacity', 1);

    // Add expenses gradient area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#expensesGradient)')
      .attr('d', expensesArea)
      .style('opacity', 0)
      .transition()
      .duration(1200)
      .style('opacity', 1);

    // Add revenue line
    const revenuePath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0099ff')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.8)
      .attr('d', revenueLine);

    const revenueTotalLength = revenuePath.node()?.getTotalLength() || 0;
    revenuePath
      .attr('stroke-dasharray', revenueTotalLength + ' ' + revenueTotalLength)
      .attr('stroke-dashoffset', revenueTotalLength)
      .transition()
      .duration(1800)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0);

    // Add expenses line (dashed)
    const expensesPath = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b9d')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,5')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0.7)
      .attr('d', expensesLine);

    const expensesTotalLength = expensesPath.node()?.getTotalLength() || 0;
    expensesPath
      .attr('stroke-dasharray', '5,5 ' + expensesTotalLength + ' ' + expensesTotalLength)
      .attr('stroke-dashoffset', expensesTotalLength)
      .transition()
      .duration(1800)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0);

    // Color palette - modern vibrant colors
    const colors = ['#0099ff', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
    const dotColor = colors[0];
    
    // Add prominent revenue dots with glowing effect and colorful gradients
    g.selectAll('.revenue-dot')
      .data(data.filter(d => d.revenue > 0))
      .enter()
      .append('circle')
      .attr('class', 'revenue-dot')
      .attr('cx', (d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .attr('cy', (d: any) => yScale(d.revenue))
      .attr('r', 0)
      .attr('fill', dotColor)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .transition()
      .duration(600)
      .delay(1800)
      .attr('r', 6);

    // Add month labels at bottom for all months - all months same color
    const monthColor = colors[0];

    g.selectAll('.revenue-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'revenue-label')
      .attr('x', (d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', (d: any) => d.revenue > 0 ? monthColor : '#cbd5e1')
      .attr('opacity', 0)
      .text((d: any) => d.displayDate)
      .transition()
      .duration(600)
      .delay(1800)
      .attr('opacity', 1);

    // Add income value labels above dots - matching color with month labels
    g.selectAll('.revenue-value')
      .data(data.filter(d => d.revenue > 0))
      .enter()
      .append('text')
      .attr('class', 'revenue-value')
      .attr('x', (d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: any) => yScale(d.revenue) - 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', monthColor)
      .attr('opacity', 0)
      .text((d: any) => `$${d.revenue}`)
      .transition()
      .duration(600)
      .delay(1800)
      .attr('opacity', 1);

    // Add expenses dots (smaller, different style)
    g.selectAll('.expenses-dot')
      .data(data.filter(d => d.expenses > 0))
      .enter()
      .append('circle')
      .attr('class', 'expenses-dot')
      .attr('cx', (d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .attr('cy', (d: any) => yScale(d.expenses))
      .attr('r', 0)
      .attr('fill', '#ff6b9d')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow)')
      .transition()
      .duration(600)
      .delay(1800)
      .attr('r', 5);

    // Add expenses value labels above expense dots
    g.selectAll('.expenses-value')
      .data(data.filter(d => d.expenses > 0))
      .enter()
      .append('text')
      .attr('class', 'expenses-value')
      .attr('x', (d: any) => (xScale(d.displayDate) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: any) => yScale(d.expenses) - 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ff6b9d')
      .attr('opacity', 0)
      .text((d: any) => `$${d.expenses}`)
      .transition()
      .duration(600)
      .delay(1800)
      .attr('opacity', 1);

  }, [summaryData.length, adminSummaryData.length]);

  return (
    <div className="space-y-8">

      {/* Customer Transaction Summary Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-blue-200 to-cyan-300 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
        <div className="relative overflow-hidden p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t.gridStoreAdmin.dashboard.customerTransactionSummary}</h3>
              <p className="text-xs text-slate-600">{t.gridStoreAdmin.dashboard.customerTransactionSummaryDesc}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.totalRevenue}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ${stats.totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.transactionCount}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stats.collectedCount + stats.pendingCount}
                </p>
              </div>
            </div>

            {/* Collected Items */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-cyan-50 to-green-50 rounded-2xl border border-cyan-100">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.collectedItems}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
                    {stats.collectedCount}
                  </p>
                  <span className="text-xs font-bold text-green-600">
                    {stats.collectedCount + stats.pendingCount > 0 ? Math.round((stats.collectedCount / (stats.collectedCount + stats.pendingCount)) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Items */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.pendingItems}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {stats.pendingCount}
                  </p>
                  <span className="text-xs font-bold text-orange-600">
                    {transactions.length > 0 ? Math.round((stats.pendingCount / transactions.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Receipts Card */}
      <div className="relative group mt-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-300 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
        <div className="relative overflow-hidden p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ArrowDownCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t.gridStoreAdmin.dashboard.adminReceipts}</h3>
              <p className="text-xs text-slate-600">{t.gridStoreAdmin.dashboard.adminReceiptsDesc}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Received */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <ArrowDownCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.totalReceived}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${stats.totalReceived.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Received Collected */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.collectedAmount}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${stats.receivedCollected.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Received Uncollected */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl border border-rose-100">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">{t.gridStoreAdmin.dashboard.uncollectedAmount}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  ${stats.receivedUncollected.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend - Wave Chart */}
      {transactions.length > 0 && (
        <div className="relative mt-12">
          {/* Title */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Revenue Trend</h3>
              <p className="text-sm text-slate-600">12-month performance overview</p>
            </div>
          </div>

          {/* Wave Chart Container */}
          <div className="relative">
            {/* Floating gradient circles */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-orange-300 to-pink-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-300 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* Chart SVG */}
            <div className="relative p-1 min-h-96 flex items-center justify-center">
              <svg ref={chartRef} className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))' }} />
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="mt-8">
        <button
          onClick={() => setShowTransactionsTable(!showTransactionsTable)}
          className="w-full group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-cyan-200 to-green-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition duration-500 animate-pulse pointer-events-none"></div>
          <div className="relative overflow-hidden p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">Customer Transactions</h3>
                  <p className="text-xs text-slate-600">View detailed transaction history ({total} total)</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-slate-600 transition-transform duration-300 ${showTransactionsTable ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {/* Expandable Transactions Table */}
        {showTransactionsTable && (
          <div className="mt-4 overflow-x-auto shadow-lg rounded-3xl border border-slate-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t.gridStoreAdmin.dashboard.table.date}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Grid
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Cashier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t.gridStoreAdmin.dashboard.table.amount}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-600 font-medium">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.orderId} 
                    className="hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-100 text-xs font-mono font-bold text-slate-700">
                        #{transaction.orderId.slice(-6)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {new Date(transaction.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(transaction.created).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-indigo-300 group-hover:to-blue-300 transition-all">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{transaction.itemName}</div>
                          <div className="text-xs text-slate-500">v{transaction.itemVersion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {transaction.grid?.name || `Grid ${transaction.gridId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {transaction.cashier?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${transaction.trxPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          transaction.isCollected
                            ? 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                            : 'bg-orange-100 border border-orange-300 text-orange-700'
                        }`}
                      >
                        {transaction.isCollected ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        {transaction.isCollected ? 'Collected' : 'Pending'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-100 rounded-3xl flex items-center justify-center border border-slate-300">
                        <Package className="w-10 h-10 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-semibold">No transactions yet</p>
                        <p className="text-sm text-slate-600 mt-1">Customer orders will appear here</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {total > limit && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border border-t-0 border-slate-200 bg-gradient-to-r from-slate-50/50 to-slate-100/50 rounded-b-3xl">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-semibold">
                  {transactions.length}
                </span>
                <span className="text-slate-600">of</span>
                <span className="text-slate-900 font-semibold">
                  {total}
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <span className="text-slate-600">transactions</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFirstPage}
                disabled={currentAfterId === null && currentBeforeId === null}
                className="p-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handlePreviousPage}
                disabled={!previousBeforeId}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={!nextAfterId}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
