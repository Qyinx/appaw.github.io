'use client';

import React, { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useSubHeaderContext, type SubHeaderConfig } from '@/context/sub-header-context';
import { stripZhPrefix } from '@/lib/i18n-routing';

function hasSubHeaderContent(config: SubHeaderConfig): boolean {
  return Boolean(config.content ?? config.leading ?? config.center ?? config.trailing);
}

function subHeaderContentWidthClass(width: SubHeaderConfig['contentWidth']): string {
  switch (width) {
    case 'tool':
      return 'container-tool';
    case 'guide':
      return 'container-custom max-w-[1080px]';
    case 'page':
    case undefined:
      return 'container-custom';
    default: {
      const _exhaustive: never = width;
      throw new Error(`Unhandled subheader width: ${_exhaustive}`);
    }
  }
}

function isGuideArticlePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/guides\/[^/]+/.test(stripZhPrefix(pathname));
}

function SubHeaderBody({ config, guideAlign }: { config: SubHeaderConfig; guideAlign: boolean }) {
  if (config.content) {
    const widthClass = subHeaderContentWidthClass(guideAlign ? 'guide' : config.contentWidth);
    return (
      <div className={`${widthClass} site-subheader__content py-2 md:py-2.5`}>
        {config.content}
      </div>
    );
  }

  if (guideAlign) {
    return (
      <div className="container-custom max-w-[1080px] site-subheader__content py-2 md:py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          {config.leading}
          {config.center}
          {config.trailing}
        </div>
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
  const pathname = usePathname();
  const guideAlign = isGuideArticlePath(pathname);
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
      className={`site-subheader workspace-chrome${variantClass}`}
      aria-label="Section navigation"
    >
      <SubHeaderBody config={config} guideAlign={guideAlign} />
    </div>
  );
}
