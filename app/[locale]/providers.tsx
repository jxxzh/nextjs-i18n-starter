// In Next.js, this file would be called: app/providers.tsx
'use client'

import { createFirebaseApp } from '@/lib/analytics'
import logger from '@/lib/logger'
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect } from 'react'
// 导入本地化语言
import 'dayjs/locale/en'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  }
  else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient)
      browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({
  locale,
  children,
}: { locale: string, children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  useEffect(() => {
    // 客户端动态设置dayjs的时区和国际化语言
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.locale(locale)
    const userTz = dayjs.tz.guess()
    dayjs.tz.setDefault(userTz)
    logger.info({
      msg: 'dayjs locale set to user timezone',
      locale,
      userTz,
    })

    // 初始化firebase
    createFirebaseApp()
  }, [locale])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
