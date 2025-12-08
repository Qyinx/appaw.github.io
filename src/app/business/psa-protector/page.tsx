'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function PSAProtectorRedirect() {
  useEffect(() => {
    redirect('/products/psa-protectors');
  }, []);

  return null;
}
