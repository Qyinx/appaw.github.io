'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getPsaSyncStatus, runPsaSync } from '@/lib/grading/admin-api';
import type { AdminPsaSyncHealth, AdminPsaSyncStatus } from '@/lib/grading/admin-types';

const STATUS_LABEL: Record<AdminPsaSyncHealth, string> = {
  never: 'Never',
  stale: 'Stale',
  ok: 'OK',
};

function statusBadgeClass(status: AdminPsaSyncHealth): string {
  switch (status) {
    case 'ok':
      return 'border-accent-success/40 bg-accent-success/10 text-accent-success';
    case 'stale':
      return 'border-accent-warn/40 bg-accent-warn/10 text-accent-warn';
    default:
      return 'border-border-default bg-surface-bg text-text-muted';
  }
}

function formatLastSynced(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function PsaSyncPanel() {
  const [status, setStatus] = useState<AdminPsaSyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [runMsg, setRunMsg] = useState('');

  const loadStatus = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      setStatus(await getPsaSyncStatus());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const triggerRun = async () => {
    setError('');
    setRunMsg('');
    setRunning(true);
    try {
      const result = await runPsaSync();
      setStatus({
        configured: result.configured,
        eligibleBatchCount: result.eligibleBatchCount,
        lastSyncedAt: result.lastSyncedAt,
        status: result.status,
      });
      const s = result.summary;
      const parts = [
        `${s.processed} processed`,
        `${s.updated} updated`,
        `${s.skipped} skipped`,
        `${s.errors} errors`,
        `${(s.elapsedMs / 1000).toFixed(1)}s`,
      ];
      if (s.truncated) parts.push('truncated');
      setRunMsg(parts.join(' · '));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="panel p-4" aria-label="PSA sync">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-text-primary">PSA sync</h2>
            {status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border ${statusBadgeClass(status.status)}`}
              >
                {STATUS_LABEL[status.status]}
              </span>
            )}
            {status && !status.configured && (
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border border-accent-danger/40 bg-accent-danger/10 text-accent-danger">
                PSA token missing
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary">
            Last sync:{' '}
            <span className="font-mono tabular-nums text-text-primary">
              {loading && !status ? '…' : formatLastSynced(status?.lastSyncedAt ?? null)}
            </span>
            {status != null && (
              <>
                {' '}
                ·{' '}
                <span className="tabular-nums">
                  {status.eligibleBatchCount} eligible batch
                  {status.eligibleBatchCount === 1 ? '' : 'es'}
                </span>
              </>
            )}
          </p>
          {runMsg && <p className="text-xs text-accent-success font-mono tabular-nums">{runMsg}</p>}
          {error && <p className="text-xs text-accent-danger">{error}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            className="btn btn-secondary min-h-[44px]"
            disabled={loading || running}
            onClick={() => void loadStatus()}
          >
            Refresh status
          </button>
          <button
            type="button"
            className="btn btn-primary min-h-[44px]"
            disabled={running || (status != null && !status.configured)}
            onClick={() => void triggerRun()}
          >
            {running ? 'Syncing…' : 'Run PSA sync now'}
          </button>
        </div>
      </div>
    </section>
  );
}
