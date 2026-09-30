'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const TRUSTPILOT_BOOTSTRAP =
  'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

let inviteRegistered = false;

/**
 * Loads Trustpilot bootstrap + invite only on pages that render a TrustBox.
 * Kept out of root layout so homepage LCP is not competing with third-party JS.
 */
export default function TrustpilotScripts() {
  useEffect(() => {
    if (inviteRegistered) return;
    inviteRegistered = true;

    const w = window as Window & {
      TrustpilotObject?: string;
      tp?: ((...args: unknown[]) => void) & { q?: unknown[] };
    };

    const n = 'tp';
    w.TrustpilotObject = n;
    w.tp =
      w.tp ||
      function (...args: unknown[]) {
        (w.tp!.q = w.tp!.q || []).push(args);
      };
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://invitejs.trustpilot.com/tp.min.js';
    document.head.appendChild(s);
    w.tp('register', 'KfnAawX7R5VW7x8N');
  }, []);

  return (
    <Script src={TRUSTPILOT_BOOTSTRAP} strategy="lazyOnload" id="trustpilot-bootstrap" />
  );
}
