'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, Info, Loader2, X } from 'lucide-react';

export type WorkspaceNoticeTone = 'success' | 'error' | 'info' | 'loading';

const TONE_STYLES: Record<
  WorkspaceNoticeTone,
  { border: string; icon: React.ReactNode; spec: string; modifier: string }
> = {
  success: {
    border: 'border-l-accent-success',
    icon: <Check className="w-4 h-4 text-accent-success" aria-hidden="true" />,
    spec: 'OK',
    modifier: 'workspace-notice--success',
  },
  error: {
    border: 'border-l-accent-danger',
    icon: <AlertCircle className="w-4 h-4 text-accent-danger" aria-hidden="true" />,
    spec: 'ERR',
    modifier: 'workspace-notice--error',
  },
  info: {
    border: 'border-l-accent-secondary',
    icon: <Info className="w-4 h-4 text-accent-secondary" aria-hidden="true" />,
    spec: 'INFO',
    modifier: 'workspace-notice--info',
  },
  loading: {
    border: 'border-l-accent-secondary',
    icon: <Loader2 className="w-4 h-4 text-accent-secondary animate-spin" aria-hidden="true" />,
    spec: 'SYNC',
    modifier: 'workspace-notice--info',
  },
};

export interface WorkspaceNoticeProps {
  message: string;
  tone?: WorkspaceNoticeTone;
  /** Spec-sheet label — defaults by tone */
  specLabel?: string;
  onDismiss?: () => void;
  /** 0 disables auto-dismiss (e.g. loading) */
  autoDismissMs?: number;
  /** fixed = viewport toast via portal; inline = flow in document */
  placement?: 'fixed' | 'inline';
  /** fixed only — bottom stays visible when scrolled; top sits below site + workspace chrome */
  anchor?: 'top' | 'bottom';
  className?: string;
}

export function WorkspaceNotice({
  message,
  tone = 'success',
  specLabel,
  onDismiss,
  autoDismissMs = 4000,
  placement = 'fixed',
  anchor = 'bottom',
  className = '',
}: WorkspaceNoticeProps) {
  const styles = TONE_STYLES[tone];
  const label = specLabel ?? styles.spec;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!onDismiss || tone === 'loading' || autoDismissMs <= 0) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, autoDismissMs, tone]);

  const hostClass =
    placement === 'fixed'
      ? `workspace-notice-host workspace-notice-host--${anchor}${className ? ` ${className}` : ''}`
      : className;

  const node = (
    <div
      className={hostClass || undefined}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      <div
        className={`workspace-notice panel border-l-4 ${styles.border} ${styles.modifier} overflow-hidden`}
      >
        <div className="flex items-stretch min-h-[3rem]">
          <div className="workspace-notice__spec flex items-center gap-2 px-3 py-2.5 border-r border-border-default">
            {styles.icon}
            <span className="workspace-notice__label">{label}</span>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5">
            <p className="workspace-notice__message flex-1 min-w-0">{message}</p>
            {onDismiss && tone !== 'loading' && (
              <button
                type="button"
                onClick={onDismiss}
                className="btn btn-ghost btn-icon min-w-9 min-h-9 w-9 h-9 flex-shrink-0 -mr-1"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (placement === 'fixed' && mounted) {
    return createPortal(node, document.body);
  }

  if (placement === 'fixed') {
    return null;
  }

  return node;
}
