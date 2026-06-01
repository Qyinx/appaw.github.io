import type { Metadata } from 'next';
import CardCenteringClient from './CardCenteringClient';
import CenteringContent from './CenteringContent';
import StructuredData from '@/components/StructuredData';
import { centeringMetadata } from '@/lib/seo/metadata';
import {
  webApplicationJsonLd,
  breadcrumbJsonLd,
  howToJsonLd,
  faqJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = centeringMetadata;

const PAGE_URL = 'https://appaw.store/tools/card-centering/';

const webApp = webApplicationJsonLd({
  name: 'Card Centering Calculator & PSA 10 Analyzer',
  description:
    'Free browser tool that measures trading card centering. Upload a card, align the guides, and get instant left/right and top/bottom margin percentages against PSA, BGS and SGC standards.',
  url: PAGE_URL,
  applicationCategory: 'UtilitiesApplication',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Card Centering Calculator', item: PAGE_URL },
]);

const howTo = howToJsonLd({
  name: 'How to check card centering with the Appaw Centering Analyzer',
  description:
    'Measure the centering of any trading card and estimate its PSA grade in four steps.',
  totalTime: 'PT2M',
  tool: [{ '@type': 'HowToTool', name: 'A photo or scan of your trading card' }],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload a clear photo',
      text: 'Upload a straight-on photo or scan of your card taken on a dark, flat background with even lighting.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Align the outer guides to the card edge',
      text: 'Drag the blue guide lines so they sit exactly on the outer cut edge of the card.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Align the inner guides to the art border',
      text: 'Drag the pink guide lines so they sit on the inner border of the printed artwork on all four sides.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Read your centering percentage',
      text: 'The tool instantly calculates left/right and top/bottom margin ratios and shows the estimated PSA grade zone.',
    },
  ],
});

const faq = faqJsonLd([
  {
    q: 'What centering is required for a PSA 10?',
    a: 'PSA requires roughly 55/45 centering or better on the front and 75/25 or better on the back for a PSA 10 Gem Mint grade. A PSA 9 allows up to 60/40 on the front, and a PSA 8 up to 65/35.',
  },
  {
    q: 'How accurate is the Appaw centering analyzer?',
    a: 'Accuracy depends on your photo. A straight-on, distortion-free scan with the guides aligned precisely to the card edge and art border gives results within a percent or two of a grader\u2019s measurement. Angled phone photos reduce accuracy.',
  },
  {
    q: 'How do I take the best photo for measuring centering?',
    a: 'Place the card flat on a dark background, shoot directly from above with even lighting, and keep the camera parallel to the card to avoid keystone distortion. A flatbed scan is ideal.',
  },
  {
    q: 'Does this tool work for Pokémon, sports, and other TCG cards?',
    a: 'Yes. The analyzer works for any rectangular trading card including Pokémon, Magic: The Gathering, One Piece, sports cards and more, because it measures the printed border relative to the card edge.',
  },
  {
    q: 'Is the card centering calculator free?',
    a: 'Yes, the Appaw Store card centering calculator is completely free to use in your browser. No sign-up or upload to a server is required \u2014 measurement happens on your device.',
  },
]);

export default function Page() {
  return (
    <>
      <StructuredData data={[webApp, breadcrumb, howTo, faq]} />
      <CardCenteringClient />
      <CenteringContent />
    </>
  );
}
