import React from 'react';
import { renderGuideParagraph } from '@/lib/guides/parseParagraphLinks';
import GuideImage from './GuideImage';
import GuideVideo from './GuideVideo';
import type { GuideBulletGroup } from '@/lib/guides/types';

type GuideBulletGroupsProps = {
  groups: GuideBulletGroup[];
};

export default function GuideBulletGroups({ groups }: GuideBulletGroupsProps) {
  return (
    <div className="space-y-6 my-6">
      {groups.map((group) => (
        <aside
          key={group.label || group.items[0]?.label}
          className="panel overflow-hidden"
          aria-label={group.label ?? undefined}
        >
          {group.label ? <p className="section-label px-5 pt-5 mb-0">{group.label}</p> : null}
          <ul className="divide-y divide-border-default">
            {group.items.map((item) => (
              <li key={item.label} className="px-5 py-4">
                <p className="text-xs font-mono leading-snug text-text-primary mb-1.5">{item.label}</p>
                <div className="text-sm text-text-secondary leading-relaxed">
                  {renderGuideParagraph(item.text)}
                </div>
                {item.images?.map((image, i) => (
                  <GuideImage key={`${image.src}-${i}`} src={image.src} caption={image.caption} />
                ))}
                {item.videos?.map((video, i) => (
                  <GuideVideo key={`${video.src}-${i}`} src={video.src} caption={video.caption} />
                ))}
              </li>
            ))}
          </ul>
        </aside>
      ))}
    </div>
  );
}
