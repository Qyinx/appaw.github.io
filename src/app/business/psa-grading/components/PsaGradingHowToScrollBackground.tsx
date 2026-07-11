'use client';

import React from 'react';
import { PSA_HOW_TO_SCENES } from '@/lib/grading/how-to-scenes';

export default function PsaGradingHowToScrollBackground() {
  return (
    <div className="how-to-scroll-bg" data-how-to-bg aria-hidden="true">
          {PSA_HOW_TO_SCENES.map((scene, index) => (
        <div
          key={scene.id}
          className="how-to-scroll-bg__layer"
          data-how-to-scene={index}
          style={{ opacity: index === 0 ? 1 : 0 }}
        >
          <img
            src={scene.src}
            alt=""
            className="how-to-scroll-bg__img"
            data-how-to-scene-img={index}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}
