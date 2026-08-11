'use client';

import React, { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { useSubHeaderContext, type SubHeaderConfig } from '@/context/sub-header-context';

function hasSubHeaderContent(config: SubHeaderConfig): boolean {
  return Boolean(config.content ?? config.leading ?? config.center ?? config.trailing);
}

function SubHeaderBody({ config }: { config: SubHeaderConfig }) {
  if (config.content) {
    const widthClass = config.contentWidth === 'tool' ? 'container-tool' : 'container-custom';
    return (
      <div className={`${widthClass} site-subheader__content py-3 md:py-4`}>
        {config.content}
      </div>
    );
  }

  const width = config.width ?? 'wide';
  const layout = config.layout ?? 'bar';

  const innerClass = [
    'container-tool',
    'collection-workspace-chrome__inner',
    width === 'narrow' ? 'collection-workspace-chrome__inner--narrow' : '',
    layout === 'form' ? 'collection-workspace-chrome__inner--form' : '',
  ].filter(Boolean).join(' ');

  if (layout === 'sidebar') {
    return (
      <div className={innerClass}>
        <div className="collection-workspace-chrome__grid collection-workspace-chrome__grid--with-sidebar">
          <div className="collection-workspace-chrome__sidebar-spacer hidden md:block" aria-hidden="true" />
          <div className="collection-workspace-chrome__main">
            {config.leading ? (
              <div className="collection-workspace-chrome__leading">{config.leading}</div>
            ) : null}
            {config.trailing ? (
              <div className="collection-workspace-chrome__trailing">{config.trailing}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={innerClass}>
      {config.leading ? (
        <div className="collection-workspace-chrome__leading">{config.leading}</div>
      ) : null}
      {config.center ? (
        <div className="collection-workspace-chrome__center">{config.center}</div>
      ) : null}
      {config.trailing ? (
        <div className="collection-workspace-chrome__trailing">{config.trailing}</div>
      ) : null}
    </div>
  );
}

export default function SiteSubHeader() {
  const { getConfig, subscribe, getVersion } = useSubHeaderContext();
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const config = getConfig();
  const rootRef = useRef<HTMLDivElement>(null);

  const visible = config != null && hasSubHeaderContent(config);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!visible) {
      root.style.setProperty('--site-subheader-height', '0px');
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const syncHeight = () => {
      const next = `${el.offsetHeight}px`;
      if (root.style.getPropertyValue('--site-subheader-height') !== next) {
        root.style.setProperty('--site-subheader-height', next);
      }
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      // Unmount / hide only — do not depend on config identity (avoids 0px flicker).
      root.style.setProperty('--site-subheader-height', '0px');
    };
  }, [visible]);

  if (!visible || !config) return null;

  const variantClass = config.variant === 'tool' ? ' site-subheader--tool' : '';

  return (
    <div
      ref={rootRef}
      className={`site-subheader workspace-chrome fixed inset-x-0 top-[var(--site-header-height)] z-40 border-b border-border-default bg-surface-panel shadow-[0_1px_0_var(--border-default)] overflow-visible${variantClass}`}
      aria-label="Section navigation"
    >
      <SubHeaderBody config={config} />
    </div>
  );
}
