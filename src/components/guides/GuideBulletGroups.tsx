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
    <ul className="space-y-4 my-4">
      {groups.map((group) => (
        <li key={group.label || group.items[0]?.label}>
          {group.label ? <p className="text-text-primary font-medium mb-2">{group.label}</p> : null}
          <ul className="space-y-6 pl-4 border-l border-border-default">
            {group.items.map((item) => (
              <li key={item.label} className="text-text-secondary text-base leading-relaxed">
                <span className="text-text-primary font-medium">{item.label}</span>{' '}
                {renderGuideParagraph(item.text)}
                {item.images?.map((image, i) => (
                  <GuideImage key={`${image.src}-${i}`} src={image.src} caption={image.caption} />
                ))}
                {item.videos?.map((video, i) => (
                  <GuideVideo key={`${video.src}-${i}`} src={video.src} caption={video.caption} />
                ))}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
