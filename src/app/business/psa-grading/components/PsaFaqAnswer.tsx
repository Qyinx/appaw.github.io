'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import type { PsaFaqAnswer as PsaFaqAnswerType } from '@/lib/grading/psa-faq-types';

type Props = {
  answer: PsaFaqAnswerType;
  className?: string;
  isAeo?: boolean;
  withProtectorLink?: boolean;
  protectorLinkLabel?: string;
};

export default function PsaFaqAnswer({
  answer,
  className = '',
  isAeo = false,
  withProtectorLink = false,
  protectorLinkLabel = 'PSA UV-protector case',
}: Props) {
  const aeoClass = isAeo ? ' guide-aeo-answer' : '';

  if (typeof answer === 'string') {
    return (
      <p className={`guide-faq__answer text-text-secondary text-base leading-relaxed${aeoClass}${className ? ` ${className}` : ''}`}>
        {answer}
      </p>
    );
  }

  return (
    <div className={`space-y-3${className ? ` ${className}` : ''}`}>
      {answer.intro ? (
        <p className={`guide-faq__answer text-text-secondary text-base leading-relaxed${aeoClass}`}>{answer.intro}</p>
      ) : null}
      <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary leading-relaxed pl-1">
        {answer.options.map((option, index) => (
          <li key={option} className={index === 0 && !answer.intro && isAeo ? 'guide-aeo-answer' : undefined}>
            {withProtectorLink && index === 0 && option.includes(protectorLinkLabel) ? (
              <>
                {option.split(protectorLinkLabel)[0]}
                <LocalLink href="/products/psa-protectors/" className="text-accent-secondary hover:underline">
                  {protectorLinkLabel}
                </LocalLink>
                {option.split(protectorLinkLabel)[1] ?? ''}
              </>
            ) : withProtectorLink && index === 0 && option.includes('PSA 防 UV 保護殼') ? (
              <>
                {option.split('PSA 防 UV 保護殼')[0]}
                <LocalLink href="/products/psa-protectors/" className="text-accent-secondary hover:underline">
                  PSA 防 UV 保護殼
                </LocalLink>
                {option.split('PSA 防 UV 保護殼')[1] ?? ''}
              </>
            ) : (
              option
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
