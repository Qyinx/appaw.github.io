import React from 'react'

// Server component: renders one or more JSON-LD script tags
export default function StructuredData({ data }: { data: any | any[] }) {
  const list = Array.isArray(data) ? data : [data]
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  )
}
