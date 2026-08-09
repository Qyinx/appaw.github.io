'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import HeroStamp from '@/components/ui/HeroStamp';
import { useLanguage } from '@/context/LanguageContext';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { CURRENCIES, type Currency } from './types';
import { inp, lbl, MemberBadge, Section, type MemberLevel } from './components/shared';
import { WorkspaceNotice } from './components/WorkspaceNotice';
import { normalizePreferredCurrency } from '@/lib/collection/currency';
import { normalizeUserContact } from '@/lib/collection/userContact';
import { normalizeUserProfile } from '@/lib/collection/userProfile';
import { useCollectionAuth } from './hooks/useCollectionAuth';
import { CollectionLoadingSkeleton } from './components/CollectionLoadingSkeleton';
import { CollectionAnimeEnter } from './components/CollectionAnimeEnter';
import { CollectionChromeDots } from './components/CollectionChromeDots';
import { useSubHeader } from '@/hooks/useSubHeader';

interface ContactForm {
  whatsapp: string;
  facebookMessenger: string;
  instagram: string;
}

export default function CollectionSettingsClient() {
  const router = useRouter();
  const localize = useLocalizedPath();
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: auth0Loading, user } = useAuth0();
  const { apiFetch } = useCollectionAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [memberLevel, setMemberLevel] = useState<MemberLevel | undefined>();

  const [displayName, setDisplayName] = useState('');
  const [mail, setMail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState<Currency>('USD');
  const [contact, setContact] = useState<ContactForm>({
    whatsapp: '',
    facebookMessenger: '',
    instagram: '',
  });

  const loadedRef = useRef(false);

  const syncAuthCache = useCallback((profile: ReturnType<typeof normalizeUserProfile>) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('auth0_user');
      const prev = raw ? JSON.parse(raw) : {};
      localStorage.setItem('auth0_user', JSON.stringify({
        ...prev,
        name: profile.displayName || prev.name,
        mail: profile.mail || prev.mail,
        memberLevel: profile.membership ?? prev.memberLevel,
        preferredCurrency: profile.preferredCurrency,
      }));
    } catch { /* ignore */ }
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRaw, contactRaw] = await Promise.all([
        apiFetch('/users/me'),
        apiFetch('/users/contact'),
      ]);
      const profile = normalizeUserProfile(profileRaw.data ?? profileRaw);
      const contactData = normalizeUserContact(contactRaw.data ?? contactRaw);

      setDisplayName(profile.displayName);
      setMail(profile.mail);
      setPreferredCurrency(profile.preferredCurrency);
      setMemberLevel(profile.membership);
      setContact({
        whatsapp: contactData.whatsapp ?? '',
        facebookMessenger: contactData.facebookMessenger ?? '',
        instagram: contactData.instagram ?? '',
      });
      syncAuthCache(profile);
    } catch (e) {
      setSaveMsg(e instanceof Error ? `Error: ${e.message}` : t.collection.settings.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, syncAuthCache, t.collection.settings.loadFailed]);

  useEffect(() => {
    if (!isAuthenticated || loadedRef.current) return;
    loadedRef.current = true;
    loadSettings();
  }, [isAuthenticated, loadSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const trimmedName = displayName.trim();

      await Promise.all([
        apiFetch('/users/me', {
          method: 'PUT',
          body: JSON.stringify({
            displayName: trimmedName,
            preferredCurrency,
          }),
        }),
        apiFetch('/users/update', {
          method: 'PUT',
          body: JSON.stringify({
            whatsapp: contact.whatsapp.trim() || null,
            facebookMessenger: contact.facebookMessenger.trim() || null,
            instagram: contact.instagram.trim() || null,
          }),
        }),
      ]);

      const profile = normalizeUserProfile({
        DisplayName: trimmedName,
        Mail: mail,
        PreferredCurrency: preferredCurrency,
        Membership: memberLevel,
      });
      syncAuthCache(profile);
      setSaveMsg(t.collection.settings.saved);
    } catch (err) {
      setSaveMsg(err instanceof Error ? `Error: ${err.message}` : t.collection.settings.saveFailed);
    } finally {
      setSaving(false);
      window.setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  useSubHeader({
    width: 'narrow',
    layout: 'form',
    leading: (
      <button
        type="button"
        onClick={() => router.push(localize('/collection/list'))}
        className="collection-action-pill min-h-11 px-2.5 flex-shrink-0"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{t.common.back}</span>
      </button>
    ),
    center: (
      <>
        <CollectionChromeDots />
        <h1 className="text-text-primary font-semibold text-xs sm:text-sm truncate">{t.collection.settings.title}</h1>
        {memberLevel && <MemberBadge level={memberLevel} />}
      </>
    ),
    trailing: (
      <button
        type="submit"
        form="collection-settings-form"
        disabled={saving || loading}
        className="collection-action-pill collection-action-pill--primary min-h-11 px-3 flex-shrink-0 disabled:opacity-45"
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{t.collection.settings.save}</span>
      </button>
    ),
  });

  if (auth0Loading || (!isAuthenticated && typeof window !== 'undefined')) {
    if (!auth0Loading && !isAuthenticated && typeof window !== 'undefined') {
      window.location.replace(localize('/collection/auth'));
    }
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint">
        <div className="workspace-canvas container-tool max-w-3xl py-8">
          <CollectionLoadingSkeleton variant="form" label={t.common.loading} />
        </div>
      </div>
    );
  }

  const emailDisplay = mail || user?.email || '—';

  const selectCls =
    'w-full bg-surface-panel border border-border-default px-3 py-2 min-h-11 text-text-primary text-sm focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-bg transition-[border-color,box-shadow]';

  return (
    <div className="min-h-dvh bg-surface-bg collection-page collection-workspace page-blueprint overflow-x-clip">

      {saveMsg && (
        <WorkspaceNotice
          message={saveMsg}
          tone={saveMsg.toLowerCase().includes('error') || saveMsg.toLowerCase().includes('fail') ? 'error' : 'success'}
          specLabel={saveMsg.toLowerCase().includes('error') || saveMsg.toLowerCase().includes('fail') ? 'ERR' : 'SAVED'}
          anchor="bottom"
          className="workspace-notice-host--above-footer"
        />
      )}

      <div className="workspace-canvas container-tool collection-workspace-canvas--narrow py-6 md:py-8">
        <CollectionAnimeEnter className="mb-6">
          <HeroStamp
            decorative={false}
            lines={{
              brand: t.collection.landing.badge,
              tagline: t.collection.settings.title,
              muted: t.collection.settings.subtitle,
            }}
          />
        </CollectionAnimeEnter>

        {loading ? (
          <CollectionLoadingSkeleton variant="form" label={t.common.loading} />
        ) : (
          <CollectionAnimeEnter delay={48}>
            <form id="collection-settings-form" onSubmit={handleSubmit} className="panel p-5 md:p-6 space-y-8">
            <Section title={t.collection.settings.basicTitle} subtitle={t.collection.settings.basicSubtitle}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="settings-display-name" className={lbl}>{t.collection.settings.displayName}</label>
                  <input
                    id="settings-display-name"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder={t.collection.settings.displayNamePlaceholder}
                    className={inp}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="settings-mail" className={lbl}>{t.collection.settings.email}</label>
                  <input
                    id="settings-mail"
                    type="email"
                    value={emailDisplay}
                    readOnly
                    disabled
                    aria-readonly="true"
                    className={`${inp} opacity-60 cursor-not-allowed`}
                  />
                  <p className="text-text-muted text-xs mt-1.5 leading-snug">{t.collection.settings.emailReadOnlyHint}</p>
                </div>
                <div>
                  <label htmlFor="settings-currency" className={lbl}>{t.collection.settings.preferredCurrency}</label>
                  <select
                    id="settings-currency"
                    value={preferredCurrency}
                    onChange={e => setPreferredCurrency(normalizePreferredCurrency(e.target.value))}
                    className={selectCls}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <p className="text-text-muted text-xs mt-1.5 leading-snug">{t.collection.settings.preferredCurrencyHint}</p>
                </div>
                {memberLevel && (
                  <div>
                    <span className={lbl}>{t.collection.settings.membership}</span>
                    <div className="min-h-11 flex items-center">
                      <MemberBadge level={memberLevel} />
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <Section title={t.collection.settings.contactTitle} subtitle={t.collection.settings.contactSubtitle}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="settings-whatsapp" className={lbl}>{t.collection.settings.whatsapp}</label>
                  <input
                    id="settings-whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={contact.whatsapp}
                    onChange={e => setContact(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder={t.collection.settings.whatsappPlaceholder}
                    className={inp}
                  />
                </div>
                <div>
                  <label htmlFor="settings-facebook" className={lbl}>{t.collection.settings.facebook}</label>
                  <input
                    id="settings-facebook"
                    type="text"
                    autoComplete="off"
                    value={contact.facebookMessenger}
                    onChange={e => setContact(prev => ({ ...prev, facebookMessenger: e.target.value }))}
                    placeholder={t.collection.settings.facebookPlaceholder}
                    className={inp}
                  />
                </div>
                <div>
                  <label htmlFor="settings-instagram" className={lbl}>{t.collection.settings.instagram}</label>
                  <input
                    id="settings-instagram"
                    type="text"
                    autoComplete="off"
                    value={contact.instagram}
                    onChange={e => setContact(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder={t.collection.settings.instagramPlaceholder}
                    className={inp}
                  />
                </div>
              </div>
            </Section>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border-default">
              <button
                type="submit"
                disabled={saving}
                className="collection-action-pill collection-action-pill--primary collection-action-pill--block sm:flex-1 disabled:opacity-45"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                ) : (
                  <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                {t.collection.settings.save}
              </button>
              <button
                type="button"
                onClick={() => router.push(localize('/collection/list'))}
                className="collection-action-pill sm:flex-1"
              >
                {t.common.cancel}
              </button>
            </div>
            </form>
          </CollectionAnimeEnter>
        )}
      </div>
    </div>
  );
}
