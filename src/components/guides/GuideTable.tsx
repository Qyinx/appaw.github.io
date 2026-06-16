import React from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import type { GuideTable as GuideTableData } from '@/lib/guides/types';

type GuideTableProps = {
  table: GuideTableData;
};

export default function GuideTable({ table }: GuideTableProps) {
  return (
    <div className="panel overflow-x-auto mt-6" role="region" tabIndex={0} aria-label="Comparison table">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-default">
            {table.headers.map((header, i) => (
              <th
                key={header}
                scope="col"
                className={`px-5 py-3 text-left font-mono text-xs uppercase tracking-wide text-text-muted${
                  i === 0 ? ' w-[28%]' : ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {table.rows.map((row) => {
            const [rowLabel, ...cells] = row;
            return (
              <tr key={rowLabel} className="align-top">
                <th scope="row" className="px-5 py-3 text-left font-medium text-text-primary">
                  {rowLabel}
                </th>
                {cells.map((cell, i) => (
                  <td key={`${rowLabel}-${i}`} className="px-5 py-3 text-text-secondary leading-relaxed">
                    {renderGuideParagraph(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
