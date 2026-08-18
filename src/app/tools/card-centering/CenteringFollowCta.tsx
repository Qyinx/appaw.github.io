'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import ThreadsIcon from '@/components/ui/ThreadsIcon';
import { useLanguage } from '@/context/LanguageContext';
import { SOCIAL_HANDLE, SOCIAL_INSTAGRAM_URL, SOCIAL_THREADS_URL } from '@/lib/seo/brand';
import styles from './card-centering.module.css';

const LINK_REL = 'noopener noreferrer';

type CenteringFollowCtaProps = {
  variant: 'strip' | 'panel';
};

function FollowLinks({
  className,
  linkClassName,
}: {
  className: string;
  linkClassName: string;
}) {
  const { t } = useLanguage();
  const f = t.centeringPage.content.follow;

  return (
    <div className={className}>
      <a
        href={SOCIAL_INSTAGRAM_URL}
        className={linkClassName}
        target="_blank"
        rel={LINK_REL}
      >
        <FontAwesomeIcon icon={faInstagram} className={styles.followIcon} aria-hidden="true" />
        <span>{f.instagram}</span>
      </a>
      <a
        href={SOCIAL_THREADS_URL}
        className={linkClassName}
        target="_blank"
        rel={LINK_REL}
      >
        <span aria-hidden="true">
          <ThreadsIcon className={styles.followIcon} />
        </span>
        <span>{f.threads}</span>
      </a>
    </div>
  );
}

export default function CenteringFollowCta({ variant }: CenteringFollowCtaProps) {
  const { t } = useLanguage();
  const f = t.centeringPage.content.follow;

  if (variant === 'strip') {
    return (
      <div className={styles.followStripWrap}>
        <nav className={styles.followStrip} aria-label={f.stripLabel}>
          <div className={styles.followStripIdentity}>
            <span className={styles.followStripBadge}>{f.stripLabel}</span>
            <span className={styles.followStripHandle} translate="no">
              {SOCIAL_HANDLE}
            </span>
          </div>
          <FollowLinks className={styles.followStripLinks} linkClassName={styles.followStripLink} />
        </nav>
      </div>
    );
  }

  return (
    <section
      className={`panel p-0 overflow-hidden border-l-[3px] border-l-accent-secondary ${styles.contentSpecSection}`}
      aria-labelledby="centering-follow"
    >
      <div className={styles.contentSectionHeader}>
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">{f.panelBadge}</span>
        <span className="font-mono text-xs text-accent-secondary uppercase tracking-wider">{f.panelMeta}</span>
      </div>
      <div className={styles.contentSectionBody}>
        <h2 id="centering-follow" className={styles.contentH2}>
          {f.panelTitle}
        </h2>
        <p className={`${styles.contentP} ${styles.followPanelBody}`}>{f.panelBody}</p>
        <FollowLinks className={styles.followPanelLinks} linkClassName={styles.followPanelLink} />
      </div>
    </section>
  );
}
