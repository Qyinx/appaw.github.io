import type { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { webApplicationJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import { centeringMetadata } from '@/lib/seo/metadata'

export const metadata = centeringMetadata

// Page-owned structured data: WebApplication + BreadcrumbList
export default function CenteringLayout({ children }: { children: React.ReactNode }) {
  const webApp = webApplicationJsonLd({
    name: 'Card Centering Analyzer',
    description: 'Upload a card photo for instant centering grade and exportable report. Useful for grading preparation.',
    url: 'https://appaw.store/tools/centering/',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'All',
  })

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'Tools', item: 'https://appaw.store/tools/' },
    { position: 3, name: 'Card Centering Analyzer', item: 'https://appaw.store/tools/centering/' },
  ])

  return (
    <>
      <StructuredData data={[webApp, breadcrumb]} />
      {children}
    </>
  )
}
