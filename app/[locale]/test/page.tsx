'use client'

import useMediaQuery from '@/hooks/use-media-query'
import { notFound } from 'next/navigation'

export default function Test() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const query = useMediaQuery('(min-width: 640px)')

  return (
    <div>
      <p>
        query:
        {query ? 'yes' : 'no'}
      </p>
    </div>
  )
}
