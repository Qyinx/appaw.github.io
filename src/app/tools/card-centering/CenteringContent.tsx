import React from 'react';
import Link from 'next/link';
import styles from './card-centering.module.css';

const GRADE_ROWS = [
  { grade: 'PSA 10 (Gem Mint)', front: '55/45', back: '75/25' },
  { grade: 'PSA 9 (Mint)', front: '60/40', back: '90/10' },
  { grade: 'PSA 8 (NM–MT)', front: '65/35', back: '90/10' },
  { grade: 'BGS 10 (Pristine)', front: '50/50', back: '55/45' },
  { grade: 'BGS 9.5 (Gem Mint)', front: '55/45', back: '60/40' },
  { grade: 'SGC 10 (Gem Mint)', front: '55/45', back: '70/30' },
];

const STEPS = [
  {
    n: 1,
    title: 'Upload a clear photo',
    body: 'Place the card flat on a dark, non-reflective background and shoot straight from above with even lighting. A flatbed scan gives the most accurate result. Then upload the image, or use “Choose image”.',
  },
  {
    n: 2,
    title: 'Align the outer guides to the card edge',
    body: 'Drag the blue guide lines until they sit exactly on the outer cut edge of the card on all four sides. The corner loupes help you place them precisely.',
  },
  {
    n: 3,
    title: 'Align the inner guides to the art border',
    body: 'Drag the pink guide lines onto the inner edge of the printed border or artwork frame. Centering is the relationship between these two rectangles.',
  },
  {
    n: 4,
    title: 'Read your centering percentage',
    body: 'The analyzer instantly calculates left/right and top/bottom margin ratios and shows the estimated PSA grade zone — Gem Mint, Mint, NM–MT, or below.',
  },
];

const FAQS = [
  {
    q: 'What centering is required for a PSA 10?',
    a: 'PSA requires roughly 55/45 centering or better on the front and 75/25 or better on the back for a PSA 10 Gem Mint grade. A PSA 9 allows up to 60/40 on the front, and a PSA 8 up to 65/35.',
  },
  {
    q: 'How accurate is the Appaw centering analyzer?',
    a: 'Accuracy depends on your photo. A straight-on, distortion-free scan with the guides aligned precisely to the card edge and art border gives results within a percent or two of a grader’s measurement. Angled phone photos reduce accuracy.',
  },
  {
    q: 'How do I take the best photo for measuring centering?',
    a: 'Place the card flat on a dark background, shoot directly from above with even lighting, and keep the camera parallel to the card to avoid keystone distortion. A flatbed scan is ideal.',
  },
  {
    q: 'Does this tool work for Pokémon, sports, and other TCG cards?',
    a: 'Yes. The analyzer works for any rectangular trading card — Pokémon, Magic: The Gathering, One Piece, sports cards and more — because it measures the printed border relative to the card edge.',
  },
  {
    q: 'Is the card centering calculator free?',
    a: 'Yes, it is completely free to use in your browser. No sign-up is required and measurement happens on your device, so your card photos are never uploaded to a server.',
  },
];

export default function CenteringContent() {
  return (
    <article className={styles.contentWrapper}>
      <header className={styles.contentHeader}>
        <h1 className={styles.contentH1}>Free Card Centering Calculator &amp; PSA 10 Analyzer</h1>
        <p className={styles.contentLead}>
          Measure the centering of any Pokémon, sports, or TCG card in seconds. Upload a photo,
          align the alignment lines to the card edge and art border, and get instant front and back
          margin percentages benchmarked against PSA, BGS, and SGC standards — completely free.
        </p>
      </header>

      <section className={styles.contentSection} aria-labelledby="how-to-use">
        <h2 id="how-to-use" className={styles.contentH2}>How to use the Appaw Centering Analyzer</h2>
        <ol className={styles.stepList}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.stepItem}>
              <span className={styles.stepNum}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.contentSection} aria-labelledby="psa-requirements">
        <h2 id="psa-requirements" className={styles.contentH2}>What are the centering requirements for a PSA 10?</h2>
        <p className={styles.contentP}>
          “Centering” describes how evenly the printed border sits inside the card’s cut edges. It is
          measured as a left/right and top/bottom ratio. The closer to 50/50, the better. Each grading
          company publishes its own maximum tolerances — and PSA tightened its front standard to roughly
          55/45 for a Gem Mint 10. The table below summarises the published front and back tolerances for
          the most common grades.
        </p>
        <div className={styles.tableScroll}>
          <table className={styles.gradeTable}>
            <thead>
              <tr>
                <th scope="col">Grade</th>
                <th scope="col">Max front centering</th>
                <th scope="col">Max back centering</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_ROWS.map((r) => (
                <tr key={r.grade}>
                  <th scope="row">{r.grade}</th>
                  <td>{r.front}</td>
                  <td>{r.back}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.contentNote}>
          Tolerances are guidelines published by PSA, Beckett (BGS), and SGC and may change over time.
          Final grades also factor in corners, edges, and surface — centering alone does not guarantee a grade.
        </p>
      </section>

      <section className={styles.contentSection} aria-labelledby="why-it-matters">
        <h2 id="why-it-matters" className={styles.contentH2}>Why card centering matters</h2>
        <p className={styles.contentP}>
          Centering is one of the four pillars graders assess, and it is the one you can check before you
          spend money on submission. A card with razor-sharp corners and a flawless surface can still be
          capped at a PSA 8 or 9 purely because the border is off-centre. Because grade jumps — for example
          from a PSA 9 to a PSA 10 — can multiply a card’s market value, screening centering first helps you
          decide which cards are worth submitting and which are better left raw.
        </p>
        <p className={styles.contentP}>
          Once you’ve confirmed a card is well centred and worth grading, protect it on its way to and from
          the grader with a premium {' '}
          <Link href="/products/psa-protectors/" className={styles.contentLink}>PSA card aluminum protector</Link>{' '}
          , or explore our {' '}
          <Link href="/business/card-trading/" className={styles.contentLink}>graded card trading &amp; brokerage</Link>{' '}
          service.
        </p>
      </section>

      <section className={styles.contentSection} aria-labelledby="centering-faq">
        <h2 id="centering-faq" className={styles.contentH2}>Card centering — frequently asked questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}</summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
