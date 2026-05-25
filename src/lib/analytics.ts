export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    try {
      gtag('event', name, params || {});
    } catch (e) {
      // swallow errors — analytics should not break the UI
      // console.debug('gtag error', e);
    }
  }
}

export default trackEvent;
