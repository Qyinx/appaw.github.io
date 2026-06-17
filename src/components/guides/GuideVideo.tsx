import React from 'react';

type GuideVideoProps = {
  src: string;
  caption?: string;
};

export default function GuideVideo({ src, caption }: GuideVideoProps) {
  return (
    <figure className="my-6">
      <video
        src={src}
        className="w-full rounded-lg border border-border-default bg-black/40"
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="metadata"
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-text-muted text-center leading-relaxed">
          ▲ {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
