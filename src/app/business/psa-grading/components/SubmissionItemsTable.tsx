'use client';

import React from 'react';
import type { GradingSubmissionItem } from '@/lib/grading/types';

type TableCopy = {
  title: string;
  description: string;
  certNumber: string;
  grade: string;
  pending: string;
};

type Props = {
  items: GradingSubmissionItem[];
  copy: TableCopy;
  showTitle?: boolean;
};

export default function SubmissionItemsTable({ items, copy, showTitle = true }: Props) {
  return (
    <div>
      {showTitle && (
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">{copy.title}</h3>
      )}

      {/* Desktop table */}
      <div className="hidden md:block border border-border-default overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-raised border-b border-border-default">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium text-text-secondary">
                {copy.description}
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-text-secondary w-36">
                {copy.certNumber}
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-text-secondary w-24">
                {copy.grade}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border-default last:border-0" data-result-row>
                <td className="px-4 py-3 text-text-primary">{item.description}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-text-secondary">
                  {item.certNumber ?? copy.pending}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-text-primary">
                  {item.grade ?? copy.pending}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="md:hidden space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            data-result-row
            className="border border-border-default bg-surface-panel p-4 space-y-2"
          >
            <p className="text-text-primary font-medium">{item.description}</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-text-muted">{copy.certNumber}</dt>
                <dd className="font-mono tabular-nums text-text-secondary">
                  {item.certNumber ?? copy.pending}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">{copy.grade}</dt>
                <dd className="font-mono tabular-nums text-text-primary">
                  {item.grade ?? copy.pending}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
