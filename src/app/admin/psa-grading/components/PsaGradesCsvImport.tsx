'use client';

import React, { useRef, useState } from 'react';
import {
  applyBatchGrades,
  importBatchImages,
  listItemsForBatch,
  proxyPsaZip,
} from '@/lib/grading/admin-api';
import type { AdminBatch, AdminItem } from '@/lib/grading/admin-types';
import {
  matchPsaGradesToBatch,
  parsePsaGradesCsv,
  type PsaGradeMatchResult,
} from '@/lib/grading/psa-grades-csv';
import {
  fetchZipBytesWithFallback,
  zipBytesToBase64Images,
} from '@/lib/grading/psa-zip-client';

/** Parallel ZIP → compress → upload workers (keeps Worker + CPU stable). */
const IMAGE_IMPORT_CONCURRENCY = 4;

type Props = {
  referenceCode: string;
  items: AdminItem[];
  onApplied: (batch: AdminBatch, items: AdminItem[]) => void;
};

type ImportProgress = {
  label: string;
  current: number;
  total: number;
};

type ZipImportEntry = { id: string; zipUrl: string };

export default function PsaGradesCsvImport({ referenceCode, items, onApplied }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PsaGradeMatchResult | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);

  const onFile = async (file: File | null) => {
    setError('');
    setMessage('');
    setPreview(null);
    setProgress(null);
    if (!file) return;
    try {
      const text = await file.text();
      const csvRows = parsePsaGradesCsv(text);
      if (!csvRows.length) throw new Error('No data rows in CSV.');
      setPreview(matchPsaGradesToBatch(csvRows, items));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const apply = async () => {
    if (!preview) return;
    if (preview.countMismatch) {
      setError(
        `Row count mismatch: CSV has ${preview.csvCount} cards, batch has ${preview.batchCount}. Fix before apply.`,
      );
      return;
    }
    if (preview.mismatchCount > 0) {
      const ok = window.confirm(
        `${preview.mismatchCount} card name(s) differ from PSA Description. Apply cert/grade/images anyway?`,
      );
      if (!ok) return;
    }

    const hasExistingGrades = items.some((item) => item.certNumber || item.grade);
    const hasExistingImages = items.some((item) => (item.images?.length ?? 0) > 0);
    if (hasExistingGrades || hasExistingImages) {
      const parts = [
        hasExistingGrades ? 'cert/grade' : null,
        hasExistingImages ? 'images' : null,
      ].filter(Boolean);
      const ok = window.confirm(
        `This batch already has ${parts.join(' and ')}. Re-import will overwrite previous PSA CSV data. Continue?`,
      );
      if (!ok) return;
    }

    const zipItems = preview.rows
      .filter((row) => row.zipUrl)
      .map((row) => ({ id: row.itemId, zipUrl: row.zipUrl }));

    // 1 step for grades + 1 per image card
    const totalSteps = 1 + zipItems.length;

    setBusy(true);
    setError('');
    setMessage('');
    setProgress({ label: 'Saving cert & grade…', current: 0, total: totalSteps });
    try {
      const summary = await applyBatchGrades(referenceCode, {
        items: preview.rows.map((row) => ({
          id: row.itemId,
          certNumber: row.certNumber || null,
          grade: row.grade || null,
        })),
      });
      setProgress({ label: 'Cert & grade saved', current: 1, total: totalSteps });

      let failedCount = 0;
      let importedCount = 0;
      let completed = 0;
      let nextIndex = 0;

      const importOne = async (entry: ZipImportEntry) => {
        try {
          const zipBytes = await fetchZipBytesWithFallback(entry.zipUrl, (url) =>
            proxyPsaZip(referenceCode, url),
          );
          const images = await zipBytesToBase64Images(zipBytes);
          const result = await importBatchImages(referenceCode, {
            id: entry.id,
            images,
            force: true,
          });
          failedCount += result.failed.length;
          importedCount += result.processed.filter((p) => !p.skipped).length;
        } catch (e) {
          failedCount += 1;
          console.warn('PSA image import failed', entry.id, e);
        } finally {
          completed += 1;
          setProgress({
            label: `Importing images ${completed}/${zipItems.length}…`,
            current: 1 + completed,
            total: totalSteps,
          });
        }
      };

      const workerCount = Math.min(IMAGE_IMPORT_CONCURRENCY, zipItems.length);
      if (workerCount > 0) {
        setProgress({
          label: `Importing images 0/${zipItems.length}…`,
          current: 1,
          total: totalSteps,
        });
        await Promise.all(
          Array.from({ length: workerCount }, async () => {
            while (true) {
              const i = nextIndex++;
              if (i >= zipItems.length) break;
              await importOne(zipItems[i]);
            }
          }),
        );
      }

      const refreshedItems = await listItemsForBatch(referenceCode, true);
      onApplied(summary.batch, refreshedItems);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      setMessage(
        failedCount
          ? `Grades saved. ${failedCount} image import(s) failed — re-upload CSV to retry images.`
          : `Grades saved${
              zipItems.length
                ? ` and ${importedCount} image set(s) imported (previous images overwritten where present)`
                : ''
            }.`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        e instanceof TypeError
          ? 'Cannot reach grading backend. Check network / CORS.'
          : msg,
      );
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.current / progress.total) * 100))
      : 0;

  return (
    <div className="border border-border-default bg-surface-raised p-4 space-y-3">
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div>
          <h4 className="text-sm font-semibold text-text-primary">PSA results CSV</h4>
          <p className="text-xs text-text-muted mt-0.5">
            Upload PSA order export (Cert #, Description, Grade, Images). Matched by batch order.
            Re-import overwrites previous cert, grade, and images.
            Sample: <code className="font-mono">/fixtures/psa-order-26445821.csv</code>
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          disabled={busy}
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          className="text-sm text-text-secondary file:mr-2 file:border file:border-border-default file:bg-surface-bg file:px-2 file:py-1"
        />
      </div>

      {error && <p className="text-sm text-accent-danger">{error}</p>}
      {message && <p className="text-sm text-accent-success">{message}</p>}

      {progress && (
        <div className="space-y-1.5" aria-live="polite">
          <div className="flex justify-between gap-2 text-xs text-text-muted">
            <span>{progress.label}</span>
            <span className="font-mono tabular-nums">
              {progress.current}/{progress.total} ({percent}%)
            </span>
          </div>
          <div
            className="h-2 w-full border border-border-default bg-surface-bg overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="PSA CSV import progress"
          >
            <div
              className="h-full bg-accent-success transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-text-secondary">
              CSV {preview.csvCount} · Batch {preview.batchCount}
            </span>
            {preview.countMismatch && (
              <span className="text-accent-danger font-medium">Count mismatch — apply blocked</span>
            )}
            {!preview.countMismatch && preview.mismatchCount > 0 && (
              <span className="text-accent-warn font-medium">
                {preview.mismatchCount} name mismatch(es) highlighted
              </span>
            )}
            {!preview.countMismatch && preview.mismatchCount === 0 && (
              <span className="text-accent-success">All names match</span>
            )}
          </div>

          <div className="border border-border-default overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs min-w-[720px]">
              <thead className="sticky top-0 bg-surface-raised">
                <tr className="text-left border-b border-border-default">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Our card</th>
                  <th className="py-2 px-2">PSA description</th>
                  <th className="py-2 px-2">Cert</th>
                  <th className="py-2 px-2">Grade</th>
                  <th className="py-2 px-2">Match</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => (
                  <tr
                    key={row.itemId}
                    className={
                      row.nameMatch
                        ? 'border-b border-border-default/60'
                        : 'border-b border-border-default/60 bg-accent-warn/15'
                    }
                  >
                    <td className="py-1.5 px-2 font-mono tabular-nums">{row.batchOrder}</td>
                    <td className="py-1.5 px-2">{row.ourCardName}</td>
                    <td className="py-1.5 px-2">{row.psaDescription}</td>
                    <td className="py-1.5 px-2 font-mono">{row.certNumber}</td>
                    <td className="py-1.5 px-2 font-mono">{row.grade}</td>
                    <td className="py-1.5 px-2">
                      {row.nameMatch ? (
                        <span className="text-accent-success">OK</span>
                      ) : (
                        <span className="text-accent-warn font-medium">Mismatch</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="btn btn-primary text-sm"
            disabled={busy || preview.countMismatch}
            onClick={() => void apply()}
          >
            {busy ? 'Applying…' : 'Apply cert, grade & import images'}
          </button>
        </div>
      )}
    </div>
  );
}
