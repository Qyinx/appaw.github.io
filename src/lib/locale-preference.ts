export type LocalePreference = 'en' | 'zh';

export const LOCALE_STORAGE_KEY = 'appaw-locale';

/** Map browser languages → site locale. Default English if undetectable. */
export function preferLanguageFromNavigator(): LocalePreference {
  try {
    if (typeof navigator === 'undefined') return 'en';
    const list = [
      ...(navigator.languages ?? []),
      navigator.language,
    ].filter(Boolean);
    for (const tag of list) {
      if (String(tag).toLowerCase().startsWith('zh')) return 'zh';
    }
  } catch {
    // default en
  }
  return 'en';
}

export function readLocalePreference(): LocalePreference | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const value = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (value === 'en' || value === 'zh') return value;
  } catch {
    // ignore
  }
  return null;
}

export function writeLocalePreference(lang: LocalePreference): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LOCALE_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

/** Read stored preference, or detect once and persist (defaults to en). */
export function ensureLocalePreference(): LocalePreference {
  const existing = readLocalePreference();
  if (existing) return existing;
  const detected = preferLanguageFromNavigator();
  writeLocalePreference(detected);
  return detected;
}

/**
 * Inline bootstrap: first visit only — detect, persist, redirect EN→ZH if needed.
 * Preferring en never redirects away from an explicit /zh URL.
 */
export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var K=${JSON.stringify(LOCALE_STORAGE_KEY)};var p=null;try{p=localStorage.getItem(K)}catch(e){}if(p!=='en'&&p!=='zh'){p='en';try{var langs=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language];for(var i=0;i<langs.length;i++){if(langs[i]&&String(langs[i]).toLowerCase().indexOf('zh')===0){p='zh';break}}}catch(e){p='en'}try{localStorage.setItem(K,p)}catch(e){}}else{return}var path=location.pathname||'/';var isZh=path==='/zh'||path==='/zh/'||path.indexOf('/zh/')===0;if(p==='zh'&&!isZh){var clean=path.replace(/\\/$/,'')||'/';var target=clean==='/'?'/zh/':'/zh'+clean+'/';location.replace(target+(location.search||'')+(location.hash||''))}}catch(e){}})();`;
