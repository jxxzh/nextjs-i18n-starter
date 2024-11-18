'use client'

import logger from '@/lib/logger'
import { useEffect } from 'react'

export default function TestClient() {
  useEffect(() => {
    logger.info('TestClient')
  })
  return (
    <div>TestClient</div>
  )
}
