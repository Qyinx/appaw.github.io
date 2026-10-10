import React from 'react';
import { formatBuybackPrice } from '@/lib/snkr-buyback/data';
import type { SnkrBuybackPrice } from '@/lib/snkr-buyback/types';

type SnkrBuybackChartProps = {
  rows: SnkrBuybackPrice[];
  label: string;
};

const WIDTH = 640;
const HEIGHT = 280;
const PAD = { top: 20, right: 16, bottom: 40, left: 112 };

type PlotPoint = {
  x: number;
  y: number;
  date: string;
  priceLabel: string;
};

function yBounds(prices: number[]): { lo: number; hi: number } {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) {
    const pad = Math.max(Math.round(min * 0.08), 1);
    return { lo: min - pad, hi: max + pad };
  }
  const pad = (max - min) * 0.12;
  return { lo: min - pad, hi: max + pad };
}

function buildPoints(rows: SnkrBuybackPrice[]): { points: PlotPoint[]; dates: string[] } {
  const dates = [...new Set(rows.map((row) => row.date))];
  const prices = rows.map((row) => row.buyback_price);
  const { lo, hi } = yBounds(prices);
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const yFor = (price: number) => PAD.top + ((hi - price) / (hi - lo)) * innerH;
  const groups = dates.map((date) => rows.filter((row) => row.date === date));

  const points = groups.flatMap((group, dateIndex) => {
    const slot = dates.length === 1 ? 0 : innerW / (dates.length - 1);
    const baseX = dates.length === 1 ? PAD.left + innerW / 2 : PAD.left + dateIndex * slot;
    const spread = group.length === 1 ? 0 : Math.min(slot * 0.55, 36);
    return group.map((row, index) => {
      const offset =
        group.length === 1 ? 0 : ((index - (group.length - 1) / 2) * spread) / (group.length - 1);
      return {
        x: baseX + offset,
        y: yFor(row.buyback_price),
        date: row.date,
        priceLabel: formatBuybackPrice(row.buyback_price, row.currency),
      };
    });
  });

  return { points, dates };
}

export default function SnkrBuybackChart({ rows, label }: SnkrBuybackChartProps) {
  if (rows.length === 0) return null;

  const { points, dates } = buildPoints(rows);
  const prices = rows.map((row) => row.buyback_price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const { lo, hi } = yBounds(prices);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const yFor = (price: number) => PAD.top + ((hi - price) / (hi - lo)) * innerH;
  const currency = rows[0]?.currency ?? 'JPY';
  const ticks = min === max ? [min] : [max, min];
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="overflow-x-auto" role="region" tabIndex={0} aria-label={label}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto min-w-[40rem] w-full"
        role="img"
        aria-label={label}
      >
        <title>{label}</title>
        {ticks.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--border-default)"
              />
              <text
                x={PAD.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-secondary)"
                fontSize="14"
                fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
              >
                {formatBuybackPrice(tick, currency)}
              </text>
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          points={line}
        />
        {points.map((point, index) => (
          <g key={`${point.date}-${point.priceLabel}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--surface-panel)"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
            <title>{`${point.date} ${point.priceLabel}`}</title>
          </g>
        ))}
        {dates.map((date, index) => {
          const slot = dates.length === 1 ? 0 : (WIDTH - PAD.left - PAD.right) / (dates.length - 1);
          const x = dates.length === 1 ? PAD.left + (WIDTH - PAD.left - PAD.right) / 2 : PAD.left + index * slot;
          return (
            <text
              key={date}
              x={x}
              y={HEIGHT - 12}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="14"
              fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
            >
              {date.slice(5)}
              <title>{date}</title>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
