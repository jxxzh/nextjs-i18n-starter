'use client'

import useMediaQuery from '@/hooks/use-media-query'
import logger from '@/lib/logger'
import { notFound } from 'next/navigation'
import TestClient from './test-client'

export default function Test() {
  logger.info('Test')
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const query = useMediaQuery('(min-width: 640px)')

  return (
    <div>
      <TestClient />
      <p>
        query:
        {query ? 'yes' : 'no'}
      </p>
    </div>
  )
}
