import React from 'react';

type GuideImageProps = {
  src: string;
  caption?: string;
};

export default function GuideImage({ src, caption }: GuideImageProps) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption ?? ''}
        className="w-full rounded-lg border border-border-default bg-black/20"
        loading="lazy"
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-text-muted text-center leading-relaxed">
          ▲ {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
