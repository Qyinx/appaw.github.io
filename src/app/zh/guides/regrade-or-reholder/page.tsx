import { redirect } from 'next/navigation';

/** Obsolete slug — 302 to PSA Reholder guide (static export + dev via redirect()). */
export default function ZhLegacyRegradeOrReholderRedirect() {
  redirect('/zh/guides/psa-reholder-guide/');
}
