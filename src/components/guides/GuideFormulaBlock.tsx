import React from 'react';
import type { GuideFormula } from '@/lib/guides/types';

type GuideFormulaBlockProps = {
  formula: GuideFormula;
};

export default function GuideFormulaBlock({ formula }: GuideFormulaBlockProps) {
  return (
    <aside className="guide-formula" aria-label={formula.result}>
      <div className="guide-formula__rail" aria-hidden="true" />
      <header className="guide-formula__header">
        <span className="guide-formula__eyebrow">{formula.eyebrow ?? 'Decision math'}</span>
        <span className="guide-formula__eyebrow-rule" aria-hidden="true" />
        <span className="guide-formula__kicker">EV</span>
      </header>

      <ol className="guide-formula__ledger">
        {formula.terms.map((term, i) => (
          <li key={`${term.text}-${i}`} className="guide-formula__item">
            {term.op ? (
              <div className="guide-formula__connector" aria-hidden="true">
                <span className="guide-formula__connector-line" />
                <span className="guide-formula__op">{term.op}</span>
                <span className="guide-formula__connector-line" />
              </div>
            ) : null}
            <div className="guide-formula__row">
              <span className="guide-formula__index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="guide-formula__body">
                <span className="guide-formula__term-text">{term.text}</span>
                {term.hint ? <span className="guide-formula__term-hint">{term.hint}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <footer className="guide-formula__footer">
        <span className="guide-formula__op guide-formula__op--eq" aria-hidden="true">
          =
        </span>
        <p className="guide-formula__result">{formula.result}</p>
      </footer>
    </aside>
  );
}
