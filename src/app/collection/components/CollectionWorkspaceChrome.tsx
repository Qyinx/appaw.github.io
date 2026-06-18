'use client';

import React from 'react';

type ChromeWidth = 'wide' | 'narrow';
type ChromeLayout = 'bar' | 'form' | 'sidebar';

interface CollectionWorkspaceChromeProps {
  width?: ChromeWidth;
  layout?: ChromeLayout;
  leading?: React.ReactNode;
  center?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function CollectionWorkspaceChrome({
  width = 'wide',
  layout = 'bar',
  leading,
  center,
  trailing,
}: CollectionWorkspaceChromeProps) {
  const innerClass = [
    'container-tool',
    'collection-workspace-chrome__inner',
    width === 'narrow' ? 'collection-workspace-chrome__inner--narrow' : '',
    layout === 'form' ? 'collection-workspace-chrome__inner--form' : '',
  ].filter(Boolean).join(' ');

  const body = layout === 'sidebar' ? (
    <div className="collection-workspace-chrome__grid collection-workspace-chrome__grid--with-sidebar">
      <div className="collection-workspace-chrome__sidebar-spacer hidden md:block" aria-hidden="true" />
      <div className="collection-workspace-chrome__main">
        {leading ? <div className="collection-workspace-chrome__leading">{leading}</div> : null}
        {trailing ? <div className="collection-workspace-chrome__trailing">{trailing}</div> : null}
      </div>
    </div>
  ) : (
    <>
      {leading ? <div className="collection-workspace-chrome__leading">{leading}</div> : null}
      {center ? <div className="collection-workspace-chrome__center">{center}</div> : null}
      {trailing ? <div className="collection-workspace-chrome__trailing">{trailing}</div> : null}
    </>
  );

  return (
    <div className="workspace-chrome sticky top-16 md:top-20 z-30 border-b border-border-default shadow-[0_1px_0_var(--border-default)] overflow-visible">
      <div className={innerClass}>
        {body}
      </div>
    </div>
  );
}

export function CollectionChromeDots() {
  return (
    <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
      <div className="w-2 h-2 bg-accent-primary" />
      <div className="w-2 h-2 bg-border-strong" />
      <div className="w-2 h-2 bg-border-strong" />
    </div>
  );
}
